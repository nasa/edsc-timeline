import { LABELS } from '../constants'

/**
 * Determine the label for a given index within the react-window
 * @param {Array} intervals Time intervals calculated for the timeline
 * @param {Integer} zoom The current zoom level of the timeline
 */
export const determineIntervalLabel = (timeInterval, zoom) => {
  console.log('🚀 ~ file: determineIntervalLabel.js ~ line 9 ~ determineIntervalLabel ~ timeInterval', timeInterval)
  const labels = LABELS[zoom](new Date(timeInterval))

  return labels
}
