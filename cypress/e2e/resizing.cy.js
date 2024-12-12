/* eslint-disable cypress/no-unnecessary-waiting */
import { getByTestId } from '../support/getByTestId'

describe('Window resizing', () => {
  it('resizing the window updates the timeline', () => {
    cy.visit('/temporalRange')
    cy.wait(200)

    // Mouse over the temporal range
    getByTestId('timelineList').rightclick()

    getByTestId('center').should('have.text', 'Center:Fri, 01 Jan 2021 00:00:00 GMT')
    getByTestId('tooltip').should('have.text', '15 Dec 2020 05:30:49 to 16 Jan 2021 03:01:38')
    getByTestId('tooltip').should('have.css', 'left', '696.856px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')

    // Change the window from 1400x1100 to 1000x1100
    cy.viewport(1000, 1100)

    // Mouse over the temporal range
    getByTestId('timelineList').rightclick()

    getByTestId('center').should('have.text', 'Center:Fri, 01 Jan 2021 00:00:00 GMT')
    getByTestId('tooltip').should('have.text', '15 Dec 2020 05:30:49 to 16 Jan 2021 03:01:38')
    getByTestId('tooltip').should('have.css', 'left', '497.754px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')

    // Drag the timeline a little
    getByTestId('timeline')
      .trigger('pointerdown', 500, 25, { pointerId: 1 })
      .trigger('pointermove', 450, 25, { pointerId: 1 })
      .trigger('pointerup', { pointerId: 1 })

    getByTestId('center').should('have.text', 'Center:Mon, 18 Jan 2021 04:50:52 GMT')
    getByTestId('tooltip').should('have.text', '15 Dec 2020 05:30:49 to 16 Jan 2021 03:01:38')
    getByTestId('tooltip').should('have.css', 'left', '450.754px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')

    // Reset the window size
    cy.viewport(1400, 1100)

    // Mouse over the temporal range
    getByTestId('timelineList').rightclick()

    getByTestId('center').should('have.text', 'Center:Mon, 18 Jan 2021 04:50:52 GMT')
    getByTestId('tooltip').should('have.text', '15 Dec 2020 05:30:49 to 16 Jan 2021 03:01:38')
    getByTestId('tooltip').should('have.css', 'left', '631.056px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')
  })
})
