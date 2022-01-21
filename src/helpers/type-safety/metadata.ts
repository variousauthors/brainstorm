export type JSObject = Record<string | number | symbol, unknown>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeGuard<T> = (value: any) => value is T

// a weekly typed guide for invoking typeguards
export type TypeObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: TypeObject | [TypeGuard<any>] | TypeGuard<any>
}

// a very strongly typed guide for making typeGuards
// TODO one last thing we could do is have the type be maybeTypeGuard or TypeGuard
// dependon on whether the fiels is optional or not (no clue how to do this)
export type TypeGuide<T, K extends keyof T> = {
  [key in K]: TypeGuide<T[key], keyof T[key]> | [TypeGuard<T[key]>] | TypeGuard<T[key]>
}
