import { LABELS } from '../constants'

/**
 * Determine the label for a given index within the react-window
 * @param {Array} intervals Time intervals calculated for the timeline
 * @param {Integer} index The index of the item being rendered in the react-window
 * @param {Integer} zoom The current zoom level of the timeline
 */
export const determineIntervalLabel = (intervals, index, zoom) => {
  const timeInterval = intervals[index]
  const labels = LABELS[zoom](new Date(timeInterval))

  return labels
}
