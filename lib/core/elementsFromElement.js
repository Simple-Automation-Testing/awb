const getLocalEnv = require('./env')

const {WEB_EMENET_ID} = require('../util')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementId, selector, options) {
    if(!options) options = {...baseOptions}
    const {body} = await request.post(urlPathes.elementsFromElement(sessionId, elementId), JSON.stringify(selector), options)
    if(body.value.length) {
      body.value = body.value.map(element => {
        return element[WEB_EMENET_ID] ? {ELEMENT: element[WEB_EMENET_ID]} : element
      })
    }
    return body
  }
}
