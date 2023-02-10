const DEFAULT_API_OPTIONS = require('../config/options.json')
const { createEndpoint } = require('../config/endpoints')

const request = require('./request')
const { Signature } = require('./signature')
const { types: { isProxy } } = require('node:util')

class Client {
  #signatureFactory
  options

  async handleRequests (endpoint, params) {
    const endpointFunction = createEndpoint(endpoint)
    const path = endpointFunction(params)

    const headers = this.#signatureFactory.sign(path)
    const { items } = await request.get(path, { ...this.options, headers })

    return items
  }

  createDeepProxy = (stack, target) => {
    return new Proxy(target, {
      get: (target, key) => {
        const prop = target[key] || {}

        if (key === 'get') {
          return (params) => this.handleRequests(stack, params)
        }

        if (key !== 'options' && !isProxy(prop) && typeof prop === 'object') {
          return this.createDeepProxy([...stack, key], prop)
        }

        return prop
      }
    })
  }

  constructor (accessKey, secretKey, options) {
    if (!accessKey || !secretKey) {
      throw new Error('Cannot create a client without access key and private key')
    }

    this.#signatureFactory = new Signature(accessKey, secretKey)
    this.options = { ...DEFAULT_API_OPTIONS, ...options }

    return this.createDeepProxy([], this)
  }
}

module.exports = Client
