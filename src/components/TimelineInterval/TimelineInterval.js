import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { determineIntervalLabel } from '../../utils/determineIntervalLabel'
import { determineScaledWidth } from '../../utils/determineScaledWidth'

import './TimelineInterval.scss'

/**
 * Renders a timeline interval
 * @param {Object} param0
 * @param {Boolean} param0.focusable Flag for if this interval is able to be focused
 * @param {Boolean} param0.focused Flag for if this interval is focused
 * @param {Integer} param0.endTime End timestamp of the interval
 * @param {Integer} param0.startTime Start timestamp of the interval
 * @param {Integer} param0.timelineWrapperRef Ref to the DOM element representing the timeline wrapper
 * @param {Integer} param0.zIndex CSS zIndex of this interval
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 * @param {Function} param0.onFocusedClick Callback function for onClick
 */
export const TimelineInterval = ({
  focusable,
  focused,
  endTime,
  startTime,
  timelineWrapperRef,
  zIndex,
  zoomLevel,
  onFocusedClick
}) => {
  /**
   * Click handler for the focused interval section
   */
  const handleFocusedClick = () => {
    // If the interval isn't focusable, return
    if (!focusable) return

    // Call the onFocusedClick callback to focus the interval
    onFocusedClick({
      end: endTime,
      start: startTime
    })
  }

  const timelineWrapperWidth = timelineWrapperRef.current
    .getBoundingClientRect().width

  const [text, ...subText] = determineIntervalLabel(startTime, zoomLevel)

  const duration = endTime - startTime

  const width = determineScaledWidth(
    duration,
    zoomLevel,
    timelineWrapperWidth
  )

  const intervalClassnames = classNames([
    'edsc-timeline-interval',
    {
      'edsc-timeline-interval--is-focused': focused,
      'edsc-timeline-interval--is-unfocusable': !focusable
    }
  ])

  return (
    <div
      key={startTime}
      className={intervalClassnames}
      style={{
        width,
        zIndex
      }}
    >
      <div className="edsc-timeline-interval__interval-top">
        {
          subText && (
            <span className="edsc-timeline-interval__interval-section-label">{subText}</span>
          )
        }
      </div>
      <div
        className="edsc-timeline-interval__interval-bottom"
        onClick={handleFocusedClick}
        role="button"
        tabIndex="0"
        onKeyPress={handleFocusedClick}
        data-test-id={`timelineInterval-${zIndex}`}
      >
        {
          text && (
            <span className="edsc-timeline-interval__interval-label">{text}</span>
          )
        }
      </div>
    </div>
  )
}

TimelineInterval.propTypes = {
  focusable: PropTypes.bool.isRequired,
  focused: PropTypes.bool.isRequired,
  endTime: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  timelineWrapperRef: PropTypes.shape({
    current: PropTypes.shape({
      getBoundingClientRect: PropTypes.func
    })
  }).isRequired,
  zIndex: PropTypes.number.isRequired,
  zoomLevel: PropTypes.number.isRequired,
  onFocusedClick: PropTypes.func.isRequired
}
