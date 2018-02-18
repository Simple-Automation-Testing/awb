const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = function (request) {
  return async function (sessionId, rect, options) {

    if (!options) options = { ...baseOptions }

    const { body, status } = await request.post(urlPathes.currentSize(sessionId), JSON.stringify(rect), options)

    return body

  }
} 