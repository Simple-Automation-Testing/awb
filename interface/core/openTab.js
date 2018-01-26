const getLocalEnv = require('./env')

const { baseOptions, fetchy_util } = getLocalEnv()

module.exports = async function (sessionId, nameHandle, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.window(sessionId), JSON.stringify({
    name: nameHandle, handle: nameHandle
  }), options)

  return body
}