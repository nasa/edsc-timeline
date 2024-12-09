import React, { useState } from 'react'

import EDSCTimeline from '../../../../src'

import { Output } from '../Output/Output'
import ExampleWrapper from '../ExampleWrapper/ExampleWrapper'

export const Callbacks = () => {
  // eslint-disable-next-line no-undef
  if (hljs) hljs.highlightAll()

  const [center] = useState(new Date('2021').getTime())
  const [temporal, setTemporal] = useState({})
  const [focusedInterval, setFocusedInterval] = useState({})

  const [displayedCenter, setDisplayedCenter] = useState()
  const [timelineRange, setTimelineRange] = useState({})
  const [displayedZoom, setDisplayedZoom] = useState()

  const handleTimelineMove = (values) => {
    const {
      center: newCenter, timelineEnd, zoom, timelineStart
    } = values

    setDisplayedCenter(newCenter)
    setTimelineRange({
      end: timelineEnd,
      start: timelineStart
    })

    setDisplayedZoom(zoom)
  }

  const handleTemporalSet = (data) => {
    const { temporalEnd, temporalStart } = data
    setTemporal({
      end: temporalEnd,
      start: temporalStart
    })

    console.log('handleTemporalSet called', JSON.stringify(data))
  }

  const handleFocusedSet = ({ focusedEnd, focusedStart }) => {
    setFocusedInterval({
      end: focusedEnd,
      start: focusedStart
    })
  }

  const { end: temporalEnd, start: temporalStart } = temporal

  const { end: focusedEnd, start: focusedStart } = focusedInterval

  const data = [
    {
      id: 'row1',
      title: 'Test',
      intervals: []
    }
  ]

  const handleArrowKeyPan = (eventData) => console.log('handleArrowKeyPan called', JSON.stringify(eventData))
  const handleButtonPan = (eventData) => console.log('handleButtonPan called', JSON.stringify(eventData))
  const handleButtonZoom = (eventData) => console.log('handleButtonZoom called', JSON.stringify(eventData))
  const handleDragPan = (eventData) => console.log('handleDragPan called', JSON.stringify(eventData))
  const handleFocusedIntervalClick = (eventData) => console.log('handleFocusedIntervalClick called', JSON.stringify(eventData))
  const handleScrollPan = (eventData) => console.log('handleScrollPan called', JSON.stringify(eventData))
  const handleScrollZoom = (eventData) => console.log('handleScrollZoom called', JSON.stringify(eventData))

  return (
    <ExampleWrapper
      pageHeading="Callbacks"
      description="This example shows a timeline where all the callbacks are used. Check the console log for the callback output."
      timeline={
        (
          <EDSCTimeline
            eventData={data}
            center={center}
            focusedInterval={focusedInterval}
            zoom={3}
            minZoom={1}
            maxZoom={5}
            temporalRange={temporal}
            onArrowKeyPan={handleArrowKeyPan}
            onButtonPan={handleButtonPan}
            onButtonZoom={handleButtonZoom}
            onDragPan={handleDragPan}
            onFocusedIntervalClick={handleFocusedIntervalClick}
            onFocusedSet={handleFocusedSet}
            onScrollPan={handleScrollPan}
            onScrollZoom={handleScrollZoom}
            onTemporalSet={handleTemporalSet}
            onTimelineMoveEnd={handleTimelineMove}
          />
        )
      }
      output={
        (
          <Output
            displayedCenter={displayedCenter}
            zoom={displayedZoom}
            timelineRange={timelineRange}
            temporalStart={temporalStart}
            temporalEnd={temporalEnd}
            focusedStart={focusedStart}
            focusedEnd={focusedEnd}
          />
        )
      }
      code={
        `
<EDSCTimeline
  data={[{
    id: 'row1',
    title: 'Test',
    intervals: []
  }]}
  onArrowKeyPan={handleArrowKeyPan}
  onButtonPan={handleButtonPan}
  onButtonZoom={handleButtonZoom}
  onDragPan={handleDragPan}
  onFocusedIntervalClick={handleFocusedIntervalClick}
  onFocusedSet={handleFocusedSet}
  onScrollPan={handleScrollPan}
  onScrollZoom={handleScrollZoom}
  onTemporalSet={handleTemporalSet}
  onTimelineMoveEnd={handleTimelineMove}
/>
            `
      }
    />
  )
}
