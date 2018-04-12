const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = function (request) {

  return async function (sessionId, elementId, attribute, options) {

    if (!options) options = { ...baseOptions }

    const { status, body } = await request.get(urlPathes.attribute(sessionId, elementId, attribute), null, options)

    return body
  }
} 