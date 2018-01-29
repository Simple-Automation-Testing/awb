const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

const { assertArray, assertObject, assertFunction, assertString, assertNumber } = require('../util')

module.exports = async function (sessionId, script, args = [], options) {

  if (assertFunction(script)) {
    script = `const args = Array.prototype.slice.call(arguments,0)
              return ${script.toString()}.apply(window, args)`
  }
  if (!assertArray(args)) {
    if (assertObject(args) || assertFunction(args) || assertNumber(args) || assertString(args)) {
      args = [args]
    }
  }

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.executeSync(sessionId), JSON.stringify({
    script,
    args
  }), options)


  return body
}