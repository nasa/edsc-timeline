import React, { useState } from "react"

import EDSCTimeline from "../../../../src"

import { Output } from "../Output/Output"
import ExampleWrapper from "../ExampleWrapper/ExampleWrapper"

export const TemporalEnd = () => {
  // eslint-disable-next-line no-undef
  if (hljs) hljs.highlightAll()

  const [center] = useState(new Date("2021").getTime())
  const [temporal, setTemporal] = useState({
    end: new Date("2021-01-16T10:55:09.343Z").getTime(),
  })
  const [focusedInterval, setFocusedInterval] = useState({})

  const [displayedCenter, setDisplayedCenter] = useState()
  const [timelineRange, setTimelineRange] = useState({})
  const [displayedZoom, setDisplayedZoom] = useState()

  const handleTimelineMove = (values) => {
    const { center, timelineEnd, zoom, timelineStart } = values

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

  const { end: temporalEnd, start: temporalStart } = temporal

  const { end: focusedEnd, start: focusedStart } = focusedInterval

  const data = [
    {
      id: "row1",
      title: "Test",
      intervals: [],
    },
  ]

  return (
    <ExampleWrapper
      pageHeading="Temporal End"
      description="This example shows a timeline where a temporal range with only a end value is applied."
      timeline={
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
      }
      output={
        <Output
          displayedCenter={displayedCenter}
          zoom={displayedZoom}
          timelineRange={timelineRange}
          temporalStart={temporalStart}
          temporalEnd={temporalEnd}
          focusedStart={focusedStart}
          focusedEnd={focusedEnd}
        />
      }
      code={`
<EDSCTimeline
  data={[{
    id: 'row1',
    title: 'Test',
    intervals: []
  }]}
  temporalRange={{
    end: new Date('2021-01-16T10:55:09.343Z').getTime()
  }}
/>
`}
    />
  )
}
