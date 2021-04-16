import { getByTestId } from '../support/getByTestId'

// Using .rightclick() as a workaround for hovering
// https://github.com/cypress-io/cypress/issues/10#issuecomment-615947224

describe('Temporal tooltips', () => {
  beforeEach(() => {
    cy.visit('/temporalRange')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(0)
  })

  it('displays a tooltip over the temporal range', () => {
    // Mouse over the temporal range
    getByTestId('timelineList').rightclick()

    getByTestId('tooltip').should('have.text', '15 Dec 2020 13:24:20 to 16 Jan 2021 10:55:09')
    getByTestId('tooltip').should('have.css', 'left', '553.5px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')
  })

  it('displays a tooltip over the temporal start marker', () => {
    // Mouse over the start marker
    getByTestId('startMarker').rightclick()

    getByTestId('tooltip').should('have.text', '15 Dec 2020 13:24:20')
    getByTestId('tooltip').should('have.css', 'left', '505px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')
  })

  it('displays a tooltip over the temporal end marker', () => {
    // Mouse over the end marker
    getByTestId('endMarker').rightclick()

    getByTestId('tooltip').should('have.text', '16 Jan 2021 10:55:09')
    getByTestId('tooltip').should('have.css', 'left', '602px')
    getByTestId('tooltip').should('have.css', 'bottom', '2px')
  })
})
