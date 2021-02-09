import { padStart } from 'lodash'

const MS_PER_MINUTE = 60000
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24
const MS_PER_MONTH = MS_PER_DAY * 31
const MS_PER_YEAR = MS_PER_DAY * 366
const MS_PER_DECADE = MS_PER_YEAR * 10

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatTime = (date) => `${padStart(date.getUTCHours(), 2, '0')}:${padStart(date.getUTCMinutes(), 2, '0')}`
const formatDay = (date) => padStart(date.getUTCDate(), 2, '0')
const formatMonth = (date) => MONTHS[date.getUTCMonth()]
const formatDate = (date) => `${formatMonth(date)} ${formatDay(date)}`
const formatYear = (date) => date.getUTCFullYear()

/**
 * Adds additional context to a date string for display on the timeline
 * @param {String} dateStr The data to consider adding context to
 * @param {String} contextMatch A string to compare the current interval to, to determine if we should add additional context
 * @param {Function} contextFn The function to call to create the additional context
 */
const addContext = (dateStr, contextMatch, contextFn) => {
  // Initialize the context array to just the date string
  const result = [dateStr]

  // If the current date string matches the contextMatch, add the additional context
  if (dateStr === contextMatch) {
    result.push(contextFn())
  }

  return result
}

export const LABELS = [
  (date) => addContext(formatTime(date), '00:00', () => formatDate(date)),
  (date) => addContext(formatTime(date), '00:00', () => `${formatDay(date)} ${formatMonth(date)} ${formatYear(date)}`),
  (date) => addContext(formatDay(date), '01', () => `${formatMonth(date)} ${formatYear(date)}`),
  (date) => addContext(formatMonth(date), 'Jan', () => formatYear(date)),
  (date) => [formatYear(date)],
  (date) => [formatYear(date)],
  (date) => [formatYear(date)]
]

export const RESOLUTIONS = [
  'minute',
  'hour',
  'day',
  'month',
  'year',
  'year',
  'year'
]

export const ZOOM_LEVELS = [
  MS_PER_MINUTE,
  MS_PER_HOUR,
  MS_PER_DAY,
  MS_PER_MONTH,
  MS_PER_YEAR,
  MS_PER_DECADE,
  MS_PER_DECADE * 5
]
