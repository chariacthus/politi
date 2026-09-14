// Lektionens maskinrum: hvilke opgaver kommer med, hvordan de blandes, og
// hvad de giver af point. Variation er et selvstændigt mål — to opgaver af
// samme type må ikke stå efter hinanden, hvis det kan undgås.

import { dictations } from '../data/dictation.js'
import { daItems } from '../data/grammar.da.js'
import { enItems } from '../data/grammar.en.js'
import { allLessons, ranks, units } from '../data/path.js'
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
  const pool = []
  for (const source of lesson.sources) pool.push(...resolveSource(source))
  return pool
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

export { units, allLessons, ranks, dictations }
