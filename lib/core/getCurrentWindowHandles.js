const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function name(request) {
  return async function(sessionId, options) {

    if(!options) options = {...baseOptions}

    const {body, status} = await request.get(urlPathes.windowHandles(sessionId), null, options)

    return body
  }
}