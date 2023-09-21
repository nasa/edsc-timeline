import React from 'react'
import {
  render,
  screen,
  fireEvent
} from '@testing-library/react'

import { TimelineTools } from '../TimelineTools'

function setup(overrideProps) {
  const props = {
    focusedInterval: {},
    maxZoom: 5,
    minZoom: 1,
    temporalRange: {},
    zoomLevel: 3,
    onChangeFocusedInterval: jest.fn(),
    onChangeZoomLevel: jest.fn(),
    ...overrideProps
  }

  render(<TimelineTools {...props} />)

  return {
    props
  }
}

describe('TimelineTools component', () => {
  test('renders zoom buttons and the current zoom level', () => {
    setup()

    expect(screen.getByLabelText('Zoom level')).toHaveTextContent('Month')
    expect(screen.getByLabelText('Increase zoom level')).toHaveAttribute('label', 'Increase zoom level')
    expect(screen.getByLabelText('Decrease zoom level')).toHaveAttribute('label', 'Decrease zoom level')
  })

  test('renders focused interval buttons when an interval is focused', () => {
    setup({
      focusedInterval: {
        start: new Date('2021-02').getTime(),
        end: new Date('2021-03').getTime()
      }
    })

    expect(screen.getByLabelText('Focused interval')).toHaveTextContent('Feb 2021')
    expect(screen.getByLabelText('Focus previous interval')).toHaveAttribute('label', 'Focus previous interval')
    expect(screen.getByLabelText('Focus next interval')).toHaveAttribute('label', 'Focus next interval')
  })

  describe('Increase zoom level button', () => {
    test('calls onChangeZoomLevel', () => {
      const { props } = setup()

      const button = screen.getByLabelText('Increase zoom level')

      fireEvent.click(button)

      expect(props.onChangeZoomLevel).toHaveBeenCalledTimes(1)
      expect(props.onChangeZoomLevel).toHaveBeenCalledWith(4)
    })

    test('is disabled when the maxZoom is reached', () => {
      setup({
        zoomLevel: 5
      })

      expect(screen.getByLabelText('Increase zoom level')).toBeDisabled()
    })
  })

  describe('Decrease zoom level button', () => {
    test('calls onChangeZoomLevel', () => {
      const { props } = setup()

      const button = screen.getByLabelText('Decrease zoom level')

      fireEvent(
        button,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      )

      expect(props.onChangeZoomLevel).toHaveBeenCalledTimes(1)
      expect(props.onChangeZoomLevel).toHaveBeenCalledWith(2)
    })

    test('is disabled when the minZoom is reached', () => {
      setup({
        zoomLevel: 1
      })

      expect(screen.getByLabelText('Decrease zoom level')).toBeDisabled()
    })
  })

  describe('Focus previous interval button', () => {
    test('calls onChangeFocusedInterval', () => {
      const { props } = setup({
        focusedInterval: {
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        }
      })

      const button = screen.getByLabelText('Focus previous interval')

      fireEvent(
        button,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      )

      expect(props.onChangeFocusedInterval).toHaveBeenCalledTimes(1)
      expect(props.onChangeFocusedInterval).toHaveBeenCalledWith('previous')
    })

    test('is disabled when the temporalStart is within the focusedInterval', () => {
      setup({
        focusedInterval: {
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        },
        temporalRange: {
          start: new Date('2021-02-03').getTime(),
          end: new Date('2021-05').getTime()
        }
      })

      expect(screen.getByLabelText('Focus previous interval')).toBeDisabled()
    })
  })

  describe('Focus next interval button', () => {
    test('calls onChangeFocusedInterval', () => {
      const { props } = setup({
        focusedInterval: {
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        }
      })

      const button = screen.getByLabelText('Focus next interval')

      fireEvent(
        button,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true
        })
      )

      expect(props.onChangeFocusedInterval).toHaveBeenCalledTimes(1)
      expect(props.onChangeFocusedInterval).toHaveBeenCalledWith('next')
    })

    test('is disabled when the temporalEnd is within the focusedInterval', () => {
      setup({
        focusedInterval: {
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        },
        temporalRange: {
          start: new Date('2021-01').getTime(),
          end: new Date('2021-02-15').getTime()
        }
      })

      expect(screen.getByLabelText('Focus next interval')).toBeDisabled()
    })
  })
})
