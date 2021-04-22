import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { TimelineDataSection } from '../TimelineDataSection'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    data: [],
    timelineWrapperWidth: 500,
    timeIntervals: [
      new Date('2021-01-01').getTime(),
      new Date('2021-02-01').getTime(),
      new Date('2021-03-01').getTime(),
      new Date('2021-04-01').getTime(),
      new Date('2021-05-01').getTime()
    ],
    zoomLevel: 3,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TimelineDataSection {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TimelineDataSection component', () => {
  describe('when a single data row is added', () => {
    test('renders data row', () => {
      const { enzymeWrapper } = setup({
        data: [
          {
            id: 'row1',
            title: 'Test Data Row 1',
            intervals: [
              [
                new Date('2021-02-20').getTime(),
                new Date('2021-02-29').getTime(),
                42
              ],
              [
                new Date('2021-03-02').getTime(),
                new Date('2021-03-10').getTime(),
                50
              ]
            ]
          }
        ]
      })

      const dataRow = enzymeWrapper.find('.edsc-timeline-data-section__entry')
      expect(dataRow.exists()).toBeTruthy()
      expect(dataRow.length).toEqual(1)
      expect(dataRow.children().length).toEqual(2)
    })

    test('renders data in the correct position', () => {
      const { enzymeWrapper } = setup({
        data: [
          {
            id: 'row1',
            title: 'Test Data Row 1',
            intervals: [
              [
                new Date('2021-02-20').getTime(),
                new Date('2021-02-29').getTime(),
                42
              ],
              [
                new Date('2021-03-02').getTime(),
                new Date('2021-03-10').getTime(),
                50
              ]
            ]
          }
        ]
      })

      const dataRow = enzymeWrapper.find('.edsc-timeline-data-section__entry')
      expect(dataRow.exists()).toBeTruthy()
      expect(dataRow.length).toEqual(1)

      const firstDataChild = dataRow.childAt(0)
      expect(firstDataChild.props().style.left).toEqual(68.4931506849315)
      expect(firstDataChild.props().style.width).toEqual(12.32876712328767)

      const secondDataChild = dataRow.childAt(1)
      expect(secondDataChild.props().style.left).toEqual(82.1917808219178)
      expect(secondDataChild.props().style.width).toEqual(10.95890410958904)
    })

    test('sets a default color', () => {
      const { enzymeWrapper } = setup({
        data: [
          {
            id: 'row1',
            title: 'Test Data Row 1',
            intervals: [
              [
                new Date('2021-02-20').getTime(),
                new Date('2021-02-29').getTime(),
                42
              ],
              [
                new Date('2021-03-02').getTime(),
                new Date('2021-03-10').getTime(),
                50
              ]
            ]
          }
        ]
      })

      const dataRow = enzymeWrapper.find('.edsc-timeline-data-section__entry')
      const firstDataChild = dataRow.childAt(0)
      expect(firstDataChild.props().style.backgroundColor).toEqual('#25c85b')
    })
  })

  describe('when a single data row is added', () => {
    const { enzymeWrapper } = setup({
      data: [
        {
          id: 'row1',
          color: 'red',
          title: 'Test Data Row 1',
          intervals: [
            [
              new Date('2021-02-20').getTime(),
              new Date('2021-02-29').getTime(),
              42
            ],
            [
              new Date('2021-03-02').getTime(),
              new Date('2021-03-10').getTime(),
              50
            ]
          ]
        }
      ]
    })

    const dataRow = enzymeWrapper.find('.edsc-timeline-data-section__entry')

    test('sets a custom color', () => {
      const firstDataChild = dataRow.childAt(0)
      expect(firstDataChild.props().style.backgroundColor).toEqual('red')
    })
  })

  describe('when a multiple data rows are added', () => {
    const { enzymeWrapper } = setup({
      data: [
        {
          id: 'row1',
          title: 'Test Data Row 1',
          intervals: [
            [
              new Date('2021-02-20').getTime(),
              new Date('2021-02-29').getTime(),
              42
            ],
            [
              new Date('2021-03-02').getTime(),
              new Date('2021-03-10').getTime(),
              50
            ]
          ]
        },
        {
          id: 'row2',
          title: 'Test Data Row 2',
          intervals: [
            [
              new Date('2021-02-22').getTime(),
              new Date('2021-02-23').getTime(),
              15
            ],
            [
              new Date('2021-03-02').getTime(),
              new Date('2021-03-13').getTime(),
              32
            ],
            [
              new Date('2021-03-14').getTime(),
              new Date('2021-03-15').getTime(),
              10
            ]
          ]
        }
      ]
    })

    const dataRow = enzymeWrapper.find('.edsc-timeline-data-section__entry')

    test('renders data row', () => {
      expect(dataRow.exists()).toBeTruthy()
      expect(dataRow.length).toEqual(2)
      expect(dataRow.at(0).children().length).toEqual(2)
      expect(dataRow.at(1).children().length).toEqual(3)
    })
  })
})
