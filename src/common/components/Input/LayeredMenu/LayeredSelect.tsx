import * as React from 'react'

import { ISelectOption } from '@atoms/metadata'

import { ILayeredMenuDropdownMenu } from './metadata'
import { LayeredMenu } from './components'
import { Words } from '@atoms/components'
import { isDefined, isNil } from '@atoms/helpers'

interface ILayeredSelectProps {
  menu: ILayeredMenuDropdownMenu
  selectedItem?: ISelectOption
  onChange: (change?: ISelectOption) => void
  placeholder?: string
  className?: string
  hasError?: boolean
}

export const LayeredSelect: React.FunctionComponent<ILayeredSelectProps> = function LayeredSelect (props) {
  const addSelectedItem = (item: ISelectOption) => {
    if (alreadySelected(item, props.selectedItem)) return

    props.onChange(item)
  }

  const selectedLabel = isNil(props.selectedItem) ? props.placeholder : props.selectedItem.label

  return (
    <LayeredMenu
      menu={props.menu}
      onSelect={addSelectedItem}
      placeholder={props.placeholder}
      className={props.className}
      Control={({ onClick }) =>
        <div
          onClick={onClick}
        >
          <label>
            <Words>{selectedLabel}</Words>
          </label>
        </div>
      }
    />
  )
}

function alreadySelected (next: ISelectOption, prev?: ISelectOption): boolean {
  return isDefined(prev) && next.value === prev.value
}
