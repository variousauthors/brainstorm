export function assertNever(_x: never): never {
  throw new Error('assertNever; Assertion failed')
}