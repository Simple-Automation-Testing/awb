const {returnStringType, waitElementPresent} = require('./util')

const {InterfaceError, handledErrors} = require('./interfaceError')

const {initElement, initElements} = require('./byStrategy')

const {STATUS_FROM_DRIVER} = require('./responseSeleniumStatus')

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'
const retryError = 'STALE_ELEMENT_REFERENCE'

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
        selector: this.selector,
        additionalMessage: JSON.stringify(driverResp.value),
        parentSelector: this.baseElement && this.baseElement.selector
      })
    } else {
      try {
        await this.getTthisElement()
        if(typeof rest[0] === 'string') {
          rest[0] = this.elementId
        }
        driverResp = await action(this.sessionId, ...rest)
        const {err, errorType} = handledErrors(driverResp.status)
        if(err) {
          err({
            sessionId: this.sessionId,
            selector: this.selector,
            additionalMessage: JSON.stringify(driverResp.value),
            parentSelector: this.baseElement && this.baseElement.selector
          })
        }
        return driverResp
      } catch(error) {
        err({
          sessionId: this.sessionId,
          selector: this.selector,
          additionalMessage: JSON.stringify(driverResp.value),
          parentSelector: this.baseElement && this.baseElement.selector
        })
      }
    }
    return driverResp
  }

  function initElem() {
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

  function initElems() {
    const elements = selector => {
      const selectorObj = {using: 'css selector', value: selector}
      return new Elements(selectorObj, this.sessionId, null, this)
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

    waitForElement(time) {
      const self = this
      return new Proxy(this, {
        get(target, action) {
          if(action in target) {
            return async (...args) => {
              self.sessionId = self.sessionId || client.sessionId
              return await waitElementPresent(findElement, self.sessionId, self.selector, time)
                .then(({error, value}) => {
                  if(error) throw new InterfaceError(error)
                  self.elementId = value.ELEMENT
                  return true
                }).then(() => target[action](...args))
            }
          }
        }
      })
    }

    waitForClicable(time) {
      const self = this
      return new Proxy(this, {
        get(target, action) {
          if(action in target) {
            self.sessionId = self.sessionId || client.sessionId
            return async (...args) => {
              const waitEP = await waitElementPresent(findElement, self.sessionId, self.selector, time)

              if(waitEP.error) throw new InterfaceError(waitEP.error)
              self.elementId = waitEP.value.ELEMENT

              const waitC = await waitCondition(present, waitEP.time, (resp) => {
                return resp.value
              }, self.sessionId, self.elementId)
              if(waitC.error) throw new InterfaceError(waitC.error)
              const waitD = await waitCondition(displayed, waitC.time, (resp) => {
                return resp.value
              }, self.sessionId, self.elementId)
              if(waitD.error) throw new InterfaceError(waitD.error)
              return target[action](...args)
            }
          }
        }
      })
    }

    waitForElementVisible(time) {
      const self = this
      return new Proxy(this, {
        get(target, action) {
          if(action in target) {
            self.sessionId = self.sessionId || client.sessionId
            return async (...args) => {
              const waitEP = await waitElementPresent(findElement, self.sessionId, self.selector, time)

              if(waitEP.error) throw new InterfaceError(waitEP.error)
              self.elementId = waitEP.value.ELEMENT

              const waitD = await waitCondition(displayed, waitEP.time, (resp) => {
                return resp.value
              }, self.sessionId, self.elementId)
              if(waitD.error) throw new InterfaceError(waitEP.error)
              return target[action](...args)
            }
          }
        }
      })
    }

    waitForElementPresent(time) {
      const self = this
      return new Proxy(this, {
        get(target, action) {
          if(action in target) {
            self.sessionId = self.sessionId || client.sessionId
            return async (...args) => {
              const waitEP = await waitElementPresent(findElement, self.sessionId, self.selector, time)

              if(waitEP.error) throw new InterfaceError(waitEP.error)
              self.elementId = waitEP.value.ELEMENT

              const waitD = await waitCondition(present, waitEP.time, (resp) => {
                return resp.value
              }, self.sessionId, self.elementId)
              if(waitD.error) throw new InterfaceError(waitEP.error)
              return target[action](...args)
            }
          }
        }
      })
    }

    swipeTo(positios, persent = false) {
      const toRound = (value) => Math.round(value)

      const swipe = async (down, moveup) => {
        const bodyDown = await touchDown(this.sessionId, down)
        handledErrors(this, bodyDown.status, bodyDown.value)
        const bodyMove = await touchMove(this.sessionId, moveup)
        handledErrors(this, bodyMove.status, bodyMove.value)
        const bodyUp = await touchUp(this.sessionId, moveup)
        handledErrors(this, bodyUp.status, bodyUp.value)
      }

      const getElementRects = async () => {
        if(persent) {
          const {height, width} = await client.getWindowSize()
          positios = {x: width / 100 * positios.x, y: height / 100 * positios.y}
        }
        return await this.getRect()
      }

      return {
        fromCenter: async () => {
          const {x, y, width, height, positios} = await getElementRects()
          const center = {x: toRound(x + width / 2), y: toRound(y + height / 2)}
          const down = {params: center}
          const moveAndUp = {params: {x: center.x + positios.xTo, y: center.y + positios.yTo}}
          await swipe(down, moveAndUp)
        },
        fromBottom: async () => {
          const {x, y, width, height, positios} = await getElementRects()
          const bottom = {x: toRound(x + width / 2), y: toRound(y + height - 2)}
          const down = {params: bottom}
          const moveAndUp = {params: {x: bottom.x + positios.xTo, y: bottom.y + positios.yTo}}
          await swipe(down, moveAndUp)
        },
        fromTop: async () => {
          const {x, y, width, height, positios} = await getElementRects()
          const top = {x: toRound(x + width / 2), y: toRound(y - 2)}
          const down = {params: top}
          const moveAndUp = {params: {x: top.x + positios.xTo, y: top.y + positios.yTo}}
          await swipe(down, moveAndUp)
        }
      }
    }

    async getRect() {
      const {width, height} = await this.size()
      const {x, y} = await this.location()
      return {width, heigth, x, y}
    }

    async size() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, size, this.elementId)
    }

    async location() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, location, this.elementId)
    }

    async locationView() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, locationInView, this.elementId)
    }

    async clear() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, clearElementText, this.elementId)
    }

    async getTag() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, tagName, this.elementId)
    }

    async getTthisElement() {
      this.sessionId = this.sessionId || client.sessionId
      if(this.baseElement && !this.baseElement.elementId) {
        await this.baseElement.getTthisElement()
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

    async getElementHTML() {
      !this.elementId && await this.getTthisElement()
      const driverResp = await callWithWrap.call(this, executeScript, `const [element] = arguments ;return element.outerHTML`, {
        ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId
      })
      return driverResp.value
    }

    async getText() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, executeScript, function() {
        const [element] = arguments
        return element.innerText
      }, {ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId})
    }

    async sendKeys(...keys) {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, sendKeys, this.elementId, ...keys)
    }

    async getAttribute(attribute) {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, getAttribute, this.elementId, ...keys)

    }

    async click() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, clickElement, this.elementId)
    }

    async isPresent() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, present, this.elementId)
    }

    async toElement() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, executeScript, function() {
        const [element] = arguments
        element.scrollIntoView()
      }, {ELEMENT: this.elementId, [WEB_EMENET_ID]: this.elementId})
    }

    async isDisplayed() {
      !this.elementId && await this.getTthisElement()
      return callWithWrap.call(this, displayed, this.elementId)
    }

    async mouseDownAndMove({x, y}) {
      //mouse down mouse move mouse up
      !this.elementId && await this.getTthisElement()
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

    get(index) {
      const self = this
      return new Proxy(this, {
        get(target, action) {
          if(action in Element.prototype) {
            return async (...args) => {
              self.sessionId = self.sessionId || client.sessionId
              await self.getElements()
              return self.elements[index][action](...args)
            }
          }
        }
      })
    }

    async count() {
      await this.getElements()
      return this.elements.length
    }

    async forEach(cb) {
      !this.elements && await this.getElements()

      for(let element of this.elements) {
        cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
      }
    }

    async filter(cb) {
      !this.elements && await this.getElements()
      const values = []
      for(let element of this.elements) {
        const resultValue = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
        if(resultValue) {
          values.push(element)
        }
      }
      return values
    }

    waitForElements(time) {
      const self = this
      return new Proxy(this, {
        get(target, action) {
          if(action in target) {
            return async (...args) => {
              self.sessionId = self.sessionId || client.sessionId
              const {error, value} = await waitElementPresent(findElements, self.sessionId, self.selector, time)
              if(error) throw new InterfaceError(error)
              self.elements = []
              value.forEach(({ELEMENT}) => {
                self.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
              })
              return self
              return target[action](...args)
            }
          }
        }
      })
    }

    async getElements() {
      this.sessionId = this.sessionId || client.sessionId
      this.elements = []
      if(this.baseElement && !this.baseElement.elementId) {
        await this.baseElement.getTthisElement()
        const driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
        driverResp.value.forEach(({ELEMENT}) => {
          this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
        })
      } else if(this.baseElement && this.baseElement.elementId) {
        const driverResp = await callWithWrap.call(this, elementsFromElement, this.baseElement.elementId, this.selector)
        driverResp.value.forEach(({ELEMENT}) => {
          this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
        })
      } else {
        const driverResp = await callWithWrap.call(this, findElements, this.selector)
      }
      if(this.elements.length) {
        throw new InterfaceError(`Elements with selector ${this.selector} not found`)
      }
      return this.elements
    }
  }

  return {Element, Elements}
}


module.exports = elementsInitializer
