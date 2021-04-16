import {
  formatFullTime,
  formatDay,
  formatMonth,
  formatYear
} from './formatters'

export const determineTemporalLabel = (timestamp) => {
  const date = new Date(timestamp)

  return `${formatDay(date)} ${formatMonth(date)} ${formatYear(date)} ${formatFullTime(date)}`
}
