const {InterfaceError, handledErrors} = require('./interfaceError')
const {returnStringType, baseWait, waitCondition} = require('./util')

async function waitEl(that, findElement, tagName, time, source) {
  if(that.elementId) {
    const body = await tagName(that.sessionId, that.elementId)
    if(body.status === 0) {
      return time
    }
  }
  const {error, value, time: timeBase} = await baseWait(findElement, that.sessionId, that.selector, time)
  if(error) throw new InterfaceError(JSON.stringify(error))
  that.elementId = value.ELEMENT
  return timeBase
}

async function waitVisible(that, findElement, displayed, tagName, time) {

  const lessTime = await waitEl(that, findElement, tagName, time)
  const {value, error, time: timeDisplayed} = await waitCondition(displayed, (resp) => resp.value, time, that.sessionId, that.elementId)
  if(error) throw new InterfaceError(JSON.stringify(error))

  return timeDisplayed
}

async function waitPresent(that, findElement, present, tagName, time) {
  const lessTime = await waitEl(that, findElement, tagName, time)

  const {error, value, time: timePresent} = await waitCondition(present, (resp) => resp.value, lessTime, that.sessionId, that.elementId)
  if(error) throw new InterfaceError(JSON.stringify(error))
  return timePresent
}

async function waitClicable(that, findElement, present, displayed, tagName, time) {
  let timeSecondIteration = null
  const lessTime = await waitEl(that, findElement, tagName, time)
  {
    const {error, value, time: timePresent} = await waitCondition(present, (resp) => resp.value, lessTime, that.sessionId, that.elementId)
    if(error) throw new InterfaceError(JSON.stringify(error))
    timeSecondIteration = timePresent
  }
  {
    const {error, value, time: timeDisplayed} = await waitCondition(displayed, (resp) => resp.value, timeSecondIteration, that.sessionId, that.elementId)
    if(error) throw new InterfaceError(JSON.stringify(error))
    return timeDisplayed
  }
}

async function waitText(that, findElement, getElementText, time, text) {
  let timeSecondIteration = null
  const lessTime = await waitEl(that, findElement, tagName, time)
  {
    const {error, value, time: timePresent} = await waitCondition(getElementText, (resp) => resp.value.includes(text), lessTime, that.sessionId, that.elementId)
    if(error) throw new InterfaceError(JSON.stringify(error))
    return timePresent
  }
}

function getThisWrapperProxy(that, thisCall, proxyActions) {
  return new Proxy(that, {
    get(target, action) {
      if(action in target && !proxyActions.includes(action)) {
        return async (...args) => {
          await thisCall()
          return target[action](...args)
        }
      } else if(action in target && proxyActions.includes(action)) {
        return (...args) => {
          return target[action](...args, thisCall)
        }
      }
    }
  })
}

module.exports = {
  getThisWrapperProxy,
  waitPresent,
  waitText,
  waitEl,
  waitClicable,
  waitVisible
}