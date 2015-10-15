describe 'Zooming', ->
  zoomLevelExpectations = (dir, opts) =>
    {range, axisLabel, title, center, more} = opts
    delta = if dir == 'out' then 1 else -1

    describe "clicking the zoom #{dir} button", ->
      beforeEach ->
        @$tl.find(".timeline-zoom-#{dir}").simulate('click')

      it 'zooms in', ->
        expect(@$tl.timeline('zoom')).toEqual(@zoom + delta)

      it 'centers on the temporal constraint', ->
        expect(@$tl).toHaveCenter(center)

      it 'displays the new zoom level', ->
        expect(@$tl.find('h1').text()).toEqual(title)

      it 'shows updated intervals', ->
        expect(@$tl).toHaveAxisLabel(axisLabel)

      it 'raises an event, allowing clients to fetch new data', ->
        expect(@firedEvent).toEqual(true)
        expect(@eventArgs).toEqual(range)

      more?.call(this)

  beforeEach ->
    @$tl = @buildTimelineWithData()
    @zoom = @$tl.timeline('zoom')
    @firedEvent = false
    @eventArgs = null
    @$tl.on 'rangechange.timeline', (e, args...) =>
      @firedEvent = true
      @eventArgs = args

  describe 'when a temporal constraint is set', ->
    start = Date.UTC(2013, 7, 15)
    end = Date.UTC(2013, 7, 30)

    beforeEach ->
      @$tl.timeline('setTemporal', [[start, end]])

    zoomLevelExpectations 'in',
      range: [Date.UTC(2013, 6, 7), Date.UTC(2013, 9, 8), 'hour']
      axisLabel: '28'
      title: 'day'
      center: (start + end) / 2
      more: ->
        it 'redraws the selection', ->
          expect(@$tl).toDisplayTemporal(start, end)

    zoomLevelExpectations 'out',
      range: [Date.UTC(1998, 7, 11, 12), Date.UTC(2028, 8, 2, 12), 'month']
      axisLabel: '2020'
      title: 'year'
      center: (start + end) / 2
      more: ->
        it 'redraws the selection', ->
          expect(@$tl).toDisplayTemporal(start, end)

  describe 'when a timespan is focused', ->
    start = Date.UTC(2013, 7, 1)
    end = Date.UTC(2013, 8, 1)

    beforeEach ->
      @$tl.timeline('focus', start, end)

    zoomLevelExpectations 'in',
      range: [Date.UTC(2013, 6, 1), Date.UTC(2013, 9, 2), 'hour']
      axisLabel: '28'
      title: 'day'
      center: (start + end) / 2
      more: ->
        it 'clears the temporal focus', ->
          expect(@$tl).toHaveNoFocusedTimeSpan()

    zoomLevelExpectations 'out',
      range: [Date.UTC(1998, 7, 5, 12), Date.UTC(2028, 7, 27, 12), 'month']
      axisLabel: '2020'
      title: 'year'
      center: (start + end) / 2
      more: ->
        it 'clears the temporal focus', ->
          expect(@$tl).toHaveNoFocusedTimeSpan()

  describe 'when no temporal constraint is set and no timespan is focused', ->
    start = Date.UTC(2013, 7, 1)
    end = Date.UTC(2013, 8, 1)

    zoomLevelExpectations 'in',
      range: [Date.UTC(2013, 6, 14, 12), Date.UTC(2013, 9, 15, 12), 'hour']
      axisLabel: '28'
      title: 'day'
      center: Date.UTC(2013, 7, 30)

    zoomLevelExpectations 'out',
      range: [Date.UTC(1998, 7, 19), Date.UTC(2028, 8, 10), 'month']
      axisLabel: '2020'
      title: 'year'
      center: Date.UTC(2013, 7, 30)
