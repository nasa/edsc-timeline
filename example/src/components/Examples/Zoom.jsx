import React, { useState } from 'react'
import EDSCTimeline from '../../../../src'
import { Output } from '../Output/Output'
import ExampleWrapper from '../ExampleWrapper/ExampleWrapper'

export const Zoom = () => {
  // eslint-disable-next-line no-undef
  if (hljs) hljs.highlightAll()

  // State declarations
  const [center] = useState(new Date('2021').getTime())
  const [temporal, setTemporal] = useState({})
  const [focusedInterval, setFocusedInterval] = useState({})
  const [displayedCenter, setDisplayedCenter] = useState()
  const [timelineRange, setTimelineRange] = useState({})
  const [displayedZoom, setDisplayedZoom] = useState(5)
  const [zoomLevel, setZoomLevel] = useState(5)

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
            <p>This example demonstrates zoom level as state passed into Timeline as a prop.</p>
            <span>
              Current zoom level:
              {' '}
              {zoomLevel}
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
                    padding: '5px 10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }
                }
              >
                Zoom In (-)
              </button>
            </div>
          </div>
        )
      }
      output={
        (
          <div>
            <Output
              center={displayedCenter}
              timelineEnd={timelineRange.end}
              timelineStart={timelineRange.start}
              zoom={displayedZoom}
            />
          </div>
        )
      }
      code={
        `
const [zoomLevel, setZoomLevel] = useState(5)
<EDSCTimeline
  data={[{
    id: 'row1',
    title: 'Test',
    intervals: []
  }]}
  zoom=zoomLevel
/>
`
      }
    />
  )
}
