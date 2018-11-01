const getLocalEnv = require('./env')

const {baseOptions,  urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, nameHandle, options) {

    if(!options) options = {...baseOptions}

    const {body} = await request.post(urlPathes.window(sessionId), JSON.stringify({
      name: nameHandle, handle: nameHandle
    }), options)

    return body
  }
}