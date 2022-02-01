
/** sometimes you just need to turn unknown into a string */
export function stringify (obj: unknown): string {
  return (new String(obj)).toString()
}