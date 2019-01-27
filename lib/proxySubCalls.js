const {InterfaceError} = require('./interfaceError')
const {baseWait, waitCondition} = require('./util')

async function waitEl(that, findElement, tagName, time) {
  if(that.elementId) {
    const body = await tagName(that.sessionId, that.elementId)
    if(body.status === 0) {return time}
  }
  const {error, value, time: timeBase} = await baseWait(findElement, that.sessionId, that.selector, time)
  if(error) throw new InterfaceError(JSON.stringify(error))
  that.elementId = value.ELEMENT
  return timeBase
}

async function waitEls(that, findElements, tagName, time, ElInstance) {
  if(that.elements && that.elements.length) {
    for(const el of that.elements) {
      const body = await tagName(that.sessionId, el.elementId)
      if(body.status === 0) {return time}
    }
  }
  const {error, value, time: timeBase} = await baseWait(findElements, that.sessionId, that.selector, time)
  if(error) throw new InterfaceError(JSON.stringify(error))
  that.elements = value.map(el => new ElInstance({selector: that.selector, sessionId: that.sessionId, elementId: el.ELEMENT}))
  return timeBase
}

async function waitVisible(that, findElement, displayed, tagName, time) {
  const lessTime = await waitEl(that, findElement, tagName, time)
  const {error, time: timeDisplayed} = await waitCondition(displayed, (resp) => resp.value, lessTime, that.sessionId, that.elementId)
  if(error) throw new InterfaceError(JSON.stringify(error))
  return timeDisplayed
}

async function waitPresent(that, findElement, present, tagName, time) {
  const lessTime = await waitEl(that, findElement, tagName, time)
  const {error, time: timePresent} = await waitCondition(present, (resp) => resp.value, lessTime, that.sessionId, that.elementId)
  if(error) throw new InterfaceError(JSON.stringify(error) + 'time:' + time)
  return timePresent
}

async function waitClicable(that, findElement, present, displayed, tagName, time) {
  const lessTime = await waitEl(that, findElement, tagName, time)
  const {error: errorPresent, time: timePresent} = await waitCondition(present, (resp) => resp.value, lessTime, that.sessionId, that.elementId)
  if(errorPresent) throw new InterfaceError(JSON.stringify(errorPresent))
  const {error: errorDisplay, time: timeDisplayed} = await waitCondition(displayed, (resp) => resp.value, timePresent, that.sessionId, that.elementId)
  if(errorDisplay) throw new InterfaceError(JSON.stringify(errorDisplay))
  return timeDisplayed
}

async function waitText(that, findElement, getElementText, tagName, time, text) {
  const lessTime = await waitEl(that, findElement, tagName, time)
  const {error, time: timePresent} = await waitCondition(getElementText, (resp) => resp.value.includes(text), lessTime, that.sessionId, that.elementId)
  if(error) throw new InterfaceError(JSON.stringify(error))
  return timePresent
}

function getThisWrapperProxy(that, thisCall, proxyActions, elementsProxy = false, ElementAWBContructor) {
  return new Proxy(that, {
    get(target, action) {
      if(!proxyActions.includes(action)) {
        if(elementsProxy) {
          return async (...args) => {
            const element = await thisCall()
            return element[action](...args)
          }
        }

        const actionType = Object.prototype.toString.call(target[action])
        // if need get access to base element, session id, element id etc
        if(!actionType.includes('Function')) {return target[action]}

        return async (...args) => {
          const subCallResult = await thisCall()
          if(subCallResult) {args.push(subCallResult)}
          return target[action](...args)
        }
      } else {
        if(elementsProxy && !target[action]) { // if proxy from ElementsAWB but required action from element
          if(!ElementAWBContructor) throw new Error('Element constructor should be in arguments list')

          const element = new ElementAWBContructor({selector: that.selector, sessionId: that.sessionId})

          const subCall = (async function() {
            const elementFromElements = await thisCall()
            this.elementId = elementFromElements.elementId
          }).bind(element)

          element.subCall = subCall
          return element[action]
        }

        return typeof target[action] === 'object'
          ? target[action]
          : (...args) => {
            args.push(thisCall, that)
            return target[action](...args)
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
  waitEls,
  waitClicable,
  waitVisible
}