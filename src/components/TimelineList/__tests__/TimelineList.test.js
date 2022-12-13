jest.mock('../../TimelineDataSection/TimelineDataSection', () => ({
  TimelineDataSection: jest.fn(() => (
    <mock-TimelineDataSection data-testid="TimelineDataSection" />
  ))
}))

jest.mock('../../TimelineInterval/TimelineInterval', () => ({
  TimelineInterval: jest.fn(() => (
    <mock-TimelineInterval data-testid="TimelineInterval" />
  ))
}))

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

import { TimelineList } from '../TimelineList'
import { TimelineInterval } from '../../TimelineInterval/TimelineInterval'

beforeEach(() => {
  jest.clearAllMocks()
})

function setup(overrideProps) {
  const props = {
    bindTimelineGestures: jest.fn(),
    data: [],
    draggingTimeline: false,
    draggingTemporal: false,
    draggingTemporalMarker: '',
    focusedInterval: {},
    intervalListWidthInPixels: 3,
    preventTemporalSelectionHover: false,
    temporalRange: {},
    temporalRangeMouseOverPosition: null,
    timeIntervals: [
      new Date('2021-01-01').getTime(),
      new Date('2021-02-01').getTime(),
      new Date('2021-03-01').getTime(),
      new Date('2021-04-01').getTime(),
      new Date('2021-05-01').getTime()
    ],
    timelineListRef: {},
    timelinePosition: {},
    timelineWrapperRef: {
      current: {
        getBoundingClientRect: jest.fn(() => ({ width: 1240 }))
      }
    },
    willCancelTemporalSelection: false,
    zoomLevel: 3,
    onFocusedClick: jest.fn(),
    onTemporalRangeHover: jest.fn(),
    onTemporalMarkerHover: jest.fn(),
    ...overrideProps
  }

  const { container } = render(<TimelineList {...props} />)

  return {
    container,
    props
  }
}

describe('TimelineList component', () => {
  test('renders a TimelineInterval component for each timeInterval', () => {
    const { props } = setup()

    expect(screen.getAllByTestId('TimelineInterval').length).toEqual(props.timeIntervals.length)
  })

  test('returns null if timelineWrapperRef.current is undefined', () => {
    const { container } = setup({
      timelineWrapperRef: {}
    })

    expect(container).toBeEmptyDOMElement()
  })

  test('renders a TimelineInterval for a focusedInterval', () => {
    setup({
      focusedInterval: {
        start: new Date('2021-01-01').getTime()
      }
    })

    expect(TimelineInterval)
      .toHaveBeenNthCalledWith(1, expect.objectContaining({
        focused: true,
        startTime: 1609459200000,
        endTime: 1612137599999
      }), {})
  })

  describe('temporal range mouseover', () => {
    test('renders a mouseover marker', () => {
      setup({
        temporalRangeMouseOverPosition: 42
      })

      const marker = screen.getByLabelText('Set temporal range')

      expect(marker).toBeInTheDocument()
      expect(marker.style.left).toEqual('42px')
    })
  })

  describe('when the timeline is not dragging', () => {
    test('renders the correct classnames', () => {
      const { container } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      expect(container.firstChild.classList.contains('edsc-timeline-list--is-dragging')).toEqual(false)
    })
  })

  describe('when the timeline is dragging', () => {
    test('renders the correct classnames', () => {
      const { container } = setup({
        draggingTimeline: true,
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      expect(container.firstChild.classList.contains('edsc-timeline-list--is-dragging')).toEqual(true)
    })
  })

  describe('when and interval is not focused', () => {
    test('does not render the focused area or masks', () => {
      const { container } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      expect(container.getElementsByClassName('edsc-timeline-list__focused-range').length).toEqual(0)
      expect(container.getElementsByClassName('edsc-timeline-list__focused-range-mask').length).toEqual(0)
    })
  })

  describe('Temporal markers', () => {
    test('renders markers if temporal range has start and end', () => {
      setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      const startMarker = screen.getByLabelText('Temporal range start')
      const endMarker = screen.getByLabelText('Temporal range end')

      expect(startMarker).toBeInTheDocument()
      expect(startMarker.style.left).toEqual('200.43835616438355px')
      expect(endMarker).toBeInTheDocument()
      expect(endMarker.style.left).toEqual('305.75342465753425px')
    })

    test('renders highlighted area correctly if temporal range has start and end', () => {
      const { container } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      const temporalRange = container.getElementsByClassName('edsc-timeline-list__temporal-range')[0]

      expect(temporalRange).toBeInTheDocument()
      expect(temporalRange.style.left).toEqual('200.43835616438355px')
      expect(temporalRange.style.width).toEqual('105.31506849315068px')
    })

    test('renders only a start marker if temporal range does not have an end', () => {
      setup({
        temporalRange: {
          start: new Date('2021-03').getTime()
        }
      })

      const startMarker = screen.queryByLabelText('Temporal range start')
      const endMarker = screen.queryByLabelText('Temporal range end')

      expect(startMarker).toBeInTheDocument()
      expect(endMarker).not.toBeInTheDocument()
    })

    test('renders highlighted area correctly if temporal range does not have an end', () => {
      const { container } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime()
        }
      })

      const temporalRange = container.getElementsByClassName('edsc-timeline-list__temporal-range')[0]

      expect(temporalRange).toBeInTheDocument()
      expect(temporalRange.style.left).toEqual('200.43835616438355px')
      expect(temporalRange.style.width).toEqual('312.54794520547944px')
    })

    test('renders only a end marker if temporal range does not have a start', () => {
      setup({
        temporalRange: {
          end: new Date('2021-03').getTime()
        }
      })

      const startMarker = screen.queryByLabelText('Temporal range start')
      const endMarker = screen.queryByLabelText('Temporal range end')

      expect(startMarker).not.toBeInTheDocument()
      expect(endMarker).toBeInTheDocument()
    })

    test('renders highlighted area correctly if temporal range does not have an start', () => {
      const { container } = setup({
        temporalRange: {
          end: new Date('2021-03').getTime()
        }
      })

      const temporalRange = container.getElementsByClassName('edsc-timeline-list__temporal-range')[0]

      expect(temporalRange).toBeInTheDocument()
      expect(temporalRange.style.left).toEqual('0px')
      expect(temporalRange.style.width).toEqual('200.43835616438355px')
    })

    describe('when the temporal markers are not dragging', () => {
      test('renders the correct classnames', () => {
        setup({
          temporalRange: {
            start: new Date('2021-03').getTime(),
            end: new Date('2021-04').getTime()
          }
        })

        const startMarker = screen.queryByLabelText('Temporal range start')
        const endMarker = screen.queryByLabelText('Temporal range end')

        expect(startMarker.classList.contains('edsc-timeline-list__temporal-marker--is-dragging')).toEqual(false)
        expect(endMarker.classList.contains('edsc-timeline-list__temporal-marker--is-dragging')).toEqual(false)
      })
    })

    describe('when the start temporal marker is dragging', () => {
      test('renders the correct classnames', () => {
        setup({
          draggingTemporalMarker: 'start',
          temporalRange: {
            start: new Date('2021-03').getTime(),
            end: new Date('2021-04').getTime()
          }
        })

        const startMarker = screen.queryByLabelText('Temporal range start')
        const endMarker = screen.queryByLabelText('Temporal range end')

        expect(startMarker.classList.contains('edsc-timeline-list__temporal-marker--is-dragging')).toEqual(true)
        expect(endMarker.classList.contains('edsc-timeline-list__temporal-marker--is-dragging')).toEqual(false)
      })
    })

    describe('when the end temporal marker is dragging', () => {
      test('renders the correct classnames', () => {
        setup({
          draggingTemporalMarker: 'end',
          temporalRange: {
            start: new Date('2021-03').getTime(),
            end: new Date('2021-04').getTime()
          }
        })

        const startMarker = screen.queryByLabelText('Temporal range start')
        const endMarker = screen.queryByLabelText('Temporal range end')

        expect(startMarker.classList.contains('edsc-timeline-list__temporal-marker--is-dragging')).toEqual(false)
        expect(endMarker.classList.contains('edsc-timeline-list__temporal-marker--is-dragging')).toEqual(true)
      })
    })

    test('start marker triggers the hover handler', () => {
      const { props } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      const startMarker = screen.getByLabelText('Temporal range start')

      fireEvent.pointerEnter(startMarker)

      expect(props.onTemporalMarkerHover).toHaveBeenCalledTimes(1)
      expect(props.onTemporalMarkerHover).toHaveBeenCalledWith(
        {
          hovering: true,
          marker: 'start'
        }
      )
    })

    test('end marker triggers the hover handler', () => {
      const { props } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      const endMarker = screen.getByLabelText('Temporal range end')

      fireEvent.pointerEnter(endMarker)

      expect(props.onTemporalMarkerHover).toHaveBeenCalledTimes(1)
      expect(props.onTemporalMarkerHover).toHaveBeenCalledWith(
        {
          hovering: true,
          marker: 'end'
        }
      )
    })
  })

  describe('Temporal range', () => {
    test('triggers the hover handler', () => {
      const { container, props } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      const temporalRange = container.getElementsByClassName('edsc-timeline-list__temporal-range')[0]

      fireEvent.pointerEnter(temporalRange)

      expect(props.onTemporalRangeHover).toHaveBeenCalledTimes(1)
      expect(props.onTemporalRangeHover).toHaveBeenCalledWith({ hovering: true })
    })
  })

  describe('Focused intervals', () => {
    test('renders a focused TimelineInterval', () => {
      setup({
        focusedInterval: {
          end: new Date('2021-03-31').getTime(),
          start: new Date('2021-03-01').getTime()
        }
      })

      expect(TimelineInterval)
        .toHaveBeenNthCalledWith(3, expect.objectContaining({ focused: true }), {})
    })

    test('adds the focused classname to the timeline list', () => {
      const { container } = setup({
        focusedInterval: {
          end: new Date('2021-03-31').getTime(),
          start: new Date('2021-03-01').getTime()
        }
      })

      expect(container.firstChild.classList.contains('edsc-timeline-list--has-focused-interval')).toEqual(true)
    })

    test('renders an unfocusable TimelineInterval outside of the temporalRange', () => {
      setup({
        focusedInterval: {
          end: new Date('2021-03-31').getTime(),
          start: new Date('2021-03-01').getTime()
        },
        temporalRange: {
          end: new Date('2021-03-15').getTime(),
          start: new Date('2021-03-10').getTime()
        }
      })

      expect(TimelineInterval)
        .toHaveBeenNthCalledWith(1, expect.objectContaining({ focusable: false }), {})
      expect(TimelineInterval)
        .toHaveBeenNthCalledWith(2, expect.objectContaining({ focusable: false }), {})
      expect(TimelineInterval)
        .toHaveBeenNthCalledWith(3, expect.objectContaining({ focused: true }), {})
      expect(TimelineInterval)
        .toHaveBeenNthCalledWith(4, expect.objectContaining({ focusable: false }), {})
      expect(TimelineInterval)
        .toHaveBeenNthCalledWith(5, expect.objectContaining({ focusable: false }), {})
    })

    test('renders an the highlighted interval and masks', () => {
      const { container } = setup({
        focusedInterval: {
          end: new Date('2021-03-31').getTime(),
          start: new Date('2021-03-01').getTime()
        },
        temporalRange: {
          end: new Date('2021-03-15').getTime(),
          start: new Date('2021-03-10').getTime()
        }
      })

      const focusedRange = container.getElementsByClassName('edsc-timeline-list__focused-range')[0]
      const focusedRangeMaskLeft = container.getElementsByClassName('edsc-timeline-list__focused-range-mask')[0]
      const focusedRangeMaskRight = container.getElementsByClassName('edsc-timeline-list__focused-range-mask')[1]

      expect(focusedRange).toBeInTheDocument()
      expect(focusedRange.style.left).toEqual('200.43835616438355px')
      expect(focusedRange.style.width).toEqual('103.91780821917807px')

      expect(focusedRangeMaskLeft).toBeInTheDocument()
      expect(focusedRangeMaskLeft.style.left).toEqual('0px')
      expect(focusedRangeMaskLeft.style.width).toEqual('200.43835616438355px')

      expect(focusedRangeMaskRight).toBeInTheDocument()
      expect(focusedRangeMaskRight.style.left).toEqual('304.35616438356163px')
      expect(focusedRangeMaskRight.style.width).toEqual('210.63013698630135px')
    })

    describe('Data', () => {
      test('renders data row', () => {
        setup({
          data: [
            {
              id: 'row1',
              title: 'Test Data Row 1',
              intervals: [
                [
                  new Date('2021-02-20').getTime(),
                  new Date('2021-02-29').getTime(),
                  42
                ],
                [
                  new Date('2021-03-02').getTime(),
                  new Date('2021-03-10').getTime(),
                  50
                ]
              ]
            }
          ]
        })

        expect(screen.getByTestId('TimelineDataSection')).toBeInTheDocument()
      })
    })
  })
})
