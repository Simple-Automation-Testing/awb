const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = function (request) {
  return async function (sessionId, button = { button: 0 }, options) {

    if (!options) options = { ...baseOptions }

    const { body, status } = await request.post(urlPathes.buttonUp(sessionId), JSON.stringify({ button }), options)
    
    return body
  }
} 