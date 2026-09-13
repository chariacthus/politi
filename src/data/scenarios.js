// Situationer med fokus på tone. Hvert valg er skrevet, så forskellen mellem
// svarene handler om kommunikation — ikke om hvorvidt indgrebet er lovligt.
// Modelsvaret er en formulering, der både er tydelig og deeskalerende.

export const scenarios = [
  {
    id: 'sc-faerdsel',
    title: 'Standsning af bilist om natten',
    context:
      'Kl. 01.20 standser I en bil på en landevej, fordi det ene baglygteglas er knust. Føreren er en mand i 30-erne. Han sænker ruden, inden du når frem, og virker anspændt.',
    tension: 2,
    principles: [
      'Præsentér dig, og sig årsagen til standsningen inden for de første ti sekunder.',
      'Fortæl hvad der sker nu — uvished skaber modstand.',
      'Hold tiltaleformen konsekvent, og brug korte sætninger.',
      'Svar på spørgsmål om hjemmel roligt. Det er borgerens ret at spørge.',
    ],
    turns: [
      {
        situation: 'Du er nået hen til førerdøren. Manden ser op på dig og siger ingenting.',
        requires: [
          { pattern: /(politi|jeg hedder|godaften|goddag)/i, text: 'Præsentér dig, eller markér tydeligt at du er politiet.' },
          { pattern: /(fordi|årsag|grunden|baglygte|lygte)/i, text: 'Sig årsagen til standsningen — det er den vigtigste sætning i hele kontakten.' },
        ],
        options: [
          { text: 'Godaften, politiet. Jeg hedder Bjarke. Jeg standser dig, fordi dit ene baglygteglas er knust. Må jeg se dit kørekort?', tone: 'professionel', score: 2, feedback: 'Præsentation, årsag og næste skridt i tre korte sætninger. Det er sådan en kontakt skal åbne.' },
          { text: 'Kørekort og registreringsattest, tak.', tone: 'neutral', score: 1, feedback: 'Korrekt, men uden årsag. Borgeren ved ikke, hvorfor han er standset, og det er dér modstanden begynder.' },
          { text: 'Ved du selv, hvorfor jeg standser dig?', tone: 'konfrontatorisk', score: 0, feedback: 'Et kontrolspørgsmål, der lægger op til en magtkamp. Du har oplysningen — giv den.' },
        ],
        modelAnswer:
          'Godaften, politiet. Jeg hedder Bjarke Sørensen. Jeg standser dig, fordi dit venstre baglygteglas er knust. Jeg skal bede om dit kørekort.',
      },
      {
        situation: 'Han rækker dig kørekortet og siger hårdt: "I har sgu ikke noget bedre at lave, hvad? Jeg har ikke gjort noget."',
        requires: [
          { pattern: /(forstår|hører|ved godt|kan godt se)/i, text: 'Anerkend hans reaktion med en kort sætning, inden du fortsætter. Det koster dig ingenting og dæmper tonen.' },
        ],
        options: [
          { text: 'Jeg kan godt høre, du er irriteret. Det er en helt almindelig kontrol, og den tager to minutter. Så er du videre.', tone: 'professionel', score: 2, feedback: 'Du anerkender uden at give efter, og du sætter en tidsramme. Forudsigelighed dæmper modstand.' },
          { text: 'Så er det nok. Du svarer bare på det, jeg spørger om.', tone: 'konfrontatorisk', score: 0, feedback: 'Du hæver konfliktniveauet på en verbal provokation. Det gør en rutinekontrol til en sag.' },
          { text: 'Det er bare rutine.', tone: 'passiv', score: 1, feedback: 'Ikke forkert, men for tyndt. "Bare rutine" svarer ikke på det, han faktisk er irriteret over.' },
        ],
        modelAnswer:
          'Jeg kan godt høre, at du er irriteret. Kontrollen her tager to minutter, og så kører du videre. Jeg tjekker kørekortet, og så snakker vi om lygten.',
      },
      {
        situation: 'Kontrollen er i orden. Lygten skal udbedres. Han spørger: "Får jeg så en bøde, eller hvad?"',
        options: [
          { text: 'Nej. Du får en henstilling: lygten skal skiftes inden for 14 dage. Kører du videre uden at få den lavet, kan det koste en bøde næste gang. Kør forsigtigt.', tone: 'professionel', score: 2, feedback: 'Klart svar, klar frist, klar konsekvens. Han går fra kontakten uden tvivl om, hvad han skal.' },
          { text: 'Det finder du ud af.', tone: 'konfrontatorisk', score: 0, feedback: 'Unødvendig magtdemonstration. Det skaber klager og dårligt omdømme uden at løse noget.' },
          { text: 'Nej nej, det er fint det hele, kør du bare.', tone: 'passiv', score: 1, feedback: 'For løs. Han fik ikke at vide, at lygten faktisk skal udbedres, og indgrebet mister sin mening.' },
        ],
        modelAnswer:
          'Nej. Du får en henstilling om at få lygten skiftet inden for 14 dage. Bliver du standset igen med den, kan det koste en bøde. Kør forsigtigt.',
      },
    ],
  },

  {
    id: 'sc-nabostrid',
    title: 'Støjklage og ophidset nabo',
    context:
      'Kl. 23.40 er I kaldt til en adresse efter en støjanmeldelse. Naboen, en mand i 50-erne, står i opgangen og er allerede i gang, inden I når op ad trappen. Han råber om, at "der aldrig sker noget".',
    tension: 3,
    principles: [
      'Lad ham tale færdig. Afbrydelser forlænger konflikten.',
      'Adskil det, du kan gøre noget ved, fra det, du ikke kan.',
      'Lov aldrig mere, end du kan holde.',
      'Tal til begge parter i samme tone — ellers mister du din upartiskhed.',
    ],
    turns: [
      {
        situation: 'Han råber: "I kommer hver gang og går igen, og så starter det forfra! Hvad fanden skal jeg gøre?"',
        requires: [
          { pattern: /(forstår|hører|frustrer|irriter)/i, text: 'Anerkend frustrationen, før du forklarer hvad du kan gøre.' },
        ],
        options: [
          { text: 'Jeg kan godt høre, at det har stået på længe. Fortæl mig, hvad der er sket i aften, så tager vi den derfra.', tone: 'professionel', score: 2, feedback: 'Du anerkender historikken og flytter samtalen til det konkrete, du faktisk kan handle på.' },
          { text: 'Du bliver nødt til at falde ned, ellers kan vi ikke hjælpe dig.', tone: 'konfrontatorisk', score: 0, feedback: '"Fald ned" gør folk mere ophidsede, og det lyder som en betingelse for at få hjælp.' },
          { text: 'Vi kan desværre ikke gøre så meget ved den slags.', tone: 'passiv', score: 1, feedback: 'Muligvis rigtigt, men sagt for tidligt. Nu har du lukket samtalen, før du har hørt, hvad der skete i aften.' },
        ],
        modelAnswer:
          'Jeg kan godt høre, at det her har stået på længe, og at du er frustreret. Fortæl mig, hvad der er sket i aften, så ser vi på, hvad vi kan gøre nu.',
      },
      {
        situation: 'Han fortæller om høj musik og dunk i gulvet. Så siger han: "I går bare ind og smider dem ud, ikke?"',
        options: [
          { text: 'Sådan fungerer det ikke. Jeg banker på og taler med dem om støjen. Hvis det fortsætter, kan der blive tale om et påbud. Jeg fortæller dig bagefter, hvad vi har aftalt.', tone: 'professionel', score: 2, feedback: 'Du afviser en urealistisk forventning uden at være afvisende, og du siger hvad du rent faktisk gør.' },
          { text: 'Ja ja, vi skal nok ordne det.', tone: 'passiv', score: 0, feedback: 'Et løfte du ikke kan holde. Når det ikke sker, mister ikke bare du, men politiet som helhed troværdighed.' },
          { text: 'Det bestemmer vi, ikke dig.', tone: 'konfrontatorisk', score: 0, feedback: 'Teknisk rigtigt, tonemæssigt forkert. Du gør en allieret til en modstander.' },
        ],
        modelAnswer:
          'Sådan fungerer det ikke. Jeg banker på og taler med dem om støjen. Fortsætter det, kan der blive tale om et påbud. Jeg siger til dig bagefter, hvad vi har aftalt med dem.',
      },
      {
        situation: 'Efter samtalen med naboerne er der ro. Anmelderen står stadig i opgangen og venter på dig.',
        options: [
          { text: 'Jeg har talt med dem, og de skruer ned nu. Fortsætter det i nat, så ring igen — så har vi den her samtale med i sagen.', tone: 'professionel', score: 2, feedback: 'Du lukker kontakten med et resultat og en vej videre. Det er dét, der gør, at han ikke føler sig ignoreret.' },
          { text: 'Nu skulle der være ro. Godnat.', tone: 'neutral', score: 1, feedback: 'Kort og korrekt, men han ved ikke, hvad han gør, hvis det starter igen.' },
          { text: 'Så, nu må du altså også selv lære at leve med lidt lyd i en etageejendom.', tone: 'konfrontatorisk', score: 0, feedback: 'En belærende bemærkning til den, der har ringet. Det er sådan klager opstår.' },
        ],
        modelAnswer:
          'Jeg har talt med dem, og de skruer ned nu. Hvis det starter igen i nat, så ring til os — så indgår den her samtale i sagen.',
      },
    ],
  },

  {
    id: 'sc-paaroerende',
    title: 'Underretning af pårørende',
    context:
      'I skal underrette en kvinde om, at hendes voksne søn er omkommet i et færdselsuheld. Hun åbner døren og ser jer stå i uniform. Dette er den sværeste samtale, du kommer til at føre.',
    tension: 4,
    principles: [
      'Bed om at komme indenfor, og få hende til at sidde ned, inden du siger det.',
      'Sig det direkte og med det rigtige ord: "død". Omskrivninger efterlader tvivl.',
      'Hold pause bagefter. Stilhed er ikke noget, du skal udfylde.',
      'Undgå trøstefraser som "det skal nok gå". De trøster ikke — de lukker samtalen.',
    ],
    turns: [
      {
        situation: 'Hun står i døren: "Hvad er der sket? Er der sket noget?"',
        options: [
          { text: 'Må vi komme indenfor? Jeg har en alvorlig besked til dig, og jeg vil hellere give den, når du sidder ned.', tone: 'professionel', score: 2, feedback: 'Du forbereder hende uden at trække den ud, og du sikrer, at beskeden gives et sted, hvor hun kan tage imod den.' },
          { text: 'Din søn er desværre død. Han kørte galt i aften.', tone: 'neutral', score: 1, feedback: 'Direkte og ærligt — men givet i en døråbning. Få hende indenfor og siddende først, hvis situationen overhovedet tillader det.' },
          { text: 'Det er ikke noget alvorligt, må vi lige komme ind?', tone: 'passiv', score: 0, feedback: 'En usandhed. Når sandheden kommer et minut senere, husker hun, at politiet løj for hende.' },
        ],
        modelAnswer:
          'Må vi komme indenfor? Jeg har en alvorlig besked til dig, og jeg vil gerne give den, når du sidder ned.',
      },
      {
        situation: 'I sidder i stuen. Hun ser på dig og venter.',
        requires: [
          { pattern: /\b(død|omkommet|afgået ved døden)\b/i, text: 'Brug det rigtige ord. Omskrivninger som "ikke klarede den" efterlader tvivl, hun ikke har brug for.' },
        ],
        options: [
          { text: 'Jeg er nødt til at fortælle dig, at din søn Mikkel er død. Han var involveret i et færdselsuheld på Ringvejen i aften. Han døde på stedet.', tone: 'professionel', score: 2, feedback: 'Navn, det rigtige ord, og de få fakta hun har brug for. Ikke mere.' },
          { text: 'Der har været en ulykke, og det ser desværre ikke så godt ud.', tone: 'passiv', score: 0, feedback: 'Uklart. Hun vil spørge "er han i live?", og du er nødt til at sige det alligevel — nu med et minuts ekstra usikkerhed.' },
          { text: 'Din søn er død. Har du nogen, vi kan ringe til?', tone: 'neutral', score: 1, feedback: 'Beskeden er klar, men du går videre til det praktiske med det samme. Giv hende pausen først.' },
        ],
        modelAnswer:
          'Jeg er nødt til at fortælle dig, at din søn Mikkel er død. Han var involveret i et færdselsuheld på Ringvejen i aften og døde på stedet. Det gør mig ondt.',
      },
      {
        situation: 'Hun græder. Efter et stykke tid siger hun: "Hvorfor kunne I ikke nå frem i tide?"',
        options: [
          { text: 'Det spørgsmål er helt rimeligt. Jeg har ikke alle svarene endnu — der er en undersøgelse i gang, og du får besked, når vi ved mere. Er der nogen, du gerne vil have herhen nu?', tone: 'professionel', score: 2, feedback: 'Du afviser ikke spørgsmålet, lover ikke noget du ikke ved, og flytter fokus til det, hun har brug for lige nu.' },
          { text: 'Vi gjorde alt, hvad vi kunne.', tone: 'neutral', score: 1, feedback: 'En standardfrase. Den kan være sand, men den lyder som en afvisning i det øjeblik.' },
          { text: 'Det kan jeg ikke svare på.', tone: 'passiv', score: 0, feedback: 'Korrekt indhold, forkert form. Uden en forklaring på hvorfor, lyder det som ligegyldighed.' },
        ],
        modelAnswer:
          'Det er et helt rimeligt spørgsmål. Jeg har ikke svaret endnu — der er en undersøgelse i gang, og du får besked, når vi ved mere. Er der nogen, jeg skal ringe til, så du ikke er alene?',
      },
    ],
  },

  {
    id: 'sc-natteliv',
    title: 'Beruset person foran natklub',
    context:
      'Kl. 03.05 er der uro foran en natklub. En ung mand er blevet afvist i døren og råber ad dørmanden. Der står 15-20 mennesker omkring jer, flere med telefoner fremme.',
    tension: 4,
    principles: [
      'Skab afstand mellem parterne, før du begynder at tale.',
      'Én betjent taler. To stemmer ind i en beruset person skaber kaos.',
      'Giv én besked ad gangen, og gentag den ordret frem for at omformulere.',
      'Publikum påvirker udfaldet. Tal, som om optagelsen bliver vist i retten — for det kan den blive.',
    ],
    turns: [
      {
        situation: 'Manden vender sig mod dig og råber: "Han skubbede mig! Hvorfor tager I altid deres parti?"',
        options: [
          { text: 'Kom lige med herover, så vi kan tale sammen uden alle de andre. Jeg vil gerne høre din version.', tone: 'professionel', score: 2, feedback: 'Du skaber afstand og giver ham en rolle som nogen, der bliver hørt. Det tager luften ud af optrinnet.' },
          { text: 'Du skal holde op med at råbe nu!', tone: 'konfrontatorisk', score: 0, feedback: 'At råbe tilbage til en beruset person foran et publikum eskalerer næsten altid. Og det ser skidt ud på video.' },
          { text: 'Prøv nu at tage det roligt, ikke?', tone: 'passiv', score: 1, feedback: '"Tag det roligt" opleves nedladende af en, der føler sig uretfærdigt behandlet.' },
        ],
        modelAnswer:
          'Kom med herover, hvor vi kan tale uden alle de andre. Jeg vil gerne høre, hvad der skete — men vi gør det herovre.',
      },
      {
        situation: 'Han følger med, men er stadig ophidset. En fra publikum filmer tæt på og råber: "Politivold!"',
        options: [
          { text: 'I må gerne filme. Træd to skridt tilbage, så vi kan tale sammen.', tone: 'professionel', score: 2, feedback: 'Korrekt: filmoptagelse på offentligt sted er lovlig. Du bruger ikke energi på det og fastholder i stedet din afstand.' },
          { text: 'Sluk den telefon, eller jeg tager den.', tone: 'konfrontatorisk', score: 0, feedback: 'Både forkert og skadeligt. Det bliver den ene sætning, hele klippet handler om.' },
          { text: 'Du kan ikke bare stå og filme her.', tone: 'konfrontatorisk', score: 0, feedback: 'Det kan hun faktisk. En forkert oplysning om hjemmel koster din troværdighed på stedet.' },
        ],
        modelAnswer:
          'I må gerne filme. Træd et par skridt tilbage, så vi kan tale sammen her.',
      },
      {
        situation: 'Han falder til ro, men har svært ved at stå op og vil ind i nattelivet igen.',
        options: [
          { text: 'Du kommer ikke ind igen i aften. Har du nogen, du kan tage hjem med, eller skal jeg hjælpe dig med en taxa?', tone: 'professionel', score: 2, feedback: 'Klar besked plus en udvej. Det gør det nemt for ham at sige ja uden at tabe ansigt.' },
          { text: 'Så er festen slut for dig, kammerat. Hjem med dig.', tone: 'konfrontatorisk', score: 0, feedback: '"Kammerat" og hånlig tone genstarter konflikten, netop som den var ved at være ovre.' },
          { text: 'Vi tager dig med på stationen.', tone: 'neutral', score: 0, feedback: 'Uforholdsmæssigt, når han er faldet til ro. Det mindst indgribende middel skal forsøges først.' },
        ],
        modelAnswer:
          'Du kommer ikke ind igen i aften. Har du nogen at følges hjem med, eller skal jeg hjælpe dig med at få en taxa?',
      },
    ],
  },

  {
    id: 'sc-psykisk',
    title: 'Person i psykisk krise',
    context:
      'En kvinde på ca. 30 år står på en banegård og taler højt med sig selv. Hun har en pose i hånden og reagerer ikke på personalets henvendelser. Der er ingen tegn på våben, men hun er tydeligt utryg.',
    tension: 3,
    principles: [
      'Sænk tempoet. Tal langsommere og lavere, end du plejer.',
      'Hold afstand, og undgå at omringe hende — flere uniformer tæt på opleves som en trussel.',
      'Diskutér ikke virkelighedsopfattelsen. Forhold dig til følelsen, ikke til indholdet.',
      'Sig dit navn, og brug hendes, hvis du kender det.',
    ],
    turns: [
      {
        situation: 'Du nærmer dig. Hun siger højt: "Bliv væk! I er sendt efter mig!"',
        options: [
          { text: 'Jeg bliver stående her. Jeg hedder Line, og jeg er fra politiet. Jeg vil bare høre, om du har det godt.', tone: 'professionel', score: 2, feedback: 'Du respekterer afstanden, præsenterer dig og siger dit ærinde uden krav. Det er sådan kontakt bygges.' },
          { text: 'Der er ingen, der er sendt efter dig. Det passer ikke.', tone: 'neutral', score: 0, feedback: 'Du diskuterer indholdet. Det kan ikke vindes, og du bliver en del af det, hun er bange for.' },
          { text: 'Du skal komme med mig nu.', tone: 'konfrontatorisk', score: 0, feedback: 'Et krav som allerførste sætning til en utryg person i krise. Det udløser modstand eller flugt.' },
        ],
        modelAnswer:
          'Jeg bliver stående her. Jeg hedder Line, og jeg er fra politiet. Jeg vil bare høre, om du har det godt.',
      },
      {
        situation: 'Hun kigger på dig, men træder et skridt tilbage. "Du lyver. De sagde, I ville komme."',
        options: [
          { text: 'Jeg kan høre, at du er bange. Det ville jeg også være. Jeg bliver stående her, hvor du kan se mig.', tone: 'professionel', score: 2, feedback: 'Du forholder dig til følelsen frem for indholdet og er forudsigelig i din adfærd. Begge dele skaber tryghed.' },
          { text: 'Prøv nu at høre efter, hvad jeg siger.', tone: 'konfrontatorisk', score: 0, feedback: 'Belærende og presset. Hun kan ikke "høre efter" sig ud af en krise.' },
          { text: 'Okay, jeg går igen.', tone: 'passiv', score: 1, feedback: 'Nogle gange rigtigt — men her efterlader du en utryg person uden hjælp. Bliv, og hold afstanden.' },
        ],
        modelAnswer:
          'Jeg kan høre, at du er bange. Det ville jeg også være i den situation. Jeg bliver stående her, hvor du kan se mig hele tiden.',
      },
      {
        situation: 'Hun falder lidt til ro. Ambulancen er på vej. Hun spørger: "Bliver jeg låst inde?"',
        options: [
          { text: 'Nej. Der kommer en ambulance, og de vil tale med dig. Jeg går med hen til den, hvis du vil have det. Jeg fortæller dig, hvad der sker, hele vejen.', tone: 'professionel', score: 2, feedback: 'Ærligt, forudsigeligt og med et tilbud frem for et krav.' },
          { text: 'Nej nej, der sker ikke noget.', tone: 'passiv', score: 0, feedback: 'Et løfte du ikke kan holde. Hvis hun bagefter tvangsindlægges, har politiet løjet for hende.' },
          { text: 'Det bestemmer lægerne.', tone: 'neutral', score: 1, feedback: 'Sandt, men koldt sagt. Tilføj hvad der sker nu, og hvad du gør for hende.' },
        ],
        modelAnswer:
          'Nej. Der kommer en ambulance, og de vil tale med dig om, hvad der skal ske. Jeg går med derhen, hvis du vil, og jeg siger til dig undervejs, hvad der sker.',
      },
    ],
  },

  {
    id: 'sc-butikstyveri',
    title: 'Ungt vidne til butikstyveri',
    context:
      'En 15-årig har set et butikstyveri og er tilbageholdt som vidne sammen med sin mor. Han er nervøs, svarer kort og kigger i gulvet. Moderen svarer på hans vegne.',
    tension: 1,
    principles: [
      'Forklar rollen: han er vidne, ikke mistænkt. Det er ikke indlysende for en 15-årig.',
      'Stil åbne spørgsmål, og lad pauserne stå.',
      'Undgå ledende spørgsmål — de ødelægger forklaringens værdi.',
      'Tal til den unge, ikke om ham, også når en voksen svarer for ham.',
    ],
    turns: [
      {
        situation: 'Du sætter dig over for dem. Moderen siger: "Han har ikke gjort noget, vel?"',
        options: [
          { text: 'Nej, han er ikke mistænkt for noget. Han har set noget, som kan hjælpe os, og det er derfor, vi gerne vil tale med ham.', tone: 'professionel', score: 2, feedback: 'Du fjerner den bekymring, der ellers ville fylde hele afhøringen.' },
          { text: 'Det finder vi ud af, når han har forklaret sig.', tone: 'konfrontatorisk', score: 0, feedback: 'Nu er han mistænkt i sit eget hoved, og forklaringen bliver præget af, at han forsvarer sig.' },
          { text: 'Han skal bare svare på et par spørgsmål.', tone: 'neutral', score: 1, feedback: 'Svarer ikke på spørgsmålet. Sig tydeligt, at han ikke er mistænkt.' },
        ],
        modelAnswer:
          'Nej, han er ikke mistænkt for noget. Han har set noget, der kan hjælpe os, og derfor vil jeg gerne høre, hvad han så.',
      },
      {
        situation: 'Du spørger, hvad han så. Moderen svarer for ham: "Han så jo, at manden tog to flasker."',
        options: [
          { text: 'Tak. Jeg vil gerne høre det fra ham selv — det er hans forklaring, der tæller. Hvad så du?', tone: 'professionel', score: 2, feedback: 'Venligt, men tydeligt. Du sikrer, at forklaringen er hans egen og ikke moderens.' },
          { text: 'Du skal altså ikke svare for ham.', tone: 'konfrontatorisk', score: 0, feedback: 'Rigtigt indhold, skarp form. Du får en modpart i rummet, du ikke har brug for.' },
          { text: 'Okay, så han så manden tage to flasker?', tone: 'passiv', score: 0, feedback: 'Nu er forklaringen moderens, og du har oven i købet stillet et ledende spørgsmål. Det svækker beviset.' },
        ],
        modelAnswer:
          'Tak. Jeg vil gerne høre det fra ham selv — det er hans egen forklaring, der tæller. Fortæl mig, hvad du så, fra du kom ind i butikken.',
      },
      {
        situation: 'Han begynder at fortælle, men stopper og siger: "Jeg kan ikke huske mere."',
        options: [
          { text: 'Det er helt i orden. Det er bedre, du siger, du ikke husker, end at du gætter. Kan du huske, om det var lyst eller mørkt udenfor?', tone: 'professionel', score: 2, feedback: 'Du belønner ærligheden og hjælper hukommelsen på vej med et konkret, ikke-ledende spørgsmål.' },
          { text: 'Prøv nu lige at tænke dig om. Det er vigtigt.', tone: 'konfrontatorisk', score: 0, feedback: 'Pres på et barn giver gætterier. Gætterier er værdiløse i retten.' },
          { text: 'Havde han ikke en sort jakke på?', tone: 'passiv', score: 0, feedback: 'Ledende spørgsmål. Du har nu plantet detaljen, og forklaringen kan ikke bruges til noget.' },
        ],
        modelAnswer:
          'Det er helt i orden — det er bedre at sige, at du ikke husker det, end at gætte. Kan du huske, hvad du lavede lige inden?',
      },
    ],
  },
]

export function maxScore(scenario) {
  return scenario.turns.length * 2
}
