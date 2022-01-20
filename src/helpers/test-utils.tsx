import '@testing-library/jest-dom'
import React, { PropsWithChildren } from 'react'
import fetch from 'cross-fetch';
import { render } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { graphql } from 'msw';
import { ApolloProvider } from '../components/ApolloProvider';
import { _dangerouslyBuildApolloClient } from './buildApolloClient';

const AllTheProviders = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ApolloProvider fetch={fetch}>
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

  graphql.query('getCountryList', (req, res, ctx) => {
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