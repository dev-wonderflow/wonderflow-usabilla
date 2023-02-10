const test = require('ava')
const { getDateTime, hmac, hash, getCanonicalHeaders, getCanonicalString, stringToSign, getSignature, Signature } = require('../lib/signature')

const headers = {
  host: 'localhost:8081',
  connection: 'keep-alive',
  'cache-control': 'max-age=0',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36',
  'accept-encoding': 'gzip, deflate, sdch',
  'accept-language': 'en-US,en;q=0.8,et;q=0.6'
}

const dates = {
  longdate: '20230201T170132Z',
  shortdate: '20230201'
}

test('getDateTime: should return an object with the current date in long and short format', t => {
  const { longdate, shortdate } = getDateTime()
  const shortFormat = /\d{8}/
  const longFormat = /\d{8}T\d{6}Z/

  t.true(shortFormat.test(shortdate))
  t.true(longFormat.test(longdate))
})

test('hmac: should return an HMAC for a given key, string, and encoding', t => {
  const result = hmac('123', 'myString', 'hex')
  t.is(result, 'e6b44a67d0d19c23272d4112b8cb69ccad8b53a0f9c6b80160d21a45b6ae5378')
})

test('hash: should return an hash for a given key, string, and encoding', t => {
  const result = hash('123', 'myString', 'hex')
  t.is(result.toString('hex'), 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3')
})

test('getCanonicalHeaders: should return the headers in canonical form', t => {
  const result = getCanonicalHeaders(headers)
  const expected = 'accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\naccept-encoding:gzip, deflate, sdch\naccept-language:en-US,en;q=0.8,et;q=0.6\ncache-control:max-age=0\nconnection:keep-alive\nhost:localhost:8081\nupgrade-insecure-requests:1\nuser-agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36\n'

  t.is(result, expected)
})

test('getCanonicalString: should return a well formatted canonical string', t => {
  const result = getCanonicalString('google.com', headers)
  const expected = `GET
google.com

accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
accept-encoding:gzip, deflate, sdch
accept-language:en-US,en;q=0.8,et;q=0.6
cache-control:max-age=0
connection:keep-alive
host:localhost:8081
upgrade-insecure-requests:1
user-agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36

accept;accept-encoding;accept-language;cache-control;connection;host;upgrade-insecure-requests;user-agent
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

  t.is(result, expected)
})

test('stringToSign: should return the right string to be signed', t => {
  const result = stringToSign('google.com', headers, dates)
  const expected = 'USBL1-HMAC-SHA256\n20230201T170132Z\n20230201/usbl1_request\n1286e2a07f985b29c93bf224a2cebc2a63fe277d846835a7a97ea48025641845'

  t.is(result, expected)
})

test('getSignature: should return the corresponding signature in response to the parameters', t => {
  const result = getSignature('pippo', dates, 'usabilla.com', headers)
  const expected = 'a4e3776fc99000ef64bdfcf25ea3ad3173e5af885c5e6b0ab786541a99f5823e'

  t.is(result, expected)
})

test('the Signature.sign method should produce a valid signature for a given url', t => {
  const signatureFactory = new Signature('accessKey', 'secretKey')
  const { Authorization, host, 'x-usbl-date': xUsblDate } = signatureFactory.sign('pippo.com')

  t.true(/USBL1-HMAC-SHA256 Credential/.test(Authorization))
  t.true(/SignedHeaders=host;x-usbl-date,/.test(Authorization))
  t.true(/Signature/.test(Authorization))

  t.is(host, 'data.usabilla.com')

  t.true(/\d{8}T\d{6}Z/.test(xUsblDate))
})
