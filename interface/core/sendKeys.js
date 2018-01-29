const getLocalEnv = require('./env')
const { assertArray, assertNumber } = require('../util')
const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, elementId, keysToSend, options) {

  let text = null
  if (!options) options = { ...baseOptions }


  if (assertNumber(keysToSend)) {
    console.log(keysToSend, '0')
    text = keysToSend.toString()
    keysToSend = keysToSend.toString().split('')
    console.log()
  } else if (!assertArray(keysToSend)) {
    console.log(typeof keysToSend, assertNumber(keysToSend), '1')
    text = keysToSend
    keysToSend = keysToSend.split('')
  } else {
    text = keysToSend.join('')
    keysToSend = keysToSend
  }
  const { body, status } = await fetchy_util.post(urlPathes.sendKeys(sessionId, elementId), JSON.stringify({
    text,
    value: keysToSend
  }), options)


  return body
}
