import React from 'react'
import PropTypes from 'prop-types'

import './TimelineList.scss'
import { TimelineInterval } from '../TimelineInterval/TimelineInterval'
import { calculateTimeIntervals } from '../../utils/calculateTimeIntervals'

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
        timeIntervals && timeIntervals.map((interval, intervalIndex) => {
          const startTime = interval
          let endTime

          if (timeIntervals[intervalIndex + 1] != null) {
            endTime = timeIntervals[intervalIndex + 1]
          } else {
            const lastInterval = timeIntervals[timeIntervals.length - 1]
            const [nextEndTime] = calculateTimeIntervals({
              timeAnchor: lastInterval,
              zoomLevel,
              numIntervals: 1,
              reverse: false
            })

            endTime = nextEndTime
          }

          const zIndex = timeIntervals.length - intervalIndex

          return (
            <TimelineInterval
              key={interval}
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
