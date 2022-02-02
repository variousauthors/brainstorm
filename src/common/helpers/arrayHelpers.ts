import { assert, isDefined } from '@atoms/helpers'

export const shallowCopyArray = (input: unknown[]) => [...input]

export function immutableReplace<T>(collection: T[], previous: T, next: T): T[] {
  return collection.map((item) => {
    if (item === previous)
      return next
    else
      return item
  })
}

export function immutableRemove<T>(collection: T[], target: T): T[] {
  return collection.filter((item) => {
    if (item === target)
      return false
    else
      return true
  })
}

export function isInBounds <T>(collection: T[], index: number) {
  return index > lastIndex(collection)
}

export function lastIndex <T>(collection: T[]) {
  return collection.length - 1
}

export function immutablySet <T>(collection: T[], index: number, value: T) {
  return adjust(index, () => value, collection)
}

function adjust<T>(idx: number, fn: (a: T) => T, list: readonly T[]): readonly T[] {
  if (idx >= list.length || idx < -list.length) {
    return list
  }

  const start = idx < 0 ? list.length : 0
  const _idx = start + idx
  const _list = list.concat()
  const el = list[_idx]
  assert(isDefined(el))
  _list[_idx] = fn(el)
  return _list
}