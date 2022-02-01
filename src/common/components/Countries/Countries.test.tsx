import React from 'react'
import { graphql } from 'msw'
import { render, waitFor, screen, server } from '../../helpers/test-utils'
import { Countries } from './Countries'
import { ESource } from '../../helpers'

describe('using v2 as the source', () => {
  test('loads and displays greeting', async () => {
    render(<Countries source={ESource.API_SERVER_V2} />)

    await waitFor(() => screen.getByRole('heading'))

    expect(screen.getByRole('heading')).toHaveTextContent('hello there')
  })

  test('handles server error', async () => {
    server.use(
      graphql.query('countries', (req, res, ctx) => {
        return res(ctx.errors([{}]))
      }),
      graphql.query('getCountryList', (req, res, ctx) => {
        return res(ctx.errors([{}]))
      }),
    )

    render(<Countries source={ESource.API_SERVER_V2} />)

    await waitFor(() => screen.getByRole('alert'))

    expect(screen.getByRole('alert')).toHaveTextContent('Error :(')
  })
})

describe('using agency api as the source', () => {
  test('loads and displays greeting', async () => {
    render(<Countries source={ESource.AGENCY_API} />)

    await waitFor(() => screen.getByRole('heading'))

    expect(screen.getByRole('heading')).toHaveTextContent('hello there')
  })

  test('handles server error', async () => {
    server.use(
      graphql.query('countries', (req, res, ctx) => {
        return res(ctx.errors([{}]))
      }),
      graphql.query('getCountryList', (req, res, ctx) => {
        return res(ctx.errors([{}]))
      }),
    )

    render(<Countries source={ESource.AGENCY_API} />)

    await waitFor(() => screen.getByRole('alert'))

    expect(screen.getByRole('alert')).toHaveTextContent('Error :(')
  })
})