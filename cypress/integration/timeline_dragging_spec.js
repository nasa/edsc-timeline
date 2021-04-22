import { getByTestId } from '../support/getByTestId'

const startCenter = 'Center: Fri, 01 Jan 2021 00:00:00 GMT'
const backwardCenter = 'Center: Wed, 16 Dec 2020 13:04:51 GMT'
const forwardCenter = 'Center: Sat, 16 Jan 2021 10:55:08 GMT'
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
        .trigger('pointerdown', { pointerId: 1, clientX: 500 })
        .trigger('pointermove', { pointerId: 1, clientX: 550 })
        .trigger('pointerup', { pointerId: 1, force: true })

      getByTestId('center').should('have.text', backwardCenter)
      getByTestId('timelineStart').should('have.text', timelineRangeStart)
      getByTestId('timelineEnd').should('have.text', timelineRangeEnd)
    })
  })

  describe('when dragging forwards', () => {
    it('the timeline center is updated', () => {
      getByTestId('center').should('have.text', startCenter)

      getByTestId('timelineList')
        .trigger('pointerdown', { pointerId: 1, clientX: 500 })
        .trigger('pointermove', { pointerId: 1, clientX: 450 })
        .trigger('pointerup', { pointerId: 1, force: true })

      getByTestId('center').should('have.text', forwardCenter)
      getByTestId('timelineStart').should('have.text', timelineRangeStart)
      getByTestId('timelineEnd').should('have.text', timelineRangeEnd)
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
