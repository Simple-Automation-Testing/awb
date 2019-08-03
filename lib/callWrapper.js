const {handledErrors} = require('./interfaceError')
const retryError = 'STALE_ELEMENT_REFERENCE'

async function callWithWrap(that, action, ...rest) {
  let driverResp = await action(that.sessionId, ...rest)

  const {err, errorType} = handledErrors(driverResp.status)

  if(!err) return driverResp.value

  if(err && errorType !== retryError) {
    err({
      sessionId: that.sessionId,
      selector: JSON.stringify(that.selector),
      additionalMessage: JSON.stringify(driverResp.value),
      parentSelector: that.baseElement && JSON.stringify(that.baseElement.selector)
    })
  } else {

    await that.getThisElement(true)

    if(typeof rest[0] === 'string') {
      rest[0] = that.elementId
    }

    driverResp = await action(that.sessionId, ...rest)
    const {err} = handledErrors(driverResp.status)
    if(!err) return driverResp.value
    err({
      sessionId: that.sessionId,
      selector: JSON.stringify(that.selector),
      additionalMessage: JSON.stringify(driverResp.value),
      parentSelector: that.baseElement && JSON.stringify(that.baseElement.selector)
    })
  }
}

module.exports = {
  callWithWrap
}
