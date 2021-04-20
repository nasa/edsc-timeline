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
  const [displayedInterval, setDisplayedInterval] = useState()

  const handleTimelineMove = (values) => {
    const {
      center,
      end,
      interval,
      start
    } = values

    setDisplayedCenter(center)
    setTimelineRange({ end, start })
    setDisplayedInterval(interval)
  }

  const handleTemporalSet = (values) => {
    setTemporal(values)
  }

  const handleFocusedSet = (values) => {
    setFocusedInterval(values)
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

  const handleArrowKeyPan = () => console.log('handleArrowKeyPan called')
  const handleButtonPan = () => console.log('handleButtonPan called')
  const handleButtonZoom = () => console.log('handleButtonZoom called')
  const handleCreatedTemporal = () => console.log('handleCreatedTemporal called')
  const handleDragPan = () => console.log('handleDragPan called')
  const handleFocusedClick = () => console.log('handleFocusedClick called')
  const handleScrollPan = () => console.log('handleScrollPan called')
  const handleScrollZoom = () => console.log('handleScrollZoom called')

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
            onCreatedTemporal={handleCreatedTemporal}
            onDragPan={handleDragPan}
            onFocusedClick={handleFocusedClick}
            onFocusedSet={handleFocusedSet}
            onScrollPan={handleScrollPan}
            onScrollZoom={handleScrollZoom}
            onTemporalSet={handleTemporalSet}
            onTimelineMoveEnd={handleTimelineMove}
          />
        </div>

        <Output
          displayedCenter={displayedCenter}
          interval={displayedInterval}
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
