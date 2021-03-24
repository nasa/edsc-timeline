import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelinePrimarySection } from '../TimelinePrimarySection'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    data: [
      {
        id: 'row1',
        title: 'Test Data Row 1',
        intervals: []
      },
      {
        id: 'row2',
        title: 'Test Data Row 2',
        intervals: []
      },
      {
        id: 'row3',
        title: 'Test Data Row 3',
        intervals: []
      }
    ],
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TimelinePrimarySection {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelinePrimarySection component', () => {
  test('renders the data row titles', () => {
    const { enzymeWrapper } = setup()

    const dataRows = enzymeWrapper.find('.timeline-primary-section__entry')

    expect(dataRows.at(0).text()).toEqual('Test Data Row 1')
    expect(dataRows.at(0).props().title).toEqual('Test Data Row 1')

    expect(dataRows.at(1).text()).toEqual('Test Data Row 2')
    expect(dataRows.at(1).props().title).toEqual('Test Data Row 2')

    expect(dataRows.at(2).text()).toEqual('Test Data Row 3')
    expect(dataRows.at(2).props().title).toEqual('Test Data Row 3')
  })
})
