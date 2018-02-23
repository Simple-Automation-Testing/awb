const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

/**
   * @param {string} sessionId .
   * @param {string} selector css selector.
   * @param {object} options options.
 */

module.exports = function (request) {
  return async function (sessionId, selector, options) {
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

    if (!options) options = { ...baseOptions }

    const { body, status } = await request.post(urlPathes.elements(sessionId), JSON.stringify(bodyRequest), options)


    body.value = body.value.map(respPart => {
      return { ELEMENT: respPart[Object.keys(respPart)[0]] }
    })
    return body
  }
}