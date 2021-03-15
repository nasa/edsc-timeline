import { getIntervalBounds } from '../getIntervalBounds'

describe('getIntervalBounds', () => {
  test('returns the correct bounds', () => {
    const intervals = [
      new Date('2021-04-01').getTime(),
      new Date('2021-05-01').getTime(),
      new Date('2021-06-01').getTime()
    ]

    expect(getIntervalBounds(intervals, new Date('2021-05-05').getTime())).toEqual({
      start: new Date('2021-05-01').getTime(),
      end: new Date('2021-06-01').getTime() - 1
    })
  })

  test('returns the correct bounds with an offset', () => {
    const intervals = [
      new Date('2021-04-01').getTime(),
      new Date('2021-05-01').getTime(),
      new Date('2021-06-01').getTime()
    ]

    expect(getIntervalBounds(
      intervals,
      new Date('2021-05-05').getTime(),
      -1
    )).toEqual({
      start: new Date('2021-04-01').getTime(),
      end: new Date('2021-05-01').getTime() - 1
    })
  })
})
