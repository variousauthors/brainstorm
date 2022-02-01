import { OperationVariables, QueryHookOptions, QueryResult, TypedDocumentNode, useQuery as base } from '@apollo/client'
import { ESource } from '@atoms/_entry/buildApolloClient'

export function useQuery<TData, TVariables = OperationVariables>(
  query: TypedDocumentNode<TData, TVariables>,
  source: ESource,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {
  return base(query, {
    ...options,
    context: {
      source,
    },
  })
}