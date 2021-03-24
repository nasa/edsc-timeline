import React from 'react'
import PropTypes from 'prop-types'

import './TimelinePrimarySection.scss'
/**
 * Renders the primary collection information
 * @param {Object} param0
 * @param {Object} param0.data The timeline data
 */
export const TimelinePrimarySection = ({
  data
}) => (
  <section className="timeline-primary-section">
    {
      data && data.map((entry, i) => {
        const {
          id,
          title
        } = entry
        const key = `${id}-${i}`
        return (
          <div
            className="timeline-primary-section__entry"
            key={key}
            title={title}
          >
            {title}
          </div>
        )
      })
    }
  </section>
)

TimelinePrimarySection.propTypes = {
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
  ).isRequired
}
