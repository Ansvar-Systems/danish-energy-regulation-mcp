/**
 * Seed the Danish Energy Regulation database with sample data for testing.
 *
 * Inserts representative regulations, grid codes, and decisions from:
 *   - Energistyrelsen (energy policy, BEKs)
 *   - Forsyningstilsynet (tariff decisions)
 *   - Energinet (grid codes, technical regulations)
 *   - Sikkerhedsstyrelsen (electrical/gas safety)
 *
 * Usage:
 *   npx tsx scripts/seed-sample.ts
 *   npx tsx scripts/seed-sample.ts --force   # drop and recreate
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA_SQL } from "../src/db.js";

const DB_PATH = process.env["DK_ENERGY_DB_PATH"] ?? "data/dk-energy.db";
const force = process.argv.includes("--force");

const dir = dirname(DB_PATH);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

if (force && existsSync(DB_PATH)) {
  unlinkSync(DB_PATH);
  console.log(`Deleted existing database at ${DB_PATH}`);
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA_SQL);

console.log(`Database initialised at ${DB_PATH}`);

// -- Regulators --

const regulators = [
  {
    id: "energistyrelsen",
    name: "Energistyrelsen",
    full_name: "Energistyrelsen (Danish Energy Agency)",
    url: "https://ens.dk",
    description:
      "Danish Energy Agency — responsible for energy policy, licensing, permits, renewable energy, energy efficiency, climate reporting, and energy statistics.",
  },
  {
    id: "forsyningstilsynet",
    name: "Forsyningstilsynet",
    full_name: "Forsyningstilsynet (Danish Utility Regulator)",
    url: "https://forsyningstilsynet.dk",
    description:
      "Danish Utility Regulator — oversees tariff regulation, revenue caps, market monitoring, benchmarking, and consumer protection for electricity, gas, heat, and water utilities.",
  },
  {
    id: "energinet",
    name: "Energinet",
    full_name: "Energinet (Danish TSO)",
    url: "https://energinet.dk",
    description:
      "Danish transmission system operator — manages electricity and gas transmission grids, sets technical regulations (grid codes), market rules, balancing requirements, and grid connection standards.",
  },
  {
    id: "sikkerhedsstyrelsen",
    name: "Sikkerhedsstyrelsen",
    full_name: "Sikkerhedsstyrelsen (Danish Safety Technology Authority)",
    url: "https://sik.dk",
    description:
      "Danish Safety Technology Authority — responsible for electrical installation safety, gas safety, product safety, and inspection/certification of energy installations.",
  },
];

const insertRegulator = db.prepare(
  "INSERT OR IGNORE INTO regulators (id, name, full_name, url, description) VALUES (?, ?, ?, ?, ?)",
);

for (const r of regulators) {
  insertRegulator.run(r.id, r.name, r.full_name, r.url, r.description);
}
console.log(`Inserted ${regulators.length} regulators`);

// -- Regulations (Energistyrelsen + Sikkerhedsstyrelsen) --

const regulations = [
  // Energistyrelsen
  {
    regulator_id: "energistyrelsen",
    reference: "BEK nr 1310 af 24/11/2023",
    title: "Bekendtgorelse om net- og informationssikkerhed i energisektoren",
    text: "Denne bekendtgorelse fastsaetter regler om net- og informationssikkerhed for virksomheder i energisektoren. Virksomheder, der er udpeget som vasentlige eller vigtige enheder i medfoer af NIS 2-loven, skal implementere passende og forholdsmassige tekniske, operationelle og organisatoriske foranstaltninger til styring af risici for sikkerheden i net- og informationssystemer. Virksomheder skal underrette Energistyrelsen om vasentlige haendelser uden unodigt ophold og senest inden for 24 timer efter opdagelse. Energistyrelsen kan udstede paabud og forbud samt paalaegge tvangsboder.",
    type: "bekendtgorelse",
    status: "in_force",
    effective_date: "2024-01-01",
    url: "https://www.retsinformation.dk/eli/lta/2023/1310",
  },
  {
    regulator_id: "energistyrelsen",
    reference: "VEJ nr 9424 af 15/06/2023",
    title: "Vejledning om beredskab for el- og naturgassektorerne",
    text: "Denne vejledning beskriver kravene til beredskab i el- og naturgassektorerne i henhold til energiberedskabsloven. El- og naturgasvirksomheder skal udarbejde og vedligeholde beredskabsplaner, gennemfoere risikovurderinger, deltage i beredskabsoevelser og indberette sikkerhedshaendelser til Energistyrelsen. Beredskabsplanerne skal daekke fysisk sikkerhed, cybersikkerhed, personalesikkerhed og forsyningssikkerhed. Virksomheder med kritisk infrastruktur skal have et saerligt hoejt beredskabsniveau og gennemfoere aarlige oevelser.",
    type: "vejledning",
    status: "in_force",
    effective_date: "2023-07-01",
    url: "https://ens.dk/ansvarsomraader/beredskab",
  },
  {
    regulator_id: "energistyrelsen",
    reference: "BEK nr 1048 af 08/12/2022",
    title: "Bekendtgorelse om tilslutning af vindmoller og solcelleanlæg til elnettet",
    text: "Denne bekendtgorelse fastsaetter betingelser for tilslutning af vindmoller og solcelleanlæg til det kollektive elnet. Anlaegsejeren skal indhente tilslutningstilsagn fra netvirksomheden, overholde tekniske krav til elkvalitet og frekvensrespons, og betale eventuelle netforstaerkningsomkostninger. Netvirksomheden skal tilbyde tilslutning inden for rimelig tid og paa gennemsigtige, ikke-diskriminerende vilkaar. Energistyrelsen fastsaetter naermere regler om prioriteret adgang for vedvarende energi i overensstemmelse med EU's regler om vedvarende energi.",
    type: "bekendtgorelse",
    status: "in_force",
    effective_date: "2023-01-01",
    url: "https://www.retsinformation.dk/eli/lta/2022/1048",
  },
  {
    regulator_id: "energistyrelsen",
    reference: "VEJ nr 9100 af 01/03/2024",
    title: "Vejledning om energieffektivitet i virksomheder",
    text: "Denne vejledning beskriver kravene til energieffektivitet i medfoer af den reviderede energieffektivitetsdirektiv (EED) og den danske lovgivning. Store virksomheder skal gennemfoere energisyn mindst hvert fjerde aar eller implementere et certificeret energiledelsessystem (ISO 50001). Energistyrelsen stiller krav til rapportering af energiforbrug, energibesparelsestiltag og CO2-reduktioner. Virksomheder med et aarligt energiforbrug over 85 TJ skal udarbejde en plan for omstilling til vedvarende energi.",
    type: "vejledning",
    status: "in_force",
    effective_date: "2024-04-01",
    url: "https://ens.dk/ansvarsomraader/energieffektivitet",
  },
  {
    regulator_id: "energistyrelsen",
    reference: "BEK nr 888 af 21/06/2022",
    title: "Bekendtgorelse om oprindelsesgarantier for elektricitet fra vedvarende energikilder",
    text: "Denne bekendtgorelse implementerer kravene i VE-direktivet om oprindelsesgarantier. Energistyrelsen udsteder oprindelsesgarantier for elektricitet produceret fra vedvarende energikilder. Hver garanti svarer til 1 MWh produceret elektricitet og angiver energikilde, produktionsperiode, produktionssted og installeret kapacitet. Oprindelsesgarantier kan overdrages, annulleres og bruges til dokumentation af vedvarende energiforbrug. Energinet administrerer det danske register for oprindelsesgarantier.",
    type: "bekendtgorelse",
    status: "in_force",
    effective_date: "2022-07-01",
    url: "https://www.retsinformation.dk/eli/lta/2022/888",
  },
  // Sikkerhedsstyrelsen
  {
    regulator_id: "sikkerhedsstyrelsen",
    reference: "BEK nr 1082 af 12/07/2016",
    title: "Bekendtgorelse om sikkerhed for elektriske anlæg (staerkstromsbekendtgorelsen)",
    text: "Denne bekendtgorelse (staerkstromsbekendtgorelsen) fastsaetter sikkerhedskrav til elektriske anlæg og installationer. Anlæg skal projekteres, udfoeres og vedligeholdes, saa de ikke frembyder fare for personer, husdyr eller ejendom ved normal brug og under forudsigelige fejlforhold. Installationsarbejde maa kun udfoeres af autoriserede elinstallatoervirksomheder. Sikkerhedsstyrelsen foerer tilsyn med overholdelse og kan udstede paabud om udbedring af mangler eller afbrydelse af farlige installationer.",
    type: "safety_rule",
    status: "in_force",
    effective_date: "2016-08-01",
    url: "https://www.retsinformation.dk/eli/lta/2016/1082",
  },
  {
    regulator_id: "sikkerhedsstyrelsen",
    reference: "BEK nr 247 af 15/03/2018",
    title: "Bekendtgorelse om sikkerhed for gasinstallationer og gasmateriel",
    text: "Denne bekendtgorelse fastsaetter krav til sikkerhed for gasinstallationer, gasapparater og tilhoerende skorstene. Gasinstallationer skal projekteres og udfoeres i overensstemmelse med gaskvalitetskrav og i henhold til Sikkerhedsstyrelsens tekniske forskrifter. Gasinstallatoervirksomheder skal vaere autoriserede og anvende faglært personale. Sikkerhedsstyrelsen godkender gasapparater og foerer tilsyn med gasinstallationer. Ved gasuheld eller gaslugt skal forsyningen afbrydes omgaaende, og haendelsen indberettes til Sikkerhedsstyrelsen.",
    type: "safety_rule",
    status: "in_force",
    effective_date: "2018-04-01",
    url: "https://www.retsinformation.dk/eli/lta/2018/247",
  },
];

const insertRegulation = db.prepare(`
  INSERT INTO regulations (regulator_id, reference, title, text, type, status, effective_date, url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertRegsAll = db.transaction(() => {
  for (const r of regulations) {
    insertRegulation.run(
      r.regulator_id, r.reference, r.title, r.text, r.type, r.status, r.effective_date, r.url,
    );
  }
});
insertRegsAll();
console.log(`Inserted ${regulations.length} regulations`);

// -- Grid codes (Energinet) --

const gridCodes = [
  {
    reference: "TF 3.2.5",
    title: "Teknisk forskrift for vindkraftvaerker stoerre end 11 kW",
    text: "Denne tekniske forskrift stiller krav til vindkraftvaerker med en installeret effekt stoerre end 11 kW, der tilsluttes det danske elnet. Kravene omfatter aktiv og reaktiv effektregulering, frekvensrespons, spandingsregulering, fejlgennemkoeringskrav (fault ride-through), elkvalitet (harmonisk forvrengning, flicker), kommunikation med systemoperatoeren, og overvagning af driftsdata. Vindkraftvaerket skal vaere i stand til at levere spandingsstoette under netfejl og genoptage normal drift inden for 1 sekund efter fejlklaring. Kravene gaelder for baade landbaserede og havbaserede vindkraftvaerker.",
    code_type: "technical_regulation",
    version: "4.0",
    effective_date: "2023-06-01",
    url: "https://energinet.dk/regler/tekniske-forskrifter/tf-3-2-5",
  },
  {
    reference: "TF 3.2.1",
    title: "Teknisk forskrift for tilslutning af elproduktionsanlæg til elnettet",
    text: "Denne tekniske forskrift fastsaetter generelle krav til tilslutning af elproduktionsanlæg (undtagen vindkraft og solceller, som er dækket af særskilte forskrifter) til det danske transmissions- og distributionsnet. Kravene omfatter tekniske minimumskrav for aktiv effektregulering, reaktiv effektregulering, spandingskvalitet, frekvensregulering, beskyttelsesindstillinger, og kommunikationsudstyr. Anlaegsejeren er ansvarlig for at sikre, at anlægget opfylder alle tekniske krav foer idriftsættelse og under drift.",
    code_type: "technical_regulation",
    version: "3.0",
    effective_date: "2022-01-01",
    url: "https://energinet.dk/regler/tekniske-forskrifter/tf-3-2-1",
  },
  {
    reference: "MR 5.1",
    title: "Markedsforskrift for balanceansvarlige aktorer",
    text: "Denne markedsforskrift fastsaetter vilkaar og forpligtelser for balanceansvarlige aktorer paa det danske elmarked. Balanceansvarlige aktorer skal sikre balance mellem forbrug og produktion i deres portefoelje og afregnes for ubalancer. Forskriften regulerer anmeldelse af handelsplaner, afregnning af regulerkraft, og krav til dataindberetning. Energinet administrerer balancemarkedet og udforer opreegulering og nedregulering efter behov for at opretholde systembalancen. Balanceansvarlige aktorer skal stille financiel sikkerhed.",
    code_type: "balancing",
    version: "2.0",
    effective_date: "2023-01-01",
    url: "https://energinet.dk/regler/markedsforskrifter/mr-5-1",
  },
  {
    reference: "TF 3.3.1",
    title: "Teknisk forskrift for tilslutning af forbrugsanlæg til transmissionsnettet",
    text: "Denne tekniske forskrift stiller krav til store forbrugsanlæg (typisk over 100 MW), der tilsluttes transmissionsnettet direkte. Kravene omfatter reaktiv effektkompensation, spandingskvalitet, harmonisk emission, frekvensstabilitet, og krav til automatisk frakobling ved under- eller overspanding. Tilslutningen kraever en tilslutningsaftale med Energinet, teknisk forundersoeegelse, og godkendelse af installationens beskyttelsesindstillinger.",
    code_type: "grid_connection",
    version: "2.0",
    effective_date: "2021-06-01",
    url: "https://energinet.dk/regler/tekniske-forskrifter/tf-3-3-1",
  },
  {
    reference: "SYR 1.1",
    title: "Systemydelser fra decentrale kraftvaerker og vedvarende energianlæg",
    text: "Denne forskrift regulerer levering af systemydelser (ancillary services) fra decentrale kraftvaerker og vedvarende energianlæg til Energinet. Systemydelser omfatter frekvensreserver (FCR, aFRR, mFRR), spandingsstoette, og sortstart-kapabilitet. Anlægsejere kan byde systemydelser ind paa Energinets markedsplatform. Energinet koeber systemydelser gennem markedsbaserede mekanismer og fastsaetter minimumskrav til responstid, kapacitet, og tilgaengelighed for hver ydelsestype.",
    code_type: "ancillary_services",
    version: "1.0",
    effective_date: "2022-09-01",
    url: "https://energinet.dk/regler/systemydelser/syr-1-1",
  },
  {
    reference: "MR 6.1",
    title: "Markedsforskrift for gasmarkedet — balancering",
    text: "Denne markedsforskrift regulerer balancering paa det danske gasmarked. Gasleverandoerer skal anmelde dagsplaner for tilfoersel og udtag af gas i transmissionssystemet. Energinet overvager gasbalancen og kan traede korrigerende foranstaltninger ved ubalance. Ubalanceomkostninger beregnes paa basis af daglige gasprisreferencer. Forskriften implementerer kravene i EU-forordning om gasbalancering (312/2014).",
    code_type: "market_regulation",
    version: "3.0",
    effective_date: "2023-04-01",
    url: "https://energinet.dk/regler/markedsforskrifter/mr-6-1",
  },
];

const insertGridCode = db.prepare(`
  INSERT INTO grid_codes (reference, title, text, code_type, version, effective_date, url)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertGridAll = db.transaction(() => {
  for (const g of gridCodes) {
    insertGridCode.run(g.reference, g.title, g.text, g.code_type, g.version, g.effective_date, g.url);
  }
});
insertGridAll();
console.log(`Inserted ${gridCodes.length} grid codes`);

// -- Decisions (Forsyningstilsynet) --

const decisions = [
  {
    reference: "FT/2024/EL/001",
    title: "Afgorelse om Radius Elnet A/S' indtagtsramme for 2024",
    text: "Forsyningstilsynet har truffet afgorelse om Radius Elnet A/S' oekonomiske ramme for 2024. Indtagtsrammen er fastsat til 4.832 mio. kr. baseret paa effektivitetskrav, investeringsbehov og driftsomkostninger. Radius har faaet godkendt saeromkostninger til kabellæng af transmissionsnettet og smart grid-investeringer. Forsyningstilsynet har paabagt et effektivitetskrav paa 2,5% aarligt for driftsomkostninger. Afgorelsen kan paaklages til Energiklagenaevnet inden 4 uger.",
    decision_type: "revenue_cap",
    date_decided: "2024-03-15",
    parties: "Radius Elnet A/S",
    url: "https://forsyningstilsynet.dk/el/afgoerelse-radius-2024",
  },
  {
    reference: "FT/2023/VARME/042",
    title: "Afgorelse om fjernvarmetariffer for Koebenhavns Fjernvarme",
    text: "Forsyningstilsynet har vurderet Koebenhavns Fjernvarmes tariffer for regnskabsaaret 2023. Tilsynet konstaterer, at tarifferne er i overensstemmelse med varmeforsyningslovens hvile-i-sig-selv-princip. Koebenhavns Fjernvarme har dokumenteret, at tarifstigningen paa 8,3% skyldes hoejere braendselspriser og investeringer i omstilling til geotermi og varmepumper. Forsyningstilsynet godkender tarifferne med forbehold for efterfoeelgende kontrol af de underliggende investeringsberegninger.",
    decision_type: "tariff",
    date_decided: "2023-11-22",
    parties: "Koebenhavns Fjernvarme",
    url: "https://forsyningstilsynet.dk/varme/afgoerelse-kbh-fjernvarme-2023",
  },
  {
    reference: "FT/2024/EL/METODE/003",
    title: "Metodegodkendelse: Energinets metode for beregning af systemtariffer",
    text: "Forsyningstilsynet har godkendt Energinets metode for beregning af tariffer for brug af transmissionsnettet. Metoden fordeler omkostninger paa baggrund af kapacitetsudnyttelse og afstand. Tariffen bestaar af et fast element (kapacitetsafhaengigt) og et variabelt element (energiafhaengigt). Forsyningstilsynet har stillet krav om oget gennemsigtighed i tarifberegningerne og aarlig offentliggoerelse af beregningsgrundlag og fordelingsnoegler i overensstemmelse med EU-reglerne om netadgang.",
    decision_type: "methodology",
    date_decided: "2024-06-01",
    parties: "Energinet Elsystemansvar A/S",
    url: "https://forsyningstilsynet.dk/el/metodegodkendelse-energinet-systemtariffer",
  },
  {
    reference: "FT/2023/GAS/011",
    title: "Benchmarking af gasdistributionsselskaber 2023",
    text: "Forsyningstilsynet har gennemfoert den aarlige benchmarking af gasdistributionsselskaber i Danmark. Benchmarkingen sammenligninger selskabernes effektivitet baseret paa totalomkostninger, leveringssikkerhed og kundetilfredshed. Evida har opnaaet en effektivitetsscore paa 94%, hvilket er over gennemsnittet. Forsyningstilsynet fastsaetter individuelle effektivitetskrav for hvert selskab baseret paa benchmarkresultaterne. Selskaber med effektivitetsscore under 85% paalagges skarpede krav.",
    decision_type: "benchmark",
    date_decided: "2023-09-30",
    parties: "Evida A/S, alle gasdistributionsselskaber",
    url: "https://forsyningstilsynet.dk/gas/benchmarking-2023",
  },
  {
    reference: "FT/2024/KLAGE/007",
    title: "Klageafgorelse: Forbrugerklage over urimelig tarif fra lokalt elnetselskab",
    text: "Forsyningstilsynet har behandlet en klage fra en erhvervsforbruger over tariffer opkraevet af et lokalt elnetselskab. Klageren anfoegtede, at tarifferne for hoejspaendingstilslutning var uforholdsmassigt hoeje sammenlignet med naboomraader. Forsyningstilsynet finder, at elnetselskabet har dokumenteret, at tarifferne afspejler faktiske omkostninger for det relevante netomraade, og at der ikke er tale om krydssubsidiering. Klagen afvises. Afgorelsen kan indbringes for Energiklagenaevnet.",
    decision_type: "complaint",
    date_decided: "2024-02-28",
    parties: "Erhvervsforbruger (anonymiseret) vs. lokalt elnetselskab",
    url: "https://forsyningstilsynet.dk/el/klageafgoerelse-2024-007",
  },
];

const insertDecision = db.prepare(`
  INSERT INTO decisions (reference, title, text, decision_type, date_decided, parties, url)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertDecAll = db.transaction(() => {
  for (const d of decisions) {
    insertDecision.run(d.reference, d.title, d.text, d.decision_type, d.date_decided, d.parties, d.url);
  }
});
insertDecAll();
console.log(`Inserted ${decisions.length} decisions`);

// -- Summary --

const stats = {
  regulators: (db.prepare("SELECT count(*) as cnt FROM regulators").get() as { cnt: number }).cnt,
  regulations: (db.prepare("SELECT count(*) as cnt FROM regulations").get() as { cnt: number }).cnt,
  grid_codes: (db.prepare("SELECT count(*) as cnt FROM grid_codes").get() as { cnt: number }).cnt,
  decisions: (db.prepare("SELECT count(*) as cnt FROM decisions").get() as { cnt: number }).cnt,
  regulations_fts: (db.prepare("SELECT count(*) as cnt FROM regulations_fts").get() as { cnt: number }).cnt,
  grid_codes_fts: (db.prepare("SELECT count(*) as cnt FROM grid_codes_fts").get() as { cnt: number }).cnt,
  decisions_fts: (db.prepare("SELECT count(*) as cnt FROM decisions_fts").get() as { cnt: number }).cnt,
};

console.log(`\nDatabase summary:`);
console.log(`  Regulators:       ${stats.regulators}`);
console.log(`  Regulations:      ${stats.regulations} (FTS: ${stats.regulations_fts})`);
console.log(`  Grid codes:       ${stats.grid_codes} (FTS: ${stats.grid_codes_fts})`);
console.log(`  Decisions:        ${stats.decisions} (FTS: ${stats.decisions_fts})`);
console.log(`\nDone. Database ready at ${DB_PATH}`);

db.close();
