import React, { useState } from 'react'
import EDSCTimeline from '../../../../src'
import { Output } from '../Output/Output'
import ExampleWrapper from '../ExampleWrapper/ExampleWrapper'

export const PropState = () => {
  // eslint-disable-next-line no-undef
  if (hljs) hljs.highlightAll()

  // State declarations
  const [center, setCenter] = useState(new Date('2021').getTime())
  const [temporal, setTemporal] = useState({})
  const [focusedInterval, setFocusedInterval] = useState({})
  const [timelineRange, setTimelineRange] = useState({})
  const [zoomLevel, setZoomLevel] = useState(2)

  const handleTimelineMove = (values) => {
    const {
      timelineEnd, zoom, timelineStart
    } = values
    setTimelineRange({
      end: timelineEnd,
      start: timelineStart
    })

    setZoomLevel(zoom) // Keep zoom state in sync
  }

  const handleTemporalSet = ({ temporalEnd, temporalStart }) => {
    setTemporal({
      end: temporalEnd,
      start: temporalStart
    })
  }

  const handleFocusedSet = ({ focusedEnd, focusedStart }) => {
    setFocusedInterval({
      end: focusedEnd,
      start: focusedStart
    })
  }

  const increaseZoom = () => {
    const newZoom = Math.min(zoomLevel + 1, 5)
    setZoomLevel(newZoom)
  }

  const decreaseZoom = () => {
    const newZoom = Math.max(zoomLevel - 1, 1)
    setZoomLevel(newZoom)
  }

  const MS_PER_DAY = 24 * 60 * 60 * 1000

  const shiftCenterLeft = () => {
    const newCenter = center - MS_PER_DAY
    setCenter(newCenter)
  }

  const shiftCenterRight = () => {
    const newCenter = center + MS_PER_DAY
    setCenter(newCenter)
  }

  const adjustZoomAndCenter = (newZoom, newCenter) => {
    setZoomLevel(newZoom)
    setCenter(newCenter)
  }

  const data = [
    {
      id: 'row1',
      title: 'Test',
      intervals: []
    }
  ]

  return (
    <ExampleWrapper
      pageHeading="Zoom"
      timeline={
        (
          <EDSCTimeline
            data={data}
            center={center}
            focusedInterval={focusedInterval}
            minZoom={1}
            maxZoom={5}
            zoom={zoomLevel}
            temporalRange={temporal}
            onTimelineMove={handleTimelineMove}
            onTimelineMoveEnd={handleTimelineMove}
            onTemporalSet={handleTemporalSet}
            onFocusedSet={handleFocusedSet}
          />
        )
      }
      description={
        (
          <div>
            <p>This example demonstrates zoom level and center as state passed into Timeline as a prop.</p>
            <span>
              Current zoom level:
              {' '}
              {zoomLevel}
            </span>
            <span style={
              {
                display: 'block',
                marginBottom: '5px'
              }
            }
            >
              Current center:
              {' '}
              {center}
            </span>
            <div style={{ marginBottom: '10px' }}>
              <button
                type="button"
                onClick={increaseZoom}
                style={
                  {
                    marginRight: '5px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }
                }
              >
                Zoom Out (+)
              </button>
              <button
                type="button"
                onClick={decreaseZoom}
                style={
                  {
                    marginRight: '5px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }
                }
              >
                Zoom In (-)
              </button>
              <button
                type="button"
                onClick={shiftCenterLeft}
                style={
                  {
                    marginRight: '5px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }
                }
              >
                ← Day Back
              </button>
              <button
                type="button"
                onClick={shiftCenterRight}
                style={
                  {
                    marginRight: '5px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }
                }
              >
                Day Forward →
              </button>
              <button
                type="button"
                onClick={() => adjustZoomAndCenter(2, new Date('2021').getTime())}
                style={
                  {
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }
                }
              >
                Reset Zoom and Center
              </button>
            </div>
          </div>
        )
      }
      output={
        (
          <div>
            <Output
              displayedCenter={center}
              timelineEnd={timelineRange.end}
              timelineStart={timelineRange.start}
              zoom={zoomLevel}
            />
          </div>
        )
      }
      code={
        `
const [center, setCenter] = useState(new Date('2021').getTime())
const [zoomLevel, setZoomLevel] = useState(5)

const increaseZoom = () => {
  const newZoom = Math.min(zoomLevel + 1, 5)
  setZoomLevel(newZoom)
}

const decreaseZoom = () => {
  const newZoom = Math.max(zoomLevel - 1, 1)
  setZoomLevel(newZoom)
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

const shiftCenterLeft = () => {
  const newCenter = center - MS_PER_DAY
  setCenter(newCenter)
}

const shiftCenterRight = () => {
  const newCenter = center + MS_PER_DAY
  setCenter(newCenter)
}

<EDSCTimeline
  data={[{
    id: 'row1',
    title: 'Test',
    intervals: []
  }]}
  zoom=zoomLevel
  center=center
/>
`
      }
    />
  )
}
