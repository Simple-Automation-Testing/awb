const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, options) {

  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.del(urlPathes.killSession(sessionId), undefined, options)

  return body
}
