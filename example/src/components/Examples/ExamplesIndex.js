import React from 'react'
import {
  Link,
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom'

import { EmptyTimeline } from './EmptyTimeline'
import { TemporalRange } from './TemporalRange'
import { TemporalStart } from './TemporalStart'
import { TemporalEnd } from './TemporalEnd'

export const ExamplesIndex = () => {
  const { path, url } = useRouteMatch()

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <nav>
            <ul>
              <li>
                <Link to={`${url}/empty`}>Empty Timeline</Link>
              </li>
              <li>
                <Link to={`${url}/temporalRange`}>Timeline with a temporal range</Link>
              </li>
              <li>
                <Link to={`${url}/temporalStart`}>Timeline with a only a temporal start</Link>
              </li>
              <li>
                <Link to={`${url}/temporalEnd`}>Timeline with a only a temporal end</Link>
              </li>
            </ul>
          </nav>
        </Route>
        <Route path={`${path}/empty`} component={EmptyTimeline} />
        <Route path={`${path}/temporalRange`} component={TemporalRange} />
        <Route path={`${path}/temporalStart`} component={TemporalStart} />
        <Route path={`${path}/temporalEnd`} component={TemporalEnd} />
      </Switch>
    </div>
  )
}
