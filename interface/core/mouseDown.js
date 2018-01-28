const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, element/*element can be css selector or elementId*/, position, options) {

  element = { button: 0 }
  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.post(urlPathes.buttonDown(sessionId), JSON.stringify({ element }), options)

  return body
}
