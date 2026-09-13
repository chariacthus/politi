// Gennemgang af en skreven rapport. Tre spor: er de nødvendige oplysninger med,
// er sproget rapportsprog (aktiv form, iagttagelse frem for vurdering), og er
// teksten til at læse. Det er en tjekliste, ikke en sprogmodel — men det er
// præcis de fejl, en vejleder ville sætte streg under.

import { analyzeReply, writingIssues } from './tone.js'

const JUDGEMENTS = [
  'aggressiv', 'truende', 'beruset', 'påvirket', 'nervøs', 'ubehagelig', 'mistænkelig',
  'farlig', 'voldsom', 'provokerende', 'usamarbejdsvillig', 'psykisk syg', 'psykotisk',
  'hidsig', 'ophidset', 'uligevægtig',
]

const FILLERS = ['vist nok', 'sådan lidt', 'lidt af en', 'temmelig', 'ret meget', 'måske', 'nok', 'vel', 'åbenbart']

const PASSIVE = /\b(blev|bliver)\s+[a-zæøå]+(et|t|te|de|ede)\b/gi
const OFFICIALESE = /\b(der blev (af|foretaget)|foranstaltning|foretaget en \w+ af|undertegnede blev)\b/gi

export function analyzeReport(text, assignment) {
  const input = String(text || '').trim()
  const words = input.split(/\s+/).filter(Boolean)
  const sentences = input.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)

  // 1. Kravene: er oplysningerne overhovedet med?
  const requirements = assignment.requirements.map((requirement) => ({
    ...requirement,
    met: requirement.pattern.test(input),
  }))
  const metCount = requirements.filter((r) => r.met).length
  const requirementScore = requirements.length ? metCount / requirements.length : 1

  // 2. Sproget
  const findings = []

  // En enkelt passiv er ofte i orden ("køretøjet blev bugseret"). Det er tætheden,
  // der afslører, at teksten skjuler, hvem der handlede.
  const passiveHits = input.match(PASSIVE) || []
  const passiveDense = passiveHits.length >= 3 || (passiveHits.length >= 2 && sentences.length <= 3)
  if (passiveDense) {
    findings.push({
      level: 'warn',
      text: `${passiveHits.length} passive konstruktioner (fx "${passiveHits[0].trim()}"). Skriv hvem der handlede: "jeg tilkaldte", ikke "der blev tilkaldt".`,
    })
  }

  const officialese = input.match(OFFICIALESE) || []
  if (officialese.length > 0) {
    findings.push({ level: 'warn', text: `Kancellisprog ("${officialese[0].trim()}"). Brug et almindeligt udsagnsord i aktiv form.` })
  }

  const judgements = JUDGEMENTS.filter((word) => new RegExp('\\b' + word, 'i').test(input))
  if (judgements.length > 0) {
    findings.push({
      level: 'warn',
      text: `Vurdering uden belæg: "${judgements.join('", "')}". Skriv hvad du så og hørte, så læseren selv når frem til konklusionen.`,
    })
  }

  const fillers = FILLERS.filter((word) => new RegExp('\\b' + word + '\\b', 'i').test(input))
  if (fillers.length > 0) {
    findings.push({ level: 'warn', text: `Fyldeord svækker teksten: "${fillers.join('", "')}".` })
  }

  const avgSentence = sentences.length ? words.length / sentences.length : words.length
  if (avgSentence > 28) {
    findings.push({ level: 'warn', text: `Sætningerne er lange (ca. ${Math.round(avgSentence)} ord i snit). Del dem op — 15-20 ord læser hurtigst.` })
  }

  const spelling = writingIssues(input)
  for (const issue of spelling) findings.push({ level: 'warn', text: issue })

  const needsClock = assignment.needsClock !== false
  const hasClock = /\bkl\.?\s?\d{1,2}[.:,]\s?\d{2}\b|\b\d{1,2}[.:]\d{2}\b/.test(input)
  if (needsClock && !hasClock) {
    findings.push({ level: 'error', text: 'Der er ingen klokkeslæt i teksten. Alt i en rapport skal kunne tidsfæstes.' })
  }

  const firstPerson = /\b(jeg|vi|undertegnede|patruljen)\b/i.test(input)
  if (!firstPerson) findings.push({ level: 'warn', text: 'Skriv hvem der handlede — "jeg", "vi" eller "undertegnede". Ellers forsvinder ansvaret ud af teksten.' })

  const quoted = /(forklarede|oplyste|udtalte|sagde)/i.test(input)
  if (!quoted && assignment.expectsStatements !== false) {
    findings.push({ level: 'warn', text: 'Markér hvad der er personers udsagn ("forklarede, at ..."), så det ikke forveksles med dine egne iagttagelser.' })
  }

  if (words.length < assignment.minWords) {
    findings.push({
      level: 'error',
      text: `Teksten er kort (${words.length} ord). Opgaven lægger op til mindst ${assignment.minWords} ord, hvis alle oplysninger skal med.`,
    })
  }

  if (sentences.length < 3) {
    findings.push({ level: 'error', text: 'Teksten har for få sætninger til at være et selvstændigt dokument.' })
  }

  // Breve til borgere bedømmes også på tone.
  const tone = assignment.toneCheck ? analyzeReply(input) : null

  const errors = findings.filter((f) => f.level === 'error').length
  const warnings = findings.filter((f) => f.level === 'warn').length
  let languageScore = Math.max(0, 1 - errors * 0.25 - warnings * 0.1)
  if (tone) languageScore = (languageScore + tone.score / 100) / 2

  const good = []
  if (hasClock) good.push('Tidspunkter er med og kan efterprøves.')
  if (firstPerson) good.push('Det fremgår, hvem der handlede.')
  if (quoted) good.push('Udsagn er mærket som udsagn.')
  if (judgements.length === 0) good.push('Ingen vurderinger uden belæg.')
  if (passiveHits.length === 0) good.push('Teksten står i aktiv form hele vejen.')
  else if (!passiveDense) good.push('Overvejende aktiv form — passiv kun der, hvor den kan forsvares.')

  const score = Math.round((requirementScore * 0.6 + languageScore * 0.4) * 100)

  return {
    score,
    words: words.length,
    sentences: sentences.length,
    requirements,
    metCount,
    findings,
    good,
    tone,
  }
}

export function reportVerdict(score) {
  if (score >= 90) return 'Klar til at sende videre'
  if (score >= 75) return 'Solid — mangler detaljer'
  if (score >= 55) return 'Brugbar, men skal rettes igennem'
  return 'Ikke god nok endnu'
}
