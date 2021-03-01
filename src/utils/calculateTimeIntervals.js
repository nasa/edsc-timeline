import { ZOOM_LEVELS } from '../constants'

import { getUTCComponents } from './getUTCComponents'
import { roundTime } from './roundTime'

/**
 * Calculate an array of dates between two given dates at a specific zoom level
 * @param {Integer} timeAnchor The date to end calculating at
 * @param {Integer} zoomLevel The zoom level to use for calculating labels for the dates in the range
 * @param {Integer} numIntervals The amount of intervals to create
 * @param {Boolean} reverse Generate the intervals in reverse (before) to timeAnchor
 */
export const calculateTimeIntervals = ({
  timeAnchor,
  zoomLevel,
  numIntervals,
  reverse
}) => {
  const timeIntervals = []

  // Round the timeAnchor to ensure the intervals are at the correct rounded time
  const anchorDate = new Date(roundTime(timeAnchor, zoomLevel))
  // const anchorDate = new Date(timeAnchor)

  // Loop numIntervals times, creating a new interval each time
  new Array(numIntervals).fill(null).forEach((_, index) => {
    // Increment this interval by delta amount
    let delta = index + 1

    // If reverse is true, negate delta so we decrement the interval value
    if (reverse) delta = -delta

    // Get the UTC components of the anchorDate and reverse the
    // the array so the indexes match the zoomLevel
    let components = getUTCComponents(anchorDate).reverse()

    if (zoomLevel === ZOOM_LEVELS.decade) {
      // If the zoomLevel is decade, increment the year by delta * 10
      components[ZOOM_LEVELS.year] += (delta * 10)
    } else if (zoomLevel === ZOOM_LEVELS.fiftyYears) {
      // If the zoomLevel is 5 decades, increment the year by delta * 50
      components[ZOOM_LEVELS.year] += (delta * 50)
    } else {
      // Increment the zoomLevel level by delta
      components[zoomLevel] += delta
    }

    // Reverse the array back to the UTC order to create the interval date
    components = components.reverse()
    const date = new Date(Date.UTC(...components))

    // Push the timestamp of the date onto the timeIntervals array
    timeIntervals.push(date.getTime())
  })

  // If reverse is true the intervals need to be reversed in order to be in the correct order
  if (reverse) {
    return timeIntervals.reverse()
  }

  return timeIntervals
}
