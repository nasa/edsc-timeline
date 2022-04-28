import { getByTestId } from '../support/getByTestId'

const startCenter = 'Center: Fri, 01 Jan 2021 00:00:00 GMT'
const zoom1Center = 'Center: Tue, 23 Mar 2021 15:41:51 GMT'
const zoom2Center = 'Center: Wed, 17 Mar 2021 03:34:04 GMT'
const zoom3Center = 'Center: Fri, 01 Jan 2021 00:00:00 GMT'
const zoom4Center = 'Center: Tue, 25 Dec 2018 10:07:13 GMT'
const zoom5Center = 'Center: Mon, 04 Jan 2010 06:25:55 GMT'

const scrollWheel = (direction) => {
  getByTestId('timelineList')
    .trigger('wheel', { deltaY: direction, clientX: 950 })

  // Wait for an event to finish before starting the a new event
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500)
}

describe('Timeline zooming', () => {
  beforeEach(() => {
    cy.visit('/empty')
  })

  describe('when zooming with TimelineTools buttons', () => {
    it('keeps the center when zooming through all zoom levels', () => {
      getByTestId('center').should('have.text', startCenter)

      getByTestId('zoomDown').click() // Zoom down to level 2

      getByTestId('center').should('have.text', startCenter)

      getByTestId('zoomDown').click() // Zoom down to level 1

      getByTestId('center').should('have.text', startCenter)

      getByTestId('zoomUp').click() // Zoom up to level 2

      getByTestId('center').should('have.text', startCenter)

      getByTestId('zoomUp').click() // Zoom up to level 3

      getByTestId('center').should('have.text', startCenter)

      getByTestId('zoomUp').click() // Zoom up to level 4

      getByTestId('center').should('have.text', startCenter)

      getByTestId('zoomUp').click() // Zoom up to level 5

      getByTestId('center').should('have.text', startCenter)

      getByTestId('zoomDown').click() // Zoom down to level 4

      getByTestId('center').should('have.text', startCenter)

      getByTestId('zoomDown').click() // Zoom down to level 3

      getByTestId('center').should('have.text', startCenter)
    })
  })

  describe('when zooming with the mouse wheel', () => {
    it('does not scroll past min zoomLevel', () => {
      getByTestId('zoom').should('have.text', 'Zoom: Month (3)')

      // Scroll down to zoom 2
      scrollWheel(1)
      getByTestId('zoom').should('have.text', 'Zoom: Day (2)')

      // Scroll down to zoom 1
      scrollWheel(1)
      getByTestId('zoom').should('have.text', 'Zoom: Hour (1)')

      // Scroll down again
      scrollWheel(1)
      getByTestId('zoom').should('have.text', 'Zoom: Hour (1)')
    })

    it('does not scroll past max zoomLevel', () => {
      getByTestId('zoom').should('have.text', 'Zoom: Month (3)')

      // Scroll up to zoom 4
      scrollWheel(-1)
      getByTestId('zoom').should('have.text', 'Zoom: Year (4)')

      // Scroll up to zoom 5
      scrollWheel(-1)
      getByTestId('zoom').should('have.text', 'Zoom: Year (5)')

      // Scroll up again
      scrollWheel(-1)
      getByTestId('zoom').should('have.text', 'Zoom: Year (5)')
    })

    it('keeps the mouse position centered in the timeline', () => {
      getByTestId('center').should('have.text', startCenter)

      // Scroll down to zoom 2
      scrollWheel(1)
      getByTestId('center').should('have.text', zoom2Center)

      // Scroll down to zoom 1
      scrollWheel(1)
      getByTestId('center').should('have.text', zoom1Center)

      // Scroll up to zoom 2
      scrollWheel(-1)
      getByTestId('center').should('have.text', zoom2Center)

      // Scroll up to zoom 3
      scrollWheel(-1)
      getByTestId('center').should('have.text', zoom3Center)

      // Scroll up to zoom 4
      scrollWheel(-1)
      getByTestId('center').should('have.text', zoom4Center)

      // Scroll up to zoom 5
      scrollWheel(-1)
      getByTestId('center').should('have.text', zoom5Center)
    })
  })
})
