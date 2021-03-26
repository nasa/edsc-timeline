// Abbreviated values returned from JavaScripts `getUTCMonth` method
// used for adding additional context
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// How many time intervals to create when new data is inserted into the timeline
export const INTERVAL_BUFFER = 30

// Max number of intervals to keep loaded before removing old values
export const MAX_INTERVAL_BUFFER = INTERVAL_BUFFER * 5

// How many intervals should be beyond view before more are loaded
export const INTERVAL_THRESHOLD = 5

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
  fiftyYears: 6
}

// The height in px of the area that will trigger a temporal selection
export const TEMPORAL_SELECTION_HEIGHT = 20

// The maximum number of data rows to be displayed
export const MAX_DATA_ROWS = 3

// The default color used for data rows and indicators
export const DEFAULT_COLOR = '#25c85b'
