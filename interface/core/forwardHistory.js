const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = function name(request) {
  return async function (sessionId, options) {

    if (!options) options = { ...baseOptions }

    const { body, status } = await request.post(urlPathes.forward(sessionId), undefined, options)

    return body
  }
} 
