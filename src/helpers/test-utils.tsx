import '@testing-library/jest-dom'
import React, { PropsWithChildren } from 'react'
import fetch from 'cross-fetch';
import { render } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { graphql } from 'msw';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:5000/graphql', fetch }),
  cache: new InMemoryCache()
});

const AllTheProviders = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}

export const server = setupServer(
  graphql.query('countries', (req, res, ctx) => {
    return res(
      ctx.data({
        countries: [{
          countryId: 1,
          code: 'ca',
        }],
      }),
    )
  }),
)

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  client.resetStore()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

const customRender = (ui: any, options?: any) =>
  render(<AllTheProviders>{ui}</AllTheProviders>, { ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }