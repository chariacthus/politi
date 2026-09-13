// Opgaverne formulerer arbejdssætningen i anførselstegn til sidst i prompten
// ("Ret fejlen: \"Han plejer at kommer for sent.\""). Her trækkes den ud, så
// brugeren kan rette direkte i sætningen i stedet for at skrive den forfra.

export function parsePrompt(item) {
  const matches = [...item.prompt.matchAll(/"([^"]+)"/g)]
  const last = matches[matches.length - 1]
  if (!last) return { instruction: item.prompt, sentence: null, trailing: '', hasBlank: false }

  const sentence = last[1]
  const instruction = item.prompt.slice(0, last.index).replace(/[:\s]+$/, '').trim()
  const trailing = item.prompt.slice(last.index + last[0].length).trim()

  return { instruction, sentence, trailing, hasBlank: sentence.includes('____') }
}

/**
 * Hvilken redigeringsform passer til opgaven?
 *  blank  — skriv ordet direkte i hullet i sætningen
 *  comma  — klik mellem ordene for at sætte komma
 *  edit   — ret direkte i den forudfyldte sætning
 *  choice — vælg mellem svarmuligheder
 *  text   — almindeligt skrivefelt (hvis sætningen ikke kunne udledes)
 */
export function editorMode(item) {
  const parsed = parsePrompt(item)
  if (item.type === 'mc') return 'choice'
  if (item.type === 'fill') return parsed.hasBlank ? 'blank' : 'text'
  // Kommateringsopgaver løses ved at sætte komma — ikke ved at skrive sætningen om.
  if (item.topic === 'kommatering' && parsed.sentence) return 'comma'
  return parsed.sentence ? 'edit' : 'text'
}

/** Deler en sætning op i ord og de mellemrum, hvor et komma kan sættes. */
export function splitForCommas(sentence) {
  const words = sentence.split(/\s+/).filter(Boolean)
  const preset = new Set()
  const clean = words.map((word, index) => {
    if (word.endsWith(',')) {
      preset.add(index)
      return word.slice(0, -1)
    }
    return word
  })
  return { words: clean, preset }
}

export function joinWithCommas(words, gaps) {
  return words.map((word, index) => (gaps.has(index) ? word + ',' : word)).join(' ')
}
