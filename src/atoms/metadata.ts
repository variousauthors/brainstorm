import { AriaRole, PropsWithChildren } from 'react'

export interface IReactComponentProps extends PropsWithChildren<unknown> {
  className?: string
  role?: AriaRole
  ['aria-label']?: string
}

interface IGenericSelectOption<T> {
  value: T
  label: string
}

export type ISelectOption = IGenericSelectOption<number>