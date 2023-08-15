import {Variant} from './Token'

export const getVariant = (variant: Variant, isSelected = false) => ({
  backgroundColor: `var(--presentational-ui-${variant}-background)`,
  color: `var(--presentational-ui-${variant}-text)`,
  borderColor: isSelected ? `var(--presentational-ui-${variant}-border)` : 'transparent',
  '&:hover': {
    backgroundColor: `var(--presentational-ui-${variant}-backgroundHover)`,
    boxShadow: 'var(--shadow-resting-medium)',
  },
})
