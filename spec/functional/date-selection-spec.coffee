describe 'Date selection', ->
  beforeEach ->
    @$tl = @buildTimelineWithData()
    @$tl.timeline('zoomOut')

  describe 'when a temporal constraint is set', ->
    beforeEach ->
      @$tl.timeline('setTemporal', [[Date.UTC(2012, 0, 1), Date.UTC(2014, 0, 1)]])

    describe 'clicking on a date within the temporal constraint', ->
      beforeEach ->
        @clickDate(@$tl, '2012')

      it 'sets the focused time span to the given date', ->
        expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2012, 0, 1), Date.UTC(2013, 0, 1))

      describe 'and arrowing to a date outside of the constraint', ->
        beforeEach -> @keypress(@$tl.find('.timeline-container'), 'left')

        it 'does not update the focused time span', ->
          expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2012, 0, 1), Date.UTC(2013, 0, 1))

        it 'does not pan the timeline', ->
          expect(@$tl).toHaveTimeOffset('.timeline-overlay', 24)

      describe 'clicking on a date outside of the temporal constraint', ->
        beforeEach -> @clickDate(@$tl, '2010')

        it 'does not update the focused time span', ->
          expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2012, 0, 1), Date.UTC(2013, 0, 1))

      describe 'and clicking on a different date inside of the temporal constraint', ->
        beforeEach -> @clickDate(@$tl, '2013')

        it 'updates the focused time span', ->
          expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2013, 0, 1), Date.UTC(2014, 0, 1))

    describe 'clicking on a date outside of the temporal constraint', ->
      beforeEach -> @clickDate(@$tl, '2010')

      it 'does not set the focused time span', ->
          expect(@$tl).toHaveNoFocusedTimeSpan()

  describe 'clicking on a time span in the timeline', ->
    beforeEach -> @clickDate(@$tl, '2012')

    it 'highlights the selected time span', ->
      expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2012, 0, 1), Date.UTC(2013, 0, 1))

    describe 'and pressing the left arrow key', ->
      beforeEach -> @keypress(@$tl.find('.timeline-container'), 'left')

      it 'selects the previous time span', ->
        expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2011, 0, 1), Date.UTC(2012, 0, 1))

      it 'pans the timeline to center on the previous time span', ->
        expect(@$tl).toHaveCenter(Date.UTC(2012, 7, 30))

    describe 'and pressing the right arrow key', ->
      beforeEach -> @keypress(@$tl.find('.timeline-container'), 'right')

      it 'selects the next time span', ->
        expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2013, 0, 1), Date.UTC(2014, 0, 1))

      it 'pans the timeline to center on the next time span', ->
        expect(@$tl).toHaveCenter(Date.UTC(2014, 7, 30))

    describe 'twice', ->
      beforeEach (done) ->
        # Wait required due to setTimeout used in focus/click handling
        setTimeout((=>
          @clickDate(@$tl, '2012')
          done()), 600)

      it 'removes the time span highlight', ->
        expect(@$tl).toHaveNoFocusedTimeSpan()

    describe 'and zooming the timeline', ->
      beforeEach -> @$tl.timeline('zoomIn')

      it 'removes the time span highlight', ->
        expect(@$tl).toHaveNoFocusedTimeSpan()

      describe 'clicking another time span', ->
        beforeEach -> @clickDate(@$tl, 'Aug')

        it 'selects the time span using an appropriately scaled range', ->
          expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2014, 7, 1), Date.UTC(2014, 8, 1))

        describe 'pressing the left arrow key', ->
          beforeEach -> @keypress(@$tl.find('.timeline-container'), 'left')

          it 'selects the previous time span with the correct scale', ->
            expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2014, 6, 1), Date.UTC(2014, 7, 1))

        describe 'pressing the right arrow key', ->
          beforeEach -> @keypress(@$tl.find('.timeline-container'), 'right')

          it 'selects the next time span with the correct scale', ->
            expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2014, 8, 1), Date.UTC(2014, 9, 1))

    describe 'and panning the timeline', ->
      beforeEach -> @pan(@$tl, @timespans.months(10))

      it 'maintains the selected time span', ->
        expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2012, 0, 1), Date.UTC(2013, 0, 1))

    describe 'and clicking a different time span', ->
      beforeEach -> @clickDate(@$tl, '2013')

      it 'highlights the new time span', ->
        expect(@$tl).toHaveFocusedTimeSpan(Date.UTC(2013, 0, 1), Date.UTC(2014, 0, 1))
