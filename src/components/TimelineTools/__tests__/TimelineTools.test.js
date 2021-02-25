import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineTools } from '../TimelineTools'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    maxZoom: 5,
    minZoom: 1,
    zoomLevel: 3,
    onChangeZoomLevel: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TimelineTools {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelineTools component', () => {
  test('renders zoom buttons and the current zoom level', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.timeline__tool-label').text()).toEqual('Month')
    expect(enzymeWrapper.find('.timeline__tool-action').first().props().title).toEqual('Increase zoom level')
    expect(enzymeWrapper.find('.timeline__tool-action').last().props().title).toEqual('Decrease zoom level')
  })

  describe('Increase zoom level button', () => {
    test('calls onChangeZoomLevel', () => {
      const { enzymeWrapper, props } = setup()

      const button = enzymeWrapper.find('.timeline__tool-action').first()

      button.simulate('click')

      expect(props.onChangeZoomLevel).toHaveBeenCalledTimes(1)
      expect(props.onChangeZoomLevel).toHaveBeenCalledWith(4)
    })

    test('is disabled when the maxZoom is reached', () => {
      const { enzymeWrapper } = setup({
        zoomLevel: 5
      })

      const button = enzymeWrapper.find('.timeline__tool-action').first()

      expect(button.props().disabled).toBeTruthy()
    })
  })

  describe('Decrease zoom level button', () => {
    test('calls onChangeZoomLevel', () => {
      const { enzymeWrapper, props } = setup()

      const button = enzymeWrapper.find('.timeline__tool-action').last()

      button.simulate('click')

      expect(props.onChangeZoomLevel).toHaveBeenCalledTimes(1)
      expect(props.onChangeZoomLevel).toHaveBeenCalledWith(2)
    })

    test('is disabled when the minZoom is reached', () => {
      const { enzymeWrapper } = setup({
        zoomLevel: 1
      })

      const button = enzymeWrapper.find('.timeline__tool-action').last()

      expect(button.props().disabled).toBeTruthy()
    })
  })
})
