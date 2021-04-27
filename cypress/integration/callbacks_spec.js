/* eslint-disable cypress/no-unnecessary-waiting */

import { getByTestId } from '../support/getByTestId'

Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'log')
})

describe('Callbacks', () => {
  beforeEach(() => {
    cy.visit('/callbacks')
    cy.wait(200)
  })

  it('calls onArrowKeyPan', () => {
    // Focus a date
    getByTestId('timelineInterval-31').trigger('click')

    // Click the focus next button
    getByTestId('timelineList')
      .trigger('keydown', { key: 'ArrowLeft' })

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleFocusedIntervalClick called')
      expect(win.console.log.getCall(1).args[0]).to.equal('handleArrowKeyPan called')
      expect(win.console.log.getCall(1).args[1]).to.equal('{"center":1609459200000,"focusedEnd":1612137599999,"focusedStart":1609459200000,"timelineEnd":1688169600000,"timelineStart":1530403200000,"zoom":3}')
    })
  })

  it('calls onButtonPan', () => {
    // Focus a date
    getByTestId('timelineInterval-31').trigger('click')

    // Click the focus next button
    getByTestId('focusNext').trigger('click')

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleFocusedIntervalClick called')
      expect(win.console.log.getCall(1).args[0]).to.equal('handleButtonPan called')
      expect(win.console.log.getCall(1).args[1]).to.equal('{"center":1609459200000,"focusedEnd":1612137599999,"focusedStart":1609459200000,"timelineEnd":1688169600000,"timelineStart":1530403200000,"zoom":3}')
    })
  })

  it('calls onButtonZoom', () => {
    // Click the zoom up button
    getByTestId('zoomUp').trigger('click')

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleButtonZoom called')
      expect(win.console.log.getCall(0).args[1]).to.equal('{"center":1609459200000,"timelineEnd":1688169600000,"timelineStart":1530403200000,"zoom":4}')
    })
  })

  it('calls onTemporalSet', () => {
    // Create a temporal range
    getByTestId('timelineList')
      .trigger('pointerdown', { pointerId: 1, clientX: 650, clientY: 10 })
      .trigger('pointermove', { pointerId: 1, clientX: 750, clientY: 10 })
      .trigger('pointerup', { pointerId: 1, force: true })

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleTemporalSet called')
      expect(win.console.log.getCall(0).args[1]).to.equal('{"center":1609459200000,"temporalEnd":1610766098533,"temporalStart":1608010249884,"timelineEnd":1688169600000,"timelineStart":1530403200000,"zoom":3}')
    })
  })

  it('calls onDragPan', () => {
    // Drag the timeline
    getByTestId('timelineList')
      .trigger('pointerdown', { pointerId: 1, clientX: 500 })
      .trigger('pointermove', { pointerId: 1, clientX: 550 })
      .trigger('pointerup', { pointerId: 1, force: true })

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleDragPan called')
      expect(win.console.log.getCall(0).args[1]).to.equal('{"center":1608123891892,"timelineEnd":1688169600000,"timelineStart":1530403200000,"zoom":3}')
    })
  })

  it('calls onFocusedIntervalClick', () => {
    // Focus a date
    getByTestId('timelineInterval-31').trigger('click')

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleFocusedIntervalClick called')
      expect(win.console.log.getCall(0).args[1]).to.equal('{"center":1609459200000,"focusedEnd":1612137599999,"focusedStart":1609459200000,"timelineEnd":1688169600000,"timelineStart":1530403200000,"zoom":3}')
    })
  })

  it('calls onScrollPan', () => {
    // Scroll the timeline
    getByTestId('timelineList')
      .trigger('wheel', { deltaX: 47 })

    // Wait for the wheel event to end
    cy.wait(300)

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleScrollPan called')
      expect(win.console.log.getCall(0).args[1]).to.equal('{"center":1610794508108,"timelineEnd":1688169600000,"timelineStart":1530403200000,"zoom":3}')
    })
  })

  it('calls onScrollZoom', () => {
    // Scroll the timeline
    getByTestId('timelineList')
      .trigger('wheel', { deltaY: 1 })

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleScrollZoom called')
      expect(win.console.log.getCall(0).args[1]).to.equal('{"center":1609459200000,"timelineEnd":1688169600000,"timelineStart":1530403200000,"zoom":2}')
    })
  })
})
