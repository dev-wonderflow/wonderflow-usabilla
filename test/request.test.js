const test = require('ava')
const sinon = require('sinon')

const request = require('../lib/request')

const options = {
  protocol: 'https',
  host: 'jsonplaceholder.typicode.com',
  headers: {}
}

test('request client should perform a fetch request with the right parameters when invoked', async t => {
  const { userId, id, title, completed } = await request.get('todos/1', options)

  t.is(userId, 1)
  t.is(id, 1)
  t.is(title, 'delectus aut autem')
  t.is(completed, false)
})

test('request throws an error with a message when it fails', async t => {
  await t.throwsAsync(async () => {
    await request.get('', {})
  }, { instanceOf: Error, message: 'Error: unknown scheme' })
})

test('request throws when fetch returns an error', async t => {
  const fetchStub = sinon.stub(global, 'fetch').resolves(
    new global.Response(JSON.stringify({
      error: {
        type: 'Sender',
        code: 'TooManyRequests',
        message: 'Request limit reached, please contact your Usabilla account manager.',
        status: 429
      }
    }), {
      status: 429,
      statusText: 'Too Many Requests'
    }))

  const err = await t.throwsAsync(() => request.get('button', options))
  t.is(err.message, 'Error while performing the request: statusCode 429 - Request limit reached, please contact your Usabilla account manager.')

  fetchStub.restore()
})
