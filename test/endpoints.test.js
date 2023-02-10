const test = require('ava')
const { createEndpoint } = require('../config/endpoints')

test('createEndpoint: should return all the expected endpoint functions', (t) => {
  const id = 'myId'
  let endpoint

  endpoint = createEndpoint(['websites', 'buttons'])
  t.is(endpoint(), '/live/websites/button')

  endpoint = createEndpoint(['websites', 'buttons', 'feedback'])
  t.is(endpoint({ id }), '/live/websites/button/myId/feedback')

  endpoint = createEndpoint(['websites', 'campaigns'])
  t.is(endpoint(), '/live/websites/campaign')

  endpoint = createEndpoint(['websites', 'campaigns', 'results'])
  t.is(endpoint({ id }), '/live/websites/campaign/myId/results')

  endpoint = createEndpoint(['websites', 'campaigns', 'stats'])
  t.is(endpoint({ id }), '/live/websites/campaign/myId/stats')

  endpoint = createEndpoint(['websites', 'inpage'])
  t.is(endpoint(), '/live/websites/inpage')

  endpoint = createEndpoint(['websites', 'inpage', 'feedback'])
  t.is(endpoint({ id }), '/live/websites/inpage/myId/feedback')

  endpoint = createEndpoint(['email', 'widgets'])
  t.is(endpoint(), '/live/email/button')

  endpoint = createEndpoint(['email', 'widgets', 'feedback'])
  t.is(endpoint({ id }), '/live/email/button/myId/feedback')

  endpoint = createEndpoint(['apps', 'forms'])
  t.is(endpoint(), '/live/apps')

  endpoint = createEndpoint(['apps', 'forms', 'feedback'])
  t.is(endpoint({ id }), '/live/apps/myId/feedback')

  endpoint = createEndpoint(['apps', 'campaigns'])
  t.is(endpoint(), '/live/apps/campaign')

  endpoint = createEndpoint(['apps', 'campaigns', 'results'])
  t.is(endpoint({ id }), '/live/apps/campaign/myId/results')
})
