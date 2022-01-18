import React from 'react'
import { graphql } from 'msw'
import { render, waitFor, screen, server } from '../../helpers/test-utils'
import { Countries } from './Countries'

test('loads and displays greeting', async () => {
  render(<Countries />)

  await waitFor(() => screen.getByRole('heading'))

  expect(screen.getByRole('heading')).toHaveTextContent('hello there')
})

test('handles server error', async () => {
  server.use(
    graphql.query('countries', (req, res, ctx) => {
      return res(ctx.errors([{}]))
    }),
  )

  render(<Countries />)

  await waitFor(() => screen.getByRole('alert'))

  expect(screen.getByRole('alert')).toHaveTextContent('Error :(')
})