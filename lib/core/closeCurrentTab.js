const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, options) {
    if(!options) options = {...baseOptions}
    const {body} = await request.del(urlPathes.window(sessionId), undefined, options)
    return body
  }
}