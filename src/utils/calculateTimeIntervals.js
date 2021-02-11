import { roundTime } from './roundTime'
import { ZOOM_LEVELS } from '../constants'

/**
 * Calculate an array of dates between two given dates at a specific zoom level
 * @param {Integer} timeAnchor The date to end calculating at
 * @param {Integer} zoom The zoom level to use for calculating labels for the dates in the range
 */
export const calculateTimeIntervals = (timeAnchor, zoom, buffer, reverse) => {
  const dateIntervals = []

  const zoomLevel = ZOOM_LEVELS[zoom]

  let windowStartTime
  let windowEndTime

  if (reverse) {
    windowStartTime = new Date(roundTime(timeAnchor, zoom) - (zoomLevel * buffer))
    windowEndTime = new Date(roundTime(timeAnchor - zoomLevel, zoom))
  } else {
    windowStartTime = new Date(roundTime(timeAnchor + zoomLevel, zoom))
    windowEndTime = new Date(roundTime(timeAnchor, zoom) + (zoomLevel * buffer))
  }

  for (let d = windowStartTime; d <= windowEndTime; d = new Date(d.getTime() + zoomLevel)) {
    dateIntervals.push(d.getTime())
  }

  return dateIntervals
}
