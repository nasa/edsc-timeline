import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { TimelineInterval } from '../TimelineInterval/TimelineInterval'

import { generateEndTime } from '../../utils/generateEndTime'
import { getPositionByTimestamp } from '../../utils/getPositionByTimestamp'

import './TimelineList.scss'

/**
 * Renders a list of TimelineIntervals
 * @param {Object} param0
 * @param {Boolean} param0.dragging Flag for if the timeline is currently in a dragging state
 * @param {Boolean} param0.draggingTemporalStart Flag for if the temporal start marker is currently in a dragging state
 * @param {Boolean} param0.draggingTemporalEnd Flag for if the temporal end marker is currently in a dragging state
 * @param {Object} param0.focusedInterval Focused interval set on the timeline
 * @param {Integer} param0.intervalListWidthInPixels Width (in pixels) of the DOM element that holds the timeline intervals
 * @param {Object} param0.temporalRange Temporal range set on the timeline
 * @param {Array} param0.timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Number} param0.temporalRangeMouseOverPosition Position of the temporal selection mouse over indicator
 * @param {Object} param0.timelineListRef Ref to the DOM element representing the timeline list
 * @param {Object} param0.timelinePosition Position of the left side of the timeline DOM element in pixels
 * @param {Object} param0.timelineWrapperRef Ref to the DOM element representing the timeline wrapper
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 * @param {Function} param0.onTemporalMarkerMouseDown Callback function for onMouseDown
 * @param {Function} param0.onFocusedClick Callback function for onClick
 * @param {Function} param0.onTimelineMouseDown Callback function for onMouseDown
 * @param {Function} param0.onTimelineMouseMove Callback function for onMouseMove
 */
export const TimelineList = ({
  dragging,
  draggingTemporalStart,
  draggingTemporalEnd,
  focusedInterval,
  intervalListWidthInPixels,
  temporalRange,
  temporalRangeMouseOverPosition,
  timeIntervals,
  timelineListRef,
  timelinePosition,
  timelineWrapperRef,
  zoomLevel,
  onFocusedClick,
  onTemporalMarkerMouseDown,
  onTimelineMouseDown,
  onTimelineMouseMove
}) => {
  // console.log('🚀 ~ file: TimelineList.js ~ line 50 ~ timelinePosition', timelinePosition)
  if (!timelineWrapperRef.current) return null

  const temporalStartStyle = {}
  const temporalEndStyle = {}
  const temporalRangeMouseOverStyle = {}

  // If a position is set for the temporal selection mouseover indicator, set the left property to that value
  if (temporalRangeMouseOverPosition) {
    temporalRangeMouseOverStyle.left = temporalRangeMouseOverPosition
  }

  const { end, start } = temporalRange

  // If a time is set for the start and end, set the left property to that temporal position
  const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
  if (start) {
    temporalStartStyle.left = (
      getPositionByTimestamp({
        timestamp: start,
        timeIntervals,
        zoomLevel,
        wrapperWidth: timelineWrapperWidth
      })
    )
  }
  if (end) {
    temporalEndStyle.left = (
      getPositionByTimestamp({
        timestamp: end,
        timeIntervals,
        zoomLevel,
        wrapperWidth: timelineWrapperWidth
      })
    )
  }

  const timelineListClassnames = classNames([
    'timeline-list',
    {
      'timeline-list--is-dragging': dragging,
      'timeline-list--is-temporal-dragging': draggingTemporalStart || draggingTemporalEnd
    }
  ])

  const temporalStartMarkerStartClassnames = classNames([
    'timeline-list__temporal-marker',
    'timeline-list__temporal-start',
    {
      'timeline-list__temporal-marker--is-dragging': draggingTemporalStart
    }
  ])

  const temporalStartMarkerEndClassnames = classNames([
    'timeline-list__temporal-marker',
    'timeline-list__temporal-end',
    {
      'timeline-list__temporal-marker--is-dragging': draggingTemporalEnd
    }
  ])

  const { start: focusedStart } = focusedInterval

  return (
    <div
      ref={timelineListRef}
      className={timelineListClassnames}
      style={{
        width: `${intervalListWidthInPixels}px`,
        transform: `translateX(${timelinePosition.left}px)`
      }}
      onMouseDown={onTimelineMouseDown}
      onMouseMove={onTimelineMouseMove}
      role="button"
      tabIndex="0"
    >
      <section
        className="timeline-list__markers"
        style={{
          zIndex: timeIntervals.length + 1
        }}
      >
        {
          temporalRangeMouseOverPosition && (
            <div
              className="timeline-list__temporal-mouseover-marker"
              style={temporalRangeMouseOverStyle}
            />
          )
        }
        {
          start && (
            <button
              className={temporalStartMarkerStartClassnames}
              style={temporalStartStyle}
              onMouseDown={(e) => onTemporalMarkerMouseDown(e, 'start')}
              label="Click and drag to edit the start of the selected temporal range"
              aria-label="Click and drag to edit the start of the selected temporal range"
              type="button"
            />
          )
        }
        {
          end && (
            <button
              className={temporalStartMarkerEndClassnames}
              style={temporalEndStyle}
              onMouseDown={(e) => onTemporalMarkerMouseDown(e, 'end')}
              label="Click and drag to edit the end of the selected temporal range"
              aria-label="Click and drag to edit the end of the selected temporal range"
              type="button"
            />
          )
        }
      </section>
      <span className="timeline-list__line" />
      {
        timeIntervals && timeIntervals.map((startTime, intervalIndex) => {
          let endTime
          const focused = startTime === focusedStart

          if (timeIntervals[intervalIndex + 1] != null) {
            // If the next interval is not null, use it as the endTime
            endTime = timeIntervals[intervalIndex + 1]
          } else {
            // Generate a new interval to use as the endTime
            endTime = generateEndTime(timeIntervals, zoomLevel)
          }

          // Each interval needs to be one zIndex lower than the interval to it's left.
          // This keeps labels on top of interval borders
          const zIndex = timeIntervals.length - intervalIndex

          return (
            <TimelineInterval
              key={startTime}
              focused={focused}
              startTime={startTime}
              endTime={endTime}
              timelineWrapperRef={timelineWrapperRef}
              zIndex={zIndex}
              zoomLevel={zoomLevel}
              onFocusedClick={onFocusedClick}
            />
          )
        })
      }
    </div>
  )
}

TimelineList.defaultProps = {
  temporalRangeMouseOverPosition: null,
  intervalListWidthInPixels: 0
}

TimelineList.propTypes = {
  dragging: PropTypes.bool.isRequired,
  draggingTemporalStart: PropTypes.bool.isRequired,
  draggingTemporalEnd: PropTypes.bool.isRequired,
  focusedInterval: PropTypes.shape({
    start: PropTypes.number
  }).isRequired,
  intervalListWidthInPixels: PropTypes.number,
  onFocusedClick: PropTypes.func.isRequired,
  onTemporalMarkerMouseDown: PropTypes.func.isRequired,
  onTimelineMouseDown: PropTypes.func.isRequired,
  onTimelineMouseMove: PropTypes.func.isRequired,
  temporalRangeMouseOverPosition: PropTypes.number,
  temporalRange: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }).isRequired,
  timeIntervals: PropTypes.arrayOf(PropTypes.number).isRequired,
  timelineListRef: PropTypes.shape({
    current: PropTypes.shape({})
  }).isRequired,
  timelinePosition: PropTypes.shape({
    left: PropTypes.number
  }).isRequired,
  timelineWrapperRef: PropTypes.shape({
    current: PropTypes.shape({
      getBoundingClientRect: PropTypes.func
    })
  }).isRequired,
  zoomLevel: PropTypes.number.isRequired
}
