import { getTemporalByPosition } from './getTemporalByPosition'

/**
 * Get the temporal value representing the center of the timeline
 * @param {Object} param0
 * @param {Object} param0.intervalListWidthInPixels Width of the intervals list in pixels
 * @param {Object} param0.timeIntervals Array of intervals representing the timeline
 * @param {Object} param0.timelinePosition Position on the timeline using css coordinates (top and left)
 * @param {Object} param0.timelineWrapperRef Ref to the DOM element representing the timeline wrapper
 * @param {Object} param0.zoomLevel Current zoom level of the timeline
 */
export const getCenterTemporal = ({
  intervalListWidthInPixels,
  timeIntervals,
  timelinePosition,
  timelineWrapperRef,
  zoomLevel
}) => {
  const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

  // Get the temporal value at the center of the timeline
  return getTemporalByPosition({
    position: -timelinePosition.left + (timelineWrapperWidth / 2),
    timeIntervals,
    zoomLevel,
    intervalListWidthInPixels
  })
}
