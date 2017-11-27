const {
  resizeWindow,
  initSession,
  killSession,
  findElements,
  findElement,
  goToUrl,
  getUrl,
  getTitle,
  clickElement,
  sendKeys,
  getAttribute,
  executeScript,
  syncWithDOM
} = require('./core')

class Element {
  constructor(selector, sessionId) {
    this.selector = selector
    this.sessionId = sessionId
    this.elementId = null
  }

  async getElementHTML() {
    const body = await executeScript(this.sessionId, function () {
      const [element] = arguments
      return document.querySelector(element).outerHTML
    }, this.selector)

    return body.value
  }

  async getText() {
    const body = await executeScript(this.sessionId, function () {
      const [element] = arguments
      return document.querySelector(element).innerText
    }, this.selector)

    return body.value
  }

  async click() {
    const { value: { ELEMENT } } = await findElement(this.sessionId, this.selector)
    this.elementId = ELEMENT
    const body = await clickElement(this.sessionId, this.elementId)
    return body
  }

  async change() {
    const simulant = require('simulant')
  }
}

module.exports = Element