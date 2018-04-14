const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, timeouts = {}, options) {

    if(!options) options = {...baseOptions}
    //'script', 'implicit', 'page load'
    const keys = Object.keys(timeouts)

    for(const key of keys) {
      const {status, body} = await request.post(urlPathes.timeouts(sessionId), JSON.stringify({
        type: key,
        ms: timeouts[key]
      }), options)

    }
  }
}