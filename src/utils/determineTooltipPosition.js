import { getPositionByTimestamp } from './getPositionByTimestamp'

export const determineTooltipPosition = ({
  timestamp,
  timeIntervals,
  timelinePosition,
  tooltipWidth,
  wrapperWidth,
  zoomLevel
}) => {
  const buffer = 5
  let transform = 'translateX(-50%)'
  let leftPosition = (
    getPositionByTimestamp({
      timestamp,
      timeIntervals,
      zoomLevel,
      wrapperWidth
    }) + timelinePosition.left
  )
  let rightPosition = 'auto'

  if (leftPosition < (tooltipWidth / 2) + buffer) {
    leftPosition = buffer
    transform = 'none'
  }

  if (leftPosition > wrapperWidth - ((tooltipWidth / 2) + buffer)) {
    leftPosition = 'auto'
    rightPosition = buffer
    transform = 'none'
  }

  return {
    left: leftPosition,
    right: rightPosition,
    transform
  }
}
