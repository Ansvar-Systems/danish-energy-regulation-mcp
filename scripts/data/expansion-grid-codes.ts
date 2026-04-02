/**
 * Expansion grid codes for the Danish Energy Regulation MCP.
 *
 * ~25 additional Energinet grid codes covering technical regulations (TF series),
 * market regulations (Forskrift series), ancillary services, balancing, and gas codes.
 *
 * Each entry: [reference, title, text, code_type, version, effective_date, url]
 *
 * Sources: energinet.dk/regler, retsinformation.dk
 */

export const EXPANSION_GRID_CODES: [string, string, string, string, string, string, string][] = [
  // ═══════════════════════════════════════════════════════════════
  // TECHNICAL REGULATIONS (TF series)
  // ═══════════════════════════════════════════════════════════════

  [
    "TF 3.2.3",
    "Teknisk forskrift for batterianlæg tilsluttet elnettet",
    "Denne tekniske forskrift fastsaetter krav til batterienergilagringssystemer (BESS) tilsluttet det danske elnet. Batterianlæg skal kunne levere aktiv og reaktiv effektregulering, frekvensrespons og spandingsstoette i overensstemmelse med EU-netreglerne (RfG og krav til demand response). Anlaegsejeren skal sikre fejlgennemkoeringskrav (fault ride-through), begransning af harmonisk forvrengning og overholdelse af elkvalitetskrav. Batterianlæg med installeret kapacitet over 1 MW skal have kommunikationsudstyr til fjernaflaesning og fjernstyring via Energinets SCADA-system.",
    "technical_regulation",
    "2.0",
    "2024-01-01",
    "https://energinet.dk/regler/tekniske-forskrifter/tf-3-2-3",
  ],

  [
    "TF 3.2.4",
    "Teknisk forskrift for vindkraftvaerker stoerre end 25 kW og til og med 11 kW",
    "Denne forskrift regulerer smaa vindkraftvaerker med installeret kapacitet op til 11 kW tilsluttet distributionsnettet. Anlaeggene skal overholde krav til elkvalitet, herunder harmonisk forvrengning (THD under 5%), spandingsaendringer ved til- og frakobling, og automatisk frakobling ved frekvens- og spandingsafvigelser. I modsatning til stoerre vindkraftvaerker stilles der ikke krav om aktiv effektregulering eller fejlgennemkoersel, men anlægget skal have anti-oedrift-beskyttelse (loss-of-mains protection). Netvirksomheden skal godkende tilslutningen foer idriftsaettelse.",
    "technical_regulation",
    "3.0",
    "2022-06-01",
    "https://energinet.dk/regler/tekniske-forskrifter/tf-3-2-4",
  ],

  [
    "TF 3.2.6",
    "Teknisk forskrift for elproduktionsanlæg tilsluttet distributionsnettet",
    "Denne forskrift galder for alle elproduktionsanlæg tilsluttet distributionsnettet, herunder solcelleanlæg, biogasmotorer, mikro-kraftvarme og brændselsceller. Anlæg med installeret kapacitet over 0,8 kW skal overholde krav til elkvalitet, frekvensfoeelsomhed, spandingsregulering og beskyttelsesindstillinger. Anlæg over 11 kW skal desuden kunne modtage setsignaler for aktiv effektbegransning fra netoperatoeren. Kravene implementerer EU-forordning 2016/631 (RfG) for Type A-anlæg i det danske net.",
    "technical_regulation",
    "5.0",
    "2023-09-01",
    "https://energinet.dk/regler/tekniske-forskrifter/tf-3-2-6",
  ],

  [
    "TF 3.3.2",
    "Teknisk forskrift for nyanlæg paa transmissionsniveau",
    "Denne forskrift stiller tekniske krav til nye produktionsanlæg, der tilsluttes transmissionsnettet (132 kV og derover). Anlæg paa transmissionsniveau skal opfylde skarpede krav til fejlgennemkoersel, reaktiv effektkapabilitet (0,95 induktiv til 0,95 kapacitiv), sortstart-kapabilitet (hvor relevant), og SCADA-kommunikation i realtid med Energinets kontrolcenter. Forskriften stiller krav om simuleringer (EMT-modeller) og typetest foer godkendelse. Anlaegsejeren skal desuden levere en detaljeret teknisk beskrivelse og driftsmanualer paa dansk.",
    "technical_regulation",
    "3.0",
    "2023-03-01",
    "https://energinet.dk/regler/tekniske-forskrifter/tf-3-3-2",
  ],

  [
    "TF 5.1",
    "Teknisk forskrift for HVDC-forbindelser tilsluttet det danske elsystem",
    "Denne forskrift regulerer krav til hoejspaendt jaevestroems-forbindelser (HVDC) tilsluttet det danske transmissionsnet, herunder udlandsforbindelserne til Norge, Sverige, Tyskland og Storbritannien. HVDC-forbindelser skal kunne levere frekvensregulering, spandingsstoette og bidrage til systemstabilitet. Kravene omfatter aktiv effektramper (max 30 MW/min under normal drift), reaktiv effektkapabilitet, fejlhaandtering og automatisk effektreduktion ved lav systemfrekvens. Forskriften implementerer EU-forordning 2016/1447 (HVDC-netreglen).",
    "technical_regulation",
    "2.0",
    "2023-06-01",
    "https://energinet.dk/regler/tekniske-forskrifter/tf-5-1",
  ],

  [
    "TF 6.1",
    "Efterlevelse og typegodkendelse af elproduktionsanlæg",
    "Denne forskrift fastsaetter procedurer for dokumentation af efterlevelse (compliance) og typegodkendelse af elproduktionsanlæg i henhold til EU-netreglerne. Anlaegsejeren skal fremsende en efterlevelseserklaering med testresultater fra et akkrediteret laboratorium. For vindmoller og solcelleinvertere kan typecertifikater udstedt af akkrediterede organer anvendes. Energinet vurderer dokumentationen og udsteder en tilslutningstilladelse (Energinet Operational Notification). Forskriften indeholder detaljerede krav til testprocedurer for aktiv effekt, reaktiv effekt, frekvensrespons og fault ride-through.",
    "technical_regulation",
    "3.0",
    "2023-01-01",
    "https://energinet.dk/regler/tekniske-forskrifter/tf-6-1",
  ],

  [
    "TF 10.4",
    "Driftskode for elproduktionsanlæg tilsluttet det danske elsystem",
    "Denne driftskode fastsaetter operationelle krav til elproduktionsanlæg under normal drift, forstyrret drift og gendannelse efter systemfejl. Anlaegsejeren skal sikre, at anlægget er tilgaengeligt i henhold til aftalte driftsplaner og underrette Energinets kontrolcenter om planlagte og uplanlagte afbrydelser. Under forstyrret drift skal anlægget forblive tilsluttet og levere spandingsstoette, medmindre det automatisk frakobles af beskyttelsessystemer. Driftskoden indeholder krav til personalets kompetencer og oevelsesprogram.",
    "technical_regulation",
    "2.0",
    "2022-07-01",
    "https://energinet.dk/regler/tekniske-forskrifter/tf-10-4",
  ],

  // ═══════════════════════════════════════════════════════════════
  // MARKET REGULATIONS (Forskrift series)
  // ═══════════════════════════════════════════════════════════════

  [
    "Forskrift B",
    "Forskrift B: Balancering af elsystemet",
    "Forskrift B regulerer Energinets opgave med at opretholde den oejeblikkelige balance mellem elproduktion og elforbrug i det danske elsystem. Energinet koeber regulerkraft (opreegulering og nedregulering) paa det nordiske balancemarked og aktiverer frekvensreserver. Forskriften fastsaetter afregnningsregler for ubalancer, krav til anmeldelse af produktions- og forbrugsplaner, og tidsfrister for dayahead- og intradayhandel. Balanceafregningen sker paa kvarterbasis i DK1 og DK2 efter single-price-modellen i overensstemmelse med den europaeiske balanceringsforordning (EU 2017/2195).",
    "market_regulation",
    "4.0",
    "2024-01-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-b",
  ],

  [
    "Forskrift C1",
    "Forskrift C1: Tarifering i transmissionsnettet",
    "Forskrift C1 fastsaetter principper og metoder for beregning af Energinets tariffer for transport af el i transmissionsnettet. Tariffen bestaar af en systemtarif (daekker systemydelser og balancering), en nettarif (daekker drift og vedligeholdelse af transmissionsnettet) og en PSO-lignende tarif (daekker stoette til vedvarende energi). Tarifferne differentieres efter tilfoeersels- og aftageforhold. Energinet offentliggoer tarifferne aarligt efter godkendelse fra Forsyningstilsynet.",
    "market_regulation",
    "5.0",
    "2024-01-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-c1",
  ],

  [
    "Forskrift C2",
    "Forskrift C2: Vilkaar for adgang til det kollektive elnet",
    "Forskrift C2 regulerer vilkaarene for tredjepartsadgang til det kollektive elnet i Danmark. Netvirksomheder og Energinet skal stille nettet til raadighed paa gennemsigtige, objektive og ikke-diskriminerende vilkaar. Forskriften fastsaetter krav til tilslutningsaftaler, maalerinstallation, dataudveksling og leverandoerskift. Tidsfristen for leverandoerskift er 1 hverdag. Forskriften implementerer kravene i EU's elmarkedsdirektiv (2019/944) og elmarkedsforordning (2019/943).",
    "market_regulation",
    "3.0",
    "2023-07-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-c2",
  ],

  [
    "Forskrift C3",
    "Forskrift C3: Nettoafregning og afregningsmaalere",
    "Forskrift C3 fastsaetter regler for nettoafregning af egenproducenter med vedvarende energianlæg. Ordningen giver egenproducenter mulighed for at modregne egenproduktion i det samlede elforbrug paa time- eller aarsbasis. Forskriften stiller krav til maaleropsatning, aflæsningsfrekvens og dataindberetning. Fra 2024 overgaar nye anlæg til timebaseret nettoafregning. Energinet og netvirksomhederne administrerer afregnningen i samarbejde med Datahub.",
    "market_regulation",
    "6.0",
    "2024-01-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-c3",
  ],

  [
    "Forskrift D",
    "Forskrift D: Datakommunikation og dataudveksling i elmarkedet",
    "Forskrift D regulerer elektronisk dataudveksling mellem aktorer paa det danske elmarked. Alle markedsaktorer (netvirksomheder, elleverandoerer, balanceansvarlige) skal anvende Energinets DataHub som central platform for udveksling af maalerdata, stamdata, afregningsdata og leverandoerskift. Forskriften specificerer dataformater (ebIX/CIM), kommunikationsprotokoller, tidsfrister og kvalitetskrav til data. DataHub processerer ca. 3,4 mio. maalepunkter og handterer over 100.000 leverandoerskift pr. maaned.",
    "market_regulation",
    "7.0",
    "2024-04-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-d",
  ],

  [
    "Forskrift E",
    "Forskrift E: Elleverandoerernes forpligtelser og melding",
    "Forskrift E fastsaetter forpligtelser for elleverandoerer (elhandelsvirksomheder) paa det danske marked. Leverandoerer skal vaere registreret i DataHub, stille financiel sikkerhed, overholde leveringsfrister og sikre korrekt afregning med kunderne. Forskriften regulerer ind- og udtradelsesprocesser, leverandoerskift, flytning og tilbagefaldsforsyning. Leverandoerer har pligt til at informere forbrugere om elpriser, oprindelse og klagemuligheder i overensstemmelse med forbrugerbeskyttelsesreglerne i elforsyningsloven.",
    "market_regulation",
    "4.0",
    "2023-10-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-e",
  ],

  [
    "Forskrift F",
    "Forskrift F: Gaskvalitetskrav i det danske gastransmissionsnet",
    "Forskrift F specificerer de fysiske og kemiske krav til gassammensatning i det danske gastransmissionsnet. Gassen skal overholde graensevaerdier for Wobbe-indeks (14,1-15,5 kWh/m3), braendvaerdi, svovlindhold (max 5 mg/m3), vandindhold, oxygenindhold (max 0,5 mol%) og partikler. Energinet overvager gaskvaliteten i realtid paa tilfoerselspunkter og gasbehandlingsanlæg. Forskriften er relevant for biogasproducenter, der tilfoerer opgraderet biogas til naturgasnettet, da biogassen skal overholde de samme kvalitetskrav.",
    "market_regulation",
    "3.0",
    "2023-01-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-f",
  ],

  [
    "Forskrift G",
    "Forskrift G: Gasmaalerbekendtgoerelse og gaskvalitetsmaaling",
    "Forskrift G regulerer krav til maaling af gasvolumen og -kvalitet i transmissions- og distributionssystemet. Maalere skal vaere typegodkendte, kalibrerede og kontrollerede i overensstemmelse med maalerbekendtgoerelsen. Forskriften stiller krav til maaleusikkerhed (max 1% for volumenmaalere paa transmissionsniveau), korrektion for temperatur og tryk, og konvertering mellem volumetrisk og kalorisk maaling. Energinet er ansvarlig for referencemaaling ved systemgraenserne og offentliggoer gaskvalitetsdata dagligt.",
    "market_regulation",
    "2.0",
    "2022-04-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-g",
  ],

  [
    "Forskrift I",
    "Forskrift I: Installationsforskrift for gastilslutninger",
    "Forskrift I fastsaetter tekniske krav til gasinstallationer ved tilslutning til distributionsnettet. Installationen skal udfoeres af en autoriseret gasinstallatoervirksomhed og overholde krav til materialer, trykproeving, ventilation og sikkerhedsafstande. Gasdistributoeren (Evida) skal godkende tilslutningen foer idriftsaettelse. Forskriften daekker baade naturgas- og biogastilslutninger og regulerer krav til gasregulatorstationer, maalerudstyr og afbraendingsinstallationer.",
    "market_regulation",
    "4.0",
    "2022-01-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-i",
  ],

  [
    "Forskrift J",
    "Forskrift J: Maalerforskrift for elmaalere i det danske elsystem",
    "Forskrift J regulerer krav til elmaalere og maalerinstallationer i det danske elsystem. Alle forbrugsmaalere skal vaere fjernaflæste (smart meters), overholde DS/EN 50470-standarden og kunne registrere forbrug og eventuel egenproduktion paa timebasis. Netvirksomheden er ansvarlig for maaleropsatning, drift og vedligeholdelse. Maalerdata transmitteres via sikre kommunikationskanaler til DataHub. Danmark har opnaaet 100% udrulning af fjernaflæste elmaalere siden 2020. Forskriften stiller krav til datasikkerhed, kryptering og databeskyttelse af maalerdata.",
    "market_regulation",
    "5.0",
    "2023-01-01",
    "https://energinet.dk/regler/markedsforskrifter/forskrift-j",
  ],

  // ═══════════════════════════════════════════════════════════════
  // ANCILLARY SERVICES AND BALANCING
  // ═══════════════════════════════════════════════════════════════

  [
    "FCR-kravspecifikation",
    "FCR-kravspecifikation: Frekvensindeholdsreserve i Norden",
    "Denne kravspecifikation fastsaetter tekniske krav til levering af Frequency Containment Reserve (FCR) i det synkrone nordiske elsystem. FCR aktiveres automatisk ved frekvensafvigelser fra 50,00 Hz. FCR-N (normal) aktiveres ved afvigelser paa +/- 0,1 Hz og skal vaere fuldt aktiveret inden for 30 sekunder. FCR-D (disturbance) aktiveres ved afvigelser stoerre end 0,1 Hz og skal vaere fuldt aktiveret inden for 30 sekunder. Praekvalifikation kraever dokumentation af responstid, kapacitet og tilgaengelighed. Energinet indkoeber FCR gennem daglige auktioner.",
    "ancillary_services",
    "3.0",
    "2024-01-01",
    "https://energinet.dk/regler/systemydelser/fcr-kravspecifikation",
  ],

  [
    "aFRR-kravspecifikation",
    "aFRR-kravspecifikation: Automatisk frekvensgenoprettelsesreserve",
    "Denne kravspecifikation fastsaetter krav til levering af automatic Frequency Restoration Reserve (aFRR) i Danmark. aFRR aktiveres automatisk via Energinets Load Frequency Controller (LFC) og skal genoprette frekvensen til 50,00 Hz efter forstyrrelser. Fuld aktivering skal ske inden for 5 minutter. Minimumsbudstoerelse er 1 MW. Leverandoerer skal have kommunikationsudstyr, der modtager aktiveringssignaler fra Energinets kontrolcenter i realtid. Danmark deltager i den europaeiske aFRR-platform PICASSO (Platform for the International Coordination of Automated Frequency Restoration and Stable System Operation).",
    "ancillary_services",
    "2.0",
    "2024-01-01",
    "https://energinet.dk/regler/systemydelser/afrr-kravspecifikation",
  ],

  [
    "mFRR-kravspecifikation",
    "mFRR-kravspecifikation: Manuel frekvensgenoprettelsesreserve",
    "Denne kravspecifikation fastsaetter krav til levering af manual Frequency Restoration Reserve (mFRR) i DK1 og DK2. mFRR aktiveres manuelt af Energinets operatoer til regulering af produktions- og forbrugsubalancer. Fuld aktivering skal ske inden for 15 minutter efter signal. Minimumsbudstoerelse er 5 MW i DK1 og 10 MW i DK2. Leverandoerer byder kapacitet og energi paa det nordiske regulerkraftmarked. Danmark deltager i den europaeiske mFRR-platform MARI (Manually Activated Reserves Initiative). Energinet indkoeber mFRR-kapacitet aarligt og mFRR-energi dagligt.",
    "ancillary_services",
    "2.0",
    "2024-01-01",
    "https://energinet.dk/regler/systemydelser/mfrr-kravspecifikation",
  ],

  [
    "DK1/DK2-balanceringsmodel",
    "Balanceringsmodel for de danske budzonor DK1 og DK2",
    "Dette dokument beskriver Energinets balanceringsmodel for de to danske prisomraader DK1 (Vestdanmark, synkront med Kontinentaleuropa) og DK2 (Oestdanmark, synkront med Norden). Balanceringen sker ved aktivering af FCR, aFRR og mFRR i prioriteret raekkefoelge. DK1 og DK2 har separate balanceopgoerelser men koordineres via Energinets faelles kontrolcenter. Modellen tager hoejde for udlandsforbindelserne til Norge, Sverige, Tyskland, Holland og Storbritannien. Ubalancepriser beregnes paa 15-minutters basis efter single-pricing-princippet.",
    "balancing",
    "3.0",
    "2024-01-01",
    "https://energinet.dk/regler/markedsforskrifter/balanceringsmodel",
  ],

  // ═══════════════════════════════════════════════════════════════
  // GAS GRID CODES
  // ═══════════════════════════════════════════════════════════════

  [
    "Regler for biogastilslutning",
    "Regler for tilslutning af biogasanlæg til gasnettet",
    "Disse regler fastsaetter vilkaar for tilslutning af biogasopgraderingsanlæg til det danske gasnet. Opgraderet biogas skal overholde gaskvalitetskravene i Forskrift F, herunder Wobbe-indeks, svovlindhold og fugtighed. Biogasproducenten skal installere maalerindstyr og kvalitetsovervagningsudstyr paa tilfoerselspunktet. Evida (gasdistributoeren) er ansvarlig for tilslutningen og opkraever et tilslutningsgebyr. Danmark har ca. 60 biogasopgraderingsanlæg, der tilfoerer opgraderet biogas svarende til ca. 35% af det samlede danske gasforbrug (2024).",
    "grid_connection",
    "2.0",
    "2023-06-01",
    "https://energinet.dk/regler/gas/biogastilslutning",
  ],

  [
    "Gaskvalitetskrav ved biogas",
    "Gaskvalitetskrav ved tilfoersel af biogas til naturgasnettet",
    "Dette dokument specificerer de detaljerede gaskvalitetskrav, som opgraderet biogas skal overholde ved tilfoersel til naturgasnettet. Ud over de generelle krav i Forskrift F stilles der saerlige krav til biogassens indhold af siloxaner (max 0,5 mg/m3), ammoniak (max 3 mg/m3) og fluor (max 1 mg/m3). Biogasproducenten skal gennemfoere kontinuerlig online-maaling af Wobbe-indeks og braendvaerdi samt periodiske analyser af sporkomponenter. Ved overskridelse af graensevaerdier afbrydes tilfoerslen automatisk via en sikkerhedsventil.",
    "grid_connection",
    "1.0",
    "2023-01-01",
    "https://energinet.dk/regler/gas/gaskvalitetskrav-biogas",
  ],

  [
    "Gastransmissionsforskrifter",
    "Forskrifter for gastransmissionssystemet i Danmark",
    "Disse forskrifter regulerer driften af det danske gastransmissionssystem, der ejes og opereres af Energinet. Forskrifterne fastsaetter vilkaar for transport af gas i transmissionssystemet, herunder kapacitetsallokering, nominering, renominering og afbrydelige kontrakter. Kapacitetsallokering sker via auktioner paa PRISMA-platformen. Energinet skal opretholde gasleveringssikkerheden og har beredskabsplaner for forsyningsafbrydelser. Forskrifterne implementerer EU-forordning 715/2009 om adgang til gastransmissionssystemer og EU-forordning 2017/459 om kapacitetsallokering.",
    "market_regulation",
    "4.0",
    "2023-10-01",
    "https://energinet.dk/regler/gas/gastransmission",
  ],

];
