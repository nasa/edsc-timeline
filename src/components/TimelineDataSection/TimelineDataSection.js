import React from 'react'
import PropTypes from 'prop-types'

import { determineScaledWidth } from '../../utils/determineScaledWidth'
import { getPositionByTimestamp } from '../../utils/getPositionByTimestamp'

import { DEFAULT_COLOR } from '../../constants'

import './TimelineDataSection.scss'

/**
 * Renders a list of TimelineDataSection
 * @param {Object} param0
 * @param {Array} param0.data An array of objects defining the data to display
 * @param {Array} param0.timeIntervals Array of dates representing intervals at the provided zoom level
 * @param {Integer} param0.timelineWrapperWidth The width of the timeline wrapper
 * @param {Integer} param0.zoomLevel Current zoom level of the timeline
 */
export const TimelineDataSection = ({
  data,
  timeIntervals,
  timelineWrapperWidth,
  zoomLevel
}) => (
  <div
    className="edsc-timeline-data-section"
    style={{
      zIndex: timeIntervals.length + 1
    }}
  >
    {
      data.map((entry, i) => {
        const {
          id,
          intervals,
          title,
          color = DEFAULT_COLOR
        } = entry

        const key = `${id}-${i}`

        return (
          <div
            className="edsc-timeline-data-section__entry"
            key={key}
          >
            {
              intervals.map((interval) => {
                const [startTime, endTime] = interval

                const left = getPositionByTimestamp({
                  timestamp: startTime,
                  timeIntervals,
                  zoomLevel,
                  wrapperWidth: timelineWrapperWidth
                })

                const width = determineScaledWidth(
                  endTime - startTime,
                  zoomLevel,
                  timelineWrapperWidth
                )

                return (
                  <div
                    key={`${title}-${startTime}`}
                    className="edsc-timeline-data-section__interval"
                    style={{
                      left,
                      width,
                      backgroundColor: color
                    }}
                  />
                )
              })
            }
          </div>
        )
      })
    }
  </div>
)

TimelineDataSection.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      color: PropTypes.string,
      intervals: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.number
        ) // [start, end, number of items in interval]
      ).isRequired
    })
  ).isRequired,
  timelineWrapperWidth: PropTypes.number.isRequired,
  timeIntervals: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoomLevel: PropTypes.number.isRequired
}
