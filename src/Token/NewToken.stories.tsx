import React, {useEffect, useState} from 'react'
import NewToken, {NewTokenVariants} from './NewToken'
import Box from '../Box'
import {TokenSizeKeys} from './TokenBase'

const variants = ['blue', 'purple', 'green', 'yellow', 'orange', 'red', 'gray']

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

const getRandomLabel = (): string => {
  const labels = [
    'bug',
    'new',
    'info needed',
    'wontfix',
    'question',
    'documentation',
    'figma',
    'react',
    'design',
    'help wanted',
    'enhancement',
    'good first issue',
    'invalid',
    'duplicate',
    'feature',
    'discussion',
  ]
  return labels[getRandomInt(0, labels.length - 1)]
}

export default {
  title: 'Components/NewToken',
  component: NewToken,
  parameters: {
    options: {
      storySort: {
        order: ['Default', 'CustomHex'],
      },
    },
  },
  args: {
    text: 'Token',
    size: 'medium',
    variant: 'blue',
    numberOfTokens: 3,
  },
  argTypes: {
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium', 'large', 'xlarge'],
    },
    variant: {
      control: {
        type: 'select',
      },
      options: variants,
    },
    numberOfTokens: {control: {type: 'range', min: 1, max: 30, step: 1}},
  },
}

const Default = ({
  variant,
  numberOfTokens,
  text,
  size,
  ...args
}: {
  variant: NewTokenVariants | string
  numberOfTokens: number
  size: TokenSizeKeys
  text: string
}) => {
  const [tokens, setTokens] = useState<React.ReactNode[] | null>(null)

  useEffect(() => {
    setTokens(
      [...Array(numberOfTokens - 1).keys()].map(i => (
        <NewToken key={i} size={size} variant={variants[getRandomInt(0, variants.length)]} text={getRandomLabel()} />
      )),
    )
  }, [numberOfTokens, size])

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      <NewToken {...args} size={size} text={text} variant={variant} />
      {tokens}
    </Box>
  )
}
Default.args = {
  variant: 'blue',
  text: 'New Token',
}

const CustomHex = ({hex, _numberOfTokens, ...args}: {hex: string; numberOfTokens: number}) => {
  return <NewToken {...args} variant={hex} />
}
CustomHex.args = {
  hex: '#59B200',
  text: 'New Token',
  numberOfTokens: 1,
}
CustomHex.argTypes = {
  hex: {control: {type: 'color'}},
  variant: {control: {disable: true}},
  numberOfTokens: {control: {disable: true}},
}

export {Default, CustomHex}
