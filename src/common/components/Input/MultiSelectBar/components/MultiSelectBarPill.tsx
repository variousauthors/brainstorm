import * as React from 'react'
import { Item, IconCloseClickable } from './styled'
import { ISelectOption } from '@atoms/metadata'
import { Words } from '@atoms/components'

interface IMultiSelectBarPillProps {
  selectOption: ISelectOption

  onCloseClick: (target: ISelectOption) => void
}

export function MultiSelectBarPill (props: IMultiSelectBarPillProps) {

  return (
    <Item onClick={suppressClickEvent}>
      <Words>{props.selectOption.label}</Words>
      <IconCloseClickable onClick={handleCloseClick} />
    </Item>
  )

  function suppressClickEvent (e: React.MouseEvent) {
    e.stopPropagation()
  }

  function handleCloseClick (e: React.MouseEvent) {
    props.onCloseClick(props.selectOption)
    suppressClickEvent(e)
  }
}
