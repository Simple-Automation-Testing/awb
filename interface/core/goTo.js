const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, url, options) {

  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.post(urlPathes.url(sessionId), JSON.stringify({
    url
  }), options)

  return body
}