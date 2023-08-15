import React from 'react'
import Token from './Token'
import {action} from '@storybook/addon-actions'
import {StoryFn} from '@storybook/react'

export default {
  title: 'Components/Token',
  component: Token,
  args: {
    text: 'Token',
    size: 'medium',
    isSelected: false,
    variant: undefined,
    isInteractive: false,
    onRemove: false,
    deprecatedFillColor: undefined,
  },
  argTypes: {
    text: {
      control: {
        type: 'text',
      },
    },
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
    onRemove: {
      control: {
        type: 'boolean',
      },
    },
    deprecatedFillColor: {
      control: {
        type: 'color',
      },
    },
  },
}

export const Default = () => <Token text="token" />

export const Playground: StoryFn = args => {
  const {isInteractive, onRemove, text, ...rest} = args
  return (
    <Token
      text={text}
      {...rest}
      onClick={isInteractive ? action('clicked') : undefined}
      onRemove={onRemove ? action('remove me') : undefined}
    />
  )
}
