import * as React from 'react'

import { immutableRemove } from '@common/helpers'
import { ISelectOption } from '@atoms/metadata'

import { ILayeredMenuDropdownMenu } from './metadata'
import { LayeredMenu } from './components'
import { MultiSelectBar } from '../MultiSelectBar'
import { isDefined } from '@atoms/helpers'

interface ILayeredMultiSelectProps {
  menu: ILayeredMenuDropdownMenu
  selectedItems: ISelectOption[]
  onChange: (nextItems: ISelectOption[]) => void
  placeholder?: string
}

export const LayeredMultiSelect: React.FunctionComponent<ILayeredMultiSelectProps> = function LayeredMultiSelect (props) {
  const addSelectedItem = (item: ISelectOption) => {
    if (alreadyExists(item, props.selectedItems)) return

    props.onChange([...props.selectedItems, item])
  }

  const removeSelectedItem = (itemToRemove: ISelectOption) => {
    const nextItems = immutableRemove(props.selectedItems, itemToRemove)

    props.onChange(nextItems)
  }

  return (
    <LayeredMenu
      menu={props.menu}
      onSelect={addSelectedItem}
      placeholder={props.placeholder}
      Control={({ onClick }) =>
        <MultiSelectBar
          items={props.selectedItems}
          onClick={onClick}
          onRemoveItem={removeSelectedItem}
          placeholder={props.placeholder}
        />
      }
    />
  )
}

function alreadyExists (item: ISelectOption, collection: ISelectOption[]): boolean {
  return isDefined(collection.find(({ value }) => item.value === value))
}
