export function assertNever(x: never): never {
  throw new Error(`assertNever; Assertion failed with ${x}`)
}