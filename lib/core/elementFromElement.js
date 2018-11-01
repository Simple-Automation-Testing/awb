const {WEB_EMENET_ID} = require('../util')

const getLocalEnv = require('./env')

const {baseOptions,  urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementId, selector, options) {

    if(!options) options = {...baseOptions}
    const {body} = await request.post(urlPathes.elementFromElement(sessionId, elementId), JSON.stringify(selector), options)

    if(body.value[WEB_EMENET_ID]) {
      body.value['ELEMENT'] = body.value[WEB_EMENET_ID]
      Reflect.deleteProperty(body.value, WEB_EMENET_ID)
    }
    return body
  }
}