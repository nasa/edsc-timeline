import React from 'react'
import { render, screen, within } from '@testing-library/react'

import { TimelinePrimarySection } from '../TimelinePrimarySection'

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

  const { container } = render(<TimelinePrimarySection {...props} />)

  return {
    container,
    props
  }
}

describe('TimelinePrimarySection component', () => {
  test('renders the data row titles', () => {
    setup()

    const dataRows = screen.getAllByRole('listitem')

    expect(within(dataRows[0]).getByRole('heading', { level: 3 })).toHaveTextContent('Test Data Row 1')
    expect(within(dataRows[0]).getByRole('heading', { level: 3 })).toHaveAttribute('title', 'Test Data Row 1')

    expect(within(dataRows[1]).getByRole('heading', { level: 3 })).toHaveTextContent('Test Data Row 2')
    expect(within(dataRows[1]).getByRole('heading', { level: 3 })).toHaveAttribute('title', 'Test Data Row 2')

    expect(within(dataRows[2]).getByRole('heading', { level: 3 })).toHaveTextContent('Test Data Row 3')
    expect(within(dataRows[2]).getByRole('heading', { level: 3 })).toHaveAttribute('title', 'Test Data Row 3')
  })

  describe('when all the data is in view', () => {
    test('does not render the before arrow', () => {
      setup()

      const dataRows = screen.getAllByRole('listitem')
      const beforeMarker = dataRows[0].getElementsByClassName('edsc-timeline-primary-section__no-visible-data-marker')[0]

      expect(beforeMarker.classList.contains('edsc-timeline-primary-section__no-visible-data-marker--is-visible')).toEqual(false)
    })

    test('does not render the after arrow', () => {
      setup()

      const dataRows = screen.getAllByRole('listitem')
      const afterMarker = dataRows[0].getElementsByClassName('edsc-timeline-primary-section__no-visible-data-marker')[1]

      expect(afterMarker.classList.contains('edsc-timeline-primary-section__no-visible-data-marker--is-visible')).toEqual(false)
    })
  })

  describe('when data exists only before the current view', () => {
    test('render the before arrow', () => {
      setup({
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

      const dataRows = screen.getAllByRole('listitem')
      const beforeMarker = dataRows[0].getElementsByClassName('edsc-timeline-primary-section__no-visible-data-marker')[0]

      expect(beforeMarker.classList.contains('edsc-timeline-primary-section__no-visible-data-marker--is-visible')).toEqual(true)
    })
  })

  describe('when data exists only after the current view', () => {
    test('render the after arrow', () => {
      setup({
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

      const dataRows = screen.getAllByRole('listitem')
      const afterMarker = dataRows[0].getElementsByClassName('edsc-timeline-primary-section__no-visible-data-marker')[1]

      expect(afterMarker.classList.contains('edsc-timeline-primary-section__no-visible-data-marker--is-visible')).toEqual(true)
    })
  })

  describe('when data exists before and after the current view', () => {
    test('render both arrows', () => {
      setup({
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

      const dataRows = screen.getAllByRole('listitem')
      const beforeMarker = dataRows[0].getElementsByClassName('edsc-timeline-primary-section__no-visible-data-marker')[0]
      const afterMarker = dataRows[0].getElementsByClassName('edsc-timeline-primary-section__no-visible-data-marker')[1]

      expect(beforeMarker.classList.contains('edsc-timeline-primary-section__no-visible-data-marker--is-visible')).toEqual(true)
      expect(afterMarker.classList.contains('edsc-timeline-primary-section__no-visible-data-marker--is-visible')).toEqual(true)
    })
  })
})
