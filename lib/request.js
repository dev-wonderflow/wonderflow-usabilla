const dns = require('node:dns')
dns.setDefaultResultOrder('ipv4first')

const get = async (path, options) => {
  const { protocol, host, headers } = options
  const url = `${protocol}://${host}/${path}`
  const parameters = {
    method: 'GET',
    headers
  }

  try {
    const response = await fetch(url, parameters)
    const json = await response.json()

    if (json.error) {
      throw new Error(json.error, { cause: `Error while performing the request: statusCode ${json.error.status} - ${json.error.message}` })
    }
    
    return json
  } catch ({ cause }) {
    throw new Error(cause)
  }
}

module.exports = {
  get
}
