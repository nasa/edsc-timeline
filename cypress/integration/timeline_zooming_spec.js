import { getByTestId } from '../support/getByTestId'

const startCenter = 'Center: Fri, 01 Jan 2021 00:00:00 GMT'
const zoom1Center = 'Center: Tue, 23 Mar 2021 23:34:04 GMT'
const zoom2Center = 'Center: Wed, 17 Mar 2021 10:48:40 GMT'
const zoom3Center = 'Center: Fri, 01 Jan 2021 00:00:01 GMT'
const zoom4Center = 'Center: Sat, 22 Dec 2018 11:01:45 GMT'
const zoom5Center = 'Center: Sat, 19 Dec 2009 03:29:37 GMT'

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
      getByTestId('interval').should('have.text', 'Interval: Month (3)')

      // Scroll down to zoom 2
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: 1, clientX: 950 })

      getByTestId('interval').should('have.text', 'Interval: Day (2)')

      // Scroll down to zoom 1
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: 1, clientX: 950 })

      getByTestId('interval').should('have.text', 'Interval: Hour (1)')

      // Scroll down again
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: 1, clientX: 950 })

      getByTestId('interval').should('have.text', 'Interval: Hour (1)')
    })

    it('does not scroll past max zoomLevel', () => {
      getByTestId('interval').should('have.text', 'Interval: Month (3)')

      // Scroll up to zoom 4
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: -1, clientX: 950 })

      getByTestId('interval').should('have.text', 'Interval: Year (4)')

      // Scroll up to zoom 5
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: -1, clientX: 950 })

      getByTestId('interval').should('have.text', 'Interval: Year (5)')

      // Scroll up again
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: -1, clientX: 950 })

      getByTestId('interval').should('have.text', 'Interval: Year (5)')
    })

    it('keeps the mouse position centered in the timeline', () => {
      getByTestId('center').should('have.text', startCenter)

      // Scroll down to zoom 2
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: 1, clientX: 950 })

      getByTestId('center').should('have.text', zoom2Center)

      // Scroll down to zoom 1
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: 1, clientX: 950 })

      getByTestId('center').should('have.text', zoom1Center)

      // Scroll up to zoom 2
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: -1, clientX: 950 })

      getByTestId('center').should('have.text', zoom2Center)

      // Scroll up to zoom 3
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: -1, clientX: 950 })

      getByTestId('center').should('have.text', zoom3Center)

      // Scroll up to zoom 4
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: -1, clientX: 950 })

      getByTestId('center').should('have.text', zoom4Center)

      // Scroll up to zoom 5
      getByTestId('timelineList')
        .trigger('wheel', { deltaY: -1, clientX: 950 })

      getByTestId('center').should('have.text', zoom5Center)
    })
  })
})
