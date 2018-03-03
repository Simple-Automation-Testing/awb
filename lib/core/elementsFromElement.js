const getLocalEnv = require('./env')

const { WEB_EMENET_ID } = require('../util')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = function (request) {
  return async function (sessionId, elementId, selector, options) {

    if (!options) options = { ...baseOptions }

    let bodyRequest

    if (selector.includes('xpath: ')) {
      selector = selector.replace('xpath: ', '')
      bodyRequest = { using: 'xpath', value: selector }
    } else if (selector.includes('accessibility: ')) {
      selector = selector.replace('accessibility: ', '')
      bodyRequest = { using: 'accessibility id', value: selector }
    } else if (selector.includes('id: ')) {
      selector = selector.replace('id: ', '')
      bodyRequest = { using: 'id', value: selector }
    } else {
      bodyRequest = { using: 'css selector', value: selector }
    }

    const { body, status } = await request.post(urlPathes.elementsFromElement(sessionId, elementId), JSON.stringify(bodyRequest), options)

    if (body.value.length) {
      body.value = body.value.map(element => {
        return element[WEB_EMENET_ID] ? { ELEMENT: element[WEB_EMENET_ID] } : element
      })
    }

    return body
  }
}
