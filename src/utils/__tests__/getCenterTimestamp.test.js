import { getCenterTimestamp } from '../getCenterTimestamp'

describe('getCenterTimestamp', () => {
  test('returns the correct timestamp', () => {
    const timelinePosition = {
      left: -448
    }
    const timeIntervals = [
      new Date('2021-04-01').getTime(),
      new Date('2021-05-01').getTime(),
      new Date('2021-06-01').getTime()
    ]
    const zoomLevel = 3
    const intervalListWidthInPixels = 5000
    const timelineWrapperRef = {
      current: {
        getBoundingClientRect: () => ({
          width: 1240
        })
      }
    }

    expect(getCenterTimestamp({
      intervalListWidthInPixels,
      timeIntervals,
      timelinePosition,
      timelineWrapperRef,
      zoomLevel
    })).toEqual(new Date('2021-04-20T10:30:08.640Z').getTime())
  })
})
