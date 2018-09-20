const {returnStringType, baseWait, baseNegativeWait, sleep, WEB_EMENET_ID} = require('./util')
const {InterfaceError, handledErrors} = require('./interfaceError')
const {callWithWrap} = require('./callWrapper')
const {STATUS_FROM_DRIVER} = require('./responseSeleniumStatus')
const {initElement} = require('./byStrategy')

const {
  waitEl,
  waitPresent,
  waitClicable,
  waitVisible,
  waitText,
  waitEls,
  getThisWrapperProxy
} = require('./proxySubCalls')

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
  const {getElementText, moveTo, buttonDown, elementFromElement, elementsFromElement, buttonUp, enabled, displayed, location, locationInView, click} = requests
  const {clickElement, sendKeys, getAttribute, executeScript, waitCondition, findElements, findElement, clearElementText, tagName, size, doubleClick} = requests
  const {touchClick, touchDown, touchDoubleclick, touchLongclick, touchFlick, touchMove, touchPerform, touchMultiperform, touchScroll, touchUp} = requests

  class ElementAWB {

    constructor(selector, sessionId = null, elementId = null, baseElement = null, ...rest) {
      this.selector = selector
      this.sessionId = sessionId
      this.elementId = elementId
      this.baseElement = baseElement
      this.element = initElement.call(this, ElementAWB)
      this.elements = initElement.call(this, ElementsAWB)
      // alias
      this.$ = initElement.call(this, ElementAWB)
      this.$$ = initElement.call(this, ElementsAWB)

      this.parent = false
      this.cbInitializator = rest[0]
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
      const [text, time, subCall] = args
      const self = this
      const thisCall = async () => {
        self.cbInitializator && await self.cbInitializator()
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitText(self, findElement, getElementText, tagName, time, text)
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
      return {width, height, x, y}
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

    async clear() {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, clearElementText, this.elementId)
    }

    async getTag() {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, tagName, this.elementId)
    }

    async rightClick(...args) {
      !this.elementId && await this.getTthisElement()

      if(args[0] && args[0].click) {
        const now = +Date.now();
        const clickWaitTime = args[0].click
        while(Date.now() - now < clickWaitTime) {
          try {
            await callWithWrap.call(this, moveTo, {
              element: this.elementId
            })
            return callWithWrap.call(this, click, this.elementId, {button: 2})
          } catch(error) {
            if(error.toString().includes('is not clickable at point')) {
              await sleep(250)
            }
          }
        }
      }
      await callWithWrap.call(this, moveTo, {
        element: this.elementId
      })
      return callWithWrap.call(this, click, this.elementId, {button: 2})
    }

    async getTthisElement(...args) {
      // this.cbInitializator && await this.cbInitializator()
      const [fromError] = args
      let driverResp = null
      this.sessionId = this.sessionId || client.sessionId
      if((this.baseElement && !this.baseElement.elementId) || (fromError && this.baseElement)) {
        await this.baseElement.getTthisElement()
        driverResp = await callWithWrap.call(this, elementFromElement, this.baseElement.elementId, this.selector)
      } else if(this.baseElement && this.baseElement.elementId) {
        driverResp = await callWithWrap.call(this, elementFromElement, this.baseElement.elementId, this.selector)
      } else {
        driverResp = await callWithWrap.call(this, findElement, this.selector)
      }
      this.elementId = driverResp.ELEMENT; return
    }

    async getElementHTML() {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, executeScript, 'return arguments[0].outerHTML', {
        ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId
      })
    }

    async getText() {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement()
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
            await callWithWrap.call(this, clickElement, this.elementId); return
          } catch(error) {
            if(error.toString().includes('is not clickable at point')) {
              await sleep(250)
            }
          }
        }
      }
      return callWithWrap.call(this, clickElement, this.elementId)
    }

    async getOptionList() {
      !this.elementId && await this.getTthisElement()
      if(await this.getTag() !== 'select') {console.error('element is not select list')}

      return callWithWrap.call(this, executeScript, function() {
        const element = arguments[0]
        const list = arguments[0]

        function buildOptionCollection(options) {
          return Array.prototype.reduce.call(options, function(acc, cur, ind) {
            acc.push({
              index: ind,
              text: cur.innerText,
              isSelected: cur.selected
            })
            return acc
          }, [])
        }

        if(!list.querySelector('optgroup')) {
          return buildOptionCollection(list.querySelectorAll('option'))
        } else {
          return Array.prototype.reduce.call(list.querySelectorAll('optgroup'), function(acc, cur, ind) {
            acc[cur.label] = buildOptionCollection(cur.querySelectorAll('option'))
            return acc
          }, {})
        }
        element.scrollIntoView()
      }, {ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId})
    }

    async toElement(...args) {
      // this.cbInitializator && await this.cbInitializator()
      !this.elementId && await this.getTthisElement(...args)
      return callWithWrap.call(this, executeScript, function() {
        const element = arguments[0]
        element.scrollIntoView()
      }, {ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId})
    }

    async isPresent(...args) {
      // this.cbInitializator && await this.cbInitializator()
      try {
        await this.getTthisElement(...args)
        return callWithWrap.call(this, enabled, this.elementId)
      } catch(error) {return false}
    }

    async isDisplayed(...args) {
      // this.cbInitializator && await this.cbInitializator()
      try {
        !this.elementId && await this.getTthisElement(...args)
        return callWithWrap.call(this, displayed, this.elementId)
      } catch(error) {return false}
    }

    async doubleClick() {
      !this.elementId && await this.getTthisElement()
      await callWithWrap.call(this, moveTo, {element: this.elementId})
      await callWithWrap.call(this, doubleClick)
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
        if(resultValue) {values.push(element)}
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
      } catch(error) {return }
      return this.elements.reduce((resolver, el, index) => {
        return resolver.then((result) => {
          if(!result) {result = time}
          return el.waitUntilDisappear(result, index).then(lessTime => lessTime)
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
      let driverResp = []
      if(this.baseElement && !this.baseElement.elementId) {
        await this.baseElement.getTthisElement(...args)
        driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
      } else if(this.baseElement && this.baseElement.elementId) {
        driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
      } else {
        driverResp = await callWithWrap.call(this, findElements, this.selector)
      }

      driverResp.forEach(({ELEMENT}) => {
        this.elements.push(new ElementAWB(this.selector, this.sessionId, ELEMENT))
      })

      if(!this.elements.length) {
        throw new InterfaceError(`Elements with selector ${JSON.stringify(this.selector)} not found`)
      }
      return this.elements
    }
  }

  return {ElementAWB, ElementsAWB}
}

module.exports = elementsInitializer

