const {InterfaceError, handledErrors} = require('./interfaceError')
const {returnStringType, baseWait, waitCondition} = require('./util')

async function waitEl(that, findElement, tagName, time, source) {
  if(that.elementId) {
    const {status} = await tagName(that.sessionId, that.elementId)
    if(status === 0) {
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
  const {value, error, time: timeDisplayed} = await waitCondition(displayed, lessTime, (resp) => resp.value, that.sessionId, that.elementId)
  if(error) throw new InterfaceError(JSON.stringify(error))

  return timeDisplayed
}

async function waitPresent(that, findElement, present, tagName, time) {
  const lessTime = await waitEl(that, findElement, tagName, time)

  const {error, value, time: timePresent} = await waitCondition(present, lessTime, (resp) => resp.value, that.sessionId, that.elementId)
  if(error) throw new InterfaceError(JSON.stringify(error))
  return timePresent
}

async function waitClicable(that, findElement, present, displayed, tagName, time) {
  let timeSecondIteration = null
  const lessTime = await waitEl(that, findElement, tagName, time)
  {
    const {error, value, time: timePresent} = await waitCondition(present, lessTime, (resp) => resp.value, that.sessionId, that.elementId)
    if(error) throw new InterfaceError(JSON.stringify(error))
    timeSecondIteration = timePresent
  }
  {
    const {error, value, time: timeDisplayed} = await waitCondition(displayed, timeSecondIteration, (resp) => resp.value, that.sessionId, that.elementId)
    if(error) throw new InterfaceError(JSON.stringify(error))
    return timeDisplayed
  }
}

module.exports = {
  waitPresent,
  waitEl,
  waitClicable,
  waitVisible
}