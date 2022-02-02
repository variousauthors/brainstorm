import { isNil } from '@atoms/helpers'

export function isNode(obj?: unknown): obj is Node {
  return obj instanceof Node
}

/** returns true if the event target is indeed a dom node, and if the
 * given node contains the event target
 * The type EventTarget | null comes from the browser */
// eslint-disable-next-line @typescript-eslint/ban-types
export const doesDOMNodeContainEventTarget = (target?: EventTarget | null, node?: Node | null): boolean => {
  if (isNil(target) || isNil(node)) {
    return false
  }

  if (!isNode(target)) {
    return false
  }

  return node.contains(target)
}
