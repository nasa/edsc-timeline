import React from 'react'
import { startCase } from 'lodash'

import { RESOLUTIONS } from '../../../../src/constants'

export const Output = ({
  displayedCenter,
  interval,
  temporalStart,
  temporalEnd,
  focusedStart,
  focusedEnd
}) => (
  <section className="demo__metadata mb-4">
    <div data-test-id="center">
      <span className="demo__metadata-label">Center:</span>
      {` ${new Date(displayedCenter).toUTCString()}`}
    </div>

    <div data-test-id="interval">
      <span className="demo__metadata-label">Interval:</span>
      {` ${startCase(RESOLUTIONS[interval])} (${interval})`}
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
