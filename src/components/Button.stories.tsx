import React from 'react'

import { Button, IButtonProps } from '@brainstorm'

export default {
  title: 'Button',
  argTypes: {
  },
}

function Template (args: IButtonProps) {
  return (
    <Button {...args} />
  )
}

export const Primary = Template.bind({})