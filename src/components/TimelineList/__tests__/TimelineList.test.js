import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineList } from '../TimelineList'
import { TimelineInterval } from '../../TimelineInterval/TimelineInterval'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    intervalListWidthInPixels: 3,
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
      current: {}
    },
    zoomLevel: 3,
    onTimelineMouseDown: jest.fn(),
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
})
