import { addContext } from './utils/addContext'
import {
  formatTime,
  formatDate,
  formatDay,
  formatMonth,
  formatYear
} from './utils/formatters'

// Abbreviated values returned from JavaScripts `getUTCMonth` method
// used for adding additional context
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// How many time intervals to create when new data is inserted into the timeline
export const INTERVAL_BUFFER = 20

// How many intervals should be beyond view before more are loaded
export const INTERVAL_THRESHOLD = 5

// Array of callbacks used to determine an appropriate label for a provided
// timestamp at each of the supported zoom levels
export const LABELS = [
  (date) => addContext(formatTime(date), '00:00', () => formatDate(date)),
  (date) => addContext(formatTime(date), '00:00', () => `${formatDay(date)} ${formatMonth(date)} ${formatYear(date)}`),
  (date) => addContext(formatDay(date), '01', () => `${formatMonth(date)} ${formatYear(date)}`),
  (date) => addContext(formatMonth(date), 'Jan', () => formatYear(date)),
  (date) => [formatYear(date)],
  (date) => [formatYear(date)],
  (date) => [formatYear(date)]
]

// Textual representations of the zoom levels
export const RESOLUTIONS = [
  'minute',
  'hour',
  'day',
  'month',
  'year',
  'year',
  'year'
]

// Integer values of the interval size in time for each supported zoom level
export const ZOOM_LEVELS = {
  minute: 0,
  hour: 1,
  day: 2,
  month: 3,
  year: 4,
  decade: 5,
  imfifety: 6
}

export const MS_PER_MINUTE = 60000

export const MS_PER_HOUR = MS_PER_MINUTE * 60

export const MS_PER_DAY = MS_PER_HOUR * 24

export const MS_PER_MONTH = MS_PER_DAY * 31

export const MS_PER_YEAR = MS_PER_DAY * 366

export const MS_PER_DECADE = MS_PER_YEAR * 10
