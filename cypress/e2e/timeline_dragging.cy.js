import { getByTestId } from '../support/getByTestId'

const startCenter = 'Center: Fri, 01 Jan 2021 00:00:00 GMT'
const backwardCenter = 'Center: Wed, 16 Dec 2020 12:03:53 GMT'
const forwardCenter = 'Center: Sat, 16 Jan 2021 11:56:06 GMT'
const timelineRangeStart = 'Timeline Start: 2018-07-01T00:00:00.000Z'
const timelineRangeEnd = 'Timeline End: 2023-07-01T00:00:00.000Z'

describe('Timeline dragging', () => {
  beforeEach(() => {
    cy.visit('/empty')
  })

  describe('when dragging backwards', () => {
    it('the timeline center is updated', () => {
      getByTestId('center').should('have.text', startCenter)

      getByTestId('timelineList')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 500
        })
        .trigger('pointermove', {
          pointerId: 1,
          clientX: 550
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('center').should('have.text', backwardCenter)
      getByTestId('timelineStart').should('have.text', timelineRangeStart)
      getByTestId('timelineEnd').should('have.text', timelineRangeEnd)
    })

    describe('when dragging enough to load new intervals', () => {
      it('new intervals are added', () => {
        getByTestId('timelineInterval').should('have.length', 61)

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 1900,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timelineInterval').should('have.length', 91)
        getByTestId('timelineInterval').eq(0).should('have.text', '2016Jan')
        getByTestId('timelineStart').should('have.text', 'Timeline Start: 2016-01-01T00:00:00.000Z')
      })
    })

    describe('when the number of intervals reaches the MAX_INTERVAL_BUFFER', () => {
      it('trims the intervals', () => {
        getByTestId('timelineInterval').should('have.length', 61)

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 1900,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 2800,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 2800,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: 2800,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timelineInterval').should('have.length', 151)
      })
    })
  })

  describe('when dragging forwards', () => {
    it('the timeline center is updated', () => {
      getByTestId('center').should('have.text', startCenter)

      getByTestId('timelineList')
        .trigger('pointerdown', {
          pointerId: 1,
          clientX: 500
        })
        .trigger('pointermove', {
          pointerId: 1,
          clientX: 450
        })
        .trigger('pointerup', { pointerId: 1 })

      getByTestId('center').should('have.text', forwardCenter)
      getByTestId('timelineStart').should('have.text', timelineRangeStart)
      getByTestId('timelineEnd').should('have.text', timelineRangeEnd)
    })

    describe('when dragging enough to load new intervals', () => {
      it('new intervals are added', () => {
        getByTestId('timelineInterval').should('have.length', 61)

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: -2000,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timelineInterval').should('have.length', 91)
        getByTestId('timelineInterval').eq(-1).should('have.text', '2026Jan')
        getByTestId('timelineEnd').should('have.text', 'Timeline End: 2026-01-01T00:00:00.000Z')
      })
    })

    describe('when the number of intervals reaches the MAX_INTERVAL_BUFFER', () => {
      it('trims the intervals', () => {
        getByTestId('timelineInterval').should('have.length', 61)

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: -1900,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: -2800,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: -2800,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timeline')
          .trigger('pointerdown', {
            pointerId: 1,
            clientX: 0,
            clientY: 200
          })
          .trigger('pointermove', {
            pointerId: 1,
            clientX: -2800,
            clientY: 200
          })
          .trigger('pointerup', { pointerId: 1 })

        getByTestId('timelineInterval').should('have.length', 151)
      })
    })
  })

  describe('when scrolling backwards', () => {
    it('the timeline center is updated', () => {
      getByTestId('center').should('have.text', startCenter)

      getByTestId('timelineList')
        .trigger('wheel', { deltaX: -47 })

      getByTestId('center').should('have.text', backwardCenter)
      getByTestId('timelineStart').should('have.text', timelineRangeStart)
      getByTestId('timelineEnd').should('have.text', timelineRangeEnd)
    })
  })

  describe('when scrolling forwards', () => {
    it('the timeline center is updated', () => {
      getByTestId('center').should('have.text', startCenter)

      getByTestId('timelineList')
        .trigger('wheel', { deltaX: 47 })

      getByTestId('center').should('have.text', forwardCenter)
      getByTestId('timelineStart').should('have.text', timelineRangeStart)
      getByTestId('timelineEnd').should('have.text', timelineRangeEnd)
    })
  })
})
