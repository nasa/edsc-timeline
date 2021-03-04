import React from 'react'
import PropTypes from 'prop-types'

import { TimelineInterval } from '../TimelineInterval/TimelineInterval'

import { generateEndTime } from '../../utils/generateEndTime'
import { getPositionByTimestamp } from '../../utils/getPositionByTimestamp'

import './TimelineList.scss'

/**
 * Renders a list of TimelineIntervals
 * @param {Object} param0
 * @param {Integer} param0.intervalListWidthInPixels Width (in pixels) of the DOM element that holds the timeline intervals
 * @param {Object} param0.temporalRange Temporal range set on the timeline
 * @param {Array} param0.timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Number} param0.temporalRangeMouseOverPosition Position of the temporal selection mouse over indicator
 * @param {Object} param0.timelineListRef Ref to the DOM element representing the timeline list
 * @param {Object} param0.timelinePosition Position of the left side of the timeline DOM element in pixels
 * @param {Object} param0.timelineWrapperRef Ref to the DOM element representing the timeline wrapper
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 * @param {Function} param0.onTimelineMouseDown Callback function for onMouseDown
 * @param {Function} param0.onTimelineMouseMove Callback function for onMouseMove
 */
export const TimelineList = ({
  intervalListWidthInPixels,
  temporalRange,
  temporalRangeMouseOverPosition,
  timeIntervals,
  timelineListRef,
  timelinePosition,
  timelineWrapperRef,
  zoomLevel,
  onTemporalMarkerMouseDown,
  onTimelineMouseDown,
  onTimelineMouseMove
}) => {
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
  if (start && end) {
    const timelineWrapperWidth = timelineWrapperRef.current.getBoundingClientRect().width
    temporalStartStyle.left = (
      getPositionByTimestamp({
        timestamp: start,
        timeIntervals,
        zoomLevel,
        wrapperWidth: timelineWrapperWidth
      })
    )

    temporalEndStyle.left = (
      getPositionByTimestamp({
        timestamp: end,
        timeIntervals,
        zoomLevel,
        wrapperWidth: timelineWrapperWidth
      })
    )
  }

  return (
    <div
      ref={timelineListRef}
      className="timeline-list"
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
          start && end && (
            <>
              <button
                className="timeline-list__temporal-marker timeline-list__temporal-start"
                style={temporalStartStyle}
                onMouseDown={(e) => onTemporalMarkerMouseDown(e, 'start')}
                label="start"
                aria-label="start"
                type="button"
              />
              <button
                className="timeline-list__temporal-marker timeline-list__temporal-end"
                style={temporalEndStyle}
                onMouseDown={(e) => onTemporalMarkerMouseDown(e, 'end')}
                label="start"
                aria-label="start"
                type="button"
              />
            </>
          )
        }
      </section>
      {
        timeIntervals && timeIntervals.map((startTime, intervalIndex) => {
          let endTime

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
              startTime={startTime}
              endTime={endTime}
              timelineWrapperRef={timelineWrapperRef}
              zIndex={zIndex}
              zoomLevel={zoomLevel}
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
  intervalListWidthInPixels: PropTypes.number,
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
