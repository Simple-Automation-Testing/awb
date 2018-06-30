const getLocalEnv = require('../env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, payloads, options) {

    if(!options) options = {...baseOptions}

    const {body} = await request.post(urlPathes.touchDoubleClick(sessionId), JSON.stringify(payloads), options)

    return body
  }
}