const { WEB_EMENET_ID } = require('../util')

const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, elementId, selector, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.elementFromElement(sessionId, elementId), JSON.stringify({
    using: 'css selector', value: selector
  }), options)

  if (body.value[WEB_EMENET_ID]) {
    body.value['ELEMENT'] = body.value[WEB_EMENET_ID]
    Reflect.deleteProperty(body.value, WEB_EMENET_ID)
  }

  return body
}
