import '@testing-library/jest-dom'
import React, { PropsWithChildren, ReactNode } from 'react'
import fetch from 'cross-fetch'
import { render } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { graphql } from 'msw'
import { ApolloProvider, _dangerouslyBuildApolloClient } from '@atoms/_entry'

const AllTheProviders = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <ApolloProvider fetch={fetch}>
      {children}
    </ApolloProvider>
  )
}

export const server = setupServer(
  graphql.query('countries', (_req, res, ctx) => {
    return res(
      ctx.data({
        countries: [{
          countryId: 1,
          code: 'ca',
        }],
      }),
    )
  }),

  graphql.query('getCountryList', (_req, res, ctx) => {
    return res(
      ctx.data({
        getCountryList: [{
          countryId: 1,
          code: 'ca',
        }],
      }),
    )
  }),
)

// we need the client in order to reset the store cache after each test
const client = _dangerouslyBuildApolloClient({ fetch })

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  return client.resetStore()
})

afterAll(() => {
  server.close()
})

const customRender = (ui: ReactNode, options = {}) =>
  render(<AllTheProviders>{ui}</AllTheProviders>, { ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }