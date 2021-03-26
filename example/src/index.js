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
    end: new Date('2020-03-15').getTime()
  })
  const [focusedInterval, setFocusedInterval] = useState({
    // start: new Date('2020-01-01T00:00:00.000Z').getTime(),
    // end: new Date('2020-01-31T23:59:59.999Z').getTime()
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
      title: 'Test Collection With A Really Really Really Super Long Name',
      intervals: [
        [
          new Date('2019-08-12').getTime(),
          new Date('2019-12-20').getTime(),
          42
        ],
        [
          new Date('2020-01-04').getTime(),
          new Date('2020-05-20').getTime(),
          50
        ]
      ]
    },
    {
      id: 'row2',
      title: 'Test Collection 2',
      color: '#3498DB',
      intervals: [
        [
          new Date('2019-07-01').getTime(),
          new Date('2021-12-20').getTime(),
          42
        ]
      ]
    },
    {
      id: 'row3',
      title: 'Test Collection 3',
      color: '#dc3545',
      intervals: [
        [
          new Date('2019-07-12').getTime(),
          new Date('2019-07-13').getTime(),
          42
        ],
        [
          new Date('2021-01-01').getTime(),
          new Date('2021-01-02').getTime(),
          50
        ]
      ]
    },
    {
      id: 'row4',
      title: 'Test Collection 4',
      color: '#3498DB',
      intervals: [
        [
          new Date('2019-08-12').getTime(),
          new Date('2019-12-20').getTime(),
          42
        ],
        [
          new Date('2019-12-25').getTime(),
          new Date('2019-12-26').getTime(),
          42
        ],
        [
          new Date('2020-01-04').getTime(),
          new Date('2020-05-18').getTime(),
          50
        ]
      ]
    },
    {
      id: 'row5',
      title: 'Test Collection 5',
      color: '#3498DB',
      intervals: [
        [
          new Date('2019-08-12').getTime(),
          new Date('2019-12-20').getTime(),
          42
        ],
        [
          new Date('2019-12-25').getTime(),
          new Date('2019-12-26').getTime(),
          42
        ],
        [
          new Date('2020-01-04').getTime(),
          new Date('2020-05-18').getTime(),
          50
        ]
      ]
    }
  ]

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
            onTimelineMove={handleTimelineMove}
            onTemporalSet={handleTemporalSet}
            onFocusedSet={handleFocusedSet}
          />
        </div>

        <section className="demo__metadata mb-4">
          <div>
            <span className="demo__metadata-label">Center:</span>
            {` ${new Date(displayedCenter).toUTCString()}`}
          </div>

          <div>
            <span className="demo__metadata-label">Interval:</span>
            {` ${startCase(RESOLUTIONS[displayedInterval])} (${displayedInterval})`}
          </div>

          <div>
            <span className="demo__metadata-label">Temporal Start:</span>
            {` ${temporalStart && new Date(temporalStart).toISOString()}`}
          </div>

          <div>
            <span className="demo__metadata-label">Temporal End:</span>
            {` ${temporalEnd && new Date(temporalEnd).toISOString()}`}
          </div>

          <div>
            <span className="demo__metadata-label">Focused Start:</span>
            {` ${focusedStart && new Date(focusedStart).toISOString()}`}
          </div>

          <div>
            <span className="demo__metadata-label">Focused End:</span>
            {` ${focusedEnd && new Date(focusedEnd).toISOString()}`}
          </div>
        </section>
      </section>

      <GithubCorner href="https://github.com/nasa/edsc-timeline" />
    </>
  )
}

render(<App />, document.getElementById('root'))
