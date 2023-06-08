import React from 'react'
import Token from './Token'

export default {
  title: 'Components/Token',
  component: Token,
  args: {
    text: 'Token',
    size: 'medium',
  },
  argTypes: {
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large', 'xlarge'],
    },
  },
}

export const Default = () => <Token text="token" />

export const Playground = (args: any) => {
  return <Token {...args} />
}
