#!/usr/bin/env python3
"""
Extract energy-sector documents from the Danish Law MCP database and generate
TypeScript data files for the Danish Energy Regulation MCP.

Reads:  /tmp/danish-law.db  (legal_documents + legal_provisions)
Writes: scripts/data/corpus-regulations.ts

Usage:
    python3 scripts/ingest-from-law-db.py
"""

import os
import re
import sqlite3
import textwrap
from collections import defaultdict
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────────────────

DB_PATH = os.environ.get("DANISH_LAW_DB", "/tmp/danish-law.db")
PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "scripts" / "data"

# Search terms for energy-sector documents (matched case-insensitively in titles)
ENERGY_TERMS = [
    "elforsyning", "energi", "vindmøll", "vindmoell", "solcelle", "vedvarende",
    "varmeforsyning", "gasforsyning", "naturgasforsyning",
    "beredskab", "Energinet", "Energistyrelsen",
    "energiledelse", "energisyn", "energimærk", "energibespar",
    "energieffektiv", "netvirksomhed", "forsyningssikkerhed", "nettilslutning",
    "offshore", "havvind", "biogas", "brint", "geotermi", "fjernvarme",
    "CO2", "kvote", "kraftvarme", "brændsel", "olie",
    "oprindelsesgaranti", "Sikkerhedsstyrel", "elsikkerhed",
    "gasinstallation", "stærkstrøm", "Forsyningstilsyn", "tarif",
    "indtægtsramme", "elinstallat", "gasanlæg", "rørledning",
    "klimasyn", "elmateriel", "autorisation",
    "VE-loven", "energiafgift", "el-afgift", "gasdistribution",
    "varmedistribution", "vindm",
]

# Context terms: broad terms that need a co-occurring energy context word
# to avoid false positives (civil defense beredskab, medical autorisation, etc.)
CONTEXT_REQUIRED_TERMS = {
    "beredskab": [
        "energi", "elsektor", "elsektoren", "naturgassektor", "naturgassektoren",
        "energisektor", "energisektoren", "Energistyrel", "elforsyning",
        "gasforsyning", "varmeforsyning", "olieberedskab",
    ],
    "autorisation": [
        "elinstallat", "gasinstallat", "vvs", "kloakinstallat",
        "stærkstrøm", "elmateriel", "el-", "gas-",
        "el, vvs", "el og gas",
    ],
    "olie": [
        "energi", "mineralolie", "brændsel", "energiafgift", "olieberedskab",
        "varmepumpe", "gasfyr", "skrotning", "oliefyr", "kuldioxidafgift",
    ],
    "offshore": [
        "energi", "vind", "havvind", "elforsyning", "vedvarende",
    ],
    "tarif": [
        "elnet", "gasnet", "varme", "elforsyning", "gasforsyning",
        "Forsyningstilsyn", "Energinet", "distribution",
        "netvirksomhed", "nettarif",
    ],
    "kvote": [
        "CO2", "emission", "drivhusgas", "klimakvote", "kuldioxid", "energi",
    ],
    "rørledning": [
        "gas", "naturgas", "energi", "havledning",
    ],
}

# Explicit exclusion patterns (title substrings that mark non-energy documents)
EXCLUDE_PATTERNS = [
    "beredskabsloven",          # general civil defense
    "sundhedsberedskab",        # health sector
    "veterinær",                # veterinary
    "medicinsk udstyr",         # medical devices
    "psykolog",                 # psychologists
    "tandlæge",                 # dentists
    "lægemiddel",               # pharmaceuticals
    "sundhedsperson",           # health workers
    "Sundhedsstyrelse",         # health authority
    "Banedanmark",              # rail
    "jernbane",                  # railway
    "færdsel",                  # traffic
    "luftfart",                 # aviation
    "politilov",                # police
    "Politivedtægt",            # police bylaw
    "strålebeskyttelse",        # radiation (non-energy)
    "telesektoren",             # telecom
    "postloven",                # postal
    "skibsbrændstof",           # ship fuel (maritime, not energy sector)
    "bunkersolie",              # bunker oil (maritime)
    "forsikring eller anden garanti til dækning",  # maritime liability
    "pvc-folier",               # packaging
    "emballage",                # packaging
    "Kirkevielse",              # church
    "Præstevielse",             # church
    "Bispevielse",              # church
    "Brudevielse",              # church
    "bekæmpelsesmiddel",        # pesticides
    "transportområdet",         # transport sector
    "asbestområdet",            # asbestos
    "Domaineeiendomme",         # domain property
    "sygehusberedskab",         # hospital emergency
    "kerneenergi",              # nuclear energy (not Danish energy sector)
    "Atomenergi",               # atomic energy (EU treaties)
    "Tiltrædelsesloven",        # EU accession treaty
    "EURATOM",                  # atomic energy
    "mineraloliederivater",     # EU treaty protocol (not regulation)
    "værnepligt",               # conscription
    "sygeforsikring",           # health insurance
    "civilforsvar",             # civil defense
    "Civilforsvarsst",          # civil defense authority
    "Forsvarskommando",         # defense command
    "folkeskole",               # school
    "boligstøtte",              # housing
    "husdyr",                   # livestock
    "dyrevelfærd",              # animal welfare
    "fiskeriloven",             # fisheries
    "skatteforvaltning",        # tax administration
    "landbrugsstøtte",          # agricultural support
]

# ─── Regulator classification rules ──────────────────────────────────────────

SIKKERHEDSSTYRELSEN_KEYWORDS = [
    "elsikkerhed", "gasinstallation", "stærkstrøm", "gasanlæg",
    "elmateriel", "elinstallat", "gasmateriel", "gasreglement",
    "Sikkerhedsstyrel", "autoriseret", "autorisation",
    "sikkerhed ved elektriske", "gasreglementet",
]

FORSYNINGSTILSYNET_KEYWORDS = [
    "Forsyningstilsyn", "tarif", "indtægtsramme", "reguleringsregnskab",
    "benchmark", "netvirksomhed", "gasdistribution", "varmedistribution",
    "fakturering",
]

# For Sikkerhedsstyrelsen autorisation — must be in el/gas context
SIK_AUTORISATION_CONTEXT = [
    "el", "gas", "vvs", "installat", "kloak", "stærkstrøm",
]

# ─── Helpers ──────────────────────────────────────────────────────────────────


def parse_doc_id(doc_id: str) -> tuple[int, int]:
    """Split a document ID like '2023:1310' into (year, number)."""
    parts = doc_id.split(":")
    if len(parts) == 2:
        try:
            return int(parts[0]), int(parts[1])
        except ValueError:
            pass
    return 0, 0


def build_url(doc_id: str) -> str:
    """Build retsinformation.dk URL from document_id."""
    year, number = parse_doc_id(doc_id)
    if year > 0 and number > 0:
        return f"https://www.retsinformation.dk/eli/lta/{year}/{number}"
    return ""


def extract_date_from_title(title: str, doc_id: str) -> str:
    """Extract effective date from title or fall back to year from doc_id."""
    # Pattern: "af DD/MM/YYYY" or "af DD. month YYYY"
    m = re.search(r"af\s+(\d{1,2})/(\d{1,2})/(\d{4})", title)
    if m:
        day, month, year = m.group(1), m.group(2), m.group(3)
        return f"{year}-{month.zfill(2)}-{day.zfill(2)}"

    # Pattern: "nr NNN af DD. month YYYY" — Danish month names
    danish_months = {
        "januar": "01", "februar": "02", "marts": "03", "april": "04",
        "maj": "05", "juni": "06", "juli": "07", "august": "08",
        "september": "09", "oktober": "10", "november": "11", "december": "12",
    }
    m = re.search(
        r"af\s+(\d{1,2})\.\s*(januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december)\s+(\d{4})",
        title,
        re.IGNORECASE,
    )
    if m:
        day = m.group(1)
        month = danish_months.get(m.group(2).lower(), "01")
        year = m.group(3)
        return f"{year}-{month}-{day.zfill(2)}"

    # Fall back to year from document_id
    year, _ = parse_doc_id(doc_id)
    if year > 0:
        return f"{year}-01-01"
    return ""


def build_reference(doc_id: str, title: str) -> str:
    """Build a reference string like 'BEK nr 1310 af 24/11/2023' from DB data."""
    year, number = parse_doc_id(doc_id)
    if year == 0:
        return doc_id

    # Determine type prefix from title
    title_lower = title.lower()
    if title_lower.startswith("bekendtgørelse af lov") or title_lower.startswith("lovbekendtgørelse"):
        prefix = "LBK"
    elif title_lower.startswith("bekendtgørelse om") or title_lower.startswith("bekendtgørelse for"):
        prefix = "BEK"
    elif title_lower.startswith("lov om") or title_lower.startswith("lov nr"):
        prefix = "LOV"
    elif "lov om ændring" in title_lower:
        prefix = "LOV"
    elif title_lower.startswith("bekendtgørelse"):
        prefix = "BEK"
    elif title_lower.startswith("anordning"):
        prefix = "ANO"
    elif title_lower.startswith("cirkulære"):
        prefix = "CIR"
    elif title_lower.startswith("vejledning"):
        prefix = "VEJ"
    else:
        prefix = "BEK"

    # Extract date from title for the reference
    date_str = ""
    m = re.search(r"af\s+(\d{1,2})/(\d{1,2})/(\d{4})", title)
    if m:
        date_str = f" af {m.group(1)}/{m.group(2)}/{m.group(3)}"
    else:
        m = re.search(
            r"af\s+(\d{1,2})\.\s*(januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december)\s+(\d{4})",
            title,
            re.IGNORECASE,
        )
        if m:
            danish_months_num = {
                "januar": "01", "februar": "02", "marts": "03", "april": "04",
                "maj": "05", "juni": "06", "juli": "07", "august": "08",
                "september": "09", "oktober": "10", "november": "11", "december": "12",
            }
            month_num = danish_months_num.get(m.group(2).lower(), "01")
            date_str = f" af {m.group(1)}/{month_num}/{m.group(3)}"

    # Always include year for uniqueness (different years can have same number)
    if not date_str:
        # No date found in title — use year from doc_id to avoid collisions
        return f"{prefix} nr {number} ({year})"

    return f"{prefix} nr {number}{date_str}"


def classify_regulator(title: str) -> str:
    """Classify a document to a regulator based on title keywords."""
    title_lower = title.lower()

    # Check Sikkerhedsstyrelsen first (more specific)
    for kw in SIKKERHEDSSTYRELSEN_KEYWORDS:
        kw_lower = kw.lower()
        if kw_lower in title_lower:
            # autorisation needs el/gas context
            if kw_lower in ("autoriseret", "autorisation"):
                if any(ctx.lower() in title_lower for ctx in SIK_AUTORISATION_CONTEXT):
                    return "sikkerhedsstyrelsen"
            else:
                return "sikkerhedsstyrelsen"

    # Check Forsyningstilsynet
    for kw in FORSYNINGSTILSYNET_KEYWORDS:
        kw_lower = kw.lower()
        if kw_lower in title_lower:
            # tarif needs energy context
            if kw_lower == "tarif":
                energy_ctx = ["el", "gas", "net", "varme", "forsyning",
                              "distribution", "forsyningstilsyn", "energinet"]
                if any(c in title_lower for c in energy_ctx):
                    return "forsyningstilsynet"
            elif kw_lower == "benchmark":
                if any(c in title_lower for c in ["net", "el", "gas", "varme", "distribution"]):
                    return "forsyningstilsynet"
            elif kw_lower == "fakturering":
                if any(c in title_lower for c in ["el", "gas", "varme"]):
                    return "forsyningstilsynet"
            else:
                return "forsyningstilsynet"

    # Default to Energistyrelsen
    return "energistyrelsen"


def classify_doc_type(title: str) -> str:
    """Classify the document type based on title patterns."""
    title_lower = title.lower()

    if title_lower.startswith("bekendtgørelse af lov") or title_lower.startswith("lovbekendtgørelse"):
        return "bekendtgorelse"
    if title_lower.startswith("bekendtgørelse om") or title_lower.startswith("bekendtgørelse for"):
        return "bekendtgorelse"
    if title_lower.startswith("lov om") or title_lower.startswith("lov nr"):
        return "bekendtgorelse"
    if "lov om ændring" in title_lower:
        return "bekendtgorelse"
    if title_lower.startswith("bekendtgørelse"):
        return "bekendtgorelse"
    if "vejledning" in title_lower:
        return "vejledning"

    # Sikkerhedsstyrelsen safety context
    sik_terms = ["gasreglement", "elsikkerhed", "stærkstrøm", "gasanlæg",
                  "elmateriel", "sikkerhed ved elektriske", "gasinstallation"]
    if any(t in title_lower for t in sik_terms):
        return "safety_rule"

    return "bekendtgorelse"


def title_matches_energy(title: str) -> bool:
    """Check if a title matches energy-sector terms, with context filtering."""
    title_lower = title.lower()

    # Check explicit exclusions first
    for pat in EXCLUDE_PATTERNS:
        if pat.lower() in title_lower:
            return False

    for term in ENERGY_TERMS:
        term_lower = term.lower()
        if term_lower in title_lower:
            # If this term requires context, check for it
            if term_lower in CONTEXT_REQUIRED_TERMS:
                context_words = CONTEXT_REQUIRED_TERMS[term_lower]
                if any(cw.lower() in title_lower for cw in context_words):
                    return True
                # Context not found — this match alone is not enough, try other terms
                continue
            return True

    return False


def build_summary(provisions: list[tuple[str, str, str]], max_chars: int = 500) -> str:
    """Build a summary from the first few provisions of a document."""
    if not provisions:
        return ""

    # Take up to 5 provisions
    limit = min(5, len(provisions))
    parts = []
    total_len = 0

    for i in range(limit):
        ref, _section, content = provisions[i]
        # Clean up content
        content = content.strip()
        if not content:
            continue

        # Trim individual provision if needed
        remaining = max_chars - total_len
        if remaining <= 0:
            break

        if len(content) > remaining:
            content = content[:remaining].rsplit(" ", 1)[0] + "..."

        parts.append(content)
        total_len += len(content) + 1  # +1 for space

    return " ".join(parts)


def normalize_title_for_dedup(title: str) -> str:
    """Normalize a title for deduplication grouping.

    Strips date-specific parts and minor variations to group
    versions of the same regulation together.
    """
    t = title.strip()
    # Remove "nr NNNN af DD/MM/YYYY" or "nr NNNN af DD. month YYYY"
    t = re.sub(r"\s*nr\.?\s+\d+\s+af\s+\d{1,2}[./]\s*\d{1,2}[./]\s*\d{4}", "", t)
    t = re.sub(
        r"\s*nr\.?\s+\d+\s+af\s+\d{1,2}\.\s*(?:januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december)\s+\d{4}",
        "",
        t,
        flags=re.IGNORECASE,
    )
    # Remove parenthetical year references
    t = re.sub(r"\(\s*\d{4}\s*\)", "", t)
    # Collapse whitespace
    t = re.sub(r"\s+", " ", t).strip()
    return t


def escape_ts_string(s: str) -> str:
    """Escape a string for embedding in a TypeScript string literal."""
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    s = s.replace("\n", " ")
    s = s.replace("\r", "")
    s = s.replace("\t", " ")
    # Collapse multiple spaces
    s = re.sub(r"  +", " ", s)
    return s.strip()


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    if not os.path.exists(DB_PATH):
        print(f"ERROR: Database not found at {DB_PATH}")
        raise SystemExit(1)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    # Step 1: Query all in_force statutes matching energy terms
    print(f"Reading from {DB_PATH}...")

    all_docs = conn.execute(
        "SELECT id, type, title, short_name, status FROM legal_documents "
        "WHERE status = 'in_force' AND type = 'statute'"
    ).fetchall()

    print(f"  Total in_force statutes in DB: {len(all_docs)}")

    # Filter to energy-sector documents
    energy_docs = []
    for doc in all_docs:
        title = doc["title"] or ""
        if title_matches_energy(title):
            energy_docs.append(doc)

    print(f"  Energy-sector matches: {len(energy_docs)}")

    # Step 2: Deduplicate — keep only newest version per title group
    title_groups: dict[str, list[sqlite3.Row]] = defaultdict(list)
    for doc in energy_docs:
        norm_title = normalize_title_for_dedup(doc["title"] or "")
        title_groups[norm_title].append(doc)

    deduped_docs = []
    dupes_removed = 0
    for _norm_title, docs in title_groups.items():
        if len(docs) == 1:
            deduped_docs.append(docs[0])
        else:
            # Sort by year desc, then number desc — keep the newest
            sorted_docs = sorted(
                docs,
                key=lambda d: parse_doc_id(d["id"]),
                reverse=True,
            )
            deduped_docs.append(sorted_docs[0])
            dupes_removed += len(sorted_docs) - 1

    print(f"  After deduplication: {len(deduped_docs)} (removed {dupes_removed} older versions)")

    # Step 3-7: Build regulation records
    records: list[tuple[str, str, str, str, str, str, str, str]] = []
    empty_text_count = 0
    provision_cache: dict[str, list[tuple[str, str, str]]] = {}

    # Batch-load provisions for all selected documents
    doc_ids = [d["id"] for d in deduped_docs]
    placeholders = ",".join(["?"] * len(doc_ids))
    if doc_ids:
        provisions_rows = conn.execute(
            f"SELECT document_id, provision_ref, section, content "
            f"FROM legal_provisions WHERE document_id IN ({placeholders}) "
            f"ORDER BY document_id, id",
            doc_ids,
        ).fetchall()

        for row in provisions_rows:
            did = row["document_id"]
            if did not in provision_cache:
                provision_cache[did] = []
            provision_cache[did].append(
                (row["provision_ref"], row["section"], row["content"])
            )

    for doc in deduped_docs:
        doc_id = doc["id"]
        title = doc["title"] or ""

        regulator = classify_regulator(title)
        doc_type = classify_doc_type(title)
        reference = build_reference(doc_id, title)
        url = build_url(doc_id)
        effective_date = extract_date_from_title(title, doc_id)

        # Build summary from provisions
        provs = provision_cache.get(doc_id, [])
        summary = build_summary(provs)
        if not summary:
            # Use title as fallback text
            summary = title
            empty_text_count += 1

        records.append((
            regulator,
            reference,
            title,
            summary,
            doc_type,
            "in_force",
            effective_date,
            url,
        ))

    conn.close()

    # Sort records by regulator, then by effective_date desc
    records.sort(key=lambda r: (r[0], r[6] or "0000"), reverse=False)
    records.sort(key=lambda r: r[0])

    # Quality checks
    print("\n--- Quality Checks ---")

    # Check for duplicate references
    refs = [r[1] for r in records]
    ref_counts = defaultdict(int)
    for ref in refs:
        ref_counts[ref] += 1
    dupes = {ref: count for ref, count in ref_counts.items() if count > 1}
    if dupes:
        print(f"  WARNING: {len(dupes)} duplicate references found:")
        for ref, count in list(dupes.items())[:10]:
            print(f"    {ref} (x{count})")
        # Deduplicate by reference — keep first occurrence
        seen_refs: set[str] = set()
        unique_records = []
        for r in records:
            if r[1] not in seen_refs:
                seen_refs.add(r[1])
                unique_records.append(r)
        removed = len(records) - len(unique_records)
        records = unique_records
        print(f"  Removed {removed} duplicate-reference records")
    else:
        print("  No duplicate references")

    # Check for empty text
    empty = [r for r in records if not r[3].strip()]
    if empty:
        print(f"  WARNING: {len(empty)} records with empty text")
    else:
        print("  No empty text fields")

    # Check URL format
    bad_urls = [r for r in records if r[7] and not r[7].startswith("https://")]
    if bad_urls:
        print(f"  WARNING: {len(bad_urls)} records with invalid URL format")
    else:
        print("  All URLs valid format")

    # Counts per regulator and type
    print("\n--- Summary ---")
    reg_counts: dict[str, int] = defaultdict(int)
    type_counts: dict[str, int] = defaultdict(int)
    reg_type_counts: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))

    for r in records:
        reg_counts[r[0]] += 1
        type_counts[r[4]] += 1
        reg_type_counts[r[0]][r[4]] += 1

    for regulator in sorted(reg_counts.keys()):
        types_str = ", ".join(
            f"{t}: {c}" for t, c in sorted(reg_type_counts[regulator].items())
        )
        print(f"  {regulator}: {reg_counts[regulator]} ({types_str})")

    print(f"\n  Total regulations: {len(records)}")
    print(f"  Records with provision-based text: {len(records) - empty_text_count}")
    print(f"  Records with title-only text: {empty_text_count}")

    # Step 8: Write TypeScript output
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / "corpus-regulations.ts"

    lines = [
        "/**",
        " * Auto-generated corpus of Danish energy-sector regulations.",
        f" * Extracted from Danish Law MCP database ({DB_PATH}).",
        f" * Total: {len(records)} regulations.",
        " *",
        " * DO NOT EDIT — regenerate with: python3 scripts/ingest-from-law-db.py",
        " */",
        "",
        "export const CORPUS_REGULATIONS: [string, string, string, string, string, string, string, string][] = [",
        "  // [regulator_id, reference, title, text, type, status, effective_date, url]",
    ]

    for rec in records:
        regulator, reference, title, text, doc_type, status, eff_date, url = rec
        parts = [
            f'"{escape_ts_string(regulator)}"',
            f'"{escape_ts_string(reference)}"',
            f'"{escape_ts_string(title)}"',
            f'"{escape_ts_string(text)}"',
            f'"{escape_ts_string(doc_type)}"',
            f'"{escape_ts_string(status)}"',
            f'"{escape_ts_string(eff_date)}"',
            f'"{escape_ts_string(url)}"',
        ]
        lines.append(f"  [{', '.join(parts)}],")

    lines.append("];")
    lines.append("")

    output_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"\nWrote {output_path} ({len(records)} records, {output_path.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
