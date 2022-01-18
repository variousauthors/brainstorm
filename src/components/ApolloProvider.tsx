import React from 'react'
import { ApolloProvider as Base } from '@apollo/client'
import { _dangerouslyBuildApolloClient } from '../helpers'
import { PropsWithChildren } from 'react'

interface IApolloProviderProps extends PropsWithChildren<{}> {
  fetch?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>
}

export function ApolloProvider ({ children, fetch }: IApolloProviderProps) {
  const client = _dangerouslyBuildApolloClient({ fetch })

  return (
    <Base client={client}>
      {children}
    </Base>
  )
}