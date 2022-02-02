import { assert, defaultTo, flattenDeep, isDefined, isEmpty, isNil, last, sortBy } from '@atoms/helpers'
import { ILayeredMenuDropdownMenu, ILayeredMenuDropdownMenuItem } from '../metadata'
import { IInputMultiSelectOption } from './leftRightTreeParser'
import { toSelectOption } from './toSelectOption'

type TreeNode = {
  id: number,
  name: string,
  left: number,
  right: number,
  depth: number,
  children?: TreeNode[]
}

type TreeNodeWithChildren = TreeNode & {
  children: TreeNode[]
}

type Forest = TreeNode[]

/** @returns true if and only if descendant is a descendant of ancestor */
const isDescendant = (ancestor: TreeNode, descendant: TreeNode) => {
  return ancestor.left < descendant.left && ancestor.right > descendant.right
}

/** @returns true if and only if child is a direct child of parent */
const isChild = (parent: TreeNode, child: TreeNode) => {
  return isDescendant(parent, child) && parent.depth === child.depth - 1
}

/** given a tree and a node
 * findParent returns a child in the given tree
 * that is the parent of the given leftright node
 *
 * @returns a TreeNode that is a valid parent for the given node or undefined
 */
const findParent = (tree: TreeNode, node: TreeNode): TreeNode | undefined => {
  if (tree.depth > node.depth) {
    return undefined
  }

  if (isChild(tree, node)) {
    return tree
  }

  if (isNil(tree.children) || tree.children.length === 0) {
    return undefined
  }

  return tree.children.reduce((memo, child) => {
    const found = findParent(child, node)
    return isDefined(found) ? found : memo
  }, undefined as TreeNode | undefined)
}

/** Tools for going the other direaction */
const hasChildren = (node: TreeNode): node is TreeNodeWithChildren => {
  return !(isNil(node.children) || node.children.length === 0)
}

/** given a tree (a node with an array of children)
 * serializeNode returns a list of nodes
 * annotated with left, right and depth properties
 * so that the list can later be reconstructed into
 * a new tree isomorphic to the given tree
 *
 * @param node the tree to serialize
 * @param index the index at which to start labelling
 * @param depth the depth at which to start labelling
 * @param getNextIndex a function that returns the next index given the current index
*/
const serializeNode = (node: TreeNode, index: number, depth: number, getNextIndex: (index: number) => number): TreeNode[] => {
  const head: TreeNode = {
    id: node.id,
    name: node.name,
    left: index,
    right: -1, // we are constructing a head node
    depth: depth,
  }

  if (!hasChildren(node)) {
    head.right = getNextIndex(head.left)

    return [head]
  }

  // we know the node has children if it is not a leaf
  let nextIndex = getNextIndex(index)
  const children = node.children.reduce((memo, n) => {
    if (memo.length > 0) {
      const lastChild = getLastChild(memo)
      assert(isDefined(lastChild))
      nextIndex = getNextIndex(lastChild.right)
    }

    memo.push(serializeNode(n, nextIndex, depth + 1, getNextIndex))

    return memo
  }, [] as TreeNode[][])

  const lastChild = getLastChild(children)
  assert(isDefined(lastChild))

  head.right = getNextIndex(lastChild.right)

  const flat = flattenDeep(children)

  return [head].concat(flat)
}

function getLastChild(nodes: TreeNode[][]): TreeNode | undefined {
  return defaultTo(last(nodes), [])[0]
}

const getLeavesOfTree = (tree: TreeNode): TreeNode[] => {
  if (!hasChildren(tree)) {
    return [tree]
  }

  return getLeaves(tree.children)
}

export function getLeaves (forest: Forest): TreeNode[] {
  return forest.reduce((memo, tree) => {
    return memo.concat(getLeavesOfTree(tree))
  }, [] as TreeNode[])
}

/** given a forest of nodes constructed with buildForest
 * labelNodes gives us back a flat list of labelled leftright nodes
 */
export const serialize = (nodes: Forest, getNextIndex = (index: number) => index + 1) => {
  const base: TreeNode = {
    id: -1,
    name: 'base',
    left: -1,
    right: -1,
    depth: -1,
    children: nodes,
  }

  return serializeNode(base, 0, -1, getNextIndex).slice(1)
}

/** given a list of leftright nodes
 * buildForest returns the forest of trees
 * described by the given nodes
 */
export const deserialize = (data: TreeNode[]): Forest => {
  const BASE: TreeNode = { id: 0, name: 'void', left: -1, right: Number.MAX_SAFE_INTEGER, depth: -1, children: [] }

  const parsed = data.reduce((tree, node) => {
    const parent = findParent(tree, node)

    if (isDefined(parent)) {
      if (isNil(parent.children)) {
        parent.children = []
      }

      parent.children.push({
        ...node,
        children: [],
      })
    }

    return tree
  }, BASE)

  if (!hasChildren(parsed)) {
    return []
  }

  return parsed.children
}

export const createMenuItemsFromNestedOptions = (nestedOptions: IInputMultiSelectOption<number>[]): ILayeredMenuDropdownMenu => {
  const result = nestedOptions.map<ILayeredMenuDropdownMenuItem>((option) => {
    if (isNil(option.children) || isEmpty(option.children)) {
      return toSelectOption(option)
    } else {
      return {
        ...toSelectOption(option),
        submenu: createMenuItemsFromNestedOptions(option.children),
      }
    }
  })
  return result
}

/**
 * sort in an order defined by us
 *
 * This is intended for the root programs.
 * order defined from top to bottom
 * this list was generated manually by number of courses under each root program, highest to lowest
 * Anything not defined is placed lowest
 */
const RootProgramOrderDefinition = [
  'BUSINESS,MARKETING,MANAGEMENT',
  'MEDICINE,HEALTH,SPORTS',
  'ART_DIGITAL_MEDIA_AND_DESIGN',
  'ENGINEERING,TECHNOLOGY',
  'HOSPITALITY_AND_TOURISM',
  'COMPUTER_SCIENCE,IT',
  'HUMANITIES,SOCIAL_SCIENCES',
  'APPLIED_SCIENCES,MATHEMATICS',
  'EDUCATION,TRAINING',
  'ACCOUNTING,ECONOMICS,FINANCE',
  'COMMUNITY_SERVICES',
  'FASHION_AND_BEAUTY',
  'LAW',
  'AGRICULTURE,FORESTRY',
  'PERFORMING_ARTS',
  'INTERNATIONAL_FOUNDATION',
  'INTERNSHIP',
  'VOLUNTEER',
]
const RootProgramOrderWeightDict = RootProgramOrderDefinition.reduce<{[key: string]: number}>((dict, codeName, index) => {
  dict[codeName] = index
  return dict
}, {})
const ramdaSortByFn = (option: IInputMultiSelectOption) => defaultTo(99999, RootProgramOrderWeightDict[option.name])
export const sortNestedOptionsCourseCategoryRootPrograms = (nestedOptions: IInputMultiSelectOption<number>[]): IInputMultiSelectOption<number>[] => {
  return sortBy(nestedOptions, ramdaSortByFn)
}
