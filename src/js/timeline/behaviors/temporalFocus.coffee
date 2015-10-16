module.exports = class
  constructor: ->
    @_labelEvents =
      click: '_onLabelClick'
      mouseover: '_onLabelMouseover'
      mouseout: '_onLabelMouseout'
    @_rootEvents =
      focusin: '_onFocusIn'
      focusout: '_onFocusOut'
      keydown: '_onKeydown'

  addTo: (@tl) ->
    tl = @tl
    root = tl.root
    label = tl.scope('.date-label')
    root.on(event, label, this[handler]) for own event, handler of @_labelEvents
    root.on(event, this[handler]) for own event, handler of @_rootEvents

  removeFrom: (tl) ->
    label = tl.scope('.date-label')
    root = tl.root
    root.off(event, label, this[handler]) for own event, handler of @_labelEvents
    root.off(event, this[handler]) for own event, handler of @_rootEvents

  _onLabelClick: (e) =>
    tl = @tl
    return if tl._dragging
    tl.root.trigger('clicklabel')
    label = e.currentTarget
    [start, stop] = tl._timespanForLabel(label)
    if tl._canFocusTimespan(start, stop) && (@_hasFocus || !tl.isFocus(start))
      tl.focus(start, stop)

  _onLabelMouseover: (e) =>
    tl = @tl
    label = e.currentTarget
    [start, stop] = tl._timespanForLabel(label)
    unless tl._canFocusTimespan(start, stop)
      label.setAttribute('class', "#{tl.scope('date-label')} #{tl.scope('nofocus')}")

  _onLabelMouseout: (e) =>
    tl = @tl
    label = e.currentTarget
    label.setAttribute('class', tl.scope('date-label'))

  _onFocusIn: (e) =>
    tl = @tl
    hovered = tl._findScopedEl('.date-label:hover')
    @_onLabelClick(currentTarget: hovered) if hovered?
    tl.root.addClass('hasfocus')
    tl._forceRedraw()
    # We want click behavior when we have focus, but not when the focus came from the
    # click's mousedown.  Ugh.
    setTimeout((=> @_hasFocus = true), 500)

  _onFocusOut: (e) =>
    tl = @tl
    tl.root.removeClass('hasfocus')
    @_hasFocus = false
    tl._forceRedraw()

  _onKeydown: (e) =>
    tl = @tl
    focus = tl._focus
    key = e.keyCode
    left = 37
    up = 38
    right = 39
    down = 40

    if focus && (key == left || key == right)
      tl.root.trigger('arrowpan')
      zoom = tl._zoom - 1

      focusEnd = tl._roundTime(focus, zoom, 1)

      if key == left
        t0 = tl._roundTime(focus, zoom, -1)
        t1 = focus - 1
        dx = tl.timeSpanToPx(focusEnd - focus)
      else
        t0 = focusEnd
        t1 = tl._roundTime(focus, zoom, 2) - 1
        dx = -tl.timeSpanToPx(t1 - t0)

      if tl._canFocusTimespan(t0, t1)
        tl._pan(dx)
        tl.focus(t0, t1)
