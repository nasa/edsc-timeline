import { determineScaledWidth } from './determineScaledWidth'
import { getIntervalsDuration } from './getIntervalsDuration'

/**
 * Determine the css position
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
  const totalDuration = getIntervalsDuration(timeIntervals, zoomLevel)

  const timestampDuration = timestamp - timeIntervals[0]

  const timestampPercentage = timestampDuration / totalDuration

  const width = determineScaledWidth(totalDuration, zoomLevel, wrapperWidth)

  return width * timestampPercentage
}
