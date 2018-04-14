const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function minimizeWindow(sessionId, rect, options) {

    if(!options) options = {...baseOptions}

    // have issue with selenium
    const {body, status} = await request.post(urlPathes.minimize(sessionId), undefined, options)

    return body
  }
}
