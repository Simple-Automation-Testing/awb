const getLocalEnv = require('../env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.shake(sessionId), undefined, options)

  return body
}