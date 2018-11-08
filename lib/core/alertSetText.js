const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, text, options) {

    if(!options) options = {...baseOptions}
    const {body} = await request.post(urlPathes.textAllert(sessionId), {
      text
    }, options)
    return body
  }
}
