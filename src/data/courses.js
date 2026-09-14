// Kurserne. Politi er bygget; matematik har sin plads, sin farve og sin
// beskrivelse, men intet indhold endnu — og siger det selv, tydeligt.

export const courses = [
  {
    id: 'politi',
    name: 'Politi',
    icon: 'shield',
    tagline: 'Optagelsesprøven',
    blurb: 'Dansk retskrivning, rapportsprog, politiets regelgrundlag og tonen i borgerkontakt.',
    ready: true,
    points: ['28 lektioner i 7 enheder', '306 opgaver i ni former', 'Regelbog med 32 opslag'],
  },
  {
    id: 'matematik',
    name: 'Matematik',
    icon: 'calc',
    tagline: 'På vej',
    blurb: 'Tal, procent, brøker, geometri og de tekstopgaver, der går igen i optagelsesprøver.',
    ready: false,
    points: ['Regning uden lommeregner', 'Procent, brøk og forhold', 'Figurer, rumfang og aflæsning'],
  },
]

export function courseById(id) {
  return courses.find((course) => course.id === id) || courses[0]
}
