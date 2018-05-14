const {returnStringType, baseWait, baseNegativeWait, sleep} = require('./util')

const {InterfaceError, handledErrors} = require('./interfaceError')

const {callWithWrap} = require('./callWrapper')

const {STATUS_FROM_DRIVER} = require('./responseSeleniumStatus')

const {initElement, initElements} = require('./byStrategy')

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


const proxyActions = [
  'get',
  'waitForElement',
  'waitForElementVisible',
  'waitForElementPresent',
  'waitForElements',
  'waitForClickable',
  'element',
  'elements',
  'wait',
  '$',
  '$$'
]

function elementsInitializer(requests, client) {
  const {getElementText, moveTo, buttonDown, elementFromElement, elementsFromElement, buttonUp, enabled, displayed, location, locationInView} = requests
  const {clickElement, sendKeys, getAttribute, executeScript, waitCondition, findElements, findElement, clearElementText, tagName, size} = requests
  const {touchClick, touchDown, touchDoubleclick, touchLongclick, touchFlick, touchMove, touchPerform, touchMultiperform, touchScroll, touchUp} = requests

  class ElementAWB {

    constructor(selector, sessionId = null, elementId = null, baseElement = null, ...rest) {
      this.selector = selector
      this.sessionId = sessionId
      this.elementId = elementId
      this.baseElement = baseElement
      this.element = initElement.call(this, ElementAWB)
      this.elements = initElements.call(this, ElementsAWB)
      // alias
      this.$ = initElement.call(this, ElementAWB)
      this.$$ = initElements.call(this, ElementsAWB)

      this.parent = false
      this.cbInitializator = rest[0]
    }

    waitForElement(...args) {
      const [time, subCall] = args
      const self = this

      const thisCall = async () => {
        // self.cbInitializator && await self.cbInitializator()
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
        this.baseElement ? `parent selector is ${this.baseElement.selector}` : ""
        } ${index ? `index was ${index}` : ""}`
      )
      if(error) throw new InterfaceError(JSON.stringify(error))
      return negativeTime
    }

    waitForClickable(...args) {
      const [time, subCall] = args
      const self = this

      const thisCall = async () => {
        self.cbInitializator && await self.cbInitializator()
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        const lessTime = await waitClicable(self, findElement, enabled, displayed, tagName, time)
        return {click: lessTime}
      }

      return getThisWrapperProxy(self, thisCall, proxyActions)
    }

    waitTextContains(...args) {
      const [time, text, subCall] = args
      const self = this

      const thisCall = async () => {
        self.cbInitializator && await self.cbInitializator()
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
        self.cbInitializator && await self.cbInitializator()
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
        self.cbInitializator && await self.cbInitializator()
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitPresent(self, findElement, enabled, tagName, time)
      }
      return getThisWrapperProxy(self, thisCall, proxyActions)
    }

    wait(...args) {
      const [time, cb, subCall] = args
      const self = this

      const thisCall = async (...args) => {
        self.cbInitializator && await self.cbInitializator()
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
      // this.cbInitializator && await this.cbInitializator()
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
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, locationInView, this.elementId)
    }

    async clear(...args) {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, clearElementText, this.elementId)
    }

    async getTag(...args) {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, tagName, this.elementId)
    }

    async getTthisElement(...args) {
      // this.cbInitializator && await this.cbInitializator()
      const [fromError] = args

      this.sessionId = this.sessionId || client.sessionId
      if(this.baseElement && !this.baseElement.elementId) {

        await this.baseElement.getTthisElement()
        const driverResp = await callWithWrap.call(this, elementFromElement, this.baseElement.elementId, this.selector)
        this.elementId = driverResp.ELEMENT

      } else if(fromError && this.baseElement) {
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
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement(...args)
      const driverResp = await callWithWrap.call(this, executeScript, `const [element] = arguments ;return element.outerHTML`, {
        ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId
      })
      return driverResp
    }

    async getText(...args) {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, getElementText, this.elementId)
    }

    async sendKeys(...args) {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, sendKeys, this.elementId, ...args)
    }

    async getAttribute(...args) {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, getAttribute, this.elementId, ...args)
    }

    async click(...args) {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement()
      if(args[0] && args[0].click) {
        const now = +Date.now();
        const clickWaitTime = args[0].click
        while(Date.now() - now < clickWaitTime) {
          try {
            await callWithWrap.call(this, clickElement, this.elementId)
            return
          } catch(error) {
            if(error.toString().includes('is not clickable at point')) {
              await sleep(250)
            }
          }
        }
      }
      return callWithWrap.call(this, clickElement, this.elementId)
    }

    async toElement(...args) {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, executeScript, function(...args) {
        const [element] = arguments
        element.scrollIntoView(...args)
      }, {ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId})
    }

    async isPresent(...args) {
      // this.cbInitializator && await this.cbInitializator()
      try {
        await this.getTthisElement(...args)
        return callWithWrap.call(this, enabled, this.elementId)
      } catch(error) {
        return false
      }
    }

    async isDisplayed(...args) {
      // this.cbInitializator && await this.cbInitializator()
      try {
        !this.elementId && await this.getTthisElement(...args)
        return callWithWrap.call(this, displayed, this.elementId)
      } catch(error) {
        return false
      }
    }

    async mouseDownAndMove(...args) {
      // this.cbInitializator && await this.cbInitializator()
      const [{x, y}] = args
      //mouse down mouse move mouse up
      !this.elementId && await this.getTthisElement(...args)
      await callWithWrap.call(this, moveTo, {element: this.elementId})
      await callWithWrap.call(this, buttonDown, {
        ELEMENT: this.elementId,
        [WEB_EMENET_ID]: this.elementId
      })
      await callWithWrap.call(this, moveTo, {x, y})
      await callWithWrap.call(this, buttonUp)
    }
  }

  class ElementsAWB {

    constructor(selector, sessionId = null, baseElement = null, ...rest) {
      this.baseElement = baseElement
      this.selector = selector
      this.sessionId = sessionId
      this.elements = null
      this.cbInitializator = rest[0]
    }

    async map(cb) {
      // this.cbInitializator && await this.cbInitializator()
      !this.elements && await this.getElements()

      const values = []

      for(let element of this.elements) {
        const result = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
        values.push(result)
      }
      return values
    }

    async count() {
      try {
        // this.cbInitializator && await this.cbInitializator()
        await this.getElements()
        return this.elements.length
      } catch(err) {
        if(err.toString().includes('not found')) return 0
        throw err
      }

    }

    async forEach(cb) {
      // this.cbInitializator && await this.cbInitializator()
      !this.element && await this.getElements()

      for(let element of this.elements) {
        cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
      }
    }

    async every(cb) {
      let result = true
      !this.element && await this.getElements()

      for(let element of this.elements) {
        result = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
        if(!result) {return result}
      }
      return result
    }


    async some(cb) {
      let result = false
      !this.element && await this.getElements()
      for(let element of this.elements) {
        result = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
        if(result) {return result}
      }
      return result
    }

    async filter(cb) {
      // this.cbInitializator && await this.cbInitializator()
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
        self.cbInitializator && await self.cbInitializator()
        self.sessionId = self.sessionId || client.sessionId
        if(proxCall) await proxCall()
        if(!this.elements || !this.elements.length) {
          await this.getElements()
        }
      }

      return new Proxy(this, {
        get(target, action) {
          if(/*action in Element.prototype && */ !proxyActions.includes(action)) {
            return async (...args) => {
              await thisCall()
              return self.elements[index][action](...args)
            }
          } else if(/*action in Element.prototype && */ proxyActions.includes(action)) {
            const actionPrev = action
            return (...args) => {
              return new Proxy({}, {
                get(target, subAction) {
                  // if(/*action in Element.prototype && */ !proxyActions.includes(action)) {
                  return async (...subArgs) => {
                    await thisCall()
                    return self.elements[index][actionPrev](...args)[subAction](...subArgs)
                  }
                  // } else {
                  //   console.log('here')
                  //   return (...subArgs) => {
                  //     return new Proxy({}, {
                  //       get(target, lastCallAction) {
                  //         console.log(lastCallAction, subAction, '!!!!')
                  //         return async (...lastCallArgs) => {
                  //           await thisCall()
                  //           const resp = await self.elements[index][actionPrev](...args)[subAction](...subArgs)
                  //           return resp[lastCallAction](...lastCallArgs)
                  //         }
                  //       }
                  //     })
                  //   }
                  // }
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
        self.cbInitializator && await self.cbInitializator()
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        const now = +Date.now()
        let lessTime
        do {
          self.elements = []
          lessTime = await waitEls(self, findElements, tagName, time, ElementAWB)
          const result = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(self) : cb(self)
          if(result) return {time: lessTime - (Date.now() - now)}
          await sleep()
          time = lessTime
        } while(Date.now() - now < lessTime)
      }

      return getThisWrapperProxy(self, thisCall, proxyActions)

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
          return el.waitUntilDisappear(time, index).then(lessTime => lessTime)
        })
      }, Promise.resolve())
    }

    waitForElements(...args) {
      const [time, subCall] = args
      const self = this

      const thisCall = async (...args) => {
        self.cbInitializator && await self.cbInitializator()
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitEls(self, findElements, tagName, time, ElementAWB)
      }

      return getThisWrapperProxy(self, thisCall, proxyActions)
    }

    async getElements(...args) {

      // this.cbInitializator && await this.cbInitializator()

      this.sessionId = this.sessionId || client.sessionId
      this.elements = []

      if(this.baseElement && !this.baseElement.elementId) {
        await this.baseElement.getTthisElement(...args)
        const driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
        driverResp.forEach(({ELEMENT}) => {
          this.elements.push(new ElementAWB(this.selector, this.sessionId, ELEMENT))
        })
      } else if(this.baseElement && this.baseElement.elementId) {
        const driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
        driverResp.forEach(({ELEMENT}) => {
          this.elements.push(new ElementAWB(this.selector, this.sessionId, ELEMENT))
        })
      } else {
        const driverResp = await callWithWrap.call(this, findElements, this.selector)
        driverResp.forEach(({ELEMENT}) => {
          this.elements.push(new ElementAWB(this.selector, this.sessionId, ELEMENT))
        })
      }

      if(!this.elements.length) {
        throw new InterfaceError(`Elements with selector ${JSON.stringify(this.selector)} not found`)
      }
      return this.elements
    }
  }

  return {ElementAWB, ElementsAWB}
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