import { ZOOM_LEVELS } from '../constants'
import { getUTCComponents } from './getUTCComponents'

/**
 * Rounds the provided timestamp to the top of the hour, day, etc
 * @param {Integer} time The timestamp to consider
 * @param {Integer} zoom The current zoom level
 * @param {Integer} increment How much to incrememt the provided time by (used for previous and next buttons)
 */
export const roundTime = (time, zoom, increment = 0) => {
  // eslint-disable-next-line no-param-reassign
  time = Math.round(time / 1000) * 1000

  const date = new Date(time)

  // Create an array that matches that accepted by Date.UTC that contains
  // all the individual values of the timestamp
  let components = getUTCComponents(date)

  // Slice off only those that are more granular than the current zoom level
  components = components.slice(0, Math.max(components.length - zoom, 1))

  // Zoom to decade
  if (zoom === ZOOM_LEVELS.decade) {
    components[0] = Math.floor(components[0] / 10) * 10

    // eslint-disable-next-line no-param-reassign
    increment *= 10
  }

  components[components.length - 1] += increment

  if (components.length === 1) {
    components.push(0)
  }

  // Create and return a new date where the elements that are beyond
  // the scope of the current zoom level have been removed and will
  // result in the defaul values
  return Date.UTC(...components)
}
