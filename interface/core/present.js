const getLocalEnv = require('../env')

const { baseOptions, fetchy_util } = getLocalEnv()

module.exports = async function (sessionId, elementId, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(urlPathes.present(sessionId, elementId), null, options)

  return body
}