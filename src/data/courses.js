// Kurserne. Politi er bygget; matematik har sin plads, sin farve og sin
// beskrivelse, men intet indhold endnu — og siger det selv, tydeligt.

export const courses = [
  {
    id: 'politi',
    name: 'Politi',
    icon: 'shield',
    tagline: 'Optagelsesprøven',
    blurb: 'Fra almindeligt sprog til professionel betjent: dansk, engelsk, politifag og tonen i borgerkontakt.',
    ready: true,
    points: ['Fire trin: begynder til professionel', '60 lektioner · 397 opgaver', 'Regelbog med 44 opslag'],
  },
  {
    id: 'matematik',
    name: 'Matematik',
    icon: 'calc',
    tagline: 'På vej',
    blurb: 'Tal, procent, brøker, geometri og de tekstopgaver, der går igen i optagelsesprøver.',
    ready: false,
    points: ['Samme fire trin som politisporet', 'Regning uden lommeregner', 'Procent, brøk, figurer og aflæsning'],
  },
]

export function courseById(id) {
  return courses.find((course) => course.id === id) || courses[0]
}
