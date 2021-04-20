import { getPositionByTimestamp } from './getPositionByTimestamp'

/**
 * Determines the position of a tooltip, given a timestamp
 * @param {Integer} timestamp Timestamp to deterimine position of
 * @param {Array} timeIntervals The current time intervals
 * @param {Object} timelinePosition The current position of the timeline
 * @param {Number} tooltipWidth The width in pixels of the tooltip
 * @param {Number} wrapperWidth The width in pixels of the timeline wrapper
 * @param {Integer} zoomLevel The current zoom level
 */
export const determineTooltipPosition = ({
  timestamp,
  timeIntervals,
  timelinePosition,
  tooltipWidth,
  wrapperWidth,
  zoomLevel
}) => {
  const buffer = 5
  let leftPosition = (
    getPositionByTimestamp({
      timestamp,
      timeIntervals,
      zoomLevel,
      wrapperWidth
    }) + timelinePosition.left
  )

  const leftBounds = (tooltipWidth / 2) + buffer
  const rightBounds = wrapperWidth - ((tooltipWidth / 2) + buffer)

  // If the position is outside the left bounds, position the tooltip to the left edge
  if (leftPosition < leftBounds) leftPosition = leftBounds

  // If the position is outside the right bounds, position the tooltip to the right edge
  if (leftPosition > rightBounds) leftPosition = rightBounds

  return {
    left: leftPosition
  }
}
