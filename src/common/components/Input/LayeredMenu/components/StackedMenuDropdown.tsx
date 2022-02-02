import * as React from 'react'
import styled from 'styled-components'

import { isDefined } from '@atoms/helpers'

import { ILayeredMenuDropdownMenu, ILayeredMenuDropdownMenuItem } from '../metadata'
import { DropdownContainer as DropdownContainerBase, MenuBranchItem as MenuBranchItemBase, MenuLeafItem as MenuLeafItemBase } from './styled'
import { Words } from '@atoms/components'

const DropdownContainer = styled(DropdownContainerBase)`
  left: initial;
  width: initial;
  background: initial;
  border: initial;
  border-radius: initial;
  box-shadow: initial;
  max-height: initial;
`

const MenuBranchItem = styled(MenuBranchItemBase)`
  min-width: 150px;
`

const MenuLeafItem = styled(MenuLeafItemBase)`
  min-width: 150px;
`

const MenuContainer = styled('div')`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  flex-direction: row;
`

const SubMenu = styled('div')`
  border: 1px solid lightgrey;
  border-radius: 2px;
  box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.06);

  :not(:last-child) {
    margin-right: 5px;
  }
`

interface IStackedMenuDropDownProps {
  menu: ILayeredMenuDropdownMenu[]
  onSelect: (item: ILayeredMenuDropdownMenuItem) => void
}

export function StackedMenuDropDown (props: IStackedMenuDropDownProps) {
  const [openMenus, setOpenMenus] = React.useState<ILayeredMenuDropdownMenu[]>(props.menu)

  const onClickMenuBranchItem = (depth: number, subMenu: ILayeredMenuDropdownMenu) => {
    const updatedMenus = openMenus.slice(0, depth + 1).concat([subMenu])
    setOpenMenus(updatedMenus)
  }

  const onClickMenuLeafItem = (menuItem: ILayeredMenuDropdownMenuItem) => {
    const updatedMenus = openMenus.slice(0, 1)
    setOpenMenus(updatedMenus)
    props.onSelect(menuItem)
  }

  return (
    <DropdownContainer className='dropdown-container'>
      <MenuContainer className='menu-container'>
        { openMenus.map((menu, index) => {
          return (
            <SubMenu key={index}>
              { menu.map((menuItem) => {
                if (isBranch(menuItem)) {
                  return (
                    <MenuBranchItem className='menu-branch-item' key={menuItem.value} onClick={() => onClickMenuBranchItem(index, menuItem.submenu!)}>
                      <Words>{menuItem.label}</Words>
                      &gt;
                    </MenuBranchItem>
                  )
                } else {
                  return (
                    <MenuLeafItem key={menuItem.value} onClick={() => onClickMenuLeafItem(menuItem)}>
                      <Words>{menuItem.label}</Words>
                    </MenuLeafItem>
                  )
                }
              })}
            </SubMenu>
          )
        })}
      </MenuContainer>
    </DropdownContainer>
  )
}

function isBranch (menuItem: ILayeredMenuDropdownMenuItem): boolean {
  return isDefined(menuItem.submenu)
}
