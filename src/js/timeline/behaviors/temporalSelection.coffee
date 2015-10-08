Draggable = require('../draggable')

module.exports = class
  addTo: (@tl) ->
    el = @tl._findScopedEl('.display-top')
    $(el).on 'click', @clear

    @draggable = new Draggable(el, @animate)
      .on 'dragstart', @dragstart, this
      .on 'dragmove', @dragmove, this
      .on 'dragend', @dragend, this

  removeFrom: (tl) ->
    tl._findScoped('.display-top').off 'click', @clear
    @draggable.dispose()
    @_left.dispose()
    @_right.dispose()
    @_left = @_right = @draggable = @tl = null

  clear: =>
    @tl.setTemporal([])

  dragstart: ({cursor}) ->
    tl = @tl
    overlay = tl.selectionOverlay
    tl._empty(overlay)
    [@_left, @_right] = tl._createSelectionRegion(overlay, cursor.x, cursor.x, [0...tl._rows.length])

  dragmove: (e) ->
    @_right._onUpdate(e)

  dragend: (e) ->
    @tl.root.trigger("createdtemporal.#{@tl.namespace}")
    @_right._onEnd(e)
