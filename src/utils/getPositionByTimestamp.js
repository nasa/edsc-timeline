import { determineScaledWidth } from './determineScaledWidth'
import { getIntervalsDuration } from './getIntervalsDuration'

/**
 * Determine the css position of the given timestamp
 * @param {Object} param0
 * @param {Integer} param0.timestamp The timestamp to determine the position of
 * @param {Array} param0.timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 * @param {Integer} param0.wrapperWidth Width (in pixels) of the DOM element that wraps the timeline intervals
 */
export const getPositionByTimestamp = ({
  timestamp,
  timeIntervals,
  zoomLevel,
  wrapperWidth
}) => {
  // Get the total duration of the time intervals
  const totalDuration = getIntervalsDuration(timeIntervals, zoomLevel)

  // Get the duration from the start of the time intervals to the timestamp
  const timestampDuration = timestamp - timeIntervals[0]

  // Calculate the percentage of the total duration
  const timestampPercentage = timestampDuration / totalDuration

  // Get the width of the total duration
  const width = determineScaledWidth(totalDuration, zoomLevel, wrapperWidth)

  // Use the timestamp percentage to calculate the position of the timestamp within the time intervals
  return width * timestampPercentage
}
