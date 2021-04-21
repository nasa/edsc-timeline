import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineTools } from '../TimelineTools'

Enzyme.configure({ adapter: new Adapter() })

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

  const enzymeWrapper = shallow(<TimelineTools {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelineTools component', () => {
  test('renders zoom buttons and the current zoom level', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.edsc-timeline-tools__label').text()).toEqual('Month')
    expect(enzymeWrapper.find('.edsc-timeline-tools__action').first().props().title).toEqual('Increase zoom level')
    expect(enzymeWrapper.find('.edsc-timeline-tools__action').last().props().title).toEqual('Decrease zoom level')
  })

  test('renders focused interval buttons when an interval is focused', () => {
    const { enzymeWrapper } = setup({
      focusedInterval: {
        start: new Date('2021-02').getTime(),
        end: new Date('2021-03').getTime()
      }
    })

    expect(enzymeWrapper.find('.edsc-timeline-tools__label').last().text()).toEqual('Feb 2021')
    expect(enzymeWrapper.find('.edsc-timeline-tools__action').at(2).props().title).toEqual('Focus previous interval')
    expect(enzymeWrapper.find('.edsc-timeline-tools__action').last().props().title).toEqual('Focus next interval')
  })

  describe('Increase zoom level button', () => {
    test('calls onChangeZoomLevel', () => {
      const { enzymeWrapper, props } = setup()

      const button = enzymeWrapper.find('.edsc-timeline-tools__action').first()

      button.simulate('click')

      expect(props.onChangeZoomLevel).toHaveBeenCalledTimes(1)
      expect(props.onChangeZoomLevel).toHaveBeenCalledWith(4)
    })

    test('is disabled when the maxZoom is reached', () => {
      const { enzymeWrapper } = setup({
        zoomLevel: 5
      })

      const button = enzymeWrapper.find('.edsc-timeline-tools__action').first()

      expect(button.props().disabled).toBeTruthy()
    })
  })

  describe('Decrease zoom level button', () => {
    test('calls onChangeZoomLevel', () => {
      const { enzymeWrapper, props } = setup()

      const button = enzymeWrapper.find('.edsc-timeline-tools__action').last()

      button.simulate('click')

      expect(props.onChangeZoomLevel).toHaveBeenCalledTimes(1)
      expect(props.onChangeZoomLevel).toHaveBeenCalledWith(2)
    })

    test('is disabled when the minZoom is reached', () => {
      const { enzymeWrapper } = setup({
        zoomLevel: 1
      })

      const button = enzymeWrapper.find('.edsc-timeline-tools__action').last()

      expect(button.props().disabled).toBeTruthy()
    })
  })

  describe('Focus previous interval button', () => {
    test('calls onChangeFocusedInterval', () => {
      const { enzymeWrapper, props } = setup({
        focusedInterval: {
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        }
      })

      const button = enzymeWrapper.find('.edsc-timeline-tools__action').at(2)

      button.simulate('click')

      expect(props.onChangeFocusedInterval).toHaveBeenCalledTimes(1)
      expect(props.onChangeFocusedInterval).toHaveBeenCalledWith('previous')
    })

    test('is disabled when the temporalStart is within the focusedInterval', () => {
      const { enzymeWrapper } = setup({
        focusedInterval: {
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        },
        temporalRange: {
          start: new Date('2021-02-03').getTime(),
          end: new Date('2021-05').getTime()
        }
      })

      const button = enzymeWrapper.find('.edsc-timeline-tools__action').at(2)

      expect(button.props().disabled).toBeTruthy()
    })
  })

  describe('Focus next interval button', () => {
    test('calls onChangeFocusedInterval', () => {
      const { enzymeWrapper, props } = setup({
        focusedInterval: {
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        }
      })

      const button = enzymeWrapper.find('.edsc-timeline-tools__action').at(3)

      button.simulate('click')

      expect(props.onChangeFocusedInterval).toHaveBeenCalledTimes(1)
      expect(props.onChangeFocusedInterval).toHaveBeenCalledWith('next')
    })

    test('is disabled when the temporalEnd is within the focusedInterval', () => {
      const { enzymeWrapper } = setup({
        focusedInterval: {
          start: new Date('2021-02').getTime(),
          end: new Date('2021-03').getTime()
        },
        temporalRange: {
          start: new Date('2021-01').getTime(),
          end: new Date('2021-02-15').getTime()
        }
      })

      const button = enzymeWrapper.find('.edsc-timeline-tools__action').at(3)

      expect(button.props().disabled).toBeTruthy()
    })
  })
})
