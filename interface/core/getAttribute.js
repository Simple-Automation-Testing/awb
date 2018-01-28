const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, elementId, attribute, options) {

  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.get(urlPathes.attribute(sessionId, elementId, attribute), null, options)

  return body
}