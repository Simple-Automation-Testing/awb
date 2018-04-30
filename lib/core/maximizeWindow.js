const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, rect, options) {

    if(!options) options = {...baseOptions}

    const {body} = await request.post(urlPathes.maximize(sessionId), undefined, options)

    return body
  }
}
