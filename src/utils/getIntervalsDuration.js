import { calculateTimeIntervals } from './calculateTimeIntervals'

/**
 * Based on the provided zoom level return the span of time for the provided timeintervals on the timeline
 * @param {Array} timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Integer} zoomLevel Current zoom level of the timeline
 */
export const getIntervalsDuration = (timeIntervals, zoomLevel) => {
  // Pull out the first time interval, representing the far left temporal value
  const startTime = timeIntervals[0]

  // Pull out the last interval, representing the far right temporal (this could be
  // a single value or a large array of values)
  const lastInterval = timeIntervals[timeIntervals.length - 1]

  // Add 1 interval to the right side which will give us the timespan plus 1 ms because we're
  // incrementing a full interval
  const [endTime] = calculateTimeIntervals({
    timeAnchor: lastInterval,
    zoomLevel,
    numIntervals: 1,
    reverse: false
  })

  // Determine the timespan
  const duration = endTime - startTime

  return duration
}
