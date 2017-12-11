const { getElementText, moveTo, mouseDown, elementFromElement, elementsFromElement, present, displayed } = require('./core')
const { clickElement, sendKeys, getAttribute, executeScript, waitCondition, findElements, findElement, clearElementText } = require('./core')

const { returnStringType, waitElementPresent } = require('./util')

const { InterfaceError } = require('./interfaceError')

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'

class Element {

  constructor(selector, sessionId, elementId = null) {
    this.selector = selector
    this.sessionId = sessionId
    this.elementId = elementId
  }

  async waitForElement(time) {
    this.sessionId = this.sessionId || global.___sessionId
    const result = await waitElementPresent(findElement, this.sessionId, this.selector, time)
    if (result.ELEMENT) {
      this.elementId = result.ELEMENT
    } else if (result.message.includes('no such element: Unable to locate elemen')) {
      throw new InterfaceError(result.message, __filename)
    }
  }

  async clear() {
    await clearElementText(this.sessionId, this.elementId)
  }

  async waitForElementPresent(time) {
    await this.waitForElement(time)
    const isPresent = await this.isPresent()
    if (!isPresent) {
      throw new InterfaceError(`elemen does not present`, __filename)
    }
  }

  async waitForElementVisible(time) {
    await this.waitForElement(time)
    const isVisible = await this.isDisplayed()
    if (!isVisible) {
      throw new InterfaceError(`elemen does not visible`, __filename)
    }
  }

  async getTthisElement() {
    this.sessionId = this.sessionId || global.___sessionId
    const { value: { ELEMENT } } = await findElement(this.sessionId, this.selector)
    this.elementId = ELEMENT
  }

  async getElementHTML() {
    const { value } = await executeScript(this.sessionId, function () {
      const [element] = arguments
      return document.querySelector(element).outerHTML
    }, this.selector)
    return value
  }

  async getText() {
    !this.elementId
      && await this.getTthisElement()

    const body = await executeScript(this.sessionId, function () {
      const [element] = arguments
      return element.innerText
    }, {
        ELEMENT: this.elementId,
        [WEB_EMENET_ID]: this.elementId
      })

    return body.value
  }

  async getElement(selector) {
    !this.elementId
      && await this.getTthisElement()

    const { value: { ELEMENT } } = await elementFromElement(this.sessionId, this.elementId, selector)
    return new Element(selector, this.sessionId, ELEMENT)
  }

  async getElements(selector) {
    const elements = []
    elements.get = function (index) {
      return this[index]
    }
    elements.each = async function (cb) {
      for (let element of this) {
        cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
      }
    }

    elements.mappy = async function (cb) {
      const values = []
      for (let element of this) {
        const result = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
        values.push(result)
      }
      return values
    }

    !this.elementId
      && await this.getTthisElement()
    const { value } = await elementsFromElement(this.sessionId, this.elementId, selector)
    value.forEach(({ ELEMENT }) => {
      elements.push(new Element(selector, this.sessionId, ELEMENT))
    })
    return elements
  }

  async sendKeys(keys) {
    !this.elementId
      && await this.getTthisElement()
    const body = await sendKeys(this.sessionId, this.elementId, keys)

    return body
  }

  async getAttribute(attribute) {
    !this.elementId
      && await this.getTthisElement()
    const { value } = await getAttribute(this.sessionId, this.elementId, attribute)
    return value
  }

  async click() {
    !this.elementId
      && await this.getTthisElement()
    const body = await clickElement(this.sessionId, this.elementId)
    return body
  }

  async isPresent() {
    !this.elementId
      && await this.getTthisElement()
    const { value } = await present(this.sessionId, this.elementId)
    return value
  }

  async toElement() {
    !this.elementId
      && await this.getTthisElement()
    const { value } = await executeScript(this.sessionId, 'arguments[0].scrollIntoView()', {
      ELEMENT: this.elementId,
      [WEB_EMENET_ID]: this.elementId
    })
  }

  async isDisplayed() {
    !this.elementId
      && await this.getTthisElement()
    const { value } = await displayed(this.sessionId, this.elementId)
    return value
  }

  async mouseDownAndMove({ x, y }) {
    //mouse down mouse move mouse up
    !this.elementId
      && await this.getTthisElement()
    await moveTo(this.sessionId, { element: this.elementId })
    await mouseDown(this.sessionId, {
      ELEMENT: this.elementId,
      [WEB_EMENET_ID]: this.elementId
    })
    const body = await moveTo(this.sessionId, { x, y })
  }
}

module.exports = (...args) => new Element(...args)
module.exports.elementInstance = Element
