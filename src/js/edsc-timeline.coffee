require '../css/edsc-timeline.less'
buildDom = require('../html/timeline.hbs')
buildInterval = require('../html/interval.hbs')
stringUtil = require('./util/string')
pluginUtil = require('./util/plugin')
svgUtil = require('./util/svg')
TemporalDisplay = require('./timeline/temporalDisplay')
TemporalFencepost = require('./timeline/fencepost')
TemporalSelectionBehavior = require('./timeline/behaviors/temporalSelection')
ScrollBehavior = require('./timeline/behaviors/scroll')
DragBehavior = require('./timeline/behaviors/drag')
TemporalFocusBehavior = require('./timeline/behaviors/temporalFocus')
DataMouseoverBehavior = require('./timeline/behaviors/dataMouseover')
ClickZoomBehavior = require('./timeline/behaviors/clickZoom')

# Height for the top area, where arrows are drawn for date selection
TOP_HEIGHT = 19

# Height for each row, including any necessary margins
ROW_HEIGHT = 26

ROW_FONT_HEIGHT = 14

ROW_PADDING = 5

OFFSET_X = 48

ROW_TEXT_OFFSET = TOP_HEIGHT + ROW_FONT_HEIGHT + ROW_PADDING

# Height for the axis of the timeline, containing date displays
AXIS_HEIGHT = 40

MS_PER_MINUTE = 60000

MS_PER_HOUR = MS_PER_MINUTE * 60

MS_PER_DAY = MS_PER_HOUR * 24

MS_PER_MONTH = MS_PER_DAY * 31

MS_PER_YEAR = MS_PER_DAY * 366

MS_PER_DECADE = MS_PER_YEAR * 10

MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

MIN_X = -100000
MIN_Y = -1000
MAX_X = 100000
MAX_Y = 1000

formatTime = (date) -> stringUtil.padLeft(date.getUTCHours(), '0', 2) + ':' + stringUtil.padLeft(date.getUTCMinutes(), '0', 2)
formatDay = (date) -> stringUtil.padLeft(date.getUTCDate(), '0', 2)
formatMonth = (date) -> MONTHS[date.getUTCMonth()]
formatDate = (date) -> formatMonth(date) + ' ' + formatDay(date)
formatYear = (date) -> date.getUTCFullYear()
addContext = (dateStr, contextMatch, contextFn) ->
  result = [dateStr]
  result.push(contextFn()) if dateStr == contextMatch
  result

LABELS = [
  ((date) -> addContext(formatTime(date), '00:00', -> formatDate(date))),
  ((date) -> addContext(formatTime(date), '00:00', -> formatDay(date) + ' ' +formatMonth(date) + ' ' + formatYear(date))),
  ((date) -> addContext(formatDay(date), '01', -> formatMonth(date) + ' ' + formatYear(date))),
  ((date) -> addContext(formatMonth(date), 'Jan', -> formatYear(date))),
  ((date) -> [formatYear(date)]),
  ((date) -> [formatYear(date)]),
  ((date) -> [formatYear(date)])
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

ZOOM_LEVELS = [
  MS_PER_MINUTE,
  MS_PER_HOUR,
  MS_PER_DAY,
  MS_PER_MONTH,
  MS_PER_YEAR,
  MS_PER_DECADE,
  MS_PER_DECADE * 5
]

class Timeline extends pluginUtil.Base
  constructor: (root, namespace, options={}) ->
    super(root, namespace, options)

    @_data = {}
    @_loadedRange = []
    @_rows = []
    @_zoom = 4

    @animate = options.animate ? true
    @end = (options.end || new Date()) - 0
    @autoHide = options.autoHide ? true

    @start = @end - ZOOM_LEVELS[@_zoom]
    @originPx = 0

    dom = buildDom
      ROW_TEXT_OFFSET: ROW_TEXT_OFFSET
      TOP_HEIGHT: TOP_HEIGHT
    @parent = @root
    @root = $(dom).appendTo(@root)

    @_setupDomVars()
    @_setupDisplay()
    @_setupBehaviors()

    @_updateTimeline()

    @show() unless @autoHide


  destroy: ->
    for behavior in @_behaviors
      behavior.removeFrom(this)
    @root.remove()
    super()
    @parent

  range: ->
    # Query and draw bounds that are 3x wider than needed, centered on the visible range.
    # This prevents an in-progress drag from needing to redraw or re-query
    {start, end} = this
    span = end - start
    [start - span, end + span, RESOLUTIONS[@_zoom - 2]]

  startTime: ->
    @start

  endTime: ->
    @end

  show: ->
    @parent.show()
    @root.show()
    @_setHeight()
    @parent

  hide: ->
    @parent.hide()
    @root.hide()
    @_setHeight()
    @focus()
    @parent

  loadstart: (id) ->
    match = @root[0].getElementsByClassName(id)
    if match.length > 0
      match[0].setAttribute('class', "#{match[0].getAttribute('class')} #{@scope('loading')}")
      @_empty(match[0])
    @parent

  data: (id, data) =>
    row = @_getRow(id)
    @_loadedRange = [data.start, data.end, data.resolution]
    @_data[id] = [data.start, data.end, data.resolution, data.intervals, row.color]
    @_drawData(id)
    @_drawIndicators(id)
    @parent

  _drawIndicators: (id) ->
    row = null
    for row in @_rows
      break if row.id == id
    return unless row?

    [_, _, _, intervals, color] = @_data[id]
    color = color ? '#25c85b'

    row_min = if row.min then new Date(row.min * 1000) else new Date(0)
    row_max = if row.max then new Date(row.max * 1000) else new Date()

    before_start =
      row_max < @start ||
        intervals.length > 0 && intervals[intervals.length - 1][1] * 1000 < @start

    after_end =
      row_min > @end ||
        intervals.length > 0 && intervals[0][0] * 1000 > @end

    before_color = if before_start then color else 'transparent'
    after_color = if after_end then color else 'transparent'
    document.getElementById("arrow-left-#{id}")?.setAttribute('style', "fill: #{before_color}")
    document.getElementById("arrow-right-#{id}")?.setAttribute('style', "fill: #{after_color}")
    null

  _drawData: (id) ->
    index = -1
    for row, i in @_rows
      if row.id == id
        index = i
        break
    return if index == -1

    zoom = @_zoom

    [start, end, resolution, intervals, color] = @_data[id] ? [@start - 1 , @end + 1, RESOLUTIONS[zoom - 2], [], null]

    match = @root[0].getElementsByClassName(id)
    el = null
    if match.length > 0
      el = match[0]
      @_empty(el)
      el.parentNode.removeChild(el)
    else
      el = @_buildSvgElement('g')
      @_translate(el, 0, ROW_HEIGHT * index) if index > 0

    for [startTime, endTime, _] in intervals
      startPos = @timeToPosition(startTime * 1000)
      endPos = @timeToPosition(endTime * 1000)
      attrs =
        x: startPos
        y: 5
        width: endPos - startPos
        height: ROW_HEIGHT - 7
        rx: 10
        ry: 10
      attrs['class'] = @scope('imprecise') if resolution != RESOLUTIONS[zoom - 2]
      rect = @_buildSvgElement 'rect', attrs
      rect.setAttribute('style', "fill: #{color}") if color?
      el.appendChild(rect)

    # Remove 'timeline-loading' class
    el.setAttribute('class', "#{id} #{@scope('data')}")

    @tlRows.appendChild(el)

    @_drawIndicators(id)

    null

  _forceRedraw: ->
    rect = @_buildRect(stroke: 'none', fill: 'none')
    svg = @svg
    svg.appendChild(rect)
    callback =  -> svg.removeChild(rect)
    if window.requestAnimationFrame
      window.requestAnimationFrame(callback)
    else
      setTimeout(callback)

  refresh: ->
    @rows(@_rows)

  rows: (rows) ->
    @_rows = ($.extend({}, row) for row in rows)
    @_updateRowNames()
    @_drawTemporalBounds()
    @_empty(@tlRows)
    @_data = {}
    if @autoHide
      if rows?.length > 0
        @show()
      else
        @hide()
    @parent

  timeSpanToPx: (t) ->
    t / @scale

  pxToTimeSpan: (p) ->
    @scale / p

  timeToPosition: (t) ->
    {originPx, start, scale} = this
    originPx + (t - start) / scale

  positionToTime: (p) ->
    {originPx, start, scale} = this
    Math.floor((p - originPx) * scale + start)

  zoomIn: ->
    @_deltaZoom(-1)
    @parent

  zoomOut: ->
    @_deltaZoom(1)
    @parent

  zoom: (arg) ->
    @_deltaZoom(arg - @_zoom) if arg?
    @_zoom

  center: (arg) ->
    if arg?
      @panToTime(arg + (@end - @start) / 2)
      null
    else
      Math.round((@end + @start) / 2)

  _deltaZoom: (levels, center_t=@center(), preserveCenterPx=true) ->
    @_zoom = Math.min(Math.max(@_zoom + levels, 2), ZOOM_LEVELS.length - 1)

    @root.toggleClass(@scope('max-zoom'), @_zoom == ZOOM_LEVELS.length - 1)
    @root.toggleClass(@scope('min-zoom'), @_zoom == 2)

    timeSpan = ZOOM_LEVELS[@_zoom]

    if preserveCenterPx
      # We want to zoom in a way that keeps the center_t at the same pixel so you
      # can double-click or scoll-wheel to zoom and your mouse stays over the same time
      scale = timeSpan / @width
      x = @timeToPosition(center_t)
      @start = center_t - (scale * (x - @originPx))
    else
      @start = center_t - timeSpan / 2

    @end = @start + timeSpan

    @scale = scale

    @focus()
    @_updateTimeline()
    @_drawTemporalBounds()

  isFocus: (t0) ->
    focus = @_focus
    (!focus && !t0) || (focus && t0 && Math.abs(t0 - focus) < 1000)

  getFocus: ->
    if @_focus
      [@_focus, @_focusEnd]
    else
      []

  focus: (t0, t1) ->
    t0 = null if @isFocus(t0)
    @_focus = t0
    @_focusEnd = t1

    root = @root
    overlay = @focusOverlay
    @_empty(overlay)

    if t0?
      eventArgs = [new Date(t0), new Date(t1), RESOLUTIONS[@_zoom - 1]]
      @parent.trigger(@scopedEventName('focusset'), eventArgs)
      startPt = @timeToPosition(t0)
      stopPt = @timeToPosition(t1)

      left = @_buildRect(class: @scope('unfocused'), x1: startPt)
      overlay.appendChild(left)

      right = @_buildRect(class: @scope('unfocused'), x: stopPt)
      overlay.appendChild(right)
    else
      eventArgs = []
      @parent.trigger(@scopedEventName('focusremove'), eventArgs)
    @parent.trigger(@scopedEventName('focuschange'), eventArgs)
    @_forceRedraw()
    @parent

  panToTime: (time) ->
    @_pan(@timeSpanToPx(@end - time))

  _getTransformX: svgUtil.getTransformX

  _allTemporal: ->
    result = []
    result = result.concat(@_globalTemporal) if @_globalTemporal
    result = result.concat(row.temporal) for row in @_rows when row.temporal
    result

  _canFocusTimespan: (t0, t1) ->
    allTemporal = @_allTemporal()
    return true if allTemporal.length == 0

    for [start, stop] in allTemporal
      return true if start < t1 && stop > t0
    false

  _timespanForLabel: (group) ->
    next = group.previousSibling

    x0 = @_getTransformX(group)
    x1 = @_getTransformX(next, x0)

    [@positionToTime(x0), @positionToTime(x1) - 1]

  _contains: (start0, end0, start1, end1) ->
    start0 < start1 < end0 && start0 < end1 < end0

  _empty: (node) ->
    $(node).empty()

  _buildSvgElement: svgUtil.buildSvgElement

  _translate: (el, x, y) ->
    el.setAttribute('transform', "translate(#{x}, #{y})")
    el

  _setupDomVars: ->
    @svg = @_findScopedEl('.display')
    @selectionOverlay = @_findScopedEl('.selection')
    @focusOverlay = @_findScopedEl('.focus')
    @overlay = @_findScopedEl('.overlay')
    @olRows  = @_findScopedEl('.row')
    @timeline = @_findScopedEl('.draggable')
    @tlRows = @_findScopedEl('.rows')
    @axis = @_findScopedEl('.axis')

  _setupDisplay: ->
    offset = @_findScoped('.tools').width()
    node = @svg.firstElementChild
    while node
      @_translate(node, offset, 0)
      node = node.nextElementSibling

  _setupBehaviors: ->
    @_behaviors = [
      new TemporalSelectionBehavior(),
      new ScrollBehavior(),
      new DragBehavior(),
      new TemporalFocusBehavior(),
      new DataMouseoverBehavior(),
      new ClickZoomBehavior()
    ]
    for behavior in @_behaviors
      behavior.addTo(this)

  _pan: (dx, commit=true) ->
    @_startPan() unless @_panStart?

    start = @_panStart
    end = @_panEnd

    span = end - start
    @start = start - dx * @scale
    @end = @start + span

    @originPx = -(@_panStartX + dx) # x offset from its original position

    draggables = @root.find([@scope('.draggable'), @scope('.selection'), @scope('.display-top'), @scope('.focus')].join(', '))
    draggables.attr('transform', "translate(#{-@originPx + OFFSET_X},0)")
    @_forceRedraw()

    @_finishPan() if commit

  _startPan: ->
    draggable = @root.find(@scope('.draggable'))[0]
    @_panStartX = @_getTransformX(draggable, OFFSET_X) - OFFSET_X
    @_panStart = @start
    @_panEnd = @end

  _finishPan: =>
    @_updateTimeline()
    @_panStartX = @_panStart = @_panEnd = null

  _buildIndicatorArrow: (id, transform) ->
    g = @_buildSvgElement('g',
      class: @scope('indicator'),
      id: id,
      transform: transform)
    g.appendChild(@_buildSvgElement('path', d: 'M 0 -5 L 6 1 L 8 -1 L 4 -5 L 8 -9 L 6 -11 z'))
    g.appendChild(@_buildSvgElement('path', d: 'M 5 -5 L 11 1 L 13 -1 L 9 -5 L 13 -9 L 11 -11 z'))
    g

  _updateRowNames: ->
    rows = @_rows
    overlay = @olRows
    @_empty(overlay)
    y = 0

    textGroup = @_buildSvgElement('g')

    for row in rows
      overlay.appendChild(@_buildIndicatorArrow("arrow-left-#{row.id}", "translate(0, #{y})"))
      overlay.appendChild(@_buildIndicatorArrow("arrow-right-#{row.id}", "translate(#{@width - 20}, #{y - 10}) rotate(180)"))

      txt = @_buildSvgElement('text', x: 15, y: y)
      txt.textContent = row.title
      textGroup.appendChild(txt)
      y += ROW_HEIGHT

    overlay.appendChild(textGroup)

    fn = =>
      bbox = textGroup.getBBox()
      rect = @_buildSvgElement('rect', x: bbox.x, y: -ROW_FONT_HEIGHT - ROW_PADDING, width: bbox.width, height: y, class: @scope('shadow'))
      overlay.insertBefore(rect, overlay.firstChild) if overlay.firstChild
    setTimeout(fn, 0)

    null

  _updateTimeline: ->
    {axis, timeline, start, end, root} = this
    zoom = @_zoom

    @_empty(axis)

    root.find('h1').text(RESOLUTIONS[zoom - 1])

    line = @_buildSvgElement('line', class: @scope('timeline'), x1: MIN_X, y1: 0, x2: MAX_X, y2: 0)
    axis.appendChild(line)

    elWidth = root.width()
    elWidth = $(window).width() if elWidth == 0

    @width = width = elWidth - root.find(@scope('.tools')).width()
    @scale = (end - start) / width # ms per pixel

    range = @range()

    @_drawIntervals(range[0], range[1], zoom - 1)

    for own k, _ of @_data
      @_drawData(k)

    resolution = range[2]
    [loadedStart, loadedEnd, loadedResolution] = @_loadedRange
    unless loadedResolution == resolution && @_contains(loadedStart, loadedEnd, start, end)
      for node in @tlRows.childNodes
        node.setAttribute('class', "#{node.getAttribute('class')} #{@scope('loading')}")

    @parent.trigger(@scopedEventName('rangechange'), range)

  setTemporal: (ranges, event=false) ->
    return if @_globalTemporal == ranges
    @_globalTemporal = ranges
    @_drawTemporalBounds()
    if event
      setRemoveEvent = if ranges.length > 0 then 'temporalset' else 'temporalremove'
      rangeDates = (range ? new Date(range) for range in ranges[0] ? [])
      @parent.trigger(@scopedEventName(setRemoveEvent), rangeDates)
      @parent.trigger(@scopedEventName('temporalchange'), rangeDates)
    @parent

  getTemporal: ->
    ((time ? new Date(time) for time in temp) for temp in (@_globalTemporal ? []))

  clearTemporal: (event=false) ->
    @setTemporal([], event)
    for row in @_rows
      row.temporal = null
      if event
        @parent.trigger(@scopedEventName('rowtemporalremove'), row.id)
        @parent.trigger(@scopedEventName('rowtemporalchange'), row.id)
    @_drawTemporalBounds()
    @parent

  setRowTemporal: (id, ranges, event=false) ->
    row = @_getRow(id)
    if row
      row.temporal = ranges
      if event
        setRemoveEvent = if ranges.length > 0 then 'rowtemporalset' else 'rowtemporalremove'
        eventArgs = [row.id]
        for range in ranges[0] ? []
          eventArgs.push(range ? new Date(range))
        @parent.trigger(@scopedEventName(setRemoveEvent), eventArgs)
        @parent.trigger(@scopedEventName('rowtemporalchange'), eventArgs)
    @_drawTemporalBounds()
    @parent

  getRowTemporal: (id) ->
    ((time ? new Date(time) for time in temp) for temp in (@_getRow(id)?.temporal ? []))

  _getRow: (id) ->
    for row in @_rows
      return row if row.id == id
    null

  _drawTemporalBounds: ->
    overlay = @selectionOverlay
    rows = @_rows
    @_empty(overlay)

    globalIndexes = []
    for row, index in rows
      if row.temporal?.length > 0
        @_createTemporalRegion(overlay, row.temporal, [index], row.id)
      else
        globalIndexes.push(index)

    if @_globalTemporal
      @_createTemporalRegion(overlay, @_globalTemporal, globalIndexes)

  _createSelectionRegion: (overlay, x0, x1, indexes, rowId) ->
    left = new TemporalFencepost(overlay, x0, MAX_Y)
    right = new TemporalFencepost(overlay, x1, MAX_Y)

    update = ->
      leftX = Math.min(left.x, right.x)
      rightX = Math.max(left.x, right.x)
      start = new Date(@positionToTime(leftX))
      stop = new Date(@positionToTime(rightX))
      if rowId?
        @setRowTemporal(rowId, [[start, stop]], true)
      else
        @setTemporal([[start, stop]], true)
      null

    left.on 'commit', update, this
    right.on 'commit', update, this
    left.on 'update', @_forceRedraw, this
    right.on 'update', @_forceRedraw, this

    for index in indexes
      new TemporalDisplay overlay, left, right,
        class: @scope('selection-region')
        y: TOP_HEIGHT + ROW_HEIGHT * index
        height: ROW_HEIGHT
    [left, right]

  _createTemporalRegion: (overlay, temporal, indexes, rowId) ->
    for [start, stop] in temporal
      @_createSelectionRegion(overlay, @timeToPosition(start), @timeToPosition(stop), indexes, rowId)

  _buildRect: (attrs) ->
    attrs = $.extend({x: MIN_X, x1: MAX_X, y: MIN_Y, y1: MAX_Y}, attrs)
    attrs['width'] ?= (attrs.x1 - attrs.x) | 0
    attrs['height'] ?= (attrs.y1 - attrs.y) | 0
    delete attrs.x1
    delete attrs.y1
    @_buildSvgElement 'rect', attrs

  _roundTime: (time, zoom, increment=0) ->
    time = Math.round(time / 1000) * 1000
    date = new Date(time)
    components = (date["getUTC#{c}"]() for c in ['FullYear', 'Month', 'Date', 'Hours', 'Minutes'])
    components = components.slice(0, Math.max(components.length - zoom, 1))
    # Zoom to decade
    if zoom == ZOOM_LEVELS.length - 2
      components[0] = Math.floor(components[0] / 10) * 10
      increment *= 10

    components[components.length - 1] += increment
    components.push(0) if components.length == 1
    Date.UTC(components...)

  _drawIntervals: (start, end, zoom) ->
    axis = @axis

    start = @_roundTime(start, zoom)
    end = @_roundTime(end, zoom)

    time = end

    while time >= start
      date = new Date(time)
      prev = @_roundTime(time, zoom, -1)
      next = @_roundTime(time, zoom, 1)
      interval = @_buildIntervalDisplay(@timeToPosition(time), @timeToPosition(next), LABELS[zoom](date)...)
      axis.appendChild(interval)
      time = prev

  _buildSvgTemplate: (templateFn, context) ->
    html = templateFn(context)
    $svg = $('<svg xmlns="http://www.w3.org/2000/svg" />')
    result = $svg.html(html).children()[0] # Ensures correct namespaces
    result = $svg.append(html).children()[0] unless result? # Jasmine support
    result

  _buildIntervalDisplay: (x0, x1, text, subText) ->
    width = x1 - x0
    result = @_buildSvgTemplate buildInterval,
      ns: @namespace
      width: width
      x0: x0
      x1: x1
      text: text
      subText: subText
    result

  _setHeight: ->
    rowsHeight = @_rows.length * ROW_HEIGHT + 2 * ROW_PADDING
    @_translate(@axis, 0, TOP_HEIGHT + rowsHeight)
    totalHeight = Math.max(TOP_HEIGHT + rowsHeight + AXIS_HEIGHT, 100)
    @root.height(totalHeight)
    $(@svg).height(totalHeight)
    @parent.trigger(@scopedEventName('heightchange'), [totalHeight])

pluginUtil.create('timeline', Timeline)
