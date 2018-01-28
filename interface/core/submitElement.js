const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, elementId, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.submit(sessionId, elementId), undefined, options)

  return body
}