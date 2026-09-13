// Otte ugers progression frem mod prøven. Hver uge har et fokus, konkrete
// opgaver og et mål, der kan måles på fremskridtssiden.

export const weeks = [
  {
    week: 1,
    title: 'Grundreglerne på plads',
    focus: 'Nutids-r, ligge/lægge, nogen/nogle',
    tasks: [
      { id: 'u1-1', text: 'To drill-sessioner om nutids-r (samme dag som du læser reglen)' },
      { id: 'u1-2', text: 'Én session med ligge/lægge og sidde/sætte' },
      { id: 'u1-3', text: 'Én session med nogen/nogle' },
      { id: 'u1-4', text: 'Diktat niveau 1 — tre tekster' },
    ],
    goal: 'Over 80 % korrekte i nutids-r.',
  },
  {
    week: 2,
    title: 'Ord der ligner hinanden',
    focus: 'Ad/af, hans/sin, endelser',
    tasks: [
      { id: 'u2-1', text: 'Én session om ad/af' },
      { id: 'u2-2', text: 'Én session om hans/sin' },
      { id: 'u2-3', text: 'Én session om -ene/-ende' },
      { id: 'u2-4', text: 'Diktat niveau 1-2 — fire tekster' },
      { id: 'u2-5', text: 'Gentag ugens fejl på fremskridtssiden' },
    ],
    goal: 'Ingen af de tre emner under 70 %.',
  },
  {
    week: 3,
    title: 'Kommatering, første halvdel',
    focus: 'Slutkomma og ledsætninger',
    tasks: [
      { id: 'u3-1', text: 'Læs reglen om slutkomma, og lav to sessioner' },
      { id: 'u3-2', text: 'Skriv fem egne sætninger med ledsætning foran hovedsætning' },
      { id: 'u3-3', text: 'Diktat niveau 2 — fire tekster' },
      { id: 'u3-4', text: 'Blandet session (alle emner)' },
    ],
    goal: 'Over 70 % i kommatering.',
  },
  {
    week: 4,
    title: 'Kommatering, anden halvdel',
    focus: 'Indskudte sætninger og helsætninger',
    tasks: [
      { id: 'u4-1', text: 'To sessioner med kommatering niveau 2-3' },
      { id: 'u4-2', text: 'Diktat niveau 3 — fire tekster' },
      { id: 'u4-3', text: 'Skriv en kort hændelsesbeskrivelse på 10 linjer, og ret den selv' },
    ],
    goal: 'Over 85 % i kommatering. Højst to fejl i en diktat på niveau 3.',
  },
  {
    week: 5,
    title: 'Rapportsprog',
    focus: 'Iagttagelse frem for vurdering, aktiv frem for passiv',
    tasks: [
      { id: 'u5-1', text: 'To sessioner med rapportsprog' },
      { id: 'u5-2', text: 'Skriv en hændelsesrapport om en opdigtet anmeldelse — med tid, sted og personer' },
      { id: 'u5-3', text: 'Gennemgå din egen tekst: streg alle vurderinger under, og skriv dem om til iagttagelser' },
      { id: 'u5-4', text: 'Diktat niveau 3-4 — fire tekster' },
    ],
    goal: 'Din egen rapport indeholder ingen vurderinger uden belæg.',
  },
  {
    week: 6,
    title: 'Tone og situationer',
    focus: 'Kommunikation under pres',
    tasks: [
      { id: 'u6-1', text: 'Gennemfør tre scenarier, og læs principperne bagefter' },
      { id: 'u6-2', text: 'Gentag ét scenarie, og skriv alle replikker selv i fritekst' },
      { id: 'u6-3', text: 'Øv dig i at sige én sætning højt: hvem du er, hvorfor du er der, hvad der sker nu' },
      { id: 'u6-4', text: 'Blandet grammatiksession' },
    ],
    goal: 'Alle scenarier gennemført med over 70 point.',
  },
  {
    week: 7,
    title: 'Engelsk og vedligehold',
    focus: 'Engelsk grammatik + gentagelse af svage emner',
    tasks: [
      { id: 'u7-1', text: 'Tre engelske sessioner (tid, præpositioner, ordstilling)' },
      { id: 'u7-2', text: 'To danske sessioner på dine to svageste emner' },
      { id: 'u7-3', text: 'Diktat: to danske og to engelske' },
    ],
    goal: 'Ingen emner under 75 % på fremskridtssiden.',
  },
  {
    week: 8,
    title: 'Prøvesimulering',
    focus: 'Tempo og præcision under tidspres',
    tasks: [
      { id: 'u8-1', text: 'To blandede sessioner på tid — 15 opgaver på under 10 minutter' },
      { id: 'u8-2', text: 'Diktat niveau 4 — alle tekster' },
      { id: 'u8-3', text: 'Skriv en fri tekst på 20 linjer om, hvorfor du søger ind, og ret den selv for komma og stavning' },
      { id: 'u8-4', text: 'Gennemgå alle scenarier en sidste gang' },
    ],
    goal: 'Over 85 % samlet, og alt stof i boks 4 eller 5.',
  },
]

export const examNotes = [
  'Prøve 1 er en skriftlig prøve med blandt andet dansk retskrivning, læseforståelse og logisk tænkning.',
  'Prøve 2 indeholder blandt andet en skriftlig opgave, fysiske prøver og en samtale.',
  'Skriftligheden vejer tungt hele vejen igennem — også efter optagelsen, hvor rapporter er en kernedel af arbejdet.',
  'Kontrollér altid de aktuelle krav og prøveformer på politiets eget rekrutteringssite, inden du planlægger din prøvedato.',
]
