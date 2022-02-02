
export interface INode {
  left: number
  right: number
  depth: number
  taxonomyId: number
}

export function isDescendentOf  <T extends INode>(target: T, ancestor: T) {
  return ancestor.left < target.left && target.right < ancestor.right
}

export function isDescendentOfSome  <T extends INode>(target: T, categories: T[]) {
  return categories.some((ancestor) => isDescendentOf(target, ancestor))
}

export function getPath  <T extends INode>(target: T, categories: T[]) {
  return getAncestors(target, categories).concat(target)
}

export function getAncestors  <T extends INode>(target: T, categories: T[]) {
  return categories.filter((category) => category.left < target.left && target.right < category.right)
}

export function isRootNode <T extends INode>(target: T) {
  return target.depth === 0
}

/** @TODO this check _should_ be target.left === target.right - 1 but out db representation of the nested set model
 * currently does not support this assumption */
export function isLeaf <T extends INode>(target: T, categories: T[]) {
  return categories.every((category) => !isChildOf(category, target))
}

export function isChildOf  <T extends INode>(target: T, potentialParent: T) {
  return potentialParent.left < target.left && target.right < potentialParent.right && potentialParent.depth === target.depth - 1
}
