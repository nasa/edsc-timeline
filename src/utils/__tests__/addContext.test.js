import { addContext } from '../addContext'
import { formatMonth, formatYear } from '../formatters'

describe('addContext', () => {
  test('adds context to a date string when the contextMatch is true', () => {
    const date = new Date('2021-01-01')
    const contextMatch = 'Jan'
    const contextFn = () => formatYear(date)

    expect(addContext(formatMonth(date), contextMatch, contextFn)).toEqual(['Jan', '2021'])
  })

  test('does not add context to a date string when the contextMatch is false', () => {
    const date = new Date('2021-02-01')
    const contextMatch = 'Jan'
    const contextFn = () => formatYear(date)

    expect(addContext(formatMonth(date), contextMatch, contextFn)).toEqual(['Feb'])
  })
})
