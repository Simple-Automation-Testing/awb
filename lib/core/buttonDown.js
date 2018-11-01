const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, element = {button: 0}/*element can be css selector or elementId*/, position, options) {

    if(!options) options = {...baseOptions}

    const {status, body} = await request.post(urlPathes.buttonDown(sessionId), JSON.stringify({element}), options)

    return body
  }
}
