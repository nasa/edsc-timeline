import { getByTestId } from '../support/getByTestId'

describe('Temporal dragging', () => {
  describe('creating temporal range', () => {
    beforeEach(() => {
      cy.visit('/empty')
    })

    describe('when hovering outside the temporal range area', () => {
      it('does not display the indicator', () => {
        getByTestId('timeline')
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 750,
            clientY: 250
          })

        getByTestId('temporalRangeMouseoverMarker').should('not.exist')
      })
    })

    describe('when hovering inside the temporal range area', () => {
      it('display the indicator', () => {
        getByTestId('timeline')
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 750,
            clientY: 100
          })

        getByTestId('temporalRangeMouseoverMarker').should('exist')
      })
    })

    describe('when hovering inside and then outside the temporal range area', () => {
      it('remove the indicator', () => {
        getByTestId('timeline')
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 750,
            clientY: 100
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 750,
            clientY: 500
          })

        getByTestId('temporalRangeMouseoverMarker').should('not.exist')
      })
    })

    describe('when dragging backwards', () => {
      it('the temporal range is updated', () => {
        getByTestId('timelineList')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 650,
            clientY: 10
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 750,
            clientY: 10
          })
          .trigger('pointerup', { pointerId: 1 })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 755,
            clientY: 10
          })

        getByTestId('temporalStart').should('have.text', 'Temporal Start: 2020-12-15T04:24:38.919Z')
        getByTestId('temporalEnd').should('have.text', 'Temporal End: 2021-01-16T04:01:17.838Z')
      })

      it('when mousing out of a temporal marker does not hover the marker ', () => {
        // Set the temporal range
        getByTestId('timelineList')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 650,
            clientY: 100
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 750,
            clientY: 100
          })
          .trigger('pointerup', { pointerId: 1 })

        // Hover over and out of the start marker
        getByTestId('startMarker')
          .realHover()
          .realMouseMove(100, 100)

        // Test that the tooltip is no longer visible, meaning the marker is not hovered
        getByTestId('tooltip').should('have.css', 'opacity', '0')
      })
    })

    describe('when dragging forwards', () => {
      it('the temporal range is updated', () => {
        getByTestId('timelineList')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 650,
            clientY: 10
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 550,
            clientY: 10
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('temporalStart').should('have.text', 'Temporal Start: 2020-11-13T04:48:00.000Z')
        getByTestId('temporalEnd').should('have.text', 'Temporal End: 2020-12-15T04:24:38.919Z')
      })
    })
  })

  describe('removing temporal range', () => {
    beforeEach(() => {
      cy.visit('/temporalRange')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(0)
    })

    it('clicking on the top of the timeline removes the temporal range', () => {
      getByTestId('timelineList')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 650,
          clientY: 10
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('temporalStart').should('have.text', 'Temporal Start: null')
      getByTestId('temporalEnd').should('have.text', 'Temporal End: null')
    })

    it('clicking on the middle of the timeline does not removes the temporal range', () => {
      getByTestId('timelineList')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 650
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('temporalStart').should('have.text', 'Temporal Start: 2020-12-15T05:30:49.884Z')
      getByTestId('temporalEnd').should('have.text', 'Temporal End: 2021-01-16T03:01:38.533Z')
    })
  })

  describe('editing temporal range', () => {
    beforeEach(() => {
      cy.visit('/temporalRange')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(200)
    })

    it('dragging the start marker changes the temporal range', () => {
      // Grab the start marker, move it to the left
      getByTestId('startMarker')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 650,
          clientY: 10
        })
        .trigger('pointermove', {
          pointerId: 1,
          clientX: 550,
          clientY: 10
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('temporalStart').should('have.text', 'Temporal Start: 2020-11-13T04:48:00.000Z')
      getByTestId('temporalEnd').should('have.text', 'Temporal End: 2021-01-16T03:01:38.533Z')
    })

    it('dragging the start marker past the end marker changes the temporal range', () => {
      // Grab the start marker, move it to the right past the end marker
      getByTestId('startMarker')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 650,
          clientY: 10
        })
        .trigger('pointermove', {
          pointerId: 1,
          clientX: 850,
          clientY: 10
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('temporalStart').should('have.text', 'Temporal Start: 2021-01-16T03:01:38.533Z')
      getByTestId('temporalEnd').should('have.text', 'Temporal End: 2021-02-18T03:22:22.703Z')
    })

    it('dragging the end marker changes the temporal range', () => {
      // Grab the end marker, move it to the right
      getByTestId('endMarker')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 750,
          clientY: 10
        })
        .trigger('pointermove', {
          pointerId: 1,
          clientX: 850,
          clientY: 10
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('temporalStart').should('have.text', 'Temporal Start: 2020-12-15T05:30:49.884Z')
      getByTestId('temporalEnd').should('have.text', 'Temporal End: 2021-02-18T03:22:22.703Z')
    })

    it('dragging the end marker past the start marker changes the temporal range', () => {
      // Grab the end marker, move it to the left past the start marker
      getByTestId('endMarker')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 750,
          clientY: 10
        })
        .trigger('pointermove', {
          pointerId: 1,
          clientX: 550,
          clientY: 10
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('temporalStart').should('have.text', 'Temporal Start: 2020-11-13T04:48:00.000Z')
      getByTestId('temporalEnd').should('have.text', 'Temporal End: 2020-12-15T05:30:49.884Z')
    })
  })

  describe('editing temporal range with only one marker', () => {
    it('dragging the start marker changes the temporal range', () => {
      cy.visit('/temporalStart')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(200)

      // Grab the start marker, move it to the left
      getByTestId('startMarker')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 650,
          clientY: 10
        })
        .trigger('pointermove', {
          pointerId: 1,
          clientX: 550,
          clientY: 10
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('temporalStart').should('have.text', 'Temporal Start: 2020-11-13T04:48:00.000Z')
    })

    it('dragging the end marker changes the temporal range', () => {
      cy.visit('/temporalEnd')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(200)

      // Grab the end marker, move it to the right
      getByTestId('endMarker')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 750,
          clientY: 10
        })
        .trigger('pointermove', {
          pointerId: 1,
          clientX: 850,
          clientY: 10
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('temporalEnd').should('have.text', 'Temporal End: 2021-02-18T03:22:22.703Z')
    })
  })
})
