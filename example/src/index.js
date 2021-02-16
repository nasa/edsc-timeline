import React, { useState } from 'react'
import { render } from 'react-dom'
import GithubCorner from 'react-github-corner'

import EDSCTimeline from '../../src'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

const App = () => {
  const [showTimeline, setShowTimeline] = useState(true)
  const [center, setCenter] = useState(new Date('2021-01-05T11:12:00.000Z').getTime())
  const [interval, setInterval] = useState('')

  const handleShowHideButton = () => {
    setShowTimeline(!showTimeline)
  }

  const handleTimelineMove = (values) => {
    const { center, interval } = values
    console.log('🚀 ~ file: index.js ~ line 21 ~ handleTimelineMove ~ center', center)
    setCenter(center)
    setInterval(interval)
  }

  const showHideButtonTitle = showTimeline ? 'Hide Timeline' : 'Show Timeline'

  return (
    <>
      <h1>
        EDSC Timeline React Plugin Demo
      </h1>

      <form className="mb-4">
        <button
          className="btn btn-primary"
          type="button"
          title={showHideButtonTitle}
          onClick={handleShowHideButton}
        >
          {showHideButtonTitle}
        </button>
      </form>

      <div className="timeline-one">
        <EDSCTimeline
          rows={[]}
          center={center}
          show={showTimeline}
          zoom={3}
          minZoom={1}
          maxZoom={5}
          onTimelineMove={handleTimelineMove}
        />
      </div>

      <div>
        <span>
          Center:
          {' '}
          {new Date(center).toISOString()}
        </span>
      </div>

      <div>
        <span>
          Interval:
          {' '}
          {interval}
        </span>
      </div>

      <GithubCorner href="https://github.com/nasa/edsc-timeline" />
    </>
  )
}

render(<App />, document.getElementById('root'))
