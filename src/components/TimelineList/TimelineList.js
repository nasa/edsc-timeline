import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { TimelineInterval } from '../TimelineInterval/TimelineInterval'

import { determineScaledWidth } from '../../utils/determineScaledWidth'
import { generateEndTime } from '../../utils/generateEndTime'
import { getPositionByTimestamp } from '../../utils/getPositionByTimestamp'
import { TimelineDataSection } from '../TimelineDataSection/TimelineDataSection'

import './TimelineList.scss'

/**
 * Renders a list of TimelineIntervals
 * @param {Object} param0
 * @param {Array} param0.data An array of objects defining the data to display
 * @param {Boolean} param0.dragging Flag for if the timeline is currently in a dragging state
 * @param {Boolean} param0.draggingTemporalStart Flag for if the temporal start marker is currently in a dragging state
 * @param {Boolean} param0.draggingTemporalEnd Flag for if the temporal end marker is currently in a dragging state
 * @param {Object} param0.focusedInterval Focused interval set on the timeline
 * @param {Integer} param0.intervalListWidthInPixels Width (in pixels) of the DOM element that holds the timeline intervals
 * @param {Object} param0.temporalRange Temporal range set on the timeline
 * @param {Array} param0.timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Number} param0.temporalRangeMouseOverPosition Position of the temporal selection mouse over indicator
 * @param {Object} param0.timelinePosition Position of the left side of the timeline DOM element in pixels
 * @param {Object} param0.timelineWrapperRef Ref to the DOM element representing the timeline wrapper
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 * @param {Function} param0.onTemporalMarkerMouseDown Callback function for onMouseDown
 * @param {Function} param0.onFocusedClick Callback function for onClick
 * @param {Function} param0.onTimelineMouseDown Callback function for onMouseDown
 * @param {Function} param0.onTimelineMouseMove Callback function for onMouseMove
 * @param {Object} timelineListRef Ref to the DOM element representing the timeline list
 */
export const TimelineList = forwardRef(({
  data,
  dragging,
  draggingTemporalStart,
  draggingTemporalEnd,
  focusedInterval,
  intervalListWidthInPixels,
  temporalRange,
  temporalRangeMouseOverPosition,
  timeIntervals,
  timelinePosition,
  timelineWrapperRef,
  zoomLevel,
  onFocusedClick,
  onTemporalMarkerMouseDown,
  onTimelineMouseDown,
  onTimelineMouseMove
}, timelineListRef) => {
  if (!timelineWrapperRef.current) return null

  const focusedRangeStyle = {}
  const focusedRangeMaskLeftStyle = {}
  const focusedRangeMaskRightStyle = {}
  const temporalStartStyle = {}
  const temporalEndStyle = {}
  const temporalRangeStyle = {}
  const temporalRangeMouseOverStyle = {}

  // If a position is set for the temporal selection mouseover indicator, set the left property to that value
  if (temporalRangeMouseOverPosition) {
    temporalRangeMouseOverStyle.left = temporalRangeMouseOverPosition
  }

  const { end, start } = temporalRange
  const { end: focusedIntervalEnd, start: focusedIntervalStart } = focusedInterval

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

  if (end || start) {
    const range = [
      start || timeIntervals[0],
      end || generateEndTime(timeIntervals, zoomLevel)
    ].sort()
    const [startPosition, endPosition] = range

    // Style the temporal range area
    temporalRangeStyle.left = getPositionByTimestamp({
      timestamp: startPosition,
      timeIntervals,
      zoomLevel,
      wrapperWidth: timelineWrapperWidth
    })
    temporalRangeStyle.width = determineScaledWidth(
      endPosition - startPosition,
      zoomLevel,
      timelineWrapperWidth
    )
  }

  if (focusedIntervalStart && focusedIntervalEnd) {
    // Style the focused area
    focusedRangeStyle.left = getPositionByTimestamp({
      timestamp: focusedIntervalStart,
      timeIntervals,
      zoomLevel,
      wrapperWidth: timelineWrapperWidth
    })
    focusedRangeStyle.width = determineScaledWidth(
      focusedIntervalEnd - focusedIntervalStart,
      zoomLevel,
      timelineWrapperWidth
    ) + 2 // Accomodate for the 2px border on the interval

    // Style the left focused interval mask
    focusedRangeMaskLeftStyle.left = 0
    focusedRangeMaskLeftStyle.width = determineScaledWidth(
      focusedIntervalStart - timeIntervals[0],
      zoomLevel,
      timelineWrapperWidth
    )

    // Style the right focused interval mask
    focusedRangeMaskRightStyle.left = getPositionByTimestamp({
      timestamp: focusedIntervalEnd,
      timeIntervals,
      zoomLevel,
      wrapperWidth: timelineWrapperWidth
    }) + 2 // Accomodate for the 2px border on the interval
    focusedRangeMaskRightStyle.width = determineScaledWidth(
      generateEndTime(timeIntervals, zoomLevel) - focusedIntervalEnd,
      zoomLevel,
      timelineWrapperWidth
    )
  }

  const timelineListClassnames = classNames([
    'timeline-list',
    {
      'timeline-list--is-dragging': dragging,
      'timeline-list--is-temporal-dragging': draggingTemporalStart || draggingTemporalEnd,
      'timeline-list--has-focused-interval': !!focusedIntervalStart
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
          zIndex: timeIntervals.length + 2
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
        {
          (start || end) && (
            <div
              className="timeline-list__temporal-range"
              style={temporalRangeStyle}
            />
          )
        }
        {
          focusedIntervalStart && (
            <>
              <div
                className="timeline-list__focused-range"
                style={focusedRangeStyle}
              />
              <div
                className="timeline-list__focused-range-mask"
                style={focusedRangeMaskLeftStyle}
              />
              <div
                className="timeline-list__focused-range-mask"
                style={focusedRangeMaskRightStyle}
              />
            </>
          )
        }
      </section>
      <span className="timeline-list__line" />
      <TimelineDataSection
        data={data}
        timeIntervals={timeIntervals}
        timelineWrapperWidth={timelineWrapperWidth}
        zoomLevel={zoomLevel}
      />
      <div className="timeline-list__intervals">
        {
          timeIntervals && timeIntervals.map((startTime, intervalIndex) => {
            let endTime
            const focused = startTime === focusedIntervalStart

            if (timeIntervals[intervalIndex + 1] != null) {
              // If the next interval is not null, use it as the endTime
              endTime = timeIntervals[intervalIndex + 1]
            } else {
              // Generate a new interval to use as the endTime
              endTime = generateEndTime(timeIntervals, zoomLevel)
            }

            // The end of the interval is 1ms before the next startTime
            endTime -= 1

            let focusable = true
            const {
              end: temporalEnd,
              start: temporalStart
            } = temporalRange
            if (temporalStart || temporalEnd) {
              focusable = startTime < temporalEnd && endTime > temporalStart
            }

            // Each interval needs to be one zIndex lower than the interval to it's left.
            // This keeps labels on top of interval borders
            const zIndex = timeIntervals.length - intervalIndex

            return (
              <TimelineInterval
                key={startTime}
                focusable={focusable}
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
    </div>
  )
})

TimelineList.defaultProps = {
  temporalRangeMouseOverPosition: null,
  intervalListWidthInPixels: 0
}

TimelineList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // ?
      title: PropTypes.string,
      color: PropTypes.string,
      intervals: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.number
        ) // [start, end, number of items in interval]
      ).isRequired
    })
  ).isRequired,
  dragging: PropTypes.bool.isRequired,
  draggingTemporalStart: PropTypes.bool.isRequired,
  draggingTemporalEnd: PropTypes.bool.isRequired,
  focusedInterval: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number
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
