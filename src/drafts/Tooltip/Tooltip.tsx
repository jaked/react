import React, {Children, useEffect, useRef, useState} from 'react'
import Box from '../../Box'
import sx, {SxProp} from '../../sx'
import {useId, useProvidedRefOrCreate} from '../../hooks'
import {invariant} from '../../utils/invariant'
import {warning} from '../../utils/warning'
import styled from 'styled-components'
import {get} from '../../constants'
import {ComponentProps} from '../../utils/types'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorSide, AnchorAlignment} from '@primer/behaviors'
import {isSupported, apply} from '@oddbird/popover-polyfill/fn'

// Reusable styles to use for :popover-open (Chrome, Edge) and \:popover-open (Safari, Firefox) classes
const popoverStyles = `
    padding: 0.5em 0.75em;
    width: max-content;
    height: fit-content;
    margin: auto;
    clip: auto;
    white-space: normal;
    /* for scrollbar */
    overflow: visible;
`

const animationStyles = `
  animation-name: tooltip-appear;
  animation-duration: 0.1s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
  animation-delay: 0s;
`

const StyledTooltip = styled.div`
  /* tooltip element should be rendered visually hidden when it is not opened.  */
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  position: fixed;
  font: normal normal 11px/1.5 ${get('fonts.normal')};
  -webkit-font-smoothing: subpixel-antialiased;
  color: ${get('colors.fg.onEmphasis')};
  text-align: center;

  word-wrap: break-word;
  background: ${get('colors.neutral.emphasisPlus')}; //bg--emphasis-color
  border-radius: ${get('radii.2')};
  border: 0;
  opacity: 0;
  max-width: 250px;
  inset: auto;

  @media (forced-colors: active) {
    outline: 1px solid transparent;
  }
  /* pollyfil */
  z-index: 2147483647;
  display: block;

  /* class name in chrome is :popover-open */
  &:popover-open {
    ${popoverStyles}
  }

  /* class name in firefox and safari is \:popover-open */
  &.\\:popover-open {
    ${popoverStyles}
  }

  // This is needed to keep the tooltip open when the user leaves the trigger element to hover tooltip
  &::after {
    position: absolute;
    display: block;
    right: 0;
    left: 0;
    height: 8px;
    content: '';
  }

  /* South, East, Southeast, Southwest after */
  &[data-direction='n']::after,
  &[data-direction='ne']::after,
  &[data-direction='nw']::after {
    top: 100%;
  }
  &[data-direction='s']::after,
  &[data-direction='se']::after,
  &[data-direction='sw']::after {
    bottom: 100%;
  }

  &[data-direction='w']::after {
    position: absolute;
    display: block;
    height: 100%;
    width: 8px;
    content: '';
    bottom: 0;
    left: 100%;
  }
  /* East before and after */
  &[data-direction='e']::after {
    position: absolute;
    display: block;
    height: 100%;
    width: 8px;
    content: '';
    bottom: 0;
    right: 100%;
    margin-left: -8px;
  }

  /* Animation definition */
  @keyframes tooltip-appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  /* Animation styles */
  &:popover-open,
  &:popover-open::before {
    ${animationStyles}
  }

  /* Animation styles */
  &.\\:popover-open,
  &.\\:popover-open::before {
    ${animationStyles}
  }

  ${sx};
`

type TooltipDirection = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
export type TooltipProps = React.PropsWithChildren<
  {
    direction?: TooltipDirection
    text?: string
    type?: 'label' | 'description'
  } & SxProp &
    ComponentProps<typeof StyledTooltip>
>

export type TriggerPropsType = {
  'aria-describedby'?: string
  'aria-labelledby'?: string
  'aria-label'?: string
  onBlur?: React.FocusEventHandler
  onFocus?: React.FocusEventHandler
  onMouseEnter?: React.MouseEventHandler
  ref?: React.RefObject<HTMLElement>
}

// map tooltip direction to anchoredPosition props
const directionToPosition: Record<TooltipDirection, {side: AnchorSide; align: AnchorAlignment}> = {
  nw: {side: 'outside-top', align: 'start'},
  n: {side: 'outside-top', align: 'center'},
  ne: {side: 'outside-top', align: 'end'},
  e: {side: 'outside-right', align: 'center'},
  se: {side: 'outside-bottom', align: 'end'},
  s: {side: 'outside-bottom', align: 'center'},
  sw: {side: 'outside-bottom', align: 'start'},
  w: {side: 'outside-left', align: 'center'},
}

// map anchoredPosition props to tooltip direction
const positionToDirection: Record<string, TooltipDirection> = {
  'outside-top-start': 'nw',
  'outside-top-center': 'n',
  'outside-top-end': 'ne',
  'outside-right-center': 'e',
  'outside-bottom-end': 'se',
  'outside-bottom-center': 's',
  'outside-bottom-start': 'sw',
  'outside-left-center': 'w',
}

// The list is from GitHub's custom-axe-rules https://github.com/github/github/blob/master/app/assets/modules/github/axe-custom-rules.ts#L3
const interactiveElements = [
  'a[href]',
  'button:not(:disabled)',
  'summary',
  'select',
  'input:not([type=hidden])',
  'textarea',
]

const isInteractive = (element: HTMLElement) => {
  return (
    interactiveElements.some(selector => element.matches(selector)) ||
    (element.hasAttribute('role') && element.getAttribute('role') === 'button')
  )
}
export const TooltipContext = React.createContext<{tooltipId?: string}>({})

export const Tooltip = React.forwardRef(
  ({direction = 's', text, type = 'description', children, ...rest}: TooltipProps, forwardedRef) => {
    const tooltipId = useId()
    const child = Children.only(children)
    const triggerRef = useProvidedRefOrCreate(forwardedRef as React.RefObject<HTMLElement>)
    const tooltipElRef = useRef<HTMLDivElement>(null)

    const [calculatedDirection, setCalculatedDirection] = useState<TooltipDirection>(direction)

    const openTooltip = () => {
      if (tooltipElRef.current && triggerRef.current && !tooltipElRef.current.matches(':popover-open')) {
        tooltipElRef.current.showPopover()
      }
    }
    const closeTooltip = () => {
      if (tooltipElRef.current && triggerRef.current && tooltipElRef.current.matches(':popover-open')) {
        tooltipElRef.current.hidePopover()
      }
    }

    useEffect(() => {
      if (!tooltipElRef.current || !triggerRef.current) return
      /*
       * ACCESSIBILITY CHECKS
       */
      // Has trigger element or any of its children interactive elements?
      const isTriggerInteractive = isInteractive(triggerRef.current)
      const triggerChildren = triggerRef.current.childNodes
      const hasInteractiveChild = Array.from(triggerChildren).some(child => {
        return child instanceof HTMLElement && isInteractive(child)
      })
      invariant(
        isTriggerInteractive || hasInteractiveChild,
        'The `Tooltip` component expects a single React element that contains interactive content. Consider using a `<button>` or equivalent interactive element instead.',
      )
      // If the tooltip is used for labelling the interactive element, the trigger element or any of its children should not have aria-label
      if (type === 'label') {
        const hasAriaLabel = triggerRef.current.hasAttribute('aria-label')
        const hasAriaLabelInChildren = Array.from(triggerRef.current.childNodes).some(
          child => child instanceof HTMLElement && child.hasAttribute('aria-label'),
        )
        warning(
          hasAriaLabel || hasAriaLabelInChildren,
          'The label type `Tooltip` is going to be used here to label the trigger element. Please remove the aria-label from the trigger element.',
        )
      }

      // SSR safe polyfill apply
      if (typeof window !== 'undefined') {
        if (!isSupported()) {
          apply()
        }
      }

      /*
       * TOOLTIP POSITIONING
       */
      const tooltip = tooltipElRef.current
      const trigger = triggerRef.current
      tooltip.setAttribute('popover', 'auto')
      const settings = {
        side: directionToPosition[direction].side,
        align: directionToPosition[direction].align,
      }

      const positionSet = () => {
        const {top, left, anchorAlign, anchorSide} = getAnchoredPosition(tooltip, trigger, settings)

        tooltip.style.top = `${top}px`
        tooltip.style.left = `${left}px`
        // This is required to make sure the popover is positioned correctly i.e. when there is not enough space on the specified direction, we set a new direction to position the ::after
        const calculatedDirection = positionToDirection[`${anchorSide}-${anchorAlign}` as string]
        setCalculatedDirection(calculatedDirection)
      }

      tooltip.addEventListener('toggle', positionSet)

      return () => {
        tooltip.removeEventListener('toggle', positionSet)
      }
    }, [tooltipElRef, triggerRef, direction, type])

    return (
      <TooltipContext.Provider value={{tooltipId}}>
        <Box sx={{display: 'inline-block'}} onMouseLeave={() => closeTooltip()}>
          {React.isValidElement(child) &&
            React.cloneElement(child as React.ReactElement<TriggerPropsType>, {
              ref: triggerRef,
              // If it is a type description, we use tooltip to describe the trigger
              'aria-describedby': type === 'description' ? `tooltip-${tooltipId}` : undefined,
              // If it is a label type, we use tooltip to label the trigger
              'aria-labelledby': type === 'label' ? `tooltip-${tooltipId}` : undefined,
              onBlur: (event: React.FocusEvent) => {
                closeTooltip()
                child.props.onBlur?.(event)
              },
              onFocus: (event: React.FocusEvent) => {
                openTooltip()
                child.props.onFocus?.(event)
              },
              onMouseEnter: (event: React.MouseEvent) => {
                openTooltip()
                child.props.onMouseEnter?.(event)
              },
            })}
          <StyledTooltip
            ref={tooltipElRef}
            data-direction={calculatedDirection}
            {...rest}
            // Only need tooltip role if the tooltip is a description for supplementary information
            role={type === 'description' ? 'tooltip' : undefined}
            // stop AT from announcing the tooltip twice when it is a label type because it will be announced with "aria-labelledby"
            aria-hidden={type === 'label' ? true : undefined}
            id={`tooltip-${tooltipId}`}
          >
            {text}
          </StyledTooltip>
        </Box>
      </TooltipContext.Provider>
    )
  },
)
