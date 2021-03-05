import React from 'react'
import PropTypes from 'prop-types'

import { TimelineInterval } from '../TimelineInterval/TimelineInterval'
import { generateEndTime } from '../../utils/generateEndTime'

import './TimelineList.scss'

/**
 * Renders a list of TimelineIntervals
 * @param {Object} param0
 * @param {Integer} param0.intervalListWidthInPixels Width (in pixels) of the DOM element that holds the timeline intervals
 * @param {Array} param0.timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Object} param0.timelineListRef Ref to the DOM element representing the timeline list
 * @param {Object} param0.timelinePosition Position of the left side of the timeline DOM element in pixels
 * @param {Object} param0.timelineWrapperRef Ref to the DOM element representing the timeline wrapper
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 * @param {Function} param0.onTimelineMouseDown Callback function for onMouseDown
 */
export const TimelineList = ({
  intervalListWidthInPixels,
  timeIntervals,
  timelineListRef,
  timelinePosition,
  timelineWrapperRef,
  zoomLevel,
  onTimelineMouseDown
}) => {
  if (!timelineWrapperRef.current) return null

  return (
    <div
      ref={timelineListRef}
      className="timeline__list"
      style={{
        width: `${intervalListWidthInPixels}px`,
        transform: `translateX(${timelinePosition.left}px)`
      }}
      onMouseDown={onTimelineMouseDown}
      role="button"
      tabIndex="0"
    >
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
  intervalListWidthInPixels: 0
}

TimelineList.propTypes = {
  intervalListWidthInPixels: PropTypes.number,
  onTimelineMouseDown: PropTypes.func.isRequired,
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
