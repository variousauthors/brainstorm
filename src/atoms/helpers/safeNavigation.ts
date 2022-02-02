import _ from 'lodash'

/** here we are checking explicitly for null because 3rd party libraries or
 * apis might give us null values */

// eslint-disable-next-line @typescript-eslint/ban-types
export function isDefined<T>(obj: T): obj is Exclude<T, undefined | null> {
  // eslint-disable-next-line no-null/no-null
  return obj !== undefined && obj !== null
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isNil<T>(obj: T | undefined | null): obj is undefined | null {
  return !isDefined(obj)
}

// something is empty if it has a length property = 0 OR if lodash says so
export function isEmpty<T extends { length: number }>(value: T) {
  return isDefined(value) && (value.length === 0 || _.isEmpty(value))
}

/** safelyCallEffect
 *
 * given a possibly undefined, possibly effectful, unary, void function and
 * a single value, safelyCallEffect calls the function with the value.
 *
 * This is useful for calling handlers passed from the parent. A handler is
 * almost never necessary for a component to render, and thus should be an
 * optional parameter. Forcing the user to check the handler for null everywhere
 * is annoying though. So we can use safelyCallEffect.
 *
 ```
 handleChange (value: string) {
   safelyCallEffect(this.props.onChange, value)
 }
 ```
 *
 */
export function safelyCallEffect <T>(f: ((a: T) => void) | undefined, x: T): void {
  if (isDefined(f)) {
    return f(x)
  }
}

/** same as safelyCallEffect, but for nullary functions */
export function safelyCallEffect0 (f?: (() => void)): void {
  if (isDefined(f)) {
    return f()
  }
}

export function hasFirstElement<T>(arr: T[]): arr is [T] {
  return arr.length >= 1
}
