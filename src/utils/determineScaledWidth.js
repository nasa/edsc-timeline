import { calculateTimeIntervals } from './calculateTimeIntervals'
import { roundTime } from './roundTime'

/**
 * Determines an interval width given a duration and zoomLevel
 * @param {Integer} intervalDurationInMs The timespan of the interval to scale
 * @param {Integer} zoomLevel Zoom level to determine the scale at
 * @param {Integer} wrapperWidth Viewable area on the page to scale within
 */
export const determineScaledWidth = (intervalDurationInMs, zoomLevel, wrapperWidth) => {
  const today = roundTime(new Date().getTime(), zoomLevel + 1)

  const [endDate] = calculateTimeIntervals({
    timeAnchor: today,
    zoomLevel: zoomLevel + 1,
    numIntervals: 2,
    reverse: false
  })

  const duration = endDate - today

  const scale = duration / wrapperWidth

  return intervalDurationInMs / scale
}
