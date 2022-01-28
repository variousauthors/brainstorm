import { PropsWithChildren } from 'react'

export interface IReactComponentProps extends PropsWithChildren<unknown> {
  className?: string
}