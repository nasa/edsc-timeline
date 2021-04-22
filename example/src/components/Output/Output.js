import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import { RESOLUTIONS } from '../../../../src/constants'

export const Output = ({
  displayedCenter,
  zoom,
  timelineRange,
  temporalStart,
  temporalEnd,
  focusedStart,
  focusedEnd
}) => {
  const {
    end: timelineEnd,
    start: timelineStart
  } = timelineRange

  return (
    <section className="demo__metadata mb-4">
      <h3>
        Timeline Output Values
      </h3>

      <div data-test-id="center">
        <span className="demo__metadata-label">Center:</span>
        {` ${new Date(displayedCenter).toUTCString()}`}
      </div>

      <div data-test-id="zoom">
        <span className="demo__metadata-label">Zoom:</span>
        {` ${startCase(RESOLUTIONS[zoom])} (${zoom})`}
      </div>

      <div data-test-id="timelineStart">
        <span className="demo__metadata-label">Timeline Start:</span>
        {` ${timelineStart && new Date(timelineStart).toISOString()}`}
      </div>

      <div data-test-id="timelineEnd">
        <span className="demo__metadata-label">Timeline End:</span>
        {` ${timelineEnd && new Date(timelineEnd).toISOString()}`}
      </div>

      <div data-test-id="temporalStart">
        <span className="demo__metadata-label">Temporal Start:</span>
        {` ${temporalStart && new Date(temporalStart).toISOString()}`}
      </div>

      <div data-test-id="temporalEnd">
        <span className="demo__metadata-label">Temporal End:</span>
        {` ${temporalEnd && new Date(temporalEnd).toISOString()}`}
      </div>

      <div data-test-id="focusedStart">
        <span className="demo__metadata-label">Focused Start:</span>
        {` ${focusedStart && new Date(focusedStart).toISOString()}`}
      </div>

      <div data-test-id="focusedEnd">
        <span className="demo__metadata-label">Focused End:</span>
        {` ${focusedEnd && new Date(focusedEnd).toISOString()}`}
      </div>
    </section>
  )
}

Output.defaultProps = {
  displayedCenter: null,
  zoom: null,
  timelineRange: {},
  temporalStart: null,
  temporalEnd: null,
  focusedStart: null,
  focusedEnd: null
}

Output.propTypes = {
  displayedCenter: PropTypes.number,
  zoom: PropTypes.number,
  timelineRange: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }),
  temporalStart: PropTypes.number,
  temporalEnd: PropTypes.number,
  focusedStart: PropTypes.number,
  focusedEnd: PropTypes.number
}
