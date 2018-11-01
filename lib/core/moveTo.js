const getLocalEnv = require('./env')

const {baseOptions,  urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementOrPosition, options) {
    if(!options) options = {...baseOptions}
    if(elementOrPosition.x || elementOrPosition.x) {
      elementOrPosition = {xoffset: elementOrPosition.x, yoffset: elementOrPosition.y}
    }
    const {status, body} = await request.post(urlPathes.moveto(sessionId), JSON.stringify({...elementOrPosition}), options)
    return body
  }
}
