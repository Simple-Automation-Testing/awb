const {returnStringType, baseWait, baseNegativeWait, sleep} = require('./util')

const {InterfaceError, handledErrors} = require('./interfaceError')

const {STATUS_FROM_DRIVER} = require('./responseSeleniumStatus')

const {
  waitEl,
  waitPresent,
  waitClicable,
  waitVisible,
  waitText,
  waitEls,
  getThisWrapperProxy
} = require('./proxySubCalls')

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'
const retryError = 'STALE_ELEMENT_REFERENCE'

const proxyActions = [
  'get',
  'waitForElement',
  'waitForElementVisible',
  'waitForElementPresent',
  'waitForElements',
  'waitForClickable',
  'element',
  'elements',
  'wait'
]

function elementsInitializer(requests, client) {
  const {getElementText, moveTo, mouseDown, elementFromElement, elementsFromElement, present, displayed, size, location, locationInView} = requests
  const {clickElement, sendKeys, getAttribute, executeScript, waitCondition, findElements, findElement, clearElementText, tagName} = requests
  const {touchClick, touchDown, touchDoubleclick, touchLongclick, touchFlick, touchMove, touchPerform, touchMultiperform, touchScroll, touchUp} = requests

  async function callWithWrap(action, ...rest) {
    let driverResp = await action(this.sessionId, ...rest)
    const {err, errorType} = handledErrors(driverResp.status)

    if(!err) return driverResp.value

    if(err && errorType !== retryError) {
      err({
        sessionId: this.sessionId,
        selector: JSON.stringify(this.selector),
        additionalMessage: JSON.stringify(driverResp.value),
        parentSelector: this.baseElement && JSON.stringify(this.baseElement.selector)
      })
    } else {
      try {
        await this.getTthisElement(...args)
        if(typeof rest[0] === 'string') {
          rest[0] = this.elementId
        }
        driverResp = await action(this.sessionId, ...rest)
        const {err, errorType} = handledErrors(driverResp.status)
        if(err) {
          err({
            sessionId: this.sessionId,
            selector: JSON.stringify(this.selector),
            additionalMessage: JSON.stringify(driverResp.value),
            parentSelector: this.baseElement && JSON.stringify(this.baseElement.selector)
          })
        }
        return driverResp.value
      } catch(error) {
        err({
          sessionId: this.sessionId,
          selector: JSON.stringify(this.selector),
          additionalMessage: JSON.stringify(driverResp.value),
          parentSelector: this.baseElement && JSON.stringify(this.baseElement.selector)
        })
      }
    }
    return driverResp.value
  }

  function initElem(...args) {
    const element = selector => {
      const selectorObj = {using: 'css selector', value: selector}
      return new Element(selectorObj, this.sessionId, null, this)
    }

    element.css = selector => {
      const selectorObj = {using: 'css selector', value: selector}
      return new Element(selectorObj, this.sessionId, null, this)
    }
    element.xpath = selector => {
      const selectorObj = {using: 'xpath', value: selector}
      return new Element(selectorObj, this.sessionId, null, this)
    }
    element.id = (selector) => {
      const selectorObj = {using: 'id', value: selector}
      return new Element(selectorObj, this.sessionId, null, this)
    }
    element.accessibilityId = selector => {
      const selectorObj = {using: 'accessibility id', value: selector}
      return new ElementInstance(selectorObj, this.sessionId, null, this)
    }
    return element
  }

  function initElems(...args) {
    const elements = selector => {
      const selectorObj = {using: 'css selector', value: selector}
      return new Elements(selectorObj, this.sessionId, this)
    }
    elements.css = selector => {
      const selectorObj = {using: 'css selector', value: selector}
      return new Elements(selector, this.sessionId, this)
    }
    elements.xpath = selector => {
      const selectorObj = {using: 'xpath', value: selector}
      return new Elements(selector, this.sessionId, this)
    }
    elements.id = (selector) => {
      const selectorObj = {using: 'id', value: selector}
      return new Elements(selector, this.sessionId, this)
    }
    elements.accessibilityId = selector => {
      const selectorObj = {using: 'accessibility id', value: selector}
      return new Elements(selector, this.sessionId, this)
    }
    return elements
  }

  class Element {

    constructor(selector, sessionId = null, elementId = null, baseElement = null) {
      this.selector = selector
      this.sessionId = sessionId
      this.elementId = elementId
      this.baseElement = baseElement
      this.element = initElem.call(this)
      this.elements = initElems.call(this)
    }

    waitForElement(...args) {
      const [time, subCall] = args
      const self = this

      const thisCall = async () => {
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitEl(self, findElement, tagName, time)
      }

      return getThisWrapperProxy(self, thisCall, proxyActions)
    }

    async waitUntilDisappear(time, index) {
      try {
        !this.elementId && await this.getTthisElement()
      } catch(error) {
        return
      }
      const {error, time: negativeTime} = await baseNegativeWait(
        tagName.bind(this, this.sessionId, this.elementId),
        time,
        `Element with selector ${JSON.stringify(this.selector)} still present on page ${
        this.baseElement ? "parent selector is " + this.baseElement.selector : ""
        } ${index ? "index was" + index : ""}`
      )
      if(error) throw new InterfaceError(JSON.stringify(error))
      return negativeTime
    }

    waitForClickable(...args) {
      const [time, subCall] = args
      const self = this

      const thisCall = async () => {
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitClicable(self, findElement, present, displayed, tagName, time)
      }

      return getThisWrapperProxy(self, thisCall, proxyActions)
    }

    waitTextContains(...args) {
      const [time, text, subCall] = args
      const self = this

      const thisCall = async () => {
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitText(self, findElement, getElementText, time, time)
      }

      return getThisWrapperProxy(self, thisCall, proxyActions)

    }

    waitForElementVisible(...args) {
      const [time, subCall] = args
      const self = this

      const thisCall = async () => {
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitVisible(self, findElement, displayed, tagName, time)
      }

      return getThisWrapperProxy(self, thisCall, proxyActions)

    }

    waitForElementPresent(...args) {
      const [time, subCall] = args
      const self = this

      const thisCall = async (...args) => {
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitPresent(self, findElement, present, tagName, time)
      }

      return getThisWrapperProxy(self, thisCall, proxyActions)

    }

    wait(...args) {
      const [time, cb, subCall] = args
      const self = this

      const thisCall = async (...args) => {
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        const lessTime = await waitEl(self, findElement, tagName, time)
        const now = +Date.now()
        do {
          const result = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(self) : cb(self)
          if(result) return {time: lessTime - (Date.now() - now)}
          await sleep()
        } while(Date.now() - now < lessTime)
      }

      return getThisWrapperProxy(self, thisCall, proxyActions)

    }

    async getRect(...args) {
      const {width, height} = await this.size(...args)
      const {x, y} = await this.location(...args)
      return {width, heigth, x, y}
    }

    async size(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, size, this.elementId)
    }

    async location(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, location, this.elementId)
    }

    async locationView(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, locationInView, this.elementId)
    }

    async clear(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, clearElementText, this.elementId)
    }

    async getTag(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, tagName, this.elementId)
    }

    async getTthisElement(...args) {
      this.sessionId = this.sessionId || client.sessionId
      if(this.baseElement && !this.baseElement.elementId) {
        await this.baseElement.getTthisElement(...args)
        const driverResp = await callWithWrap.call(this, elementFromElement, this.baseElement.elementId, this.selector)
        this.elementId = driverResp.ELEMENT
      } else if(this.baseElement && this.baseElement.elementId) {

        const driverResp = await callWithWrap.call(this, elementFromElement, this.baseElement.elementId, this.selector)
        this.elementId = driverResp.ELEMENT
      } else {
        const driverResp = await callWithWrap.call(this, findElement, this.selector)
        this.elementId = driverResp.ELEMENT
      }
      return
    }

    async getElementHTML(...args) {
      !this.elementId && await this.getTthisElement(...args)
      const driverResp = await callWithWrap.call(this, executeScript, `const [element] = arguments ;return element.outerHTML`, {
        ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId
      })
      return driverResp
    }

    async getText(...args) {
      !this.elementId && await this.getTthisElement(...args)
      const xx = await callWithWrap.call(this, executeScript, function(...args) {
        const [element] = arguments
        return element.innerText
      }, {ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId})
      return xx
    }

    async sendKeys(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, sendKeys, this.elementId, ...args)
    }

    async getAttribute(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, getAttribute, this.elementId, ...args)
    }

    async click(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, clickElement, this.elementId)
    }

    async isPresent(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, present, this.elementId)
    }

    async toElement(...args) {
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, executeScript, function(...args) {
        const [element] = arguments
        element.scrollIntoView(...args)
      }, {ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId})
    }

    async isDisplayed(...args) {
      try {
        !this.elementId && await this.getTthisElement(...args)
        return callWithWrap.call(this, displayed, this.elementId)
      } catch(error) {
        return false
      }
    }

    async mouseDownAndMove({x, y}) {
      //mouse down mouse move mouse up
      !this.elementId && await this.getTthisElement(...args)
      await callWithWrap.call(this, moveTo, {element: this.elementId})
      await callWithWrap.call(this, mouseDown, {
        ELEMENT: this.elementId,
        [WEB_EMENET_ID]: this.elementId
      })
      await callWithWrap.call(this, moveTo, {x, y})
    }
  }

  class Elements {

    constructor(selector, sessionId = null, baseElement = null) {
      this.baseElement = baseElement
      this.selector = selector
      this.sessionId = sessionId
      this.elements = null
    }

    async map(cb) {
      !this.elements && await this.getElements()

      const values = []

      for(let element of this.elements) {
        const result = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
        values.push(result)
      }
      return values
    }

    async count(...args) {
      await this.getElements(...args)
      return this.elements.length
    }

    async forEach(cb) {
      !this.element && await this.getElements(...args)

      for(let element of this.elements) {
        cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
      }
    }

    async filter(cb) {
      !this.elements && await this.getElements(...args)
      const values = []
      for(let element of this.elements) {
        const resultValue = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
        if(resultValue) {
          values.push(element)
        }
      }
      return values
    }

    get(...args) {
      const [index, proxCall] = args
      const self = this
      const thisCall = async () => {
        self.sessionId = self.sessionId || client.sessionId
        if(proxCall) await proxCall()
        if(!this.elements || !this.elements.length) {
          await this.getElements()
        }
      }

      return new Proxy(this, {
        get(target, action) {
          if(action in Element.prototype && !proxyActions.includes(action)) {
            return async (...args) => {
              await thisCall()
              return self.elements[index][action](...args)
            }
          } else if(action in Element.prototype && proxyActions.includes(action)) {
            const actionPrev = action
            return (...args) => {
              return new Proxy({}, {
                get(target, subAction) {
                  return async (...subArgs) => {
                    await thisCall()
                    return self.elements[index][actionPrev](...args)[subAction](...subArgs)
                  }
                }
              })
            }
          }
        }
      })
    }

    wait(...args) {
      let [time, cb, subCall] = args
      const self = this

      const thisCall = async (...args) => {
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        const now = +Date.now()
        let lessTime
        do {
          self.elements = []
          lessTime = await waitEls(self, findElements, tagName, time, Element)
          const result = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(self) : cb(self)
          if(result) return {time: lessTime - (Date.now() - now)}
          await sleep()
          time = lessTime
        } while(Date.now() - now < lessTime)
      }

      return new Proxy(this, {
        get(target, action) {
          if(action in target && !proxyActions.includes(action)) {
            return async (...args) => {
              await thisCall(...args)
              return target[action](...args)
            }
          } else if(action in target && proxyActions.includes(action)) {
            return (...args) => target[action](...args, thisCall)
          }
        }
      })
    }

    async waitUntilDisappear(time) {
      try {
        if(!this.elements || !!this.elements && !this.elements.length) {
          await this.getElements()
        }
      } catch(error) {
        return
      }
      return this.elements.reduce((resolver, el, index) => {
        return resolver.then((result) => {
          if(!result) {result = time}
          console.log(result)
          return el.waitUntilDisappear(time, index).then(lessTime => lessTime)
        })
      }, Promise.resolve())
    }


    waitForElements(...args) {
      const [time, subCall] = args
      const self = this

      const thisCall = async (...args) => {
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitEls(self, findElements, tagName, time, Element)
      }

      return new Proxy(this, {
        get(target, action) {
          if(action in target && !proxyActions.includes(action)) {
            return async (...args) => {
              await thisCall(...args)
              return target[action](...args)
            }
          } else if(action in target && proxyActions.includes(action)) {
            return (...args) => target[action](...args, thisCall)
          }
        }
      })
    }

    async getElements(...args) {

      this.sessionId = this.sessionId || client.sessionId
      this.elements = []

      if(this.baseElement && !this.baseElement.elementId) {
        await this.baseElement.getTthisElement(...args)
        const driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
        driverResp.forEach(({ELEMENT}) => {
          this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
        })
      } else if(this.baseElement && this.baseElement.elementId) {
        const driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
        driverResp.forEach(({ELEMENT}) => {
          this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
        })
      } else {
        const driverResp = await callWithWrap.call(this, findElements, this.selector)
        driverResp.forEach(({ELEMENT}) => {
          this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
        })
      }

      if(!this.elements.length) {
        throw new InterfaceError(`Elements with selector ${JSON.stringify(this.selector)} not found`)
      }
      return this.elements
    }
  }

  return {Element, Elements}
}

module.exports = elementsInitializer


  // swipeTo(positios, persent = false) {
    //   const toRound = (value) => Math.round(value)

    //   const swipe = async (down, moveup) => {
    //     const bodyDown = await touchDown(this.sessionId, down)
    //     handledErrors(this, bodyDown.status, bodyDown.value)
    //     const bodyMove = await touchMove(this.sessionId, moveup)
    //     handledErrors(this, bodyMove.status, bodyMove.value)
    //     const bodyUp = await touchUp(this.sessionId, moveup)
    //     handledErrors(this, bodyUp.status, bodyUp.value)
    //   }

    //   const getElementRects = async (...args) => {
    //     if(persent) {
    //       const {height, width} = await client.getWindowSize(...args)
    //       positios = {x: width / 100 * positios.x, y: height / 100 * positios.y}
    //     }
    //     return await this.getRect(...args)
    //   }

    //   return {
    //     fromCenter: async (...args) => {
    //       const {x, y, width, height, positios} = await getElementRects(...args)
    //       const center = {x: toRound(x + width / 2), y: toRound(y + height / 2)}
    //       const down = {params: center}
    //       const moveAndUp = {params: {x: center.x + positios.xTo, y: center.y + positios.yTo}}
    //       await swipe(down, moveAndUp)
    //     },
    //     fromBottom: async (...args) => {
    //       const {x, y, width, height, positios} = await getElementRects(...args)
    //       const bottom = {x: toRound(x + width / 2), y: toRound(y + height - 2)}
    //       const down = {params: bottom}
    //       const moveAndUp = {params: {x: bottom.x + positios.xTo, y: bottom.y + positios.yTo}}
    //       await swipe(down, moveAndUp)
    //     },
    //     fromTop: async (...args) => {
    //       const {x, y, width, height, positios} = await getElementRects(...args)
    //       const top = {x: toRound(x + width / 2), y: toRound(y - 2)}
    //       const down = {params: top}
    //       const moveAndUp = {params: {x: top.x + positios.xTo, y: top.y + positios.yTo}}
    //       await swipe(down, moveAndUp)
    //     }
    //   }
    // }