const getLocalEnv = require('./env')

const { baseOptions, fetchy_util, urlPathes } = getLocalEnv()

module.exports = async function (sessionId, selector, options) {
  let elementId;

  if (selector) {
    const { value: { ELEMENT } } = await findElement(sessionId, selector, options)
    elementId = ELEMENT;
  }

  if (!options) options = { ...baseOptions }

  const requestBody = elementId ? { id: { [WEB_EMENET_ID]: elementId, ELEMENT: elementId } } : { id: null }

  const { body, status } = await fetchy_util.post(urlPathes.frame(sessionId), JSON.stringify(requestBody), options)

  return body
}
