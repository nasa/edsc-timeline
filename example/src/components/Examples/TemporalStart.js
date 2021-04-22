import React, { useState } from 'react'

import EDSCTimeline from '../../../../src'
import { Output } from '../Output/Output'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles.scss'

export const TemporalStart = () => {
  const [center] = useState(new Date('2021').getTime())
  const [temporal, setTemporal] = useState({
    start: new Date('2020-12-15T13:24:20.695Z').getTime()
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
    <section className="container">
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

      <div className="demo__code">
        <p>
          This example shows a timeline where a temporal range with only a start value is provided.
        </p>
        <pre>
          <code className="jsx">
            {`
<EDSCTimeline
  data={[{
    id: 'row1',
    title: 'Test',
    intervals: []
  }]}
  temporalRange={{
    start: new Date('2020-12-15T13:24:20.695Z').getTime()
  }}
/>
            `}
          </code>
        </pre>
      </div>

    </section>
  )
}
