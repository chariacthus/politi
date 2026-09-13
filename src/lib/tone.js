// Regelbaseret analyse af en fritekst-replik i et scenarie.
// Det er heuristik, ikke en sprogmodel: den fanger de typiske fejl i tone og
// skriftsprog, men kan ikke vurdere en formulering i sin fulde sammenhæng.
// Modelsvaret vises altid ved siden af, så du kan sammenligne selv.

const ESCALATING = [
  { pattern: /\bhold (nu )?k(æ|ae)ft\b/i, text: '"Hold kæft" er aldrig en mulighed. Det eskalerer og kan koste dig sagen.' },
  { pattern: /\b(idiot|tosse|spade|klaphat|nar)\b/i, text: 'Skældsord over for en borger er diskvalificerende.' },
  { pattern: /\bslap (nu )?af\b/i, text: '"Slap af" opleves nedladende og trapper typisk konflikten op i stedet for ned.' },
  { pattern: /\b(fatter|forst(å|aa)r) du (det|ikke)\b/i, text: '"Fatter du det?" taler ned til modparten. Spørg i stedet: "Giver det mening?"' },
  { pattern: /\bjeg gider ikke\b/i, text: '"Jeg gider ikke" signalerer ligegyldighed. Sig hvad der sker nu i stedet.' },
  { pattern: /\bdu skal bare\b/i, text: '"Du skal bare" er upræcist. Giv en konkret anvisning: hvad, hvornår, hvorfor.' },
  { pattern: /\b(typisk|s(å|aa)dan nogle som (dig|jer))\b/i, text: 'Generaliseringer om personen er personangreb, ikke sagsbehandling.' },
  { pattern: /\bklap (nu )?i\b/i, text: '"Klap i" er en optrapning. Brug en rolig, tydelig anvisning.' },
  { pattern: /\bdet rager ikke dig\b/i, text: 'Afvis ikke spørgsmål med "det rager ikke dig". Forklar kort hvad du kan og ikke kan oplyse.' },
]

const DEESCALATING = [
  { pattern: /\bjeg (kan godt )?(forst(å|ar)|h(ø|o)rer)\b/i, text: 'Du anerkender modpartens oplevelse — det trapper ned.' },
  { pattern: /\b(tak|venligst|jeg vil bede dig)\b/i, text: 'Høflig form fastholdt under pres.' },
  { pattern: /\bjeg hedder\b|\bjeg er fra politiet\b|\bpolitiet\b/i, text: 'Du identificerer dig / rammen er tydelig.' },
  { pattern: /\b(fordi|(å|a)rsagen|grunden (til|er)|derfor)\b/i, text: 'Du begrunder indgrebet — det er kernen i legitimitet.' },
  { pattern: /\bnu (skal|sker) (du|der|det)\b|\bdet der sker nu\b|\bjeg (vil|skal) bede dig om at\b/i, text: 'Du fortæller hvad der sker nu. Forudsigelighed dæmper modstand.' },
]

const WRITING_ISSUES = [
  { pattern: /\bafsted\b/i, fix: 'af sted', text: 'Det skrives i to ord: "af sted".' },
  { pattern: /\bigang\b/i, fix: 'i gang', text: 'Det skrives i to ord: "i gang".' },
  { pattern: /\bistedet\b/i, fix: 'i stedet', text: 'Det skrives i to ord: "i stedet".' },
  { pattern: /\biforhold\b/i, fix: 'i forhold', text: 'Det skrives i to ord: "i forhold til".' },
  { pattern: /\bidag\b/i, fix: 'i dag', text: 'Det skrives i to ord: "i dag".' },
  { pattern: /\bog (så )?(g(å|a)|se|komme|tale|h(ø|o)re|stoppe|standse|forklare|vise) \b/i, fix: 'at', text: 'Tjek "og/at": foran navnemåde skal der stå "at" ("prøve at gå", ikke "prøve og gå").' },
  { pattern: /\bligge (dig|dem|den ned|h(å|a)nden|tasken)\b/i, fix: 'lægge', text: '"Lægge" er den aktive handling (lægge noget). "Ligge" er at befinde sig et sted.' },
  { pattern: /\bnogen (af )?(mennesker|ting|gange|personer|biler)\b/i, fix: 'nogle', text: '"Nogle" i flertal (= et antal), "nogen" i ental og i nægtelser/spørgsmål.' },
  { pattern: /\bhan (tog|hentede|viste) hans\b/i, fix: 'sin', text: 'Brug "sin", når ejeren er sætningens grundled: "han tog sin telefon".' },
  { pattern: /!{2,}/, fix: null, text: 'Flere udråbstegn i træk læses som råb. Ét er rigeligt.' },
]

export function analyzeReply(text, turn = {}) {
  const input = String(text || '').trim()
  const findings = []
  if (!input) {
    return { score: 0, findings: [{ level: 'error', text: 'Der er ikke skrevet noget svar.' }], words: 0 }
  }

  const words = input.split(/\s+/).filter(Boolean)
  let score = 70

  for (const rule of ESCALATING) {
    if (rule.pattern.test(input)) {
      findings.push({ level: 'error', text: rule.text })
      score -= 25
    }
  }

  let deescalating = 0
  for (const rule of DEESCALATING) {
    if (rule.pattern.test(input)) {
      findings.push({ level: 'good', text: rule.text })
      deescalating += 1
    }
  }
  score += deescalating * 7

  for (const rule of WRITING_ISSUES) {
    if (rule.pattern.test(input)) {
      findings.push({ level: 'warn', text: rule.text })
      score -= 8
    }
  }

  // Råb: mere end to ord skrevet helt med store bogstaver.
  const shouted = words.filter((word) => word.length > 2 && word === word.toUpperCase() && /[A-ZÆØÅ]/.test(word))
  if (shouted.length > 2) {
    findings.push({ level: 'error', text: 'Store bogstaver læses som råb. Myndighed kommer af ro og tydelighed, ikke af lydstyrke.' })
    score -= 20
  }

  // Blandet du/De-tiltale.
  const formal = /\b(De|Dem|Deres)\b/.test(input)
  const informal = /\b(du|dig|din|dit|dine)\b/i.test(input)
  if (formal && informal) {
    findings.push({ level: 'warn', text: 'Du blander "De" og "du". Vælg én tiltaleform og hold den hele vejen.' })
    score -= 8
  }

  // Sætningslængde: lange sætninger er svære at følge for en borger i affekt.
  const sentences = input.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
  const avgLength = sentences.length ? words.length / sentences.length : words.length
  if (avgLength > 22) {
    findings.push({ level: 'warn', text: `Sætningerne er lange (ca. ${Math.round(avgLength)} ord i snit). Under pres skal du ned på 10-15 ord pr. sætning.` })
    score -= 8
  }

  // Fyldeord udvander en anvisning.
  const fillers = (input.match(/\b(bare|lige|altså|jo|sådan set|på en måde)\b/gi) || []).length
  if (fillers >= 3) {
    findings.push({ level: 'warn', text: `Mange fyldeord (${fillers}). "Bare", "lige" og "altså" svækker anvisningen.` })
    score -= 6
  }

  if (words.length < 5) {
    findings.push({ level: 'warn', text: 'Svaret er meget kort. En borger skal både høre hvorfor og hvad der sker nu.' })
    score -= 10
  }
  if (words.length > 90) {
    findings.push({ level: 'warn', text: 'Svaret er langt. Sig det nødvendige — lange forklaringer i en spidset situation bliver ikke hørt.' })
    score -= 6
  }

  // Emnespecifikke krav fra scenariet, fx "skal nævne sin hjemmel".
  for (const requirement of turn.requires || []) {
    if (!requirement.pattern.test(input)) {
      findings.push({ level: 'warn', text: requirement.text })
      score -= 10
    }
  }

  if (!findings.some((f) => f.level === 'error' || f.level === 'warn')) {
    findings.push({ level: 'good', text: 'Ingen sproglige eller tonemæssige fejl fundet. Sammenlign nu med modelsvaret.' })
  }

  return { score: clamp(score), findings, words: words.length }
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function toneLabel(score) {
  if (score >= 80) return 'Professionel'
  if (score >= 60) return 'Brugbar, men kan skærpes'
  if (score >= 35) return 'Upræcis'
  return 'Uacceptabel'
}
