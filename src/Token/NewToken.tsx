import React, {forwardRef, MouseEventHandler, useMemo} from 'react'
import {CSSObject} from '@styled-system/css'
import TokenBase, {defaultTokenSize, isTokenInteractive, TokenBaseProps} from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import {Hsluv} from 'hsluv'
import {useTheme} from '../ThemeProvider'
import TokenTextContainer from './_TokenTextContainer'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type NewTokenVariants = 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray'

export interface NewTokenProps extends TokenBaseProps {
  variant?: NewTokenVariants | string
}

const hexToHsluv = (hex: string) => {
  const color = new Hsluv()
  color.hex = hex
  color.hexToHsluv()
  const {hsluv_h: h, hsluv_s: s, hsluv_l: l} = color
  return {h, s, l}
}

const hsluvToHex = ({h, s, l}: {h: number; s: number; l: number}): string => {
  const color = new Hsluv()
  // eslint-disable-next-line camelcase
  color.hsluv_h = h
  // eslint-disable-next-line camelcase
  color.hsluv_s = s
  // eslint-disable-next-line camelcase
  color.hsluv_l = l
  color.hsluvToHex()
  return color.hex
}
type colorSchemes = 'light' | 'dark' | 'dark_dimmed' | 'dark_high_contrast'
type variantColor = {backgroundColor: string; textColor: string}
type variant = {light: variantColor} & {
  [Property in Exclude<colorSchemes, 'light'>]?: variantColor
}
const variants: {
  [Property in NewTokenVariants]: variant
} = {
  blue: {
    light: {
      backgroundColor: '#E5F0FB',
      textColor: '#005CB6',
    },
    dark: {
      backgroundColor: '#13273D',
      textColor: '#4594E3',
    },
  },
  purple: {
    light: {
      backgroundColor: '#F0E5FB',
      textColor: '#6200C3',
    },
  },
  green: {
    light: {
      backgroundColor: '#E5F7EB',
      textColor: '#00802B',
    },
  },
  yellow: {
    light: {
      backgroundColor: '#FFFCEE',
      textColor: '#8A7300',
    },
  },
  orange: {
    light: {
      backgroundColor: '#FFF7F0',
      textColor: '#B15A01',
    },
  },
  red: {
    light: {
      backgroundColor: '#FBE5E6',
      textColor: '#D60000',
    },
  },
  gray: {
    light: {
      backgroundColor: '#ECEDEE',
      textColor: '#434A52',
    },
  },
}

const isValidVariant = (variant: string): variant is NewTokenVariants => Object.keys(variants).includes(variant)

const getColorScheme = (variant: NewTokenVariants, colorScheme: colorSchemes | string): colorSchemes => {
  if (variants[variant].hasOwnProperty(colorScheme)) {
    return colorScheme as colorSchemes
  }
  if (colorScheme.startsWith('dark') && variants[variant].hasOwnProperty('dark')) {
    return 'dark' as colorSchemes
  }
  return 'light' as colorSchemes
}

const hexRegEx = /^#?(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i

const getLabelColors = (variant: NewTokenVariants | string, resolvedColorScheme = 'light'): variantColor => {
  // valid variant
  if (isValidVariant(variant)) {
    return variants[variant as NewTokenVariants][getColorScheme(variant, resolvedColorScheme)] as variantColor
  }
  // valid hex string
  if (hexRegEx.test(variant)) {
    const hex = variant.startsWith('#') ? variant : `#${variant}`
    const {h, s} = hexToHsluv(hex)
    return {
      backgroundColor: hsluvToHex({h, s, l: 97}),
      textColor: hsluvToHex({h, s, l: 50}),
    }
  }
  // invalid variant and invalid hex string
  // eslint-disable-next-line no-console
  console.error(`Invalid variant: ${variant}`)
  const fallbackVariant = Object.keys(variants)[0] as NewTokenVariants
  return variants[fallbackVariant][getColorScheme(fallbackVariant, resolvedColorScheme)] as variantColor
}

const NewToken = forwardRef((props, forwardedRef) => {
  const {
    as,
    variant = 'blue',
    onRemove,
    id,
    isSelected,
    text,
    size = defaultTokenSize,
    hideRemoveButton,
    href,
    onClick,
    ...rest
  } = props
  const interactiveTokenProps = {
    as,
    href,
    onClick,
  }
  const {resolvedColorScheme} = useTheme()
  const hasMultipleActionTargets = isTokenInteractive(props) && Boolean(onRemove) && !hideRemoveButton
  const onRemoveClick: MouseEventHandler = e => {
    e.stopPropagation()
    onRemove && onRemove()
  }
  const labelStyles: CSSObject = useMemo(() => {
    const {backgroundColor, textColor} = getLabelColors(variant, resolvedColorScheme)

    return {
      paddingRight: hideRemoveButton || !onRemove ? undefined : 0,
      position: 'relative',
      backgroundColor,
      color: textColor,
    }
  }, [variant, resolvedColorScheme, hideRemoveButton, onRemove])

  return (
    <TokenBase
      onRemove={onRemove}
      id={id?.toString()}
      isSelected={isSelected}
      text={text}
      size={size}
      sx={labelStyles}
      {...(!hasMultipleActionTargets ? interactiveTokenProps : {})}
      {...rest}
      ref={forwardedRef}
    >
      <TokenTextContainer {...(hasMultipleActionTargets ? interactiveTokenProps : {})}>{text}</TokenTextContainer>
      {!hideRemoveButton && onRemove ? (
        <RemoveTokenButton
          onClick={onRemoveClick}
          size={size}
          aria-hidden={hasMultipleActionTargets ? 'true' : 'false'}
          isParentInteractive={isTokenInteractive(props)}
          sx={
            hasMultipleActionTargets
              ? {
                  position: 'relative',
                  zIndex: '1',
                }
              : {}
          }
        />
      ) : null}
    </TokenBase>
  )
}) as PolymorphicForwardRefComponent<'span' | 'a' | 'button', NewTokenProps>

NewToken.displayName = 'NewToken'

export default NewToken
