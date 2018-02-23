const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = function (request) {

  return async function (sessionId, elementId, options) {

    if (!options) options = { ...baseOptions }

    const { status, body } = await request.get(urlPathes.elementLocationInView(sessionId, elementId), null, options)

    return body
  }
} 