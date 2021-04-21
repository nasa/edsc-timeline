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
// eslint-disable-next-line react/display-name
export const TimelineTools = forwardRef(({
  focusedInterval,
  maxZoom,
  minZoom,
  temporalRange,
  zoomLevel,
  onChangeFocusedInterval,
  onChangeZoomLevel
}, timelineToolsRef) => {
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
    'edsc-timeline-tools__label',
    'edsc-timeline-tools__label--focused-interval',
    `edsc-timeline-tools__label--focused-interval-${zoomLevel}`
  ])

  return (
    <section className="edsc-timeline-tools" ref={timelineToolsRef}>
      <section className="edsc-timeline-tools__section">
        <button
          className="edsc-timeline-tools__action"
          type="button"
          disabled={zoomLevel === maxZoom}
          onClick={() => onChangeZoomLevel(zoomLevel + 1)}
          title="Increase zoom level"
          label="Increase zoom level"
          data-test-id="zoomUp"
        >
          <FaChevronUp />
        </button>
        <span className="edsc-timeline-tools__label edsc-timeline-tools__label--resolution">
          {startCase(RESOLUTIONS[zoomLevel])}
        </span>
        <button
          className="edsc-timeline-tools__action"
          type="button"
          disabled={zoomLevel === minZoom}
          onClick={() => onChangeZoomLevel(zoomLevel - 1)}
          title="Decrease zoom level"
          label="Decrease zoom level"
          data-test-id="zoomDown"
        >
          <FaChevronDown />
        </button>
      </section>

      {
        focusedStart != null && (
          <section className="edsc-timeline-tools__section edsc-timeline-tools__section--horizontal">
            <button
              className="edsc-timeline-tools__action"
              type="button"
              disabled={temporalStart >= focusedStart}
              onClick={() => onChangeFocusedInterval('previous')}
              title="Focus previous interval"
              label="Focus previous interval"
              data-test-id="focusPrevious"
            >
              <FaChevronLeft />
            </button>
            <span className={focusedIntervalLabelClassnames}>
              {focusedIntervalLabel}
            </span>
            <button
              className="edsc-timeline-tools__action"
              type="button"
              disabled={temporalEnd <= focusedEnd}
              onClick={() => onChangeFocusedInterval('next')}
              title="Focus next interval"
              label="Focus next interval"
              data-test-id="focusNext"
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
