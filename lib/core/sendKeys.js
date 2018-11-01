const getLocalEnv = require('./env')
const {assertArray, assertNumber} = require('../util')

const {baseOptions,  urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementId, keysToSend, options) {

    let text = null
    if(!options) options = {...baseOptions}

    if(assertNumber(keysToSend)) {
      text = keysToSend.toString()
      keysToSend = keysToSend.toString().split('')
    } else if(!assertArray(keysToSend)) {
      text = keysToSend
      keysToSend = keysToSend.split('')
    } else {
      text = keysToSend.join('')
      keysToSend = keysToSend
    }
    const {body} = await request.post(urlPathes.sendKeys(sessionId, elementId), JSON.stringify({
      text,
      value: keysToSend
    }), options)

    return body
  }
}