const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementId, options) {

    if(!options) options = {...baseOptions}
    console.log(sessionId, elementId, 'is displayed')
    const {body, status} = await request.get(urlPathes.displayed(sessionId, elementId), null, options)

    return body
  }
}