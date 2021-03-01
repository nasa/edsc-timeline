import { generateEndTime } from './generateEndTime'

/**
 * Determine the timestamp at an exact pixel location
 * @param {Object} param0
 * @param {Integer} param0.intervalListWidthInPixels Width (in pixels) of the DOM element that holds the timeline intervals
 * @param {Object} param0.position Position of the left side of the timeline DOM element in pixels
 * @param {Array} param0.timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 */
export const getTimestampByPosition = ({
  intervalListWidthInPixels,
  position,
  timeIntervals,
  zoomLevel
}) => {
  const startTime = timeIntervals[0]

  const endTime = generateEndTime(timeIntervals, zoomLevel)

  const percentScrolled = ((position) / intervalListWidthInPixels)
  const timestamp = startTime + ((endTime - startTime) * percentScrolled)

  return parseInt(timestamp.toFixed(0), 10)
}
