import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

import GithubCorner from 'react-github-corner'

import Layout from './components/Layout/Layout'

import { Callbacks } from './components/Examples/Callbacks'
import { EmptyTimeline } from './components/Examples/EmptyTimeline'
import { Playground } from './components/Playground/Playground'
import { TemporalEnd } from './components/Examples/TemporalEnd'
import { TemporalRange } from './components/Examples/TemporalRange'
import { TemporalStart } from './components/Examples/TemporalStart'

import 'bootstrap/dist/css/bootstrap.min.css'

const App = () => (
  <>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Playground />} />
          <Route path="empty" element={<EmptyTimeline />} />
          <Route path="temporalRange" element={<TemporalRange />} />
          <Route path="temporalStart" element={<TemporalStart />} />
          <Route path="temporalEnd" element={<TemporalEnd />} />
          <Route path="callbacks" element={<Callbacks />} />
        </Route>
      </Routes>
    </Router>

    <GithubCorner href="https://github.com/nasa/edsc-timeline" />
  </>
)

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<App />)
