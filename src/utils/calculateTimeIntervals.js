import { roundTime } from './roundTime'
import { ZOOM_LEVELS } from '../constants'

/**
 * Calculate an array of dates between two given dates at a specific zoom level
 * @param {Integer} minDate The date to start calculating at
 * @param {Integer} maxDate The date to end calculating at
 * @param {Integer} zoom The zoom level to use for calculating labels for the dates in the range
 */
export const calculateTimeIntervals = (minDate, maxDate, zoom) => {
  const dateIntervals = []

  const zoomLevel = ZOOM_LEVELS[zoom]
  const buffer = 20
  const windowStartTime = new Date(roundTime(maxDate, zoom) - (zoomLevel * buffer))
  const windowEndTime = new Date(roundTime(maxDate, zoom) + (zoomLevel * buffer))

  for (let d = windowStartTime; d <= windowEndTime; d = new Date(d.getTime() + zoomLevel)) {
    dateIntervals.push(d.getTime())
  }

  console.log('dateIntervals', dateIntervals)

  return dateIntervals
}
