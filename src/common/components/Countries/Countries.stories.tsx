import React from 'react'
import { Countries } from '@brainstorm'

export default {
  title: 'Countries',
  argTypes: {
  },
}

function Template () {
  return (
    <Countries source={1} />
  )
}

export const Primary = Template.bind({})