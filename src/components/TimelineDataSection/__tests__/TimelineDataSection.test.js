import React from 'react'
import {
  render,
  screen,
  within
} from '@testing-library/react'
import Color from 'color'

import { TimelineDataSection } from '../TimelineDataSection'

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

  const { container } = render(<TimelineDataSection {...props} />)

  return {
    container,
    props
  }
}

describe('TimelineDataSection component', () => {
  describe('when a single data row is added', () => {
    test('renders data row', () => {
      setup({
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

      const dataRow = screen.getByTestId('timeline-data-section__entry')
      const intervals = screen.getAllByTestId('timeline-data-section__interval')

      expect(dataRow).toBeInTheDocument()
      expect(intervals.length).toEqual(2)
    })

    test('renders data in the correct position', () => {
      setup({
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

      const intervals = screen.getAllByTestId('timeline-data-section__interval')
      const firstDataChild = intervals[0]
      const secondDataChild = intervals[1]

      expect(intervals.length).toEqual(2)
      expect(firstDataChild.style.left).toEqual('68.4931506849315px')
      expect(firstDataChild.style.width).toEqual('12.32876712328767px')
      expect(secondDataChild.style.left).toEqual('82.1917808219178px')
      expect(secondDataChild.style.width).toEqual('10.95890410958904px')
    })

    test('sets a default color', () => {
      setup({
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

      // Testing-library converts the hex value to rgb so we need to check as rgb
      const color = Color('#25c85b').string()

      const interval = screen.getAllByTestId('timeline-data-section__interval')[0]
      expect(interval.style.backgroundColor).toEqual(color)
    })

    describe('when a single data row is added', () => {
      test('sets a custom color', () => {
        setup({
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

        const interval = screen.getAllByTestId('timeline-data-section__interval')[0]
        expect(interval.style.backgroundColor).toEqual('red')
      })
    })

    describe('when a multiple data rows are added', () => {
      test('renders data rows', () => {
        setup({
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

        const dataRows = screen.getAllByTestId('timeline-data-section__entry')
        const firstDataRow = dataRows[0]
        const secondDataRow = dataRows[1]

        expect(dataRows.length).toEqual(2)
        expect(firstDataRow).toBeInTheDocument()
        expect(secondDataRow).toBeInTheDocument()
        expect(within(firstDataRow).getAllByTestId('timeline-data-section__interval').length).toEqual(2)
        expect(within(secondDataRow).getAllByTestId('timeline-data-section__interval').length).toEqual(3)
      })
    })
  })
})
