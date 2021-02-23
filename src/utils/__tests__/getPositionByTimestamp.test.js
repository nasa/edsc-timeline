import { getPositionByTimestamp } from '../getPositionByTimestamp'

describe('getPositionByTimestamp', () => {
  test('returns the correct timestamp', () => {
    const timestamp = new Date('2021-04-20T10:30:08.640Z').getTime()
    const timeIntervals = [
      new Date('2021-04-01').getTime(),
      new Date('2021-05-01').getTime(),
      new Date('2021-06-01').getTime()
    ]
    const zoomLevel = 3
    const wrapperWidth = 1240

    expect(getPositionByTimestamp({
      timestamp,
      timeIntervals,
      zoomLevel,
      wrapperWidth
    })).toEqual(66.03458630136986)
  })
})
