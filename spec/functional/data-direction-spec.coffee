describe 'Data direction', ->

  beforeEach ->
    @$tl = @buildTimelineWithData()

  describe 'when the timeline shows data', ->
    it 'shows no indicator that there is earlier data', ->
      expect('#arrow-left-examplerow').toHaveFill('transparent')

    it 'shows no indicator that there is later data', ->
      expect('#arrow-right-examplerow').toHaveFill('transparent')

  describe "when the timeline is scrolled to before a row's earliest data", ->
    beforeEach ->
      @pan(@$tl, @timespans.months(-20))

    it 'shows no indicator that there is earlier data', ->
      expect('#arrow-left-examplerow').toHaveFill('transparent')

    it 'shows an indicator that there is later data', ->
      expect('#arrow-right-examplerow').toHaveFill('rgb(37, 200, 91)')

  describe "when the timeline is scrolled to after a row's latest data", ->
    beforeEach ->
      @pan(@$tl, @timespans.months(20))

    it 'shows an indicator that there is earlier data', ->
      expect('#arrow-left-examplerow').toHaveFill('rgb(37, 200, 91)')

    it 'shows no indicator that there is later data', ->
      expect('#arrow-right-examplerow').toHaveFill('transparent')
