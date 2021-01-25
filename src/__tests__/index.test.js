import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import EDSCTimeline from '../index'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {}

  const enzymeWrEDSCTimelineer = shallow(<EDSCTimeline {...props} />)

  return {
    enzymeWrEDSCTimelineer,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('EDSCTimeline component', () => {
  test('renders hello', () => {
    const { enzymeWrEDSCTimelineer } = setup()

    expect(enzymeWrEDSCTimelineer.find('h3').text()).toEqual('Coming Soon!')
  })
})
