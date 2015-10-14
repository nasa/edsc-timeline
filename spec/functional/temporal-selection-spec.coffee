describe 'Temporal selection', ->
  beforeEach ->
    @$tl = @buildTimeline()
      .timeline('rows', [@exampleRow, @exampleRow2])
      .timeline('data', 'examplerow', @exampleData)
      .timeline('data', 'examplerow2', @exampleData2)
    @globalStart = Date.UTC(2013, 7, 15)
    @globalEnd = Date.UTC(2013, 7, 30)
    @rowStart = Date.UTC(2013, 6, 15)
    @rowEnd = Date.UTC(2013, 6, 30)
    @targetStart = Date.UTC(2013, 5, 15)
    @targetEnd = Date.UTC(2013, 8, 30)

  describe 'when temporal conditions have been set', ->
    beforeEach ->
      @$tl.timeline('setTemporal', [[@globalStart, @globalEnd]])
      @$tl.timeline('setRowTemporal', 'examplerow', [[@rowStart, @rowEnd]])

    describe 'clicking the timeline header', ->
      beforeEach ->
        @$tl.find('.timeline-display-top').click()

      it 'clears the stored global temporal value', ->
        expect(@$tl).toHaveStoredGlobalTemporal(null, null)

      it 'clears the stored row-specific temporal value', ->
        expect(@$tl).toHaveStoredRowTemporal('examplerow', null, null)

      it 'clears the global temporal constraint display', ->
        expect(@$tl).not.toDisplayTemporal(@globalStart, @globalEnd)

      it 'clears row-specific temporal constraint displays', ->
        expect(@$tl).not.toDisplayTemporal(@rowStart, @rowEnd)

    describe 'removing the global temporal', ->
      beforeEach ->
        @$tl.timeline('setTemporal', [])

      it 'clears the stored global temporal value', ->
        expect(@$tl).toHaveStoredGlobalTemporal(null, null)

      it 'maintains the row-specific temporal value', ->
        expect(@$tl).toHaveStoredRowTemporal('examplerow', @rowStart, @rowEnd)

      it 'clears the global temporal constraint display', ->
        expect(@$tl).not.toDisplayTemporal(@globalStart, @globalEnd)

      it 'continues to display row-specific temporal constraints', ->
        expect(@$tl).toDisplayTemporal(@rowStart, @rowEnd)

    describe 'dragging the start fencepost of the global temporal condition', ->
      beforeEach ->
        @dragTemporal(@$tl, @globalStart, @targetStart)

      it 'updates the stored global temporal value', ->
        expect(@$tl).toHaveStoredGlobalTemporal(@targetStart, @globalEnd)

      it 'maintains the stored row-specific temporal value', ->
        expect(@$tl).toHaveStoredRowTemporal('examplerow', @rowStart, @rowEnd)

      it 'updates the global temporal condition display', ->
        expect(@$tl).toDisplayTemporal(@targetStart, @globalEnd)

      it 'does not update row-specific condition displays', ->
        expect(@$tl).toDisplayTemporal(@rowStart, @rowEnd)

    describe 'dragging the start fencepost of a row-specific temporal condition', ->
      beforeEach ->
        @dragTemporal(@$tl, @rowStart, @targetStart)

      it 'maintains the stored global temporal value', ->
        expect(@$tl).toHaveStoredGlobalTemporal(@globalStart, @globalEnd)

      it 'updates the stored row-specific temporal value', ->
        expect(@$tl).toHaveStoredRowTemporal('examplerow', @targetStart, @rowEnd)

      it 'does not update the global condition display', ->
        expect(@$tl).toDisplayTemporal(@globalStart, @globalEnd)

      it 'updates the row-specific condition display', ->
        expect(@$tl).toDisplayTemporal(@targetStart, @rowEnd)

    describe 'dragging the end fencepost of the global temporal condition', ->
      beforeEach ->
        @dragTemporal(@$tl, @globalEnd, @targetEnd)

      it 'updates the stored global temporal value', ->
        expect(@$tl).toHaveStoredGlobalTemporal(@globalStart, @targetEnd)

      it 'maintains the stored row-specific temporal value', ->
        expect(@$tl).toHaveStoredRowTemporal('examplerow', @rowStart, @rowEnd)

      it 'updates the global temporal condition display', ->
        expect(@$tl).toDisplayTemporal(@globalStart, @targetEnd)

      it 'does not update row-specific condition displays', ->
        expect(@$tl).toDisplayTemporal(@rowStart, @rowEnd)

    describe 'dragging the end fencepost of a row-specific temporal condition', ->
      beforeEach ->
        @dragTemporal(@$tl, @rowEnd, @targetEnd)

      it 'maintains the stored global temporal value', ->
        expect(@$tl).toHaveStoredGlobalTemporal(@globalStart, @globalEnd)

      it 'updates the stored row-specific temporal value', ->
        expect(@$tl).toHaveStoredRowTemporal('examplerow', @rowStart, @targetEnd)

      it 'does not update the global condition display', ->
        expect(@$tl).toDisplayTemporal(@globalStart, @globalEnd)

      it 'updates the row-specific condition display', ->
        expect(@$tl).toDisplayTemporal(@rowStart, @targetEnd)

    describe 'dragging the timeline header outside of the selected range', ->
      beforeEach ->
        @dragTemporal(@$tl, @targetStart, @targetEnd)

      it 'sets a new stored global temporal value', ->
        expect(@$tl).toHaveStoredGlobalTemporal(@targetStart, @targetEnd)

      it 'maintains the stored row-specific temporal value', ->
        expect(@$tl).toHaveStoredRowTemporal('examplerow', @rowStart, @rowEnd)

      it 'creates a new global temporal condition display', ->
        expect(@$tl).toDisplayTemporal(@targetStart, @targetEnd)

      it 'does not update row-specific condition displays', ->
        expect(@$tl).toDisplayTemporal(@rowStart, @rowEnd)

  describe 'when no temporal conditions are set', ->
    describe 'dragging the timeline header', ->
      beforeEach ->
        @dragTemporal(@$tl, @targetStart, @targetEnd)

      it 'sets a new stored global temporal value', ->
        expect(@$tl).toHaveStoredGlobalTemporal(@targetStart, @targetEnd)

      it 'creates a new global temporal condition display', ->
        expect(@$tl).toDisplayTemporal(@targetStart, @targetEnd)
