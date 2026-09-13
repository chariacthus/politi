// Leitner-system med fem bokse. Boks 1 = lige lært/fejlet, boks 5 = sidder fast.
const INTERVALS_DAYS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16 }

export function nextDue(box) {
  const days = INTERVALS_DAYS[box] ?? 0
  return new Date(Date.now() + days * 86400000).toISOString()
}

export function updateItem(record, correct) {
  const prev = record || { box: 1, seen: 0, correct: 0, due: null, lastWrong: null }
  const box = correct ? Math.min(5, prev.box + 1) : 1
  return {
    box,
    seen: prev.seen + 1,
    correct: prev.correct + (correct ? 1 : 0),
    due: nextDue(box),
    lastWrong: correct ? prev.lastWrong : new Date().toISOString(),
  }
}

function isDue(record) {
  if (!record) return false
  if (!record.due) return true
  return new Date(record.due).getTime() <= Date.now()
}

/**
 * Sætter dagens pulje sammen: forfaldne gentagelser først (svageste boks først),
 * derefter uset stof. Rækkefølgen blandes til sidst, så det ikke bliver forudsigeligt.
 */
export function buildSession(pool, items, size = 15) {
  if (pool.length === 0) return []

  const due = []
  const fresh = []
  const rest = []

  for (const item of pool) {
    const record = items[item.id]
    if (!record) fresh.push(item)
    else if (isDue(record)) due.push(item)
    else rest.push(item)
  }

  due.sort((a, b) => (items[a.id]?.box ?? 1) - (items[b.id]?.box ?? 1))
  shuffle(fresh)
  shuffle(rest)

  // Hold plads til nyt stof, så en session ikke kun bliver gentagelser.
  const maxDue = Math.max(1, Math.ceil(size * 0.6))
  const picked = [...due.slice(0, maxDue)]
  for (const item of fresh) {
    if (picked.length >= size) break
    picked.push(item)
  }
  for (const item of [...due.slice(maxDue), ...rest]) {
    if (picked.length >= size) break
    picked.push(item)
  }

  return shuffle(picked)
}

export function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

/** Statistik pr. emne: { topic, lang, seen, correct, rate, total } — svageste først. */
export function topicStats(pool, items) {
  const byTopic = new Map()

  for (const item of pool) {
    const key = item.lang + '|' + item.topic
    const entry = byTopic.get(key) || { topic: item.topic, lang: item.lang, seen: 0, correct: 0, total: 0, mastered: 0 }
    entry.total += 1
    const record = items[item.id]
    if (record) {
      entry.seen += record.seen
      entry.correct += record.correct
      if (record.box >= 4) entry.mastered += 1
    }
    byTopic.set(key, entry)
  }

  return [...byTopic.values()]
    .map((entry) => ({ ...entry, rate: entry.seen ? entry.correct / entry.seen : null }))
    .sort((a, b) => {
      if (a.rate === null && b.rate === null) return 0
      if (a.rate === null) return 1
      if (b.rate === null) return -1
      return a.rate - b.rate
    })
}

export function boxCounts(pool, items) {
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const item of pool) {
    const record = items[item.id]
    counts[record ? record.box : 0] += 1
  }
  return counts
}
