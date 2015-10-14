svgUtil = require('../util/svg')

browserPrefix = (name) ->
  window['webkit' + name] || window['moz' + name] || window['ms' + name]

requestAnimFrame = (window.requestAnimationFrame ||
                    browserPrefix('RequestAnimationFrame') ||
                   (fn) -> window.setTimeout(fn))
cancelAnimFrame = (window.cancelAnimationFrame ||
                   browserPrefix('CancelAnimationFrame') ||
                   browserPrefix('CancelRequestAnimationFrame') ||
                  (id) -> window.clearTimeout(id))

getOffset = (e) ->
  el = e.target
  x = y = 0

  while el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)
    x += el.offsetLeft - el.scrollLeft
    y += el.offsetTop - el.scrollTop
    el = el.offsetParent;

  x = e.clientX - x
  y = e.clientY - y

  {x: x, y: y}

module.exports = class Draggable
  constructor: (element, @animate=true) ->
    @_dragging = false
    @_element = element
    @enable()

  dispose: ->
    @disable()
    @_listeners = {}

  enable: ->
    el = @_element
    el.addEventListener("mousedown", @_mousedown)
    el.addEventListener("touchstart", @_mousedown)

  disable: ->
    el = @_element
    el.removeEventListener("mousedown", @_mousedown)
    el.removeEventListener("touchstart", @_mousedown)

  on: (events, fn, context) ->
    @_listeners ?= {}
    context ?= this
    for event in events.split(' ')
      @_listeners[event] ?= []
      @_listeners[event].push([fn, context])
    this

  off: (events, fn, context) ->
    @_listeners ?= {}
    for event in events.split(' ')
      listeners = @_listeners[event]
      if listeners?
        i = 0
        while i < listeners.length
          if listeners[i][0] == fn && listeners[i][1] == context
            listeners.splice(i, 1)
          else
            i++
        if listeners.length == 0
          delete @_listeners[event]
    this

  fire: (event, data) ->
    #console.log event, JSON.stringify(data)
    listeners = @_listeners?[event]
    return this unless listeners?

    e = $.extend({}, data ? {}, type: event, target: this)
    fn.call(context, e) for [fn, context] in listeners
    this

  _mousedown: (e) =>
    return if e.shiftKey || (e.which != 1 && e.button != 1 && !e.touches)
    e.stopPropagation()
    return if @_dragging

    e = e.touches?[0] || e
    @_preStartCursor = getOffset(e)

    document.addEventListener("mousemove", @_mousemove)
    document.addEventListener("touchmove", @_mousemove)
    document.addEventListener("mouseup", @_mouseup)
    document.addEventListener("touchend", @_mouseup)

  _mousemove: (e) =>
    return if e.touches?.length > 1

    e = e.touches?[0] || e
    cursor = getOffset(e)
    offset = {x: cursor.x - @_preStartCursor.x, y: cursor.y - @_preStartCursor.y}

    return if Math.abs(offset.x) + Math.abs(offset.y) < 3

    e.preventDefault()

    unless @_dragging
      @_startCursor = cursor
      @_startLoc = @_currentLoc = @_getLoc()

    @_currentOffset = offset = {x: cursor.x - @_startCursor.x, y: cursor.y - @_startCursor.y}
    @_currentLoc = {x: @_startLoc.x + offset.x, y: @_startLoc.y + offset.y}
    @_currentCursor = {x: -@_startLoc.x + @_startCursor.x + offset.x, y: -@_startLoc.y + @_startCursor.y + offset.y}

    @_start() unless @_dragging

    if @animate
      cancelAnimFrame(@_frameId)
      @_frameId = requestAnimFrame(=> @_move())
    else
      @_move()

  _mouseup: (e) =>
    document.removeEventListener("mousemove", @_mousemove)
    document.removeEventListener("touchmove", @_mousemove)
    document.removeEventListener("mouseup", @_mouseup)
    document.removeEventListener("touchend", @_mouseup)
    cancelAnimFrame(@_frameId) if @animate
    @_end() if @_dragging

  _start: ->
    @_dragging = true
    @_positions = []
    @_times = []
    @fire('dragstart', @_state())

  _move: ->
    @fire('predragmove', @_state())

    time = +new Date()
    @_positions.push(@_currentLoc.x)
    @_times.push(time)

    if time - @_times[0] > 200
      @_positions.shift()
      @_times.shift()

    @fire('dragmove', @_state())

  _animateEnd: ->
    dx = @_currentLoc.x - @_positions[0]
    dt = +new Date() - @_times[0]
    v = dx/dt
    @_animateFling(v, .01, +new Date())

  _end: ->
    if @animate && @_positions?.length > 0
      @_animateEnd()
    else
      @_staticEnd()

  _animateFling: (v, a, t) ->
    now = +new Date()
    dt = now - t
    dv = a*dt
    if v < 0
      v += dv
    else
      v -= dv

    if dv < Math.abs(v)
      @_currentLoc.x += v * dt
      @_currentOffset.x += v * dt
      @_move()
      requestAnimFrame =>
        @_animateFling(v, a, now)
    else
      @_staticEnd()

  _staticEnd: ->
    @_dragging = false
    @fire('dragend', @_state())

  _getLoc: ->
    # FIXME: y
    {x: svgUtil.getTransformX(@_element), y: 0}

  _state: ->
    {start: @_startLoc, offset: @_currentOffset, cursor: @_currentCursor}
