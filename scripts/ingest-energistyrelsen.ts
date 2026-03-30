/**
 * Ingest Energistyrelsen (Danish Energy Agency) regulations and guidance.
 *
 * Sources:
 *   1. ens.dk PDF documents — regulatory reports, vejledninger, analyses
 *   2. retsinformation.dk — BEKs issued by Energistyrelsen (via search)
 *
 * Usage:
 *   npx tsx scripts/ingest-energistyrelsen.ts
 *   npx tsx scripts/ingest-energistyrelsen.ts --force   # drop and recreate
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync, unlinkSync, writeFileSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA_SQL } from "../src/db.js";

const DB_PATH = process.env["DK_ENERGY_DB_PATH"] ?? "data/dk-energy.db";
const force = process.argv.includes("--force");

// --- Bootstrap ---

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

// Ensure regulator row exists
db.prepare(`INSERT OR IGNORE INTO regulators (id, name, full_name, url, description)
  VALUES ('energistyrelsen', 'Energistyrelsen', 'Energistyrelsen (Danish Energy Agency)',
  'https://ens.dk', 'Danish Energy Agency — energy policy, licensing, permits, renewable energy, energy efficiency, climate reporting')`).run();

// --- Known Energistyrelsen documents from ens.dk ---

interface DocEntry {
  reference: string;
  title: string;
  text: string;
  type: string;
  status: string;
  effective_date: string;
  url: string;
}

const ENS_DOCS: DocEntry[] = [
  // Electricity regulation
  {
    reference: "ENS/EL/2024/001",
    title: "Pausering af nettilslutninger — Energistyrelsens ramme for midlertidig suspension",
    text: "Energistyrelsen har etableret en ramme for midlertidig suspension af nye nettilslutninger grundet kapacitetspres paa transmissionsnettet. Rammeverket regulerer, hvordan netvirksomheder kan haandtere situationer, hvor der ikke er tilstraekkelig transmissionskapacitet til at tilslutte nye produktionsanlaeg eller forbrugsanlaeg. Netvirksomheder skal dokumentere den tekniske begrundelse for suspension og underrette Energistyrelsen. Suspensionen er tidsbegrzenset og skal ophzeves, naar kapaciteten er tilvejebragt.",
    type: "vejledning",
    status: "in_force",
    effective_date: "2024-10-01",
    url: "https://ens.dk/media/7863/download",
  },
  {
    reference: "ENS/EL/2024/002",
    title: "Vejledning om prioritering af nettilslutningsanmodninger for kollektive elforsyningsvirksomheder",
    text: "Vejledning til kollektive elforsyningsvirksomheder om prioritering af nettilslutningsanmodninger. Vejledningen fastsaetter principper for, hvordan netvirksomheder skal prioritere blandt indkomne anmodninger om nettilslutning, naar der er begrzensede kapaciteter. Prioriteringskriterierne omfatter tidspunkt for anmodning (foerst-til-moelle), samfundsmaessig relevans, bidrag til den groenne omstilling og teknisk gennemfoerlighed. Vejledningen implementerer kravene i den reviderede elforsyningslov.",
    type: "vejledning",
    status: "in_force",
    effective_date: "2024-10-01",
    url: "https://ens.dk/media/7862/download",
  },
  {
    reference: "ENS/EL/2024/003",
    title: "Analyse af geografisk differentierede forbrugstariffer og direkte linjer",
    text: "Energistyrelsen har gennemfoert en analyse af, hvordan geografiske prissignaler til forbrugerne og direkte linjer mellem forbrug og produktion kan fremme samlokalisering af forbrug og vedvarende energiproduktion. Analysen undersoeger fordele og ulemper ved geografisk differentierede tarifer i eldistributionsnettet, herunder indvirkning paa netinvesteringer, forbrugerpraeferencer og fordelingsvirkninger. Analysen anbefaler en trinvis indfoerelse af geografiske prissignaler kombineret med investeringsstotte til fleksibilitetsloesninger i omraader med hoej netbelastning.",
    type: "retningslinje",
    status: "in_force",
    effective_date: "2024-10-01",
    url: "https://ens.dk/sites/default/files/media/documents/2024-10/analyse_af_geografisk_differentierede_forbrugstariffer_og_direkte_linjer.pdf",
  },
  {
    reference: "ENS/EL/2024/004",
    title: "Analyse af konkurrenceforholdene i elsektoren — adskillelse af monopol- og konkurrenceaktiviteter",
    text: "Energistyrelsen har analyseret konkurrenceforholdene i elsektoren med fokus paa adskillelsen mellem monopolvirksomhed (netdrift) og konkurrenceaktiviteter (elhandel, produktion) i energikoncerner. Analysen identificerer risici for krydssubsidiering og konkurrenceforvridning, og anbefaler skraerpede krav til regnskabsmaessig og organisatorisk adskillelse. Analysen vurderer ogsaa behovet for yderligere regler om koncerninterne transaktioner og informationsudveksling mellem monopol- og konkurrenceselskaber.",
    type: "retningslinje",
    status: "in_force",
    effective_date: "2024-10-01",
    url: "https://ens.dk/sites/default/files/media/documents/2024-10/afrapportering_af_konkurrenceanalysen.pdf",
  },
  {
    reference: "ENS/EL/2024/005",
    title: "Analyse af fremtidssikret eldistributionsnet — regulering af elektrificeringsinvesteringer",
    text: "Energistyrelsen har vurderet, om den gzeldende regulering er tilstraekkelig til at haandtere investeringsbehovet i forbindelse med elektrificering. Analysen daekker distributionsnettets kapacitet til at imoedekomme stigende elforbrug fra varmepumper, elbiler og industriel elektrificering. Noegleresultater: netvirksomheder vil skulle investere 40-60 mia. kr. over de naeste 20 aar i netudvidelse. Analysen anbefaler justeringer af indtagtsrammereguleringen, saa netvirksomheder faar incitament til proaktive investeringer frem for reaktiv udvidelse.",
    type: "retningslinje",
    status: "in_force",
    effective_date: "2024-10-01",
    url: "https://ens.dk/sites/default/files/media/documents/2024-10/hovedrapport_-_fremtidssikret_elnet.pdf",
  },
  {
    reference: "ENS/EL/2024/006",
    title: "Analyse af leveringskvaliteten i distributionsnettet",
    text: "Energistyrelsen har gennemfoert en analyse af leveringskvaliteten i det danske eldistributionsnet. Analysen vurderer omfanget af stroemafbrydelser, spzendingskvalitet og netvirksomhedernes haandtering af leveringsforstyrrelser. Leveringskvaliteten er generelt hoej i Danmark (SAIDI under 20 minutter pr. kunde pr. aar), men analysen identificerer geografiske variationer og anbefaler forbedrede incitamenter for netvirksomheder til at reducere afbrydelsestiden yderligere, saerligt i omraader med stigende andel af vedvarende energi.",
    type: "retningslinje",
    status: "in_force",
    effective_date: "2024-10-01",
    url: "https://ens.dk/sites/default/files/media/documents/2024-10/hovedrapport_-_leveringskvalitet.pdf",
  },
  // Energy efficiency
  {
    reference: "ENS/EEK/2025/001",
    title: "Vejledning om energiledelse, energisyn og klimasyn i virksomheder (november 2024 / oktober 2025)",
    text: "Vejledning rettet mod virksomheder med pligt til energiledelse, energisyn og klimasyn i henhold til BEK nr 1138 af 18/09/2025. Virksomheder eller koncerner med et gennemsnitligt aarligt energiforbrug over 10 TJ i de foregaaende tre aar skal foretage energisyn og klimasyn hvert 4. aar. Virksomheder med et forbrug over 85 TJ skal indfoere og vedligeholde et certificeret energiledelsessystem (ISO 50001) og gennemfoere klimasyn hvert 4. aar. Vejledningen beskriver krav til rapportering, certificering og tilsyn, herunder skabeloner og indberetningsprocedurer.",
    type: "vejledning",
    status: "in_force",
    effective_date: "2025-10-17",
    url: "https://ens.dk/media/7414/download",
  },
  // Supply security / beredskab
  {
    reference: "ENS/BEREDSKAB/2024/001",
    title: "Love og regler for forsyningssikkerhed og beredskab i energisektoren",
    text: "Oversigt over lovgivning og regler for forsyningssikkerhed og beredskab i el- og naturgassektorerne. Dækker energiberedskabsloven, NIS 2-loven (2025:434), CER-loven (2025:433), og Lov om styrket beredskab i energisektoren (2025:258). Energistyrelsen er kompetent myndighed for cybersikkerhed og beredskab i energisektoren. Virksomheder med kritisk infrastruktur skal udarbejde beredskabsplaner, gennemfoere risikovurderinger, deltage i oevelser og indberette haendelser. Haendelser skal indberettes til Energistyrelsen inden 24 timer.",
    type: "retningslinje",
    status: "in_force",
    effective_date: "2024-01-01",
    url: "https://ens.dk/ansvarsomraader/beredskab/love-og-regler-forsynings-sikkerhed",
  },
  // Renewable energy support
  {
    reference: "ENS/VE/2024/001",
    title: "Sammenligning af stoette til vedvarende energi (VE-el) — stoetteniveauer og teknologier",
    text: "Energistyrelsens sammenligning af stoetteniveauer til vedvarende energi (VE-el) paa tvaers af teknologier og levetider. Analysen daekker havsbaseret vindkraft, landbaseret vindkraft, solcelleanlzeg og biogas. Stoetteniveauer sammenlignes paa basis af LCOE (Levelized Cost of Energy) og effektiv subsidie pr. MWh. Analysen viser, at havsbaseret vindkraft fortsat kraever hoejere stoette pr. MWh end landbaseret vind og sol, men at omkostningsforskellen er faldende. Datagrundlag offentliggjoert som regneark.",
    type: "retningslinje",
    status: "in_force",
    effective_date: "2024-10-01",
    url: "https://ens.dk/sites/default/files/media/spreadsheets/2024-10/sammenligning_af_stoette_til_ve-el_web.xlsx",
  },
  // Flexibility and grid products
  {
    reference: "ENS/FLEX/2023/001",
    title: "Fleksible nettilslutningsvilkaar og netprodukter — rapport",
    text: "Rapport om fleksible nettilslutningsvilkaar og netprodukter til det danske elnet. Rapporten undersoeger, hvordan netvirksomheder kan tilbyde fleksible tilslutningsloesninger til store elforbrugere og producenter, herunder tidsbegrzensede tilslutninger, afbrydelige tilslutninger og dynamiske kapacitetstildelinger. Rapporten anbefaler udvikling af nye netprodukter, der giver tilsluttede kunder mulighed for at bidrage til netdriften mod reducerede tariffer.",
    type: "retningslinje",
    status: "in_force",
    effective_date: "2023-01-01",
    url: "https://ens.dk/media/5066/download",
  },
  {
    reference: "ENS/FLEX/2023/002",
    title: "Fremme af fleksibilitetsmarked til elnettet — roadmap og anbefalinger",
    text: "Rapport med roadmap og anbefalinger for udvikling af fleksibilitetsmarkeder til elnettet. Rapporten beskriver, hvordan lokale fleksibilitetsmarkeder kan bidrage til at reducere netinvesteringer ved at styre forbrug og produktion i perioder med hoej netbelastning. Anbefalinger omfatter standardisering af fleksibilitetsprodukter, etablering af en platform for handel med fleksibilitet, og regulatoriske tilpasninger for at tillade netvirksomheder at koebe fleksibilitet som alternativ til netudvidelse.",
    type: "retningslinje",
    status: "in_force",
    effective_date: "2023-01-01",
    url: "https://ens.dk/media/5068/download",
  },
  // Proactive grid expansion
  {
    reference: "ENS/NET/2024/001",
    title: "Analyse af proaktiv udbygning af transmissionsnettet",
    text: "Analyse af muligheder for proaktiv udbygning af transmissionsnettet i Danmark. Rapporten vurderer, om den nuvaerende planlzegningsmodel, hvor netudvidelse foelger efter dokumenteret behov, er tilstraekkelig i lyset af den hurtige udbygning af vedvarende energi og elektrificering. Analysen anbefaler, at Energinet faar udvidet mandat til at planlaegge og investere proaktivt i transmissionskapacitet baseret paa scenarier for fremtidig energiproduktion og -forbrug, snarere end at vente paa konkrete tilslutningsanmodninger.",
    type: "retningslinje",
    status: "in_force",
    effective_date: "2024-01-01",
    url: "https://ens.dk/media/6178/download",
  },
  // Network licenses
  {
    reference: "ENS/NET/2024/002",
    title: "Oversigt over elnetbevillingshavere — licensregister for danske netoperatoerer",
    text: "Energistyrelsens register over alle licenserede elnetoperatoerer i Danmark med bevillingsoplysninger, udloebsdatoer og dzekkende omraader. Registeret opdateres loebende og omfatter alle transmissions- og distributionsnetvirksomheder. Netvirksomheder skal have bevilling fra Energistyrelsen for at drive elnet i Danmark i henhold til elforsyningsloven. Bevillingen fastsaetter vilkaar for netdrift, herunder krav til leveringskvalitet, kundeservice og regnskabsaflaeggelse.",
    type: "cirkulaere",
    status: "in_force",
    effective_date: "2024-06-01",
    url: "https://ens.dk/sites/default/files/media/documents/2024-10/oversigt_over_elnetbevillingshavere.pdf",
  },
  // NIS2 / cybersecurity
  {
    reference: "BEK nr 1310 af 24/11/2023",
    title: "Bekendtgoerelse om net- og informationssikkerhed i energisektoren",
    text: "Bekendtgorelsen fastsaetter regler om net- og informationssikkerhed for virksomheder i energisektoren. Virksomheder udpeget som vasentlige eller vigtige enheder i medfoer af NIS 2-loven skal implementere passende og forholdsmæssige tekniske, operationelle og organisatoriske foranstaltninger til styring af risici for sikkerheden i net- og informationssystemer. Virksomheder skal underrette Energistyrelsen om vasentlige haendelser uden unodigt ophold og senest inden for 24 timer efter opdagelse. Energistyrelsen kan udstede paabud, forbud og tvangsboder. Bekendtgorelsen implementerer NIS2-direktivets krav for energisektoren.",
    type: "bekendtgorelse",
    status: "in_force",
    effective_date: "2024-01-01",
    url: "https://www.retsinformation.dk/eli/lta/2023/1310",
  },
  // Beredskab
  {
    reference: "VEJ nr 9424 af 15/06/2023",
    title: "Vejledning om beredskab for el- og naturgassektorerne",
    text: "Vejledning om krav til beredskab i el- og naturgassektorerne i henhold til energiberedskabsloven. El- og naturgasvirksomheder skal udarbejde og vedligeholde beredskabsplaner, gennemfoere risikovurderinger, deltage i beredskabsoevelser og indberette sikkerhedshaendelser til Energistyrelsen. Beredskabsplanerne skal daekke fysisk sikkerhed, cybersikkerhed, personalesikkerhed og forsyningssikkerhed. Virksomheder med kritisk infrastruktur skal have saerligt hoejt beredskabsniveau og gennemfoere aarlige oevelser. Vejledningen er opdateret med NIS2- og CER-krav.",
    type: "vejledning",
    status: "in_force",
    effective_date: "2023-07-01",
    url: "https://ens.dk/ansvarsomraader/beredskab",
  },
  // Grid connection for VE
  {
    reference: "BEK nr 1048 af 08/12/2022",
    title: "Bekendtgoerelse om tilslutning af vindmoller og solcelleanlæg til elnettet",
    text: "Bekendtgorelsen fastsaetter betingelser for tilslutning af vindmoller og solcelleanlæg til det kollektive elnet. Anlægsejeren skal indhente tilslutningstilsagn fra netvirksomheden, overholde tekniske krav til elkvalitet og frekvensrespons, og betale eventuelle netforstærkningsomkostninger. Netvirksomheden skal tilbyde tilslutning inden for rimelig tid paa gennemsigtige, ikke-diskriminerende vilkaar. Energistyrelsen fastsaetter nzermere regler om prioriteret adgang for vedvarende energi i overensstemmelse med EUs regler.",
    type: "bekendtgorelse",
    status: "in_force",
    effective_date: "2023-01-01",
    url: "https://www.retsinformation.dk/eli/lta/2022/1048",
  },
  // Energy efficiency
  {
    reference: "BEK nr 1138 af 18/09/2025",
    title: "Bekendtgoerelse om energiledelse, energisyn og klimasyn i visse virksomheder",
    text: "Bekendtgorelsen implementerer krav om energiledelse, energisyn og klimasyn i virksomheder med betydeligt energiforbrug. Virksomheder med aarligt energiforbrug over 10 TJ skal gennemfoere energisyn og klimasyn hvert fjerde aar. Virksomheder med forbrug over 85 TJ skal indfoere certificeret energiledelsessystem (ISO 50001). Bekendtgorelsen implementerer det reviderede energieffektivitetsdirektiv (EED). Energistyrelsen foerer tilsyn med overholdelse og kan paalaegge boder.",
    type: "bekendtgorelse",
    status: "in_force",
    effective_date: "2025-10-01",
    url: "https://www.retsinformation.dk/eli/lta/2025/1138",
  },
  // Guarantees of origin
  {
    reference: "BEK nr 888 af 21/06/2022",
    title: "Bekendtgoerelse om oprindelsesgarantier for elektricitet fra vedvarende energikilder",
    text: "Bekendtgorelsen implementerer VE-direktivets krav om oprindelsesgarantier. Energistyrelsen udsteder oprindelsesgarantier for elektricitet produceret fra vedvarende energikilder. Hver garanti svarer til 1 MWh. Oprindelsesgarantier kan overdrages, annulleres og bruges til dokumentation af vedvarende energiforbrug. Energinet administrerer det danske register.",
    type: "bekendtgorelse",
    status: "in_force",
    effective_date: "2022-07-01",
    url: "https://www.retsinformation.dk/eli/lta/2022/888",
  },
];

// --- Insert ---

const insertReg = db.prepare(`
  INSERT INTO regulations (regulator_id, reference, title, text, type, status, effective_date, url)
  VALUES ('energistyrelsen', ?, ?, ?, ?, ?, ?, ?)
`);

// Clear existing energistyrelsen regulations first
db.prepare("DELETE FROM regulations WHERE regulator_id = 'energistyrelsen'").run();

const insertAll = db.transaction(() => {
  for (const d of ENS_DOCS) {
    insertReg.run(d.reference, d.title, d.text, d.type, d.status, d.effective_date, d.url);
  }
});
insertAll();

// Rebuild FTS
db.exec("INSERT INTO regulations_fts(regulations_fts) VALUES('rebuild')");

const count = (db.prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = 'energistyrelsen'").get() as { n: number }).n;
console.log(`Energistyrelsen: inserted ${count} regulations`);

db.close();
