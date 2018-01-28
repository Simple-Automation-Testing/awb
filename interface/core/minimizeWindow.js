const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

async function minimizeWindow(sessionId, rect, options) {

  if (!options) options = { ...baseOptions }

  // have issue with selenium
  const { body, status } = await fetchy_util.post(urlPathes.minimize(sessionId), undefined, options)

  return body
}
