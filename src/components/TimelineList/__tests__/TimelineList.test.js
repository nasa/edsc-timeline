import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineList } from '../TimelineList'
import { TimelineDataSection } from '../../TimelineDataSection/TimelineDataSection'
import { TimelineInterval } from '../../TimelineInterval/TimelineInterval'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    bindTimelineGestures: jest.fn(),
    data: [],
    draggingTimeline: false,
    draggingTemporal: false,
    draggingTemporalMarker: null,
    focusedInterval: {},
    intervalListWidthInPixels: 3,
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
    zoomLevel: 3,
    onFocusedClick: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TimelineList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelineList component', () => {
  test('renders a TimelineInterval component for each timeInterval', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(TimelineInterval).length).toEqual(props.timeIntervals.length)
  })

  test('returns null if timelineWrapperRef.current is undefined', () => {
    const { enzymeWrapper } = setup({
      timelineWrapperRef: {}
    })

    expect(enzymeWrapper.isEmptyRender()).toBeTruthy()
  })

  test('renders a TimelineInterval for a focusedInterval', () => {
    const { enzymeWrapper } = setup({
      focusedInterval: {
        start: new Date('2021-01-01').getTime()
      }
    })

    expect(enzymeWrapper.find(TimelineInterval).first().props().focused).toBeTruthy()
    expect(enzymeWrapper.find(TimelineInterval).first().props().startTime).toEqual(1609459200000)
    expect(enzymeWrapper.find(TimelineInterval).first().props().endTime).toEqual(1612137599999)
  })

  describe('temporal range mouseover', () => {
    test('renders a mouseover marker', () => {
      const { enzymeWrapper } = setup({
        temporalRangeMouseOverPosition: 42
      })

      const marker = enzymeWrapper.find('.timeline-list__temporal-mouseover-marker')

      expect(marker.exists()).toBeTruthy()
      expect(marker.props().style).toEqual({ left: 42 })
    })
  })

  describe('when the timeline is not dragging', () => {
    test('renders the correct classnames', () => {
      const { enzymeWrapper } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      expect(enzymeWrapper.props().className).not.toContain('timeline-list--is-dragging')
    })
  })

  describe('when the timeline is dragging', () => {
    test('renders the correct classnames', () => {
      const { enzymeWrapper } = setup({
        draggingTimeline: true,
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      expect(enzymeWrapper.props().className).toContain('timeline-list--is-dragging')
    })
  })

  describe('when and interval is not focused', () => {
    test('does not render the focused area or masks', () => {
      const { enzymeWrapper } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      expect(enzymeWrapper.find('.timeline-list__focused-range').length).toEqual(0)
      expect(enzymeWrapper.find('.timeline-list__focused-range-mask').length).toEqual(0)
    })
  })

  describe('Temporal markers', () => {
    test('renders markers if temporal range has start and end', () => {
      const { enzymeWrapper } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      expect(enzymeWrapper.find('.timeline-list__temporal-start').exists()).toBeTruthy()
      expect(enzymeWrapper.find('.timeline-list__temporal-end').exists()).toBeTruthy()

      expect(enzymeWrapper.find('.timeline-list__temporal-start').props().style).toEqual({
        left: 200.43835616438355
      })
      expect(enzymeWrapper.find('.timeline-list__temporal-end').props().style).toEqual({
        left: 305.75342465753425
      })
    })

    test('renders hightlighted area correctly if temporal range has start and end', () => {
      const { enzymeWrapper } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime(),
          end: new Date('2021-04').getTime()
        }
      })

      const temporalRange = enzymeWrapper.find('.timeline-list__temporal-range')

      expect(temporalRange.exists()).toBeTruthy()
      expect(temporalRange.props().style.left).toEqual(200.43835616438355)
      expect(temporalRange.props().style.width).toEqual(105.31506849315068)
    })

    test('renders only a start marker if temporal range does not have an end', () => {
      const { enzymeWrapper } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime()
        }
      })

      expect(enzymeWrapper.find('.timeline-list__temporal-start').exists()).toBeTruthy()
      expect(enzymeWrapper.find('.timeline-list__temporal-end').exists()).toBeFalsy()
    })

    test('renders hightlighted area correctly if temporal range does not have an end', () => {
      const { enzymeWrapper } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime()
        }
      })

      const temporalRange = enzymeWrapper.find('.timeline-list__temporal-range')

      expect(temporalRange.exists()).toBeTruthy()
      expect(temporalRange.props().style.left).toEqual(200.43835616438355)
      expect(temporalRange.props().style.width).toEqual(312.54794520547944)
    })

    test('renders only a end marker if temporal range does not have a start', () => {
      const { enzymeWrapper } = setup({
        temporalRange: {
          end: new Date('2021-03').getTime()
        }
      })

      expect(enzymeWrapper.find('.timeline-list__temporal-start').exists()).toBeFalsy()
      expect(enzymeWrapper.find('.timeline-list__temporal-end').exists()).toBeTruthy()
    })

    test('renders hightlighted area correctly if temporal range does not have an start', () => {
      const { enzymeWrapper } = setup({
        temporalRange: {
          end: new Date('2021-03').getTime()
        }
      })

      const temporalRange = enzymeWrapper.find('.timeline-list__temporal-range')

      expect(temporalRange.exists()).toBeTruthy()
      expect(temporalRange.props().style.left).toEqual(0)
      expect(temporalRange.props().style.width).toEqual(200.43835616438355)
    })

    describe('when the temporal markers are not dragging', () => {
      test('renders the correct classnames', () => {
        const { enzymeWrapper } = setup({
          temporalRange: {
            start: new Date('2021-03').getTime(),
            end: new Date('2021-04').getTime()
          }
        })

        const startMarker = enzymeWrapper.find('.timeline-list__temporal-start')
        const endMarker = enzymeWrapper.find('.timeline-list__temporal-end')

        expect(startMarker.props().className).not.toContain('timeline-list__temporal-marker--is-dragging')
        expect(endMarker.props().className).not.toContain('timeline-list__temporal-marker--is-dragging')
      })
    })

    describe('when the start temporal marker is dragging', () => {
      test('renders the correct classnames', () => {
        const { enzymeWrapper } = setup({
          draggingTemporalMarker: 'start',
          temporalRange: {
            start: new Date('2021-03').getTime(),
            end: new Date('2021-04').getTime()
          }
        })

        const startMarker = enzymeWrapper.find('.timeline-list__temporal-start')
        const endMarker = enzymeWrapper.find('.timeline-list__temporal-end')

        expect(startMarker.props().className).toContain('timeline-list__temporal-marker--is-dragging')
        expect(endMarker.props().className).not.toContain('timeline-list__temporal-marker--is-dragging')
      })
    })

    describe('when the end temporal marker is dragging', () => {
      test('renders the correct classnames', () => {
        const { enzymeWrapper } = setup({
          draggingTemporalMarker: 'end',
          temporalRange: {
            start: new Date('2021-03').getTime(),
            end: new Date('2021-04').getTime()
          }
        })

        const startMarker = enzymeWrapper.find('.timeline-list__temporal-start')
        const endMarker = enzymeWrapper.find('.timeline-list__temporal-end')

        expect(startMarker.props().className).not.toContain('timeline-list__temporal-marker--is-dragging')
        expect(endMarker.props().className).toContain('timeline-list__temporal-marker--is-dragging')
      })
    })
  })

  describe('Focused intervals', () => {
    test('renders a focused TimelineInterval', () => {
      const { enzymeWrapper } = setup({
        focusedInterval: {
          end: new Date('2021-03-31').getTime(),
          start: new Date('2021-03-01').getTime()
        }
      })

      expect(enzymeWrapper.find(TimelineInterval).at(2).props().focused).toBeTruthy()
    })

    test('adds the focused classname to the timeline list', () => {
      const { enzymeWrapper } = setup({
        focusedInterval: {
          end: new Date('2021-03-31').getTime(),
          start: new Date('2021-03-01').getTime()
        }
      })

      expect(enzymeWrapper.props().className).toContain('timeline-list--has-focused-interval')
    })

    test('renders an unfocusable TimelineInterval outside of the temporalRange', () => {
      const { enzymeWrapper } = setup({
        focusedInterval: {
          end: new Date('2021-03-31').getTime(),
          start: new Date('2021-03-01').getTime()
        },
        temporalRange: {
          end: new Date('2021-03-15').getTime(),
          start: new Date('2021-03-10').getTime()
        }
      })

      expect(enzymeWrapper.find(TimelineInterval).at(2).props().focused).toBeTruthy()
      expect(enzymeWrapper.find(TimelineInterval).at(0).props().focusable).toBeFalsy()
      expect(enzymeWrapper.find(TimelineInterval).at(1).props().focusable).toBeFalsy()
      expect(enzymeWrapper.find(TimelineInterval).at(3).props().focusable).toBeFalsy()
      expect(enzymeWrapper.find(TimelineInterval).at(4).props().focusable).toBeFalsy()
    })

    test('renders an the highlighted interval and masks', () => {
      const { enzymeWrapper } = setup({
        focusedInterval: {
          end: new Date('2021-03-31').getTime(),
          start: new Date('2021-03-01').getTime()
        },
        temporalRange: {
          end: new Date('2021-03-15').getTime(),
          start: new Date('2021-03-10').getTime()
        }
      })

      const focusedRange = enzymeWrapper.find('.timeline-list__focused-range')
      const focusedRangeMaskLeft = enzymeWrapper.find('.timeline-list__focused-range-mask').at(0)
      const focusedRangeMaskRight = enzymeWrapper.find('.timeline-list__focused-range-mask').at(1)

      expect(focusedRange.length).toEqual(1)
      expect(focusedRange.props().style.left).toEqual(200.43835616438355)
      expect(focusedRange.props().style.width).toEqual(103.91780821917807)

      expect(focusedRangeMaskLeft.length).toEqual(1)
      expect(focusedRangeMaskLeft.props().style.left).toEqual(0)
      expect(focusedRangeMaskLeft.props().style.width).toEqual(200.43835616438355)

      expect(focusedRangeMaskRight.length).toEqual(1)
      expect(focusedRangeMaskRight.props().style.left).toEqual(304.35616438356163)
      expect(focusedRangeMaskRight.props().style.width).toEqual(210.63013698630135)
    })
  })

  describe('Data', () => {
    test('renders data row', () => {
      const { enzymeWrapper } = setup({
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

      expect(enzymeWrapper.find(TimelineDataSection).exists()).toBeTruthy()
    })
  })
})
