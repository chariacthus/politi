// Regelbogen: forklaringen bag hvert emne. Drills tester — det her lærer.
// Hver regel har en hovedregel, en huskeregel, forklarende afsnit med
// eksempler (forkert over for rigtigt) og de fejl, folk oftest laver.

export const rules = [
  {
    id: 'kommatering',
    lang: 'da',
    title: 'Kommatering',
    short: 'Kommaet viser, hvor sætningen har led, der kan stå alene — og hvor den ikke har.',
    rule: 'Sæt altid komma EFTER en ledsætning (slutkomma). Kommaet foran ledsætningen (startkomma) er valgfrit — men du skal vælge ét system og holde det.',
    trick: 'Find udsagnsordet. Har en sætningsdel sit eget grundled og udsagnsled, er den en sætning — og sætninger skilles med komma.',
    sections: [
      {
        heading: 'Ledsætning foran hovedsætningen',
        text: 'Starter sætningen med "da", "hvis", "når", "fordi", "selvom" eller lignende, skal der komma, når hovedsætningen begynder. Det er obligatorisk i begge kommasystemer — og den klart hyppigste kommafejl.',
        examples: [
          { wrong: 'Da patruljen ankom var døren åben.', right: 'Da patruljen ankom, var døren åben.' },
          { wrong: 'Hvis du ikke standser nu skriver jeg en rapport.', right: 'Hvis du ikke standser nu, skriver jeg en rapport.' },
        ],
      },
      {
        heading: 'Indskudt ledsætning',
        text: 'En ledsætning midt inde i hovedsætningen lukkes altid med komma. Startkommaet må du selv om, men slutkommaet er der ingen vej udenom.',
        examples: [
          { wrong: 'Manden der stod ved indgangen var bevæbnet.', right: 'Manden, der stod ved indgangen, var bevæbnet.', note: 'Uden startkomma: "Manden der stod ved indgangen, var bevæbnet." — også korrekt.' },
        ],
      },
      {
        heading: 'To helsætninger',
        text: 'To sætninger, der hver for sig kan stå alene, skilles med komma — også når der står "og", "men" eller "for" imellem.',
        examples: [
          { wrong: 'Han nægtede at udtale sig og han bad om en advokat.', right: 'Han nægtede at udtale sig, og han bad om en advokat.' },
        ],
      },
      {
        heading: 'Hvor der IKKE skal komma',
        text: 'Aldrig mellem grundled og udsagnsled, uanset hvor langt grundleddet er. Aldrig foran "og" i en opremsning. Og ikke foran en infinitiv med "at", som ikke er en ledsætning.',
        examples: [
          { wrong: 'Betjenten på stedet, tilkaldte assistance.', right: 'Betjenten på stedet tilkaldte assistance.' },
          { wrong: 'Vi medbragte lygte, radio, og handsker.', right: 'Vi medbragte lygte, radio og handsker.' },
          { wrong: 'Han begyndte at løbe, mod udgangen.', right: 'Han begyndte at løbe mod udgangen.' },
        ],
      },
      {
        heading: 'Indskud og tiltale',
        text: 'Forklarende indskud om et navneord sættes i komma i begge ender. Det samme gælder tiltale.',
        examples: [
          { wrong: 'Peter min nabo så bilen køre væk.', right: 'Peter, min nabo, så bilen køre væk.' },
          { wrong: 'Kom her Thomas.', right: 'Kom her, Thomas.' },
        ],
      },
    ],
    mistakes: [
      'Komma sat inde i ledsætningen i stedet for foran den ("Jeg vidste, ikke at han var eftersøgt").',
      'Manglende slutkomma efter en indskudt sætning — den halve kommatering er den værste.',
      'Komma mellem grundled og udsagnsled, fordi grundleddet er langt.',
      'Blanding af nyt og grammatisk komma i samme tekst.',
    ],
  },
  {
    id: 'nutids-r',
    lang: 'da',
    title: 'Nutids-r',
    short: 'Nutid får -r. Navnemåde gør ikke.',
    rule: 'Står udsagnsordet i nutid, ender det på -r: han husker. Står det i navnemåde — efter "at" eller efter kan, skal, vil, må, bør — er der intet -r: at huske.',
    trick: 'Erstat ordet med "at gå" eller "går". Kan du sige "at gå", er der intet -r. Kan du sige "går", skal der -r på.',
    sections: [
      {
        heading: 'Nutid',
        text: 'Handlingen sker nu eller sker generelt. Formen er den samme i alle personer på dansk: jeg husker, du husker, patruljen husker.',
        examples: [
          { wrong: 'Vidnet forklare, at han så bilen.', right: 'Vidnet forklarer, at han så bilen.' },
          { wrong: 'Jeg håbe på en plads på Politiskolen.', right: 'Jeg håber på en plads på Politiskolen.' },
        ],
      },
      {
        heading: 'Navnemåde efter "at"',
        text: 'Efter "at" står grundformen uden -r. Det gælder også, når der er ord imellem.',
        examples: [
          { wrong: 'Han plejer at kommer for sent.', right: 'Han plejer at komme for sent.' },
          { wrong: 'Det er vigtigt at møder til tiden.', right: 'Det er vigtigt at møde til tiden.' },
        ],
      },
      {
        heading: 'Navnemåde efter modalverbum',
        text: 'Efter kan, skal, vil, må, bør og tør står grundformen — også selvom "at" ikke er der.',
        examples: [
          { wrong: 'Han kan ikke svarer på spørgsmålet.', right: 'Han kan ikke svare på spørgsmålet.' },
        ],
      },
    ],
    mistakes: [
      'Fejlen kommer af udtalen: i talesprog lyder "at komme" og "kommer" næsten ens.',
      'Lange sætninger, hvor "at" står langt fra udsagnsordet, er dem, der går galt.',
    ],
  },
  {
    id: 'ligge-laegge',
    lang: 'da',
    title: 'Ligge / lægge',
    short: 'Ligge er en tilstand. Lægge er en handling med et objekt.',
    rule: 'Man LÆGGER noget (nogen gør noget ved noget). Noget LIGGER (det befinder sig et sted). Samme mønster gælder sidde/sætte og stå/stille.',
    trick: 'Kan du sætte "noget" ind efter ordet? Så er det lægge: "han lægger [kniven]". Kan du ikke, er det ligge: "kniven ligger".',
    sections: [
      {
        heading: 'Bøjningen er det halve af svaret',
        text: 'Ligge: ligger — lå — har ligget. Lægge: lægger — lagde — har lagt. Kender du de to rækker udenad, laver du sjældent fejlen.',
        examples: [
          { wrong: 'Han lagde på gulvet, da vi kom ind.', right: 'Han lå på gulvet, da vi kom ind.' },
          { wrong: 'Rapporten har lagt i bakken i to dage.', right: 'Rapporten har ligget i bakken i to dage.' },
        ],
      },
      {
        heading: 'Bydeform',
        text: 'Bydeformen af lægge er "læg". Bydeformen af ligge ("lig") bruges stort set ikke — så en kommando er næsten altid "læg".',
        examples: [
          { wrong: 'Lig dig ned!', right: 'Læg dig ned!' },
          { wrong: 'Vil du ligge hænderne på rattet?', right: 'Vil du lægge hænderne på rattet?' },
        ],
      },
      {
        heading: 'Sidde og sætte',
        text: 'Nøjagtig samme logik: sidde (sidder — sad — har siddet) er tilstanden, sætte (sætter — satte — har sat) er handlingen.',
        examples: [
          { wrong: 'Vil du sidde dig herovre?', right: 'Vil du sætte dig herovre?' },
        ],
      },
    ],
    mistakes: [
      'I flere dialekter bruges "ligge" om begge dele. Det er udbredt i tale — men tæller som fejl på skrift.',
      'Perfektum går oftest galt: "har lagt" (lægge) over for "har ligget" (ligge).',
    ],
  },
  {
    id: 'nogen-nogle',
    lang: 'da',
    title: 'Nogen / nogle',
    short: 'Nogle betyder "et antal". Nogen bruges i ental og ved nægtelse, spørgsmål og betingelse.',
    rule: 'Kan ordet erstattes med "nogle stykker", skrives det nogle. Står der ikke, ikke nogen, har du, hvis eller et spørgsmål, skrives det nogen.',
    trick: 'Prøv med "nogle stykker". Passer det, er det nogle med L.',
    sections: [
      {
        heading: 'Nogle = flere (positivt udsagn)',
        text: 'Bruges om et ubestemt antal, hvor der faktisk er nogen.',
        examples: [
          { wrong: 'Der var nogen vidner på stedet.', right: 'Der var nogle vidner på stedet.' },
          { wrong: 'Jeg har nogen spørgsmål til dig.', right: 'Jeg har nogle spørgsmål til dig.' },
        ],
      },
      {
        heading: 'Nogen = nægtelse, spørgsmål, betingelse',
        text: 'Ved "ikke", i spørgsmål og efter "hvis" bruges nogen — også når der er tale om flere.',
        examples: [
          { wrong: 'Der var ikke nogle vidner på stedet.', right: 'Der var ikke nogen vidner på stedet.' },
          { wrong: 'Har du set nogle mistænkelige personer?', right: 'Har du set nogen mistænkelige personer?' },
        ],
      },
    ],
    mistakes: [
      'Nægtelsen kan stå langt fra ordet: "Han kunne ikke huske nogen af navnene."',
      'I talesprog udtales de to ens — reglen kan kun høres, hvis du kender den.',
    ],
  },
  {
    id: 'ad-af',
    lang: 'da',
    title: 'Ad / af',
    short: 'Ad handler om retning og bevægelse. Af handler om oprindelse, ejerforhold og fjernelse.',
    rule: 'Bevæger noget sig langs, gennem eller ind ad noget, hedder det ad. Kommer noget fra noget — eller fjernes fra noget — hedder det af.',
    trick: 'Sæt "hen ad vejen" ind som prøve. Handler det om en bevægelse, er svaret ad.',
    sections: [
      {
        heading: 'Ad: bevægelse og retning',
        text: 'Ned ad trappen, ad motorvejen, ind ad døren, ud ad vinduet. Også i faste udtryk: én ad gangen, ad åre, grine ad nogen.',
        examples: [
          { wrong: 'Han løb af trappen.', right: 'Han løb ad trappen.' },
          { wrong: 'Han grinede af os og løb af vejen.', right: 'Han grinede ad os og løb ad vejen.' },
        ],
      },
      {
        heading: 'Af: oprindelse, del, fjernelse',
        text: 'To af vidnerne, lavet af træ, tage jakken af, holde af nogen — og "ud af bilen", når man forlader den.',
        examples: [
          { wrong: 'Han blev bedt om at stige ud ad bilen.', right: 'Han blev bedt om at stige ud af bilen.', note: 'Men: "kigge ud ad vinduet" — dér er det en bevægelse gennem åbningen.' },
        ],
      },
    ],
    mistakes: [
      'Parret ud af / ud ad forveksles oftest: ud af bilen (forlade den) mod ud ad vinduet (gennem åbningen).',
      '"Grine ad" bliver næsten altid skrevet forkert som "grine af".',
    ],
  },
  {
    id: 'hans-sin',
    lang: 'da',
    title: 'Hans / sin',
    short: 'Sin peger tilbage på grundleddet i samme sætning. Hans peger på en anden.',
    rule: 'Er ejeren sætningens grundled, skrives sin/sit/sine. Er ejeren en anden — eller er ordet selv en del af grundleddet — skrives hans/hendes/deres.',
    trick: 'Spørg: "hvem ejer det — er det ham, der gør noget i sætningen?" Ja → sin. Nej → hans.',
    sections: [
      {
        heading: 'Grundreglen',
        text: 'Sin, sit og sine bruges kun, når ejeren er grundled i den samme sætning.',
        examples: [
          { wrong: 'Hun hentede hendes taske i bilen.', right: 'Hun hentede sin taske i bilen.', note: '"Hendes" ville betyde en anden kvindes taske.' },
          { wrong: 'Han kørte hans egen bil hjem.', right: 'Han kørte sin egen bil hjem.' },
        ],
      },
      {
        heading: 'Kun ved ental',
        text: 'Sin/sit/sine findes kun med én ejer. Er ejeren flere, hedder det deres — også når det peger tilbage på grundleddet.',
        examples: [
          { wrong: 'Vidnerne hentede sine jakker.', right: 'Vidnerne hentede deres jakker.' },
        ],
      },
      {
        heading: 'Når ordet er en del af grundleddet',
        text: 'Står ejestedordet selv inde i grundleddet, kan sin ikke bruges.',
        examples: [
          { wrong: 'Manden og sin bror blev begge afhørt.', right: 'Manden og hans bror blev begge afhørt.' },
          { wrong: 'Han fortalte, at sin kone var hjemme.', right: 'Han fortalte, at hans kone var hjemme.' },
        ],
      },
    ],
    mistakes: [
      'I ledsætninger går det galt: grundleddet skifter, når ledsætningen begynder.',
      'Fejlen ændrer meningen — i en rapport kan "hans bil" og "sin bil" være to forskellige biler.',
    ],
  },
  {
    id: 'endelser',
    lang: 'da',
    title: 'Endelser: -ene og -ende',
    short: '-ene er bestemt flertal. -ende er tillægsform af et udsagnsord.',
    rule: 'Dørene, betjentene, vidnerne: bestemt flertal på -ene. Ventende, løbende, truende: lang tillægsform på -ende.',
    trick: 'Kan du sætte "de" foran og mene "dem alle sammen"? Så er det -ene. Beskriver ordet en handling, der er i gang? Så er det -ende.',
    sections: [
      {
        heading: 'Bestemt flertal',
        text: 'Navneord i bestemt flertal ender på -ene (eller -erne): husene, portene, vidnerne.',
        examples: [
          { wrong: 'Vagterne lukkede portende.', right: 'Vagterne lukkede portene.' },
          { wrong: 'Vidnende forklarede det samme.', right: 'Vidnerne forklarede det samme.' },
        ],
      },
      {
        heading: 'Lang tillægsform',
        text: 'Beskriver en igangværende handling: en ventende person, de tilstedeværende, en truende adfærd.',
        examples: [
          { wrong: 'Vi talte med de tilstedeværene.', right: 'Vi talte med de tilstedeværende.' },
        ],
      },
      {
        heading: 'Kort tillægsform',
        text: 'Er handlingen sket, bruges den korte form på -et/-ede: de anholdte, de implicerede, de sigtede.',
        examples: [
          { wrong: 'Alle de implicerende blev afhørt.', right: 'Alle de implicerede blev afhørt.' },
        ],
      },
    ],
    mistakes: [
      'Endelserne lyder ens i tale — det er udelukkende et skriftsprogsproblem.',
      'Rapporter er fulde af netop de her ord: de anholdte, de tilstedeværende, vidnerne.',
    ],
  },
  {
    id: 'sammensatte',
    lang: 'da',
    title: 'Sammensatte ord',
    short: 'Dansk skriver sammensatte ord i ét ord. Særskrivning ændrer betydningen.',
    rule: 'Hører to ord sammen om ét begreb, skrives de i ét ord: politibil, færdselsulykke, anmeldelsesrapport. Nogle faste forbindelser skrives dog i to: af sted, i gang, i stedet for, i dag.',
    trick: 'Sig ordet højt. Ligger trykket på første led ("POLItibil"), er det ét ord.',
    sections: [
      {
        heading: 'Ét begreb, ét ord',
        text: 'Også når ordet bliver langt, og også når der er et fugebogstav (-s- eller -e-) imellem.',
        examples: [
          { wrong: 'Der holdt en politi bil foran huset.', right: 'Der holdt en politibil foran huset.' },
          { wrong: 'Hun skrev en anmeldelses rapport.', right: 'Hun skrev en anmeldelsesrapport.' },
        ],
      },
      {
        heading: 'Betydningen skrider',
        text: 'Særskrivning laver to selvstændige ord — og ofte noget helt andet, end du mente.',
        examples: [
          { wrong: 'Vi anholdt en fart synder.', right: 'Vi anholdt en fartsynder.', note: '"En fart synder" er to ord uden mening.' },
        ],
      },
      {
        heading: 'Undtagelserne du skal kunne',
        text: 'Disse skrives i to (eller tre) ord: af sted, i gang, i stedet for, i forhold til, i dag, i aften, i morgen.',
        examples: [
          { wrong: 'Han gik afsted mod stationen.', right: 'Han gik af sted mod stationen.' },
          { wrong: 'Vi satte igang klokken otte.', right: 'Vi satte i gang klokken otte.' },
        ],
      },
    ],
    mistakes: [
      'Engelsk smitter: på engelsk skrives "police car" i to ord, på dansk aldrig.',
      'Fejlen er hyppig i fagord — netop dem du skal bruge i en rapport.',
    ],
  },
  {
    id: 'store-små',
    lang: 'da',
    title: 'Store og små bogstaver',
    short: 'Kun navne og sætningsstart får stort. Ikke nationaliteter, ugedage, måneder eller titler.',
    rule: 'Stort begyndelsesbogstav ved sætningsstart og i egennavne (personer, steder, myndigheder). Alt andet med lille — også dansk, tirsdag, marts og politiassistent.',
    trick: 'Er ordet noget, der findes mange af (en politistation, en betjent, en tirsdag)? Så lille. Er det navnet på netop dette ene (Rigspolitiet, Nørrebro, Hansen)? Så stort.',
    sections: [
      {
        heading: 'Med lille',
        text: 'Nationaliteter og sprog (dansk, engelsk), ugedage og måneder (tirsdag, marts), titler (politiassistent, kommissær) og almindelige navneord (politistationen, patruljen).',
        examples: [
          { wrong: 'Han er Dansk statsborger og taler flydende Engelsk.', right: 'Han er dansk statsborger og taler flydende engelsk.' },
          { wrong: 'Hun blev anholdt Tirsdag den 3. Marts.', right: 'Hun blev anholdt tirsdag den 3. marts.' },
        ],
      },
      {
        heading: 'Med stort',
        text: 'Personnavne, stednavne og navne på bestemte myndigheder og institutioner.',
        examples: [
          { wrong: 'sagen blev overdraget til rigspolitiet.', right: 'Sagen blev overdraget til Rigspolitiet.' },
          { wrong: 'jeg skrev rapporten sammen med Politiassistent Hansen.', right: 'Jeg skrev rapporten sammen med politiassistent Hansen.' },
        ],
      },
      {
        heading: 'Det store I',
        text: 'Stedordet I (flertal af du) skrives med stort, så det ikke forveksles med forholdsordet i.',
        examples: [
          { wrong: 'Kan i komme herhen?', right: 'Kan I komme herhen?' },
        ],
      },
    ],
    mistakes: [
      'Engelsk smitter igen: på engelsk skrives Danish, Tuesday og March med stort.',
      'Titler skrives ofte med stort af høflighed — det er stadig en fejl.',
    ],
  },
  {
    id: 'rapportsprog',
    lang: 'da',
    title: 'Rapportsprog',
    short: 'Skriv hvad du så og hørte — ikke hvad du sluttede dig til.',
    rule: 'En rapport skal kunne efterprøves: præcis tid, sted og personer, aktiv form, og iagttagelser frem for vurderinger. Læseren skal selv kunne nå frem til din konklusion ud fra det, du beskriver.',
    trick: 'Spørg til hver sætning: "kunne et kamera have optaget det her?" Kan det ikke, er det en vurdering.',
    sections: [
      {
        heading: 'Iagttagelse frem for vurdering',
        text: '"Beruset", "aggressiv" og "nervøs" er dine konklusioner. Skriv de tegn, du byggede dem på — så holder de også i retten.',
        examples: [
          { wrong: 'Han var meget beruset.', right: 'Han lugtede kraftigt af alkohol, havde slørret tale og svært ved at holde balancen.' },
          { wrong: 'Manden virkede aggressiv.', right: 'Manden knyttede næverne og råbte: "Kom bare an."' },
        ],
      },
      {
        heading: 'Aktiv frem for passiv',
        text: 'Passiv skjuler, hvem der gjorde hvad. Skriv hvem der handlede — også når det er dig selv.',
        examples: [
          { wrong: 'Der blev af undertegnede foretaget en visitation af personen.', right: 'Jeg visiterede personen.' },
          { wrong: 'Knivene blev fundet i bagagerummet.', right: 'Patruljen fandt knivene i bagagerummet.' },
        ],
      },
      {
        heading: 'Præcision',
        text: 'Klokkeslæt, adresse og navne skal kunne holdes op mod logs, opkald og kameraer. "Kort efter" og "om aftenen" kan ikke bruges som bevis.',
        examples: [
          { wrong: 'Vi ankom kort efter og traf en mand.', right: 'Kl. 01.22 ankom vi til Søndergade 14, hvor vi traf en mand i opgangen.' },
        ],
      },
      {
        heading: 'Udsagn skal mærkes som udsagn',
        text: 'Det, en person siger, er ikke det samme som et faktum. Skriv tydeligt, hvem der har sagt hvad.',
        examples: [
          { wrong: 'Han var ligeglad med konsekvenserne.', right: 'Han sagde, at han var ligeglad med konsekvenserne.' },
        ],
      },
    ],
    mistakes: [
      'Kancellisprog ("der blev foretaget") virker officielt, men gør teksten langsom og uklar.',
      'Fyldeord som "vist nok", "sådan lidt" og "ret" svækker enhver rapport.',
      'Vurderinger uden belæg er det, en forsvarer går efter først.',
    ],
  },

  {
    id: 'tense',
    lang: 'en',
    title: 'Tid og aspekt',
    short: 'Present perfect om noget, der stadig gælder. Past simple om det afsluttede.',
    rule: 'Med et afsluttet tidspunkt (yesterday, last night, at 10 pm) bruges past simple. Med since/for eller uden tidspunkt bruges present perfect.',
    trick: 'Står der et tidspunkt, der er forbi? Så past simple — altid.',
    sections: [
      {
        heading: 'Past simple mod present perfect',
        text: 'Past simple: afsluttet handling på et bestemt tidspunkt. Present perfect: forbindelse til nu.',
        examples: [
          { wrong: 'Yesterday I have spoken to the witness.', right: 'Yesterday I spoke to the witness.' },
          { wrong: 'I work for the police since 2019.', right: 'I have worked for the police since 2019.' },
        ],
      },
      {
        heading: 'Tilstandsverber',
        text: 'Know, understand, believe, want og need bruges ikke i continuous.',
        examples: [
          { wrong: 'I am knowing the address.', right: 'I know the address.' },
        ],
      },
    ],
    mistakes: ['Dansk har ikke samme skarpe skel — derfor rammer danskere ofte present perfect forkert.'],
  },
  {
    id: 'articles',
    lang: 'en',
    title: 'Artikler',
    short: 'a/an ved noget ubestemt, the ved noget bestemt — og ingen artikel ved det generelle.',
    rule: 'A foran konsonantLYD, an foran vokalLYD. The når læseren ved, hvilken der menes. Ingen artikel ved generelle flertalsudsagn og ved institutioner brugt om deres funktion.',
    trick: 'Det er lyden, ikke bogstavet: an hour, a university.',
    sections: [
      {
        heading: 'Institutioner',
        text: 'Go to prison, go to school, go to court, be taken to hospital — uden artikel, når det er funktionen, der menes.',
        examples: [
          { wrong: 'He was taken to the hospital by an ambulance.', right: 'He was taken to hospital by ambulance.' },
        ],
      },
      {
        heading: 'Bestemt af sammenhængen',
        text: 'Gør en relativsætning navneordet bestemt, skal der the foran.',
        examples: [
          { wrong: 'I have information about a case you asked for.', right: 'I have information about the case you asked for.' },
        ],
      },
    ],
    mistakes: ['Dansk har endelsen i stedet (bilen), så artiklen glemmes eller sættes forkert.'],
  },
  {
    id: 'prepositions',
    lang: 'en',
    title: 'Præpositioner',
    short: 'De følger ikke logik — de skal læres i faste forbindelser.',
    rule: 'Arrive AT a place, arrive IN a city. Wait FOR somebody. Listen TO somebody. Responsible FOR something. Arrested ON suspicion OF something.',
    trick: 'Lær dem sammen med udsagnsordet, ikke hver for sig: "wait for", ikke "wait" + "for".',
    sections: [
      {
        heading: 'Tid',
        text: 'At + klokkeslæt, on + dag/dato, in + måned/år. For + tidsrum, since + starttidspunkt.',
        examples: [
          { wrong: 'He has been missing since three days.', right: 'He has been missing for three days.' },
        ],
      },
      {
        heading: 'Faste forbindelser i politisprog',
        text: 'Arrested on suspicion of, charged with, accused of, released on bail, taken into custody.',
        examples: [
          { wrong: 'He was accused for theft.', right: 'He was accused of theft.' },
        ],
      },
    ],
    mistakes: ['Dansk oversættes direkte: "vente på" bliver til "wait on" i stedet for "wait for".'],
  },
  {
    id: 'agreement',
    lang: 'en',
    title: 'Kongruens',
    short: 'Udsagnsordet retter sig efter kernen i grundleddet — ikke efter det nærmeste ord.',
    rule: 'Tredje person ental får -s i present simple. Find kernen i grundleddet, før du vælger form: "The list of witnesses IS on my desk."',
    trick: 'Stryg alt mellem grundled og udsagnsord, og læs sætningen igen.',
    sections: [
      {
        heading: 'Ord der driller',
        text: 'Police er flertal på engelsk. Evidence, information og advice er utællelige og altid ental. Everyone og nobody er ental.',
        examples: [
          { wrong: 'The police is investigating the case.', right: 'The police are investigating the case.' },
          { wrong: 'The evidences are clear.', right: 'The evidence is clear.' },
        ],
      },
    ],
    mistakes: ['Danskere glemmer -s, fordi dansk har samme form i alle personer.'],
  },
  {
    id: 'wordorder',
    lang: 'en',
    title: 'Ordstilling',
    short: 'Engelsk har ingen inversion efter et indledende led — og ingen spørgsmålsordstilling i indirekte spørgsmål.',
    rule: 'Grundled før udsagnsled, også efter "yesterday" og "then". I indirekte spørgsmål bruges almindelig ordstilling.',
    trick: 'Hører du dig selv bytte om på grundled og udsagnsled, er det dansk, der slår igennem.',
    sections: [
      {
        heading: 'Ingen inversion',
        text: 'Dansk vender om efter et indledende led. Engelsk gør ikke.',
        examples: [
          { wrong: 'Yesterday saw I the car.', right: 'Yesterday I saw the car.' },
          { wrong: 'Then went we to the address.', right: 'Then we went to the address.' },
        ],
      },
      {
        heading: 'Indirekte spørgsmål',
        text: 'Når spørgsmålet er pakket ind i en anden sætning, forsvinder spørgsmålsordstillingen.',
        examples: [
          { wrong: 'Can you tell me where is the station?', right: 'Can you tell me where the station is?' },
          { wrong: 'He asked me what did I see.', right: 'He asked me what I saw.' },
        ],
      },
    ],
    mistakes: ['Fejlen er næsten altid en direkte oversættelse fra dansk.'],
  },
  {
    id: 'confusables',
    lang: 'en',
    title: 'Forvekslinger',
    short: 'Ord der lyder ens, men betyder noget forskelligt.',
    rule: 'their (ejestedord) / there (stedet) / they’re (they are). its (ejestedord) / it’s (it is). than (sammenligning) / then (tid). affect (udsagnsord) / effect (navneord).',
    trick: 'Kan du sige "it is" i stedet? Så skal der apostrof i it’s. Ellers ikke.',
    sections: [
      {
        heading: 'Danske fælder',
        text: 'Dansk "kontrollere" hedder check eller verify. Dansk "låne" deles i borrow (låne af) og lend (låne ud). Advice er navneordet, advise udsagnsordet.',
        examples: [
          { wrong: 'We need to control his story.', right: 'We need to verify his story.' },
          { wrong: 'The officer gave him some advices.', right: 'The officer gave him some advice.' },
        ],
      },
    ],
    mistakes: ['Stavekontrollen fanger dem ikke — begge stavemåder findes.'],
  },
  {
    id: 'tegnsaetning',
    lang: 'da',
    title: 'Tegnsætning ud over kommaet',
    short: 'Punktum lukker, kolon peger fremad, og anførselstegn viser, at ordene ikke er dine egne.',
    rule: 'Brug punktum til at skille selvstændige iagttagelser. Brug kolon foran en opremsning eller et citat. Sæt ordrette udsagn i anførselstegn — alt andet er referat.',
    trick: 'Spørg: gengiver jeg ordene, eller gengiver jeg indholdet? Ordene får anførselstegn og kolon. Indholdet får "at" og komma.',
    sections: [
      {
        heading: 'Citat eller referat',
        text: 'Et ordret citat indledes med kolon og sættes i anførselstegn. Et referat har hverken det ene eller det andet — men det har komma foran "at".',
        examples: [
          { wrong: 'Han sagde, "jeg har ikke rørt hende".', right: 'Han sagde: "Jeg har ikke rørt hende."', note: 'Punktummet står inden for anførselstegnet, fordi hele sætningen er citeret.' },
          { wrong: 'Vidnet forklarede "at han hørte et skrig".', right: 'Vidnet forklarede, at han hørte et skrig.' },
        ],
      },
      {
        heading: 'Kolon',
        text: 'Kolon peger fremad mod det, der følger: en opremsning, en forklaring eller et citat. Efter kolon skrives lille bogstav, medmindre der følger en hel citeret sætning.',
        examples: [
          { wrong: 'Der blev beslaglagt følgende; en kniv og en telefon.', right: 'Der blev beslaglagt følgende: en kniv og en telefon.' },
        ],
      },
      {
        heading: 'Punktum frem for komma',
        text: 'To helsætninger uden bindeord skal skilles med punktum. Komma alene er en kommasplejsning — og i en rapport gør den to iagttagelser til én påstand.',
        examples: [
          { wrong: 'Patruljen ankom kl. 22.15, døren var brudt op.', right: 'Patruljen ankom kl. 22.15. Døren var brudt op.' },
        ],
      },
      {
        heading: 'Parentes, tankestreg og semikolon',
        text: 'Parentesen erstatter kommaerne om en indskudt oplysning — sæt ikke komma op ad den. Semikolon binder to helsætninger tættere end punktum; brug det sparsomt. Tankestregen er sjælden i rapportsprog.',
        examples: [
          { wrong: 'Køretøjet, (en hvid varebil), holdt ulovligt.', right: 'Køretøjet (en hvid varebil) holdt ulovligt parkeret.' },
          { right: 'Døren var ulåst; der var ingen tegn på opbrud.', note: 'Korrekt — men punktum er tydeligere i en rapport.' },
        ],
      },
    ],
    mistakes: [
      'Spørgsmålstegn i et refereret spørgsmål ("Hun spurgte, hvornår hun kunne køre videre?").',
      'Komma efter et citat, der slutter med udråbstegn eller spørgsmålstegn.',
      'Semikolon brugt til at indlede en opremsning, hvor der skal kolon.',
      'Kommasplejsning mellem to selvstændige iagttagelser.',
    ],
  },
  {
    id: 'ejefald',
    lang: 'da',
    title: 'Ejefald og apostrof',
    short: 'Dansk ejefald er et rent -s. Apostroffen bruges kun, når ordet i forvejen ender på s, x eller z.',
    rule: 'Sæt -s direkte på ordet: politiets, bilens, Hansens. Ender ordet på s, x eller z, sættes kun en apostrof: Lars’, Alex’, AKS’.',
    trick: 'Apostrof i ejefald er engelsk. Læser du "politi’s", læser du engelsk — og så er det galt.',
    sections: [
      {
        heading: 'Hovedreglen',
        text: 'Ejefald af navneord og navne dannes med -s uden noget tegn. Det gælder også flerleddede navne, hvor -s’et sættes på det sidste led.',
        examples: [
          { wrong: "politi's køretøj", right: 'politiets køretøj' },
          { wrong: "bilen's bagagerum", right: 'bilens bagagerum' },
          { right: 'Nordsjællands Politis efterforskningsafdeling' },
        ],
      },
      {
        heading: 'Når ordet ender på s, x eller z',
        text: 'Så sættes kun en apostrof — aldrig et ekstra s. Det gælder navne som Lars, Mads og Alex, og forkortelser, der læses bogstav for bogstav.',
        examples: [
          { wrong: "Lars's telefon", right: 'Lars’ telefon' },
          { wrong: "AKS's indsatsleder", right: 'AKS’ indsatsleder' },
        ],
      },
      {
        heading: 'Apostrof, der ikke er ejefald',
        text: 'Ved tal og enkeltbogstaver bruges apostrof foran en endelse. Det er ikke ejefald, men en endelse sat på noget, der ikke er et ord.',
        examples: [
          { right: 'i 1990’erne' },
          { right: 'to a’er og et b' },
        ],
      },
    ],
    mistakes: [
      'Apostrof efter engelsk mønster: "betjent’s", "politi’s".',
      'Både apostrof og ekstra s ved navne på -s ("Lars’s").',
      'Accent (´) i stedet for apostrof (’).',
      'Ejefald sat på det første led i et flerleddet navn.',
    ],
  },
  {
    id: 'tal-og-tid',
    lang: 'da',
    title: 'Tal, tid og forkortelser',
    short: 'Et tal kan efterprøves. Et skøn kan ikke — og derfor er tallet rapportens stærkeste sætning.',
    rule: 'Skriv klokkeslæt med tal og punktum (kl. 22.15), decimaler med komma (0,5 promille) og tusindtal med mellemrum (12 500 kr.). Forkortelser skrives med punktum: jf., iflg., ca., bl.a., m.fl.',
    trick: 'Kan tallet sammenholdes med vagtjournalen, en måling eller et kamera? Så skal det i rapporten. Kan det ikke, skal skønnet begrundes med det, du så.',
    sections: [
      {
        heading: 'Tid og dato',
        text: 'Klokkeslæt skrives med punktum mellem timer og minutter. Datoer skrives med måneden i bogstaver, når der er plads — så kan de ikke misforstås.',
        examples: [
          { wrong: 'kl 22:15', right: 'kl. 22.15' },
          { wrong: '14/9-26', right: 'den 14. september 2026' },
          { wrong: 'Vi ankom klokken cirka ti minutter over ti.', right: 'Vi ankom kl. 22.10.' },
        ],
      },
      {
        heading: 'Tal i løbende tekst',
        text: 'Tommelfingerreglen: et til ti med bogstaver, 11 og opefter med cifre. Mål, beløb, aldre, promiller og klokkeslæt skrives altid med cifre.',
        examples: [
          { right: 'Der var tre vidner, og køretøjet holdt 12 meter fra krydset.' },
          { wrong: '12,500 kr.', right: '12 500 kr.', note: 'Kommaet er reserveret til decimaler.' },
        ],
      },
      {
        heading: 'Forkortelser',
        text: 'Forkortelser skal have deres punktum. Er der plads, er det næsten altid bedre at skrive ordet helt ud — en rapport må ikke kunne misforstås.',
        examples: [
          { wrong: 'Bilen kørte ca 80 km/t.', right: 'Bilen kørte ca. 80 km/t.' },
          { right: 'Køretøjet var iflg. ejerens oplysning solgt to uger forinden.' },
        ],
      },
    ],
    mistakes: [
      'Kolon i klokkeslæt (22:15) — det er engelsk og norsk, ikke dansk.',
      'Punktum som tusindtalsskilletegn, så 12.500 forveksles med 12,5.',
      'Forkortelser uden punktum: "ca", "jf", "bla".',
      'Skøn ("temmelig sent", "kraftigt beruset") uden de iagttagelser, der bærer dem.',
    ],
  },
  {
    id: 'henvisning',
    lang: 'da',
    title: 'De, dem, som og der',
    short: 'Stedordet skal pege på én person og stå i den form, sætningen kræver.',
    rule: 'Brug "de, han, hun, vi" som grundled og "dem, ham, hende, os" som genstandsled. Brug "der" kun, når henvisningsordet selv er grundled i ledsætningen; ellers "som".',
    trick: 'Byt til "jeg/mig". Lyder "mig" rigtigt, skal du bruge "dem" eller "ham". Og har ledsætningen allerede sit eget grundled, kan "der" ikke bruges.',
    sections: [
      {
        heading: 'Grundled eller genstandsled',
        text: 'Grundleddet handler; genstandsleddet bliver handlet med. Efter et forholdsord (til, med, af, på) står altid genstandsformen.',
        examples: [
          { wrong: 'Dem to mænd blev anholdt.', right: 'De to mænd blev anholdt.' },
          { right: 'Vi kørte dem til detentionen.' },
        ],
      },
      {
        heading: '"Der" eller "som"',
        text: '"Der" kan kun være grundled i ledsætningen. Har ledsætningen sit eget grundled, skal det være "som" — og "som" kan i øvrigt bruges begge steder.',
        examples: [
          { wrong: 'Vidnet, der vi afhørte, var rolig.', right: 'Vidnet, som vi afhørte, var rolig.' },
          { right: 'Kvinden, der ringede 112, ventede ved porten.' },
        ],
      },
      {
        heading: 'Stedord, der peger to steder hen',
        text: 'Den værste henvisningsfejl i en rapport er ikke formen, men tvetydigheden. Kan "han" være to personer, skal rollen gentages — også selvom sætningen bliver tungere.',
        examples: [
          { wrong: 'Føreren talte med passageren, og han virkede påvirket.', right: 'Føreren talte med passageren. Føreren virkede påvirket.' },
        ],
      },
      {
        heading: 'De to slags "hvis"',
        text: 'Der er et spørgende ejestedord ("Hvis bil holder her?") og en betingelse ("Hvis du kører nu ..."). Formen er den samme, betydningen er ikke — og kun betingelsen udløser komma.',
        examples: [
          { right: 'Hvis bil holder på pladsen?' },
          { right: 'Hvis den er din, skal den flyttes.' },
        ],
      },
    ],
    mistakes: [
      '"Dem" som grundled ("Dem der stod ved døren").',
      '"Der" brugt, hvor ledsætningen har sit eget grundled.',
      'Stedord, der kan pege på to personer i samme sætning.',
      'Manglende slutkomma efter ledsætningen med "der"/"som".',
    ],
  },
  {
    id: 'hverdag', lang: 'da', title: 'Hverdagsdansk',
    short: 'Den korte, klare sætning er grundformen. Alt professionelt sprog bygger oven på den.',
    rule: 'Sig hvem der gør hvad: grundled, udsagnsled, resten. Skil det, du har set, fra det, du tror.',
    trick: 'Kan sætningen læses højt i ét åndedrag og forstås af en, der ikke var der? Så er den klar nok.',
    sections: [
      {
        heading: 'Grundformen',
        text: 'Først den, der gør noget. Så handlingen. Så resten. Står tiden eller stedet først, bytter grundled og udsagnsled plads.',
        examples: [
          { wrong: 'Der var en person som løb.', right: 'En mand løb mod banegården.' },
          { right: 'Kl. 22.10 standsede vi bilen på Nørregade.', note: 'Tiden først → "standsede vi", ikke "vi standsede".' },
        ],
      },
      {
        heading: 'Set eller troet',
        text: 'Det, du har set og hørt, er en iagttagelse. Alt andet er en vurdering. Vanen med at holde dem adskilt starter i helt almindelige sætninger — og bærer hele vejen op til rapporten.',
        examples: [
          { wrong: 'Han var nok fuld.', right: 'Han lugtede af alkohol og faldt to gange.' },
        ],
      },
    ],
    mistakes: ['Fyldeord: "sådan lidt", "vist nok", "lissom".', 'Lange kancellivendinger i stedet for almindelige ord.', 'Vurdering skrevet som om det var en iagttagelse.'],
  },
  {
    id: 'hoeflig', lang: 'da', title: 'Høflig og tydelig',
    short: 'Myndighed og høflighed er ikke modsætninger. Det er den samme sætning, sagt ordentligt.',
    rule: 'Præsentér dig, sig årsagen, og fortæl hvad der sker nu. Bed om noget, når der er tid; giv en ordre, når der ikke er.',
    trick: 'Sig hvad du har brug for — ikke hvad den anden er. "Jeg har brug for, at du lytter" i stedet for "hold nu op".',
    sections: [
      {
        heading: 'Anmodning eller ordre',
        text: 'En anmodning er et spørgsmål: "Vil du ...?". En ordre er en bydeform: "Bliv stående." Begge dele hører til — ordren gemmes til det øjeblik, hvor der ikke er tid, eller hvor anmodningen ikke blev fulgt.',
        examples: [
          { right: 'Vil du række mig dit kørekort?' },
          { right: 'Bliv stående.', note: 'Kort og tydelig, når det haster.' },
        ],
      },
      {
        heading: 'Sig altid hvorfor',
        text: 'En borger, der forstår årsagen, samarbejder næsten altid. Det koster én sætning.',
        examples: [
          { wrong: 'Du skal bare gøre, som jeg siger.', right: 'Jeg standser dig, fordi lygten bagpå ikke virker.' },
        ],
      },
    ],
    mistakes: ['Nedladende tiltale og kælenavne.', 'Uklarhed forklædt som venlighed ("måske skulle du på et tidspunkt ...").', 'Skift mellem du og De i samme samtale.'],
  },
  {
    id: 'praecis', lang: 'da', title: 'Præcis beskrivelse',
    short: 'En beskrivelse er brugbar, når en anden kan genkende personen, bilen eller stedet ud fra den.',
    rule: 'Person: køn, højde, bygning, hår, tøj. Køretøj: farve, type, mærke, nummerplade. Sted: vej, nummer, kendemærke. Tid: klokkeslæt.',
    trick: 'Læs din beskrivelse op for dig selv og spørg: kunne en kollega finde personen med det her?',
    sections: [
      {
        heading: 'Rækkefølgen',
        text: 'Den faste rækkefølge gør, at modtageren kan følge med — også over radioen, hvor der ikke er tid til at spørge om igen.',
        examples: [
          { wrong: 'En almindelig mand i mørkt tøj.', right: 'Mand, ca. 180 cm, kraftig, sort jakke, blå kasket.' },
          { right: 'Hvid varebil, Ford Transit, reg.nr. AB 12 345.' },
        ],
      },
      {
        heading: 'Retning og tid',
        text: '"Den vej" og "for lidt siden" kan ingen bruge. Retning, vej og minutter kan.',
        examples: [
          { wrong: 'Han gik den vej for lidt siden.', right: 'Han gik mod nord ad Nørregade for ca. to minutter siden.' },
        ],
      },
    ],
    mistakes: ['Vurderinger af personlighed i stedet for udseende.', 'Stedangivelser uden vejnavn og nummer.', 'Omtrentlige tider, hvor et klokkeslæt var muligt.'],
  },
  {
    id: 'fagord', lang: 'da', title: 'Fagordene i klar tale',
    short: 'Fagordet er til rapporten. Til borgeren bruger du almindelige ord om præcis det samme.',
    rule: 'Lær rollerne — anmelder, forurettet, vidne, sigtet — og de ord, der går igen: hjemmel, gerningssted, signalement, beslaglæggelse.',
    trick: 'Kan du forklare ordet til en, der aldrig har været i nærheden af politiet? Så har du forstået det.',
    sections: [
      {
        heading: 'Rollerne i en sag',
        text: 'Anmelderen ringer. Forurettede er den, det gik ud over. Vidnet så eller hørte noget. Den sigtede er mistænkt og har fået det at vide. Samme person kan have to roller — men rollerne skal holdes adskilt i rapporten.',
        examples: [
          { right: 'Anmelderen var nabo til forurettede og så selv tyveriet.' },
        ],
      },
      {
        heading: 'Hjemmel',
        text: 'Hjemmel er den regel i loven, der giver lov til det, du gør. Kan du ikke pege på reglen, må du ikke gøre det. Det er det bærende princip i hele politiarbejdet.',
        examples: [
          { right: 'Visitationen havde hjemmel i politilovens regler om våben.' },
        ],
      },
      {
        heading: 'Oversæt til borgeren',
        text: 'Fagsproget er præcist, men det forklarer ingenting for den, der ikke kender det.',
        examples: [
          { wrong: 'Effekten er sikret til videre foranstaltning.', right: 'Vi tager kniven med som bevis i sagen.' },
        ],
      },
    ],
    mistakes: ['At kalde en sigtet for dømt.', 'Fagord brugt over for borgere, der ikke kender dem.', 'Passiv kancellistil i stedet for aktiv sætning.'],
  },
  {
    id: 'basis', lang: 'en', title: 'First words',
    short: 'Hils, sig hvem du er, og spørg pænt. Tre ting, og en samtale er i gang.',
    rule: 'Good morning / afternoon / evening + "I am a police officer" + "Could you ... please?". Sig "I don’t understand", hvis du ikke forstår.',
    trick: 'Please er engelsk høflighed. Det bruges langt oftere end det danske "venligst" — og det mangler aldrig i en anmodning.',
    sections: [
      {
        heading: 'De første sætninger',
        text: 'Hilsen, præsentation, anmodning. Den samme rækkefølge som på dansk.',
        examples: [
          { right: 'Good evening. My name is Jonas. I am a police officer.' },
          { wrong: 'Name!', right: 'What is your name, please?' },
        ],
      },
      {
        heading: 'Når du ikke forstår',
        text: 'Sig det. Det er bedre end at gætte på, hvad en borger mener.',
        examples: [
          { right: "I don’t understand. Could you say that again, please?" },
        ],
      },
    ],
    mistakes: ['Bydeform uden please, hvor der var tid til at spørge.', 'At gætte i stedet for at bede om en gentagelse.'],
  },
  {
    id: 'tal-tid', lang: 'en', title: 'Numbers and time',
    short: 'Tal, klokkeslæt og bogstavering er fundamentet under enhver melding.',
    rule: 'At + klokkeslæt, on + dag og dato, in + måned og år. I tale bruges 12-timers ur med a.m. og p.m. Nummerplader bogstaveres med Alpha, Bravo, Charlie.',
    trick: 'AT et punkt på uret, ON en dag i kalenderen, IN en større periode.',
    sections: [
      {
        heading: 'Tid',
        text: 'Engelsk taler i 12 timer og skriver ofte i 24. Begge dele skal kunne læses.',
        examples: [
          { wrong: 'It is twenty-two fifteen o’clock.', right: 'It is ten fifteen p.m.' },
          { right: 'The accident happened at 9 a.m. on Monday.' },
        ],
      },
      {
        heading: 'Bogstavering',
        text: 'Kodeordene fjerner tvivlen mellem B og P, M og N. Derfor bruges de over radio og telefon i hele verden.',
        examples: [
          { right: 'Registration Alpha Bravo one two three.' },
        ],
      },
    ],
    mistakes: ['"In Monday" i stedet for "on Monday".', 'Spørgsmål i datid uden did: "When happened this?"'],
  },
  {
    id: 'person', lang: 'en', title: 'Describing people',
    short: 'Køn, højde, hår, tøj — på engelsk i samme rækkefølge som på dansk.',
    rule: 'Tillægsordet står foran navneordet: a black jacket. Beskrivelser af noget, der er sket, står i datid: he was wearing.',
    trick: 'Tænk "tall man in a black jacket" — aldrig "man tall in a jacket black".',
    sections: [
      {
        heading: 'Ordstilling',
        text: 'Engelsk sætter altid tillægsordet foran. Farven kommer tættest på tøjet.',
        examples: [
          { wrong: 'a jacket black', right: 'a black jacket' },
          { right: 'A tall man in a black jacket.' },
        ],
      },
      {
        heading: 'Datid og tredje person',
        text: 'He has, she has — men i datid: he was wearing, she had long hair.',
        examples: [
          { wrong: 'She have long brown hair.', right: 'She has long brown hair.' },
          { right: 'He was wearing a blue cap.' },
        ],
      },
    ],
    mistakes: ['"She have" i stedet for "she has".', 'Alder uden "old": "about 30 years".'],
  },
  {
    id: 'retning', lang: 'en', title: 'Places and directions',
    short: 'En instruks ad gangen, i rækkefølge — det gælder både vejvisning og indsats.',
    rule: 'Go straight ahead, turn left, turn right. In om noget lukket, on om en flade eller linje. "I need you to ..." er den klare professionelle instruks.',
    trick: 'IN a car, ON a street. Du sidder inde i bilen, men står på gaden.',
    sections: [
      {
        heading: 'Vejvisning',
        text: 'Del det op. Ét skridt, så det næste.',
        examples: [
          { right: 'Go straight ahead, then turn left at the traffic lights.' },
        ],
      },
      {
        heading: 'Instrukser',
        text: '"Please stay where you are" er høflig og tydelig. "I need everyone to leave this area now" er den klare instruks, når det haster.',
        examples: [
          { wrong: 'Maybe you could go away.', right: 'I need everyone to leave this area now.' },
        ],
      },
    ],
    mistakes: ['"In the street" hvor der skulle stå "on the street".', 'Flere instrukser i én sætning.'],
  },
  {
    id: 'kontrol', lang: 'en', title: 'Traffic stop',
    short: 'Hils, præsentér dig, sig årsagen, bed om papirerne. Samme rækkefølge som på dansk.',
    rule: 'Could I see your driving licence, please? — I stopped you because ... — Could you step out of the vehicle, please? Efter must, can og will står udsagnsordet uden "to".',
    trick: 'Could you ... please = anmodning. Uden could og please = ordre. Vælg bevidst.',
    sections: [
      {
        heading: 'De faste vendinger',
        text: 'Driving licence, vehicle registration, insurance, passport. De fire ord dækker næsten alle kontroller.',
        examples: [
          { right: 'Could I see your driving licence and vehicle registration, please?' },
          { right: 'Please turn off the engine and stay in the car.' },
        ],
      },
      {
        heading: 'Sig hvad der sker nu',
        text: 'Uvished er det, der gør folk vrede. Fortæl hvad du gør, og hvor lang tid det tager.',
        examples: [
          { right: 'I am going to check your licence. It takes a few minutes.' },
        ],
      },
    ],
    mistakes: ['"You must to stay" — must tager ingen "to".', 'Ordrer uden forklaring, hvor der var tid til begge dele.'],
  },
  {
    id: 'borger', lang: 'en', title: 'Helping a citizen',
    short: 'Mennesket først, sagen bagefter — og fire spørgsmål, der åbner enhver anmeldelse.',
    rule: 'Are you all right? What happened? When did it happen? Where did it happen? Can you describe the man? Efter "did" står grundformen.',
    trick: 'Take your time, I am listening — virker, hvor "calm down" ikke gør.',
    sections: [
      {
        heading: 'De fire spørgsmål',
        text: 'Hændelse, tid, sted og skader. Det er rapportens fire hjørner, uanset sprog.',
        examples: [
          { right: 'What happened, and when did it happen?' },
          { wrong: 'Did you saw anything?', right: 'Did you see anything unusual?' },
        ],
      },
      {
        heading: 'Afslut med næste skridt',
        text: 'Et sagsnummer er ofte det eneste, borgeren går hjem med. Sig det, før de går.',
        examples: [
          { right: 'I will give you a case number before you leave.' },
        ],
      },
    ],
    mistakes: ['"Calm down" i stedet for at lytte.', 'Formularer og procedure før spørgsmålet om skader.'],
  },
  {
    id: 'formel', lang: 'en', title: 'Formal English',
    short: 'Samme besked, anden form. To ord til, og sætningen er professionel.',
    rule: 'Could / may + please til anmodninger. Bydeform, når sikkerheden kræver det. Sig altid årsagen efter "because".',
    trick: 'Har du tid til at spørge? Så spørg. Har du ikke? Så er den korte ordre den rigtige — og den er ikke uhøflig.',
    sections: [
      {
        heading: 'Fra gade til uniform',
        text: 'De uformelle vendinger er ikke forkerte engelsk — de er bare ikke professionelle.',
        examples: [
          { wrong: 'Get out of the car.', right: 'Please step out of the vehicle.' },
          { wrong: 'What do you want?', right: 'How can I help you?' },
        ],
      },
      {
        heading: 'Indgreb forklaret præcist',
        text: 'Noget så indgribende som en tilbageholdelse skal siges klart og neutralt.',
        examples: [
          { right: 'You are not free to leave at the moment. I will explain why.' },
          { right: 'I am detaining you because you match the description.' },
        ],
      },
    ],
    mistakes: ['Bydeform brugt som standard i rolige situationer.', 'Vage formuleringer om en tilbageholdelse.'],
  },
  {
    id: 'skrift', lang: 'en', title: 'Written English',
    short: 'Datid, aktiv form og fakta. En engelsk rapport stiller de samme krav som en dansk.',
    rule: 'Skriv i datid: arrived, saw, stated, arrested. Brug aktiv form med et tydeligt grundled. Referat med "stated that", ordret citat i anførselstegn.',
    trick: 'Kan sætningen efterprøves af en anden? Så hører den til i rapporten.',
    sections: [
      {
        heading: 'Datid og aktiv form',
        text: 'Alt det, der allerede er sket, står i datid — og det er dig, der handler i sætningen.',
        examples: [
          { wrong: 'The suspect was arrested by me.', right: 'I arrested the suspect.' },
          { right: 'We arrived at the scene at 9.40 p.m.' },
        ],
      },
      {
        heading: 'Fakta frem for vurdering',
        text: 'Ord som "obviously" og "clearly" er vurderinger. Skriv det, du så.',
        examples: [
          { wrong: 'The man was obviously drunk.', right: 'The man smelled of alcohol and fell twice.' },
        ],
      },
    ],
    mistakes: ['Nutid i en rapport om noget, der allerede er sket.', 'Passiv form, der skjuler hvem der handlede.'],
  },
]

export function ruleFor(topicId, lang) {
  return rules.find((rule) => rule.id === topicId && (!lang || rule.lang === lang)) || null
}
