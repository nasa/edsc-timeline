import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineList } from '../TimelineList'
import { TimelineInterval } from '../../TimelineInterval/TimelineInterval'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
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
    onTimelineMouseDown: jest.fn(),
    onTimelineMouseMove: jest.fn(),
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

  describe('Temporal fenceposts', () => {
    test('renders fenceposts if temporal range has start and end', () => {
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

    test('does not render fenceposts if temporal range does not have an end', () => {
      const { enzymeWrapper } = setup({
        temporalRange: {
          start: new Date('2021-03').getTime()
        }
      })

      expect(enzymeWrapper.find('.timeline-list__temporal-start').exists()).toBeFalsy()
      expect(enzymeWrapper.find('.timeline-list__temporal-end').exists()).toBeFalsy()
    })
  })
})
