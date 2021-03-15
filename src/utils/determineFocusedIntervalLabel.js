import {
  formatTime,
  formatDate,
  formatDay,
  formatMonth,
  formatYear
} from './formatters'

// Array of callbacks used to determine an appropriate label for a provided
// timestamp at each of the supported zoom levels
const FOCUSED_INTERVAL_LABELS = [
  (date) => `${formatTime(date)} ${formatDate(date)}`,
  (date) => `${formatTime(date)} ${formatDay(date)} ${formatMonth(date)} ${formatYear(date)}`,
  (date) => `${formatDay(date)} ${formatMonth(date)} ${formatYear(date)}`,
  (date) => `${formatMonth(date)} ${formatYear(date)}`,
  (date) => formatYear(date),
  (date) => formatYear(date),
  (date) => formatYear(date)
]

/**
 * Determine the label for a given focused interval and zoom
 * @param {Integer} interval Interval calculated for the label
 * @param {Integer} zoom The current zoom level of the timeline
 */
export const determineFocusedIntervalLabel = (interval, zoom) => {
  const label = FOCUSED_INTERVAL_LABELS[zoom](new Date(interval))

  return label
}
