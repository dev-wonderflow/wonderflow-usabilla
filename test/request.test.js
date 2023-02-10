const test = require('ava')
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
