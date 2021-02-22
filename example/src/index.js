import React, { useState } from 'react'
import { render } from 'react-dom'
import GithubCorner from 'react-github-corner'

import EDSCTimeline from '../../src'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

const App = () => {
  const [showTimeline, setShowTimeline] = useState(true)
  const [center] = useState(() => (new Date(Date.UTC(2020, 0, 1, 3, 12, 58))).getTime())

  const [displayedCenter, setDisplayedCenter] = useState()
  const [displayedInterval, setDisplayedInterval] = useState()

  const handleShowHideButton = () => {
    setShowTimeline(!showTimeline)
  }

  const handleTimelineMove = (values) => {
    const { center, interval } = values

    setDisplayedCenter(center)
    setDisplayedInterval(interval)
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
          zoom={5}
          minZoom={1}
          maxZoom={5}
          onTimelineMove={handleTimelineMove}
        />
      </div>

      <div>
        <span>
          Center:
          {' '}
          {new Date(displayedCenter).toUTCString()}
        </span>
      </div>

      <div>
        <span>
          Interval:
          {' '}
          {displayedInterval}
        </span>
      </div>

      <GithubCorner href="https://github.com/nasa/edsc-timeline" />
    </>
  )
}

render(<App />, document.getElementById('root'))
