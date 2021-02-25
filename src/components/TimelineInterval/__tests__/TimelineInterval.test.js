import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineInterval } from '../TimelineInterval'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    startTime: new Date('2021-01-01').getTime(),
    endTime: new Date('2021-01-02').getTime(),
    timelineWrapperRef: {
      current: {
        getBoundingClientRect: jest.fn(() => ({ width: 100 }))
      }
    },
    zIndex: 0,
    zoomLevel: 3,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TimelineInterval {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelineInterval component', () => {
  test('renders the interval text', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.timeline__interval-label').text()).toEqual('Jan')
    expect(enzymeWrapper.find('.timeline__interval-section-label').text()).toEqual('2021')
  })
})
