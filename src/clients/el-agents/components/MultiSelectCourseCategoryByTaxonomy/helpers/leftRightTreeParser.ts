import { hasFirstElement, isDefined, isEqual, isNil } from '@atoms/helpers'

export interface IInputMultiSelectOption<T = number> {
  id: T
  name: string
  children?: IInputMultiSelectOption<T>[]
  left: number
  right: number
  depth: number
}

interface IInputMultiSelectOptionWithChildren<T> extends IInputMultiSelectOption<T> {
  children: IInputMultiSelectOption<T>[]
}

function mapLeftRightChildrenToTree<T>(leftRightStructure: IInputMultiSelectOption<T>[], option: IInputMultiSelectOption<T>, depth: number): IInputMultiSelectOption<T>[] {
  // Find children
  const subOptions = leftRightStructure.filter((subOption) => {
    return (subOption.left > option.left && subOption.right < option.right && subOption.depth === depth)
  })

  return subOptions.map((subOption) => ({
    id: subOption.id,
    name: subOption.name,
    left: subOption.left,
    right: subOption.right,
    depth: subOption.depth,
    children: mapLeftRightChildrenToTree(leftRightStructure, subOption, depth + 1),
  }))
}

function hasSingleTopParentWithChildren<T>(options: IInputMultiSelectOption<T>[]): options is [IInputMultiSelectOptionWithChildren<T>] {
  if (isNil(options) || !hasFirstElement(options)) {
    return false
  }

  return (isDefined(options[0].children) && options[0].children.length > 0)
}

function filterForest <T>(options: IInputMultiSelectOption<T>[], predicate: (o: IInputMultiSelectOption<T>) => boolean): IInputMultiSelectOption<T>[] {
  // the forest is filtered if the trees are filtered
  return options.reduce((memo, option) => {
    const result = filterTree(option, predicate)

    if (!isNil(result)) {
      memo.push(result)
    }

    return memo
  }, [] as IInputMultiSelectOption<T>[])
}

/** this function is kiiiind of nonsense, it doesn't
 * exactly "filter the tree" as it claims. It kind of
 * does some pruning, removing things that don't pass the
 * predicate, but it might not remove everything that
 * doesn't pass.
 *
 * I've added a few exploratory unit tests to examine this behaviour
 */
function filterTree <T>(option: IInputMultiSelectOption<T>, predicate: (o: IInputMultiSelectOption<T>) => boolean): IInputMultiSelectOption<T> | undefined {
  // if this node satisfies the predicate, keep it
  if (predicate(option)) {
    return {
      ...option,
      children: isDefined(option.children) ? filterForest(option.children, predicate) : undefined,
    }
  }

  // a tree is filtered if its children are filtered
  const children = isDefined(option.children) ? filterForest(option.children, predicate) : undefined

  // if the whole tree fails the filter return nothing
  if (isNil(children) || children.length === 0) {
    return undefined
  }

  // otherwise return this new splendid tree
  return {
    ...option,
    children,
  }
}

export class NestedMultiSelectOptions<T> {
  private options: IInputMultiSelectOption<T>[]

  static fromLeftRightTreeStructure<T> (leftRightStructure: IInputMultiSelectOption<T>[]) {
    const isChildOf = (a: IInputMultiSelectOption<T>, b: IInputMultiSelectOption<T>) => a.left < b.left && a.right > b.right && b.depth === a.depth + 1
    function findParentNode (target: IInputMultiSelectOption<T>, nodes: IInputMultiSelectOption<T>[]) {
      return nodes.find((node) => isChildOf(node, target))
    }
    function isRootNode (target: IInputMultiSelectOption<T>, nodes: IInputMultiSelectOption<T>[]) {
      return isNil(findParentNode(target, nodes))
    }
    const optionsTopParent = leftRightStructure.filter((node) => isRootNode(node, leftRightStructure))
    const options = optionsTopParent
      .map((option): IInputMultiSelectOption<T> => ({
        id: option.id,
        name: option.name,
        left: option.left,
        right: option.right,
        depth: option.depth,
        children: mapLeftRightChildrenToTree(leftRightStructure, option, option.depth + 1),
      }))
    return new NestedMultiSelectOptions(options)
  }

  constructor(options: IInputMultiSelectOption<T>[]) {
    this.options = options

    // eslint-disable-next-line no-loops/no-loops
    while (hasSingleTopParentWithChildren(this.options)) {
      this.options = this.options[0].children
    }
  }

  public filter (predicate: (option: IInputMultiSelectOption<T>) => boolean) {
    return new NestedMultiSelectOptions(filterForest(this.options, predicate))
  }

  public findOptionsById(id: T): IInputMultiSelectOption<T> | undefined {
    // Find option name, iterate over all options
    // eslint-disable-next-line no-loops/no-loops
    for (let i = 0; i < this.options.length; i++) {
      const option = this.options[i]

      if (isNil(option)) {
        continue
      }

      // If there're some children, run this function recursively
      if ((isDefined(option.children)) && option.children.length > 0) {
        const optionName = findOptionById(id, option.children)
        if (isDefined(optionName)) {
          return optionName
        }
      }

      // Check actual option
      if (isEqual(option.id, id)) {
        return option
      }
    }

    // Nothing found
    return undefined
  }

  public getOptions() {
    return this.options
  }
}

export function mapLeftRightToTree<T>(leftRightStructure: IInputMultiSelectOption<T>[], idsToAdd?: T[]): IInputMultiSelectOption<T>[] {
  const options = NestedMultiSelectOptions.fromLeftRightTreeStructure(leftRightStructure)

  if (isNil(idsToAdd)) {
    return options.getOptions()
  }

  return options.filter((node) => idsToAdd.includes(node.id)).getOptions()
}

export function findOptionById<T>(id: T, options: IInputMultiSelectOption<T>[]): IInputMultiSelectOption<T> | undefined {
  return new NestedMultiSelectOptions(options).findOptionsById(id)
}
