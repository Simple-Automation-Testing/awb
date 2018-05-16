const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementId, options) {

    if(!options) options = {...baseOptions}
    const {body} = await request.post(urlPathes.doubleclick(sessionId), null, options)
    return body
  }
}
