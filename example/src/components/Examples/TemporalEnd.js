import React, { useState } from 'react'

import EDSCTimeline from '../../../../src'
import { Output } from '../Output/Output'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles.scss'

export const TemporalEnd = () => {
  const [center] = useState(new Date('2021').getTime())
  const [temporal, setTemporal] = useState({
    end: new Date('2021-01-16T10:55:09.343Z').getTime()
  })
  const [focusedInterval, setFocusedInterval] = useState({})

  const [displayedCenter, setDisplayedCenter] = useState()
  const [timelineRange, setTimelineRange] = useState({})
  const [displayedZoom, setDisplayedZoom] = useState()

  const handleTimelineMove = (values) => {
    const {
      center,
      timelineEnd,
      zoom,
      timelineStart
    } = values

    setDisplayedCenter(center)
    setTimelineRange({ end: timelineEnd, start: timelineStart })
    setDisplayedZoom(zoom)
  }

  const handleTemporalSet = ({ temporalEnd, temporalStart }) => {
    setTemporal({ end: temporalEnd, start: temporalStart })
  }

  const handleFocusedSet = ({ focusedEnd, focusedStart }) => {
    setFocusedInterval({ end: focusedEnd, start: focusedStart })
  }

  const {
    end: temporalEnd,
    start: temporalStart
  } = temporal

  const {
    end: focusedEnd,
    start: focusedStart
  } = focusedInterval

  const data = [
    {
      id: 'row1',
      title: 'Test',
      intervals: []
    }
  ]

  return (
    <>
      <section className="container">
        <h1>
          EDSC Timeline React Plugin Demo
        </h1>

        <div className="timeline-example timeline-example--one">
          <EDSCTimeline
            data={data}
            center={center}
            focusedInterval={focusedInterval}
            zoom={3}
            minZoom={1}
            maxZoom={5}
            temporalRange={temporal}
            onTimelineMove={handleTimelineMove}
            onTimelineMoveEnd={handleTimelineMove}
            onTemporalSet={handleTemporalSet}
            onFocusedSet={handleFocusedSet}
          />
        </div>

        <Output
          displayedCenter={displayedCenter}
          zoom={displayedZoom}
          timelineRange={timelineRange}
          temporalStart={temporalStart}
          temporalEnd={temporalEnd}
          focusedStart={focusedStart}
          focusedEnd={focusedEnd}
        />
      </section>
    </>
  )
}
