import { calculateTimeIntervals } from './calculateTimeIntervals'

/**
 * Adds one interval to the right side of the timeIntervals to determine the end time of the intervals
 * @param {Array} timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Integer} zoomLevel Current zoom level of the timeline
 * @param {Integer} overrideAnchor Optional - Used to override the lastInterval in timeIntervals when a different anchor is needed for calculateTimeIntervals
 */
export const generateEndTime = (timeIntervals, zoomLevel, overrideAnchor) => {
  // Pull out the last interval, representing the far right temporal (this could be
  // a single value or a large array of values)
  const lastInterval = timeIntervals[timeIntervals.length - 1]

  // Add one interval to the right side which will give us the timespan plus 1 ms because we're
  // incrementing a full interval
  const [endTime] = calculateTimeIntervals({
    timeAnchor: overrideAnchor || lastInterval,
    zoomLevel,
    numIntervals: 1,
    reverse: false
  })

  return endTime
}
