import './index.css'

import React from 'react'
import ReactDOM, {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
} from 'react-dom'
import App from './App'

import Segment from '@segment/analytics.js-react'
import { BrowserRouter as Router } from 'react-router-dom'

import Mixpanel from '@segment/analytics.js-integration-mixpanel'
console.log({ __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED })
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Segment
        writeKey={'rLNeLldLBz1tJ9jOjTGeU8hEQywSaFhS'}
        autoTrackPages
        integrations={[Mixpanel]}
      >
        <App />
      </Segment>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
