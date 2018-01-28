const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

async function elementsFromElement(sessionId, elementId, selector, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.elementsFromElement(sessionId, elementId), JSON.stringify({
    using: 'css selector', value: selector
  }), options)


  if (body.value.length) {
    body.value = body.value.map(element => {
      return element[WEB_EMENET_ID] ? { ELEMENT: element[WEB_EMENET_ID] } : element
    })
  }

  return body
}
