import React from 'react'
import {rest} from 'msw'
import { render, waitFor, screen, server, fireEvent } from '../helpers/test-utils'
import { Fetch } from './Fetch'

test('loads and displays greeting', async () => {
  server.use(
    rest.get('/greeting', (req, res, ctx) => {
      return res(ctx.json({greeting: 'hello there'}))
    }),
  )

  render(<Fetch url="/greeting" />)

  fireEvent.click(screen.getByText('Load Greeting'))

  await waitFor(() => screen.getByRole('heading'))

  expect(screen.getByRole('heading')).toHaveTextContent('hello there')
  expect(screen.getByRole('button')).toBeDisabled()
})

test('handles server error', async () => {
  server.use(
    rest.get('/greeting', (req, res, ctx) => {
      return res(ctx.status(500))
    }),
  )

  render(<Fetch url="/greeting" />)

  fireEvent.click(screen.getByText('Load Greeting'))

  await waitFor(() => screen.getByRole('alert'))

  expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
  expect(screen.getByRole('button')).not.toBeDisabled()
})