import { generateEndTime } from './generateEndTime'

/**
 * Based on the provided zoom level return the span of time for the provided timeintervals on the timeline
 * @param {Array} timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Integer} zoomLevel Current zoom level of the timeline
 */
export const getIntervalsDuration = (timeIntervals, zoomLevel) => {
  // Pull out the first time interval, representing the far left temporal value
  const startTime = timeIntervals[0]

  const endTime = generateEndTime(timeIntervals, zoomLevel)

  // Determine the timespan
  const duration = endTime - startTime

  return duration
}
