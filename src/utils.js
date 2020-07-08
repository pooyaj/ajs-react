import Analytics from '@segment/analytics.js-core/build/analytics'
export const stubMethods = [
  'trackSubmit',
  'trackClick',
  'trackLink',
  'trackForm',
  'pageview',
  'identify',
  'reset',
  'group',
  'track',
  'ready',
  'alias',
  'debug',
  'page',
  'once',
  'off',
  'on',
  'addSourceMiddleware',
  'addIntegrationMiddleware',
  'setAnonymousId',
  'addDestinationMiddleware'
]
export const loadAnalyticsWithSnippet = (writeKey, cb) => {
  // Create a queue, but don't obliterate an existing one!
  var analytics = (window.analytics = window.analytics || [])

  // If the real analytics.js is already on the page return.
  if (analytics.initialize) return

  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error('Segment snippet included twice.')
    }
    return
  }

  // Invoked flag, to make sure the snippet
  // is never invoked twice.
  analytics.invoked = true

  // A list of the methods in Analytics.js to stub.
  analytics.methods = [...stubMethods]

  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function (method) {
    return function () {
      var args = Array.prototype.slice.call(arguments)
      args.unshift(method)
      analytics.push(args)
      return analytics
    }
  }

  // For each of our methods, generate a queueing stub.
  for (var i = 0; i < analytics.methods.length; i++) {
    var key = analytics.methods[i]
    analytics[key] = analytics.factory(key)
  }

  // Define a method to load Analytics.js from our CDN,
  // and that will be sure to only ever load it once.
  analytics.load = function (key, options) {
    // Create an async script element based on your key.
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src =
      'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js'

    // Insert our script next to the first script element.
    var first = document.getElementsByTagName('script')[0]
    first.parentNode.insertBefore(script, first)
    analytics._loadOptions = options
  }
  // set the stub analytics
  cb(analytics)
  analytics.load(writeKey)
  // on-ready, set the updated analytics
  analytics.ready(() => cb(window.analytics))
  return analytics
}

export async function loadAnalyticsWithNpm(writeKey, integrationModules, ajsQ) {
  const settingsResponse = await fetch(
    `https://cdn.segment.com/v1/projects/${writeKey}/settings`
  ).then((response) => response.json())
  const integrations = await fetch(
    `https://cdn.segment.com/v1/projects/${writeKey}/integrations`
  ).then((response) => response.json())

  // TODO, fix
  const enabledIntegrations = integrations.map((it) => it.name)
  const trackingPlanSettings = settingsResponse.plan

  const integrationSettings = settingsResponse.integrations
  integrationSettings['Segment.io'].addBundledMetadata = true
  // TODO, we need to exclude integrations in the cloud mode
  integrationSettings['Segment.io'].unbundledIntegrations = [] // enabledIntegrations

  const analytics = new Analytics()
  integrationModules.forEach((m) => analytics.use(m))

  analytics.initialize(integrationSettings, {
    plan: trackingPlanSettings,
    metrics: { sampleRate: 0.1 }
  })

  const currentQueue = ajsQ.current
  // Apply the queue
  while (currentQueue && currentQueue.length > 0) {
    const args = currentQueue.shift()
    const method = args.shift()

    if (typeof analytics[method] === 'function') {
      analytics[method].apply(analytics, args)
    }
  }

  return analytics
}
