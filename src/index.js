import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

export const EDSCTimeline = ({
  rows,
  show
}) => {
  console.log('🚀 ~ file: index.js ~ line 6 ~ rows', rows)
  console.log('🚀 ~ file: index.js ~ line 6 ~ show', show)

  return (
    <>
      {
        show && (
          <div className="timeline">
            Testing
          </div>
        )
      }
    </>
  )
}

EDSCTimeline.defaultProps = {
  show: true
}

EDSCTimeline.propTypes = {
  minDate: PropTypes.number, // minimum date timeline will allow scrolling
  maxDate: PropTypes.number, // maximum date timeline will allow scrolling
  resolution: PropTypes.string, // resolution of timeline day/month/etc.
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // ?
      title: PropTypes.string,
      color: PropTypes.string,
      intervals: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.number
        ) // [start, end, number of items in interval]
      ).isRequired,
    })
  ).isRequired,
  show: PropTypes.bool,
  onTemporalSet: PropTypes.func.isRequired,
  onFocusedTemporalSet: PropTypes.func.isRequired,
  onTimelineMove: PropTypes.func.isRequired
}

export default EDSCTimeline
