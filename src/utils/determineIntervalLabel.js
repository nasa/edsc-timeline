import { addContext } from './addContext'
import {
  formatTime,
  formatDate,
  formatDay,
  formatMonth,
  formatYear
} from './formatters'

// Array of callbacks used to determine an appropriate label for a provided
// timestamp at each of the supported zoom levels
const LABELS = [
  (date) => addContext(formatTime(date), '00:00', () => formatDate(date)),
  (date) => addContext(formatTime(date), '00:00', () => `${formatDay(date)} ${formatMonth(date)} ${formatYear(date)}`),
  (date) => addContext(formatDay(date), '01', () => `${formatMonth(date)} ${formatYear(date)}`),
  (date) => addContext(formatMonth(date), 'Jan', () => formatYear(date)),
  (date) => [formatYear(date)],
  (date) => [formatYear(date)],
  (date) => [formatYear(date)]
]

/**
 * Determine the label for a given interval and zoom
 * @param {Integer} timeInterval Interval calculated for the label
 * @param {Integer} zoom The current zoom level of the timeline
 */
export const determineIntervalLabel = (timeInterval, zoom) => {
  const labels = LABELS[zoom](new Date(timeInterval))

  return labels
}
