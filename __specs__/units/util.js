const fetchy = require('../../lib/fetchy')

const baseRequestUrl = 'http://localhost:4444/'
const timeout = 2500

const baseRequest = {
  get: fetchy.bind(fetchy, "GET", baseRequestUrl, timeout),
  post: fetchy.bind(fetchy, "POST", baseRequestUrl, timeout),
  put: fetchy.bind(fetchy, "PUT", baseRequestUrl, timeout),
  del: fetchy.bind(fetchy, "DELETE", baseRequestUrl, timeout)
}

module.exports = {
  baseRequest, baseRequestUrl
}
