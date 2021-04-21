import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineInterval } from '../TimelineInterval'

Enzyme.configure({ adapter: new Adapter() })

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

  const enzymeWrapper = shallow(<TimelineInterval {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelineInterval component', () => {
  test('renders the interval text', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.edsc-timeline-interval__interval-label').text()).toEqual('Jan')
    expect(enzymeWrapper.find('.edsc-timeline-interval__interval-section-label').text()).toEqual('2021')
  })

  test('renders a focused interval', () => {
    const { enzymeWrapper } = setup({ focused: true })

    expect(enzymeWrapper.find('.edsc-timeline-interval--is-focused').exists()).toBeTruthy()
    expect(enzymeWrapper.find('.edsc-timeline-interval__interval-label').text()).toEqual('Jan')
    expect(enzymeWrapper.find('.edsc-timeline-interval__interval-section-label').text()).toEqual('2021')
  })

  test('renders the unfocusable class when the interval cannot be focused', () => {
    const { enzymeWrapper } = setup({ focusable: false })

    expect(enzymeWrapper.props().className).toContain('edsc-timeline-interval--is-unfocusable')
  })

  describe('handleFocusedClick', () => {
    test('calls onFocusedClick', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.edsc-timeline-interval__interval-bottom').invoke('onClick')({ mock: 'event' })

      expect(props.onFocusedClick).toHaveBeenCalledTimes(1)
      expect(props.onFocusedClick).toHaveBeenCalledWith({
        end: 1609545599999,
        start: 1609459200000
      })
    })

    test('does not call onFocusedClick when not focusable', () => {
      const { enzymeWrapper, props } = setup({
        focusable: false
      })

      enzymeWrapper.find('.edsc-timeline-interval__interval-bottom').invoke('onClick')({ mock: 'event' })

      expect(props.onFocusedClick).toHaveBeenCalledTimes(0)
    })
  })
})
