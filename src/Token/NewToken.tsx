import React, {forwardRef, MouseEventHandler, useMemo} from 'react'
import {CSSObject} from '@styled-system/css'
import TokenBase, {defaultTokenSize, isTokenInteractive, TokenBaseProps} from './TokenBase'
import RemoveTokenButton from './_RemoveTokenButton'
import {useTheme} from '../ThemeProvider'
import TokenTextContainer from './_TokenTextContainer'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import '../../.storybook/primitives-v8.css'
import {getColorsFromHex} from './getColorsFromHex'
import {hexString, isHex} from '../utils/isHex'
export type TokenVariants = 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'gray'

export interface NewTokenProps extends TokenBaseProps {
  variant?: TokenVariants
  fillColor?: hexString
}

export type colorSchemes =
  | 'light'
  | 'light_high_contrast'
  | 'light_colorblind'
  | 'light_tritanopia'
  | 'dark'
  | 'dark_dimmed'
  | 'dark_high_contrast'
  | 'dark_colorblind'
  | 'dark_tritanopia'

export type variantColor = {
  backgroundColor: string
  textColor: string
  borderColor?: string
  backgroundColorHover?: string
  backgroundColorPressed?: string
}

const variantColors = (variant: TokenVariants, colorScheme: colorSchemes): variantColor => ({
  backgroundColor: `var(--presentational-ui-${variant}-background)`,
  backgroundColorHover: `var(--presentational-ui-${variant}-backgroundHover)`,
  textColor: `var(--presentational-ui-${variant}-text)`,
  borderColor: colorScheme.endsWith('high_contrast') ? `var(--presentational-ui-${variant}-border)` : undefined,
})

const getLabelColors = (
  variant?: TokenVariants,
  fillColor?: hexString,
  resolvedColorScheme: colorSchemes = 'light',
  bgColor = '#ffffff',
): variantColor => {
  // valid variant
  if (variant) {
    return variantColors(variant, resolvedColorScheme as colorSchemes)
  }
  // valid hex string
  if (fillColor && isHex(fillColor)) {
    return getColorsFromHex(fillColor, bgColor, resolvedColorScheme as colorSchemes)
  }
  // if invalid variant and invalid hex string, return default
  return variantColors('blue', resolvedColorScheme as colorSchemes)
}

const NewToken = forwardRef((props, forwardedRef) => {
  const {
    as,
    variant,
    fillColor,
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

  const {theme, resolvedColorScheme} = useTheme()
  const bgColor = theme?.colors.canvas.default || '#ffffff'

  const hasMultipleActionTargets = isTokenInteractive(props) && Boolean(onRemove) && !hideRemoveButton
  const onRemoveClick: MouseEventHandler = e => {
    e.stopPropagation()
    onRemove && onRemove()
  }
  const labelStyles: CSSObject = useMemo(() => {
    const {backgroundColor, textColor, borderColor, backgroundColorHover, backgroundColorPressed} = getLabelColors(
      variant,
      fillColor,
      resolvedColorScheme as colorSchemes,
      bgColor,
    )

    return {
      paddingRight: hideRemoveButton || !onRemove ? undefined : 0,
      position: 'relative',
      backgroundColor,
      color: textColor,
      border: `1px solid ${borderColor || backgroundColor}`,
      ...(isTokenInteractive(props)
        ? {
            '&:hover': {
              background: backgroundColorHover || backgroundColor,
              border: `1px solid ${borderColor || backgroundColorHover || backgroundColor}`,
            },
            '&:active': {
              background: backgroundColorPressed || backgroundColor,
              border: `1px solid ${borderColor || backgroundColorPressed || backgroundColor}`,
            },
          }
        : {}),
    }
  }, [fillColor, variant, resolvedColorScheme, hideRemoveButton, onRemove, props, bgColor])

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
