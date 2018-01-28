const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, keys, options) {

  if (!options) options = { ...baseOptions }

  if (!Array.isArray(keys)) {
    keys = [keys]
  }
  const { body, status } = await fetchy_util(urlPathes.pressKeys(sessionId), JSON.stringify({ value: keys }), options)

  return body
}