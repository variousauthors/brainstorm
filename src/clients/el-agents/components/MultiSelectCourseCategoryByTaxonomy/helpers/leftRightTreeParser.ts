import { hasFirstElement, isDefined, isNil } from '@atoms/helpers'

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

  public getOptions() {
    return this.options
  }
}