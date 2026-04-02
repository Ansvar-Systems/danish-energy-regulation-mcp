/**
 * Combined ingestion for all 4 Danish energy regulators.
 *
 * Inserts real regulatory content sourced from:
 *   - Energistyrelsen (ens.dk) — BEKs, vejledninger, analyses
 *   - Forsyningstilsynet (forsyningstilsynet.dk) — tariff decisions, methodologies
 *   - Energinet (energinet.dk) — grid codes, market regulations
 *   - Sikkerhedsstyrelsen (sik.dk) — electrical and gas safety rules
 *
 * Usage:
 *   npx tsx scripts/ingest-all.ts
 *   npx tsx scripts/ingest-all.ts --force   # drop and recreate
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA_SQL } from "../src/db.js";
import { EXPANSION_ENS_REGS, EXPANSION_SIK_REGS } from "./data/expansion-regulations.js";
import { EXPANSION_GRID_CODES } from "./data/expansion-grid-codes.js";
import { EXPANSION_DECISIONS } from "./data/expansion-decisions.js";

const DB_PATH = process.env["DK_ENERGY_DB_PATH"] ?? "data/dk-energy.db";
const force = process.argv.includes("--force");

const dir = dirname(DB_PATH);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
if (force && existsSync(DB_PATH)) {
  unlinkSync(DB_PATH);
  console.log(`Deleted ${DB_PATH}`);
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA_SQL);

// ═══════════════════════════════════════════════════════════════
// REGULATORS
// ═══════════════════════════════════════════════════════════════

const regulators = [
  { id: "energistyrelsen", name: "Energistyrelsen", full_name: "Energistyrelsen (Danish Energy Agency)", url: "https://ens.dk", description: "Danish Energy Agency — energy policy, licensing, renewable energy, energy efficiency, climate reporting, NIS2/CER competent authority for energy sector" },
  { id: "forsyningstilsynet", name: "Forsyningstilsynet", full_name: "Forsyningstilsynet (Danish Utility Regulator)", url: "https://forsyningstilsynet.dk", description: "Danish Utility Regulator — tariff regulation, revenue caps, market monitoring, benchmarking for electricity, gas, heat, and water" },
  { id: "energinet", name: "Energinet", full_name: "Energinet (Danish TSO)", url: "https://energinet.dk", description: "Danish TSO — electricity and gas transmission, grid codes, market rules, balancing, ancillary services, grid connection" },
  { id: "sikkerhedsstyrelsen", name: "Sikkerhedsstyrelsen", full_name: "Sikkerhedsstyrelsen (Danish Safety Technology Authority)", url: "https://sik.dk", description: "Danish Safety Technology Authority — electrical installation safety, gas safety, product safety, inspection, certification" },
];

const insertReg = db.prepare("INSERT OR IGNORE INTO regulators (id, name, full_name, url, description) VALUES (?, ?, ?, ?, ?)");
for (const r of regulators) insertReg.run(r.id, r.name, r.full_name, r.url, r.description);
console.log(`Inserted ${regulators.length} regulators`);

// ═══════════════════════════════════════════════════════════════
// REGULATIONS (Energistyrelsen + Sikkerhedsstyrelsen)
// ═══════════════════════════════════════════════════════════════

db.prepare("DELETE FROM regulations").run();

const insertRegulation = db.prepare(`
  INSERT INTO regulations (regulator_id, reference, title, text, type, status, effective_date, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// --- Energistyrelsen regulations ---

const ensRegs = [
  ["energistyrelsen", "BEK nr 1310 af 24/11/2023", "Bekendtgoerelse om net- og informationssikkerhed i energisektoren", "Bekendtgorelsen fastsaetter regler om net- og informationssikkerhed for virksomheder i energisektoren i medfoer af NIS 2-loven. Virksomheder udpeget som vaesentlige eller vigtige enheder skal implementere passende tekniske, operationelle og organisatoriske foranstaltninger til styring af risici for sikkerheden i net- og informationssystemer. Virksomheder skal underrette Energistyrelsen om vaesentlige haendelser inden 24 timer. Energistyrelsen kan udstede paabud, forbud og tvangsboder.", "bekendtgorelse", "in_force", "2024-01-01", "https://www.retsinformation.dk/eli/lta/2023/1310"],
  ["energistyrelsen", "BEK nr 1048 af 08/12/2022", "Bekendtgoerelse om tilslutning af vindmoeller og solcelleanlæg til elnettet", "Bekendtgorelsen fastsaetter betingelser for tilslutning af vindmoeller og solcelleanlæg til det kollektive elnet. Anlaegsejeren skal indhente tilslutningstilsagn, overholde tekniske krav til elkvalitet og frekvensrespons, og betale eventuelle netforstaerkningsomkostninger. Netvirksomheden skal tilbyde tilslutning inden for rimelig tid paa gennemsigtige vilkaar. Energistyrelsen fastsaetter regler om prioriteret adgang for vedvarende energi.", "bekendtgorelse", "in_force", "2023-01-01", "https://www.retsinformation.dk/eli/lta/2022/1048"],
  ["energistyrelsen", "BEK nr 1138 af 18/09/2025", "Bekendtgoerelse om energiledelse, energisyn og klimasyn i visse virksomheder", "Virksomheder med aarligt energiforbrug over 10 TJ skal gennemfoere energisyn og klimasyn hvert fjerde aar. Virksomheder med forbrug over 85 TJ skal indfoere certificeret energiledelsessystem (ISO 50001). Implementerer det reviderede energieffektivitetsdirektiv (EED). Energistyrelsen foerer tilsyn.", "bekendtgorelse", "in_force", "2025-10-01", "https://www.retsinformation.dk/eli/lta/2025/1138"],
  ["energistyrelsen", "BEK nr 888 af 21/06/2022", "Bekendtgoerelse om oprindelsesgarantier for elektricitet fra vedvarende energikilder", "Energistyrelsen udsteder oprindelsesgarantier for elektricitet produceret fra vedvarende energikilder. Hver garanti svarer til 1 MWh. Oprindelsesgarantier kan overdrages, annulleres og bruges til dokumentation af VE-forbrug. Energinet administrerer registeret. Implementerer VE-direktivets krav.", "bekendtgorelse", "in_force", "2022-07-01", "https://www.retsinformation.dk/eli/lta/2022/888"],
  ["energistyrelsen", "VEJ nr 9424 af 15/06/2023", "Vejledning om beredskab for el- og naturgassektorerne", "Krav til beredskab i el- og naturgassektorerne. Virksomheder skal udarbejde beredskabsplaner, gennemfoere risikovurderinger, deltage i oevelser og indberette sikkerhedshaendelser. Planerne skal daekke fysisk sikkerhed, cybersikkerhed, personalesikkerhed og forsyningssikkerhed. Kritisk infrastruktur kraever saerligt hoejt beredskabsniveau og aarlige oevelser. Opdateret med NIS2- og CER-krav.", "vejledning", "in_force", "2023-07-01", "https://ens.dk/ansvarsomraader/beredskab"],
  ["energistyrelsen", "ENS/EL/2024/001", "Pausering af nettilslutninger — ramme for midlertidig suspension", "Energistyrelsen har etableret en ramme for midlertidig suspension af nye nettilslutninger grundet kapacitetspres paa transmissionsnettet. Regulerer hvordan netvirksomheder kan haandtere manglende transmissionskapacitet. Krav om dokumentation af teknisk begrundelse og underretning af Energistyrelsen. Suspensionen er tidsbegrænset.", "vejledning", "in_force", "2024-10-01", "https://ens.dk/media/7863/download"],
  ["energistyrelsen", "ENS/EL/2024/002", "Vejledning om prioritering af nettilslutningsanmodninger", "Principper for prioritering af nettilslutningsanmodninger ved begrænsede kapaciteter. Kriterier: tidspunkt for anmodning, samfundsmaessig relevans, bidrag til groen omstilling, teknisk gennemfoerlighed. Implementerer kravene i den reviderede elforsyningslov.", "vejledning", "in_force", "2024-10-01", "https://ens.dk/media/7862/download"],
  ["energistyrelsen", "ENS/EL/2024/003", "Analyse af geografisk differentierede forbrugstariffer og direkte linjer", "Analyse af geografiske prissignaler og direkte linjer mellem forbrug og VE-produktion. Undersoeger fordele og ulemper ved geografisk differentierede tariffer i eldistributionsnettet, herunder indvirkning paa netinvesteringer og forbrugerpraeferencer. Anbefaler trinvis indfoerelse kombineret med fleksibilitetsloesninger.", "retningslinje", "in_force", "2024-10-01", "https://ens.dk/sites/default/files/media/documents/2024-10/analyse_af_geografisk_differentierede_forbrugstariffer_og_direkte_linjer.pdf"],
  ["energistyrelsen", "ENS/EL/2024/005", "Analyse af fremtidssikret eldistributionsnet", "Vurdering af regulering for elektrificeringsinvesteringer. Distributionsnettets kapacitet til stigende elforbrug fra varmepumper, elbiler og industriel elektrificering. Netvirksomheder skal investere 40-60 mia. kr. over 20 aar. Anbefaler justeringer af indtagtsrammereguleringen for proaktive investeringer.", "retningslinje", "in_force", "2024-10-01", "https://ens.dk/sites/default/files/media/documents/2024-10/hovedrapport_-_fremtidssikret_elnet.pdf"],
  ["energistyrelsen", "ENS/EEK/2025/001", "Vejledning om energiledelse, energisyn og klimasyn i virksomheder", "Vejledning til virksomheder med pligt til energiledelse iht. BEK nr 1138. Krav til rapportering, certificering og tilsyn. Skabeloner og indberetningsprocedurer for virksomheder med energiforbrug over 10 TJ og 85 TJ.", "vejledning", "in_force", "2025-10-17", "https://ens.dk/media/7414/download"],
  ["energistyrelsen", "ENS/BEREDSKAB/2024/001", "Love og regler for forsyningssikkerhed og beredskab i energisektoren", "Oversigt over lovgivning for forsyningssikkerhed. Daekker energiberedskabsloven, NIS 2-loven (2025:434), CER-loven (2025:433), Lov om styrket beredskab i energisektoren (2025:258). Energistyrelsen er NIS2/CER kompetent myndighed for energisektoren.", "retningslinje", "in_force", "2024-01-01", "https://ens.dk/ansvarsomraader/beredskab/love-og-regler-forsynings-sikkerhed"],
  ["energistyrelsen", "ENS/VE/2024/001", "Sammenligning af stoette til vedvarende energi (VE-el)", "Sammenligning af stoetteniveauer til VE-el paa tvaers af teknologier. Daekker havsbaseret vind, landbaseret vind, sol og biogas. LCOE-baseret sammenligning. Havsbaseret vind kraever fortsat hoejere stoette men omkostningsforskellen falder.", "retningslinje", "in_force", "2024-10-01", "https://ens.dk/sites/default/files/media/spreadsheets/2024-10/sammenligning_af_stoette_til_ve-el_web.xlsx"],
  ["energistyrelsen", "ENS/NET/2024/001", "Analyse af proaktiv udbygning af transmissionsnettet", "Muligheder for proaktiv udbygning af transmissionsnettet. Anbefaler udvidet mandat til Energinet for proaktive investeringer baseret paa fremtidsscenarier snarere end at vente paa konkrete tilslutningsanmodninger.", "retningslinje", "in_force", "2024-01-01", "https://ens.dk/media/6178/download"],
  ["energistyrelsen", "ENS/NET/2024/002", "Oversigt over elnetbevillingshavere — licensregister", "Register over alle licenserede elnetoperatoerer i Danmark med bevillingsoplysninger og udloebsdatoer. Netvirksomheder skal have bevilling fra Energistyrelsen iht. elforsyningsloven.", "cirkulaere", "in_force", "2024-06-01", "https://ens.dk/sites/default/files/media/documents/2024-10/oversigt_over_elnetbevillingshavere.pdf"],
];

// --- Sikkerhedsstyrelsen regulations ---

const sikRegs = [
  ["sikkerhedsstyrelsen", "BEK nr 1082 af 12/07/2016", "Staerkstromsbekendtgorelsen — sikkerhed for elektriske anlæg", "Fastsaetter sikkerhedskrav til elektriske anlæg og installationer. Anlæg skal projekteres, udfoeres og vedligeholdes saa de ikke frembyder fare ved normal brug og forudsigelige fejl. Installationsarbejde kun af autoriserede elinstallatoervirksomheder. Sikkerhedsstyrelsen foerer tilsyn og kan udstede paabud. Erstattet af nye elsikkerhedsregler fra 1. juli 2019, men gaelder fortsat for eksisterende installationer.", "safety_rule", "in_force", "2016-08-01", "https://www.sik.dk/erhverv/elinstallationer-og-elanlaeg/love-og-regler/tidligere-regelsaet-paa-el-omraadet-arkiv/staerkstroemsbekendtgoerelsen"],
  ["sikkerhedsstyrelsen", "BEK nr 247 af 15/03/2018", "Bekendtgoerelse om sikkerhed for gasinstallationer og gasmateriel", "Krav til sikkerhed for gasinstallationer, gasapparater og tilhoerende skorstene. Gasinstallationer iht. gaskvalitetskrav og tekniske forskrifter. Autorisationskrav for gasinstallatoervirksomheder. Sikkerhedsstyrelsen godkender gasapparater og foerer tilsyn. Gasuheld skal indberettes.", "safety_rule", "in_force", "2018-04-01", "https://www.retsinformation.dk/eli/lta/2018/247"],
  ["sikkerhedsstyrelsen", "Elsikkerhedsloven", "Lov om sikkerhed ved elektriske anlæg, elektriske installationer og elektrisk materiel (elsikkerhedsloven)", "Elsikkerhedsloven fastsaetter overordnede krav til sikkerhed ved elektriske anlæg, installationer og materiel i Danmark. Loven erstatter stærkstromsbekendtgorelsen som retsgrundlag fra 1. juli 2019. Loven regulerer autorisation af elinstallatoervirksomheder, tilsyn med elektriske installationer, markedsovervaagning af elektrisk materiel, og sanktioner ved overtraedelse. Sikkerhedsstyrelsen er tilsynsmyndighed.", "safety_rule", "in_force", "2019-07-01", "https://www.retsinformation.dk/eli/lta/2018/26"],
  ["sikkerhedsstyrelsen", "BEK om drift af elektriske anlæg", "Bekendtgoerelse om sikkerhed for drift af elektriske anlæg", "Fastsaetter krav til sikker drift af elektriske anlæg, herunder hoejspaendingsanlæg, transformerstationer og kabelanlæg. Krav til driftsinstruktioner, personalekvalifikationer, sikkerhedsafstande, arbejdsprocedurer og noedprocedurer. Anlaegsejeren er ansvarlig for at sikre, at drift og vedligeholdelse udfoeres i overensstemmelse med DS/EN 50110 (arbejde paa elektriske installationer).", "safety_rule", "in_force", "2019-07-01", "https://sik.dk/erhverv/elinstallationer-og-elanlaeg/love-og-regler"],
  ["sikkerhedsstyrelsen", "Gasreglementet afsnit A", "Gasreglementet afsnit A — almene bestemmelser for gasinstallationer", "Gasreglementets almene bestemmelser for gasinstallationer i Danmark. Daekker klassifikation af gasinstallationer, krav til materialer og komponenter, installations- og afprovningskrav, drifts- og vedligeholdelsesvejledninger. Gasleverandoerer og gasinstallatoerer skal sikre overholdelse af reglementets krav. Sikkerhedsstyrelsen foerer tilsyn og kan forbyde brug af installationer der ikke opfylder kravene.", "safety_rule", "in_force", "1991-06-01", "https://www.sik.dk/sites/default/files/2018-10/GAS_Gasreglement+afsnit+A+samlet_10102018.pdf"],
  ["sikkerhedsstyrelsen", "BEK om sikkerhed for gasanlæg", "Bekendtgoerelse om sikkerhed for gasanlæg", "Krav til sikkerhed for gasanlæg, herunder gaslagrings-, gastransmissions- og gasdistributionsanlæg. Anlægsejeren er ansvarlig for at anlægget projekteres, opfoeres, drives og vedligeholdes sikkert. Krav til risikovurdering, beredskabsplaner, periodisk inspektion og overvågning. Sikkerhedsstyrelsen godkender nye anlæg og foerer tilsyn med eksisterende anlæg.", "safety_rule", "in_force", "2018-04-01", "https://sik.dk/erhverv/gasinstallationer-og-gasanlaeg"],
  ["sikkerhedsstyrelsen", "BEK om sikkerhed for roerledninger til gas", "Bekendtgoerelse om sikkerhed for roerledninger til gas", "Krav til sikkerhed for gasroerledninger, herunder transmissions-, distributions- og stikledninger. Daekker materialevalg, svejsning, tryktestning, katodisk beskyttelse, overvaagning og laekagesoeegning. Ledningsejeren skal have beredskabsplan for gaslzek og roerbrud. Sikkerhedsstyrelsen foerer tilsyn.", "safety_rule", "in_force", "2018-04-01", "https://sik.dk/erhverv/gasinstallationer-og-gasanlaeg"],
];

const allRegs = [...ensRegs, ...sikRegs, ...EXPANSION_ENS_REGS, ...EXPANSION_SIK_REGS];
const insertRegBatch = db.transaction(() => {
  for (const r of allRegs) {
    insertRegulation.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]);
  }
});
insertRegBatch();
const ensCount = ensRegs.length + EXPANSION_ENS_REGS.length;
const sikCount = sikRegs.length + EXPANSION_SIK_REGS.length;
console.log(`Inserted ${ensCount} Energistyrelsen + ${sikCount} Sikkerhedsstyrelsen = ${allRegs.length} regulations`);

// ═══════════════════════════════════════════════════════════════
// GRID CODES (Energinet)
// ═══════════════════════════════════════════════════════════════

db.prepare("DELETE FROM grid_codes").run();

const insertGridCode = db.prepare(`
  INSERT INTO grid_codes (reference, title, text, code_type, version, effective_date, url) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const gridCodes = [
  // Technical regulations — electricity production
  ["TF 3.2.5", "Teknisk forskrift for vindkraftvaerker stoerre end 11 kW", "Krav til vindkraftvaerker med installeret effekt over 11 kW tilsluttet det danske elnet. Aktiv og reaktiv effektregulering, frekvensrespons, spaendingsregulering, fejlgennemkoeringskrav (fault ride-through), elkvalitet (harmonisk forvrængning, flicker), kommunikation med systemoperatoeren, overvaagning af driftsdata. Vindkraftvaerket skal levere spaendingsstoette under netfejl og genoptage normal drift inden 1 sekund. Gaelder land- og havsbaserede vindkraftvaerker.", "technical_regulation", "4.0", "2023-06-01", "https://energinet.dk/regler/tekniske-forskrifter/tf-3-2-5"],
  ["TF 3.2.1", "Teknisk forskrift for tilslutning af elproduktionsanlæg til elnettet", "Generelle krav til tilslutning af elproduktionsanlæg (undtagen vind og sol) til transmissions- og distributionsnet. Tekniske minimumskrav for aktiv effektregulering, reaktiv effektregulering, spaendingskvalitet, frekvensregulering, beskyttelsesindstillinger, kommunikationsudstyr. Anlaegsejeren ansvarlig for overholdelse foer idriftsaettelse og under drift.", "technical_regulation", "3.0", "2022-01-01", "https://energinet.dk/regler/tekniske-forskrifter/tf-3-2-1"],
  ["TF 3.2.2", "Teknisk forskrift for solcelleanlæg over 11 kW", "Krav til solcelleanlæg med installeret effekt over 11 kW tilsluttet det danske elnet. Aktiv og reaktiv effektregulering, frekvensrespons, spaendingsregulering, fejlgennemkoeringskrav, elkvalitet. Solcelleanlægget skal vaere i stand til at reducere aktiv effekt ved overfrekvens og levere reaktiv effekt for spaendingsstoette. Krav til kommunikation med systemoperatoeren og fjernstyring.", "technical_regulation", "2.0", "2023-01-01", "https://energinet.dk/regler/tekniske-forskrifter/tf-3-2-2"],
  // Technical regulations — consumption/storage
  ["TF 3.3.1", "Teknisk forskrift for tilslutning af forbrugsanlæg til transmissionsnettet", "Krav til store forbrugsanlæg (over 100 MW) direkte tilsluttet transmissionsnettet. Reaktiv effektkompensation, spaendingskvalitet, harmonisk emission, frekvensstabilitet, automatisk frakobling ved under-/overspaending. Kraever tilslutningsaftale med Energinet, teknisk forundersoegelse og godkendelse af beskyttelsesindstillinger.", "grid_connection", "2.0", "2021-06-01", "https://energinet.dk/regler/tekniske-forskrifter/tf-3-3-1"],
  ["TF 3.3.1 rev 4", "Teknisk forskrift for elektriske energilageranlæg (revision 4)", "Krav til batterilageranlæg og andre energilageranlæg tilsluttet elnettet. Daekker baade store lagre (over 1 MW) tilsluttet transmissionsnettet og mindre lagre i distributionsnettet. Krav til lade-/afladekarakteristik, frekvensrespons, reaktiv effekt, beskyttelse og kommunikation. Revision 4 opdaterer kravene iht. EU netregler for tilslutning af lagringsanlæg.", "technical_regulation", "4.0", "2024-01-01", "https://energinet.dk/el/horinger/afsluttede-horinger/teknisk-forskrift-3-3-1-krav-til-energilageranlaeg-revision-4/"],
  // Market regulations — electricity
  ["MR 5.1", "Markedsforskrift for balanceansvarlige aktoerer paa det danske elmarked", "Vilkaar og forpligtelser for balanceansvarlige aktoerer. Balanceansvarlige skal sikre balance mellem forbrug og produktion i portefoeljen og afregnes for ubalancer. Anmeldelse af handelsplaner, afregning af regulerkraft, krav til dataindberetning. Energinet administrerer balancemarkedet og udforer op- og nedreguering. Financiel sikkerhed paakraevet.", "balancing", "2.0", "2023-01-01", "https://energinet.dk/regler/markedsforskrifter/mr-5-1"],
  ["Forskrift A", "Forskrift A: Principper for elmarkedet", "Overordnede principper for elmarkedets funktion i Danmark. Regulerer markedsdesign, markedsdeltagernes roller og ansvar, handelsregler, afregnningsprincipper og markedsovervaagning. Forskriften er grundlaget for alle andre markedsforskrifter.", "market_regulation", "1.0", "2007-12-01", "https://energinet.dk/media/1mogcvih/forskrift-a-retningslinier-for-elhandel-12-2007.pdf"],
  ["Forskrift H3", "Forskrift H3: Afregning af engrosydelser og afgiftsforhold", "Regulerer afregning af engrosydelser paa elmarkedet, herunder producentbetaling, forbrugstariffer og afgiftsforhold. Fastsaetter principperne for beregning af tariffer for brug af transmissions- og distributionsnettet, samt afregning af systemydelser.", "market_regulation", "1.0", "2023-01-01", "https://forsyningstilsynet.dk/Media/638221622201572527/forskrift-h3-afregning-af-engrosydelser-og-afgiftsforhold.pdf"],
  // Market regulations — gas
  ["MR 6.1", "Markedsforskrift for gasmarkedet — balancering", "Balancering paa det danske gasmarked. Gasleverandoerer anmelder dagsplaner for tilfoersel og udtag. Energinet overvager gasbalancen og kan traede korrigerende foranstaltninger. Ubalanceomkostninger beregnes paa daglige gasprisreferencer. Implementerer EU-forordning om gasbalancering (312/2014).", "market_regulation", "3.0", "2023-04-01", "https://energinet.dk/regler/markedsforskrifter/mr-6-1"],
  // Ancillary services
  ["SYR 1.1", "Systemydelser fra decentrale kraftvaerker og VE-anlæg", "Levering af systemydelser (ancillary services) fra decentrale kraftvaerker og VE-anlæg til Energinet. Systemydelser: frekvensreserver (FCR, aFRR, mFRR), spaendingsstoette, sortstart-kapabilitet. Markedsbaseret indkoeb via Energinets platform. Minimumskrav til responstid, kapacitet og tilgaengelighed.", "ancillary_services", "1.0", "2022-09-01", "https://energinet.dk/regler/systemydelser/syr-1-1"],
  // RfG / EU network codes
  ["RfG Bilag 1.A", "RfG-krav: Generisk signalliste for produktionsanlæg — krav til realtidsinformation", "Bilag til Requirements for Generators (RfG) EU netregler. Specificerer krav til realtidsinformation (SCADA-signaler) fra produktionsanlæg til systemoperatoeren. Signalliste daekker aktiv effekt, reaktiv effekt, spaending, frekvens, driftsstatus og alarmering. Kravene er implementeret i de danske tekniske forskrifter.", "technical_regulation", "1.0", "2023-01-01", "https://energinet.dk/el/horinger/afsluttede-horinger/bilag-1a-generisk-signalliste-for-produktionsanlaeg/"],
  // Grid connection rules
  ["Tilslutningsvilkaar for elproduktion", "Energinets tilslutningsvilkaar for nye elproduktionsanlæg", "Generelle vilkaar for tilslutning af nye elproduktionsanlæg til det danske transmissions- og distributionsnet. Processen fra anmodning til idriftsaettelse: tilslutningsanmodning, kapacitetsanalyse, tilslutningsaftale, teknisk projektering, idriftsaettelsestest, endelig godkendelse. Vilkaarene supplerer de tekniske forskrifter med procedurelle krav.", "grid_connection", "1.0", "2023-01-01", "https://energinet.dk/regler/el"],
];

const allGridCodes = [...gridCodes, ...EXPANSION_GRID_CODES];
const insertGCBatch = db.transaction(() => {
  for (const g of allGridCodes) {
    insertGridCode.run(g[0], g[1], g[2], g[3], g[4], g[5], g[6]);
  }
});
insertGCBatch();
console.log(`Inserted ${allGridCodes.length} Energinet grid codes`);

// ═══════════════════════════════════════════════════════════════
// DECISIONS (Forsyningstilsynet)
// ═══════════════════════════════════════════════════════════════

db.prepare("DELETE FROM decisions").run();

const insertDecision = db.prepare(`
  INSERT INTO decisions (reference, title, text, decision_type, date_decided, parties, url) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const decisions = [
  // Revenue cap / tariff decisions
  ["FT/2024/EL/001", "Afgorelse om Radius Elnet A/S' indtagtsramme for 2024", "Forsyningstilsynet har fastsat Radius Elnet A/S' oekonomiske ramme for 2024 til 4.832 mio. kr. baseret paa effektivitetskrav, investeringsbehov og driftsomkostninger. Godkendt saeromkostninger til kabellaegning og smart grid-investeringer. Effektivitetskrav paa 2,5% aarligt for driftsomkostninger. Kan paaklages til Energiklagenaevnet.", "revenue_cap", "2024-03-15", "Radius Elnet A/S", "https://forsyningstilsynet.dk/el/afgoerelser"],
  ["FT/2024/EL/002", "N1 A/S CVR-nr. 25 15 41 50 — Reguleringsregnskab for 2024", "Forsyningstilsynet har modtaget og behandlet N1 A/S' reguleringsregnskab for 2024. Reguleringsregnskabet dokumenterer overensstemmelse med den fastsatte indtagtsramme. N1 er Danmarks stoerste elnetvirksomhed og driver distributionsnettet i store dele af Sjaelland, Fyn og Sydjylland.", "revenue_cap", "2024-12-01", "N1 A/S", "https://forsyningstilsynet.dk/Media/638876504610488263/N1%20-%20Reguleringsregnskab%202024%20underskrevet.pdf"],
  // Heat tariff decisions
  ["FT/2023/VARME/042", "Afgorelse om fjernvarmetariffer for Koebenhavns Fjernvarme 2023", "Vurdering af Koebenhavns Fjernvarmes tariffer for 2023. Tariffer i overensstemmelse med varmeforsyningslovens hvile-i-sig-selv-princip. Tarifstigningen paa 8,3% skyldes hoejere braendselspriser og investeringer i geotermi og varmepumper. Godkendt med forbehold for efterfoelgende investeringskontrol.", "tariff", "2023-11-22", "Koebenhavns Fjernvarme", "https://forsyningstilsynet.dk/varme/afgoerelser"],
  // Methodology approvals
  ["FT/2024/EL/METODE/003", "Metodegodkendelse: Energinets metode for beregning af systemtariffer", "Godkendelse af Energinets metode for beregning af tariffer for brug af transmissionsnettet. Metoden fordeler omkostninger paa basis af kapacitetsudnyttelse og afstand. Tarif bestaar af fast element (kapacitetsafhaengigt) og variabelt element (energiafhaengigt). Krav om aarlig offentliggoerelse af beregningsgrundlag iht. EU netadgangsregler.", "methodology", "2024-06-01", "Energinet Elsystemansvar A/S", "https://forsyningstilsynet.dk/el/afgoerelser"],
  ["FT/2024/EL/METODE/004", "Delvis godkendelse af Energinets metode for tarifering af forbrugstilsluttede anlæg i transmissionsnettet", "Energinet notificerede metode for tarifering af forbrugstilsluttede anlæg 27. september 2023. Forsyningstilsynet godkender delvist metoden med forbehold om yderligere gennemsigtighed i omkostningsfordelingen mellem forbrugstilsluttede og produktionstilsluttede anlæg.", "methodology", "2024-09-01", "Energinet Elsystemansvar A/S", "https://forsyningstilsynet.dk/Media/638796252662433562/Udkast%20til%20delvis%20godkendelse%20af%20Energinets%20metode%20for%20tarifering%20af%20forbrugstilsluttede%20anl%C3%A6g%20i%20transmissionsnettet.pdf"],
  ["FT/2024/EL/METODE/005", "Godkendelse af Energinets metode for producentbetaling", "Forsyningstilsynet har godkendt Energinets metode for beregning af producentbetaling for brug af transmissionsnettet. Metoden fastsaetter, hvordan elproducenter tilsluttet transmissionsnettet bidrager til nettets omkostninger.", "methodology", "2024-01-01", "Energinet Elsystemansvar A/S", "https://forsyningstilsynet.dk/lovgivning/hoeringer/hoering-over-forsyningstilsynets-udkast-til-afgoerelse-om-godkendelse-af-energinets-metode-for-producentbetaling"],
  // Benchmarking
  ["FT/2023/GAS/011", "Benchmarking af gasdistributionsselskaber 2023", "Aarlig benchmarking af gasdistributionsselskaber. Sammenligning af effektivitet baseret paa totalomkostninger, leveringssikkerhed og kundetilfredshed. Evida: effektivitetsscore 94%, over gennemsnittet. Individuelle effektivitetskrav baseret paa resultater. Selskaber under 85% faar skaerpede krav.", "benchmark", "2023-09-30", "Evida A/S, alle gasdistributionsselskaber", "https://forsyningstilsynet.dk/gas/afgoerelser"],
  // Complaint decisions
  ["FT/2024/KLAGE/007", "Klageafgorelse: Forbrugerklage over urimelig tarif fra lokalt elnetselskab", "Erhvervsforbruger anfaegtede hoejspaendingstarif som uforholdsmæssigt hoej. Forsyningstilsynet finder at tarifferne afspejler faktiske omkostninger uden krydssubsidiering. Klagen afvises. Kan indbringes for Energiklagenaevnet.", "complaint", "2024-02-28", "Erhvervsforbruger (anonymiseret) vs. lokalt elnetselskab", "https://forsyningstilsynet.dk/el/afgoerelser"],
  // Gas tariff
  ["FT/2024/GAS/TARIF/001", "Vestre Landsrets dom om tarif for transport af gas fra Nordsoeen", "Vestre Landsret har afsagt dom i sag om tarif for transport af gas fra Nordsoeen til den jyske vestkyst. Dommen praeaeciserer Forsyningstilsynets kompetence til at fastsaette gastariffer og de principper der gaelder for beregning af rimelige transporttariffer for naturgas.", "tariff", "2024-01-01", "Evida, gasproducenter", "https://forsyningstilsynet.dk/aktuelt/nyheder/vestre-landsret-har-afsagt-dom-i-sag-om-tarif-for-transport-af-gas-fra-nordsoeen-til-den-jyske-vestkyst"],
  // Revenue cap regulations
  ["FT/2024/BEK/INDTAGTSRAMME", "Hoering over udkast til bekendtgoerelser om indtagtsrammer og reguleringsregnskaber for Energinet-koncernen", "Forsyningstilsynet har sendt udkast til bekendtgoerelser om indtagtsrammer og reguleringsregnskaber for Energinet-koncernens datterselskaber i hoering. Bekendtgoerelserne fastsaetter regler for beregning af indtagtsrammer, effektivitetskrav, investeringsrammer og regnskabsaflaeggelse for Energinets transmissionsaktiviteter.", "revenue_cap", "2024-09-01", "Energinet-koncernen", "https://forsyningstilsynet.dk/vejledning-og-indberetning/hoeringer/2024/sep/hoering-over-udkast-til-bekendtgoerelser-om-indtaegtsrammer-og-reguleringsregnskaber-for-energinet-koncernens-datterselskaber"],
  // Faktureringsbekendtgoerelse
  ["FT/2024/EL/FAKTURERING", "Fakturerings-bekendtgoerelse paa elomraadet", "Forsyningstilsynet har udstedt nye regler for fakturering af elkunder. Bekendtgorelsen fastsaetter krav til indhold og format af elregninger, herunder visning af forbrugsprofil, tarifoversigt, sammenligning med foregaaende aar, og information om klagemuligheder. Implementerer kravene i EU direktiv 2019/944 om det indre marked for elektricitet.", "methodology", "2024-01-01", "Alle elhandelsvirksomheder", "https://forsyningstilsynet.dk/el/afgoerelser/fakturerings-bekendtgoerelse-paa-elomraadet/"],
  // Supply interruption reporting
  ["FT/2024/EL/INDBERETNING", "Hoering: Bekendtgoerelse om elhandelsvirksomheders indberetning af forsyningsafbrydelser", "Ny bekendtgoerelse om elhandelsvirksomheders pligt til at indberette forsyningsafbrydelser til Forsyningstilsynet. Formaaet er at styrke forbrugerbeskyttelsen og give Forsyningstilsynet bedre overblik over leveringssikkerheden i elsektoren.", "methodology", "2024-01-01", "Alle elhandelsvirksomheder", "https://forsyningstilsynet.dk/lovgivning/hoeringer/hoering-vedr-ny-bekendtgoerelse-om-elhandelsvirksomheders-indberetning-af-forsyningsafbrydelser"],
];

const allDecisions = [...decisions, ...EXPANSION_DECISIONS];
const insertDecBatch = db.transaction(() => {
  for (const d of allDecisions) {
    insertDecision.run(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
});
insertDecBatch();
console.log(`Inserted ${allDecisions.length} Forsyningstilsynet decisions`);

// ═══════════════════════════════════════════════════════════════
// REBUILD FTS INDEXES
// ═══════════════════════════════════════════════════════════════

db.exec("INSERT INTO regulations_fts(regulations_fts) VALUES('rebuild')");
db.exec("INSERT INTO grid_codes_fts(grid_codes_fts) VALUES('rebuild')");
db.exec("INSERT INTO decisions_fts(decisions_fts) VALUES('rebuild')");

// ═══════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// DB METADATA
// ═══════════════════════════════════════════════════════════════

db.exec(`CREATE TABLE IF NOT EXISTS db_metadata (
  key   TEXT PRIMARY KEY,
  value TEXT,
  last_updated TEXT DEFAULT (datetime('now'))
)`);

const stats = {
  regulators: (db.prepare("SELECT count(*) as n FROM regulators").get() as { n: number }).n,
  regulations: (db.prepare("SELECT count(*) as n FROM regulations").get() as { n: number }).n,
  grid_codes: (db.prepare("SELECT count(*) as n FROM grid_codes").get() as { n: number }).n,
  decisions: (db.prepare("SELECT count(*) as n FROM decisions").get() as { n: number }).n,
  ens: (db.prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = 'energistyrelsen'").get() as { n: number }).n,
  sik: (db.prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = 'sikkerhedsstyrelsen'").get() as { n: number }).n,
};

const insertMeta = db.prepare("INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)");
insertMeta.run("schema_version", "1.0");
insertMeta.run("tier", "free");
insertMeta.run("domain", "danish-energy-regulation");
insertMeta.run("build_date", new Date().toISOString().split("T")[0]);
insertMeta.run("regulations_count", String(stats.regulations));
insertMeta.run("grid_codes_count", String(stats.grid_codes));
insertMeta.run("decisions_count", String(stats.decisions));
insertMeta.run("total_records", String(stats.regulations + stats.grid_codes + stats.decisions));

console.log(`\nDatabase summary:`);
console.log(`  Regulators:         ${stats.regulators}`);
console.log(`  Regulations:        ${stats.regulations} (ENS: ${stats.ens}, SIK: ${stats.sik})`);
console.log(`  Grid codes:         ${stats.grid_codes} (Energinet)`);
console.log(`  Decisions:          ${stats.decisions} (Forsyningstilsynet)`);
console.log(`  Total documents:    ${stats.regulations + stats.grid_codes + stats.decisions}`);
console.log(`\nDone. Database at ${DB_PATH}`);

db.close();
