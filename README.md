# Optagelsestræning

Et privat træningsværktøj til politiets optagelsesprøve. Fokus ligger på det, der vejer tungest og
er sværest at træne alene: **skriftlig dansk** og **tonen i borgerkontakt**.

Siden kører helt i browseren. Der er ingen server, ingen konto og ingen data, der forlader maskinen —
fremskridt gemmes i browserens `localStorage`.

## Moduler

| Modul | Hvad du træner |
| --- | --- |
| **Grammatik** | 110 danske opgaver over 10 emner (kommatering, nutids-r, ligge/lægge, nogen/nogle, ad/af, hans/sin, endelser, sammensatte ord, store og små bogstaver, rapportsprog) og 60 engelske over 6 emner. |
| **Diktat** | 24 tekster i fire niveauer. Teksten læses op med browserens talesyntese, og dit svar sammenlignes ord for ord med facit. |
| **Situationer og tone** | 6 scenarier — færdselskontrol, nabostrid, underretning af pårørende, natteliv, psykisk krise, afhøring af ungt vidne. Du formulerer selv din replik, får feedback på tone og sprog og ser et modelsvar. |
| **Fremskridt** | Træfprocent pr. emne (svageste først), Leitner-bokse, sessionshistorik og streak. |
| **Træningsplan** | Otte ugers progression frem mod en prøvedato, du selv sætter. |

Forkert besvarede opgaver falder tilbage i boks 1 og kommer igen samme dag. Rigtige svar rykker et trin
op, og boks 5 vender først tilbage efter godt to uger.

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
**ikke** officielle prøvespørgsmål fra politiet, og siden er ikke tilknyttet politiet. Kontrollér
altid de aktuelle krav og prøveformer på politiets eget rekrutteringssite.

Tone-feedbacken på dine egne formuleringer er regelbaseret — den fanger typiske fejl i ordvalg, tone
og skriftsprog, men den kan ikke vurdere en replik i sin fulde sammenhæng. Modelsvaret står altid ved
siden af, så du kan sammenligne selv.

## Kodestruktur

```
src/lib/      router, localStorage-persistens, Leitner-system, svarbedømmelse med diff,
              talesyntese med fallback, regelbaseret tone-analyse
src/data/     opgavebank, diktattekster, scenarier og træningsplan — ren data, ingen logik
src/pages/    én fil pr. rute
src/components/ delte byggeklodser
```
