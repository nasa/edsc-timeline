import { roundTime } from './roundTime'

import { ZOOM_LEVELS } from '../constants'

/**
 * Calculate an array of dates between two given dates at a specific zoom level
 * @param {Integer} timeAnchor The date to end calculating at
 * @param {Integer} zoom The zoom level to use for calculating labels for the dates in the range
 */
export const calculateTimeIntervals = (timeAnchor, zoom, buffer, reverse) => {
  const timeIntervals = []

  const zoomLevel = ZOOM_LEVELS[zoom]

  let windowStartTime
  let windowEndTime

  if (reverse) {
    // Create time intervals beginning in the past up until the time anchor
    windowStartTime = new Date(roundTime(timeAnchor, zoom) - (zoomLevel * buffer))
    windowEndTime = new Date(roundTime(timeAnchor - zoomLevel, zoom))
  } else {
    // Create time intervals starting at the time anchor into the future
    windowStartTime = new Date(roundTime(timeAnchor + zoomLevel, zoom))
    windowEndTime = new Date(roundTime(timeAnchor, zoom) + (zoomLevel * buffer))
  }

  // Create timestamps between the start and end time and push them to an array to return
  for (let d = windowStartTime; d <= windowEndTime; d = new Date(d.getTime() + zoomLevel)) {
    timeIntervals.push(d.getTime())
  }

  return timeIntervals
}
