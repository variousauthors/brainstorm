import { findParentItem } from '../LayeredMenuDropdownHelper'

interface ITestItem {
  value: string
  submenu?: ITestItem[]
}

const testIt = (target: ITestItem, tree: ITestItem, expected: ITestItem | null) => {
  const actual = findParentItem<ITestItem>(target, tree)

  expect(actual).toBe(expected)
}

describe('findParentItem', () => {
  it('returns null when target is itself', () => {
    const tree = {
      label: '__root',
      value: '__root',
      submenu: []
    }
    const actual = findParentItem(tree, tree)

    testIt(tree, tree, null)
  })

  it('returns root when at first level', () => {
    const item = {
      label: 'l1a',
      value: 'l1a',
      submenu: []
    }

    const tree = {
      label: '__root',
      value: '__root',
      submenu: [item]
    }
    const actual = findParentItem(item, tree)

    testIt(item, tree, tree)
  })

  it('returns null if not found at first level', () => {
    const item = {
      label: 'l1a',
      value: 'l1a',
      submenu: []
    }

    const anotherItem = {
      label: 'l1b',
      value: 'l1b'
    }

    const root = {
      label: '__root',
      value: '__root',
      submenu: [anotherItem]
    }
    const actual = findParentItem(item, root)

    testIt(item, root, null)
  })

  it('returns parent when at 2nd level', () => {
    const secondLevelItem = {
      label: 'l2a',
      value: 'l2a',
      submenu: []
    }
    const item = {
      label: 'l1a',
      value: 'l1a',
      submenu: [secondLevelItem]
    }

    const root = {
      label: '__root',
      value: '__root',
      submenu: [item]
    }

    testIt(secondLevelItem, root, item)
  })

  it('returns parent when at 2nd level, as second item', () => {
    const secondLevelItem = {
      label: 'l2a',
      value: 'l2a'
    }

    const anotherSecondLevelItem = {
      label: 'l2b',
      value: 'l2b'
    }

    const item = {
      label: 'l1a',
      value: 'l1a',
      submenu: [secondLevelItem, anotherSecondLevelItem]
    }

    const root = {
      label: '__root',
      value: '__root',
      submenu: [item]
    }

    testIt(anotherSecondLevelItem, root, item)
  })

  it('returns null when not found anywhere', () => {
    const secondLevelItem = {
      label: 'l2a',
      value: 'l2a'
    }

    const anotherSecondLevelItem = {
      label: 'l2b',
      value: 'l2b'
    }

    const item = {
      label: 'l1a',
      value: 'l1a',
      submenu: [secondLevelItem]
    }

    const root = {
      label: '__root',
      value: '__root',
      submenu: [item]
    }

    testIt(anotherSecondLevelItem, root, null)
  })
})
