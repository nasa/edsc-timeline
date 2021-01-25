import React from 'react'
import { render } from 'react-dom'
import GithubCorner from 'react-github-corner'

import EDSCTimeline from '../../src'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

const App = () => {
  return (
    <>
      <h1>
        EDSC Timeline React Plugin Demo
      </h1>

      <EDSCTimeline />

      <GithubCorner href="https://github.com/nasa/edsc-timeline" />
    </>
  )
}

render(<App />, document.getElementById('root'))
