import { calculateTimeIntervals } from './calculateTimeIntervals'

export const getIntervalsDuration = (timeIntervals, zoomLevel) => {
  const startTime = timeIntervals[0]
  const lastInterval = timeIntervals[timeIntervals.length - 1]
  const [endTime] = calculateTimeIntervals(lastInterval, zoomLevel, 1, false)

  const duration = endTime - startTime

  return duration
}
