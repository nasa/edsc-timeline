pluginUtil = require('../util/plugin')
stringUtil = require('../util/string')

MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

zeroPad = (n) ->
  stringUtil.padLeft(n, '0', 2)

timeComponents = (date) ->
  time = zeroPad(date.getUTCHours()) + ':' + zeroPad(date.getUTCMinutes())
  day = zeroPad(date.getUTCDate())
  month = MONTHS[date.getUTCMonth()]
  year = date.getUTCFullYear()
  [time, day, month, year]

levels = [
  {
    resolution: 'minute',
  },
  {
    resolution: 'hour',
  },
  {
    resolution: 'day',
  },
  {
    resolution: 'month',
  },
  {
    resolution: 'year',
  },
  {
    resolution: 'year',
  },
  {
    resolution: 'year',
  }
]

RESOLUTIONS = [
  'minute',
  'hour',
  'day',
  'month',
  'year',
  'year',
  'year'
]

zoomLevel = (level) ->
  {
    resolution: RESOLUTIONS[level]
    formatter: (date) ->
      null
  }



class Timeline extends pluginUtil.Base
  constructor: (root, namespace, options={}) ->
    super(root, namespace, options)

    @_rows = []
    @_animate = options.animate ? true
    @_zoom = 4
    @end = (options.end || new Date()) - 0
    @start = @end - ZOOM_LEVELS[@_zoom]

pluginUtil.create('timeline', Timeline)
