import React from 'react'

import { Button, ButtonProps } from '@brainstorm'

export default {
  title: 'Button',
  argTypes: {
  },
}

function Template (args: ButtonProps) {
  return (
    <Button {...args} />
  )
}

export const Primary = Template.bind({})