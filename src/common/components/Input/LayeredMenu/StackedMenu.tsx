import * as React from 'react'
import styled from 'styled-components'

import { ClickOutside, Nothing } from '@atoms/components'
import { ISelectOption } from '@atoms/metadata'

import { ILayeredMenuDropdownMenu } from './metadata'
import { StackedMenuDropDown } from './components/StackedMenuDropdown'


const LayereMenuContainer = styled.div`
  position: relative;
`

interface IStackedMenuProps {
  menu: ILayeredMenuDropdownMenu[]
  className?: string

  onSelect: (change: ISelectOption) => void

  Control: (props: { onClick: () => void }) => JSX.Element
}


export function StackedMenu(props: IStackedMenuProps) {
  const [isDropdownVisible, setIsDropdownVisible] = React.useState<boolean>(false)
  const toggleIsDropdownVisible = () => setIsDropdownVisible((prev: boolean) => !prev)
  return (
    <ClickOutside onClickOutside={() => setIsDropdownVisible(false)} className={props.className}>
      <LayereMenuContainer>
        <props.Control onClick={toggleIsDropdownVisible} />
        {
          isDropdownVisible
            ? <StackedMenuDropDown
              menu={props.menu}
              onSelect={(change) => {
                props.onSelect(change)
                setIsDropdownVisible(false)
              }}
            />
            : <Nothing />
        }
      </LayereMenuContainer>
    </ClickOutside>
  )
}
