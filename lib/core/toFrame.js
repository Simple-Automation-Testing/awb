const {toElementObject} = require('../util')

const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function(sessionId, elementId, options) {

    if(!options) options = {...baseOptions}

    const requestBody = elementId ? {id: toElementObject(elementId)} : {id: null}
    const {body} = await request.post(urlPathes.frame(sessionId), JSON.stringify(requestBody), options)

    return body
  }
}
