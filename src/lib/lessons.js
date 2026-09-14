// Lektionens maskinrum: hvilke opgaver kommer med, hvordan de blandes, og
// hvad de giver af point. Variation er et selvstændigt mål — to opgaver af
// samme type må ikke stå efter hinanden, hvis det kan undgås.

import { dictations } from '../data/dictation.js'
import { daItems } from '../data/grammar.da.js'
import { enItems } from '../data/grammar.en.js'
import { allLessons, ranks, stages, units, unitsInStage } from '../data/path.js'
import { policeItems, policeTopics } from '../data/police.js'
import { rules } from '../data/rules.js'
import { shuffle } from './srs.js'

const BANKS = {
  police: policeItems,
  'grammar:da': daItems,
  'grammar:en': enItems,
}

/** "police:magt" og "grammar:da:kommatering" slås op i den rigtige bank. */
export function resolveSource(key) {
  const parts = key.split(':')
  if (parts[0] === 'police') {
    return policeItems.filter((item) => item.topic === parts[1])
  }
  if (parts[0] === 'grammar') {
    const bank = BANKS['grammar:' + parts[1]] || []
    return bank.filter((item) => item.topic === parts[2])
  }
  return []
}

export function lessonPool(lesson) {
  // En lektion kan have sine opgaver med direkte — det bruger genopfriskningen
  // og niveautesten, hvor udvalget ikke kommer fra ét emne.
  if (lesson.items) return lesson.items
  const pool = []
  for (const source of lesson.sources || []) pool.push(...resolveSource(source))
  return pool
}

/**
 * Hvor svært skal stoffet være lige nu? Niveauet regnes ud af, hvordan det
 * er gået i netop de emner, lektionen trækker fra: går det godt, kommer de
 * sværere opgaver frem; driller det, bliver vi på det lette niveau.
 */
export function levelFor(pool, items = {}) {
  let seen = 0
  let correct = 0
  let mastered = 0
  for (const item of pool) {
    const record = items[item.id]
    if (!record) continue
    seen += record.seen || 0
    correct += record.correct || 0
    if ((record.box || 1) >= 4) mastered += 1
  }
  if (seen < 4) return 1
  const rate = correct / seen
  const share = pool.length ? mastered / pool.length : 0
  if (rate >= 0.85 && share >= 0.45) return 3
  if (rate >= 0.7) return 2
  return 1
}

function isDue(record) {
  if (!record) return false
  if (!record.due) return true
  return new Date(record.due).getTime() <= Date.now()
}

/**
 * Sætter lektionen sammen: forfaldne gentagelser og nyt stof først, derefter
 * det øvrige — og til sidst spredes typerne, så to ens ikke står i træk.
 */
export function buildLesson(lesson, items = {}, { voice = false } = {}) {
  let pool = lessonPool(lesson)
  if (!voice) pool = pool.filter((item) => !item.voice)
  if (pool.length === 0) return []

  const target = lesson.level || levelFor(pool, items)

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
  // Nyt stof tages tættest på det niveau, brugeren er på lige nu — aldrig
  // mere end ét trin over, så det bliver udfordrende og ikke uoverskueligt.
  const near = (item) => Math.abs((item.level || 1) - target) + ((item.level || 1) > target + 1 ? 4 : 0)
  fresh.sort((a, b) => near(a) - near(b))
  rest.sort((a, b) => near(a) - near(b))

  const size = Math.min(lesson.size, pool.length)
  const picked = []
  const take = (list) => {
    for (const item of list) {
      if (picked.length >= size) return
      picked.push(item)
    }
  }
  take(due.slice(0, Math.ceil(size * 0.5)))
  take(fresh)
  take(due)
  take(rest)

  return spreadTypes(shuffle(picked))
}

/** Bytter rundt, så den samme opgavetype ikke kommer to gange i træk. */
export function spreadTypes(list) {
  const out = [...list]
  for (let i = 1; i < out.length; i++) {
    if (out[i].type !== out[i - 1].type) continue
    const swap = out.findIndex((item, index) => index > i && item.type !== out[i - 1].type)
    if (swap > -1) {
      const temp = out[i]
      out[i] = out[swap]
      out[swap] = temp
    }
  }
  return out
}

export function scoreLesson(results, size) {
  // Sprunget over tæller hverken for eller imod — opgaven er bare ikke besvaret.
  const answered = results.filter((entry) => !entry.skipped)
  const correct = answered.filter((entry) => entry.correct).length
  const mistakes = answered.length - correct
  const perfect = mistakes === 0
  const skipped = results.length - answered.length
  const xp = correct * 10 + 15 + (perfect && skipped === 0 ? 25 : 0)
  const full = perfect && skipped === 0
  const stars = full ? 3 : mistakes <= Math.max(1, Math.round(size * 0.2)) ? 2 : 1
  return { correct, mistakes, skipped, asked: answered.length, xp, stars, perfect: full }
}

export function rankFor(xp) {
  let current = ranks[0]
  let next = null
  for (const rank of ranks) {
    if (xp >= rank.xp) current = rank
    else {
      next = rank
      break
    }
  }
  return { current, next, into: xp - current.xp, span: next ? next.xp - current.xp : 0 }
}

/**
 * En lektion er åben, når den forrige er klaret mindst én gang — eller når
 * enheden er låst op med en springtest.
 */
export function lessonState(lessonId, lessons = {}, unlocked = {}) {
  const index = allLessons.findIndex((lesson) => lesson.id === lessonId)
  if (index < 0) return 'locked'
  const lesson = allLessons[index]
  const record = lessons[lessonId]
  if (record?.stars > 0) return 'done'
  if (index === 0 || unlocked[lesson.unitId]) return 'open'
  const previous = lessons[allLessons[index - 1].id]
  return previous?.stars > 0 ? 'open' : 'locked'
}

/** Et trin er klaret, når alle dets enheder er det. */
export function stageProgress(stageId, lessons = {}) {
  const list = unitsInStage(stageId).flatMap((unit) => unit.lessons)
  const done = list.filter((lesson) => lessons[lesson.id]?.stars > 0).length
  return { done, total: list.length, complete: done === list.length }
}

/** Trinnet er åbent, så snart én af dets lektioner kan spilles. */
export function stageLocked(stageId, lessons = {}, unlocked = {}) {
  return unitsInStage(stageId).every((unit) => unitLocked(unit, lessons, unlocked))
}

export function currentStage(lessons = {}, unlocked = {}) {
  const next = nextLesson(lessons, unlocked)
  if (!next) return stages[stages.length - 1]
  const unit = units.find((entry) => entry.id === next.unitId)
  return stages.find((stage) => stage.id === unit?.stageId) || stages[0]
}

export function nextLesson(lessons = {}, unlocked = {}) {
  return allLessons.find((lesson) => lessonState(lesson.id, lessons, unlocked) === 'open') || null
}

/** Enheden er låst, hvis ingen af dens lektioner kan åbnes. */
export function unitLocked(unit, lessons = {}, unlocked = {}) {
  return unit.lessons.every((lesson) => lessonState(lesson.id, lessons, unlocked) === 'locked')
}

/** Enhederne til og med den valgte — dem en bestået springtest åbner. */
export function unitsUpTo(unitId) {
  const index = units.findIndex((unit) => unit.id === unitId)
  if (index < 0) return []
  return units.slice(0, index + 1).map((unit) => unit.id)
}

/** Springtesten: et bredt udsnit af hele enhedens stof. */
export const JUMP_SIZE = 12
export const JUMP_PASS = 0.8

export function jumpTest(unit) {
  const sources = []
  for (const lesson of unit.lessons) {
    for (const source of lesson.sources) if (!sources.includes(source)) sources.push(source)
  }
  return {
    id: 'jump-' + unit.id,
    unitId: unit.id,
    title: 'Springtest: ' + unit.title,
    sources,
    size: JUMP_SIZE,
    jump: true,
  }
}

/**
 * De opgaver, der driller lige nu: dem der er svaret forkert på sidst, og
 * dem der er faldet ned i de nederste bokse. Bruges til genopfriskningen.
 */
export function weakItems(items = {}, { voice = false, limit = 10 } = {}) {
  const all = [...policeItems, ...daItems, ...enItems].filter((item) => voice || !item.voice)
  const scored = []
  for (const item of all) {
    const record = items[item.id]
    if (!record || !record.seen) continue
    const rate = record.correct / record.seen
    const box = record.box || 1
    if (box >= 4 && rate >= 0.85) continue
    // Jo lavere boks og træfprocent, jo før skal opgaven op igen.
    scored.push({ item, weight: box + rate * 2 + (record.lastWrong ? -1.5 : 0) })
  }
  scored.sort((a, b) => a.weight - b.weight)
  return scored.slice(0, limit).map((entry) => entry.item)
}

/** Genopfriskningen er en almindelig lektion bygget af dine svage punkter. */
export function refreshLesson(items = {}, options = {}) {
  const picked = weakItems(items, { ...options, limit: options.limit || 8 })
  if (picked.length < 4) return null
  return {
    id: 'refresh',
    title: 'Genopfriskning',
    refresh: true,
    size: picked.length,
    sources: [],
    items: spreadTypes(shuffle(picked)),
  }
}

/* ---------------- Niveautest ----------------
   En kort test, der finder ud af, hvor du skal begynde. Den spænder fra det
   helt enkle til det professionelle, og den kan springes over — så starter
   du bare fra begyndelsen, hvilket aldrig er et dårligt sted at starte. */

const PLACEMENT_SOURCES = [
  // trin 1
  ['grammar:da:hverdag', 1],
  ['grammar:en:basis', 1],
  ['grammar:en:tal-tid', 1],
  ['grammar:da:praecis', 1],
  // trin 2
  ['grammar:da:hoeflig', 2],
  ['grammar:da:kommatering', 2],
  ['grammar:en:person', 2],
  ['grammar:da:sammensatte', 2],
  // trin 3
  ['police:principper', 3],
  ['police:magt', 3],
  // trin 4
  ['grammar:da:rapportsprog', 4],
  ['grammar:en:skrift', 4],
]

export const PLACEMENT_SIZE = PLACEMENT_SOURCES.length

/** Én opgave fra hvert område, i stigende sværhedsgrad. */
export function placementTest() {
  const picked = []
  for (const [source, tier] of PLACEMENT_SOURCES) {
    const pool = resolveSource(source).filter((item) => !item.voice)
    if (pool.length === 0) continue
    // Vælg en opgave, der svarer til trinnets sværhedsgrad.
    const wanted = Math.min(3, Math.max(1, tier === 4 ? 3 : tier))
    const sorted = [...pool].sort((a, b) => Math.abs((a.level || 1) - wanted) - Math.abs((b.level || 1) - wanted))
    const choice = sorted[Math.floor(Math.random() * Math.min(3, sorted.length))]
    if (choice && !picked.includes(choice)) picked.push({ ...choice, tier })
  }
  return {
    id: 'placement',
    title: 'Niveautest',
    placement: true,
    size: picked.length,
    sources: [],
    items: picked,
  }
}

/**
 * Resultatet placerer dig. Vi er bevidst forsigtige: hellere starte et trin
 * for tidligt end at stå med stof, der ikke er dækket ind.
 */
export function placementResult(results) {
  const answered = results.filter((entry) => !entry.skipped)
  const correct = answered.filter((entry) => entry.correct)
  const share = answered.length ? correct.length / answered.length : 0
  // Højeste trin, hvor mindst to tredjedele sad rigtigt.
  let reached = 0
  for (const tier of [1, 2, 3]) {
    const inTier = answered.filter((entry) => (entry.item.tier || 1) === tier)
    const hit = inTier.filter((entry) => entry.correct).length
    if (inTier.length > 0 && hit / inTier.length >= 0.67) reached = tier
    else break
  }
  const stageIds = stages.slice(0, reached).map((stage) => stage.id)
  const unitIds = stageIds.flatMap((id) => unitsInStage(id).map((unit) => unit.id))
  const startStage = stages[Math.min(reached, stages.length - 1)]
  return {
    correct: correct.length,
    asked: answered.length,
    share,
    reached,
    unitIds,
    startStage,
  }
}

/** Hvilken enhed hører lektionen til? */
export function unitOf(lessonId) {
  return units.find((unit) => unit.lessons.some((lesson) => lesson.id === lessonId)) || null
}

export function pathProgress(lessons = {}) {
  const done = allLessons.filter((lesson) => lessons[lesson.id]?.stars > 0).length
  const stars = allLessons.reduce((sum, lesson) => sum + (lessons[lesson.id]?.stars || 0), 0)
  return { done, total: allLessons.length, stars, maxStars: allLessons.length * 3 }
}

export function unitProgress(unit, lessons = {}) {
  const done = unit.lessons.filter((lesson) => lessons[lesson.id]?.stars > 0).length
  return { done, total: unit.lessons.length }
}

/**
 * Stoffet bag en lektion, skrevet ud som noget, man kan læse: hovedregel,
 * huskeregel og eksempler. Kilderne slås op i regelbogen og i den
 * politifaglige bank, så forklaringen og øvelsen aldrig kan komme i utakt.
 */
export function teachFor(lesson) {
  const seen = new Set()
  const entries = []
  for (const source of lesson.sources || []) {
    const parts = source.split(':')
    if (parts[0] === 'police') {
      const topic = policeTopics.find((entry) => entry.id === parts[1])
      if (!topic || seen.has(topic.id)) continue
      seen.add(topic.id)
      entries.push({
        id: 'police:' + topic.id,
        kind: 'Politifag',
        lang: 'da',
        title: topic.title,
        rule: topic.rule,
        trick: topic.trick,
        examples: [],
        points: (topic.points || []).slice(0, 4),
      })
      continue
    }
    if (parts[0] === 'grammar') {
      const rule = rules.find((entry) => entry.id === parts[2] && entry.lang === parts[1])
      if (!rule || seen.has(rule.id)) continue
      seen.add(rule.id)
      const examples = []
      for (const section of rule.sections || []) {
        for (const example of section.examples || []) {
          if (examples.length < 3) examples.push(example)
        }
      }
      entries.push({
        id: 'grammar:' + rule.id,
        kind: rule.lang === 'en' ? 'Engelsk' : 'Dansk',
        lang: rule.lang,
        title: rule.title,
        rule: rule.rule,
        trick: rule.trick,
        examples,
        points: [],
      })
    }
  }
  // Et tjek på tværs af en hel enhed skal ikke starte med fire regelkort.
  return lesson.checkpoint ? entries.slice(0, 1) : entries.slice(0, 2)
}

export { units, stages, unitsInStage, allLessons, ranks, dictations }
