const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function moveTo(sessionId, elementOrPosition, options) {

  if (!options) options = { ...baseOptions }

  if (elementOrPosition.x || elementOrPosition.x) {
    elementOrPosition = { xoffset: elementOrPosition.x, yoffset: elementOrPosition.y }
  }
  const { status, body } = await fetchy_util.post(urlPathes.moveto(sessionId), JSON.stringify({ ...elementOrPosition }), options)

  return body
}
