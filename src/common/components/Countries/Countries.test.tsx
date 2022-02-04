import React from 'react'
import { graphql } from 'msw'
import { Countries } from './Countries'
import {render, waitFor, screen, server} from '@src/test-utils'
import { ESource } from '@atoms/_entry'
import { waitForElementToBeRemoved } from '@testing-library/react'

describe('using v2 as the source', () => {
  test('loads and displays greeting', async () => {
    render(<Countries source={ESource.API_SERVER_V2} />)

    const progressbar = await screen.findByRole('progressbar')

    expect(progressbar).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'))

    const greeting = screen.getByText(/hello/i)

    expect(progressbar).not.toBeInTheDocument()
    expect(greeting).toBeInTheDocument()
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

    const alert = await waitFor(() => screen.getByRole('alert'))

    expect(alert).toHaveTextContent('Error :(')
  })
})

describe('using agency api as the source', () => {
  test('loads and displays greeting', async () => {
    render(<Countries source={ESource.AGENCY_API} />)

    const heading = await waitFor(() => screen.getByRole('heading'))

    expect(heading).toHaveTextContent('hello there')
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

    const alert = await waitFor(() => screen.getByRole('alert'))

    expect(alert).toHaveTextContent('Error :(')
  })
})