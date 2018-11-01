const getLocalEnv = require('./env')

const {baseOptions,  urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, windowId, options) {

    if(!options) options = {...baseOptions}
    const {body} = await request.get(urlPathes.windowSize(sessionId, windowId), null, options)
    return body
  }
}