import React from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import sx, {BetterSystemStyleObject, SxProp} from '../sx'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {variant} from 'styled-system'
import {getColorsFromHex} from './getColorsFromHex'
import {useTheme} from '../ThemeProvider'

export type LabelProps = {
  /** How large the label is rendered */
  size?: LabelSizeKeys
} & (
  | {
      /** The color of the label */
      variant?: LabelColorOptions
      /** The style in which the label is rendered */
      filled?: false
    }
  | {
      /** The color of the label */
      variant?: LabelColorOptions
      /** The style in which the label is rendered */
      filled?: true
      /** The style in which the label is rendered */
      deprecatedHexFill?: string
    }
) &
  SxProp

export type LabelColorOptions =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'attention'
  | 'severe'
  | 'danger'
  | 'done'
  | 'sponsors'

type LabelSizeKeys = 'small' | 'large'

export const newVariants: Record<
  LabelColorOptions,
  {
    backgroundColor: string
  }
> = {
  default: {
    backgroundColor: 'var(--color-scale-gray-0)',
  },
  primary: {
    backgroundColor: 'var(--color-scale-gray-2)',
  },
  secondary: {
    backgroundColor: 'var(--color-scale-gray-0)',
  },
  accent: {
    backgroundColor: 'var(--color-scale-gray-0)',
  },
  success: {
    backgroundColor: 'var(--color-scale-gray-0)',
  },
  attention: {
    backgroundColor: 'var(--color-scale-gray-0)',
  },
  severe: {
    backgroundColor: 'var(--color-scale-gray-0)',
  },
  danger: {
    backgroundColor: 'var(--color-scale-gray-0)',
  },
  done: {
    backgroundColor: 'var(--color-scale-gray-0)',
  },
  sponsors: {
    backgroundColor: 'var(--color-scale-gray-0)',
  },
}

const getVariant = (
  variant: LabelColorOptions = 'default',
  filled = false,
  deprecatedHexFill?: string,
  colorScheme?: string,
) => {
  if (filled && !deprecatedHexFill) {
    return {
      color: 'var(--color-scale-gray-9)',
      backgroundColor: newVariants[variant].backgroundColor,
      borderWidth: '0',
    }
  }
  if (filled && deprecatedHexFill) {
    return {
      ...getColorsFromHex(deprecatedHexFill, colorScheme),
      borderWidth: '0',
    }
  }
  return {
    color: 'var(--color-scale-gray-9)',
    borderColor: 'var(--color-scale-gray-2)',
    backgroundColor: 'transparent',
    borderWidth: '1px',
  }
}

export const variants: Record<LabelColorOptions, BetterSystemStyleObject> = {
  default: {
    borderColor: 'border.default',
  },
  primary: {
    borderColor: 'fg.default',
  },
  secondary: {
    borderColor: 'border.muted',
    color: 'fg.muted',
  },
  accent: {
    borderColor: 'accent.emphasis',
    color: 'accent.fg',
  },
  success: {
    borderColor: 'success.emphasis',
    color: 'success.fg',
  },
  attention: {
    borderColor: 'attention.emphasis',
    color: 'attention.fg',
  },
  severe: {
    borderColor: 'severe.emphasis',
    color: 'severe.fg',
  },
  danger: {
    borderColor: 'danger.emphasis',
    color: 'danger.fg',
  },
  done: {
    borderColor: 'done.emphasis',
    color: 'done.fg',
  },
  sponsors: {
    borderColor: 'sponsors.emphasis',
    color: 'sponsors.fg',
  },
}

const sizes: Record<LabelSizeKeys, BetterSystemStyleObject> = {
  small: {
    height: '20px',
    padding: '0 7px', // hard-coded to align with Primer ViewComponents and Primer CSS
  },
  large: {
    height: '24px',
    padding: '0 10px', // hard-coded to align with Primer ViewComponents and Primer CSS
  },
}

const StyledLabel = styled.span<LabelProps>`
  align-items: center;
  border-radius: 999px;
  border-style: solid;
  display: inline-flex;
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.0')};
  line-height: 1;
  white-space: nowrap;
  ${prop => getVariant(prop.variant, prop.filled, prop.deprecatedHexFill, prop.colorScheme)};
  ${variant({prop: 'size', variants: sizes})};
  ${sx};
`

const Label = React.forwardRef(function Label(
  {as, size = 'small', variant = 'default', deprecatedHexFill, filled = false, ...rest},
  ref,
) {
  const {resolvedColorScheme: colorScheme} = useTheme()

  return (
    <StyledLabel
      as={as}
      size={size}
      variant={variant}
      filled={filled}
      deprecatedHexFill={deprecatedHexFill}
      colorScheme={colorScheme}
      ref={ref}
      {...rest}
    />
  )
}) as PolymorphicForwardRefComponent<'span', LabelProps>

export default Label
