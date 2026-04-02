# Tools -- Danish Energy Regulation MCP

6 tools for searching and retrieving Danish energy sector regulations.

All data is in Danish. Tool descriptions and parameter names are in English.

---

## 1. dk_energy_search_regulations

Full-text search across Danish energy regulations from Energistyrelsen, Forsyningstilsynet, and Sikkerhedsstyrelsen. Returns bekendtgorelser (executive orders), vejledninger (guidance), retningslinjer (guidelines), cirkulaerer (circulars), and safety rules.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query in Danish or English (e.g., `elforsyning`, `vedvarende energi`, `starkstrom`, `tarif`) |
| `regulator` | string | No | Filter by regulator: `energistyrelsen`, `forsyningstilsynet`, `sikkerhedsstyrelsen` |
| `type` | string | No | Filter by regulation type: `bekendtgorelse`, `vejledning`, `retningslinje`, `cirkulaere`, `safety_rule` |
| `status` | string | No | Filter by status: `in_force`, `repealed`, `draft`. Defaults to all. |
| `limit` | number | No | Maximum results (default 20, max 100) |

**Returns:** Array of matching regulations with reference, title, text, type, status, effective date, and URL.

**Example:**

```json
{
  "query": "vedvarende energi",
  "regulator": "energistyrelsen",
  "status": "in_force"
}
```

**Data sources:** Energistyrelsen (ens.dk), Forsyningstilsynet (forsyningstilsynet.dk), Sikkerhedsstyrelsen (sik.dk) via retsinformation.dk.

**Limitations:** Seed dataset with 21 regulations. Summaries, not full legal text. Danish-language content only.

---

## 2. dk_energy_get_regulation

Get a specific Danish energy regulation by its official reference string. Returns the full record including text, metadata, and URL.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `reference` | string | Yes | Regulation reference (e.g., `BEK nr 1310 af 24/11/2023`) |

**Returns:** Single regulation record with all fields, or an error if not found.

**Example:**

```json
{
  "reference": "BEK nr 1310 af 24/11/2023"
}
```

**Data sources:** retsinformation.dk, ens.dk, sik.dk.

**Limitations:** Exact match on reference string. Partial matches are not supported -- use `dk_energy_search_regulations` for fuzzy search.

---

## 3. dk_energy_search_grid_codes

Search Energinet technical regulations (grid codes), market regulations, grid connection requirements, balancing rules, and ancillary services specifications. Covers electricity, gas, and district heating grid rules.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query (e.g., `tilslutning`, `balancering`, `systemydelser`, `elnet`, `vindmolle`) |
| `code_type` | string | No | Filter by code type: `technical_regulation`, `market_regulation`, `grid_connection`, `balancing`, `ancillary_services` |
| `limit` | number | No | Maximum results (default 20, max 100) |

**Returns:** Array of matching grid code documents with reference, title, text, code type, version, effective date, and URL.

**Example:**

```json
{
  "query": "vindmolle tilslutning",
  "code_type": "technical_regulation"
}
```

**Data sources:** Energinet (energinet.dk/regler/).

**Limitations:** Seed dataset with 12 grid codes. Summaries of technical regulations, not the full PDF documents. Danish-language content only.

---

## 4. dk_energy_get_grid_code

Get a specific Energinet grid code document by its database ID. The ID is returned in search results from `dk_energy_search_grid_codes`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `document_id` | number | Yes | Grid code document ID (from search results) |

**Returns:** Single grid code record with all fields, or an error if not found.

**Example:**

```json
{
  "document_id": 2
}
```

**Data sources:** Energinet (energinet.dk/regler/).

**Limitations:** Requires a valid database ID. Use `dk_energy_search_grid_codes` to find IDs.

---

## 5. dk_energy_search_decisions

Search Forsyningstilsynet regulatory decisions: tariff approvals, revenue cap determinations, methodology approvals, benchmarking reports, complaint rulings, and market monitoring decisions for Danish energy utilities.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query (e.g., `tarif`, `indtagtsramme`, `elpris`, `fjernvarme`, `benchmark`) |
| `decision_type` | string | No | Filter by decision type: `tariff`, `revenue_cap`, `methodology`, `benchmark`, `complaint`, `market_monitoring` |
| `limit` | number | No | Maximum results (default 20, max 100) |

**Returns:** Array of matching decisions with reference, title, text, decision type, date decided, parties, and URL.

**Example:**

```json
{
  "query": "fjernvarme tarif",
  "decision_type": "tariff"
}
```

**Data sources:** Forsyningstilsynet (forsyningstilsynet.dk).

**Limitations:** Seed dataset with 12 decisions. Summaries of decisions, not full legal text. Danish-language content only.

---

## 6. dk_energy_about

Return metadata about this MCP server: version, list of regulators covered, tool list, and data coverage summary. Takes no parameters.

**Parameters:** None.

**Returns:** Server name, version, description, list of regulators (id, name, URL), and tool list (name, description).

**Example:**

```json
{}
```

**Data sources:** N/A (server metadata).

**Limitations:** None.
