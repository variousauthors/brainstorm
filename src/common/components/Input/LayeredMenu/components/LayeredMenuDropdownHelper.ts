import { assert, defaultTo, isDefined } from '@atoms/helpers'

interface IWithSubmenu<T> {
  submenu?: T[]
}

/**
 * a breadth-first-search implementation
 * @param targetItem
 * @param tree
 */
export const findParentItem = <T extends IWithSubmenu<T>>(targetItem: T, tree: T): T | undefined => {
  const stack = [tree]

  // eslint-disable-next-line no-loops/no-loops
  while (stack.length > 0) {
    // use shift for first-in-first-out to achieve breadth-first
    const currentItem = stack.pop()
    assert(isDefined(currentItem))

    const submenu = defaultTo(currentItem.submenu, [])

    if (isDefined(submenu.find((child) => child === targetItem))) return currentItem

    stack.push(...submenu) // use push to add to top of the stack, which will be processed last in the loop (first-in-first-out)
  }

  return undefined
}
