import { calculateTimeIntervals } from './calculateTimeIntervals'
import { roundTime } from './roundTime'

// Determines an interval width given a duration and zoomLevel
export const determineScaledSize = (intervalDurationInMs, zoomLevel, wrapperWidth) => {
  const today = roundTime(new Date().getTime(), zoomLevel + 1)

  const [endDate] = calculateTimeIntervals(today, zoomLevel + 1, 2, false)

  const duration = endDate - today

  const scale = duration / wrapperWidth

  return intervalDurationInMs / scale
}
