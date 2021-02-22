import { getTemporalByPosition } from './getTemporalByPosition'

export const getCenterTemporal = ({
  intervalListWidthInPixels,
  timeIntervals,
  timelinePosition,
  timelineWrapperRef,
  zoomLevel
}) => {
  const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width

  return getTemporalByPosition({
    position: -timelinePosition.left + (timelineWrapperWidth / 2),
    timeIntervals,
    zoomLevel,
    intervalListWidthInPixels
  })
}
