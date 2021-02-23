import { calculateTimeIntervals } from './calculateTimeIntervals'

/**
 * Determine the temporal value at an exact pixel location
 * @param {Object} param0
 * @param {Object} param0.intervalListWidthInPixels Width (in pixels) of the DOM element that holds the timeline intervals
 * @param {Object} param0.position Position of the left side of the timeline DOM element in pixels
 * @param {Object} param0.timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Object} param0.zoomLevel Current zoom level of the timeline
 */
// TODO getTimestampByPosition
export const getTimestampByPosition = ({
  intervalListWidthInPixels,
  position,
  timeIntervals,
  zoomLevel
}) => {
  const startTime = timeIntervals[0]
  const lastInterval = timeIntervals[timeIntervals.length - 1]
  const [endTime] = calculateTimeIntervals({
    timeAnchor: lastInterval,
    zoomLevel,
    numIntervals: 1,
    reverse: false
  })

  const percentScrolled = ((position) / intervalListWidthInPixels)
  const timestamp = startTime + ((endTime - startTime) * percentScrolled)

  return parseInt(timestamp.toFixed(0), 10)
}
