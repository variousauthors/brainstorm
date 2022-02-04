import * as React from 'react'
import { isEmpty } from '@atoms/helpers'
import { IReactComponentProps, ISelectOption } from '@atoms/metadata'
import { Nothing, Words } from '@atoms/components'
import { MultiSelectBarPill } from './components'
import { InputLikeBar, InputLikeBarItemsContainer, Placeholder, InputLikeBarArrow } from './styled'

interface ILayeredMenuBar extends IReactComponentProps {
  items: ISelectOption[]
  onClick: () => void
  onRemoveItem: (menuItem: ISelectOption) => void
  placeholder?: string
}

export const MultiSelectBar: React.FunctionComponent<ILayeredMenuBar> = function LayeredMenuBar (props) {
  return (
    <InputLikeBar role='button' onClick={props.onClick}>
      <InputLikeBarItemsContainer>
        {
          isEmpty(props.items) ? (
            <Placeholder><Words>{props.placeholder}</Words></Placeholder>
          ) : <Nothing />
        }
        {
          props.items.map((menuItem) => {
            return (
              <MultiSelectBarPill
                key={menuItem.value}
                onCloseClick={props.onRemoveItem}
                selectOption={menuItem}
              />
            )
          })
        }
      </InputLikeBarItemsContainer>
      <InputLikeBarArrow>
      </InputLikeBarArrow>
    </InputLikeBar>
  )
}
