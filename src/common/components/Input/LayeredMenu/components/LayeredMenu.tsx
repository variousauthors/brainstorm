import * as React from 'react'
import styled from 'styled-components'

import { ClickOutside, Nothing } from '@atoms/components'
import { ISelectOption } from '@atoms/metadata'

import { ILayeredMenuDropdownMenu } from '../metadata'
import { LayeredMenuDropdown } from './LayeredMenuDropdown'

// styles
const LayereMenuContainer = styled.div`
  position: relative;
`

interface ILayeredMenuProps {
  menu: ILayeredMenuDropdownMenu
  placeholder?: string
  className?: string

  onSelect: (change: ISelectOption) => void

  Control: (props: { onClick: () => void }) => JSX.Element
}

export function LayeredMenu (props: ILayeredMenuProps) {
  const [isDropdownVisible, setIsDropdownVisible] = React.useState<boolean>(false)

  const toggleIsDropdownVisible = () => setIsDropdownVisible((prev: boolean) => !prev)

  return (
    <ClickOutside onClickOutside={() => setIsDropdownVisible(false)} className={props.className}>
      <LayereMenuContainer>
        <props.Control onClick={toggleIsDropdownVisible} />
        {
          isDropdownVisible ? (
            <LayeredMenuDropdown
              role='listbox'
              menu={props.menu}
              onSelect={(change) => {
                props.onSelect(change)
                setIsDropdownVisible(false)
              }}
            />
          ) : <Nothing />
        }
      </LayereMenuContainer>
    </ClickOutside >
  )
}
