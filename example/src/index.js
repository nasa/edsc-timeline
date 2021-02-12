import React, { useState } from 'react'
import { render } from 'react-dom'
import GithubCorner from 'react-github-corner'

import EDSCTimeline from '../../src'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

const App = () => {
  const [showTimeline, setShowTimeline] = useState(true)

  const handleShowHideButton = () => {
    setShowTimeline(!showTimeline)
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
          show={showTimeline}
          onTimelineMove={() => console.log('we movin!')}
          zoom={3}
        />
      </div>

      <GithubCorner href="https://github.com/nasa/edsc-timeline" />
    </>
  )
}

render(<App />, document.getElementById('root'))
