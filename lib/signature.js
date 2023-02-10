const { host } = require('../config/options.json')
const crypto = require('crypto')

const HMAC = 'sha256'
const INPUT_ENCODING = 'utf8'

const getDateTime = () => {
  const date = new Date().toJSON().replace(/[-:.]/g, '')

  return {
    shortdate: date.substr(0, 8),
    longdate: `${date.substr(0, 15)}Z`
  }
}

const hmac = (key, string, encoding) => {
  return crypto
    .createHmac(HMAC, key)
    .update(string, INPUT_ENCODING)
    .digest(encoding)
}

const hash = (string, encoding) => {
  return crypto
    .createHash(HMAC)
    .update(string, INPUT_ENCODING)
    .digest(encoding)
}

const getCanonicalHeaders = (headers) => {
  return Object.entries(headers)
    .sort()
    .map(e => `${e[0]}:${e[1]}`)
    .join('\n') +
    '\n'
}

const getCanonicalString = (path, headers) => {
  return `GET\n${path}\n\n${getCanonicalHeaders(headers)}\n${Object.keys(headers).sort().join(';')}\n${hash('', 'hex')}`
}

const stringToSign = (path, headers, dates) => {
  return `USBL1-HMAC-SHA256\n${dates.longdate}\n${dates.shortdate}/usbl1_request\n${hash(getCanonicalString(path, headers), 'hex')}`
}

const getSignature = (secretKey, dates, path, headers) => {
  const kDate = hmac(`USBL1${secretKey}`, dates.shortdate)
  const kSigning = hmac(kDate, 'usbl1_request')
  return hmac(kSigning, stringToSign(path, headers, dates), 'hex')
}

class Signature {
  #accessKey
  #secretKey

  constructor (accessKey, secretKey) {
    this.#accessKey = accessKey
    this.#secretKey = secretKey
  }

  sign (path) {
    const dates = getDateTime()

    const headers = {
      'x-usbl-date': dates.longdate,
      host
    }

    headers.Authorization = `USBL1-HMAC-SHA256 Credential=${this.#accessKey}/${dates.shortdate}/usbl1_request, SignedHeaders=${Object.keys(headers).sort().join(';')}, Signature=${getSignature(this.#secretKey, dates, path, headers)}`

    return headers
  }
}

module.exports = {
  Signature,
  getDateTime,
  hmac,
  hash,
  getCanonicalHeaders,
  getCanonicalString,
  stringToSign,
  getSignature
}
