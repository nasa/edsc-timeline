import React from 'react'
import { render } from 'react-dom'
import {
  HashRouter as Router,
  Switch,
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
      <Switch>
        <Route path="/empty" component={EmptyTimeline} />
        <Route path="/temporalRange" component={TemporalRange} />
        <Route path="/temporalStart" component={TemporalStart} />
        <Route path="/temporalEnd" component={TemporalEnd} />
        <Route path="/callbacks" component={Callbacks} />
        <Route exact path="/" component={Playground} />
      </Switch>

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

render(<App />, document.getElementById('root'))
