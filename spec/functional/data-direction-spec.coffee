describe 'Data direction', ->

  beforeEach ->
    @$tl = @buildTimelineWithData()

  describe 'when the timeline shows data', ->
    it 'shows no indicator that there is earlier data', ->
      expect('#arrow-left-examplerow').toHaveFill('rgba(0, 0, 0, 0.0)')

    it 'shows no indicator that there is later data', ->
      expect('#arrow-right-examplerow').toHaveFill('rgba(0, 0, 0, 0.0)')

  describe "when the timeline is scrolled to before a row's earliest data", ->
    beforeEach ->
      @pan(@$tl, @timespans.months(-20))

    it 'shows no indicator that there is earlier data', ->
      expect('#arrow-left-examplerow').toHaveFill('rgba(0, 0, 0, 0.0)')

    it 'shows an indicator that there is later data', ->
      expect('#arrow-right-examplerow').toHaveFill('#25c85b')

  describe "when the timeline is scrolled to after a row's latest data", ->
    beforeEach ->
      @pan(@$tl, @timespans.months(20))

    it 'shows an indicator that there is earlier data', ->
      expect('#arrow-left-examplerow').toHaveFill('#25c85b')

    it 'shows no indicator that there is later data', ->
      expect('#arrow-right-examplerow').toHaveFill('rgba(0, 0, 0, 0.0)')
