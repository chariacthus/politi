// Uddannelsen. Fire trin fra begynder til professionel, hvert trin med sine
// enheder, hver enhed med sine lektioner. Stoffet bygger oven på sig selv:
// almindeligt sprog → klar og høflig kommunikation → politifaget → det
// professionelle niveau, hvor rapport, jura og engelsk skal kunne bruges
// under pres. En lektion trækker fra en eller flere kilder, skrevet som
// "bank:emne", så sprog og fag kan blandes i samme lektion.

export const stages = [
  {
    id: 't1',
    number: 1,
    title: 'Grundsprog',
    level: 'Begynder',
    blurb: 'Helt fra begyndelsen: enkle sætninger på dansk, de første ord på engelsk, tal, tid og sted.',
    goal: 'Du kan sige og forstå det almindelige sprog, alt andet bygger på.',
  },
  {
    id: 't2',
    number: 2,
    title: 'Klar kommunikation',
    level: 'Øvet',
    blurb: 'At blive forstået: høflig og tydelig tale, præcis beskrivelse, og en retskrivning der holder.',
    goal: 'Du kan forklare dig klart — i tale og på skrift, på dansk og på engelsk.',
  },
  {
    id: 't3',
    number: 3,
    title: 'Politifaget',
    level: 'Fagligt',
    blurb: 'Grundlaget under politiarbejdet: opgaven, principperne, magt, anholdelse, loven og tjenesten.',
    goal: 'Du kender reglerne bag indgrebene og kan forklare hjemlen bag det, du gør.',
  },
  {
    id: 't4',
    number: 4,
    title: 'Professionel',
    level: 'Professionel',
    blurb: 'Det færdige niveau: rapportsprog, præcision i skriften, engelsk i tjenesten og prøvens form.',
    goal: 'Du skriver, taler og handler som en betjent forventes at gøre det.',
  },
]

export const units = [
  // ---------------- Trin 1 · Grundsprog ----------------
  {
    id: 'u1',
    stageId: 't1',
    color: 'var(--brand)',
    number: 1,
    title: 'Sproget i hverdagen',
    blurb: 'Den korte, klare sætning. Hvem gør hvad — og forskellen på det, du har set, og det, du tror.',
    lessons: [
      { id: 'u1-1', title: 'Din første sætning', sources: ['grammar:da:hverdag'], size: 5 },
      { id: 'u1-2', title: 'Set eller troet', sources: ['grammar:da:hverdag'], size: 6 },
      { id: 'u1-3', title: 'Hilsen og præsentation', sources: ['grammar:en:basis'], size: 5 },
      { id: 'u1-4', title: 'Tjek: hverdagssproget', checkpoint: true, sources: ['grammar:da:hverdag', 'grammar:en:basis'], size: 9 },
    ],
  },
  {
    id: 'u2',
    stageId: 't1',
    color: 'var(--brand-2)',
    number: 2,
    title: 'Tal, tid og sted',
    blurb: 'Klokkeslæt, datoer, retninger og bogstavering — på dansk og på engelsk.',
    lessons: [
      { id: 'u2-1', title: 'Tal og klokkeslæt', sources: ['grammar:en:tal-tid'], size: 6 },
      { id: 'u2-2', title: 'Steder og vejvisning', sources: ['grammar:en:retning'], size: 6 },
      { id: 'u2-3', title: 'Tid og tal i skrift', sources: ['grammar:da:tal-og-tid'], size: 6 },
      { id: 'u2-4', title: 'Tjek: tal, tid og sted', checkpoint: true, sources: ['grammar:en:tal-tid', 'grammar:en:retning', 'grammar:da:tal-og-tid'], size: 10 },
    ],
  },
  {
    id: 'u3',
    stageId: 't1',
    color: 'var(--accent)',
    number: 3,
    title: 'Beskriv det, du ser',
    blurb: 'Personer, køretøjer og steder beskrevet, så en anden kan genkende dem.',
    lessons: [
      { id: 'u3-1', title: 'Personer og køretøjer', sources: ['grammar:da:praecis'], size: 6 },
      { id: 'u3-2', title: 'Describing people', sources: ['grammar:en:person'], size: 6 },
      { id: 'u3-3', title: 'Retning, tid og sted', sources: ['grammar:da:praecis'], size: 5 },
      { id: 'u3-4', title: 'Tjek: beskrivelse', checkpoint: true, sources: ['grammar:da:praecis', 'grammar:en:person'], size: 10 },
    ],
  },

  // ---------------- Trin 2 · Klar kommunikation ----------------
  {
    id: 'u4',
    stageId: 't2',
    color: 'var(--forest)',
    number: 4,
    title: 'Høflig og tydelig',
    blurb: 'Præsentation, årsag og næste skridt. Hvornår man beder — og hvornår man giver en ordre.',
    lessons: [
      { id: 'u4-1', title: 'Sig hvem du er, og hvorfor', sources: ['grammar:da:hoeflig'], size: 5 },
      { id: 'u4-2', title: 'Anmodning eller ordre', sources: ['grammar:da:hoeflig'], size: 5 },
      { id: 'u4-3', title: 'Formal English', sources: ['grammar:en:formel'], size: 6 },
      { id: 'u4-4', title: 'Tjek: tonen', checkpoint: true, sources: ['grammar:da:hoeflig', 'grammar:en:formel'], size: 10 },
    ],
  },
  {
    id: 'u5',
    stageId: 't2',
    color: 'var(--brand)',
    number: 5,
    title: 'Retskrivning der holder',
    blurb: 'Komma, nutids-r og de ordfælder, der afgør, om en tekst kan bruges.',
    lessons: [
      { id: 'u5-1', title: 'Kommaet', sources: ['grammar:da:kommatering'], size: 6 },
      { id: 'u5-2', title: 'Nutids-r og ligge/lægge', sources: ['grammar:da:nutids-r', 'grammar:da:ligge-laegge'], size: 7 },
      { id: 'u5-3', title: 'Nogen/nogle og ad/af', sources: ['grammar:da:nogen-nogle', 'grammar:da:ad-af'], size: 7 },
      { id: 'u5-4', title: 'Tjek: retskrivning', checkpoint: true, sources: ['grammar:da:kommatering', 'grammar:da:nutids-r', 'grammar:da:nogen-nogle'], size: 10 },
    ],
  },
  {
    id: 'u6',
    stageId: 't2',
    color: 'var(--accent)',
    number: 6,
    title: 'Ordene og formerne',
    blurb: 'Sammensatte ord, endelser, ejestedord og store bogstaver — fælderne, alle falder i.',
    lessons: [
      { id: 'u6-1', title: 'Sammensatte ord', sources: ['grammar:da:sammensatte'], size: 6 },
      { id: 'u6-2', title: 'Endelser og ejestedord', sources: ['grammar:da:endelser', 'grammar:da:hans-sin'], size: 7 },
      { id: 'u6-3', title: 'Store og små bogstaver', sources: ['grammar:da:store-små'], size: 6 },
      { id: 'u6-4', title: 'Tjek: ordene', checkpoint: true, sources: ['grammar:da:sammensatte', 'grammar:da:endelser', 'grammar:da:store-små'], size: 10 },
    ],
  },

  // ---------------- Trin 3 · Politifaget ----------------
  {
    id: 'u7',
    stageId: 't3',
    color: 'var(--brand)',
    number: 7,
    title: 'Grundlaget',
    blurb: 'Hvad politiet er sat i verden for, hvilke grænser der gælder — og hvad fagordene betyder.',
    lessons: [
      { id: 'u7-1', title: 'Fagordene', sources: ['grammar:da:fagord'], size: 6 },
      { id: 'u7-2', title: 'Politiets opgave', sources: ['police:formaal'], size: 6 },
      { id: 'u7-3', title: 'De bærende principper', sources: ['police:principper'], size: 7 },
      { id: 'u7-4', title: 'Tjek: grundlaget', checkpoint: true, sources: ['police:formaal', 'police:principper', 'grammar:da:fagord'], size: 10 },
    ],
  },
  {
    id: 'u8',
    stageId: 't3',
    color: 'var(--brick)',
    number: 8,
    title: 'Magt og indgreb',
    blurb: 'Hvornår magt må bruges, hvordan den trappes op — og hvilken hjemmel en visitation hviler på.',
    lessons: [
      { id: 'u8-1', title: 'Magtanvendelse', sources: ['police:magt'], size: 7 },
      { id: 'u8-2', title: 'Visitation og ransagning', sources: ['police:visitation'], size: 6 },
      { id: 'u8-3', title: 'Standsning på engelsk', sources: ['grammar:en:kontrol'], size: 6 },
      { id: 'u8-4', title: 'Tjek: magt og indgreb', checkpoint: true, sources: ['police:magt', 'police:visitation', 'police:principper'], size: 10 },
    ],
  },
  {
    id: 'u9',
    stageId: 't3',
    color: 'var(--forest)',
    number: 9,
    title: 'Anholdelse og rettigheder',
    blurb: 'Mistankekrav, 24-timersreglen, den sigtedes rettigheder og de korte frister uden for strafferetten.',
    lessons: [
      { id: 'u9-1', title: 'Anholdelse', sources: ['police:anholdelse'], size: 7 },
      { id: 'u9-2', title: 'Den sigtedes rettigheder', sources: ['police:rettigheder'], size: 6 },
      { id: 'u9-3', title: 'Frihedsberøvelse og detention', sources: ['police:frihedsberoevelse'], size: 6 },
      { id: 'u9-4', title: 'Tjek: anholdelse', checkpoint: true, sources: ['police:anholdelse', 'police:rettigheder', 'police:frihedsberoevelse'], size: 10 },
    ],
  },
  {
    id: 'u10',
    stageId: 't3',
    color: 'var(--accent)',
    number: 10,
    title: 'Loven i praksis',
    blurb: 'Straffelovens kerneparagraffer og de færdselsregler, der bruges hver eneste vagt.',
    lessons: [
      { id: 'u10-1', title: 'Kerneparagrafferne', sources: ['police:straffelov'], size: 7 },
      { id: 'u10-2', title: 'Færdsel', sources: ['police:faerdsel'], size: 7 },
      { id: 'u10-3', title: 'Borgerkontakt på engelsk', sources: ['grammar:en:borger'], size: 6 },
      { id: 'u10-4', title: 'Tjek: loven i praksis', checkpoint: true, sources: ['police:straffelov', 'police:faerdsel'], size: 10 },
    ],
  },
  {
    id: 'u11',
    stageId: 't3',
    color: 'var(--brand-2)',
    number: 11,
    title: 'Tjenesten',
    blurb: 'Tavshedspligt, notatpligt, adfærd og den melding, der skal kunne forstås første gang.',
    lessons: [
      { id: 'u11-1', title: 'Tavshedspligt og notatpligt', sources: ['police:tavshed'], size: 6 },
      { id: 'u11-2', title: 'Adfærd og legitimitet', sources: ['police:etik'], size: 6 },
      { id: 'u11-3', title: 'Melding og radioprocedure', sources: ['police:melding'], size: 7 },
      { id: 'u11-4', title: 'Tjek: tjenesten', checkpoint: true, sources: ['police:tavshed', 'police:etik', 'police:melding'], size: 10 },
    ],
  },

  // ---------------- Trin 4 · Professionel ----------------
  {
    id: 'u12',
    stageId: 't4',
    color: 'var(--brand)',
    number: 12,
    title: 'Rapportsprog',
    blurb: 'Iagttagelse frem for vurdering, aktiv frem for passiv, præcision frem for omtrent.',
    lessons: [
      { id: 'u12-1', title: 'Fakta frem for vurdering', sources: ['grammar:da:rapportsprog'], size: 6 },
      { id: 'u12-2', title: 'Aktiv form og præcision', sources: ['grammar:da:rapportsprog'], size: 6 },
      { id: 'u12-3', title: 'Written English', sources: ['grammar:en:skrift'], size: 6 },
      { id: 'u12-4', title: 'Tjek: rapportsprog', checkpoint: true, sources: ['grammar:da:rapportsprog', 'grammar:en:skrift'], size: 10 },
    ],
  },
  {
    id: 'u13',
    stageId: 't4',
    color: 'var(--brick)',
    number: 13,
    title: 'Præcision i skriften',
    blurb: 'Tegnene ud over kommaet, ejefald og de henvisninger, der ikke må kunne misforstås.',
    lessons: [
      { id: 'u13-1', title: 'Tegn ud over kommaet', sources: ['grammar:da:tegnsaetning'], size: 7 },
      { id: 'u13-2', title: 'Ejefald og apostrof', sources: ['grammar:da:ejefald'], size: 6 },
      { id: 'u13-3', title: 'De, dem, som og der', sources: ['grammar:da:henvisning'], size: 6 },
      { id: 'u13-4', title: 'Tjek: præcision', checkpoint: true, sources: ['grammar:da:tegnsaetning', 'grammar:da:ejefald', 'grammar:da:henvisning'], size: 11 },
    ],
  },
  {
    id: 'u14',
    stageId: 't4',
    color: 'var(--forest)',
    number: 14,
    title: 'Engelsk i tjenesten',
    blurb: 'Hele vejen på engelsk: kontrol, borgerkontakt, formel tone og den skrevne rapport.',
    lessons: [
      { id: 'u14-1', title: 'Grammatikken bag', sources: ['grammar:en:tense', 'grammar:en:agreement'], size: 7 },
      { id: 'u14-2', title: 'Ordstilling og forholdsord', sources: ['grammar:en:word-order', 'grammar:en:prepositions'], size: 7 },
      { id: 'u14-3', title: 'Ord der forveksles', sources: ['grammar:en:confusables', 'grammar:en:articles'], size: 7 },
      { id: 'u14-4', title: 'Tjek: engelsk i tjenesten', checkpoint: true, sources: ['grammar:en:kontrol', 'grammar:en:borger', 'grammar:en:skrift', 'grammar:en:formel'], size: 11 },
    ],
  },
  {
    id: 'u15',
    stageId: 't4',
    color: 'var(--accent)',
    number: 15,
    title: 'Prøvens form',
    blurb: 'Det hele på én gang — sprog, fag og præcision, blandet som på selve prøven.',
    lessons: [
      { id: 'u15-1', title: 'Blandet dansk', sources: ['grammar:da:kommatering', 'grammar:da:rapportsprog', 'grammar:da:sammensatte', 'grammar:da:tegnsaetning'], size: 10 },
      { id: 'u15-2', title: 'Blandet politifag', sources: ['police:magt', 'police:anholdelse', 'police:straffelov', 'police:tavshed'], size: 10 },
      { id: 'u15-3', title: 'Blandet engelsk', sources: ['grammar:en:kontrol', 'grammar:en:skrift', 'grammar:en:tal-tid', 'grammar:en:person'], size: 10 },
      { id: 'u15-4', title: 'Prøvesimulering', checkpoint: true, sources: ['grammar:da:kommatering', 'grammar:da:rapportsprog', 'police:principper', 'police:magt', 'grammar:en:skrift', 'grammar:da:praecis'], size: 14 },
    ],
  },
]

// Rangene følger uddannelsen: fra ansøger til den specialiserede betjent.
export const ranks = [
  { xp: 0, title: 'Ansøger' },
  { xp: 250, title: 'Nybegynder' },
  { xp: 700, title: 'Aspirant' },
  { xp: 1400, title: 'Politielev' },
  { xp: 2400, title: 'Prøvetjeneste' },
  { xp: 3800, title: 'Politibetjent' },
  { xp: 5600, title: 'Rutineret betjent' },
  { xp: 8000, title: 'Efterforsker' },
  { xp: 11000, title: 'Specialist' },
]

export const allLessons = units.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ ...lesson, unitId: unit.id, stageId: unit.stageId })),
)

export function stageOf(unitId) {
  const unit = units.find((entry) => entry.id === unitId)
  return stages.find((stage) => stage.id === unit?.stageId) || stages[0]
}

export function unitsInStage(stageId) {
  return units.filter((unit) => unit.stageId === stageId)
}
