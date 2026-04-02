# Coverage -- Danish Energy Regulation MCP

Current coverage of Danish energy sector regulatory data.

**Last updated:** 2026-03-30

---

## Sources

| Source | Authority | Records | Content |
|--------|-----------|---------|---------|
| **Energistyrelsen** | Danish Energy Agency | 14 regulations | Bekendtgorelser and vejledninger on NIS 2 energy sector cybersecurity, beredskab (emergency preparedness), renewable energy grid connection, energy efficiency, and guarantees of origin |
| **Sikkerhedsstyrelsen** | Safety Technology Authority | 7 regulations | Electrical installation safety (staerkstromsbekendtgorelsen), gas installation safety, product safety rules |
| **Energinet** | Danish TSO | 12 grid codes | Technical regulations (TF 3.2.x series for generation, TF 3.3.x for consumption), market regulations (MR series), balancing rules, ancillary services, gas market rules |
| **Forsyningstilsynet** | Danish Utility Regulator | 12 decisions | Revenue cap determinations, tariff approvals, methodology approvals, benchmarking reports, complaint rulings |
| **Total** | | **45 records** | ~164 KB SQLite database |

---

## Regulation Types

| Type | Danish Term | Count | Regulators |
|------|-------------|-------|------------|
| `bekendtgorelse` | Bekendtgorelse (Executive Order) | 10 | Energistyrelsen, Sikkerhedsstyrelsen |
| `vejledning` | Vejledning (Guidance) | 5 | Energistyrelsen |
| `retningslinje` | Retningslinje (Guideline) | 3 | Energistyrelsen |
| `cirkulaere` | Cirkulaere (Circular) | 1 | Energistyrelsen |
| `safety_rule` | Sikkerhedsforskrift (Safety Rule) | 2 | Sikkerhedsstyrelsen |

## Grid Code Types

| Type | Description | Count |
|------|-------------|-------|
| `technical_regulation` | Technical regulations (TF series) for generation and consumption plant requirements | 4 |
| `market_regulation` | Market rules (Forskrift series) for electricity and gas trading | 2 |
| `grid_connection` | Grid connection requirements for transmission and distribution | 2 |
| `balancing` | Balancing market rules and obligations | 2 |
| `ancillary_services` | System services (FCR, aFRR, mFRR, voltage support, black start) | 2 |

## Decision Types

| Type | Description | Count |
|------|-------------|-------|
| `revenue_cap` | Revenue cap (indtagtsramme) determinations for network operators | 3 |
| `tariff` | Tariff approvals for district heating, electricity, and gas | 3 |
| `methodology` | Methodology approvals for tariff calculation and cost allocation | 2 |
| `benchmark` | Benchmarking of utility efficiency and performance | 2 |
| `complaint` | Consumer and industry complaint rulings | 1 |
| `market_monitoring` | Market monitoring and surveillance reports | 1 |

---

## What Is NOT Included

This is a seed dataset. The following are not yet covered:

- **Full text of original documents** -- records contain summaries, not complete legal text from retsinformation.dk
- **Energiaftaler** -- political energy agreements (Energiaftale 2024, etc.) are not included
- **Energiklagenaevnet** -- Energy Board of Appeal decisions are not included
- **Historical and repealed regulations** -- only current in-force regulations are covered (limited repealed entries)
- **EU energy directives** -- EU Electricity Directive, Gas Directive, Renewable Energy Directive, etc. are covered by the [EU Regulations MCP](https://github.com/Ansvar-Systems/EU_compliance_MCP), not this server
- **Danish parliamentary proceedings** -- Folketinget debates on energy legislation are not included
- **Municipal energy plans** -- Local authority energy and climate plans are not covered
- **Sector-specific tariff schedules** -- Individual utility tariff sheets are not included (only Forsyningstilsynet approval decisions)

---

## Limitations

- **Seed dataset** -- approximately 45 records. Full coverage is planned.
- **Danish text only** -- all regulatory content is in Danish. English search queries may return limited results.
- **Summaries, not full legal text** -- records contain representative summaries, not the complete official text from retsinformation.dk or regulator websites.
- **Quarterly manual refresh** -- data is updated manually. Recent regulatory changes may not be reflected.
- **No real-time tracking** -- amendments and repeals are not tracked automatically.

---

## Planned Improvements

Full automated ingestion is planned from:

- **retsinformation.dk** -- official Danish legal information system (bekendtgorelser, love, vejledninger)
- **ens.dk** -- Energistyrelsen publications, guidance, and administrative decisions
- **energinet.dk** -- grid codes, technical regulations, market rules, system operator publications
- **forsyningstilsynet.dk** -- regulatory decisions, methodology documents, benchmarking reports
- **sik.dk** -- Sikkerhedsstyrelsen safety regulations, inspection reports, product approvals

---

## Language

All content is in Danish. The following search terms are useful starting points:

| Danish Term | English Equivalent |
|-------------|-------------------|
| elforsyning | electricity supply |
| vedvarende energi | renewable energy |
| energieffektivitet | energy efficiency |
| tilslutning | grid connection |
| balancering | balancing |
| systemydelser | ancillary services |
| tarif | tariff |
| indtagtsramme | revenue cap |
| fjernvarme | district heating |
| gasinstallation | gas installation |
| staerkstrom | high voltage / strong current |
| beredskab | emergency preparedness |
| vindmolle | wind turbine |
| solcelle | solar cell / PV |
