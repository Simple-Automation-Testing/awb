const getLocalEnv = require('./env')

const {baseOptions,  urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, name, options) {
    if(!options) options = {...baseOptions}
    const {body} = await request.del(urlPathes.cookieOne(sessionId, name), undefined, options)
    return body
  }
}