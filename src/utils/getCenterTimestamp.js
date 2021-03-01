import { getTimestampByPosition } from './getTimestampByPosition'

/**
 * Get the timestamp representing the center of the timeline
 * @param {Object} param0
 * @param {Integer} param0.intervalListWidthInPixels Width of the intervals list in pixels
 * @param {Array} param0.timeIntervals Array of intervals representing the timeline
 * @param {Object} param0.timelinePosition Position on the timeline using css coordinates (top and left)
 * @param {Object} param0.timelineWrapperRef Ref to the DOM element representing the timeline wrapper
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 */
export const getCenterTimestamp = ({
  intervalListWidthInPixels,
  timeIntervals,
  timelinePosition,
  timelineWrapperRef,
  zoomLevel
}) => {
  const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

  // Get the timestamp at the center of the timeline
  return getTimestampByPosition({
    position: -timelinePosition.left + (timelineWrapperWidth / 2),
    timeIntervals,
    zoomLevel,
    intervalListWidthInPixels
  })
}
