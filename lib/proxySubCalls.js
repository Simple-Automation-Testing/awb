const {InterfaceError, handledErrors} = require('./interfaceError')
const {returnStringType, baseWait, waitCondition} = require('./util')

async function waitEl(that, findElement, time) {
  const {error, value, time} = await baseWait(findElement, that.sessionId, that.selector, time)
  if(error) throw new InterfaceError(JSON.stringify(error))
  that.elementId = value.ELEMENT
  return time
}

async function waitVisible(that, findElement, displayed, time) {

  const lessTime = await waitEl(that, findElement, time)
  const {value, error, time} = await waitCondition(displayed, lessTime, (resp) => {
    return resp.value
  }, that.sessionId, that.elementId)
  if(error) throw new InterfaceError(JSON.stringify(error))

  return time
}

async function waitPresent(that, findElement, present, time) {
  const lessTime = await waitEl(that, findElement, time)

  const {error, value, time} = await waitCondition(present, lessTime, (resp) => resp.value, that.sessionId, that.elementId)
  if(error) throw new InterfaceError(JSON.stringify(error))
}

async function waitClicable(that, findElement, present, displayed, time) {
  let timeSecondIteration = null
  const lessTime = await waitEl(that, findElement, time)
  {
    const {error, value, time} = await waitCondition(present, lessTime, (resp) => resp.value, that.sessionId, that.elementId)
    if(error) throw new InterfaceError(JSON.stringify(error))
    timeSecondIteration = time
  }
  {
    const {error, value, time} = await waitCondition(displayed, timeSecondIteration, (resp) => resp.value, that.sessionId, that.elementId)
    if(error) throw new InterfaceError(JSON.stringify(error))
    return time
  }
}

module.exports = {
  waitPresent,
  waitEl,
  waitClicable,
  waitVisible
}