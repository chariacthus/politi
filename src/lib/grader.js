// Bedømmelse af skriftlige svar. Alt sammenligning sker på normaliseret tekst,
// men hvad der normaliseres væk afhænger af emnet: i en kommateringsopgave er
// kommaerne jo netop det, der bedømmes.

const PUNCTUATION_SENSITIVE = new Set(['kommatering'])
const CASE_SENSITIVE = new Set(['store-små', 'kommatering'])

export function isPunctuationSensitive(item) {
  if (item.strict?.includes('punct')) return true
  return PUNCTUATION_SENSITIVE.has(item.topic)
}

export function isCaseSensitive(item) {
  if (item.strict?.includes('case')) return true
  return CASE_SENSITIVE.has(item.topic)
}

export function normalize(text, { punctuation = false, caseSensitive = false } = {}) {
  let out = String(text ?? '')
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/[‐-―]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()

  if (!punctuation) out = out.replace(/[.,;:!?"'()–—]/g, '')
  if (!caseSensitive) out = out.toLowerCase()

  return out.replace(/\s+/g, ' ').trim()
}

/** Returnerer { correct, expected, normalizedGiven, normalizedExpected } */
export function grade(item, given) {
  if (item.type === 'mc') {
    const correct = String(given) === String(item.answer)
    return { correct, expected: item.answer }
  }

  const opts = {
    punctuation: isPunctuationSensitive(item),
    caseSensitive: isCaseSensitive(item),
  }
  const normGiven = normalize(given, opts)
  const candidates = [item.answer, ...(item.accept || [])]
  const match = candidates.find((candidate) => normalize(candidate, opts) === normGiven)

  return {
    correct: Boolean(match) && normGiven.length > 0,
    expected: item.answer,
    normalizedGiven: normGiven,
    normalizedExpected: normalize(item.answer, opts),
  }
}

/**
 * Ord-for-ord diff via LCS. Returnerer en liste af { type: 'same'|'missing'|'extra', text }
 * hvor "missing" er ord fra facit, der mangler, og "extra" er ord, brugeren har for meget.
 */
export function diffWords(expected, given) {
  const a = tokenize(expected)
  const b = tokenize(given)
  const table = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] = looseEqual(a[i], b[j])
        ? table[i + 1][j + 1] + 1
        : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }

  const out = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (looseEqual(a[i], b[j])) {
      push(out, a[i] === b[j] ? 'same' : 'changed', b[j], a[i])
      i++
      j++
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      push(out, 'missing', a[i])
      i++
    } else {
      push(out, 'extra', b[j])
      j++
    }
  }
  while (i < a.length) push(out, 'missing', a[i++])
  while (j < b.length) push(out, 'extra', b[j++])

  return out
}

function push(list, type, text, expected) {
  list.push(expected === undefined ? { type, text } : { type, text, expected })
}

function tokenize(text) {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
}

// To ord regnes som "samme ord" hvis de kun adskiller sig i tegnsætning/store bogstaver.
// Så kan diffen markere dem som 'changed' i stedet for at kalde dem helt forskellige.
function looseEqual(x, y) {
  if (x === y) return true
  return strip(x) === strip(y) && strip(x).length > 0
}

function strip(word) {
  return String(word)
    .toLowerCase()
    .replace(/[.,;:!?"'()]/g, '')
}

/** Antal afvigelser i en diff — bruges til at score diktat. */
export function countErrors(diff) {
  return diff.filter((part) => part.type !== 'same').length
}
