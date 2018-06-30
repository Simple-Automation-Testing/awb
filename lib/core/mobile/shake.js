const getLocalEnv = require('../env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, options) {

    if(!options) options = {...baseOptions}

    const {body} = await request.post(urlPathes.shake(sessionId), undefined, options)

    return body
  }
}