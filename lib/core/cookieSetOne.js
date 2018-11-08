const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, data, options) {
    if(!options) options = {...baseOptions}
    const {body} = await request.post(urlPathes.cookie(sessionId), JSON.stringify(data), options)
    return body
  }
}