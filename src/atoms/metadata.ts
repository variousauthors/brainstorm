import { PropsWithChildren } from 'react'

export interface IReactComponentProps extends PropsWithChildren<unknown> {
  className?: string
}

interface IGenericSelectOption<T> {
  value: T
  label: string
}

export type ISelectOption = IGenericSelectOption<number>