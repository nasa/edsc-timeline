import { getTimestampByPosition } from '../getTimestampByPosition'

describe('getTimestampByPosition', () => {
  test('returns the correct timestamp', () => {
    const position = 1068
    const timeIntervals = [
      new Date('2021-04-01').getTime(),
      new Date('2021-05-01').getTime(),
      new Date('2021-06-01').getTime()
    ]
    const zoomLevel = 3
    const intervalListWidthInPixels = 5000

    expect(getTimestampByPosition({
      intervalListWidthInPixels,
      timeIntervals,
      position,
      zoomLevel
    })).toEqual(new Date('2021-04-20T10:30:08.640Z').getTime())
  })
})
