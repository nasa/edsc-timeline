import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineInterval } from '../TimelineInterval'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    focused: false,
    startTime: new Date('2021-01-01').getTime(),
    endTime: new Date('2021-01-02').getTime(),
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

  test('renders a focused interval', () => {
    const { enzymeWrapper } = setup({ focused: true })

    expect(enzymeWrapper.find('.timeline__interval--is-focused').exists()).toBeTruthy()
    expect(enzymeWrapper.find('.timeline__interval-label').text()).toEqual('Jan')
    expect(enzymeWrapper.find('.timeline__interval-section-label').text()).toEqual('2021')
  })
})
