import { IReactComponentProps } from '@atoms/metadata'
import React from 'react'

export interface IElementWrapperProps extends IReactComponentProps {

}

export function ElementWrapper (_props: IElementWrapperProps) {
  return (
    <div></div>
  )
}
