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

    return json
  } catch ({ cause }) {
    throw new Error(cause)
  }
}

module.exports = {
  get
}
