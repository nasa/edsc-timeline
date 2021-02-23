import { getIntervalsDuration } from '../getIntervalsDuration'

describe('getIntervalsDuration', () => {
  test('returns the correct time duration', () => {
    const intervals = [
      new Date('2021-04-01').getTime(),
      new Date('2021-05-01').getTime(),
      new Date('2021-06-01').getTime()
    ]

    const zoomLevel = 3

    expect(getIntervalsDuration(intervals, zoomLevel)).toEqual(7862400000)
  })
})
