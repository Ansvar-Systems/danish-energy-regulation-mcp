# Danish Energy Regulation MCP

<!-- ANSVAR-CTA-BEGIN -->
> ### ▶ Try this MCP instantly via Ansvar Gateway
> **50 free queries/day · no card required · OAuth signup at [ansvar.eu/gateway](https://ansvar.eu/gateway)**
>
> One endpoint, one OAuth signup, access from any MCP-compatible client.

### Connect

**Claude Code** (one line):

```bash
claude mcp add ansvar --transport http https://gateway.ansvar.eu/mcp
```

**Claude Desktop / Cursor** — add to `claude_desktop_config.json` (or `mcp.json`):

```json
{
  "mcpServers": {
    "ansvar": {
      "type": "url",
      "url": "https://gateway.ansvar.eu/mcp"
    }
  }
}
```

**Claude.ai** — Settings → Connectors → Add custom connector → paste `https://gateway.ansvar.eu/mcp`

First request opens an OAuth flow at [ansvar.eu/gateway](https://ansvar.eu/gateway). After signup, your client is bound to your account; tier (free / premium / team / company) determines fan-out, quota, and which downstream MCPs are reachable.

---

## Self-host this MCP

You can also clone this repo and build the corpus yourself. The schema,
fetcher, and tool implementations all live here. What is not in the repo is
the pre-built database — TDM and standards-licensing constraints on the
upstream sources mean we host the corpus on Ansvar infrastructure rather
than redistribute it as a public artifact.

Build your own: run this repo's ingestion script (entry-point varies per
repo — typically `scripts/ingest.sh`, `npm run ingest`, or `make ingest`;
check the repo root).
<!-- ANSVAR-CTA-END -->


MCP server for Danish energy sector regulations -- Energistyrelsen policies, Forsyningstilsynet tariff decisions, Energinet grid codes, Sikkerhedsstyrelsen safety rules.

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Covers four Danish energy regulators with full-text search across regulations, grid codes, and regulatory decisions. All data is in Danish.

Built by [Ansvar Systems](https://ansvar.eu) -- Stockholm, Sweden

---

## Regulators Covered

| Regulator | Role | Website |
|-----------|------|---------|
| **Energistyrelsen** (Danish Energy Agency) | Energy policy, licensing, renewable energy, energy efficiency, climate reporting | [ens.dk](https://ens.dk) |
| **Forsyningstilsynet** (Danish Utility Regulator) | Tariff regulation, revenue caps, market monitoring, benchmarking, consumer protection | [forsyningstilsynet.dk](https://forsyningstilsynet.dk) |
| **Energinet** (Danish TSO) | Electricity and gas transmission, grid codes, technical regulations, market rules, balancing | [energinet.dk](https://energinet.dk) |
| **Sikkerhedsstyrelsen** (Safety Technology Authority) | Electrical installation safety, gas safety, product safety, inspection and certification | [sik.dk](https://sik.dk) |

---

## Tools

| Tool | Description |
|------|-------------|
| `dk_energy_search_regulations` | Full-text search across energy regulations from Energistyrelsen, Forsyningstilsynet, and Sikkerhedsstyrelsen |
| `dk_energy_get_regulation` | Get a specific regulation by reference string (e.g., `BEK nr 1310 af 24/11/2023`) |
| `dk_energy_search_grid_codes` | Search Energinet grid codes, technical regulations, and market rules |
| `dk_energy_get_grid_code` | Get a specific grid code document by database ID |
| `dk_energy_search_decisions` | Search Forsyningstilsynet tariff decisions, revenue caps, and market rulings |
| `dk_energy_about` | Return server metadata: version, regulators, tool list, data coverage |

Full tool documentation: [TOOLS.md](TOOLS.md)

---

## Data Coverage

| Source | Records | Content |
|--------|---------|---------|
| Energistyrelsen | 79 regulations | Bekendtgorelser, vejledninger on energy policy, NIS 2, renewable energy, efficiency |
| Sikkerhedsstyrelsen | 24 regulations | Electrical safety (staerkstromsbekendtgorelsen), gas safety, installation rules |
| Energinet | 36 grid codes | Technical regulations (TF series), market regulations, balancing, ancillary services |
| Forsyningstilsynet | 58 decisions | Tariff decisions, revenue caps, methodology approvals, benchmarking, complaints |
| **Total** | **197 records** | ~500 KB database |

This is a partial dataset. Full automated ingestion from retsinformation.dk, ens.dk, energinet.dk, forsyningstilsynet.dk, and sik.dk is planned.

**Language note:** All regulatory content is in Danish. Search queries work best in Danish (e.g., `elforsyning`, `vedvarende energi`, `tarif`, `tilslutning`).

Full coverage details: [COVERAGE.md](COVERAGE.md)

---

## Data Sources

See [sources.yml](sources.yml) for machine-readable provenance metadata.

---

## Docker

```bash
docker build -t danish-energy-regulation-mcp .
docker run --rm -p 3000:3000 -v /path/to/data:/app/data danish-energy-regulation-mcp
```

Set `DK_ENERGY_DB_PATH` to use a custom database location (default: `data/dk-energy.db`).

---

## Development

```bash
npm install
npm run build
npm run seed         # populate sample data
npm run dev          # HTTP server on port 3000
```

---

## Further Reading

- [TOOLS.md](TOOLS.md) -- full tool documentation with examples
- [COVERAGE.md](COVERAGE.md) -- data coverage and limitations
- [sources.yml](sources.yml) -- data provenance metadata
- [DISCLAIMER.md](DISCLAIMER.md) -- legal disclaimer
- [PRIVACY.md](PRIVACY.md) -- privacy policy
- [SECURITY.md](SECURITY.md) -- vulnerability disclosure
- [CONTRIBUTING.md](CONTRIBUTING.md) -- contribution guidelines
- [CHANGELOG.md](CHANGELOG.md) -- version history

---

## License

Apache-2.0 -- [Ansvar Systems AB](https://ansvar.eu)

See [LICENSE](LICENSE) for the full license text.

See [DISCLAIMER.md](DISCLAIMER.md) for important legal disclaimers about the use of this regulatory data.

---

[ansvar.ai/mcp](https://ansvar.ai/mcp) -- Full MCP server catalog
