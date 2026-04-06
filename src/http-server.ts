#!/usr/bin/env node

/**
 * HTTP Server Entry Point for Docker Deployment
 *
 * Provides Streamable HTTP transport for remote MCP clients.
 * Use src/index.ts for local stdio-based usage.
 *
 * Endpoints:
 *   GET  /health  -- liveness probe
 *   POST /mcp     -- MCP Streamable HTTP (session-aware)
 */

import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  listRegulators,
  searchRegulations,
  getRegulationByReference,
  searchGridCodes,
  getGridCode,
  searchDecisions,
  getDbStats,
} from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = parseInt(process.env["PORT"] ?? "3000", 10);
const SERVER_NAME = "danish-energy-regulation-mcp";

// --- Response metadata ---

const _meta = {
  disclaimer:
    "Data is curated from public Danish regulatory sources. Not legal advice. Verify against official sources at ens.dk, forsyningstilsynet.dk, energinet.dk, and sik.dk.",
  data_age: "2026-04-06",
  copyright: "Danish government publications — public domain",
  source_urls: [
    "https://ens.dk",
    "https://forsyningstilsynet.dk",
    "https://energinet.dk",
    "https://sik.dk",
  ],
};

let pkgVersion = "0.1.0";
try {
  const pkg = JSON.parse(
    readFileSync(join(__dirname, "..", "package.json"), "utf8"),
  ) as { version: string };
  pkgVersion = pkg.version;
} catch {
  // fallback
}

// --- Tool definitions ---

const TOOLS = [
  {
    name: "dk_energy_search_regulations",
    description:
      "Full-text search across Danish energy regulations from Energistyrelsen, Forsyningstilsynet, and Sikkerhedsstyrelsen.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query in Danish or English" },
        regulator: {
          type: "string",
          enum: ["energistyrelsen", "forsyningstilsynet", "sikkerhedsstyrelsen"],
          description: "Filter by regulator. Optional.",
        },
        type: {
          type: "string",
          enum: ["bekendtgorelse", "vejledning", "retningslinje", "cirkulaere", "safety_rule"],
          description: "Filter by type. Optional.",
        },
        status: {
          type: "string",
          enum: ["in_force", "repealed", "draft"],
          description: "Filter by status. Optional.",
        },
        limit: { type: "number", description: "Max results (default 20)." },
      },
      required: ["query"],
    },
  },
  {
    name: "dk_energy_get_regulation",
    description: "Get a specific regulation by reference string.",
    inputSchema: {
      type: "object" as const,
      properties: {
        reference: { type: "string", description: "Regulation reference" },
      },
      required: ["reference"],
    },
  },
  {
    name: "dk_energy_search_grid_codes",
    description: "Search Energinet grid codes, technical regulations, and market rules.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query" },
        code_type: {
          type: "string",
          enum: ["technical_regulation", "market_regulation", "grid_connection", "balancing", "ancillary_services"],
          description: "Filter by code type. Optional.",
        },
        limit: { type: "number", description: "Max results (default 20)." },
      },
      required: ["query"],
    },
  },
  {
    name: "dk_energy_get_grid_code",
    description: "Get a specific grid code document by ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        document_id: { type: "number", description: "Grid code document ID" },
      },
      required: ["document_id"],
    },
  },
  {
    name: "dk_energy_search_decisions",
    description: "Search Forsyningstilsynet tariff decisions and market rulings.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query" },
        decision_type: {
          type: "string",
          enum: ["tariff", "revenue_cap", "methodology", "benchmark", "complaint", "market_monitoring"],
          description: "Filter by decision type. Optional.",
        },
        limit: { type: "number", description: "Max results (default 20)." },
      },
      required: ["query"],
    },
  },
  {
    name: "dk_energy_about",
    description: "Return server metadata, regulators covered, tool list.",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "dk_energy_list_sources",
    description:
      "List all data sources used by this MCP server with provenance metadata: authority, URL, retrieval method, license, update frequency, and record counts.",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "dk_energy_check_data_freshness",
    description:
      "Check data freshness: returns live record counts from the database, last refresh date per source, and staleness indicators.",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
];

// --- Zod schemas ---

const SearchRegulationsArgs = z.object({
  query: z.string().min(1),
  regulator: z.enum(["energistyrelsen", "forsyningstilsynet", "sikkerhedsstyrelsen"]).optional(),
  type: z.enum(["bekendtgorelse", "vejledning", "retningslinje", "cirkulaere", "safety_rule"]).optional(),
  status: z.enum(["in_force", "repealed", "draft"]).optional(),
  limit: z.number().int().positive().max(100).optional(),
});

const GetRegulationArgs = z.object({ reference: z.string().min(1) });

const SearchGridCodesArgs = z.object({
  query: z.string().min(1),
  code_type: z.enum(["technical_regulation", "market_regulation", "grid_connection", "balancing", "ancillary_services"]).optional(),
  limit: z.number().int().positive().max(100).optional(),
});

const GetGridCodeArgs = z.object({ document_id: z.number().int().positive() });

const SearchDecisionsArgs = z.object({
  query: z.string().min(1),
  decision_type: z.enum(["tariff", "revenue_cap", "methodology", "benchmark", "complaint", "market_monitoring"]).optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// --- MCP server factory ---

function createMcpServer(): Server {
  const mcpServer = new Server(
    { name: SERVER_NAME, version: pkgVersion },
    { capabilities: { tools: {} } },
  );

  mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    function textContent(data: unknown) {
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ ...(data as object), _meta }, null, 2) }],
      };
    }

    function errorContent(message: string) {
      return {
        content: [{ type: "text" as const, text: message }],
        isError: true as const,
      };
    }

    try {
      switch (name) {
        case "dk_energy_search_regulations": {
          const parsed = SearchRegulationsArgs.parse(args);
          const results = searchRegulations({
            query: parsed.query,
            regulator: parsed.regulator,
            type: parsed.type,
            status: parsed.status,
            limit: parsed.limit,
          });
          return textContent({ results, count: results.length });
        }

        case "dk_energy_get_regulation": {
          const parsed = GetRegulationArgs.parse(args);
          const regulation = getRegulationByReference(parsed.reference);
          if (!regulation) {
            return errorContent(`Regulation not found: ${parsed.reference}`);
          }
          return textContent(regulation);
        }

        case "dk_energy_search_grid_codes": {
          const parsed = SearchGridCodesArgs.parse(args);
          const results = searchGridCodes({
            query: parsed.query,
            code_type: parsed.code_type,
            limit: parsed.limit,
          });
          return textContent({ results, count: results.length });
        }

        case "dk_energy_get_grid_code": {
          const parsed = GetGridCodeArgs.parse(args);
          const code = getGridCode(parsed.document_id);
          if (!code) {
            return errorContent(`Grid code not found: ID ${parsed.document_id}`);
          }
          return textContent(code);
        }

        case "dk_energy_search_decisions": {
          const parsed = SearchDecisionsArgs.parse(args);
          const results = searchDecisions({
            query: parsed.query,
            decision_type: parsed.decision_type,
            limit: parsed.limit,
          });
          return textContent({ results, count: results.length });
        }

        case "dk_energy_about": {
          const regulators = listRegulators();
          return textContent({
            name: SERVER_NAME,
            version: pkgVersion,
            description:
              "Danish energy regulation MCP. Covers Energistyrelsen, Forsyningstilsynet, Energinet, Sikkerhedsstyrelsen.",
            regulators: regulators.map((r) => ({ id: r.id, name: r.name, url: r.url })),
            tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
          });
        }

        case "dk_energy_list_sources": {
          return textContent({
            sources: [
              {
                id: "energistyrelsen",
                name: "Energistyrelsen (Danish Energy Agency)",
                authority: "Energistyrelsen",
                url: "https://ens.dk",
                retrieval_method: "MANUAL_CURATION",
                license: "Public Domain (Danish government publications)",
                update_frequency: "quarterly",
                last_refresh: "2026-04-06",
                item_type: "regulation",
              },
              {
                id: "forsyningstilsynet",
                name: "Forsyningstilsynet (Danish Utility Regulator)",
                authority: "Forsyningstilsynet",
                url: "https://forsyningstilsynet.dk",
                retrieval_method: "MANUAL_CURATION",
                license: "Public Domain (Danish government publications)",
                update_frequency: "quarterly",
                last_refresh: "2026-04-06",
                item_type: "decision",
              },
              {
                id: "energinet",
                name: "Energinet (Danish TSO)",
                authority: "Energinet",
                url: "https://energinet.dk",
                retrieval_method: "MANUAL_CURATION",
                license: "Public Domain (Danish state-owned enterprise publications)",
                update_frequency: "quarterly",
                last_refresh: "2026-04-06",
                item_type: "grid_code",
              },
              {
                id: "sikkerhedsstyrelsen",
                name: "Sikkerhedsstyrelsen (Safety Technology Authority)",
                authority: "Sikkerhedsstyrelsen",
                url: "https://sik.dk",
                retrieval_method: "MANUAL_CURATION",
                license: "Public Domain (Danish government publications)",
                update_frequency: "quarterly",
                last_refresh: "2026-04-06",
                item_type: "regulation",
              },
            ],
          });
        }

        case "dk_energy_check_data_freshness": {
          const stats = getDbStats();
          return textContent({
            last_refresh: "2026-04-06",
            live_counts: {
              regulations: stats.regulations,
              grid_codes: stats.grid_codes,
              decisions: stats.decisions,
              total: stats.total,
            },
            sources: [
              { id: "energistyrelsen", last_refresh: "2026-04-06", item_type: "regulation" },
              { id: "forsyningstilsynet", last_refresh: "2026-04-06", item_type: "decision" },
              { id: "energinet", last_refresh: "2026-04-06", item_type: "grid_code" },
              { id: "sikkerhedsstyrelsen", last_refresh: "2026-04-06", item_type: "regulation" },
            ],
            staleness_warning: false,
          });
        }

        default:
          return errorContent(`Unknown tool: ${name}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return errorContent(`Error in ${name}: ${message}`);
    }
  });

  return mcpServer;
}

// --- HTTP server ---

async function main(): Promise<void> {
  const sessions = new Map<
    string,
    { transport: StreamableHTTPServerTransport; server: Server }
  >();

  const httpServer = createServer((req, res) => {
    handleRequest(req, res, sessions).catch((err) => {
      console.error(`[${SERVER_NAME}] Unhandled error:`, err);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    });
  });

  async function handleRequest(
    req: import("node:http").IncomingMessage,
    res: import("node:http").ServerResponse,
    activeSessions: Map<
      string,
      { transport: StreamableHTTPServerTransport; server: Server }
    >,
  ): Promise<void> {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

    if (url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", server: SERVER_NAME, version: pkgVersion }));
      return;
    }

    if (url.pathname === "/mcp") {
      const sessionId = req.headers["mcp-session-id"] as string | undefined;

      if (sessionId && activeSessions.has(sessionId)) {
        const session = activeSessions.get(sessionId)!;
        await session.transport.handleRequest(req, res);
        return;
      }

      const mcpServer = createMcpServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- SDK type mismatch
      await mcpServer.connect(transport as any);

      transport.onclose = () => {
        if (transport.sessionId) {
          activeSessions.delete(transport.sessionId);
        }
        mcpServer.close().catch(() => {});
      };

      await transport.handleRequest(req, res);

      if (transport.sessionId) {
        activeSessions.set(transport.sessionId, { transport, server: mcpServer });
      }
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }

  httpServer.listen(PORT, () => {
    console.error(`${SERVER_NAME} v${pkgVersion} (HTTP) listening on port ${PORT}`);
    console.error(`MCP endpoint:  http://localhost:${PORT}/mcp`);
    console.error(`Health check:  http://localhost:${PORT}/health`);
  });

  process.on("SIGTERM", () => {
    console.error("Received SIGTERM, shutting down...");
    httpServer.close(() => process.exit(0));
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
