import React from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import { Playground } from './components/Playground/Playground'
import { ExamplesIndex } from './components/Examples/ExamplesIndex'

const App = () => (
  <Router basename={process.env.PUBLIC_URL}>
    <Switch>
      <Route path="/examples" component={ExamplesIndex} />
      <Route exact path="/" component={Playground} />
    </Switch>
  </Router>
)

render(<App />, document.getElementById('root'))
