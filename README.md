# analytics.js-react

> Analytics.js for React

[![NPM](https://img.shields.io/npm/v/analytics.js-react.svg)](https://www.npmjs.com/package/@segment/analytics.js-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @segment/analytics.js-react
```

or

```
yarn add @segment/analytics.js-react
```

## Usage

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import Segment from '@segment/analytics.js-react'
import Mixpanel from '@segment/analytics.js-integration-mixpanel'

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
```

## Props

### `writeKey`

The writeKey for a javascript Segment source.

### `useCDN`

(optional) if it is set to `true`, then the library uses the CDN version of `analytics.js` instead of the version from the npm. This has few implications:

- CDN version adds `analytics` to the global context
- CDN version requires the trasfer of full `analytics.min.js` bundle.

### `integrations`

(optional) only if using the non-cdn mode. You should pass all the device-mode integrations that need to be used as an array. For example:

```javascript
import Mixpanel from '@segment/analytics.js-integration-mixpanel'
import Amplitude from '@segment/analytics.js-integration-amplitude'
...
  <Segment
    writeKey={'<...>'}
    integrations={[Mixpanel, Amplitude]}
  >
...
```

This is not required if you are using CDN mode.

### `autoTrackPages`

If the app uses `react-router`, setting this prop to `true` will automatically send `page` calls on all route changes.

## License

analytics.js-react is released under the MIT license.

Copyright © 2020, Segment.io, Inc.
