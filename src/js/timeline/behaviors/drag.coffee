Draggable = require('../draggable')

module.exports = class
  addTo: (@tl) ->
    el = @tl._findScopedEl('.display')
    @_draggable = draggable = new Draggable(el, @animate)
    draggable.on 'dragmove', @_onDragMove, this
    draggable.on 'dragend', @_onDragEnd, this

  removeFrom: (tl) ->
    @_draggable.dispose()

  _onDragMove: (e) ->
    tl = @tl
    dx = e.offset.x
    tl._dragging = true if Math.abs(dx) > 5
    tl._pan(dx, false)

  _onDragEnd: (e) ->
    tl = @tl
    tl._dragging = false
    if e.offset?.x?
      tl.root.trigger('draggingpan')
      tl._pan(e.offset.x)
