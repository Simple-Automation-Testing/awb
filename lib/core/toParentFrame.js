const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, options) {
    if(!options) options = {...baseOptions}
    const requestBody = {id: null}
    const {body} = await request.post(urlPathes.parentFrame(sessionId), JSON.stringify(requestBody), options)
    return body
  }
}
