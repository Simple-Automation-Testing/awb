const { resizeWindow, initSession, killSession, findElements, findElement, goToUrl, getUrl } = require('./core')
const { getTitle, clickElement, sendKeys, getAttribute, executeScript, sleep, syncWithDOM } = require('./core')
const { getElementText, moveTo, mouseDown, elementFromElement, elementsFromElement, present, displayed } = require('./core')

const { returnStringType } = require('./util')

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'
class Element {

  constructor(selector, sessionId = ___sessionId, elementId = null) {
    this.selector = selector
    this.sessionId = sessionId
    this.elementId = elementId
  }

  async getTthisElement() {
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
    const body = await executeScript(this.sessionId, function () {
      const [element] = arguments
      return document.querySelector(element).innerText
    }, this.selector)

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
    value.forEach(id => {
      elements.push(new Element(selector, this.sessionId, id))
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
    console.log(value)
  }

  async isDisplayed() {
    !this.elementId
      && await this.getTthisElement()
    const { value } = await displayed(this.sessionId, this.elementId)
    return value
  }
}

module.exports = Element