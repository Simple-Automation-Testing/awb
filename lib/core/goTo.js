const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = function (request) {
  return async function (sessionId, url, options) {

    if (!options) options = { ...baseOptions }
    const { body, status } = await request.post(urlPathes.url(sessionId), JSON.stringify({
      url
    }), options)

    return body
  }
}
