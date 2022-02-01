export function isDefined<T>(obj: T): obj is Exclude<T, undefined> {
  return obj !== undefined
}

export function isUndefined<T>(obj: T | undefined): obj is undefined {
  return !isDefined(obj)
}