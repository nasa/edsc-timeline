import React from 'react'
import {
  fireEvent,
  render,
  screen
} from '@testing-library/react'

import { TimelineInterval } from '../TimelineInterval'

function setup(overrideProps) {
  const props = {
    focusable: true,
    focused: false,
    startTime: new Date('2021-01-01').getTime(),
    endTime: new Date('2021-01-02').getTime() - 1,
    timelineWrapperRef: {
      current: {
        getBoundingClientRect: jest.fn(() => ({ width: 100 }))
      }
    },
    zIndex: 0,
    zoomLevel: 3,
    onFocusedClick: jest.fn(),
    ...overrideProps
  }

  const { container } = render(<TimelineInterval {...props} />)

  return {
    container,
    props
  }
}

describe('TimelineInterval component', () => {
  test('renders the interval text', () => {
    setup()

    expect(screen.getByText('Jan')).toBeInTheDocument()
    expect(screen.getByText('2021')).toBeInTheDocument()
  })

  test('renders a focused interval', () => {
    const { container } = setup({ focused: true })

    expect(container.firstChild.classList.contains('edsc-timeline-interval--is-focused')).toEqual(true)
  })

  test('renders the unfocusable class when the interval cannot be focused', () => {
    const { container } = setup({ focusable: false })

    expect(container.firstChild.classList.contains('edsc-timeline-interval--is-unfocusable')).toEqual(true)
  })

  describe('handleFocusedClick', () => {
    test('calls onFocusedClick', () => {
      const { props } = setup()

      const intervalButton = screen.getByLabelText('Focus interval')

      fireEvent.click(intervalButton)

      expect(props.onFocusedClick).toHaveBeenCalledTimes(1)
      expect(props.onFocusedClick).toHaveBeenCalledWith({
        end: 1609545599999,
        start: 1609459200000
      })
    })

    test('does not call onFocusedClick when not focusable', () => {
      const { props } = setup({
        focusable: false
      })

      const intervalButton = screen.getByLabelText('Focus interval')

      fireEvent.click(intervalButton)

      expect(props.onFocusedClick).toHaveBeenCalledTimes(0)
    })
  })
})
