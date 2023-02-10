const test = require('ava')
const sinon = require('sinon')

const Usabilla = require('../lib/client')
const request = require('../lib/request')

test.before((t) => {
  const stub = sinon
    .stub(request, 'get')
    .resolves({
      items: ['a', 'b', 'c']
    })

  t.context = {
    stub
  }
})

test.beforeEach((t) => {
  const { stub } = t.context
  stub.resetHistory()
})

test.after((t) => {
  const { stub } = t.context
  stub.restore()
})

test('it creates the client class correctly, with default options', t => {
  const usabilla = new Usabilla('a', 'p')

  t.is(typeof usabilla, 'object')
  t.true(usabilla instanceof Usabilla)

  const { options } = usabilla

  t.deepEqual(options, {
    host: 'data.usabilla.com',
    protocol: 'https'
  })
})

test('it creates the client class correctly, with custom options', t => {
  const usabilla = new Usabilla('accessKey', 'privateKey', { protocol: 'http', newKey: 'newVal' })

  t.is(typeof usabilla, 'object')
  t.true(usabilla instanceof Usabilla)

  const { options } = usabilla

  t.deepEqual(options, {
    host: 'data.usabilla.com',
    newKey: 'newVal',
    protocol: 'http'
  })
})

test('client should return an error if accesskey and privatekey are missing', t => {
  t.throws(function () {
    /* eslint-disable-next-line */
    new Usabilla()
  }, { message: 'Cannot create a client without access key and private key' })
})

test('client should return the api-response from usabilla', async t => {
  const { stub } = t.context
  const usabilla = new Usabilla('a', 'p')

  const items = await usabilla.websites.buttons.get()
  t.deepEqual(items, ['a', 'b', 'c'])

  const { args: [path, { headers, host, protocol }] } = stub.getCall(0)

  t.is(path, '/live/websites/button')

  t.truthy(headers.Authorization)
  t.is(headers.host, 'data.usabilla.com')
  t.truthy(headers['x-usbl-date'])
  t.is(host, 'data.usabilla.com')
  t.is(protocol, 'https')
})

test('client should expose all the expected endpoints interfaces', t => {
  const usabilla = new Usabilla('a', 'p')

  t.is(typeof usabilla.websites.buttons.get, 'function')
  t.is(typeof usabilla.websites.buttons.feedback.get, 'function')

  t.is(typeof usabilla.websites.campaigns.get, 'function')
  t.is(typeof usabilla.websites.campaigns.results.get, 'function')
  t.is(typeof usabilla.websites.campaigns.stats.get, 'function')

  t.is(typeof usabilla.websites.inpage.get, 'function')
  t.is(typeof usabilla.websites.inpage.feedback.get, 'function')

  t.is(typeof usabilla.email.widgets.get, 'function')
  t.is(typeof usabilla.email.widgets.feedback.get, 'function')

  t.is(typeof usabilla.apps.forms.get, 'function')
  t.is(typeof usabilla.apps.forms.feedback.get, 'function')

  t.is(typeof usabilla.apps.campaigns.get, 'function')
  t.is(typeof usabilla.apps.campaigns.results.get, 'function')
})

test('client endpoints should get the right parameters and return well-formed objects', async t => {
  const { stub } = t.context
  const usabilla = new Usabilla('a', 'p')
  let result

  await usabilla.websites.buttons.get()
  result = stub.getCall(0)
  t.is(result.args[0], '/live/websites/button')

  await usabilla.websites.buttons.feedback.get({ id: 1 })
  result = stub.getCall(1)
  t.is(result.args[0], '/live/websites/button/1/feedback')

  await usabilla.websites.campaigns.get()
  result = stub.getCall(2)
  t.is(result.args[0], '/live/websites/campaign')
  await usabilla.websites.campaigns.results.get({ id: 1 })
  result = stub.getCall(3)
  t.is(result.args[0], '/live/websites/campaign/1/results')
  await usabilla.websites.campaigns.stats.get({ id: 1 })
  result = stub.getCall(4)
  t.is(result.args[0], '/live/websites/campaign/1/stats')

  await usabilla.websites.inpage.get()
  result = stub.getCall(5)
  t.is(result.args[0], '/live/websites/inpage')
  await usabilla.websites.inpage.feedback.get({ id: 1 })
  result = stub.getCall(6)
  t.is(result.args[0], '/live/websites/inpage/1/feedback')

  await usabilla.email.widgets.get()
  result = stub.getCall(7)
  t.is(result.args[0], '/live/email/button')
  await usabilla.email.widgets.feedback.get({ id: 1 })
  result = stub.getCall(8)
  t.is(result.args[0], '/live/email/button/1/feedback')

  await usabilla.apps.forms.get()
  result = stub.getCall(9)
  t.is(result.args[0], '/live/apps')
  await usabilla.apps.forms.feedback.get({ id: 1 })
  result = stub.getCall(10)
  t.is(result.args[0], '/live/apps/1/feedback')

  await usabilla.apps.campaigns.get()
  result = stub.getCall(11)
  t.is(result.args[0], '/live/apps/campaign')
  await usabilla.apps.campaigns.results.get({ id: 1 })
  result = stub.getCall(12)
  t.is(result.args[0], '/live/apps/campaign/1/results')
})
