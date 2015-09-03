Draggable = require('./draggable')
svgUtil = require('../util/svg')

module.exports = class TemporalFencepost extends Draggable
  constructor: (parent, x, @height) ->
    @line = svgUtil.buildSvgElement('line')
    @triangle = svgUtil.buildSvgElement('path')

    @update(x)

    parent.appendChild(@line)
    parent.appendChild(@triangle)

    super(@triangle, true)

    @on 'dragend', @_onEnd, this
    @on 'predrag', @_onUpdate, this


  dispose: ->
    {line, triangle} = this
    @line = @triangle = null

    line.parentNode.removeChild(line)
    triangle.parentNode.removeChild(triangle)
    @disable()

  update: (x) ->
    @x = x
    y = 0
    half_w = 10
    h = 10
    svgUtil.updateSvgElement(@line, x1: x, y1: y + h, x2: x, y2: @height)
    svgUtil.updateSvgElement(@triangle, d: "m#{x - half_w} #{y} l #{half_w} #{h} l #{half_w} #{-h} z")
    @fire('update', {x: x})
    this

  _onUpdate: (e) ->
    @update(e.cursor.x)

  _onEnd: (e) ->
    @_onUpdate(e.cursor.x)
    @fire('commit', x: e.cursor.x)
    @_startX = null
