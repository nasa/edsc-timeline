import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelinePrimarySection } from '../TimelinePrimarySection'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {}

  const enzymeWrapper = shallow(<TimelineTools {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelineTools component', () => {
  test('renders zoom buttons and the current zoom level', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.timeline-tools__label').text()).toEqual('Month')
    expect(enzymeWrapper.find('.timeline-tools__action').first().props().title).toEqual('Increase zoom level')
    expect(enzymeWrapper.find('.timeline-tools__action').last().props().title).toEqual('Decrease zoom level')
  })
})
