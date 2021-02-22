import { calculateTimeIntervals } from './calculateTimeIntervals'

export const getTemporalByPosition = ({
  position,
  timeIntervals,
  zoomLevel,
  intervalListWidthInPixels
}) => {
  const startTime = timeIntervals[0]
  const lastInterval = timeIntervals[timeIntervals.length - 1]
  const [endTime] = calculateTimeIntervals(lastInterval, zoomLevel, 1, false)

  const percentScrolled = ((position) / intervalListWidthInPixels)
  const timestamp = startTime + ((endTime - startTime) * percentScrolled)
  console.log('🚀 ~ file: index.js ~ line 137 ~ getTemporalByPosition ~ timestamp', new Date(timestamp).toUTCString())

  return parseInt(timestamp.toFixed(0), 10)
}
