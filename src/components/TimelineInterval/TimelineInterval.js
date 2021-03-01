import React from 'react'
import PropTypes from 'prop-types'

import { determineIntervalLabel } from '../../utils/determineIntervalLabel'
import { determineScaledWidth } from '../../utils/determineScaledWidth'

import './TimelineInterval.scss'

/**
 * Renders a timeline interval
 * @param {Object} param0
 * @param {Integer} param0.endTime End timestamp of the interval
 * @param {Integer} param0.startTime Start timestamp of the interval
 * @param {Integer} param0.timelineWrapperRef Ref to the DOM element representing the timeline wrapper
 * @param {Function} param0.zIndex CSS zIndex of this interval
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 */
export const TimelineInterval = ({
  endTime,
  startTime,
  timelineWrapperRef,
  zIndex,
  zoomLevel
}) => {
  const timelineWrapperWidth = timelineWrapperRef.current
    .getBoundingClientRect().width

  const [text, ...subText] = determineIntervalLabel(startTime, zoomLevel)

  const duration = endTime - startTime

  const width = determineScaledWidth(
    duration,
    zoomLevel,
    timelineWrapperWidth
  )

  return (
    <div
      key={startTime}
      className="timeline__interval"
      style={{
        width,
        zIndex
      }}
    >
      <div className="timeline__interval-top">
        {
          text && (
            <span className="timeline__interval-label">{text}</span>
          )
        }
      </div>
      <div className="timeline__interval-bottom">
        {
          subText && (
            <span className="timeline__interval-section-label">{subText}</span>
          )
        }
      </div>
    </div>
  )
}

TimelineInterval.propTypes = {
  endTime: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  timelineWrapperRef: PropTypes.shape({
    current: PropTypes.shape({
      getBoundingClientRect: PropTypes.func
    })
  }).isRequired,
  zIndex: PropTypes.number.isRequired,
  zoomLevel: PropTypes.number.isRequired
}
