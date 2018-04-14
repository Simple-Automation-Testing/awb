const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, keys, options) {

    if(!options) options = {...baseOptions}

    if(!Array.isArray(keys)) {
      keys = [keys]
    }
    const {body, status} = await request.post(urlPathes.pressKeys(sessionId), JSON.stringify({value: keys}), options)

    return body
  }
}