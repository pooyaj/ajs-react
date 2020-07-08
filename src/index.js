import SegmentIntegration from '@segment/analytics.js-integration-segmentio'
import * as React from 'react'
import { useLocation } from 'react-router-dom'
import {
  loadAnalyticsWithSnippet,
  loadAnalyticsWithNpm,
  stubMethods
} from './utils'

const AnalyticsContext = React.createContext({
  initialized: false,
  analytics: {}
})

const Segment = ({
  children,
  writeKey,
  autoTrackPages,
  useCDN,
  integrations,
  ...props
}) => {
  const ajsQ = React.useRef([])

  const [ajs, setAJS] = React.useState({
    initialized: false,
    analytics: stubMethods.reduce((acc, key) => {
      acc[key] = (...args) => (ajsQ.current = [...ajsQ.current, [key, ...args]])
      return acc
    }, {})
  })

  const location = useLocation()

  React.useEffect(() => {
    // initialize the library
    if (useCDN) {
      loadAnalyticsWithSnippet(writeKey, (analytics) =>
        setAJS({ initialized: true, analytics })
      )
    } else {
      loadAnalyticsWithNpm(
        writeKey,
        [SegmentIntegration, ...integrations],
        ajsQ
      ).then((analytics) => setAJS({ initialized: true, analytics }))
    }
  }, [writeKey])

  React.useEffect(() => {
    autoTrackPages && ajs.analytics.page()
  }, [location])

  return (
    <AnalyticsContext.Provider
      value={ajs}
      onClick={(e) => console.log('parent', e)}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export const useAJS = () => {
  const { analytics } = React.useContext(AnalyticsContext)

  return analytics
}

export const usePage = (pageName) => {
  const { analytics } = React.useContext(AnalyticsContext)
  React.useEffect(() => {
    analytics.page(pageName)
  }, [])
}

export default Segment
