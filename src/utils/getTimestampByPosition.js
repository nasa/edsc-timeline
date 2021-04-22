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
  // Start time of the current intervals
  const startTime = timeIntervals[0]

  // End time of the current intervals
  const endTime = generateEndTime(timeIntervals, zoomLevel)

  // Duration of the intervals
  const duration = endTime - startTime

  // Percentage of the list width of the current position
  const percentScrolled = ((position) / intervalListWidthInPixels)

  // Find the percentage of the duration
  const percentDuration = percentScrolled * duration

  // To find the timestamp add the percentage scrolled of the total duration to the start time
  const timestamp = startTime + percentDuration

  return parseInt(timestamp.toFixed(0), 10)
}
