export function assert(condition: any, msg: string = 'Assertion failed'): asserts condition {
  if (!condition) {
    throw new Error(msg);
  }
}