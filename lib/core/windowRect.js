const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, options) {
    if(!options) options = {...baseOptions}
    const {body} = await request.get(urlPathes.currentWindowRect(sessionId), undefined, options)
    return body
  }
}
