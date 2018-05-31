const {InterfaceError, handledErrors} = require('./interfaceError')
const retryError = 'STALE_ELEMENT_REFERENCE'

async function callWithWrap(action, ...rest) {
  let driverResp = await action(this.sessionId, ...rest)

  const {err, errorType} = handledErrors(driverResp.status)

  if(!err) return driverResp.value

  if(err && errorType !== retryError) {
    console.log('here')
    err({
      sessionId: this.sessionId,
      selector: JSON.stringify(this.selector),
      additionalMessage: JSON.stringify(driverResp.value),
      parentSelector: this.baseElement && JSON.stringify(this.baseElement.selector)
    })
  } else {

    await this.getTthisElement(true)

    if(typeof rest[0] === 'string') {
      rest[0] = this.elementId
    }

    driverResp = await action(this.sessionId, ...rest)
    const {err, errorType} = handledErrors(driverResp.status)
    if(!err) return driverResp.value
    err({
      sessionId: this.sessionId,
      selector: JSON.stringify(this.selector),
      additionalMessage: JSON.stringify(driverResp.value),
      parentSelector: this.baseElement && JSON.stringify(this.baseElement.selector)
    })
  }
}

module.exports = {
  callWithWrap
}
