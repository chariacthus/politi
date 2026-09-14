// Uddannelsen. Fire trin fra begynder til professionel, hvert trin med sine
// enheder, hver enhed med sine lektioner. Stoffet bygger oven på sig selv:
// almindeligt sprog → klar og høflig kommunikation → politifaget → det
// professionelle niveau, hvor rapport, jura og engelsk skal kunne bruges
// under pres. En lektion trækker fra en eller flere kilder, skrevet som
// "bank:emne", så sprog og fag kan blandes i samme lektion.

export const stages = [
  { id: 't1', number: 1, title: 'Grundlag', level: 'Begynder', units: ['u1', 'u2', 'u3'] },
  { id: 't2', number: 2, title: 'Øvelse', level: 'Øvet', units: ['u4', 'u5', 'u6'] },
  { id: 't3', number: 3, title: 'Scenarier', level: 'Situationer', units: ['u7', 'u8'] },
  { id: 't4', number: 4, title: 'Prøver', level: 'Jura', units: ['u9', 'u10'] },
  { id: 't5', number: 5, title: 'Avanceret træning', level: 'Skriftligt', units: ['u11', 'u12', 'u13'] },
  { id: 't6', number: 6, title: 'Professionelt niveau', level: 'Professionel', units: ['u14', 'u15'] },
]

export const units = [
  // ---------------- Trin 1 · Grundsprog ----------------
  {
    id: 'u1',
    color: 'var(--brand)',
    number: 1,
    title: 'Sproget i hverdagen',
    blurb: 'Den korte, klare sætning',
    lessons: [
      { id: 'u1-1', title: 'Din første sætning', sources: ['grammar:da:hverdag'], size: 5 },
      { id: 'u1-2', title: 'Set eller troet', sources: ['grammar:da:hverdag'], size: 6 },
      { id: 'u1-3', title: 'Hilsen og præsentation', sources: ['grammar:en:basis'], size: 5 },
      { id: 'u1-4', title: 'Tjek: hverdagssproget', checkpoint: true, sources: ['grammar:da:hverdag', 'grammar:en:basis'], size: 9 },
    ],
  },
  {
    id: 'u2',
    color: 'var(--brand-2)',
    number: 2,
    title: 'Tal, tid og sted',
    blurb: 'Klokkeslæt, datoer og retninger',
    lessons: [
      { id: 'u2-1', title: 'Tal og klokkeslæt', sources: ['grammar:en:tal-tid'], size: 6 },
      { id: 'u2-2', title: 'Steder og vejvisning', sources: ['grammar:en:retning'], size: 6 },
      { id: 'u2-3', title: 'Tid og tal i skrift', sources: ['grammar:da:tal-og-tid'], size: 6 },
      { id: 'u2-4', title: 'Tjek: tal, tid og sted', checkpoint: true, sources: ['grammar:en:tal-tid', 'grammar:en:retning', 'grammar:da:tal-og-tid'], size: 10 },
    ],
  },
  {
    id: 'u3',
    color: 'var(--accent)',
    number: 3,
    title: 'Beskriv det, du ser',
    blurb: 'Personer, køretøjer og steder',
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
    color: 'var(--forest)',
    number: 4,
    title: 'Høflig og tydelig',
    blurb: 'Tonen der får folk til at samarbejde',
    lessons: [
      { id: 'u4-1', title: 'Sig hvem du er, og hvorfor', sources: ['grammar:da:hoeflig'], size: 5 },
      { id: 'u4-2', title: 'Anmodning eller ordre', sources: ['grammar:da:hoeflig'], size: 5 },
      { id: 'u4-3', title: 'Formal English', sources: ['grammar:en:formel'], size: 6 },
      { id: 'u4-4', title: 'Tjek: tonen', checkpoint: true, sources: ['grammar:da:hoeflig', 'grammar:en:formel'], size: 10 },
    ],
  },
  {
    id: 'u5',
    color: 'var(--brand)',
    number: 5,
    title: 'Retskrivning der holder',
    blurb: 'Komma, nutids-r og ordfælder',
    lessons: [
      { id: 'u5-1', title: 'Kommaet', sources: ['grammar:da:kommatering'], size: 6 },
      { id: 'u5-2', title: 'Nutids-r og ligge/lægge', sources: ['grammar:da:nutids-r', 'grammar:da:ligge-laegge'], size: 7 },
      { id: 'u5-3', title: 'Nogen/nogle og ad/af', sources: ['grammar:da:nogen-nogle', 'grammar:da:ad-af'], size: 7 },
      { id: 'u5-4', title: 'Tjek: retskrivning', checkpoint: true, sources: ['grammar:da:kommatering', 'grammar:da:nutids-r', 'grammar:da:nogen-nogle'], size: 10 },
    ],
  },
  {
    id: 'u6',
    color: 'var(--accent)',
    number: 6,
    title: 'Ordene og formerne',
    blurb: 'Sammensatte ord, endelser og store bogstaver',
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
    color: 'var(--brand)',
    number: 7,
    title: 'Grundlaget',
    blurb: 'Opgaven, principperne og fagordene',
    lessons: [
      { id: 'u7-1', title: 'Fagordene', sources: ['grammar:da:fagord'], size: 6 },
      { id: 'u7-2', title: 'Politiets opgave', sources: ['police:formaal'], size: 6 },
      { id: 'u7-3', title: 'De bærende principper', sources: ['police:principper'], size: 7 },
      { id: 'u7-4', title: 'Tjek: grundlaget', checkpoint: true, sources: ['police:formaal', 'police:principper', 'grammar:da:fagord'], size: 10 },
    ],
  },
  {
    id: 'u8',
    color: 'var(--brick)',
    number: 8,
    title: 'Magt og indgreb',
    blurb: 'Hvornår magt må bruges — og hvordan',
    lessons: [
      { id: 'u8-1', title: 'Magtanvendelse', sources: ['police:magt'], size: 7 },
      { id: 'u8-2', title: 'Visitation og ransagning', sources: ['police:visitation'], size: 6 },
      { id: 'u8-3', title: 'Standsning på engelsk', sources: ['grammar:en:kontrol'], size: 6 },
      { id: 'u8-4', title: 'Tjek: magt og indgreb', checkpoint: true, sources: ['police:magt', 'police:visitation', 'police:principper'], size: 10 },
    ],
  },
  {
    id: 'u9',
    color: 'var(--forest)',
    number: 9,
    title: 'Anholdelse og rettigheder',
    blurb: 'Mistanke, frister og rettigheder',
    lessons: [
      { id: 'u9-1', title: 'Anholdelse', sources: ['police:anholdelse'], size: 7 },
      { id: 'u9-2', title: 'Den sigtedes rettigheder', sources: ['police:rettigheder'], size: 6 },
      { id: 'u9-3', title: 'Frihedsberøvelse og detention', sources: ['police:frihedsberoevelse'], size: 6 },
      { id: 'u9-4', title: 'Tjek: anholdelse', checkpoint: true, sources: ['police:anholdelse', 'police:rettigheder', 'police:frihedsberoevelse'], size: 10 },
    ],
  },
  {
    id: 'u10',
    color: 'var(--accent)',
    number: 10,
    title: 'Loven i praksis',
    blurb: 'Straffeloven og færdsel i praksis',
    lessons: [
      { id: 'u10-1', title: 'Kerneparagrafferne', sources: ['police:straffelov'], size: 7 },
      { id: 'u10-2', title: 'Færdsel', sources: ['police:faerdsel'], size: 7 },
      { id: 'u10-3', title: 'Borgerkontakt på engelsk', sources: ['grammar:en:borger'], size: 6 },
      { id: 'u10-4', title: 'Tjek: loven i praksis', checkpoint: true, sources: ['police:straffelov', 'police:faerdsel'], size: 10 },
    ],
  },
  {
    id: 'u11',
    color: 'var(--brand-2)',
    number: 11,
    title: 'Tjenesten',
    blurb: 'Tavshedspligt, adfærd og melding',
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
    color: 'var(--brand)',
    number: 12,
    title: 'Rapportsprog',
    blurb: 'Fakta frem for vurdering',
    lessons: [
      { id: 'u12-1', title: 'Fakta frem for vurdering', sources: ['grammar:da:rapportsprog'], size: 6 },
      { id: 'u12-2', title: 'Aktiv form og præcision', sources: ['grammar:da:rapportsprog'], size: 6 },
      { id: 'u12-3', title: 'Written English', sources: ['grammar:en:skrift'], size: 6 },
      { id: 'u12-4', title: 'Tjek: rapportsprog', checkpoint: true, sources: ['grammar:da:rapportsprog', 'grammar:en:skrift'], size: 10 },
    ],
  },
  {
    id: 'u13',
    color: 'var(--brick)',
    number: 13,
    title: 'Præcision i skriften',
    blurb: 'Tegn, ejefald og henvisninger',
    lessons: [
      { id: 'u13-1', title: 'Tegn ud over kommaet', sources: ['grammar:da:tegnsaetning'], size: 7 },
      { id: 'u13-2', title: 'Ejefald og apostrof', sources: ['grammar:da:ejefald'], size: 6 },
      { id: 'u13-3', title: 'De, dem, som og der', sources: ['grammar:da:henvisning'], size: 6 },
      { id: 'u13-4', title: 'Tjek: præcision', checkpoint: true, sources: ['grammar:da:tegnsaetning', 'grammar:da:ejefald', 'grammar:da:henvisning'], size: 11 },
    ],
  },
  {
    id: 'u14',
    color: 'var(--forest)',
    number: 14,
    title: 'Engelsk i tjenesten',
    blurb: 'Hele vejen på engelsk',
    lessons: [
      { id: 'u14-1', title: 'Grammatikken bag', sources: ['grammar:en:tense', 'grammar:en:agreement'], size: 7 },
      { id: 'u14-2', title: 'Ordstilling og forholdsord', sources: ['grammar:en:word-order', 'grammar:en:prepositions'], size: 7 },
      { id: 'u14-3', title: 'Ord der forveksles', sources: ['grammar:en:confusables', 'grammar:en:articles'], size: 7 },
      { id: 'u14-4', title: 'Tjek: engelsk i tjenesten', checkpoint: true, sources: ['grammar:en:kontrol', 'grammar:en:borger', 'grammar:en:skrift', 'grammar:en:formel'], size: 11 },
    ],
  },
  {
    id: 'u15',
    color: 'var(--accent)',
    number: 15,
    title: 'Prøvens form',
    blurb: 'Alt på én gang, som til prøven',
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

const stageByUnit = {}
for (const stage of stages) for (const id of stage.units) stageByUnit[id] = stage.id

export const allLessons = units.flatMap((unit) =>
  unit.lessons.map((lesson) => ({ ...lesson, unitId: unit.id, stageId: stageByUnit[unit.id] })),
)

export function stageOf(unitId) {
  return stages.find((stage) => stage.units.includes(unitId)) || stages[0]
}

export function unitsInStage(stageId) {
  const stage = stages.find((entry) => entry.id === stageId)
  return stage ? stage.units.map((id) => units.find((unit) => unit.id === id)).filter(Boolean) : []
}
