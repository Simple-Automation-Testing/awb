const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, timeouts = {}, options) {

  if (!options) options = { ...baseOptions }
  //'script', 'implicit', 'page load'
  const keys = Object.keys(timeouts)

  for (const key of keys) {
    const { status, body } = await fetchy_util.post(urlPathes.timeouts(sessionId), JSON.stringify({
      type: key,
      ms: timeouts[key]
    }), options)

  }
}
