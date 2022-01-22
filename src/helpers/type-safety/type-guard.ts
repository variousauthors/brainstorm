import { stringify } from '../toString'
import { isDefined, isUndefined } from '../safeNavigation'
import { JSObject, TypeGuard, TypeGuide, TypeObject } from './metadata'
import { assert } from '../assert'

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/** for when you want to find out if something is a number */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

/** for when you actually want to find out if something is a number */
export function isActuallyNumber(value: unknown): value is number {
  return !isNaN(value as number) && typeof value === 'number'
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object'
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date
}

export const { isArray } = Array

// eslint-disable-next-line @typescript-eslint/ban-types
function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

type Mapped<T, U> = T extends string ? {
  [key: string]: U
} : {
  [key: number]: U
}

export const hasIndexedType = <T, U>(
  indexType: TypeGuard<T>,
  valueType: TypeGuard<U>,
) => (obj: JSObject): obj is Mapped<T, U> => Object.keys(obj)
    .every((key: string) => indexType(key) && valueType(obj[key]))

export const isMapped = <T extends JSObject>(guard: TypeGuard<T>) => hasIndexedType(isString, guard)

export function array<T>(
  rule: TypeGuard<T> | TypeObject,
): TypeGuard<T[]> {
  return (value: unknown): value is T[] => {
    if (!Array.isArray(value)) {
      return false
    }

    if (isFunction(rule)) {
      return value.every(rule)
    }

    return value.every(typeGuard(rule))
  }
}

export function optional <T>(
  rule: TypeGuard<T> | [TypeGuard<T>] | TypeObject,
): TypeGuard<T | undefined> {
  return (value: unknown): value is T | undefined => {
    if (isUndefined(value)) {
      return true
    }

    if (isFunction(rule)) {
      return isUndefined(value) || rule(value)
    }

    if (isArray(rule)) {
      if (isArray(value)) {
        return value.every(rule[0])
      }

      return false
    }

    if (isObject(value)) {
      return isUndefined(value) || typeGuard(rule)(value)
    }

    return false
  }
}

const failRule = <T extends JSObject>(_rule: TypeGuard<T>, key: string, subject: unknown): void => {
  const name = isDefined(_rule.name) ? _rule.name : '(anonymous typeguard)'

  if (isUndefined(subject)) {
    // eslint-disable-next-line no-console
    console.warn(`Runtime typeguard failed: required property ${key} was nil: ${stringify(subject)}`)
  }

  if (typeof subject === 'object') {
    // eslint-disable-next-line no-console
    console.warn(`Runtime typeguard failed: ${key} failed [${name}]`)
  }

  // eslint-disable-next-line no-console
  console.warn(`Runtime typeguard failed: ${key} failed [${name}] (found ${typeof subject} ${stringify(subject)} instead)`)
}

/** This function can be expensive, since it tries to prove the types of nested objects and arrays
 * don't use it anywhere you expect it to be called often!
 * (or don't make assertions about array types beyond `isArray`)
*/
export const getRule = <T extends JSObject>(rules: TypeObject) => (key: string): TypeGuard<T> => {
  const rule = rules[key]
  assert(isDefined(rule))
  return recoverRule(rule)
}

export function recoverRule <T>(rule: TypeGuard<T> | [TypeGuard<T>] | TypeObject): TypeGuard<T> {
  if (isFunction(rule)) {
    return rule
  }

  if (isArray(rule)) {
    const arrayRule = rule[0]

    return (value: unknown): value is T => {
      if (!isArray(value)) {
        return false
      }

      return value.every(recoverRule(arrayRule))
    }
  }

  if (isObject(rule)) {
    return typeGuard(rule)
  }

  throw new Error('TypeObject keys must be Array, TypeObject, or Function')
}

function typeGuard<T>(rules: TypeObject): TypeGuard<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (obj: any): obj is T => {
    if (isUndefined(obj)) {
      return false
    }

    const ruleDict = getRule(rules)

    return Object.keys(rules).every((key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const subject = obj[key]
      const rule = recoverRule(ruleDict(key))
      const result = rule(subject)

      if (!result) {
        failRule(rule, key, subject)
      }

      return result
    }, Object.keys(rules))
  }
}

export function buildTypeGuard<T>(guide: TypeGuide<T, keyof T>): TypeGuard<T>{
  return typeGuard(guide)
}
