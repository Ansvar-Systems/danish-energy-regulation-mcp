/**
 * Expansion decisions for the Danish Energy Regulation MCP.
 *
 * ~50 additional Forsyningstilsynet decisions covering revenue caps,
 * heat tariffs, gas decisions, methodology approvals, benchmarking,
 * market monitoring, and complaint cases.
 *
 * Each entry: [reference, title, text, decision_type, date_decided, parties, url]
 *
 * Sources: forsyningstilsynet.dk, retsinformation.dk
 */

export const EXPANSION_DECISIONS: [string, string, string, string, string, string, string][] = [
  // ═══════════════════════════════════════════════════════════════
  // REVENUE CAP DECISIONS (EL) — Major Danish DSOs
  // ═══════════════════════════════════════════════════════════════

  [
    "FT/2024/EL/RC/010",
    "Afgorelse om Cerius A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har fastsat Cerius A/S' oekonomiske ramme for reguleringsaaret 2024 til 2.187 mio. kr. Cerius driver distributionsnettet paa Sjaelland og forsyner ca. 600.000 maalepunkter. Indtagtsrammen afspejler godkendte driftsomkostninger, afskrivninger paa netaktiver og et rimeligt afkast paa den regulatoriske aktivbase. Forsyningstilsynet har paabagt et individuelt effektivitetskrav paa 2,1% baseret paa benchmarkresultater. Cerius har faaet godkendt ekstraordinaere investeringer i kabellæg og digitaliserring af nettet.",
    "revenue_cap",
    "2024-04-10",
    "Cerius A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-cerius-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/RC/011",
    "Afgorelse om Trefor El-net A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har truffet afgorelse om Trefor El-net A/S' indtagtsramme for 2024. Rammen er fastsat til 712 mio. kr. Trefor driver distributionsnettet i Trekantsomraadet (Vejle, Fredericia, Kolding) og forsyner ca. 175.000 kunder. Effektivitetskravet er sat til 1,8%, hvilket er lavere end gennemsnittet, da Trefor har en hoej andel jordkabler og begrensede rationaliseringsmuligheder. Tilsynet har godkendt saeromkostninger til implementering af den nye DataHub 3.0.",
    "revenue_cap",
    "2024-04-22",
    "Trefor El-net A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-trefor-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/RC/012",
    "Afgorelse om NRGi Net A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har fastsat NRGi Net A/S' indtagtsramme for 2024 til 1.098 mio. kr. NRGi Net driver distributionsnettet i Oestjylland og forsyner ca. 300.000 kunder. Tilsynet har godkendt oeget investeringsniveau paa grund af kabellæg af luftledninger og kapacitetsudvidelse til elbiler og varmepumper. Effektivitetskravet er fastsat til 2,3%. NRGi Net har anmodet om godkendelse af saeromkostninger til stormsikring af nettet, som behandles i en saerskilt afgorelse.",
    "revenue_cap",
    "2024-05-03",
    "NRGi Net A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-nrgi-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/RC/013",
    "Afgorelse om Vores Elnet A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har truffet afgorelse om Vores Elnet A/S' oekonomiske ramme for 2024 paa 589 mio. kr. Vores Elnet opererer i Nordjylland og forsyner ca. 150.000 kunder. Selskabet har gennemfort en fusion med det tidligere HEF Net, og tilsynet har vurderet de fusionsrelaterede synergigevinster. Effektivitetskravet er sat til 2,0%. Tilsynet har noteret, at selskabets enhedsomkostninger per maalepunkt ligger under branchegennemsnittet.",
    "revenue_cap",
    "2024-05-15",
    "Vores Elnet A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-vores-elnet-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/RC/014",
    "Afgorelse om RAH Net A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har fastsat RAH Net A/S' indtagtsramme for 2024 til 298 mio. kr. RAH Net forsyner ca. 72.000 kunder i Vestjylland (Ringkoebing-Skjern, Herning). Selskabet har et relativt lavt investeringsniveau, da netomraadet er karakteriseret ved lav befolkningstæthed. Effektivitetskravet er fastsat til 1,5%. Tilsynet har godkendt saeromkostninger til tilslutning af store solcelleparker i netomraadet.",
    "revenue_cap",
    "2024-05-20",
    "RAH Net A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-rah-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/RC/015",
    "Afgorelse om Dinel A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har truffet afgorelse om Dinel A/S' indtagtsramme for 2024 paa 421 mio. kr. Dinel driver distributionsnettet i dele af Fyn og Sydjylland og forsyner ca. 110.000 kunder. Selskabet staar over for store investeringsbehov i forbindelse med elektrificering af varmesektoren og udbygning af ladeinfrastruktur. Effektivitetskravet er sat til 2,2%. Tilsynet understreger, at Dinel skal forbedre sin rapportering af netaktivernes tilstand.",
    "revenue_cap",
    "2024-06-01",
    "Dinel A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-dinel-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/RC/016",
    "Afgorelse om Konstant Net A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har fastsat Konstant Net A/S' oekonomiske ramme for 2024 til 486 mio. kr. Konstant Net driver distributionsnettet i Midt- og Sydjylland (tidligere SE Net) og forsyner ca. 130.000 kunder. Selskabet har faaet godkendt ekstraordinaere investeringer til erstatning af alderdommelige 10 kV-kabler. Effektivitetskravet er sat til 2,4%. Tilsynet fremhaever, at Konstant Net har opnaaet god leveringssikkerhed med en gennemsnitlig afbrydelsestid (SAIDI) paa under 20 minutter.",
    "revenue_cap",
    "2024-06-10",
    "Konstant Net A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-konstant-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/RC/017",
    "Afgorelse om FLOW Elnet A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har truffet afgorelse om FLOW Elnet A/S' indtagtsramme for 2024 paa 357 mio. kr. FLOW Elnet opererer i Soenderjylland og Sydfyn og forsyner ca. 90.000 kunder. Selskabet har en hoej andel landlige omraader med lange kabelfoeringer per kunde. Effektivitetskravet er sat til 1,9%. Tilsynet har godkendt saeromkostninger til implementering af avanceret netoevervaagning (ADMS) og digitale tvillingemodeller af lavspandingsnettet.",
    "revenue_cap",
    "2024-06-15",
    "FLOW Elnet A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-flow-elnet-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/RC/018",
    "Afgorelse om Elnet Midt A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har fastsat Elnet Midt A/S' oekonomiske ramme for 2024 til 267 mio. kr. Elnet Midt forsyner ca. 65.000 kunder i Midtjylland (Silkeborg, Viborg). Selskabet har haft stigende investeringer paa grund af tilslutning af nye boligomraader og erhvervsparker med stort effektbehov. Effektivitetskravet er fastsat til 2,0%. Tilsynet noterer, at selskabets nettariffer ligger i den lavere halvdel blandt danske distributionsselskaber.",
    "revenue_cap",
    "2024-06-20",
    "Elnet Midt A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-elnet-midt-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/RC/019",
    "Afgorelse om Ikast El Net A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har truffet afgorelse om Ikast El Net A/S' indtagtsramme for 2024 paa 84 mio. kr. Ikast El Net er et mindre distributionsselskab, der forsyner ca. 22.000 kunder i Ikast-Brande Kommune. Selskabet har lave enhedsomkostninger og god effektivitet. Effektivitetskravet er fastsat til 1,2%, det laveste blandt de danske distributionsselskaber, da selskabet allerede opererer taet paa effektivitetsfronten. Tilsynet har godkendt investeringer i udskiftning af aldrende transformerstationer.",
    "revenue_cap",
    "2024-07-01",
    "Ikast El Net A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-ikast-indtagtsramme-2024",
  ],

  // ═══════════════════════════════════════════════════════════════
  // HEAT TARIFF DECISIONS (VARME)
  // ═══════════════════════════════════════════════════════════════

  [
    "FT/2024/VARME/001",
    "Afgorelse om HOFOR Fjernvarme P/S' tariffer for 2024",
    "Forsyningstilsynet har vurderet HOFOR Fjernvarme P/S' tariffer for 2024. HOFOR er Danmarks stoerste fjernvarmeselskab og forsyner ca. 240.000 kunder i Hovedstadsomraadet. Tarifferne er steget med 6,2% i forhold til 2023, primaert som foelge af hoejere transmissionsomkostninger og investeringer i geotermi ved Amager. Tilsynet konstaterer, at tarifferne overholder varmeforsyningslovens hvile-i-sig-selv-princip. HOFOR har fremlagt en omstillingsplan med maal om CO2-neutral fjernvarme inden 2030.",
    "tariff",
    "2024-03-28",
    "HOFOR Fjernvarme P/S",
    "https://forsyningstilsynet.dk/varme/afgoerelse-hofor-fjernvarme-2024",
  ],

  [
    "FT/2024/VARME/002",
    "Afgorelse om AffaldVarme Aarhus' tariffer for 2024",
    "Forsyningstilsynet har vurderet AffaldVarme Aarhus' fjernvarmetariffer for 2024. AffaldVarme Aarhus forsyner ca. 90.000 kunder i Aarhus Kommune med fjernvarme baseret paa affaldsforbraending, biomasse og overskudsvarme. Tarifstigningen er 4,8% sammenlignet med 2023. Tilsynet finder, at prisstigningen er begrundet i hoejere biomassepriser og investeringer i nye fjernvarmeledninger i Lisbjerg. Tilsynet paabegynder en naermere undersoegelse af affaldsforbraendingspriserne i lyset af den nye affaldssektor-regulering.",
    "tariff",
    "2024-04-15",
    "AffaldVarme Aarhus",
    "https://forsyningstilsynet.dk/varme/afgoerelse-affaldvarme-aarhus-2024",
  ],

  [
    "FT/2024/VARME/003",
    "Afgorelse om Fjernvarme Fyn A/S' tariffer for 2024",
    "Forsyningstilsynet har vurderet Fjernvarme Fyn A/S' (tidl. Odense Fjernvarme) tariffer for reguleringsaaret 2024. Fjernvarme Fyn forsyner ca. 80.000 kunder i Odense og omegn. Selskabet har gennemfort en stor omstilling fra kulfyret kraftvarme til biomasse og overskudsvarme fra industri. Tarifferne er steget med 3,7%, hvilket tilsynet finder rimeligt henset til investeringerne i Odense Nord varmevaerk (biomasse-kraftvarme). Tilsynet har saerligt vurderet fordelingen af fællesomkostninger mellem el- og varmeproduktion.",
    "tariff",
    "2024-05-10",
    "Fjernvarme Fyn A/S",
    "https://forsyningstilsynet.dk/varme/afgoerelse-fjernvarme-fyn-2024",
  ],

  [
    "FT/2024/VARME/004",
    "Afgorelse om Aalborg Forsyning Varme A/S' tariffer for 2024",
    "Forsyningstilsynet har truffet afgorelse om Aalborg Forsyning Varme A/S' fjernvarmetariffer for 2024. Aalborg Forsyning Varme forsyner ca. 55.000 kunder i Aalborg Kommune med fjernvarme primaert baseret paa biomasse, affaldsforbraending og industriel overskudsvarme fra Aalborg Portland. Tarifferne er steget med 5,1% paa grund af hoejere biomassepriser og investeringer i varmepumper. Tilsynet har godkendt tarifferne, men stiller krav om forbedret gennemsigtighed i prisstrukturen over for forbrugerne.",
    "tariff",
    "2024-05-22",
    "Aalborg Forsyning Varme A/S",
    "https://forsyningstilsynet.dk/varme/afgoerelse-aalborg-varme-2024",
  ],

  [
    "FT/2024/VARME/005",
    "Afgorelse om Vestforbraendings fjernvarmetariffer for 2024",
    "Forsyningstilsynet har vurderet Vestforbraendings fjernvarmetariffer for 2024. Vestforbraending leverer overskudsvarme fra affaldsforbraending til fjernvarmenettet i Vestegnen af Koebenhavn og forsyner ca. 75.000 husstande via tilknyttede fjernvarmeselskaber. Forsyningstilsynet har saerligt vurderet fordelingen af indtaegter og omkostninger mellem affaldsbehandling og varmeproduktion. Tilsynet konstaterer, at varmetarifferne overholder hvile-i-sig-selv-princippet, men paapeger, at tilsynets muligheder for at kontrollere den interne fordeling er begransede under den nuvaerende regulering.",
    "tariff",
    "2024-06-05",
    "Vestforbraending I/S",
    "https://forsyningstilsynet.dk/varme/afgoerelse-vestforbraending-2024",
  ],

  [
    "FT/2024/VARME/006",
    "Afgorelse om Soenderborg Fjernvarme A.m.b.a.' tariffer for 2024",
    "Forsyningstilsynet har vurderet Soenderborg Fjernvarme A.m.b.a.'s tariffer for 2024. Soenderborg Fjernvarme er en del af ProjectZero-partnerskabet, der arbejder mod CO2-neutralitet i 2029. Selskabet forsyner ca. 15.000 kunder og har investeret i store varmepumper, solvarme og overskudsvarme fra Danfoss. Tarifferne er steget med 2,3%, det laveste niveau i sammenligning med tilsvarende selskaber, hvilket tilsynet tilforer den effektive brug af vedvarende varmekilder. Tilsynet godkender tarifferne uden bemarkninger.",
    "tariff",
    "2024-06-18",
    "Soenderborg Fjernvarme A.m.b.a.",
    "https://forsyningstilsynet.dk/varme/afgoerelse-soenderborg-fjernvarme-2024",
  ],

  [
    "FT/2024/VARME/007",
    "Afgorelse om Silkeborg Forsyning Varme A/S' tariffer for 2024",
    "Forsyningstilsynet har vurderet Silkeborg Forsyning Varme A/S' fjernvarmetariffer for 2024. Selskabet forsyner ca. 25.000 kunder i Silkeborg Kommune. Silkeborg Forsyning har gennemfort en betydelig omstilling fra naturgasbaseret kraftvarme til solvarme og varmepumper, herunder Danmarks stoerste solvarmeanlæg ved Sejs. Tarifferne er faldet med 1,2% i forhold til 2023 som foelge af lavere driftsomkostninger paa det nye solvarmeanlæg. Tilsynet fremhaever Silkeborg som et positivt eksempel paa effektiv groen omstilling.",
    "tariff",
    "2024-07-02",
    "Silkeborg Forsyning Varme A/S",
    "https://forsyningstilsynet.dk/varme/afgoerelse-silkeborg-varme-2024",
  ],

  // ═══════════════════════════════════════════════════════════════
  // GAS DECISIONS
  // ═══════════════════════════════════════════════════════════════

  [
    "FT/2024/GAS/RC/001",
    "Afgorelse om Evida A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har fastsat Evida A/S' indtagtsramme for gasdistribution i 2024 til 1.341 mio. kr. Evida er Danmarks eneste gasdistributoer efter fusionen af HMN og NGF Nature Energy Distribution og opererer ca. 19.000 km gasledninger. Indtagtsrammen afspejler faldende gasvolumener som foelge af elektrificering og konvertering til fjernvarme, men stigende investeringer i biogastilslutninger. Effektivitetskravet er sat til 1,5%. Tilsynet har saerligt vurderet, om de faste tarifkomponenter er tilstraekkelige til at daekke selskabets faste omkostninger ved faldende gasafsatning.",
    "revenue_cap",
    "2024-04-18",
    "Evida A/S",
    "https://forsyningstilsynet.dk/gas/afgoerelse-evida-indtagtsramme-2024",
  ],

  [
    "FT/2024/GAS/TARIF/002",
    "Afgorelse om Evida A/S' gasdistributionstariffer for 2024",
    "Forsyningstilsynet har godkendt Evida A/S' gasdistributionstariffer for 2024. Distributionstarifferne er steget med 8,7% i gennemsnit som foelge af faldende gasvolumener og stigende enhedsomkostninger. Tariffen bestaar af et fast bidrag (kapacitetsbaseret) og et variabelt bidrag (forbrugsbaseret). Tilsynet har paabagt Evida at oege andelen af det faste bidrag for at reducere volatiliteten i tarifudviklingen. Tilsynet vurderer, at tarifstrukturen er i overensstemmelse med gasforsyningslovens principper om ikke-diskrimination og omkostningsafspejling.",
    "tariff",
    "2024-05-08",
    "Evida A/S",
    "https://forsyningstilsynet.dk/gas/afgoerelse-evida-tariffer-2024",
  ],

  [
    "FT/2024/GAS/RC/002",
    "Afgorelse om Energinet Gas TSO's indtagtsramme for 2024",
    "Forsyningstilsynet har fastsat Energinet Gas TSO's indtagtsramme for 2024 til 978 mio. kr. Energinet Gas TSO driver det danske gastransmissionssystem, herunder kompressorstationer, modtageterminal ved Nybro og forbindelser til Tyskland og Sverige. Indtagtsrammen afspejler investeringer i Baltic Pipe-forbindelsen til Polen og vedligeholdelse af den aldrende infrastruktur. Tilsynet har vurderet, at Energinets planlagte investeringer i brintklargoering af dele af transmissionsnettet er berettigede inden for rammen, da de understotter den langsigtede forsyningssikkerhed.",
    "revenue_cap",
    "2024-05-25",
    "Energinet Gas TSO",
    "https://forsyningstilsynet.dk/gas/afgoerelse-energinet-gas-tso-2024",
  ],

  // ═══════════════════════════════════════════════════════════════
  // METHODOLOGY APPROVALS
  // ═══════════════════════════════════════════════════════════════

  [
    "FT/2024/EL/METODE/010",
    "Metodegodkendelse: Beregning af nettariffer i distributionsnettet",
    "Forsyningstilsynet har godkendt en opdateret metode for beregning af nettariffer i eldistributionsnettet. Den nye metode indforer en staerkere kobling mellem tariffer og den faktiske netudnyttelse ved at vagte kapacitetselementet hoejere i tarifstrukturen. Metoden kraever, at netvirksomheder opdeler tariffen i et fast abonnementsbidrag, et kapacitetsbaseret effektbidrag (kr/kW) og et energibaseret transportbidrag (oere/kWh). Tilsynet har fastsat en overgangsordning paa 3 aar, hvor netvirksomheder skal tilpasse tarifstrukturen til den nye metode.",
    "methodology",
    "2024-06-15",
    "Alle eldistributionsselskaber",
    "https://forsyningstilsynet.dk/el/metodegodkendelse-nettariffer-distribution-2024",
  ],

  [
    "FT/2024/EL/METODE/011",
    "Metodegodkendelse: Abonnementsbetaling for erhvervskunder",
    "Forsyningstilsynet har godkendt Energinets metode for abonnementsbetaling for erhvervskunder med direkte maaleraflæsning. Metoden differentierer abonnementsbetalingen efter kundens tilslutningsniveau (0,4 kV, 10 kV, 60 kV) og maalertype. Tilsynet har vurderet, at differentieringen afspejler de faktiske omkostninger ved betjening af forskellige kundesegmenter. Abonnementsbetalingen daekker omkostninger til maalerdrift, datahub-bidrag, kundeservice og fakturerering. Tilsynet kraever, at metoden evalueres efter 2 aar.",
    "methodology",
    "2024-07-01",
    "Energinet Elsystemansvar A/S",
    "https://forsyningstilsynet.dk/el/metodegodkendelse-abonnement-2024",
  ],

  [
    "FT/2024/EL/METODE/006",
    "Metodegodkendelse: Tariffer for overliggende net (transmissionstariffer)",
    "Forsyningstilsynet har godkendt en revideret metode for beregning af transmissionstariffer (overliggende net) for perioden 2024-2027. Metoden fordeler Energinets transmissionsomkostninger paa distributionsselskaberne baseret paa en kombination af spidslastbidrag (70%) og energibidrag (30%). Tilsynet har stillet krav om, at Energinet udvikler en mere lokationsdifferentieret tarifmodel, der giver korrekte prissignaler for placering af produktion og forbrug. Den reviderede metode forventes at reducere transmissionsomkostningerne for omraader med stor lokal produktion.",
    "methodology",
    "2024-08-01",
    "Energinet Elsystemansvar A/S",
    "https://forsyningstilsynet.dk/el/metodegodkendelse-transmissionstariffer-2024",
  ],

  [
    "FT/2024/VARME/METODE/001",
    "Metodegodkendelse: Beregningsmetode for varmeafregningspriser",
    "Forsyningstilsynet har godkendt en fælles beregningsmetode for varmeafregningspriser mellem varmeproducenter (kraftvarmevaerker, affaldsforbraendingsanlæg) og varmedistributoerer. Metoden fastsaetter principper for fordeling af fællesomkostninger (samproduktionsfordelingen) mellem el og varme. Den godkendte metode anvender en kombination af alternativprismetoden og den tekniske fordelingsmetode. Tilsynet kraever, at samproduktionsfordelingen er gennemsigtig og dokumenteret i selskabernes aarlige priseftervisninger.",
    "methodology",
    "2024-06-28",
    "Alle kraftvarmeproducenter og fjernvarmeselskaber",
    "https://forsyningstilsynet.dk/varme/metodegodkendelse-varmeafregning-2024",
  ],

  // ═══════════════════════════════════════════════════════════════
  // BENCHMARKING
  // ═══════════════════════════════════════════════════════════════

  [
    "FT/2023/EL/BENCH/001",
    "Benchmarking af eldistributionsselskaber 2023",
    "Forsyningstilsynet har gennemfort den aarlige benchmarking af samtlige 40 danske eldistributionsselskaber for reguleringsaaret 2023. Benchmarkingen sammenligner selskabernes totalomkostninger (TOTEX) i forhold til en raekke output-variable (antal maalepunkter, netlaengde, leveret energi, geogrfiske forhold). Den gennemsnitlige effektivitetsscore er 91,3%, en forbedring fra 89,7% i 2022. De mest effektive selskaber er Ikast El Net (99,2%), Hammel Elforsyning (98,1%) og Midtfyns Elforsyning (97,4%). Selskaber med effektivitetsscore under 85% paalagges forhoejet effektivitetskrav.",
    "benchmark",
    "2023-10-15",
    "Alle 40 eldistributionsselskaber",
    "https://forsyningstilsynet.dk/el/benchmarking-eldistribution-2023",
  ],

  [
    "FT/2024/EL/BENCH/001",
    "Benchmarking af eldistributionsselskaber 2024",
    "Forsyningstilsynet har gennemfort benchmarkingen af danske eldistributionsselskaber for reguleringsaaret 2024. Antallet af selskaber er reduceret til 37 efter fusioner. Den gennemsnitlige effektivitetsscore er steget til 92,1%. Benchmarkmodellen er opdateret med nye output-variable, der bedre afspejler netbelastningen fra elbiler og varmepumper. Tilsynet har indfoert en kvalitetsfaktor, der justerer effektivitetsscoren for leveringssikkerhed (SAIDI og SAIFI). Selskaber med lang afbrydelsestid faar et fradrag i effektivitetsscoren.",
    "benchmark",
    "2024-10-20",
    "Alle 37 eldistributionsselskaber",
    "https://forsyningstilsynet.dk/el/benchmarking-eldistribution-2024",
  ],

  [
    "FT/2024/VARME/BENCH/001",
    "Benchmarking af varmeselskaber 2024",
    "Forsyningstilsynet har gennemfort den aarlige benchmarking af danske fjernvarmeselskaber for 2024. Benchmarkingen daekker 376 fjernvarmeselskaber og sammenligner enhedsomkostninger pr. MWh leveret varme, korrigeret for braendselstype, netlaengde, tilslutningsgraed og klima. Den gennemsnitlige varmepris er 587 kr./MWh ekskl. moms. De billigste selskaber anvender overskudsvarme fra industri eller store varmepumper, mens de dyreste er smaa naturgasbaserede vaerker. Tilsynet anbefaler fusion af de mindste selskaber for at opnaa stordriftsfordele.",
    "benchmark",
    "2024-11-01",
    "376 fjernvarmeselskaber",
    "https://forsyningstilsynet.dk/varme/benchmarking-varme-2024",
  ],

  // ═══════════════════════════════════════════════════════════════
  // MARKET MONITORING
  // ═══════════════════════════════════════════════════════════════

  [
    "FT/2023/EL/TILSYN/001",
    "Aarstilsyn med elmarkedet 2023",
    "Forsyningstilsynet har gennemfort det aarlige tilsyn med det danske elmarked for 2023. Tilsynet konstaterer, at de gennemsnitlige spotpriser paa Nord Pool var 72,3 EUR/MWh i DK1 og 68,9 EUR/MWh i DK2, et fald paa 58% i forhold til 2022. Prisfaldene skyldes primaert normalisering af gaspriser og rekordstor vindkraftproduktion. Tilsynet har undersoegt forekomsten af negative priser (482 timer i DK1, 293 timer i DK2) og vurderer, at disse afspejler markedsforholdene under perioder med stor vindproduktion og lav eftersporgsel. Tilsynet ser ingen tegn paa markedsmisbrug.",
    "market_monitoring",
    "2024-03-31",
    "Nord Pool, Energinet, alle markedsdeltagere",
    "https://forsyningstilsynet.dk/el/aarstilsyn-elmarkedet-2023",
  ],

  [
    "FT/2023/GAS/TILSYN/001",
    "Aarstilsyn med gasmarkedet 2023",
    "Forsyningstilsynet har gennemfort det aarlige tilsyn med det danske gasmarked for 2023. Det samlede danske gasforbrug faldt med 12% til ca. 1,8 mia. Nm3, fortsat pavirket af hoeje priser og omstilling til fjernvarme og varmepumper. Biogasandelen steg til 39% af det samlede gasforbrug, en stigning paa 7 procentpoint. Baltic Pipe-forbindelsen til Polen var fuldt operationel og transporterede ca. 2,1 mia. Nm3 norsk gas til Polen. Tilsynet vurderer, at gasmarkedet fungerer tilfredsstillende med god konkurrence paa detailmarkedet (8 aktive gasleverandoerer).",
    "market_monitoring",
    "2024-04-15",
    "Energinet Gas TSO, Evida, alle gasleverandoerer",
    "https://forsyningstilsynet.dk/gas/aarstilsyn-gasmarkedet-2023",
  ],

  [
    "FT/2023/VARME/TILSYN/001",
    "Aarstilsyn med varmemarkedet 2023",
    "Forsyningstilsynet har gennemfort det aarlige tilsyn med det danske varmemarked for 2023. Den gennemsnitlige fjernvarmepris steg med 4,2% til 571 kr./MWh ekskl. moms. Tilsynet har identificeret store prisforskelle mellem selskaber — fra 320 kr./MWh (stoerste selskaber med overskudsvarme) til over 1.100 kr./MWh (smaa naturgasbaserede selskaber). 87% af alle fjernvarmeselskaber har nu vedtaget omstillingsplaner for udfasning af fossile braendsler. Tilsynet har undersoegt 12 selskaber naermere paa grund af uforklarligt hoeje priser og har paabagt 3 selskaber at aendre deres prispraksis.",
    "market_monitoring",
    "2024-05-01",
    "Alle fjernvarmeselskaber",
    "https://forsyningstilsynet.dk/varme/aarstilsyn-varmemarkedet-2023",
  ],

  // ═══════════════════════════════════════════════════════════════
  // COMPLAINT DECISIONS
  // ═══════════════════════════════════════════════════════════════

  [
    "FT/2024/KLAGE/008",
    "Klageafgorelse: Urimelig nettilslutningsafgift for solcelleanlæg",
    "Forsyningstilsynet har behandlet en klage fra en landmand, der anfoeger, at netvirksomheden har opkraevet en urimelig hoej tilslutningsafgift (285.000 kr.) for tilslutning af et 500 kWp solcelleanlæg. Klageren mener, at afgiften boor daekkes af den almindelige tarifering. Forsyningstilsynet finder, at netvirksomheden er berettiget til at opkraeve tilslutningsafgift for den individuelles andel af netforstaerkningsomkostningerne, men at beregningen indeholder fejl i estimeringen af kapacitetsbehovet. Tilsynet paabyder netvirksomheden at genberegne afgiften med korrekte forudsaetninger.",
    "complaint",
    "2024-04-22",
    "Landmand (anonymiseret) vs. distributionsselskab",
    "https://forsyningstilsynet.dk/el/klageafgoerelse-2024-008",
  ],

  [
    "FT/2024/KLAGE/009",
    "Klageafgorelse: Tvist om varmeafregning ved leverandoerskift",
    "Forsyningstilsynet har behandlet en klage fra et boligselskab angaaende varmeafregning i forbindelse med skifte fra individuel naturgasfyring til fjernvarme. Boligselskabet anfoerer, at fjernvarmeselskabet har opkraevet tilslutningsbidrag for alle 120 lejligheder trods en tidligere aftale om kollektiv tilslutning med reduceret sats. Tilsynet finder, at fjernvarmeselskabet har tilsidesat den oprindelige aftale og paabyder selskabet at overholde de aftalte vilkaar. Fjernvarmeselskabet skal tilbagebetale det for meget opkraevede belob paa 1,2 mio. kr.",
    "complaint",
    "2024-05-30",
    "Boligselskab (anonymiseret) vs. fjernvarmeselskab",
    "https://forsyningstilsynet.dk/varme/klageafgoerelse-2024-009",
  ],

  [
    "FT/2024/KLAGE/010",
    "Klageafgorelse: Manglende kompensation for afbrydelse af elforsyning",
    "Forsyningstilsynet har behandlet en klage fra en erhvervsvirksomhed over manglende kompensation for en 14-timers afbrydelse af elforsyningen foraarsaget af kabelfejl i distributionsnettet. Klageren har lidt et dokumenteret produktionstab paa 430.000 kr. Forsyningstilsynet konstaterer, at netvirksomheden ikke har overholdt sin egen maalseetting for genopretningstid (max 6 timer) og ikke har givet tilstraekkelig information under afbrydelsen. Tilsynet kan ikke tilkende erstatning direkte men henviser sagen til Energiklagenaevnet og paabyder netvirksomheden at forbedre sin kommunikation under afbrydelser.",
    "complaint",
    "2024-07-15",
    "Erhvervsvirksomhed (anonymiseret) vs. distributionsselskab",
    "https://forsyningstilsynet.dk/el/klageafgoerelse-2024-010",
  ],

  [
    "FT/2024/KLAGE/011",
    "Klageafgorelse: Uenighed om biogasproducents gasafregning",
    "Forsyningstilsynet har behandlet en klage fra en biogasproducent, der anfoerer, at Evida har beregnet en for lav afregningspris for opgraderet biogas tilfoert gasnettet. Klageren mener, at Evida ikke korrekt har medregnet vaerdien af biogassens lavere CO2-aftryk i afregningen. Tilsynet konstaterer, at afregningen skal ske efter de godkendte tariffer, som ikke differentierer efter gasoprindelse. Tilsynet afviser klagen men anerkender, at der er behov for en opdatering af afregningsmetoden for at afspejle biogassens bidrag til den groenne omstilling. Tilsynet opfordrer Energistyrelsen til at revidere rammerne.",
    "complaint",
    "2024-08-20",
    "Biogasproducent (anonymiseret) vs. Evida A/S",
    "https://forsyningstilsynet.dk/gas/klageafgoerelse-2024-011",
  ],

  [
    "FT/2024/KLAGE/012",
    "Klageafgorelse: Diskrimination i fjernvarmetilslutning",
    "Forsyningstilsynet har behandlet en klage fra en grundejerforening angaaende et fjernvarmeselskabs afvisning af at tilslutte et nybyggeri til fjernvarmenettet. Fjernvarmeselskabet har afvist tilslutningen med henvisning til kapacitetsbegransninger i det lokale fjernvarmenet. Klageren anfoerer, at selskabet samtidig har tilsluttet andre nye byggerier i omraadet. Tilsynet finder, at fjernvarmeselskabet ikke har dokumenteret kapacitetsbegransningerne tilstraekkeligt og at afvisningen indeholder tegn paa usaglig forskelsbehandling. Tilsynet paabyder selskabet at tilbyde tilslutning paa lige vilkaar.",
    "complaint",
    "2024-09-10",
    "Grundejerforening (anonymiseret) vs. fjernvarmeselskab",
    "https://forsyningstilsynet.dk/varme/klageafgoerelse-2024-012",
  ],

  // ═══════════════════════════════════════════════════════════════
  // FORSYNINGSTILSYNET REGULATIONS (as methodology type)
  // ═══════════════════════════════════════════════════════════════

  [
    "FT/2024/BEK/TARIF",
    "Tariferingsbekendtgoerelsen: Regler for netvirksomheders tarifering",
    "Tariferingsbekendtgoerelsen fastsaetter regler for netvirksomheders fastsaettelse af tariffer og vilkaar for transport af el i distributionsnettet. Bekendtgoerelsen kraever, at nettariffer afspejler de faktiske omkostninger, er ikke-diskriminerende og giver korrekte prissignaler for effektiv netudnyttelse. Fra 2025 skal alle netvirksomheder anvende tidsdifferentierede tariffer med hoejere satser i spidsbelastningsperioder. Bekendtgoerelsen regulerer desuden tilslutningsbidrag, abonnementsbetalinger og saerlige tariffer for egenproducenter med nettoafregning. Forsyningstilsynet godkender netvirksomhedernes konkrete tarifmetoder.",
    "methodology",
    "2024-01-01",
    "Forsyningstilsynet, alle netvirksomheder",
    "https://forsyningstilsynet.dk/el/tariferingsbekendtgoerelsen",
  ],

  [
    "FT/2024/BEK/BENCH",
    "Benchmarkbekendtgoerelsen: Regler for benchmarking af netvirksomheder",
    "Benchmarkbekendtgoerelsen fastsaetter regler for Forsyningstilsynets aarlige benchmarking af netvirksomheder. Benchmarkingen sammenligner selskabernes totalomkostninger (TOTEX) ved hjaelp af en DEA-model (Data Envelopment Analysis) med output-variable som antal maalepunkter, netlaengde, leveret energi og geografiske forhold. Resultatet bruges til at fastsaette individuelle effektivitetskrav for det naste reguleringsaar. Selskaber, der ligger under effektivitetsfronten, paalagges at reducere deres omkostninger i retning af de mest effektive selskaber. Bekendtgoerelsen regulerer ogsaa dataindsamling, kvalitetskontrol og klageprocedurer.",
    "methodology",
    "2024-01-01",
    "Forsyningstilsynet, alle eldistributionsselskaber",
    "https://forsyningstilsynet.dk/el/benchmarkbekendtgoerelsen",
  ],

  // ═══════════════════════════════════════════════════════════════
  // ADDITIONAL REVENUE CAP AND METHOD DECISIONS
  // ═══════════════════════════════════════════════════════════════

  [
    "FT/2024/EL/RC/021",
    "Afgorelse om Energinet Elsystemansvar A/S' indtaegtsramme for 2024",
    "Forsyningstilsynet har fastsat Energinet Elsystemansvar A/S' indtaegtsramme for transmissionsvirksomhed for 2024 til 6.218 mio. kr. Rammen daekker drift og vedligeholdelse af 132-400 kV transmissionsnettet, systemydelser og balancering. Energinet har faaet godkendt store investeringsprogrammer, herunder Energioe Bornholm (1,4 mia. kr.), Viking Link vedligeholdelse og netforstaerkning i Vestjylland til nye havvindmoelleparker. Tilsynet har stillet krav om forbedret rapportering af projektomkostninger og tidsplaner for store infrastrukturprojekter.",
    "revenue_cap",
    "2024-03-20",
    "Energinet Elsystemansvar A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-energinet-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/METODE/007",
    "Metodegodkendelse: Indfoerelse af tidsdifferentierede nettariffer",
    "Forsyningstilsynet har godkendt en faelles metode for indfoerelse af tidsdifferentierede nettariffer i eldistributionsnettet. Fra 1. januar 2025 skal alle netvirksomheder anvende mindst 3 tidsperioder med differentierede tariffer: hoejlast (hverdage kl. 17-21), lavlast (nat kl. 00-06) og mellast (oevrige timer). Tarifferne skal baseres paa den faktiske netbelastning i de respektive perioder. Metoden har til formaal at reducere spidsbelastningen og udskyde investeringer i netforstaerkning. Tilsynet estimerer besparelser paa 200-400 mio. kr. aarligt for sektoren.",
    "methodology",
    "2024-09-01",
    "Alle eldistributionsselskaber",
    "https://forsyningstilsynet.dk/el/metodegodkendelse-tidsdifferentierede-tariffer-2024",
  ],

  [
    "FT/2024/VARME/008",
    "Afgorelse om Aarhus Fjernvarmes tariffer for 2024",
    "Forsyningstilsynet har vurderet Aarhus Fjernvarme A/S' tariffer for 2024. Aarhus Fjernvarme forsyner ca. 70.000 kunder i Aarhus by og naeromraader. Selskabet har gennemfort store investeringer i overgang fra kul til biomasse paa Studstrupvaerket og etablering af nye transmissionsledninger fra Lisbjerg Biogas. Tarifferne er steget med 5,5% i forhold til 2023. Tilsynet vurderer, at stigningen er begrundet i de gennemforte gronne investeringer, men stiller krav om, at Aarhus Fjernvarme udarbejder en langsigtet prisprognose for forbrugerne.",
    "tariff",
    "2024-04-30",
    "Aarhus Fjernvarme A/S",
    "https://forsyningstilsynet.dk/varme/afgoerelse-aarhus-fjernvarme-2024",
  ],

  [
    "FT/2024/EL/METODE/008",
    "Metodegodkendelse: Reguleringsregnskab for eldistributionsselskaber",
    "Forsyningstilsynet har godkendt en revideret metode for aflæggelse af reguleringsregnskab for eldistributionsselskaber. Den nye metode indforer ensartede principper for aktivering og afskrivning af netaktiver, fordeling af fællesomkostninger mellem regulerede og ikke-regulerede aktiviteter, og opgoerelse af den regulatoriske aktivbase (RAB). Metoden kraever, at selskaberne anvender standardiserede levetider for nettets komponenter (40 aar for kabler, 30 aar for transformatorer, 15 aar for IT-systemer). Tilsynet forventer, at den nye metode reducerer den administrative byrde ved aarlig indberetning.",
    "methodology",
    "2024-08-15",
    "Alle eldistributionsselskaber",
    "https://forsyningstilsynet.dk/el/metodegodkendelse-reguleringsregnskab-2024",
  ],

  [
    "FT/2024/GAS/TILSYN/002",
    "Tilsynsafgorelse: Evida A/S' haandtering af biogastilslutninger",
    "Forsyningstilsynet har gennemfort et saerligt tilsyn med Evida A/S' haandtering af tilslutningsanmodninger fra biogasproducenter. Tilsynet er ivaerksat efter klager over lange ventetider (op til 18 maaneder) for tilslutning af nye biogasopgraderingsanlæg. Tilsynet konstaterer, at Evida har forbedret processerne vasentligt i 2024, og at ventetiden nu er reduceret til 6-9 maaneder. Tilsynet paabyder Evida at udarbejde en offentlig tilslutningsplan med angivelse af kapacitetsbegraensninger og forventet ekspansion af gasnettet i biogasintensive omraader.",
    "market_monitoring",
    "2024-10-01",
    "Evida A/S, biogasproducenter",
    "https://forsyningstilsynet.dk/gas/tilsynsafgoerelse-evida-biogas-2024",
  ],

  [
    "FT/2024/VARME/009",
    "Afgorelse om Koege Fjernvarmes tariffer for 2024",
    "Forsyningstilsynet har vurderet Koege Fjernvarme A.m.b.a.'s tariffer for 2024. Koege Fjernvarme forsyner ca. 8.500 kunder og anvender primaert varme fra Koege Kraft (biomasse-kraftvarme) og overskudsvarme fra CP Kelco. Tarifferne er faldet med 0,8% i forhold til 2023 som foelge af forbedrede aftaler om overskudsvarme. Tilsynet har saerligt vurderet vilkaarene i overskudsvarmeaftalen og finder, at prisen afspejler de faktiske omkostninger i overensstemmelse med varmeforsyningslovens substitutionsprincip.",
    "tariff",
    "2024-06-25",
    "Koege Fjernvarme A.m.b.a.",
    "https://forsyningstilsynet.dk/varme/afgoerelse-koege-fjernvarme-2024",
  ],

  [
    "FT/2024/EL/TILSYN/002",
    "Tilsynsafgorelse: Kontrol af netvirksomheders leveringskvalitet 2024",
    "Forsyningstilsynet har gennemfort en tematisk kontrol af 10 udvalgte netvirksomheders leveringskvalitet for 2024. Kontrollen fokuserede paa afbrydelseshyppighed (SAIFI), afbrydelsesvarighed (SAIDI) og spandingskvalitet. Den gennemsnitlige SAIDI for de kontrollerede selskaber var 22,4 minutter (branchegennemsnit: 19,8 minutter). Et selskab havde en SAIDI paa 67 minutter, vasentligt over branchegennemsnittet, primaert paa grund af aldrende luftledninger. Tilsynet paabyder dette selskab at udarbejde en handlingsplan for forbedring af leveringskvaliteten inden 6 maaneder.",
    "market_monitoring",
    "2024-11-15",
    "10 udvalgte eldistributionsselskaber",
    "https://forsyningstilsynet.dk/el/tilsynsafgoerelse-leveringskvalitet-2024",
  ],

  [
    "FT/2024/EL/RC/020",
    "Afgorelse om N1 A/S' indtagtsramme for 2024",
    "Forsyningstilsynet har fastsat N1 A/S' (tidligere Eniig El Net) indtagtsramme for 2024 til 1.543 mio. kr. N1 er Danmarks naeststeorste distributionsselskab og forsyner ca. 400.000 kunder i Midt- og Nordjylland. Selskabet staar over for betydelige investeringsbehov i forbindelse med tilslutning af store havvindmoelleparker og Power-to-X-anlæg i Nordjylland. Effektivitetskravet er sat til 2,3%. Tilsynet har godkendt saeromkostninger til digitalisering af netovervagning og automatiseret fejlfinding i mellemspaendingsnettet.",
    "revenue_cap",
    "2024-04-05",
    "N1 A/S",
    "https://forsyningstilsynet.dk/el/afgoerelse-n1-indtagtsramme-2024",
  ],

  [
    "FT/2024/EL/METODE/009",
    "Metodegodkendelse: Fleksibilitetsydelser i distributionsnettet",
    "Forsyningstilsynet har godkendt en ny metode for netvirksomheders indkoeb af fleksibilitetsydelser som alternativ til traditionel netforstaerkning. Metoden tillader netvirksomheder at indkoebe lastfleksibilitet fra aggregatorer, elbilladeoperatoerer og varmepumpeejere via markedsbaserede mekanismer for at haandtere lokale kapacitetsbegransninger. Tilsynet fastsaetter, at fleksibilitetsindkoeb skal ske paa markedsvilkaar og vaere konkurrenceudsatte. Omkostninger til fleksibilitetsydelser kan indregnes i nettariffen, forudsat at de er billigere end den tilsvarende netforstaerkning.",
    "methodology",
    "2024-10-15",
    "Alle eldistributionsselskaber",
    "https://forsyningstilsynet.dk/el/metodegodkendelse-fleksibilitet-2024",
  ],
];
