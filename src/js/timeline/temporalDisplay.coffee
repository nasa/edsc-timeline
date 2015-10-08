TemporalFencepost = require('./fencepost')
svgUtil = require('../util/svg')

module.exports = class
  constructor: (parent, @left, @right, attrs) ->
    @left.on 'update', @update, this
    @right.on 'update', @update, this

    @rect = svgUtil.buildSvgElement('rect', attrs)
    parent.appendChild(@rect)
    @update()

  dispose: ->
    {left, right, update, rect} = this
    left.off 'update', update, this
    right.off 'update', update, this

    rect.parentNode.removeChild(rect)
    @rect = null

  update: (attrs) ->
    x = Math.min(@left.x, @right.x)
    width = Math.abs(@right.x - @left.x)

    svgUtil.updateSvgElement @rect, $.extend({}, attrs, {x: x, width: width})
    this
