import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import { inRange } from 'lodash'

import { DEFAULT_COLOR } from '../../constants'

import './TimelinePrimarySection.scss'
/**
 * Renders the primary collection information
 * @param {Object} param0
 * @param {Object} param0.data The timeline data
 * @param {Object} param0.visibleTemporalRange The visible temporal range
 */
export const TimelinePrimarySection = ({
  data,
  visibleTemporalRange
}) => (
  <section className="edsc-timeline-primary-section">
    <ul className="edsc-timeline-primary-section__entries">
      {
        data && data.map((entry, i) => {
          const {
            id,
            intervals,
            title,
            color = DEFAULT_COLOR
          } = entry

          const { end: visibleEnd, start: visibleStart } = visibleTemporalRange

          const intervalsBeforeVisibleRange = []
          const intervalsAfterVisibleRange = []
          const intervalsInVisibleRange = []

          intervals.forEach((interval) => {
            const [intervalStart, intervalEnd] = interval

            // Push any intervals that end before the visible start
            if (intervalEnd < visibleStart) {
              intervalsBeforeVisibleRange.push(interval)
            }

            // Push any intervals that start before the visible end
            if (intervalStart > visibleEnd) {
              intervalsAfterVisibleRange.push(interval)
            }

            // Push any intervals that either start or end between the visible start or visible end, or
            // if the start is before the visible start AND the end is after the visible end
            if (
              inRange(intervalStart, visibleStart, visibleEnd)
              || inRange(intervalEnd, visibleStart, visibleEnd)
              || (intervalStart < visibleStart && intervalEnd > visibleEnd)
            ) {
              intervalsInVisibleRange.push(interval)
            }
          })

          const noVisibleDataBeforeMarkerClassnames = classNames([
            'edsc-timeline-primary-section__no-visible-data-marker',
            'edsc-timeline-primary-section__no-visible-data-marker--before',
            {
              'edsc-timeline-primary-section__no-visible-data-marker--is-visible': (
                !intervalsInVisibleRange.length && intervalsBeforeVisibleRange.length > 0
              )
            }
          ])

          const noVisibleDataAfterMarkerClassnames = classNames([
            'edsc-timeline-primary-section__no-visible-data-marker',
            'edsc-timeline-primary-section__no-visible-data-marker--before',
            {
              'edsc-timeline-primary-section__no-visible-data-marker--is-visible': (
                !intervalsInVisibleRange.length && intervalsAfterVisibleRange.length > 0
              )
            }
          ])

          const key = `${id}-${i}`
          return (
            <li
              className="edsc-timeline-primary-section__entry"
              key={key}
              title={title}
            >
              <div className={noVisibleDataBeforeMarkerClassnames}>
                <FaAngleDoubleLeft
                  className="edsc-timeline-primary-section__no-visible-data-icon"
                  style={{
                    fill: color
                  }}
                />
              </div>
              <div className="edsc-timeline-primary-section__primary">
                <div className="edsc-timeline-primary-section__title-wrapper">
                  <h3
                    className="edsc-timeline-primary-section__title"
                    title={title}
                  >
                    {title}
                  </h3>
                </div>
              </div>
              <div className={noVisibleDataAfterMarkerClassnames}>
                <FaAngleDoubleRight
                  className="edsc-timeline-primary-section__no-visible-data-icon"
                  style={{
                    fill: color
                  }}
                />
              </div>
            </li>
          )
        })
      }
    </ul>
  </section>
)

TimelinePrimarySection.propTypes = {
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
  visibleTemporalRange: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }).isRequired
}
