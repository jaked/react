import React from 'react'
import Token from './Token'
import {action} from '@storybook/addon-actions'

export default {
  title: 'Components/Token',
  component: Token,
  args: {
    text: 'Token',
    size: 'medium',
    isSelected: false,
    variant: undefined,
    isInteractive: false,
  },
  argTypes: {
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large', 'xlarge'],
    },
    isSelected: {
      control: {
        type: 'boolean',
      },
    },
    variant: {
      control: {
        type: 'select',
      },
      options: [undefined, 'default', 'purple', 'red', 'orange', 'yellow', 'green', 'blue', 'gray'],
    },
    isInteractive: {
      control: {
        type: 'boolean',
      },
    },
  },
}

export const Default = () => <Token text="token" />
// @ts-ignore: Object is possibly 'undefined'.
export const Playground = (isInteractive, onRemove, ...args) => {
  return (
    // @ts-ignore: Object is possibly 'undefined'.
    <Token
      {...args}
      onClick={isInteractive ? action('clicked') : undefined}
      onRemove={onRemove ? action('remove me') : undefined}
    />
  )
}
