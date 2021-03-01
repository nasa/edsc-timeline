import { getIntervalsDuration } from './getIntervalsDuration'
import { roundTime } from './roundTime'

/**
 * Determines an interval width given a duration and zoomLevel
 * @param {Integer} intervalDurationInMs The timespan of the interval to scale
 * @param {Integer} zoomLevel Zoom level to determine the scale at
 * @param {Integer} wrapperWidth Viewable area on the page to scale within
 */
export const determineScaledWidth = (intervalDurationInMs, zoomLevel, wrapperWidth) => {
  // Use a rounded time of 'today' as the intervals
  const duration = getIntervalsDuration(
    [roundTime(new Date().getTime(), zoomLevel + 1)],
    zoomLevel + 1
  )

  const scale = duration / wrapperWidth

  return intervalDurationInMs / scale
}
