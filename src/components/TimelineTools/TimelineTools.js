import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import {
  FaChevronUp,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft
} from 'react-icons/fa'
import classNames from 'classnames'

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
export const TimelineTools = ({
  focusedInterval,
  maxZoom,
  minZoom,
  temporalRange,
  zoomLevel,
  onChangeFocusedInterval,
  onChangeZoomLevel
}) => {
  const {
    end: focusedEnd,
    start: focusedStart
  } = focusedInterval
  const {
    end: temporalEnd,
    start: temporalStart
  } = temporalRange

  const focusedIntervalLabel = determineFocusedIntervalLabel(focusedStart, zoomLevel)

  const focusedIntervalLabelClassnames = classNames([
    'timeline-tools__label',
    'timeline-tools__label--focused-interval',
    `timeline-tools__label--focused-interval-${zoomLevel}`
  ])

  return (
    <section className="timeline-tools">
      <section className="timeline-tools__section">
        <button
          className="timeline-tools__action"
          type="button"
          disabled={zoomLevel === maxZoom}
          onClick={() => onChangeZoomLevel(zoomLevel + 1)}
          title="Increase zoom level"
          label="Increase zoom level"
        >
          <FaChevronUp />
        </button>
        <span className="timeline-tools__label timeline-tools__label--resolution">
          {startCase(RESOLUTIONS[zoomLevel])}
        </span>
        <button
          className="timeline-tools__action"
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
          <section className="timeline-tools__section timeline-tools__section--horizontal">
            <button
              className="timeline-tools__action"
              type="button"
              disabled={temporalStart >= focusedStart}
              onClick={() => onChangeFocusedInterval('previous')}
              title="Focus previous interval"
              label="Focus previous interval"
            >
              <FaChevronLeft />
            </button>
            <span className={focusedIntervalLabelClassnames}>
              {focusedIntervalLabel}
            </span>
            <button
              className="timeline-tools__action"
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
}

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
