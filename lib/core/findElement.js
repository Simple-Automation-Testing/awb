const getLocalEnv = require('./env')

const {baseOptions, fetchy_util, urlPathes} = getLocalEnv()

/**
   * @param {string} sessionId .
   * @param {string} selector css selector.
   * @param {object} options options.
 */

module.exports = function(request) {
  return async function(sessionId, selector, options) {

    if(!options) options = {...baseOptions}
    const {body} = await request.post(urlPathes.element(sessionId), JSON.stringify(selector), options)

    body.value = {ELEMENT: body.value[Object.keys(body.value)[0]]}

    return body
  }
}