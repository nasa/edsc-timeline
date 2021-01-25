import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import EDSCTimeline from '../index'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {}

  const enzymeWrapper = shallow(<EDSCTimeline {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('EDSCTimeline component', () => {
  test('renders hello', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('h3').text()).toEqual('Coming Soon!')
  })
})
