# Optagelsestræning

Et privat træningsværktøj til politiets optagelsesprøve. Fokus ligger på det, der vejer tungest og er
sværest at træne alene: **skriftlig dansk**, **rapportsprog** og **tonen i borgerkontakt**.

Siden kører helt i browseren. Der er ingen server, ingen konto og ingen data, der forlader maskinen —
fremskridt gemmes i browserens `localStorage`.

## Moduler

| Modul | Hvad du træner |
| --- | --- |
| **Grammatik** | 110 danske opgaver over 10 emner (kommatering, nutids-r, ligge/lægge, nogen/nogle, ad/af, hans/sin, endelser, sammensatte ord, store og små bogstaver, rapportsprog) og 60 engelske over 6 emner. |
| **Diktat** | 24 tekster i fire niveauer. Teksten læses op **afsnit for afsnit**, og hvert afsnit kan høres så mange gange, du vil. Dit svar sammenlignes ord for ord med facit. |
| **Rapport og skrivning** | 6 skriveopgaver — hændelsesrapport, anmeldelsesnotat, afhøringsreferat, notat om magtanvendelse, brev til borger og døgnrapportnotat. Du får sagens oplysninger og skriver teksten; den gennemgås automatisk. |
| **Situationer og tone** | 6 scenarier fra virkeligt politiarbejde. Du formulerer replikken selv, får feedback på tone og sprog, vælger mellem tre svar og ser modelsvaret. |
| **Regelbogen** | 16 regler forklaret med hovedregel, huskeregel, eksempler på forkert og rigtigt samt de fejl, folk oftest laver. 66 gennemgåede eksempler. |
| **Fremskridt** | Prioriteret "næste skridt", aktivitet over 14 dage, træfprocent pr. emne, Leitner-bokse, modulstatus og sessionshistorik. |
| **Træningsplan** | Otte ugers progression frem mod en prøvedato, du selv sætter. |

## Sådan er det bygget til at lære fra sig

- **Du retter direkte i teksten.** Ordet skrives i hullet i sætningen, kommaer sættes ved at klikke
  mellem ordene, og rettelsesopgaver kommer forudfyldt, så du kun ændrer det, der er galt.
- **Reglen følger med hvert svar** — og et klik fører videre til den fulde forklaring i regelbogen.
- **Spaced repetition:** forkerte svar falder til boks 1 og kommer igen samme dag; rigtige rykker op mod
  boks 5, som først vender tilbage efter godt to uger.
- **Rapportgennemgangen** tjekker, om de nødvendige oplysninger er med (tid, sted, personer, handlinger),
  og om sproget er rapportsprog: aktiv frem for passiv, iagttagelse frem for vurdering, ingen fyldeord,
  ingen kancellisprog — plus de typiske stavefælder. Modelteksten står altid til sammenligning.
- **Lyd og bevægelse** kvitterer for svar og oplæsning. Begge dele kan slås fra, og hele siden respekterer
  `prefers-reduced-motion`.

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

Opgaverne er skrevet ud fra almindelige danske retskrivningsregler og typiske opgavetyper. Det er
**ikke** officielle prøvespørgsmål fra politiet, og siden er ikke tilknyttet politiet. Kontrollér altid
de aktuelle krav og prøveformer på politiets eget rekrutteringssite.

Feedbacken på dine egne formuleringer — både i scenarier og i rapportmodulet — er regelbaseret, ikke en
sprogmodel. Den fanger typiske fejl i ordvalg, tone og skriftsprog, men kan ikke vurdere en tekst i sin
fulde sammenhæng. Modelteksten står altid ved siden af, så du kan sammenligne selv.

## Kodestruktur

```
src/lib/      router, localStorage-persistens, Leitner-system, svarbedømmelse med diff,
              opgave-parsing til redigering i sætningen, talesyntese med afsnitsopdeling,
              regelbaseret tone- og rapportanalyse, lyd, tema
src/data/     opgavebank, diktattekster, scenarier, skriveopgaver, regelbog og træningsplan
src/pages/    én fil pr. rute
src/components/ delte byggeklodser (ikoner, ringe, sætningseditor, feedback)
```
