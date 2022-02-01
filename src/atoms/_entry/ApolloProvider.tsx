import React from 'react'
import { ApolloProvider as Base } from '@apollo/client'
import { IReactComponentProps } from '@atoms/metadata'
import { _dangerouslyBuildApolloClient } from './buildApolloClient'

interface IApolloProviderProps extends IReactComponentProps  {
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