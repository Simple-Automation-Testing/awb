const getLocalEnv = require('../env')

const { baseOptions, fetchy_util } = getLocalEnv()

module.exports = async function (sessionId, rect, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.currentSize(sessionId), JSON.stringify(rect), options)

  return body
}