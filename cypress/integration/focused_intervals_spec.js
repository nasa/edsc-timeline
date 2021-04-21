/* eslint-disable cypress/no-unnecessary-waiting */

import { getByTestId } from '../support/getByTestId'

describe('Focused intervals', () => {
  describe('when no temporal range exists', () => {
    beforeEach(() => {
      cy.visit('/empty')
      cy.wait(200)
    })

    it('clicking an interval at the bottom selects it as the focused interval', () => {
      // Click on a timeline interval bottom
      getByTestId('timelineInterval-31').trigger('click')

      getByTestId('focusedStart').should('have.text', 'Focused Start: 2021-01-01T00:00:00.000Z')
      getByTestId('focusedEnd').should('have.text', 'Focused End: 2021-01-31T23:59:59.999Z')
    })

    it('clicking an interval in the middle does not select it as the focused interval', () => {
      // Click in the middle of the timeline list
      getByTestId('timelineList').trigger('click')

      getByTestId('focusedStart').should('have.text', 'Focused Start: null')
      getByTestId('focusedEnd').should('have.text', 'Focused End: null')
    })
  })

  describe('when a temporal range exists', () => {
    beforeEach(() => {
      cy.visit('/temporalRange')
      cy.wait(200)
    })

    it('clicking an interval at the bottom selects it as the focused interval', () => {
      // Click on a timeline interval bottom
      // foce: true - force the click to happen through the temporal range
      getByTestId('timelineInterval-31').trigger('click', { force: true })

      getByTestId('focusedStart').should('have.text', 'Focused Start: 2021-01-01T00:00:00.000Z')
      getByTestId('focusedEnd').should('have.text', 'Focused End: 2021-01-31T23:59:59.999Z')
    })

    it('clicking an interval outside the temporal range does not select it as the focused interval', () => {
      // Click on a timeline interval bottom that is outside the temporal range
      getByTestId('timelineInterval-30').trigger('click')

      getByTestId('focusedStart').should('have.text', 'Focused Start: null')
      getByTestId('focusedEnd').should('have.text', 'Focused End: null')
    })

    it('clicking an interval in the middle does not select it as the focused interval', () => {
      // Click in the middle of the timeline list
      getByTestId('timelineList').trigger('click')

      getByTestId('focusedStart').should('have.text', 'Focused Start: null')
      getByTestId('focusedEnd').should('have.text', 'Focused End: null')
    })
  })
})
