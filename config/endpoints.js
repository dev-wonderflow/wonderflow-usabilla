const createEndpoint = (path) => ({ id } = {}) => {
  const [product, resource, nested = 'list'] = path

  const endpoints = {
    websites: {
      buttons: {
        list: '/live/websites/button',
        feedback: `/live/websites/button/${id}/feedback`
      },
      campaigns: {
        list: '/live/websites/campaign',
        results: `/live/websites/campaign/${id}/results`,
        stats: `/live/websites/campaign/${id}/stats`
      },
      inpage: {
        list: '/live/websites/inpage',
        feedback: `/live/websites/inpage/${id}/feedback`
      }
    },
    email: {
      widgets: {
        list: '/live/email/button',
        feedback: `/live/email/button/${id}/feedback`
      }
    },
    apps: {
      forms: {
        list: '/live/apps',
        feedback: `/live/apps/${id}/feedback`
      },
      campaigns: {
        list: '/live/apps/campaign',
        results: `/live/apps/campaign/${id}/results`
      }
    }
  }

  return endpoints[product][resource][nested]
}

module.exports = {
  createEndpoint
}
