import { ZOOM_LEVELS } from '../constants'

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

  let components = ['FullYear', 'Month', 'Date', 'Hours', 'Minutes'].map((c) => date[`getUTC${c}`]())
  components = components.slice(0, Math.max(components.length - zoom, 1))

  // Zoom to decade
  if (zoom === ZOOM_LEVELS.length - 2) {
    components[0] = Math.floor(components[0] / 10) * 10

    // eslint-disable-next-line no-param-reassign
    increment *= 10
  }

  components[components.length - 1] += increment

  if (components.length === 1) {
    components.push(0)
  }

  return Date.UTC(...components)
}
