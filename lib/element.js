const {returnStringType, baseNegativeWait, sleep, WEB_EMENET_ID} = require('./util')
const {InterfaceError} = require('./interfaceError')
const {callWithWrap} = require('./callWrapper')
const {initElement} = require('./byStrategy')
const {GetElementUtils} = require('./elementUtil')
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
  'util',
  '$$'
]

function elementsInitializer(requests, client) {
  const {getElementText, moveTo, buttonDown, elementFromElement, elementsFromElement, buttonUp, enabled, displayed, location, locationInView, click} = requests
  const {clickElement, sendKeys, getAttribute, executeScript, waitCondition, findElements, findElement, clearElementText, tagName, size, doubleClick} = requests
  const {touchClick, touchDown, touchDoubleclick, touchLongclick, touchFlick, touchMove, touchPerform, touchMultiperform, touchScroll, touchUp} = requests

  class ElementAWB {

    constructor({selector, sessionId = null, elementId = null, baseElement = null, subCall}) {
      this.subCall = subCall
      this.selector = selector
      this.sessionId = sessionId || client.sessionId
      this.elementId = elementId
      this.baseElement = baseElement
      this.util = new GetElementUtils(client, this)
    }

    element(...args) {
      const self = this
      return initElement(self, ElementAWB)(...args)
    }

    elements(...args) {
      const self = this
      return initElement(self, ElementsAWB)(...args)
    }


    $(...args) {
      const self = this
      return initElement(self, ElementAWB)(...args)
    }

    $$(...args) {
      const self = this
      return initElement(self, ElementsAWB)(...args)
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
      if(this.subCall) {await this.subCall(); this.subCall = null}
      try {
        if(!this.elementId) {await this.getThisElement()}
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
        if(self.subCall) {await self.subCall(); self.subCall = null}
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
        if(self.subCall) {await self.subCall(); self.subCall = null}
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
        if(self.subCall) {await self.subCall(); self.subCall = null}
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
        if(self.subCall) {await self.subCall(); self.subCall = null}
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
        if(self.subCall) {await self.subCall(); self.subCall = null}
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
      if(this.subCall) {await this.subCall(); this.subCall = null}
      const {width, height} = await this.size(...args)
      const {x, y} = await this.location(...args)
      return {width, height, x, y}
    }

    async size(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, size, this.elementId)
    }

    async location(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, location, this.elementId)
    }

    async locationView(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, locationInView, this.elementId)
    }

    async clear() {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, clearElementText, this.elementId)
    }

    async getTag() {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, tagName, this.elementId)
    }

    async rightClick(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}

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

    async getThisElement(...args) {
      if(this.subCall) {
        const elementIdBeforeSubCall = this.elementId
        await this.subCall();
        const elementIdAfterSubCall = this.elementId
        this.subCall = null
        /*
          this return statement required for next case:
          if sub call was binded from proxy method and it contains
          this.elementId = elementId // some element
          we dont need additional request fro new element id
        */
        if(elementIdBeforeSubCall !== elementIdAfterSubCall) return
      }

      const [fromError] = args
      let driverResp = null
      this.sessionId = this.sessionId || client.sessionId
      if((this.baseElement && !this.baseElement.elementId) || (fromError && this.baseElement)) {
        await this.baseElement.getThisElement()
        driverResp = await callWithWrap.call(this, elementFromElement, this.baseElement.elementId, this.selector)
      } else if(this.baseElement && this.baseElement.elementId) {
        driverResp = await callWithWrap.call(this, elementFromElement, this.baseElement.elementId, this.selector)
      } else {
        driverResp = await callWithWrap.call(this, findElement, this.selector)
      }
      this.elementId = driverResp.ELEMENT; return
    }

    async getElementHTML() {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, executeScript, 'return arguments[0].outerHTML', {
        ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId
      })
    }

    async getColor() {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, executeScript, 'return window.getComputedStyle(arguments[0]).color', {
        ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId
      })
    }

    async getText() {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, getElementText, this.elementId)
    }

    async sendKeys(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, sendKeys, this.elementId, ...args)
    }

    async getAttribute(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      return callWithWrap.call(this, getAttribute, this.elementId, ...args)
    }

    async click(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}

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

    async toElement(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(this.elementId) {await this.getThisElement(args)}
      return callWithWrap.call(this, executeScript, function() {
        const element = arguments[0]
        element.scrollIntoView()
      }, {ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId})
    }

    async isPresent(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      try {
        await this.getThisElement(...args)
        return callWithWrap.call(this, enabled, this.elementId)
      } catch(error) {return false}
    }

    async isDisplayed(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      try {
        if(!this.elementId) {await this.getThisElement()}
        return callWithWrap.call(this, displayed, this.elementId)
      } catch(error) {return false}
    }

    async doubleClick() {
      if(this.subCall) {await this.subCall(); this.subCall = null}
      if(!this.elementId) {await this.getThisElement()}
      await callWithWrap.call(this, moveTo, {element: this.elementId})
      await callWithWrap.call(this, doubleClick)
    }

    async mouseDownAndMove(...args) {
      if(this.subCall) {await this.subCall(); this.subCall = null}

      const [{x, y}] = args
      //mouse down mouse move mouse up
      if(!this.elementId) {await this.getThisElement()}
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

    constructor({selector, sessionId = null, elementId = null, baseElement = null, subCall}) {
      this.subCall = subCall
      this.selector = selector
      this.sessionId = sessionId || client.sessionId
      this.elementId = elementId
      this.baseElement = baseElement
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

    async count() {
      try {
        await this.getElements()
        return this.elements.length
      } catch(err) {
        if(err.toString().includes('not found')) return 0
        throw err
      }
    }

    async forEach(cb) {
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
        self.sessionId = self.sessionId || client.sessionId
        if(proxCall) await proxCall()
        if(!this.elements || !this.elements.length) {await self.getElements()}
        return self.elements[index]
      }
      return getThisWrapperProxy(self, thisCall, proxyActions, true, ElementAWB)
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
        self.sessionId = self.sessionId || client.sessionId
        if(subCall) {await subCall()}
        await waitEls(self, findElements, tagName, time, ElementAWB)
      }
      return getThisWrapperProxy(self, thisCall, proxyActions)
    }

    async getElements(...args) {
      this.sessionId = this.sessionId || client.sessionId
      this.elements = []
      let driverResp = []
      if(this.baseElement && !this.baseElement.elementId) {
        await this.baseElement.getThisElement(...args)
        driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
      } else if(this.baseElement && this.baseElement.elementId) {
        driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
      } else {
        driverResp = await callWithWrap.call(this, findElements, this.selector)
      }

      driverResp.forEach(({ELEMENT}) => {
        this.elements.push(new ElementAWB({selector: this.selector, sessionId: this.sessionId, elementId: ELEMENT}))
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

