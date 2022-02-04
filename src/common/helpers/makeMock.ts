import { graphql, GraphQLHandler, GraphQLRequest, GraphQLVariables } from 'msw'

export function makeMock<T, V extends GraphQLVariables>(name: string, defaultData: T): (data?: T) => GraphQLHandler<GraphQLRequest<V>> {
  return (data?: T) => {
    return graphql.query(name, (_req, res, ctx) => {
      return res(
        ctx.data(data !== undefined ? data : defaultData),
      )
    }) as GraphQLHandler<GraphQLRequest<V>>
  }
}
