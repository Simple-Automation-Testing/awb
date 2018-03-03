const getLocalEnv = require('../env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = function (request) {
  return async function (sessionId, payloads, options) {

    if (!options) options = { ...baseOptions }

    const { body, status } = await request.post(urlPathes.touchMultiPerform(sessionId), JSON.stringify(payloads), options)

    return body
  }
}