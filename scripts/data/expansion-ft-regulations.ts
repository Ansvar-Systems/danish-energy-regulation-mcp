/**
 * Forsyningstilsynet-administered bekendtgoerelser (regulations).
 *
 * These are ministerial regulations that Forsyningstilsynet administers
 * and enforces — distinct from the decisions (afgoerelser) that FT issues.
 *
 * Each entry: [regulator_id, reference, title, text, type, status, effective_date, url]
 *
 * Sources: retsinformation.dk, forsyningstilsynet.dk
 */

export const EXPANSION_FT_REGS: [string, string, string, string, string, string, string, string][] = [
  // ═══════════════════════════════════════════════════════════════
  // ELECTRICITY — TARIFFS & REVENUE CAPS
  // ═══════════════════════════════════════════════════════════════

  [
    "forsyningstilsynet",
    "BEK nr 1594 af 18/11/2020",
    "Bekendtgoerelse om elnetvirksomhedernes tarifering m.v. (Tariferingsbekendtgoerelsen)",
    "Fastsaetter regler for elnetvirksomhedernes tarifering, herunder principper for beregning af nettariffer, tidsdifferentiering, tarifstrukturer og vilkaar for transport af elektricitet. Netvirksomheder skal sikre gennemsigtige, ikke-diskriminerende tariffer der afspejler de faktiske omkostninger ved nettjenester. Implementerer kravene i elforsyningsloven og EU direktiv 2019/944.",
    "bekendtgorelse",
    "in_force",
    "2021-01-01",
    "https://www.retsinformation.dk/eli/lta/2020/1594"
  ],

  [
    "forsyningstilsynet",
    "BEK nr 969 af 27/06/2022",
    "Bekendtgoerelse om indtaegtsrammer for netvirksomheder (Indtaegtsrammebekendtgoerelsen)",
    "Fastsaetter regler for beregning af indtaegtsrammer for elnetvirksomheder. Indtaegtsrammen er det maksimale beloeb en netvirksomhed maa opkraeve i tariffer. Regler om regulatorisk aktivbase, afskrivninger, rimeligt afkast, driftsomkostninger, effektivitetskrav og haandtering af ekstraordinaere investeringer. Forsyningstilsynet fastsaetter individuelle indtaegtsrammer aarligt.",
    "bekendtgorelse",
    "in_force",
    "2022-07-01",
    "https://www.retsinformation.dk/eli/lta/2022/969"
  ],

  [
    "forsyningstilsynet",
    "BEK nr 970 af 27/06/2022",
    "Bekendtgoerelse om netvirksomheders reguleringsregnskaber (Reguleringsregnskabsbekendtgoerelsen)",
    "Fastsaetter regler for netvirksomheders aflaeggelse af reguleringsregnskaber til Forsyningstilsynet. Reguleringsregnskabet dokumenterer overensstemmelse med den fastsatte indtaegtsramme. Krav til regnskabsformat, revisionspaaategning, indberetningsfrister og dokumentation af saerlige poster. Netvirksomheder skal indberette senest den 1. juni for foregaaende reguleringsaar.",
    "bekendtgorelse",
    "in_force",
    "2022-07-01",
    "https://www.retsinformation.dk/eli/lta/2022/970"
  ],

  // ═══════════════════════════════════════════════════════════════
  // ELECTRICITY — BENCHMARKING & EFFICIENCY
  // ═══════════════════════════════════════════════════════════════

  [
    "forsyningstilsynet",
    "BEK nr 1264 af 09/11/2015",
    "Bekendtgoerelse om benchmarking af netvirksomheder og regionale transmissionsvirksomheder (Benchmarkbekendtgoerelsen)",
    "Fastsaetter regler for Forsyningstilsynets aarlige benchmarking af elnetvirksomheder. Benchmarkingmodellen sammenligner netvirksomhedernes driftsomkostninger med udgangspunkt i en DEA-model (Data Envelopment Analysis) og fastsaetter individuelle effektivitetskrav. Driftsomkostninger korrigeres for netstruktur, kundetaethed og geografiske forhold. Resultater anvendes til fastsaettelse af indtaegtsrammer.",
    "bekendtgorelse",
    "in_force",
    "2016-01-01",
    "https://www.retsinformation.dk/eli/lta/2015/1264"
  ],

  // ═══════════════════════════════════════════════════════════════
  // ELECTRICITY — REPORTING & CONSUMER INFORMATION
  // ═══════════════════════════════════════════════════════════════

  [
    "forsyningstilsynet",
    "BEK nr 1477 af 12/12/2019",
    "Bekendtgoerelse om netvirksomheders indberetningspligt (Indberetningsbekendtgoerelsen)",
    "Fastsaetter regler for netvirksomheders pligt til at indberette oekonomiske og tekniske data til Forsyningstilsynet. Indberetning af reguleringsregnskaber, investeringsplaner, leveringskvalitet (SAIDI/SAIFI), kundedata og tarifinformation. Data bruges til benchmarking, tilsyn og offentlig statistik. Indberetning via Forsyningstilsynets digitale indberetningssystem.",
    "bekendtgorelse",
    "in_force",
    "2020-01-01",
    "https://www.retsinformation.dk/eli/lta/2019/1477"
  ],

  [
    "forsyningstilsynet",
    "BEK nr 686 af 20/06/2023",
    "Bekendtgoerelse om fakturering af elkunder (Faktureringsbekendtgoerelsen for el)",
    "Fastsaetter krav til indhold og format af elregninger til slutkunder. Elhandelsvirksomheder skal vise forbrugsdata, tarif- og prisoversigt, sammenligning med tidligere perioder, energimix og CO2-udledning, klageadgang og leverandoerskift. Implementerer EU-kravene i direktiv 2019/944 artikel 18 om fakturering og faktureringsinformation.",
    "bekendtgorelse",
    "in_force",
    "2023-07-01",
    "https://www.retsinformation.dk/eli/lta/2023/686"
  ],

  // ═══════════════════════════════════════════════════════════════
  // HEAT — TARIFFS & ACCOUNTING
  // ═══════════════════════════════════════════════════════════════

  [
    "forsyningstilsynet",
    "BEK nr 837 af 15/06/2022",
    "Bekendtgoerelse om varmeforsyningsvirksomheders regnskab og budget (Varmeregnskabsbekendtgoerelsen)",
    "Fastsaetter regler for varmeforsyningsvirksomheders regnskabsaflaeggelse og budgettering. Varmeforsyningsvirksomheder skal foere saerskilt regnskab for varmeforsyningsaktiviteten og indberette til Forsyningstilsynet. Krav om anmeldelse af budget og prisaendringer. Hvile-i-sig-selv-princippet skal overholdes: indtaegter maa ikke overstige noedvendige omkostninger.",
    "bekendtgorelse",
    "in_force",
    "2022-07-01",
    "https://www.retsinformation.dk/eli/lta/2022/837"
  ],

  [
    "forsyningstilsynet",
    "BEK nr 1514 af 14/12/2017",
    "Bekendtgoerelse om anmeldelse af tariffer, omkostningsfordelinger og andre leveringsvilkaar for fjernvarme (Anmeldelsesbekendtgoerelsen for varme)",
    "Varmeforsyningsvirksomheder skal anmelde tariffer, priser og leveringsvilkaar til Forsyningstilsynet foer de traeder i kraft. Krav til anmeldelsens format, dokumentation af priskalkulationer og omkostningsfordelinger mellem varme- og elproduktion. Forsyningstilsynet faar oejeblikkelig indsigt i alle tarifaendringer og kan gribe ind ved urimelige priser.",
    "bekendtgorelse",
    "in_force",
    "2018-01-01",
    "https://www.retsinformation.dk/eli/lta/2017/1514"
  ],

  // ═══════════════════════════════════════════════════════════════
  // GAS — TARIFFS, BENCHMARKING & REVENUE CAPS
  // ═══════════════════════════════════════════════════════════════

  [
    "forsyningstilsynet",
    "BEK nr 1358 af 24/11/2015",
    "Bekendtgoerelse om benchmarking af gasdistributionsselskaber (Gasbenchmarkbekendtgoerelsen)",
    "Fastsaetter regler for Forsyningstilsynets aarlige benchmarking af gasdistributionsselskaber. Sammenligning af driftsomkostninger korrigeret for netlaengde, kundetaethed og geografiske forhold. Individuelle effektivitetskrav baseret paa benchmarkresultater. Gasdistributionsselskaber under gennemsnittet faar skraerpede krav til effektivisering.",
    "bekendtgorelse",
    "in_force",
    "2016-01-01",
    "https://www.retsinformation.dk/eli/lta/2015/1358"
  ],

  [
    "forsyningstilsynet",
    "BEK nr 1358 af 27/11/2018",
    "Bekendtgoerelse om Energinets indtaegtsrammer (Energinet-indtaegtsrammebekendtgoerelsen)",
    "Fastsaetter regler for beregning af indtaegtsrammer for Energinets transmissions- og systemansvarlige aktiviteter. Regulerer det maksimale beloeb Energinet maa opkraeve i transmissions- og systemtariffer. Krav til regulatorisk aktivbase, afskrivninger, rimeligt afkast, driftsomkostninger og investeringsrammer. Forsyningstilsynet godkender aarligt.",
    "bekendtgorelse",
    "in_force",
    "2019-01-01",
    "https://www.retsinformation.dk/eli/lta/2018/1358"
  ],

  [
    "forsyningstilsynet",
    "BEK nr 1243 af 12/12/2012",
    "Bekendtgoerelse om gasdistributionsselskabernes reguleringsregnskaber",
    "Fastsaetter regler for gasdistributionsselskabernes aflaeggelse af reguleringsregnskaber. Reguleringsregnskabet dokumenterer overholdelse af indtaegtsrammen og danner grundlag for Forsyningstilsynets tilsyn med gastariffer. Krav til regnskabsformat, indberetningsfrister og revision. Selskaberne skal indberette aarligt til Forsyningstilsynet.",
    "bekendtgorelse",
    "in_force",
    "2013-01-01",
    "https://www.retsinformation.dk/eli/lta/2012/1243"
  ],

  // ═══════════════════════════════════════════════════════════════
  // MARKET MONITORING & TRANSPARENCY
  // ═══════════════════════════════════════════════════════════════

  [
    "forsyningstilsynet",
    "BEK nr 1419 af 01/12/2017",
    "Bekendtgoerelse om elhandelsvirksomheders oplysningsforpligtelser og forbrugerbeskyttelse (Forbrugerbeskyttelsesbekendtgoerelsen for el)",
    "Fastsaetter regler for elhandelsvirksomheders oplysningsforpligtelser over for elkunder. Krav til kontraktvilkaar, prisinformation, leverandoerskift, klagebehandling og forsyningspligttariffer. Forsyningstilsynet foerer tilsyn med at elhandelsvirksomheder overholder reglerne om forbrugerbeskyttelse.",
    "bekendtgorelse",
    "in_force",
    "2018-01-01",
    "https://www.retsinformation.dk/eli/lta/2017/1419"
  ],

  [
    "forsyningstilsynet",
    "BEK nr 1035 af 19/08/2022",
    "Bekendtgoerelse om program for intern overvaagning for net- og transmissionsvirksomheder (Internt overvaagningsprogram)",
    "Net- og transmissionsvirksomheder skal oprette et program for intern overvaagning der sikrer diskriminationsfrihed og gennemsigtighed. Programmet skal forebygge krydssubsidiering mellem regulerede og ikke-regulerede aktiviteter, sikre lige adgang til nettet og dokumentere overensstemmelse med bevillingskrav. Aarlig afrapportering til Forsyningstilsynet.",
    "bekendtgorelse",
    "in_force",
    "2022-09-01",
    "https://www.retsinformation.dk/eli/lta/2022/1035"
  ],

  [
    "forsyningstilsynet",
    "BEK nr 196 af 08/02/2021",
    "Bekendtgoerelse om elhandelsvirksomhedernes indberetning af forsyningsafbrydelser",
    "Elhandelsvirksomheder skal indberette forsyningsafbrydelser til Forsyningstilsynet. Indberetningen omfatter antal afbrydelser, antal beroerte kunder, varighed og aarsag. Formaalet er at styrke forbrugerbeskyttelsen og sikre leveringskvaliteten i elsektoren. Forsyningstilsynet anvender data til markedsovervaagning og tilsyn.",
    "bekendtgorelse",
    "in_force",
    "2021-03-01",
    "https://www.retsinformation.dk/eli/lta/2021/196"
  ],

  [
    "forsyningstilsynet",
    "BEK nr 163 af 26/02/2016",
    "Bekendtgoerelse om netvirksomheders leveringskvalitet (Leveringskvalitetsbekendtgoerelsen)",
    "Fastsaetter krav til elnetvirksomheders leveringskvalitet og rapportering af afbrudsindikatorer (SAIDI og SAIFI). Netvirksomheder skal registrere alle afbrydelser og indberette aarligt til Forsyningstilsynet. Data bruges til benchmarking og som input til indtaegtsrammereguleringen. Virksomheder med vasentligt daaarligere leveringskvalitet kan faa skraerpede krav.",
    "bekendtgorelse",
    "in_force",
    "2016-03-01",
    "https://www.retsinformation.dk/eli/lta/2016/163"
  ],
];
