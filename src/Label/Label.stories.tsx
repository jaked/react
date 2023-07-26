import React from 'react'
import Label, {LabelColorOptions} from './Label'
import Link from '../Link'

const validVariants: LabelColorOptions[] = [
  'default',
  'primary',
  'secondary',
  'accent',
  'success',
  'attention',
  'severe',
  'danger',
  'done',
  'sponsors',
]

export default {
  title: 'Components/Label',
  component: Label,
  args: {
    variant: 'default',
    size: 'small',
    filled: false,
    children: 'Label',
  },
  argTypes: {
    children: {
      name: 'text',
      control: {
        type: 'text',
      },
    },
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'large'],
    },
    variant: {
      control: {
        type: 'select',
      },
      options: [...validVariants, undefined],
    },
  },
}

export const Playground = {
  args: {
    variant: 'default',
    size: 'small',
    filled: false,
  },
  argTypes: {
    ref: {
      control: false,
      table: {
        disable: true,
      },
    },
    sx: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
}

export const Default = {}
export const Linked = args => (
  <Link href="#">
    <Label {...args} />
  </Link>
)

export const DeprecatedHexFill = {
  args: {
    filled: true,
    deprecatedHexFill: '#ff0000',
  },
  argTypes: {
    deprecatedHexFill: {
      control: 'color',
      if: {arg: 'filled'},
    },
  },
}
