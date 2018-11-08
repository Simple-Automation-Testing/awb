const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, keys, options) {
    if(!options) options = {...baseOptions}
    if(!Array.isArray(keys)) {
      keys = [keys]
    }
    const {body} = await request.post(urlPathes.pressKeys(sessionId), JSON.stringify({value: keys}), options)
    return body
  }
}