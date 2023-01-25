/* eslint-disable cypress/no-unnecessary-waiting */

import { getByTestId } from '../support/getByTestId'

Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'log')
})

describe('Data Rows', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(200)
  })

  it('Trims the data when more than 3 rows are provided', () => {
    // Focus a date
    getByTestId('timeline-data-section__entry').should('have.length', 3)
  })
})
