import {
  formatFullTime,
  formatDay,
  formatMonth,
  formatYear
} from './formatters'

/**
 * Determine the label, down to the second, for a given timestamp
 * @param {Integer} timestamp Timestamp to label
 */
export const determineTemporalLabel = (timestamp) => {
  const date = new Date(timestamp)

  // If the date is invalid, return an empty string
  if (!(date.getTime() > 0)) return ''

  return `${formatDay(date)} ${formatMonth(date)} ${formatYear(date)} ${formatFullTime(date)}`
}
