import React from 'react';
import { Brainstorm } from '@brainstorm'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <Brainstorm>
      <Story />
    </Brainstorm>
  ),
];