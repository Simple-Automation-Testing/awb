const getLocalEnv = require('./env')

const {baseOptions, urlPathes} = getLocalEnv()

module.exports = function(request) {
  return async function syncWithDOM(sessionId, timeout, options) {

    if(!options) options = {...baseOptions}

    const waitState = function() {
      return document.readyState === 'complete'
    }

    const fn = `const passedArgs = Array.prototype.slice.call(arguments,0);
      return ${waitState.toString()}.apply(window, passedArgs);`

    const requestDomState = () => request.post(urlPathes.executeSync(sessionId), JSON.stringify({
      script: fn,
      args: []
    }), options)
    const result = await waitCondition(requestDomState, 3000)
    if(!result) {
      throw new InterfaceError('DOM mount does not complete')
    }
  }
}