const {WEB_EMENET_ID} = require('../util')

const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementId, options) {

    if(!options) options = {...baseOptions}

    const requestBody = elementId ? {id: {[WEB_EMENET_ID]: elementId, ELEMENT: elementId}} : {id: null}
    const {body, status} = await request.post(urlPathes.frame(sessionId), JSON.stringify(requestBody), options)

    return body
  }
}
