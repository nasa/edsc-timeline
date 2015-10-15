module.exports = class
  addTo: (@tl) ->
    tl = @tl
    tl.root.on "mouseover", tl.scope('.data'), @_onDataMouseover
    tl.root.on "mouseout", tl.scope('.data'), @_onDataMouseout

  removeFrom: (tl) ->
    tl.root.off "mouseover", tl.scope('.data'), @_onDataMouseover
    tl.root.off "mouseout", tl.scope('.data'), @_onDataMouseout

  _onDataMouseover: (e) =>
    tl = @tl
    tooltip = tl._findScoped('.tooltip')
    data = e.target

    id = data.parentNode.className.baseVal.split(' ')[0]
    resolution = tl._data[id][2]
    intervals = tl._data[id][3]
    nodes = $(e.currentTarget.childNodes)
    interval = intervals[nodes.index(data)]
    start = interval[0] * 1000
    stop = interval[1] * 1000
    tooltip.find('.inner').text("#{@_dateWithResolution(start, resolution)} to #{@_dateWithResolution(stop, resolution)}")

    matrix = data.getScreenCTM()
    leftEdge = matrix.e + data.x.baseVal.value
    rightEdge = leftEdge + data.width.baseVal.value
    leftEdge = 0 if leftEdge < 0
    rightEdge = window.innerWidth if rightEdge > window.innerWidth
    tooltip.css("left", ((leftEdge + rightEdge)/2 - tooltip.width()/2) + "px")
    dataTop = matrix.f
    timelineTop = $('.timeline-container').offset().top
    tooltip.css("top", (dataTop - timelineTop  - 33) + "px")

    tooltip.show()

  _onDataMouseout: (e) =>
    @tl._findScoped('.tooltip').hide().text('') # For some odd reason, .text is necessary for Jasmine

  _dateWithResolution: (date, resolution) ->
    str = new Date(date).toUTCString()
    str = str
      .replace(/^\S+\s/, '') # Remove leading word (day of week)
      .replace(/:[^:]*\s/, ' ') # Remove seconds

    if resolution == 'day' || resolution == 'month' || resolution == 'year'
      str = str.replace(/\s\d+:\S+/, '') # Remove time

    if resolution == 'year'
      str = str.replace(/^\S+\s/, '') # Remove date

    str
