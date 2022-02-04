import * as React from 'react'

import { isDefined, isNil } from '@atoms/helpers'
import { Nothing, Words } from '@atoms/components'

import { ILayeredMenuDropdownMenu, ILayeredMenuDropdownMenuItem } from '../metadata'
import { findParentItem } from './LayeredMenuDropdownHelper'
import { DropdownContainer, MenuCategoryItem, MenuBranchItem, MenuLeafItem } from './styled'
import { IReactComponentProps } from '@atoms/metadata'

const RootLabel = '__root'
const RootValue = -1

interface ILayeredMenuDropdownProps extends IReactComponentProps {
  menu: ILayeredMenuDropdownMenu,
  onSelect: (item: ILayeredMenuDropdownMenuItem) => void
}

export const LayeredMenuDropdown: React.FunctionComponent<ILayeredMenuDropdownProps> = function LayeredMenuDropdown (props) {
  // pseudo menu item for root
  const rootMenuItem: ILayeredMenuDropdownMenuItem = {
    label: RootLabel,
    value: RootValue,
    submenu: props.menu,
  }

  const [currentMenuItem, setCurrentMenuItem] = React.useState<ILayeredMenuDropdownMenuItem>(rootMenuItem)

  // a typescript workaround for the assumption that we'll never set a leaf as current item
  if (isNil(currentMenuItem.submenu)) throw new Error('current menu had no submenu')

  const goToParentMenu = () => {
    const parentMenuItem = findParentItem(currentMenuItem, rootMenuItem)

    if (isNil(parentMenuItem)) throw new Error('tried to go to parent of root')

    setCurrentMenuItem(parentMenuItem)
  }

  return (
    <DropdownContainer role={props.role}>
      {
        isNotRoot(currentMenuItem) ? (
          <MenuCategoryItem key={currentMenuItem.value} role='option' onClick={goToParentMenu}>
            <Words>{currentMenuItem.label}</Words>
            <span className='hover-text'><Words>GLOBAL.GO_BACK</Words></span>
          </MenuCategoryItem>
        ) : <Nothing />
      }
      {
        currentMenuItem.submenu.map((menuItem) => {
          if (isBranch(menuItem)) {
            return (
              <MenuBranchItem key={menuItem.value} role='option' onClick={() => setCurrentMenuItem(menuItem)}>
                <Words>{menuItem.label}</Words>
                &gt;
              </MenuBranchItem>
            )
          } else {
            return (
              <MenuLeafItem key={menuItem.value} role='option' onClick={() => props.onSelect(menuItem)}>
                <Words>{menuItem.label}</Words>
              </MenuLeafItem>
            )
          }
        })
      }
    </DropdownContainer>
  )

  function isNotRoot(menuItem: ILayeredMenuDropdownMenuItem): boolean {
    return menuItem.value !== rootMenuItem.value
  }
}

function isBranch (menuItem: ILayeredMenuDropdownMenuItem): boolean {
  return isDefined(menuItem.submenu)
}
