const getLocalEnv = require('../env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.removeApp(sessionId), undefined, options)

  return body
}