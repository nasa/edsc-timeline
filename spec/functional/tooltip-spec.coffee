describe 'Tooltip', ->
  hookMouseoverData = ->
    beforeEach ->
      $(@$tl.find('.examplerow.timeline-data').children()[0]).trigger('mouseover')
    afterEach ->
      $(@$tl.find('.examplerow.timeline-data').children()[0]).trigger('mouseout')

  hookBuildWithResolution = (res) ->
    beforeEach ->
      @$tl = @buildTimelineWithData(resolution: res)

  describe 'when viewing data with minute-level precision', ->
    hookBuildWithResolution('minute')

    describe 'hovering a time span', ->
      hookMouseoverData()

      it 'displays a tooltip with minute-level precision', ->
        expect($('.timeline-tooltip .inner').text())
          .toEqual('01 Jun 2013 00:00 GMT to 01 Sep 2013 00:00 GMT')


  describe 'when viewing data with hour-level precision', ->
    hookBuildWithResolution('hour')

    describe 'hovering a time span', ->
      hookMouseoverData()

      it 'displays a tooltip with minute-level precision', ->
        expect($('.timeline-tooltip .inner').text())
          .toEqual('01 Jun 2013 00:00 GMT to 01 Sep 2013 00:00 GMT')

  describe 'when viewing data with day-level precision', ->
    hookBuildWithResolution('day')

    describe 'hovering a time span', ->
      hookMouseoverData()

      it 'displays a tooltip with day-level precision', ->
        expect($('.timeline-tooltip .inner').text())
          .toEqual('01 Jun 2013 to 01 Sep 2013')

  describe 'when viewing data with month-level zoom level', ->
    hookBuildWithResolution('month')

    describe 'hovering a time span', ->
      hookMouseoverData()

      it 'displays a tooltip with day-level precision', ->
        expect($('.timeline-tooltip .inner').text())
          .toEqual('Jun 2013 to Sep 2013')

  describe 'when viewing data with year-level zoom level', ->
    hookBuildWithResolution('year')

    describe 'hovering a time span', ->
      hookMouseoverData()

      it 'displays a tooltip with month-level precision', ->
        expect($('.timeline-tooltip .inner').text())
          .toEqual('2013 to 2013')
