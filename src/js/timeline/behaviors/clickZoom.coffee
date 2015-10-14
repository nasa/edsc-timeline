module.exports = class
  addTo: (tl) ->
    @tl = tl
    tl._findScopedEl('.zoom-in').addEventListener('click', @_onZoomIn)
    tl._findScopedEl('.zoom-out').addEventListener('click', @_onZoomOut)

  removeFrom: (tl) ->
    tl._findScopedEl('.zoom-in').removeEventListener('click', @_onZoomIn)
    tl._findScopedEl('.zoom-out').removeEventListener('click', @_onZoomOut)

  _zoomCenter: ->
    tl = @tl
    allTemporal = tl._allTemporal()
    allTemporal.push([tl._focus, tl._focusEnd]) if tl._focus && tl._focusEnd

    tlStart = tl.startTime()
    tlEnd = tl.endTime()

    t0 = tlEnd
    t1 = tlStart

    for [start, end] in allTemporal when start < tlEnd && end > tlStart
      t0 = Math.min(t0, start) if start > tlStart
      t1 = Math.max(t1, end) if end < tlEnd

    center = (t0 + t1) / 2

  _clickZoom: (delta) ->
    @tl.root.trigger('buttonzoom')
    @tl._deltaZoom(delta, @_zoomCenter(), false)

  _onZoomIn: => @_clickZoom(-1)
  _onZoomOut: => @_clickZoom(1)
