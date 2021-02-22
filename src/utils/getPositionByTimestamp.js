import { determineScaledSize } from './determineScaledSize'
import { getIntervalsDuration } from './getIntervalsDuration'

export const getPositionByTimestamp = (timestamp, timeIntervals, zoomLevel) => {
  console.log('timeIntervals in getPositionByTimestamp', timeIntervals.map((interval) => new Date(interval)))
  const totalDuration = getIntervalsDuration(timeIntervals, zoomLevel)
  console.log('🚀 ~ file: index.js ~ line 182 ~ getPositionByTimestamp ~ totalDuration', totalDuration)
  const timestampDuration = timestamp - timeIntervals[0]
  console.log('🚀 ~ file: index.js ~ line 184 ~ getPositionByTimestamp ~ timestampDuration', timestampDuration)
  const timestampPercentage = timestampDuration / totalDuration
  const width = determineScaledSize(totalDuration, zoomLevel)
  console.log('🚀 ~ file: index.js ~ line 186 ~ getPositionByTimestamp ~ timestampPercentage', timestampPercentage)
  const result = width * timestampPercentage
  console.log('🚀 ~ file: index.js ~ line 188 ~ getPositionByTimestamp ~ width', width)
  console.log('🚀 ~ file: index.js ~ line 188 ~ getPositionByTimestamp ~ result', result)

  return result
}
