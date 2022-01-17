import { ApolloProvider as Base } from '@apollo/client'
import { client } from '../helpers'
import { PropsWithChildren } from 'react'

export function ApolloProvider ({ children }: PropsWithChildren<{}>) {
  return (
    <Base client={client}>
      {children}
    </Base>
  )
}