beforeEach ->
  @timespans =
    days: (days) ->
      days * 24 * 3600 * 1000

    months: (months) ->
      months * @days(30)

  @present = Date.UTC(2014, 2, 1)
  @start = @present - @timespans.days(365)
  @exampleRow =
    id: 'examplerow'
    title: 'Example Row'
    min: Date.UTC(2013, 2, 1) / 1000
    max: Date.UTC(2014, 2, 1) / 1000
  @exampleRow2 =
    id: 'examplerow2'
    title: 'Example Row 2'
    min: Date.UTC(2013, 2, 1) / 1000
    max: Date.UTC(2014, 2, 1) / 1000
  @exampleData =
    start: Date.UTC(2013, 2, 1) / 1000
    end: Date.UTC(2014, 2, 1) / 1000
    resolution: 'day'
    intervals: [
      [Date.UTC(2013, 5) / 1000, Date.UTC(2013, 8) / 1000],
      [Date.UTC(2013, 10) / 1000, Date.UTC(2013, 12) / 1000]
    ]
  @exampleData2 =
    start: Date.UTC(2013, 2, 1) / 1000
    end: Date.UTC(2014, 2, 1) / 1000
    resolution: 'day'
    intervals: [
      [Date.UTC(2013, 5) / 1000, Date.UTC(2013, 8) / 1000],
      [Date.UTC(2013, 10) / 1000, Date.UTC(2013, 12) / 1000]
    ]

  @buildTimeline = ->
    $tl = $('<div id="timeline"/>').prependTo(document.body)
    $tl.timeline(end: @present, animate: false)
    $tl

  @buildTimelineWithData = (data=@exampleData)->
    row = @exampleRow
    data = $.extend({}, @exampleData, data)
    $tl = @buildTimeline()
    $tl.timeline('rows', [row])
    $tl.timeline('data', row.id, data)
    $tl

  @closeTo = (a, b, magnitude) ->
    # 1% variance to tolerate rounding errors
    tolerance = 5 + Math.abs(magnitude) / 100
    Math.abs(a - b) < tolerance

  @pan = ($tl, dt_ms) ->
    dx = $tl.timeline('timeSpanToPx', dt_ms)
    $tl.find('svg .timeline-draggable').simulate('drag', {dx: -dx, dy: 0})
    $tl

  @getFencepost = ($tl, t) =>
    result = $()
    pos = $tl.timeline('timeToPosition', t)
    magnitude = $tl.width()
    closeTo = @closeTo
    iso = @iso

    $tl.find('.timeline-selection line').each ->
      x = parseFloat($(this).attr('x1'))
      if closeTo(x, pos, magnitude)
        result = $(this)
    result

  @dragTemporal = ($tl, oldDate, newDate) ->
    dt = oldDate - newDate
    x0 = $tl.timeline('timeToPosition', oldDate)
    x1 = $tl.timeline('timeToPosition', newDate)
    $el = @getFencepost($tl, oldDate)
    offset = 0
    if $el.size() == 0
      $el = $tl.find('.timeline-display-top')
      offset = $tl.position().left + $el.position().left
    else
      $el = $el.next()

    dx = x1 - x0
    $el.simulate('drag', {dx: dx, dy: 0, x0: x0 + offset})
    $tl

  @clickDate = ($tl, label) ->
    $tl.find(".timeline-axis-label").each ->
      if $(this).text() == label
        $(this).click().focus().trigger('focusin')
        return false

  @keypress = (selector, key) ->
    keyCode = switch key
      when 'enter' then 13
      when 'left' then 37
      when 'up' then 38
      when 'right' then 39
      when 'down' then 40
      when 'delete' then 46
      else parseInt(key, 10)

    $(selector).trigger($.Event('keydown', {keyCode: keyCode}))

  @iso = (date) ->
    if date? then new Date(date).toISOString() else date
