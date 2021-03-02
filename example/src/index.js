import React, { useState } from 'react'
import { render } from 'react-dom'
import GithubCorner from 'react-github-corner'
import { startCase } from 'lodash'

import EDSCTimeline from '../../src'

import { RESOLUTIONS } from '../../src/constants'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.scss'

const App = () => {
  const [center] = useState(() => (new Date(Date.UTC(2020, 0, 1, 3, 12, 58))).getTime())
  const [temporal, setTemporal] = useState({
    start: new Date('2020-01').getTime(),
    end: new Date('2020-02').getTime()
  })

  const [displayedCenter, setDisplayedCenter] = useState()
  const [displayedInterval, setDisplayedInterval] = useState()

  const handleTimelineMove = (values) => {
    const { center, interval } = values

    setDisplayedCenter(center)
    setDisplayedInterval(interval)
  }

  const handleTemporalSet = (values) => {
    setTemporal(values)
  }

  const {
    end: temporalEnd,
    start: temporalStart
  } = temporal

  return (
    <>
      <section className="container">
        <h1>
          EDSC Timeline React Plugin Demo
        </h1>

        <div className="timeline-one">
          <EDSCTimeline
            rows={[]}
            center={center}
            zoom={3}
            minZoom={1}
            maxZoom={5}
            temporalRange={temporal}
            onTimelineMove={handleTimelineMove}
            onTemporalSet={handleTemporalSet}
          />
        </div>

        <section className="demo__metadata mb-4">
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
              {startCase(RESOLUTIONS[displayedInterval])}
              {` (${displayedInterval})`}
            </span>
          </div>

          <div>
            <span>
              Temporal Start:
              {' '}
              {
                temporalStart && new Date(temporalStart).toISOString()
              }
            </span>
          </div>

          <div>
            <span>
              Temporal End:
              {' '}
              {
                temporalEnd && new Date(temporalEnd).toISOString()
              }
            </span>
          </div>
        </section>
      </section>

      <GithubCorner href="https://github.com/nasa/edsc-timeline" />
    </>
  )
}

render(<App />, document.getElementById('root'))
