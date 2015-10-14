beforeEach ->

  to = (pass) ->
    if pass then 'not to' else 'to'

  closeTo = @closeTo
  iso = @iso
  getFencepost = @getFencepost

  actualTemporalDisplays = ($tl) ->
    result = []
    $tl.find('.timeline-selection rect').each ->
      x = parseFloat($(this).attr('x'))
      width = parseFloat($(this).attr('width'))
      actualStart = $tl.timeline('positionToTime', x)
      actualEnd = $tl.timeline('positionToTime', x + width)
      result.push "<#{iso(actualStart)}, #{iso(actualEnd)}>"
    result


  jasmine.addMatchers
    toHaveTimelineRange: (util, customEqualityTesters) ->
      compare: ($tl, start, end) ->
        actualStart = $tl.timeline('startTime')
        actualEnd = $tl.timeline('endTime')

        result = closeTo(actualStart, start, end - start) && closeTo(actualEnd, end, end - start)
        {
          pass: result
          message: "Expected timeline
            #{to(result)} have time range #{iso(start)}, #{iso(end)}.
            Got #{iso(actualStart)}, #{iso(actualEnd)}"
        }
    toHaveTimeOffset: (util, customEqualityTesters) ->
      compare: ($tl, selector, dt) ->
        expectedDx = -$tl.timeline('timeSpanToPx', dt)
        transform = $tl.find(selector).attr('transform')
        actualDx = parseInt(transform.replace('translate(', ''), 10) - 48
        result = closeTo(actualDx, expectedDx, expectedDx)
        {
          pass: result
          message: "Expected timeline #{selector}
            #{to(result)} have x offset #{expectedDx}.
            Got #{actualDx}"
        }
    toHaveFill: (util, customEqualityTesters) ->
      compare: (el, expected) ->
        actual = $(el)[0].style.fill
        result = actual == expected
        {
          pass: result
          message: "Expected #{el} #{to(result)} have fill #{expected}. Got #{actual}."
        }

    toHaveAxisLabel: (util, customEqualityTesters) ->
      compare: ($tl, label) ->
        result = false
        $tl.find(".timeline-axis-label").each ->
          if $(this).text() == label
            result = true
            return false
        {
          pass: result
          message: "Expected timeline #{to(result)} have an axis label \"#{label}\""
        }

    toHaveFocusedTimeSpan: (util, customEqualityTesters) ->
      compare: ($tl, start, end) ->
        $focus = $tl.find('.timeline-focus')
        startPx = Math.floor($tl.timeline('timeToPosition', start))
        endPx = Math.floor($tl.timeline('timeToPosition', end))
        hasLeftFocus = $focus.find("rect[width^=\"#{startPx + 100000}\"]").size() > 0
        hasRightFocus = $focus.find("rect[x^=\"#{endPx}\"]").size() > 0

        actualStart = actualEnd = null
        $children = $focus.children()
        if $children.length == 2
          actualStartPx = parseInt($children[0].getAttribute('width')) - 100000
          actualEndPx = parseInt($children[1].getAttribute('x'), 10)
          [actualStart, actualEnd] = $tl.timeline('getFocus')

          result = (
            actualStart == start &&
            actualEnd == end - 1 &&
            startPx == actualStartPx &&
            endPx == actualEndPx
          )
        else
          result = false

        {
          pass: result
          message: "Expected timeline
            #{to(result)} have focus #{iso(start)}, #{iso(end - 1)}.
            Got #{iso(actualStart)}, #{iso(actualEnd)}"
        }

    toHaveNoFocusedTimeSpan: (util, customEqualityTesters) ->
      compare: ($tl) ->
        $focus = $tl.find('.timeline-focus')
        result = $focus.children().size() == 0
        {
          pass: result
          message: "Expected timeline #{to(!result)} have focus"
        }

    toHaveCenter: (util, customEqualityTesters) ->
      compare: ($tl, center) ->
        actual = $tl.timeline('center')
        result = closeTo(center, actual, $tl.timeline('endTime') - $tl.timeline('startTime'))
        {
          pass: result
          message: "Expected timeline
            #{to(result)} have center #{iso(center)},
            got #{iso(actual)}"
        }

    toHaveStoredGlobalTemporal: (util, customEqualityTesters) ->
      compare: ($tl, start, end) ->
        temporal = $tl.timeline('getTemporal')
        [actualStart, actualEnd] = if temporal?.length > 0 then temporal[0] else [null, null]
        mag = $tl.timeline('endTime') - $tl.timeline('startTime')
        result = closeTo(+(start ? 0), +(actualStart ? 0), mag) && closeTo(+(end ? 0), +(actualEnd ? 0), mag)

        {
          pass: result
          message: "Expected timeline
            #{to(result)} have stored global temporal #{iso(start)}, #{iso(end)}.
            Got #{iso(actualStart)}, #{iso(actualEnd)}"
        }

    toHaveStoredRowTemporal: (util, customEqualityTesters) ->
      compare: ($tl, id, start, end) ->
        temporal = $tl.timeline('getRowTemporal', id)
        [actualStart, actualEnd] = if temporal?.length > 0 then temporal[0] else [null, null]
        mag = $tl.timeline('endTime') - $tl.timeline('startTime')
        result = closeTo(+(start ? 0), +(actualStart ? 0), mag) && closeTo(+(end ? 0), +(actualEnd ? 0), mag)
        {
          pass: result
          message: "Expected timeline
            #{to(result)} have stored row temporal #{iso(start)}, #{iso(end)}.
            Got #{iso(actualStart)}, #{iso(actualEnd)}"
        }

    toDisplayTemporal: (util, customEqualityTesters) ->
      compare: ($tl, start, end) ->
        $selection = $tl.find('.timeline-selection')
        startX = $tl.timeline('timeToPosition', start)
        endX = $tl.timeline('timeToPosition', end)
        width = Math.abs(endX - startX)
        mag = $tl.width()

        hasStart = getFencepost($tl, start).size() > 0
        hasEnd = getFencepost($tl, start).size() > 0
        hasArea = false
        $selection.find('rect').each ->
          x = parseFloat($(this).attr('x'))
          w = parseFloat($(this).attr('width'))
          hasArea = true if closeTo(startX, x, mag) && closeTo(width, w, mag)
        result = hasStart && hasEnd && hasArea
        {
          pass: result
          message: "Expected timeline
            #{to(result)} display temporal #{iso(start)}, #{iso(end)}.
            Got [#{actualTemporalDisplays($tl).join(', ')}]"
        }