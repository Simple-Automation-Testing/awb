const getLocalEnv = require('../env')

const {baseOptions,  urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, options) {

    if(!options) options = {...baseOptions}

    const {body} = await request.post(urlPathes.rotate(sessionId), undefined, options)

    return body
  }
}