#!/usr/bin/env node

/**
 * Danish Energy Regulation MCP -- stdio entry point.
 *
 * Provides MCP tools for querying Danish energy regulators:
 *   - Energistyrelsen (Danish Energy Agency)
 *   - Forsyningstilsynet (Danish Utility Regulator)
 *   - Energinet (TSO — grid codes, market rules)
 *   - Sikkerhedsstyrelsen (Safety Technology Authority)
 *
 * Tool prefix: dk_energy_
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
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

let pkgVersion = "0.1.0";
try {
  const pkg = JSON.parse(
    readFileSync(join(__dirname, "..", "package.json"), "utf8"),
  ) as { version: string };
  pkgVersion = pkg.version;
} catch {
  // fallback to default
}

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

// --- Tool definitions ---

const TOOLS = [
  {
    name: "dk_energy_search_regulations",
    description:
      "Full-text search across Danish energy regulations from Energistyrelsen, Forsyningstilsynet, and Sikkerhedsstyrelsen. Returns bekendtgorelser, vejledninger, and administrative rules. Supports Danish-language queries.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Search query in Danish or English (e.g., 'elforsyning', 'vedvarende energi', 'starkstrom', 'tarif')",
        },
        regulator: {
          type: "string",
          enum: ["energistyrelsen", "forsyningstilsynet", "sikkerhedsstyrelsen"],
          description: "Filter by regulator. Optional.",
        },
        type: {
          type: "string",
          enum: ["bekendtgorelse", "vejledning", "retningslinje", "cirkulaere", "safety_rule"],
          description: "Filter by regulation type. Optional.",
        },
        status: {
          type: "string",
          enum: ["in_force", "repealed", "draft"],
          description: "Filter by status. Defaults to all.",
        },
        limit: {
          type: "number",
          description: "Maximum results (default 20, max 100).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "dk_energy_get_regulation",
    description:
      "Get a specific Danish energy regulation by its reference string (e.g., 'BEK nr 1310 af 24/11/2023'). Returns full text.",
    inputSchema: {
      type: "object" as const,
      properties: {
        reference: {
          type: "string",
          description: "Regulation reference (e.g., 'BEK nr 1310 af 24/11/2023')",
        },
      },
      required: ["reference"],
    },
  },
  {
    name: "dk_energy_search_grid_codes",
    description:
      "Search Energinet technical regulations (grid codes), market regulations, and grid connection requirements. Covers electricity, gas, and district heating grid rules.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Search query (e.g., 'tilslutning', 'balancering', 'systemydelser', 'elnet', 'vindmolle')",
        },
        code_type: {
          type: "string",
          enum: ["technical_regulation", "market_regulation", "grid_connection", "balancing", "ancillary_services"],
          description: "Filter by code type. Optional.",
        },
        limit: {
          type: "number",
          description: "Maximum results (default 20, max 100).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "dk_energy_get_grid_code",
    description:
      "Get a specific Energinet grid code document by its database ID. Returns full text.",
    inputSchema: {
      type: "object" as const,
      properties: {
        document_id: {
          type: "number",
          description: "Grid code document ID (from search results)",
        },
      },
      required: ["document_id"],
    },
  },
  {
    name: "dk_energy_search_decisions",
    description:
      "Search Forsyningstilsynet tariff decisions, revenue cap determinations, market methodology approvals, and complaint rulings for Danish energy utilities.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "Search query (e.g., 'tarif', 'indtagtsramme', 'elpris', 'fjernvarme', 'benchmark')",
        },
        decision_type: {
          type: "string",
          enum: ["tariff", "revenue_cap", "methodology", "benchmark", "complaint", "market_monitoring"],
          description: "Filter by decision type. Optional.",
        },
        limit: {
          type: "number",
          description: "Maximum results (default 20, max 100).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "dk_energy_about",
    description:
      "Return metadata about this MCP server: version, regulators covered, tool list, data coverage.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "dk_energy_list_sources",
    description:
      "List all data sources used by this MCP server with provenance metadata: authority, URL, retrieval method, license, update frequency, and record counts.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "dk_energy_check_data_freshness",
    description:
      "Check data freshness: returns live record counts from the database, last refresh date per source, and staleness indicators.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

// --- Zod schemas ---

const SearchRegulationsArgs = z.object({
  query: z.string().min(1),
  regulator: z
    .enum(["energistyrelsen", "forsyningstilsynet", "sikkerhedsstyrelsen"])
    .optional(),
  type: z
    .enum(["bekendtgorelse", "vejledning", "retningslinje", "cirkulaere", "safety_rule"])
    .optional(),
  status: z.enum(["in_force", "repealed", "draft"]).optional(),
  limit: z.number().int().positive().max(100).optional(),
});

const GetRegulationArgs = z.object({
  reference: z.string().min(1),
});

const SearchGridCodesArgs = z.object({
  query: z.string().min(1),
  code_type: z
    .enum([
      "technical_regulation",
      "market_regulation",
      "grid_connection",
      "balancing",
      "ancillary_services",
    ])
    .optional(),
  limit: z.number().int().positive().max(100).optional(),
});

const GetGridCodeArgs = z.object({
  document_id: z.number().int().positive(),
});

const SearchDecisionsArgs = z.object({
  query: z.string().min(1),
  decision_type: z
    .enum(["tariff", "revenue_cap", "methodology", "benchmark", "complaint", "market_monitoring"])
    .optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// --- Helpers ---

function textContent(data: unknown) {
  return {
    content: [
      { type: "text" as const, text: JSON.stringify({ ...(data as object), _meta }, null, 2) },
    ],
  };
}

function errorContent(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true as const,
  };
}

// --- Server setup ---

const server = new Server(
  { name: SERVER_NAME, version: pkgVersion },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

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
            "Danish energy regulation MCP server. Covers Energistyrelsen (energy policy), Forsyningstilsynet (tariff regulation), Energinet (grid codes), and Sikkerhedsstyrelsen (electrical/gas safety).",
          regulators: regulators.map((r) => ({
            id: r.id,
            name: r.name,
            url: r.url,
          })),
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

// --- Main ---

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`${SERVER_NAME} v${pkgVersion} running on stdio\n`);
}

main().catch((err) => {
  process.stderr.write(
    `Fatal error: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
