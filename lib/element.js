

const {returnStringType, waitElementPresent} = require('./util')

const {InterfaceError, handledErrors} = require('./interfaceError')

const {STATUS_FROM_DRIVER} = require('./responseSeleniumStatus')

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'

function elementsInitializer(requests, client) {
  const {getElementText, moveTo, mouseDown, elementFromElement, elementsFromElement, present, displayed, size, location, locationInView} = requests
  const {clickElement, sendKeys, getAttribute, executeScript, waitCondition, findElements, findElement, clearElementText, tagName} = requests
  const {touchClick, touchDown, touchDoubleclick, touchLongclick, touchFlick, touchMove, touchPerform, touchMultiperform, touchScroll, touchUp} = requests


  async function elementHandler() {
    const {status} = await tagName(this.sessionId, this.elementId)
    if(status !== 0) {
      const {status, value: {ELEMENT}} = await this.findElement(this.sessionId, this.selector)
      if(status === 0) {
        this.elementId = ELEMENT
        return true
      }
      return false
    }
  }

  async function handleElement(body) {
    try {
      handledErrors[STATUS_FROM_DRIVER[body.status]]
        && handledErrors[STATUS_FROM_DRIVER[body.status]](
          this.sessionId, this.selector, JSON.stringify(body.value))
    } catch(error) {
      const status = await elementHandler.apply(this)
      if(status) {
        handledErrors[STATUS_FROM_DRIVER[body.status]]
          && handledErrors[STATUS_FROM_DRIVER[body.status]](
            this.sessionId, this.selector, JSON.stringify(body.value))
      }
      throw error
    }
  }

  class Element {

    constructor(selector, sessionId = null, elementId = null, baseElement = null) {
      this.selector = selector
      this.sessionId = sessionId
      this.elementId = elementId
      this.baseElement = baseElement
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
            return async (...args) => {
              self.sessionId = self.sessionId || client.sessionId
              return await waitElementPresent(findElement, self.sessionId, self.selector, time)
                .then(({error, value}) => {
                  if(error) throw new InterfaceError(error)
                  self.elementId = value.ELEMENT
                  return true
                }).then(self.isDisplayed.bind(self)).then((isVisible) => {
                  if(isVisible) {
                    return present(self.sessionId, self.elementId)
                  } else {
                    throw new InterfaceError(`${self.selector} element does not visible`, __filename)
                  }
                }).then(({value, status}) => {
                  return displayed(self.sessionId, self.elementId)
                }).then(({status, value}) => {
                  handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, JSON.stringify(value))
                  return target[action](...args)
                })
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
            return async (...args) => {
              self.sessionId = self.sessionId || client.sessionId
              return await waitElementPresent(findElement, self.sessionId, self.selector, time)
                .then(({error, value}) => {
                  if(error) throw new InterfaceError(error)
                  self.elementId = value.ELEMENT
                  return true
                }).then(self.isDisplayed.bind(self)).then((isVisible) => {
                  if(isVisible) {
                    return target[action](...args)
                  } else {
                    throw new InterfaceError(`${self.selector} element does not visible`, __filename)
                  }
                })
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
            return async (...args) => {
              self.sessionId = self.sessionId || client.sessionId
              return await waitElementPresent(findElement, self.sessionId, self.selector, time)
                .then(({error, value}) => {
                  if(error) throw new InterfaceError(error)
                  self.elementId = value.ELEMENT
                  return true
                }).then(self.isPresent.bind(self)).then((isPresent) => {
                  if(isPresent) {
                    return target[action](...args)
                  } else {
                    throw new InterfaceError(`${self.selector} element does not visible`, __filename)
                  }
                })
            }
          }
        }
      })
    }

    swipeTo(positios, persent = false) {
      const toRound = (value) => Math.round(value)

      const swipe = async (down, moveup) => {
        const bodyDown = await touchDown(this.sessionId, down)
        handledErrors[STATUS_FROM_DRIVER[bodyDown.status]] && handledErrors[STATUS_FROM_DRIVER[bodyDown.status]](this.sessionId, this.selector, JSON.stringify(bodyDown.value))
        const bodyMove = await touchMove(this.sessionId, moveup)
        handledErrors[STATUS_FROM_DRIVER[bodyMove.status]] && handledErrors[STATUS_FROM_DRIVER[bodyMove.status]](this.sessionId, this.selector, JSON.stringify(bodyMove.value))
        const bodyUp = await touchUp(this.sessionId, moveup)
        handledErrors[STATUS_FROM_DRIVER[bodyUp.status]] && handledErrors[STATUS_FROM_DRIVER[bodyUp.status]](this.sessionId, this.selector, JSON.stringify(bodyUp.value))
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
      !this.elementId
        && await this.getTthisElement()
      const {status, value} = await size(this.sessionId, this.elementId)
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, JSON.stringify(value))
      return value
    }

    async location() {
      !this.elementId
        && await this.getTthisElement()
      const {status, value} = await location(this.sessionId, this.elementId)
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, JSON.stringify(value))
      return value
    }

    async locationView() {
      !this.elementId
        && await this.getTthisElement()
      const {status, value} = await locationInView(this.sessionId, this.elementId)
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, JSON.stringify(value))
      return value
    }

    async clear() {
      !this.elementId && await this.getTthisElement()
      const {status, body} = await clearElementText(this.sessionId, this.elementId)
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, JSON.stringify(body.value))
    }

    async getTthisElement() {
      this.sessionId = this.sessionId || client.sessionId
      console.log('here get this element', this.sessionId, this.selector, '<-', this.sessionId, this instanceof Element)
      if(this.baseElement) {
        if(!this.baseElement.elementId) {
          await this.baseElement.getTthisElement()
          const {status, value: {ELEMENT}} = await elementFromElement(this.sessionId, this.baseElement.elementId, this.selector)
          handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, ELEMENT)
          this.elementId = ELEMENT
        } else {
          const {status, value: {ELEMENT}} = await elementFromElement(this.sessionId, this.baseElement.elementId, this.selector)
          handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, ELEMENT)
          this.elementId = ELEMENT
        }
      } else {
        const {status, value: {ELEMENT}} = await findElement(this.sessionId, this.selector)
        handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, ELEMENT)
        this.elementId = ELEMENT
      }
    }

    async getElementHTML() {
      !this.elementId
        && await this.getTthisElement()
      const {status, value} = await executeScript(this.sessionId, function() {
        const [element] = arguments
        return element.outerHTML
      }, {
          ELEMENT: this.elementId,
          [WEB_EMENET_ID]: this.elementId
        })
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, value)
      return value
    }

    async getText() {
      !this.elementId
        && await this.getTthisElement()

      const {status, value} = await executeScript(this.sessionId, function() {
        const [element] = arguments
        return element.innerText
      }, {
          ELEMENT: this.elementId,
          [WEB_EMENET_ID]: this.elementId
        })

      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector)
      return value
    }

    element(selector) {
      return new Element(selector, this.sessionId, null, this)
    }

    elements(selector) {
      return new Elements(selector, this.sessionId, this)
    }

    async sendKeys(...keys) {
      !this.elementId
        && await this.getTthisElement()
      const {status, value} = await sendKeys(this.sessionId, this.elementId, ...keys)
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector)
      return value
    }

    async getAttribute(attribute) {
      !this.elementId
        && await this.getTthisElement()
      const {status, value} = await getAttribute(this.sessionId, this.elementId, attribute)
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector)
      return value
    }

    async click() {
      !this.elementId
        && await this.getTthisElement()
      const {status, value} = await clickElement(this.sessionId, this.elementId)
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](
        this.sessionId, this.selector, `error was throwed from element click function, ${value.message}`)
    }

    async isPresent() {
      !this.elementId
        && await this.getTthisElement()
      const {value, status} = await present(this.sessionId, this.elementId)
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector)
      return value
    }

    async toElement() {
      !this.elementId
        && await this.getTthisElement()
      const {value, status} = await executeScript(this.sessionId, 'arguments[0].scrollIntoView()', {
        ELEMENT: this.elementId,
        [WEB_EMENET_ID]: this.elementId
      })
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector)
    }

    async isDisplayed() {
      !this.elementId
        && await this.getTthisElement()
      const {status, value} = await displayed(this.sessionId, this.elementId)
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, JSON.stringify(value))
      return value
    }

    async mouseDownAndMove({x, y}) {
      //mouse down mouse move mouse up
      !this.elementId
        && await this.getTthisElement()
      await moveTo(this.sessionId, {element: this.elementId})
      await mouseDown(this.sessionId, {
        ELEMENT: this.elementId,
        [WEB_EMENET_ID]: this.elementId
      })
      const {value, status} = await moveTo(this.sessionId, {x, y})
      handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector, JSON.stringify(value))
    }
  }

  class Elements {

    constructor(selector, sessionId = null, baseElement = null) {
      this.baseElement = baseElement
      this.selector = selector
      this.sessionId = sessionId
      this.elements = null
      return new Proxy(this, {
        get(target, action) {
          if(action in target) {
            return target[action]
          }
        }
      })
    }

    async map(cb) {
      if(!this.elements) {
        await this.getElements()
      }
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
              return await self.getElements()
                .then((elements) => {
                  return self.elements[index]
                }).then((element) => element[action](...args))
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
      if(!this.elements) {
        await this.getElements()
      }
      for(let element of this.elements) {
        cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
      }
    }

    async filter(cb) {
      if(!this.elements) {
        await this.getElements()
      }
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
              return await waitElementPresent(findElements, self.sessionId, self.selector, time)
                .then(({error, value}) => {
                  if(error) throw new InterfaceError(error)
                  self.elementId = value.ELEMENT
                  self.elements = []
                  value.forEach(({ELEMENT}) => {
                    self.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
                  })
                  return self
                }).then(() => target[action](...args))
            }
          }
        }
      })
    }

    async getElements() {
      this.sessionId = this.sessionId || client.sessionId
      this.elements = []
      if(!this.baseElement) {
        const {status, value} = await findElements(this.sessionId, this.selector)
        handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector)
        value.forEach(({ELEMENT}) => {
          this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
        })
      }
      if(this.baseElement) {
        if(!this.baseElement.elementId) {
          await this.baseElement.getTthisElement()
        }
        const {value, status} = await elementsFromElement(this.sessionId, this.baseElement.elementId, this.selector)
        handledErrors[STATUS_FROM_DRIVER[status]] && handledErrors[STATUS_FROM_DRIVER[status]](this.sessionId, this.selector)
        value.forEach(({ELEMENT}) => {
          this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
        })
      }
      return this.elements
    }
  }

  return {Element, Elements}
}


module.exports = elementsInitializer
