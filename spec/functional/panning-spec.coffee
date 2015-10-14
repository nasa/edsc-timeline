describe 'Panning', ->
  beforeEach ->
    @$tl = @buildTimelineWithData()

  describe 'when dragging the timeline', ->
    beforeEach ->
      @dt = @timespans.days(-25)
      expect(@$tl).toHaveTimelineRange(@start, @present)
      @pan(@$tl, @dt)

    it 'updates the timeline range', ->
      expect(@$tl).toHaveTimelineRange(@start + @dt, @present + @dt)

    it 'moves the timeline display', ->
      expect(@$tl).toHaveTimeOffset('.timeline-draggable', @dt)

    it 'moves the selected temporal extents', ->
      expect(@$tl).toHaveTimeOffset('.timeline-selection', @dt)

    it 'keeps row names in their original location', ->
      expect(@$tl).toHaveTimeOffset('.timeline-overlay', 24)

  describe 'when dragging beyond the present', ->
    beforeEach ->
      @dt = @timespans.days(25)
      @pan(@$tl, @dt)

    it 'allows the user to pan into the future', ->
      expect(@$tl).toHaveTimelineRange(@start + @dt, @present + @dt)
