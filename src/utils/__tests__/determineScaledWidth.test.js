import { determineScaledWidth } from '../determineScaledWidth'

describe('determineScaledWidth', () => {
  test('returns the correct width', () => {
    const intervalDurationInMs = 2678400000
    const zoomLevel = 3
    const wrapperWidth = 1240

    const width = determineScaledWidth(intervalDurationInMs, zoomLevel, wrapperWidth)

    expect(width).toEqual(105.31506849315068)
  })
})
