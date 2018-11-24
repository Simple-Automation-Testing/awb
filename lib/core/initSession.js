const getLocalEnv = require('./env')

const sessionIdReplacer = (body) => {
  if(!body.sessionId) {
    if(body.value && body.value.sessionId) {
      body.sessionId = body.value.sessionId
    }
  }
  if(body.sessionId) {
    if(body.sessionId) {
      body.status = 0
    }
  }

  return body
}

const {baseOptions, fetchy_util, urlPathes, defaultCapsAndBaseOptions} = getLocalEnv()

module.exports = function(request) {
  return async function(data, options) {

    if(!data) data = JSON.stringify(defaultCapsAndBaseOptions.defaultChromeCapabilities)
    if(!options) options = {...baseOptions}

    const {body} = await request.post(urlPathes.getSession(), data, options).catch(console.log)
    sessionIdReplacer(body)
    return body
  }
}