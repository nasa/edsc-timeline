import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft
} from 'react-icons/fa'

import { RESOLUTIONS } from '../../constants'
import { determineFocusedIntervalLabel } from '../../utils/determineFocusedIntervalLabel'

import './TimelineTools.scss'

/**
 * Renders the zoom buttons for the timeline
 * @param {Object} param0
 * @param {Object} param0.focusedInterval Focused interval set on the timeline
 * @param {Integer} param0.maxZoom Max zoom level to allow
 * @param {Integer} param0.minZoom Min zoom level to allow
 * @param {Object} param0.temporalRange Temporal range set on the timeline
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 * @param {Function} param0.onChangeFocusedInterval Callback function for changing the focusedInterval
 * @param {Function} param0.onChangeZoomLevel Callback function for changing the zoom level
 */
// eslint-disable-next-line react/display-name
export const TimelineTools = forwardRef(({
  focusedInterval,
  maxZoom,
  minZoom,
  temporalRange,
  zoomLevel,
  onChangeFocusedInterval,
  onChangeZoomLevel
}, ref) => {
  const {
    end: focusedEnd,
    start: focusedStart
  } = focusedInterval
  const {
    end: temporalEnd,
    start: temporalStart
  } = temporalRange

  const focusedIntervalLabel = determineFocusedIntervalLabel(focusedStart, zoomLevel)

  return (
    <section className="timeline__tools" ref={ref}>
      <section className="timeline__tool-section">
        <button
          className="timeline__tool-action"
          type="button"
          disabled={zoomLevel === maxZoom}
          onClick={() => onChangeZoomLevel(zoomLevel + 1)}
          title="Increase zoom level"
          label="Increase zoom level"
        >
          <FaChevronUp />
        </button>
        <span className="timeline__tool-label">
          {startCase(RESOLUTIONS[zoomLevel])}
        </span>
        <button
          className="timeline__tool-action"
          type="button"
          disabled={zoomLevel === minZoom}
          onClick={() => onChangeZoomLevel(zoomLevel - 1)}
          title="Decrease zoom level"
          label="Decrease zoom level"
        >
          <FaChevronDown />
        </button>
      </section>

      {
        focusedStart != null && (
          <section className="timeline__tool-section timeline__tool-section--horizontal">
            <button
              className="timeline__tool-action"
              type="button"
              disabled={temporalStart >= focusedStart}
              onClick={() => onChangeFocusedInterval('previous')}
              title="Focus previous interval"
              label="Focus previous interval"
            >
              <FaChevronLeft />
            </button>
            <span className="timeline__tool-label">
              {focusedIntervalLabel}
            </span>
            <button
              className="timeline__tool-action"
              type="button"
              disabled={temporalEnd <= focusedEnd}
              onClick={() => onChangeFocusedInterval('next')}
              title="Focus next interval"
              label="Focus next interval"
            >
              <FaChevronRight />
            </button>
          </section>
        )
      }

    </section>
  )
})

TimelineTools.propTypes = {
  focusedInterval: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }).isRequired,
  maxZoom: PropTypes.number.isRequired,
  minZoom: PropTypes.number.isRequired,
  temporalRange: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }).isRequired,
  zoomLevel: PropTypes.number.isRequired,
  onChangeFocusedInterval: PropTypes.func.isRequired,
  onChangeZoomLevel: PropTypes.func.isRequired
}
