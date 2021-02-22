import { determineScaledSize } from './determineScaledSize'
import { getIntervalsDuration } from './getIntervalsDuration'

export const getPositionByTimestamp = (timestamp, timeIntervals, zoomLevel, wrapperWidth) => {
  const totalDuration = getIntervalsDuration(timeIntervals, zoomLevel)

  const timestampDuration = timestamp - timeIntervals[0]

  const timestampPercentage = timestampDuration / totalDuration
  const width = determineScaledSize(totalDuration, zoomLevel, wrapperWidth)

  const result = width * timestampPercentage

  return result
}
