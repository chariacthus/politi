# Optagelsestræning

Et privat træningsværktøj til politiets optagelsesprøve. Fokus ligger på det, der vejer tungest og er
sværest at træne alene: **skriftlig dansk**, **rapportsprog** og **tonen i borgerkontakt**.

Siden kører helt i browseren. Der er ingen server, ingen konto og ingen data, der forlader maskinen —
fremskridt gemmes i browserens `localStorage`.

## Spor

Appen åbner med et valg, som i Duolingo: **Politi** eller **Matematik**. Politisporet er bygget og
farvet myndighedsblåt. Matematiksporet har farve (orange), plan og plads i appen, men **det er ikke
bygget endnu** — det siger kortet selv, og det kan ikke startes. Sporet skiftes under Profil →
Indstillinger, og kursusfarven slår igennem i hele fladen: navigation, knapper, ringe, mærkater og
enhedernes bannere.

## Sådan er appen skruet sammen

Der er fire steder at være — ikke en menu med otte punkter:

| | |
| --- | --- |
| **Lær** | Stien: spilbrættet med enheder og lektioner. Appens forside. |
| **Øv** | Fri træning: grammatik, diktat, rapport og situationer, plus genveje til det, du er svagest i. |
| **Regler** | Regelbogen: politifag og sprog med hovedregel, huskeregel og eksempler. |
| **Profil** | Fremskridt, træningsplan og indstillinger i tre faner. |

På brede skærme står navigationen i venstre skinne og statistikken — streak, dagens mål, rang og dage
til prøven — i højre. På telefonen bliver navigationen til fire faner i bunden og statistikken til en
stribe i toppen. Lektionen har ingen af delene: den fylder hele skærmen.

## Stien

Forsiden er et spilbræt, ikke et dashboard: **7 enheder med 28 korte lektioner** på en snoet sti, der
bygger oven på hinanden. Hver enhed har sin egen farve, klarede lektioner får en guldkrone og op til tre
stjerner, og den næste har en hoppende START-boble. Rangen går fra Ansøger til Specialist. Et tryk på en
sten åbner et kort med, hvad lektionen indeholder, og hvad knappen gør.

**Sådan spilles det:**

- **Reglen kommer før prøven.** En lektion, du ikke har klaret før, starter med et lær-kort:
  hovedreglen, huskereglen og to-tre eksempler på rigtigt over for forkert. Det kan springes over, og
  det kan altid hentes frem igen fra stien ("Læs reglen først").
- **Lektionen fylder hele skærmen** — ingen menuer, kun opgaven: fremdriftsbjælke, fem liv og ét spørgsmål
  ad gangen i store, trykbare knapper.
- **Liv:** et forkert svar koster et liv. Retter du den opgave, du fejlede, når den kommer igen, får du
  livet tilbage. Løber livene ud, tager du lektionen om.
- **Feedback glider op nedefra** i grønt eller rødt med makkeren, det rigtige svar, reglen bag og et link
  til hele forklaringen. Enter fører videre.
- **Fejring til sidst:** konfetti ved en fejlfri lektion, stjerner, XP og liv tilbage — og direkte videre
  til næste lektion.
- **Dagens mål** er 60 XP og vises som en ring sammen med streak og samlet XP.
- **Spring over:** enhver opgave kan springes over. Det koster ikke et liv, giver ingen XP, og opgaven
  bliver stående som ubesvaret — så den kommer igen en anden dag.
- **Spring videre:** kan du stoffet i forvejen, behøver du ikke tage enhederne i rækkefølge. En låst
  enhed har en **springtest** på 12 opgaver fra hele enhedens stof. Rammer du 80 %, åbnes enheden og
  alle enheder før den; du kan stadig tage lektionerne bagefter for stjernerne.

| Enhed | Indhold |
| --- | --- |
| 1 · Grundlaget | Politiets opgave, de bærende principper, rapportsprog |
| 2 · Magt og indgreb | Magtanvendelse, visitation og ransagning, kommatering |
| 3 · Anholdelse og rettigheder | Mistankekrav og 24-timersreglen, sigtedes rettigheder, frihedsberøvelse |
| 4 · Loven i praksis | Straffelovens kerneparagraffer, færdsel, sprogfælder |
| 5 · Tjenesten | Tavshedspligt og notatpligt, adfærd og legitimitet, melding og radio |
| 6 · Sproget hele vejen | Nutids-r, ligge/lægge, sammensatte ord, endelser, ejestedord |
| 7 · Præcision i skriften | Tegnsætning ud over kommaet, ejefald og apostrof, tal og tid, de/dem og som/der |

**94 politifaglige opgaver** over 12 emner ligger bag lektionerne — politiloven i praksis, straffelovens
kerneparagraffer, færdselsreglerne, tavshedspligt, etik og radioprocedure — hver med en forklaring på
hvorfor, og med henvisning til grundlaget.

### Opgavetyper

For at det ikke bliver det samme igen og igen skifter lektionen mellem **ni typer**: vælg svaret, sandt
eller falsk, skriv ordet direkte i sætningen, sæt kommaerne ved at klikke, ret den forudfyldte sætning,
byg sætningen af løse ord, find fejlen i sætningen, sortér udsagn i to kasser, og par begreb med
betydning. To ens typer kommer aldrig efter hinanden, hvis det kan undgås.

**Stemmeøvelser** er frivillige og slås til under Profil → Indstillinger. Så bliver du bedt om at sige replikken højt —
meldingen over radioen, sætningen ved en anholdelse, åbningen ved en standsning — og browserens
talegenkendelse tjekker, om de nødvendige led er med. Du kan altid høre modellen læst op, og enhver
stemmeøvelse kan springes over.

## Fri træning

| Modul | Hvad du træner |
| --- | --- |
| **Grammatik** | 152 danske opgaver over 14 emner — kommatering, nutids-r, ligge/lægge, nogen/nogle, ad/af, hans/sin, endelser, sammensatte ord, store og små bogstaver, rapportsprog, tegnsætning ud over kommaet, ejefald og apostrof, tal og tid, samt de/dem og som/der — og 60 engelske over 6 emner. |
| **Diktat** | 24 tekster i fire niveauer. Teksten læses op **afsnit for afsnit**, og hvert afsnit kan høres så mange gange, du vil. Dit svar sammenlignes ord for ord med facit. |
| **Rapport og skrivning** | 6 skriveopgaver — hændelsesrapport, anmeldelsesnotat, afhøringsreferat, notat om magtanvendelse, brev til borger og døgnrapportnotat. Du får sagens oplysninger og skriver teksten; den gennemgås automatisk. |
| **Situationer og tone** | 6 scenarier fra virkeligt politiarbejde. Du formulerer replikken selv, får feedback på tone og sprog, vælger mellem tre svar og ser modelsvaret. |
| **Regelbogen** | 32 opslag: 12 politifaglige emner med hovedregel, huskeregel og de punkter, der skal sidde fast, samt 20 sprogregler med gennemgåede eksempler på rigtigt og forkert. |

Under **Profil** ligger overblikket: prioriteret "næste skridt", aktivitet over 14 dage, træfprocent pr.
emne, Leitner-bokse, modulstatus og sessionshistorik — plus den otte uger lange træningsplan frem mod en
prøvedato, du selv sætter, og indstillingerne for tema, lyd, stemmeøvelser og nulstilling.

## Sådan er det bygget til at lære fra sig

- **Du retter direkte i teksten.** Ordet skrives i hullet i sætningen, kommaer sættes ved at klikke
  mellem ordene, og rettelsesopgaver kommer forudfyldt, så du kun ændrer det, der er galt.
- **Reglen følger med hvert svar** — og et klik fører videre til den fulde forklaring i regelbogen.
- **Forkerte svar stilles igen** sidst i lektionen, én gang, så fejlen ikke bare passerer.
- **Spaced repetition:** forkerte svar falder til boks 1 og kommer igen samme dag; rigtige rykker op mod
  boks 5, som først vender tilbage efter godt to uger.
- **Rapportgennemgangen** tjekker, om de nødvendige oplysninger er med (tid, sted, personer, handlinger),
  og om sproget er rapportsprog: aktiv frem for passiv, iagttagelse frem for vurdering, ingen fyldeord,
  ingen kancellisprog — plus de typiske stavefælder. Modelteksten står altid til sammenligning.
- **Lyd og bevægelse** kvitterer for svar og oplæsning. Begge dele kan slås fra, og hele siden respekterer
  `prefers-reduced-motion`.

## Design

Udtrykket er hentet fra den trykte lærebog frem for fra dashboardet: varmt papir, blæksort tekst,
marineblå som myndighedsfarve og messing til fremhævning. Hårfine streger og skarpe hjørner i stedet
for bløde skygger og store radier.

- **Skrifter:** Fraunces som displayskrift på overskrifter, navnet og fejringen — en variabel serif,
  der får et skarpere snit, jo større den sættes. IBM Plex Sans bærer alt andet, og IBM Plex Mono
  står for tal, etiketter, tastaturgenveje og diff. Opgavernes egne sætninger sættes bevidst i Plex
  Sans: dér skal skriften være rolig at læse, ikke markant. Alle filer ligger i `src/fonts/` og
  indlæses lokalt — siden virker også uden netadgang. (Fraunces og IBM Plex, begge SIL Open Font
  License 1.1.)
- **Kanter og flader:** hvert kort har hjørnebeslag i kursusfarven, der tegner sig ind, når kortet
  kommer. Papiret har en svag skravering, enhedernes bannere en skrå tryk-raster, og knapperne en
  synlig kant, der synker, når de trykkes. Ingen bløde skygger, ingen store radier.
- **Lys og mørk tilstand** følger systemet og kan overstyres. Farverne er valgt, så brødtekst ligger
  over 8:1 i kontrast og sekundær tekst over 4,2:1.
- **Bevægelse** bruges til at forklare, ikke til at pynte: ringe tegnes ind, tal tælles op,
  svarmuligheder folder sig ud efter hinanden, og sektionslinjer trækkes fra venstre. Alt slukkes ved
  `prefers-reduced-motion`, og lydkvitteringerne har en afbryder under Profil → Indstillinger.

## Kom i gang

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bygger til dist/
npm run preview  # ser det byggede site igennem
```

Kræver Node 20 eller nyere.

## Udrulning

`vite.config.js` bygger med `base: './'`, så `dist/` kan lægges hvor som helst — også i en undermappe.
Ruterne bruger hash (`#/grammar`), så der skal ingen server-omskrivning til.

Workflowet i `.github/workflows/pages.yml` bygger og udruller til GitHub Pages. Det gør ingenting,
før Pages er slået til for repoet under **Settings → Pages → Source: GitHub Actions**.

## Vigtigt om indholdet

Opgaverne er skrevet ud fra almindelige danske retskrivningsregler og ud fra politiets regelgrundlag —
politiloven, retsplejeloven, straffeloven og færdselsloven. Paragrafhenvisninger er holdt til de
bestemmelser, der læres udenad; ellers henvises til loven ved navn. Det er **ikke** officielt
undervisningsmateriale eller officielle prøvespørgsmål, og siden er ikke tilknyttet politiet.
**Lovgivning ændres — kontrollér altid den gældende ordlyd på retsinformation.dk** og de aktuelle krav
på politiets eget rekrutteringssite.

Feedbacken på dine egne formuleringer — både i scenarier og i rapportmodulet — er regelbaseret, ikke en
sprogmodel. Den fanger typiske fejl i ordvalg, tone og skriftsprog, men kan ikke vurdere en tekst i sin
fulde sammenhæng. Modelteksten står altid ved siden af, så du kan sammenligne selv.

## Kodestruktur

```
src/lib/      router, localStorage-persistens, lektionsmotor med typespredning, Leitner-system,
              talegenkendelse til stemmeøvelser, svarbedømmelse med diff, opgave-parsing til
              redigering i sætningen, talesyntese med afsnitsopdeling, regelbaseret tone- og
              rapportanalyse, lyd, tema samt sprog- og datohjælpere
src/data/     spor, forløb og lektioner, politifaglig vidensbank, grammatikopgaver, diktattekster,
              scenarier, skriveopgaver, regelbog og træningsplan — ren data, ingen logik
src/pages/    én fil pr. rute — Welcome (sporvalg), Path (stien), Lesson (fuldskærm), Practice (Øv-hub),
              Profile (fremskridt, plan og indstillinger i faner), Rules og de fire moduler
src/components/ delte byggeklodser: Shell (skinner og faner), Stats (streak, mål, rang), Teach (lær-kortet),
              Exercise (alle ni opgavetyper ét sted), sætningseditor, ikoner, ringe,
              sektionsoverskrifter, makker og konfetti
```

En opgavetype findes kun ét sted: både lektionerne i forløbet og den frie grammatiktræning tegner
opgaven med `src/components/Exercise.jsx`. Forskellen ligger i rammen omkring — fuld skærm med liv og
bundfeedback i lektionen, kort med regelkort i den frie træning.
