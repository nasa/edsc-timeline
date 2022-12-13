import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  HashRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom'
import GithubCorner from 'react-github-corner'

import { Callbacks } from './components/Examples/Callbacks'
import { EmptyTimeline } from './components/Examples/EmptyTimeline'
import { Playground } from './components/Playground/Playground'
import { TemporalEnd } from './components/Examples/TemporalEnd'
import { TemporalRange } from './components/Examples/TemporalRange'
import { TemporalStart } from './components/Examples/TemporalStart'

const App = () => (
  <>
    <section className="container">
      <h1>
        EDSC Timeline React Plugin Demo
      </h1>
    </section>

    <Router>
      <Routes>
        <Route exact path="/" element={<Playground />} />
        <Route path="/empty" element={<EmptyTimeline />} />
        <Route path="/temporalRange" element={<TemporalRange />} />
        <Route path="/temporalStart" element={<TemporalStart />} />
        <Route path="/temporalEnd" element={<TemporalEnd />} />
        <Route path="/callbacks" element={<Callbacks />} />
      </Routes>

      <div className="container demo__navigation">
        <h3>Additional Examples</h3>
        <ul className="">
          <li>
            <Link to="/">Full Example</Link>
          </li>
          <li>
            <Link to="/empty">Empty Timeline</Link>
          </li>
          <li>
            <Link to="/temporalRange">Timeline with a temporal range</Link>
          </li>
          <li>
            <Link to="/temporalStart">Timeline with a only a temporal start</Link>
          </li>
          <li>
            <Link to="/temporalEnd">Timeline with a only a temporal end</Link>
          </li>
          <li>
            <Link to="/callbacks">Timeline with all callbacks logged</Link>
          </li>
        </ul>
      </div>
    </Router>

    <GithubCorner href="https://github.com/nasa/edsc-timeline" />
  </>
)

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<App />)
