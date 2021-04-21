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
        intervals: [
          [
            new Date('2020-01-01').getTime(),
            new Date('2020-01-02').getTime(),
            10
          ],
          [
            new Date('2020-01-03').getTime(),
            new Date('2020-01-04').getTime(),
            10
          ]
        ]
      },
      {
        id: 'row2',
        title: 'Test Data Row 2',
        intervals: [],
        color: 'red'
      },
      {
        id: 'row3',
        title: 'Test Data Row 3',
        intervals: [],
        color: 'blue'
      }
    ],
    visibleTemporalRange: {
      end: new Date('2020-01-01').getTime(),
      start: new Date('2021-01-01').getTime()
    },
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

    const dataRows = enzymeWrapper.find('.edsc-timeline-primary-section__entry')

    expect(dataRows.at(0).find('.edsc-timeline-primary-section__title').text()).toEqual('Test Data Row 1')
    expect(dataRows.at(0).find('.edsc-timeline-primary-section__title').props().title).toEqual('Test Data Row 1')

    expect(dataRows.at(1).find('.edsc-timeline-primary-section__title').text()).toEqual('Test Data Row 2')
    expect(dataRows.at(1).find('.edsc-timeline-primary-section__title').props().title).toEqual('Test Data Row 2')

    expect(dataRows.at(2).find('.edsc-timeline-primary-section__title').text()).toEqual('Test Data Row 3')
    expect(dataRows.at(2).find('.edsc-timeline-primary-section__title').props().title).toEqual('Test Data Row 3')
  })

  describe('when all the data is in view', () => {
    test('does not render the before arrow', () => {
      const { enzymeWrapper } = setup()

      const dataRows = enzymeWrapper.find('.edsc-timeline-primary-section__entry')

      const beforeMarker = dataRows.at(0).find('.edsc-timeline-primary-section__no-visible-data-marker').at(0)

      expect(beforeMarker.props().className).not.toContain('edsc-timeline-primary-section__no-visible-data-marker--is-visible')
    })

    test('does not render the after arrow', () => {
      const { enzymeWrapper } = setup()

      const dataRows = enzymeWrapper.find('.edsc-timeline-primary-section__entry')

      const afterMarker = dataRows.at(0).find('.edsc-timeline-primary-section__no-visible-data-marker').at(1)

      expect(afterMarker.props().className).not.toContain('edsc-timeline-primary-section__no-visible-data-marker--is-visible')
    })
  })

  describe('when data exists only before the current view', () => {
    test('render the before arrow', () => {
      const { enzymeWrapper } = setup({
        data: [
          {
            id: 'row1',
            title: 'Test Data Row 1',
            intervals: [
              [
                new Date('2019-12-30').getTime(),
                new Date('2019-12-31').getTime(),
                10
              ]
            ]
          }
        ]
      })

      const dataRows = enzymeWrapper.find('.edsc-timeline-primary-section__entry')

      const beforeMarker = dataRows.at(0).find('.edsc-timeline-primary-section__no-visible-data-marker').at(0)

      expect(beforeMarker.props().className).toContain('edsc-timeline-primary-section__no-visible-data-marker--is-visible')
    })
  })

  describe('when data exists only after the current view', () => {
    test('render the after arrow', () => {
      const { enzymeWrapper } = setup({
        data: [
          {
            id: 'row1',
            title: 'Test Data Row 1',
            intervals: [
              [
                new Date('2021-01-01').getTime(),
                new Date('2021-01-02').getTime(),
                10
              ]
            ]
          }
        ]
      })

      const dataRows = enzymeWrapper.find('.edsc-timeline-primary-section__entry')

      const afterMarker = dataRows.at(0).find('.edsc-timeline-primary-section__no-visible-data-marker').at(1)

      expect(afterMarker.props().className).toContain('edsc-timeline-primary-section__no-visible-data-marker--is-visible')
    })
  })

  describe('when data exists before and after the current view', () => {
    test('render both arrows', () => {
      const { enzymeWrapper } = setup({
        data: [
          {
            id: 'row1',
            title: 'Test Data Row 1',
            intervals: [
              [
                new Date('2019-12-30').getTime(),
                new Date('2019-12-31').getTime(),
                10
              ],
              [
                new Date('2021-01-01').getTime(),
                new Date('2021-01-02').getTime(),
                10
              ]
            ]
          }
        ]
      })

      const dataRows = enzymeWrapper.find('.edsc-timeline-primary-section__entry')

      const beforeMarker = dataRows.at(0).find('.edsc-timeline-primary-section__no-visible-data-marker').at(1)
      const afterMarker = dataRows.at(0).find('.edsc-timeline-primary-section__no-visible-data-marker').at(1)

      expect(beforeMarker.props().className).toContain('edsc-timeline-primary-section__no-visible-data-marker--is-visible')
      expect(afterMarker.props().className).toContain('edsc-timeline-primary-section__no-visible-data-marker--is-visible')
    })
  })
})
