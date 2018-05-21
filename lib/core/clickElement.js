const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementId, button = {button: 0}, options) {

    if(!options) options = {...baseOptions}
    console.log(button)

    const {body, status} = await request.post(urlPathes.click(sessionId, elementId), JSON.stringify(button), options)

    return body
  }
}
