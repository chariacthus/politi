// Skriveopgaver. Hver opgave giver dig råmaterialet — tid, sted, personer og
// hvad der skete — og du skriver teksten. Kravene tjekkes automatisk, og
// modelteksten viser, hvordan det kan gøres.

export const assignments = [
  {
    id: 'rap-indbrud',
    kind: 'Hændelsesrapport',
    title: 'Indbrud i lejlighed',
    brief:
      'Du har været på adressen efter en anmeldelse om indbrud. Skriv hændelsesrapporten, så en kollega eller en anklager kan læse den uden at kende sagen.',
    facts: [
      'Melding fra vagtcentralen kl. 23.47.',
      'Adresse: Søndergade 14, 2. th.',
      'Anmelder: Lise Hald, beboer, 41 år.',
      'I ankom kl. 23.58. Døren til lejligheden stod åben, låsen var brækket op.',
      'I stuen var to skuffer trukket ud, indholdet lå på gulvet.',
      'Lise Hald oplyste, at en bærbar computer og et armbåndsur manglede.',
      'Ingen personer blev truffet i lejligheden. Naboen i 2. tv. havde intet hørt.',
      'Teknisk afdeling blev tilkaldt kl. 00.12.',
    ],
    requirements: [
      { id: 'tid', label: 'Tidspunkt for meldingen (23.47)', pattern: /\b23[.:,]\s?47\b/, hint: 'Skriv det præcise klokkeslæt, ikke "sent om aftenen".' },
      { id: 'ankomst', label: 'Tidspunkt for ankomst (23.58)', pattern: /\b23[.:,]\s?58\b/, hint: 'Både melding og ankomst skal kunne tidsfæstes.' },
      { id: 'adresse', label: 'Adressen', pattern: /søndergade\s*14/i, hint: 'Fuld adresse med husnummer.' },
      { id: 'anmelder', label: 'Anmelderens navn', pattern: /hald/i, hint: 'Navngiv anmelderen, så forklaringen kan knyttes til en person.' },
      { id: 'iagttagelse', label: 'Hvad I så ved døren', pattern: /(låsen|lås|brækket|opbrudt|stod åben)/i, hint: 'Beskriv opbruddet — det er sporet på gerningsmåden.' },
      { id: 'koster', label: 'Det meldte savnede', pattern: /(computer|bærbar|ur|armbåndsur)/i, hint: 'Hvad manglede — og hvem har oplyst det.' },
      { id: 'teknik', label: 'Tilkald af teknisk afdeling', pattern: /(teknisk|teknikere|kriminalteknisk)/i, hint: 'Skriv hvilke skridt I tog, og hvornår.' },
    ],
    guidance: [
      'Skriv i datid og i den rækkefølge, tingene skete.',
      'Adskil dine egne iagttagelser fra det, anmelderen har oplyst.',
      'Undgå at konkludere, hvem der har gjort det — beskriv kun sporene.',
    ],
    minWords: 90,
    model:
      'Kl. 23.47 modtog patruljen melding fra vagtcentralen om indbrud på Søndergade 14, 2. th. Vi ankom til adressen kl. 23.58.\n\nVed ankomsten stod døren til lejligheden åben. Låsen var brækket op, og karmen var flækket ud for låsekassen. I stuen var to skuffer trukket ud, og indholdet lå spredt på gulvet.\n\nAnmelder Lise Hald, beboer i lejligheden, oplyste, at en bærbar computer og et armbåndsur manglede. Vi gennemsøgte lejligheden og traf ingen personer. Naboen i 2. tv. oplyste, at hun intet havde hørt.\n\nKl. 00.12 tilkaldte jeg teknisk afdeling med henblik på sikring af spor ved døren og skufferne.',
  },
  {
    id: 'rap-faerdsel',
    kind: 'Anmeldelsesnotat',
    title: 'Færdselsuheld i kryds',
    brief:
      'To biler er stødt sammen i et kryds. Skriv notatet, så det kan bruges til den videre sagsbehandling — og så ingen er i tvivl om, hvad der er iagttagelse, og hvad der er forklaring.',
    facts: [
      'Uheldet skete kl. 07.35 i krydset Ringvej Syd / Elmevej.',
      'Fører 1: Jonas Bak, 28 år, sort VW Golf, AB 12 345.',
      'Fører 2: Merete Find, 63 år, hvid Toyota Yaris, XY 98 765.',
      'Jonas Bak forklarede, at han havde grønt lys.',
      'Merete Find forklarede, at hun havde grønt lys.',
      'Bremsespor efter VW Golf målt til 14 meter.',
      'Ingen personskade. Begge biler blev bugseret kl. 08.20.',
      'Vidne: Ali Karim, 34 år, stod ved busstoppestedet.',
    ],
    requirements: [
      { id: 'tid', label: 'Tidspunkt (07.35)', pattern: /\b0?7[.:,]\s?35\b/, hint: 'Præcist klokkeslæt.' },
      { id: 'sted', label: 'Krydset', pattern: /(ringvej|elmevej)/i, hint: 'Stedet skal kunne findes på et kort.' },
      { id: 'foerer1', label: 'Fører 1 med køretøj', pattern: /(bak|golf|ab\s?12\s?345)/i, hint: 'Navn og registreringsnummer.' },
      { id: 'foerer2', label: 'Fører 2 med køretøj', pattern: /(find|yaris|xy\s?98\s?765)/i, hint: 'Navn og registreringsnummer.' },
      { id: 'modstrid', label: 'De modstridende forklaringer', pattern: /(forklarede|oplyste|begge)/i, hint: 'Gengiv begge forklaringer som forklaringer — tag ikke stilling.' },
      { id: 'spor', label: 'Bremsesporet (14 meter)', pattern: /\b14\s?(m|meter)\b/i, hint: 'Målfaste oplysninger er guld i en færdselssag.' },
      { id: 'vidne', label: 'Vidnet', pattern: /(karim|vidne)/i, hint: 'Navngiv vidnet, så det kan afhøres senere.' },
    ],
    guidance: [
      'Skriv aldrig hvem der havde skylden. Skriv hvad der blev målt, set og forklaret.',
      'Brug "forklarede, at ..." om begge førere — så er det tydeligt, at det er udsagn.',
      'Tag registreringsnumre med i fuld form.',
    ],
    minWords: 90,
    model:
      'Kl. 07.35 skete et færdselsuheld i krydset Ringvej Syd / Elmevej mellem to personbiler.\n\nFører 1 var Jonas Bak, 28 år, der førte en sort VW Golf, reg.nr. AB 12 345. Fører 2 var Merete Find, 63 år, der førte en hvid Toyota Yaris, reg.nr. XY 98 765.\n\nJonas Bak forklarede, at han kørte frem for grønt lys. Merete Find forklarede ligeledes, at hun kørte frem for grønt lys. Forklaringerne er indbyrdes modstridende.\n\nJeg målte bremsespor efter VW Golf til 14 meter i krydsets nordlige del. Ingen af parterne oplyste om personskade. Begge køretøjer blev bugseret fra stedet kl. 08.20.\n\nAli Karim, 34 år, der stod ved busstoppestedet, blev noteret som vidne.',
  },
  {
    id: 'rap-afhoering',
    kind: 'Afhøringsreferat',
    title: 'Vidne til butikstyveri',
    brief:
      'Du har afhørt et vidne til et butikstyveri. Skriv referatet, så det står klart, hvad vidnet selv har set, og hvad vidnet ikke kan huske.',
    facts: [
      'Afhøringen fandt sted kl. 16.10 i butikkens baglokale.',
      'Vidne: Sofie Dam, 22 år, ansat i butikken.',
      'Hun så en mand lægge to flasker spiritus i en rygsæk.',
      'Manden gik forbi kassen uden at betale.',
      'Signalement: ca. 180 cm, mørk jakke, blå kasket.',
      'Hun kunne ikke huske, om han havde skæg.',
      'Hun så ham gå mod parkeringspladsen, men ikke hvilken retning derefter.',
      'Butikkens overvågning dækker kassen, men ikke spiritusreolen.',
    ],
    requirements: [
      { id: 'tid', label: 'Tidspunkt for afhøringen (16.10)', pattern: /\b16[.:,]\s?10\b/, hint: 'Afhøringens tidspunkt skal fremgå.' },
      { id: 'vidne', label: 'Vidnets navn og rolle', pattern: /dam/i, hint: 'Navn, alder og hvorfor personen er vidne.' },
      { id: 'handling', label: 'Det hun så (flasker i rygsæk)', pattern: /(flasker|rygsæk|spiritus)/i, hint: 'Beskriv handlingen, som vidnet så den.' },
      { id: 'kasse', label: 'Passagen forbi kassen', pattern: /(kasse|betal)/i, hint: 'Det er her, forholdet bliver strafbart.' },
      { id: 'signalement', label: 'Signalement', pattern: /(180|kasket|jakke)/i, hint: 'Højde, tøj, kendetegn.' },
      { id: 'huller', label: 'Det hun IKKE kunne huske', pattern: /(ikke (kunne )?huske|kunne ikke (huske|oplyse|sige)|husker ikke|var usikker|ikke sikker)/i, hint: 'Skriv hullerne ind — det styrker forklaringens troværdighed.' },
      { id: 'video', label: 'Overvågningens dækning', pattern: /(overvågning|kamera|video)/i, hint: 'Hvad kan bekræftes teknisk, og hvad kan ikke.' },
    ],
    guidance: [
      'Referatet skal skelne skarpt mellem iagttagelse og hukommelseshul.',
      'Gengiv vidnets egne ord ved de vigtige detaljer.',
      'Læg aldrig ord i munden på vidnet — ledende spørgsmål ødelægger forklaringen.',
    ],
    minWords: 90,
    model:
      'Kl. 16.10 afhørte jeg Sofie Dam, 22 år, ansat i butikken, i butikkens baglokale.\n\nSofie Dam forklarede, at hun så en mand tage to flasker spiritus fra reolen og lægge dem i en rygsæk. Hun så herefter manden gå forbi kassen og ud af butikken uden at betale.\n\nHun beskrev manden som ca. 180 cm høj, iført mørk jakke og blå kasket. Adspurgt om manden havde skæg, forklarede hun, at hun ikke kunne huske det.\n\nHun så manden gå i retning mod parkeringspladsen, men kunne ikke oplyse, hvilken retning han tog derfra.\n\nSofie Dam oplyste, at butikkens overvågning dækker kasseområdet, men ikke reolen med spiritus.',
  },
  {
    id: 'rap-magt',
    kind: 'Notat om magtanvendelse',
    title: 'Anholdelse foran natklub',
    brief:
      'Du har anvendt magt under en anholdelse. Notatet skal kunne bære en klagesag: hvad gik forud, hvad gjorde du, hvorfor var det nødvendigt, og hvad skete bagefter.',
    facts: [
      'Kl. 03.05 ved natklub på Jernbanegade.',
      'Manden: Rasmus Vig, 24 år, blev afvist i døren.',
      'Han råbte ad dørmanden og skubbede til ham.',
      'Du gav to gange mundtligt påbud om at forlade stedet.',
      'Han fortsatte og rettede et knytnæveslag mod dørmanden.',
      'Du lagde ham i en førergreb og førte ham til jorden. Ingen slag anvendt.',
      'Håndjern påsat kl. 03.07. Han blev rejst op igen med det samme.',
      'Ingen synlige skader. Han afviste tilbud om tilsyn af ambulancebehandler.',
    ],
    requirements: [
      { id: 'tid', label: 'Tidspunkt (03.05)', pattern: /\b0?3[.:,]\s?05\b/, hint: 'Både tidspunkt for hændelsen og for håndjern.' },
      { id: 'sted', label: 'Stedet', pattern: /(jernbanegade|natklub)/i, hint: 'Adresse eller sted.' },
      { id: 'person', label: 'Personens navn', pattern: /vig/i, hint: 'Navngiv den, indgrebet er rettet mod.' },
      { id: 'forud', label: 'Hvad der gik forud', pattern: /(skub|råb|afvist|slag)/i, hint: 'Optrapningen forklarer nødvendigheden.' },
      { id: 'paabud', label: 'De mundtlige påbud', pattern: /(påbud|opfordr|bad ham|anvist)/i, hint: 'Mindre indgribende midler skal være forsøgt først.' },
      { id: 'magt', label: 'Præcis hvilken magt du brugte', pattern: /(førergreb|greb|til jorden|håndjern)/i, hint: 'Beskriv grebet — ikke bare "magt blev anvendt".' },
      { id: 'efter', label: 'Tilstand og tilbud om tilsyn bagefter', pattern: /(skader|tilsyn|ambulance|behandler)/i, hint: 'Hvad skete der efter indgrebet.' },
    ],
    guidance: [
      'Skriv i aktiv form: "jeg lagde ham i førergreb" — ikke "der blev anvendt magt".',
      'Nødvendighed og proportionalitet skal fremgå af handlingsforløbet, ikke som en påstand.',
      'Notér altid tilstand og eventuelle tilbud om tilsyn bagefter.',
    ],
    minWords: 100,
    expectsStatements: false,
    model:
      'Kl. 03.05 befandt jeg mig ud for natklubben på Jernbanegade, hvor Rasmus Vig, 24 år, var blevet afvist i døren.\n\nRasmus Vig råbte ad dørmanden og skubbede ham i brystet med begge hænder. Jeg gav ham to gange mundtligt påbud om at forlade stedet. Han efterkom ikke påbuddene og rettede herefter et knytnæveslag mod dørmanden.\n\nJeg lagde ham i førergreb om højre arm og førte ham kontrolleret til jorden. Jeg anvendte ikke slag eller andre magtmidler. Kl. 03.07 påsatte jeg håndjern, hvorefter jeg rejste ham op igen.\n\nJeg konstaterede ingen synlige skader. Rasmus Vig blev tilbudt tilsyn af ambulancebehandler, hvilket han afviste.',
  },
  {
    id: 'mail-borger',
    kind: 'Brev til borger',
    title: 'Svar på klage over ventetid',
    brief:
      'En borger har klaget over, at hendes anmeldelse ikke er blevet behandlet i tre uger. Skriv svaret. Det er tonen, der er opgaven: sagligt, imødekommende og uden at love noget, du ikke kan holde.',
    facts: [
      'Borger: Hanne Lund. Anmeldelse om hærværk på hendes bil, modtaget 3. marts.',
      'Sagen er oprettet, men endnu ikke fordelt til en sagsbehandler.',
      'Der er aktuelt længere sagsbehandlingstid på grund af travlhed.',
      'Sagen kan ikke prioriteres frem for andre sager.',
      'Hun får besked, når sagen er fordelt.',
      'Sagsnummer: 4300-12345-00234-24.',
    ],
    requirements: [
      { id: 'tiltale', label: 'Personlig tiltale af borgeren', pattern: /(hanne|lund|kære)/i, hint: 'Skriv til mennesket, ikke til en sagsakt.' },
      { id: 'sagsnr', label: 'Sagsnummer', pattern: /4300|12345|00234/, hint: 'Så borgeren kan henvise til sagen.' },
      { id: 'anerkend', label: 'Anerkendelse af ventetiden', pattern: /(beklager|forstår|ked af|ærgerligt|måttet vente|desværre længere|lang tid)/i, hint: 'Anerkend ventetiden uden at gå i forsvar.' },
      { id: 'forklaring', label: 'Forklaring på, hvor sagen står', pattern: /(oprettet|fordelt|sagsbehandler)/i, hint: 'Sig konkret, hvor sagen ligger lige nu.' },
      { id: 'naeste', label: 'Hvad der sker herefter', pattern: /(får besked|kontakter dig|vender tilbage|når sagen)/i, hint: 'Et klart næste skridt fjerner det meste af frustrationen.' },
      { id: 'ingen-loefte', label: 'Ingen løfter om en bestemt dato', pattern: /^(?!.*\b(garanterer|lover|senest på (mandag|fredag))\b).*$/is, hint: 'Lov aldrig en dato, du ikke er herre over.' },
    ],
    guidance: [
      'Undgå kancellisprog: "Deres henvendelse af 3. marts er modtaget og journaliseret" siger intet.',
      'Skriv korte sætninger og brug "jeg" og "du".',
      'Slut med hvad der sker herefter — ikke med en undskyldning.',
    ],
    minWords: 70,
    toneCheck: true,
    needsClock: false,
    expectsStatements: false,
    model:
      'Kære Hanne Lund\n\nTak for din henvendelse om din anmeldelse af hærværk på din bil fra den 3. marts. Sagen har sagsnummer 4300-12345-00234-24.\n\nJeg kan se, at sagen er oprettet, men at den endnu ikke er fordelt til en sagsbehandler. Vi har for tiden længere sagsbehandlingstid end normalt, og jeg er ked af, at du har måttet vente.\n\nJeg kan ikke prioritere din sag frem for de øvrige sager, og jeg kan derfor ikke give dig en dato. Du får besked, så snart sagen er fordelt til en sagsbehandler.\n\nDu er velkommen til at skrive igen, hvis du har spørgsmål til sagen.\n\nMed venlig hilsen',
  },
  {
    id: 'rap-psykisk',
    kind: 'Døgnrapportnotat',
    title: 'Overdragelse af person i krise',
    brief:
      'En person i psykisk krise er overdraget til ambulancen. Skriv notatet kort og fagligt — det læses af vagthavende og kan blive grundlag for en senere vurdering.',
    facts: [
      'Kl. 14.20 på banegården, melding fra DSB-personale.',
      'Kvinde: Mia Sø, 31 år, kendt adresse ukendt.',
      'Hun talte højt med sig selv og reagerede ikke på personalets henvendelser.',
      'Ingen våben. Ingen trusler mod andre. Ingen tegn på selvskade.',
      'Hun sagde til dig: "De er sendt efter mig."',
      'Du holdt afstand og talte med hende i ca. 12 minutter.',
      'Ambulancen ankom kl. 14.46. Hun gik frivilligt med.',
      'Ingen magtanvendelse.',
    ],
    requirements: [
      { id: 'tid', label: 'Tidspunkt (14.20)', pattern: /\b14[.:,]\s?20\b/, hint: 'Melding og overdragelse skal begge kunne tidsfæstes.' },
      { id: 'sted', label: 'Stedet', pattern: /(banegård|station|dsb)/i, hint: 'Hvor traf I hende.' },
      { id: 'person', label: 'Personens navn og alder', pattern: /(sø|31)/i, hint: 'Identitet så langt den er kendt.' },
      { id: 'adfaerd', label: 'Den adfærd, I iagttog', pattern: /(talte højt|reagerede ikke|selv)/i, hint: 'Beskriv adfærden — ikke en diagnose.' },
      { id: 'sikkerhed', label: 'Fravær af våben og trusler', pattern: /(ingen våben|ingen trusler|ikke truende)/i, hint: 'Det er afgørende for den efterfølgende vurdering.' },
      { id: 'overdragelse', label: 'Overdragelsen til ambulancen (14.46)', pattern: /(14[.:,]\s?46|ambulance)/i, hint: 'Hvem overtog, hvornår og hvordan.' },
      { id: 'magt', label: 'At der ikke blev anvendt magt', pattern: /(ingen magt|uden magt|frivilligt)/i, hint: 'Skriv det eksplicit — fraværet er også en oplysning.' },
    ],
    guidance: [
      'Skriv aldrig en diagnose. Beskriv adfærd og udsagn.',
      'Citer personens egne ord, hvor de har betydning.',
      'Notér både hvad I gjorde, og hvad I bevidst ikke gjorde.',
    ],
    minWords: 90,
    model:
      'Kl. 14.20 modtog patruljen melding fra DSB-personale om en kvinde på banegården, som talte højt med sig selv og ikke reagerede på personalets henvendelser.\n\nVed ankomsten traf vi Mia Sø, 31 år. Adresse er ukendt. Hun talte højt og usammenhængende og trådte et skridt tilbage, da jeg nærmede mig. Hun udtalte til mig: "De er sendt efter mig."\n\nJeg holdt afstand og talte med hende i ca. 12 minutter. Jeg konstaterede ingen våben, og hun fremsatte ingen trusler mod andre. Jeg iagttog ingen tegn på selvskade.\n\nAmbulancen ankom kl. 14.46, hvorefter Mia Sø frivilligt fulgte med ambulancebehandlerne. Der blev ikke anvendt magt.',
  },
]
