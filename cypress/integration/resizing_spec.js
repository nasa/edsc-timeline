/* eslint-disable cypress/no-unnecessary-waiting */
import { getByTestId } from '../support/getByTestId'

describe('Window resizing', () => {
  it('resizing the window updates the timeline', () => {
    cy.visit('/temporalRange')
    cy.wait(200)

    // Mouse over the temporal range
    getByTestId('timelineList').rightclick()

    getByTestId('center').should('have.text', 'Center: Fri, 01 Jan 2021 00:00:00 GMT')
    getByTestId('tooltip').should('have.text', '15 Dec 2020 13:24:20 to 16 Jan 2021 10:55:09')
    getByTestId('tooltip').should('have.css', 'left', '553.5px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')

    // Change the window from 1400x900 to 1000x900
    cy.viewport(1000, 900)

    // Mouse over the temporal range
    getByTestId('timelineList').rightclick()

    getByTestId('center').should('have.text', 'Center: Fri, 01 Jan 2021 00:00:00 GMT')
    getByTestId('tooltip').should('have.text', '15 Dec 2020 13:24:20 to 16 Jan 2021 10:55:09')
    getByTestId('tooltip').should('have.css', 'left', '463.743px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')

    // Drag the timeline a little
    getByTestId('timelineList')
      .trigger('pointerdown', { pointerId: 1, clientX: 500 })
      .trigger('pointermove', { pointerId: 1, clientX: 450 })
      .trigger('pointerup', { pointerId: 1, force: true })

    getByTestId('center').should('have.text', 'Center: Tue, 19 Jan 2021 10:42:34 GMT')
    getByTestId('tooltip').should('have.text', '15 Dec 2020 13:24:20 to 16 Jan 2021 10:55:09')
    getByTestId('tooltip').should('have.css', 'left', '416.743px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')

    // Reset the window size
    cy.viewport(1400, 900)

    // Mouse over the temporal range
    getByTestId('timelineList').rightclick()

    getByTestId('center').should('have.text', 'Center: Tue, 19 Jan 2021 10:42:34 GMT')
    getByTestId('tooltip').should('have.text', '15 Dec 2020 13:24:20 to 16 Jan 2021 10:55:09')
    getByTestId('tooltip').should('have.css', 'left', '497.403px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')
  })
})