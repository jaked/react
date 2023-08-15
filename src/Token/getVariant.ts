import {BetterSystemStyleObject} from '../sx'
import {Variant} from './Token'

export const variants: Record<Variant, BetterSystemStyleObject> = {
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
  red: {
    borderColor: 'danger.emphasis',
    backgroundColor: 'danger.subtle',
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

export const getVariant = (variant: Variant, isSelected = false) => ({
  backgroundColor: `var(--presentational-ui-${variant}-background)`,
  color: `var(--presentational-ui-${variant}-text)`,
  borderColor: isSelected ? `var(--presentational-ui-${variant}-border)` : 'transparent',
  // backgroundColorHover: `var(--presentational-ui-${variant}-backgroundHover)`,
})
