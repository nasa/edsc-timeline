import React, { useState } from 'react'

import EDSCTimeline from '../../../../src'
import { Output } from '../Output/Output'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles.scss'

export const Callbacks = () => {
  const [center] = useState(new Date('2021').getTime())
  const [temporal, setTemporal] = useState({})
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

  const handleTemporalSet = (data) => {
    const { temporalEnd, temporalStart } = data
    setTemporal({ end: temporalEnd, start: temporalStart })
    console.log('handleTemporalSet called', JSON.stringify(data))
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

  const handleArrowKeyPan = (data) => console.log('handleArrowKeyPan called', JSON.stringify(data))
  const handleButtonPan = (data) => console.log('handleButtonPan called', JSON.stringify(data))
  const handleButtonZoom = (data) => console.log('handleButtonZoom called', JSON.stringify(data))
  const handleDragPan = (data) => console.log('handleDragPan called', JSON.stringify(data))
  const handleFocusedIntervalClick = (data) => console.log('handleFocusedIntervalClick called', JSON.stringify(data))
  const handleScrollPan = (data) => console.log('handleScrollPan called', JSON.stringify(data))
  const handleScrollZoom = (data) => console.log('handleScrollZoom called', JSON.stringify(data))

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
