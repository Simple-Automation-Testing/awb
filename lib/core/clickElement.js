const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementId, button = {button: 0}, options) {
    if(!options) options = {...baseOptions}
    const {body} = await request.post(urlPathes.clickElement(sessionId, elementId), JSON.stringify(button), options)
    return body
  }
}
