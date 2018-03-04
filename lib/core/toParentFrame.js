const { WEB_EMENET_ID } = require('../util')

const getLocalEnv = require('./env')

const { baseOptions, urlPathes } = getLocalEnv()

module.exports = function (request) {
  return async function (sessionId, elementId, options) {

    if (!options) options = { ...baseOptions }

    const requestBody = { id: null }

    const { body, status } = await request.post(urlPathes.parentFrame(sessionId), JSON.stringify(requestBody), options)

    return body
  }
} 
