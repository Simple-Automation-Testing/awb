const { getElementText, moveTo, mouseDown, elementFromElement, elementsFromElement, present, displayed } = require('./core')
const { clickElement, sendKeys, getAttribute, executeScript, waitCondition, findElements, findElement, clearElementText } = require('./core')

const { returnStringType, waitElementPresent } = require('./util')

const { InterfaceError } = require('./interfaceError')

const { browserInstance } = require('./client')

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'


class Element {

  constructor(selector, sessionId = null, elementId = null, baseElement = null) {

    if (sessionId instanceof browserInstance) {
      sessionId = sessionId.sessionId
    }

    this.selector = selector
    this.sessionId = sessionId
    this.elementId = elementId
    this.baseElement = baseElement
  }

  async waitForElement(time) {
    this.sessionId = this.sessionId || global.___sessionId
    const { error, value } = await waitElementPresent(findElement, this.sessionId, this.selector, time)
    if (error) throw new InterfaceError(error)
    this.elementId = value.ELEMENT
    return this
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
    if (this.baseElement) {
      if (!this.baseElement.elementId) {
        await this.baseElement.getTthisElement()
        const { value: { ELEMENT } } = await elementFromElement(this.sessionId, this.baseElement.elementId, this.selector)
        this.elementId = ELEMENT
      }
    } else {
      const { value: { ELEMENT } } = await findElement(this.sessionId, this.selector)
      this.elementId = ELEMENT
    }
  }

  async getElementHTML() {
    !this.elementId
      && await this.getTthisElement()

    const { value } = await executeScript(this.sessionId, function () {
      const [element] = arguments
      return element.outerHTML
    }, {
        ELEMENT: this.elementId,
        [WEB_EMENET_ID]: this.elementId
      })

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

  getElement(selector) {
    return new Element(selector, this.sessionId, null, this)
  }

  getElements(selector) {
    return new Elements(selector, this.sessionId, this)
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


class Elements {

  constructor(selector, sessionId = null, baseElement = null) {
    if (sessionId instanceof browserInstance) {
      sessionId = sessionId.sessionId
    }
    this.baseElement = baseElement
    this.selector = selector
    this.sessionId = sessionId
    this.elements = null
  }

  async map(cb) {
    if (!this.elements) {
      await this.getElements()
    }
    const values = []
    for (let element of this.elements) {
      const result = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
      values.push(result)
    }
    return values
  }

  async get(index) {
    if (!this.elements) {
      await this.getElements()
    }
    return this.elements[index]
  }

  async count() {
    if (!this.elements) {
      await this.getElements()
    }
    return this.elements.length
  }

  async forEach(cb) {
    if (!this.elements) {
      await this.getElements()
    }
    for (let element of this.elements) {
      cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
    }
  }

  async filter(cb) {
    if (!this.elements) {
      await this.getElements()
    }
    const values = []
    for (let element of this.elements) {
      const resultValue = cb.then || returnStringType(cb) === '[object AsyncFunction]' ? await cb(element) : cb(element)
      if (resultValue) {
        values.push(element)
      }
    }
    return values
  }

  async waitForElements(time) {
    this.sessionId = this.sessionId || global.___sessionId
    const { error, value } = await waitElementPresent(findElements, this.sessionId, this.selector, time)
    if (error) throw new InterfaceError(error)
    this.elements = []
    value.forEach(({ ELEMENT }) => {
      this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
    })
    return this
  }

  async getElements() {
    if (!this.sessionId) {
      this.sessionId = this.sessionId || global.___sessionId
    }
    if (!this.baseElement) {
      const { value } = await findElements(this.sessionId, this.selector)
      if (!this.elements && value.length) {
        this.elements = []
      }
      value.forEach(({ ELEMENT }) => {
        this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
      })
    }
    if (this.baseElement) {
      if (!this.baseElement.elementId) {
        await this.baseElement.getTthisElement()
      }
      const { value } = await elementsFromElement(this.sessionId, this.baseElement.elementId, this.selector)
      if (!this.elements && value.length) {
        this.elements = []
      }
      value.forEach(({ ELEMENT }) => {
        this.elements.push(new Element(this.selector, this.sessionId, ELEMENT))
      })
    }
  }
}

module.exports = {
  element: (...args) => new Element(...args),
  elements: (...args) => new Elements(...args),
  elementInstance: Element,
  elementsInstance: Elements
}
