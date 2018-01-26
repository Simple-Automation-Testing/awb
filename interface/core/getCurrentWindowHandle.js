const getLocalEnv = require('./env')

const { baseOptions, fetchy_util } = getLocalEnv()

module.exports = async function (sessionId, options) {

  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.get(urlPathes.windowHandle(sessionId), null, options)

  return body
}