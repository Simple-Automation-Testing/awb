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
    } else {
      bodyRequest = { using: 'css selector', value: selector }
    }

    if (!options) options = { ...baseOptions }
    const { body, status } = await request.post(urlPathes.element(sessionId), JSON.stringify(bodyRequest), options)

    body.value = { ELEMENT: body.value[Object.keys(body.value)[0]] }

    return body
  }
}