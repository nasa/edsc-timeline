module.exports = class
  constructor: ->
    @listeners =
      mousewheel: '_onSafariWheel'
      DOMMouseScroll: '_onSafariWheel'
      wheel: '_onWheel'
      touchstart: '_onTouchStart'
      touchmove: '_onTouchMove'

  addTo: (@tl) ->
    svg = @tl.svg
    @_allowWheel = true

    for own event, handler of @listeners
      svg.addEventListener(event, this[handler])

  removeFrom: (tl) ->
    svg = @tl.svg
    for own event, handler of @listeners
      svg.removeEventListener(event, this[handler])

  _rateLimit: (timeout=300)->
    @_allowWheel = false
    setTimeout((=> @_allowWheel = true), timeout)

  _doScroll: (deltaX, deltaY, clientX) ->
    return unless @_allowWheel
    time = @_getTime(clientX)
    tl = @tl
    if Math.abs(deltaY) > Math.abs(deltaX)
      levels = if deltaY > 0 then -1 else 1
      tl.root.trigger('scrollzoom')
      tl._deltaZoom(levels, time)
      @_rateLimit()
    else if deltaX != 0
      tl.root.trigger('scrollpan')
      tl._pan(deltaX)

  _getTime: (clientX) ->
    tl = @tl
    draggable = tl._findScopedEl('.draggable')
    origin = tl._getTransformX(draggable)

    x = clientX - tl.svg.clientLeft - origin
    time = tl.positionToTime(x)

  _onSafariWheel: (e) =>
    doScroll(e.wheelDeltaX, e.wheelDeltaY, e.clientX)
    e.preventDefault()

  _onWheel: (e) =>
    return if e.type == "mousewheel"
    @_doScroll(-e.deltaX, -e.deltaY, e.clientX)
    e.preventDefault()

  _onTouchStart: (e) =>
    return unless e.touches && e.touches.length == 2
    @_touchCenter = (e.touches[0].clientX + e.touches[1].clientX) / 2
    @_touchSeparation = Math.abs(e.touches[0].clientX - e.touches[1].clientX)
    e.preventDefault()

  _onTouchMove: (e) =>
    return unless e.touches && e.touches.length == 2
    deltaY = Math.abs(e.touches[0].clientX - e.touches[1].clientX) - @_touchSeparation
    @_doScroll(0, -deltaY, @_touchCenter)
    e.preventDefault()
