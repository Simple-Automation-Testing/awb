const getLocalEnv = require('./env')

const { WEB_EMENET_ID } = require('../util')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = function (request) {
  return async function (sessionId, elementId, selector, options) {

    if (!options) options = { ...baseOptions }

    const { body, status } = await request.post(urlPathes.elementsFromElement(sessionId, elementId), JSON.stringify({
      using: 'css selector', value: selector
    }), options)


    if (body.value.length) {
      body.value = body.value.map(element => {
        return element[WEB_EMENET_ID] ? { ELEMENT: element[WEB_EMENET_ID] } : element
      })
    }

    return body
  }
}
