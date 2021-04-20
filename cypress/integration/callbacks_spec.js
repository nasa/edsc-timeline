import { getByTestId } from '../support/getByTestId'

Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'log')
})

describe('Callbacks', () => {
  beforeEach(() => {
    cy.visit('/callbacks')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100)
  })

  it('calls onArrowKeyPan', () => {
    // Focus a date
    getByTestId('timelineInterval-31').trigger('click')

    // Click the focus next button
    getByTestId('timelineList')
      .trigger('keydown', { key: 'ArrowLeft' })

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleFocusedClick called')
      expect(win.console.log.getCall(1).args[0]).to.equal('handleArrowKeyPan called')
    })
  })

  it('calls onButtonPan', () => {
    // Focus a date
    getByTestId('timelineInterval-31').trigger('click')

    // Click the focus next button
    getByTestId('focusNext').trigger('click')

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleFocusedClick called')
      expect(win.console.log.getCall(1).args[0]).to.equal('handleButtonPan called')
    })
  })

  it('calls onButtonZoom', () => {
    // Focus a date
    getByTestId('timelineInterval-31').trigger('click')

    // Click the focus next button
    getByTestId('focusNext').trigger('click')

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleFocusedClick called')
      expect(win.console.log.getCall(1).args[0]).to.equal('handleButtonPan called')
    })
  })

  it('calls onCreatedTemporal', () => {
    // Create a temporal range
    getByTestId('timelineList')
      .trigger('pointerdown', { pointerId: 1, clientX: 650, clientY: 10 })
      .trigger('pointermove', { pointerId: 1, clientX: 750, clientY: 10 })
      .trigger('pointerup', { pointerId: 1, force: true })

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleCreatedTemporal called')
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
    })
  })

  it('calls onFocusedClick', () => {
    // Focus a date
    getByTestId('timelineInterval-31').trigger('click')

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleFocusedClick called')
    })
  })

  it('calls onScrollPan', () => {
    // Scroll the timeline
    getByTestId('timelineList')
      .trigger('wheel', { deltaX: 47 })

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleScrollPan called')
    })
  })

  it('calls onScrollZoom', () => {
    // Scroll the timeline
    getByTestId('timelineList')
      .trigger('wheel', { deltaY: 1 })

    cy.window().then((win) => {
      expect(win.console.log.getCall(0).args[0]).to.equal('handleScrollZoom called')
    })
  })
})
