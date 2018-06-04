const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, data, options) {
    if(!options) options = {...baseOptions}
    const {body, status} = await request.post(urlPathes.cookieOne(sessionId), JSON.stringify(data), options)
    return body
  }
}