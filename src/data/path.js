// Forløbet. Seks enheder, hver med tre lektioner og et tjek. Hver lektion
// trækker fra en eller flere kilder, skrevet som "bank:emne" — så en lektion
// kan blande politifaglig viden med sproget, og det ikke bliver det samme
// igen og igen.

export const units = [
  {
    id: 'u1',
    color: 'var(--navy)',
    number: 1,
    title: 'Grundlaget',
    blurb: 'Hvad politiet er sat i verden for, og hvilke grænser der gælder for ethvert indgreb.',
    lessons: [
      { id: 'u1-1', title: 'Politiets opgave', sources: ['police:formaal'], size: 6 },
      { id: 'u1-2', title: 'De bærende principper', sources: ['police:principper'], size: 7 },
      { id: 'u1-3', title: 'Sproget i en rapport', sources: ['grammar:da:rapportsprog'], size: 6 },
      { id: 'u1-4', title: 'Tjek: grundlaget', checkpoint: true, sources: ['police:formaal', 'police:principper', 'grammar:da:rapportsprog'], size: 10 },
    ],
  },
  {
    id: 'u2',
    color: 'var(--brick)',
    number: 2,
    title: 'Magt og indgreb',
    blurb: 'Hvornår magt må bruges, hvordan den trappes op — og hvilken hjemmel en visitation hviler på.',
    lessons: [
      { id: 'u2-1', title: 'Magtanvendelse', sources: ['police:magt'], size: 7 },
      { id: 'u2-2', title: 'Visitation og ransagning', sources: ['police:visitation'], size: 6 },
      { id: 'u2-3', title: 'Komma i rapporten', sources: ['grammar:da:kommatering'], size: 6 },
      { id: 'u2-4', title: 'Tjek: magt og indgreb', checkpoint: true, sources: ['police:magt', 'police:visitation', 'police:principper', 'grammar:da:kommatering'], size: 10 },
    ],
  },
  {
    id: 'u3',
    color: 'var(--forest)',
    number: 3,
    title: 'Anholdelse og rettigheder',
    blurb: 'Mistankekrav, 24-timersreglen, den sigtedes rettigheder og de korte frister uden for strafferetten.',
    lessons: [
      { id: 'u3-1', title: 'Anholdelse', sources: ['police:anholdelse'], size: 7 },
      { id: 'u3-2', title: 'Den sigtedes rettigheder', sources: ['police:rettigheder'], size: 6 },
      { id: 'u3-3', title: 'Frihedsberøvelse og detention', sources: ['police:frihedsberoevelse'], size: 6 },
      { id: 'u3-4', title: 'Tjek: anholdelse', checkpoint: true, sources: ['police:anholdelse', 'police:rettigheder', 'police:frihedsberoevelse'], size: 10 },
    ],
  },
  {
    id: 'u4',
    color: 'var(--brass)',
    number: 4,
    title: 'Loven i praksis',
    blurb: 'Straffelovens kerneparagraffer og de færdselsregler, der bruges hver eneste vagt.',
    lessons: [
      { id: 'u4-1', title: 'Kerneparagrafferne', sources: ['police:straffelov'], size: 7 },
      { id: 'u4-2', title: 'Færdsel', sources: ['police:faerdsel'], size: 7 },
      { id: 'u4-3', title: 'Sprogfælder i sagen', sources: ['grammar:da:nogen-nogle', 'grammar:da:ad-af'], size: 7 },
      { id: 'u4-4', title: 'Tjek: loven i praksis', checkpoint: true, sources: ['police:straffelov', 'police:faerdsel', 'grammar:da:nogen-nogle'], size: 10 },
    ],
  },
  {
    id: 'u5',
    color: 'var(--navy-2)',
    number: 5,
    title: 'Tjenesten',
    blurb: 'Tavshedspligt, adfærd og den melding, der skal sidde, når det brænder på.',
    lessons: [
      { id: 'u5-1', title: 'Tavshed og notat', sources: ['police:tavshed'], size: 6 },
      { id: 'u5-2', title: 'Adfærd og legitimitet', sources: ['police:etik'], size: 6 },
      { id: 'u5-3', title: 'Melding og radio', sources: ['police:melding'], size: 7 },
      { id: 'u5-4', title: 'Tjek: tjenesten', checkpoint: true, sources: ['police:tavshed', 'police:etik', 'police:melding'], size: 10 },
    ],
  },
  {
    id: 'u6',
    color: 'var(--forest)',
    number: 6,
    title: 'Sproget hele vejen',
    blurb: 'De retskrivningsfælder, der afgør, om rapporten kan bruges — og om prøven bliver bestået.',
    lessons: [
      { id: 'u6-1', title: 'Nutids-r og ligge/lægge', sources: ['grammar:da:nutids-r', 'grammar:da:ligge-laegge'], size: 7 },
      { id: 'u6-2', title: 'Sammensatte ord og store bogstaver', sources: ['grammar:da:sammensatte', 'grammar:da:store-små'], size: 7 },
      { id: 'u6-3', title: 'Endelser og ejestedord', sources: ['grammar:da:endelser', 'grammar:da:hans-sin'], size: 7 },
      { id: 'u6-4', title: 'Tjek: sproget', checkpoint: true, sources: ['grammar:da:kommatering', 'grammar:da:nutids-r', 'grammar:da:sammensatte', 'grammar:da:rapportsprog'], size: 12 },
    ],
  },
]

export const ranks = [
  { xp: 0, title: 'Ansøger' },
  { xp: 300, title: 'Aspirant' },
  { xp: 800, title: 'Politielev' },
  { xp: 1500, title: 'Prøvetjeneste' },
  { xp: 2500, title: 'Politibetjent' },
  { xp: 4000, title: 'Rutineret betjent' },
  { xp: 6000, title: 'Efterforsker' },
  { xp: 9000, title: 'Specialist' },
]

export const allLessons = units.flatMap((unit) => unit.lessons.map((lesson) => ({ ...lesson, unitId: unit.id })))
