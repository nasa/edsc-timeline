/* eslint-disable cypress/no-unnecessary-waiting */
import { getByTestId } from '../support/getByTestId'

// Using .rightclick() as a workaround for hovering
// https://github.com/cypress-io/cypress/issues/10#issuecomment-615947224

describe('Temporal tooltips', () => {
  describe('when there is a temporal range', () => {
    beforeEach(() => {
      cy.visit('/temporalRange')
      cy.wait(300)
    })

    it('displays a tooltip over the temporal range', () => {
      // Mouse over the temporal range
      getByTestId('timelineList').rightclick()

      getByTestId('tooltip').should('have.text', '15 Dec 2020 05:30:49 to 16 Jan 2021 03:01:38')
      getByTestId('tooltip').should('have.css', 'left', '696.847px')
      getByTestId('tooltip').should('have.css', 'bottom', '2px')
    })

    it('displays a tooltip over the temporal start marker', () => {
      // Mouse over the start marker
      getByTestId('startMarker').rightclick()

      getByTestId('tooltip').should('have.text', '15 Dec 2020 05:30:49')
      getByTestId('tooltip').should('have.css', 'left', '635.676px')
      getByTestId('tooltip').should('have.css', 'bottom', '2px')
    })

    it('displays a tooltip over the temporal end marker', () => {
      // Mouse over the end marker
      getByTestId('endMarker').rightclick()

      getByTestId('tooltip').should('have.text', '16 Jan 2021 03:01:38')
      getByTestId('tooltip').should('have.css', 'left', '758.018px')
      getByTestId('tooltip').should('have.css', 'bottom', '2px')
    })
  })

  describe('when there is only a temporal start marker', () => {
    beforeEach(() => {
      cy.visit('/temporalStart')
      cy.wait(300)
    })

    it('displays a tooltip over the temporal range', () => {
      // Mouse over the temporal range
      getByTestId('timelineList').rightclick()

      getByTestId('tooltip').should('have.text', '15 Dec 2020 13:24:20 ongoing')
      getByTestId('tooltip').should('have.css', 'left', '1018.47px')
      getByTestId('tooltip').should('have.css', 'bottom', '2px')
    })

    it('displays a tooltip over the temporal start marker', () => {
      // Mouse over the start marker
      getByTestId('startMarker').rightclick()

      getByTestId('tooltip').should('have.text', '15 Dec 2020 13:24:20')
      getByTestId('tooltip').should('have.css', 'left', '636.937px')
      getByTestId('tooltip').should('have.css', 'bottom', '2px')
    })
  })

  describe('when there is only a temporal end marker', () => {
    beforeEach(() => {
      cy.visit('/temporalEnd')
      cy.wait(300)
    })

    it('displays a tooltip over the temporal range', () => {
      // Mouse over the temporal range
      getByTestId('timelineList').rightclick()

      getByTestId('tooltip').should('have.text', 'Up to 16 Jan 2021 10:55:09')
      getByTestId('tooltip').should('have.css', 'left', '379.64px')
      getByTestId('tooltip').should('have.css', 'bottom', '2px')
    })

    it('displays a tooltip over the temporal end marker', () => {
      // Mouse over the end marker
      getByTestId('endMarker').rightclick()

      getByTestId('tooltip').should('have.text', '16 Jan 2021 10:55:09')
      getByTestId('tooltip').should('have.css', 'left', '759.279px')
      getByTestId('tooltip').should('have.css', 'bottom', '2px')
    })
  })
})
