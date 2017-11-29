const { expect } = require('chai')

const { resizeWindow, initSession, killSession, findElements, findElement, goToUrl, getUrl } = require('../core')
const { getTitle, clickElement, sendKeys, getAttribute, executeScript, sleep, syncWithDOM } = require('../core')
const { getElementText, moveTo, mouseDown, elementFromElement, elementsFromElement } = require('../core')

const Element = require('../element')

describe.only('Element', () => {
  //parts
  let sessionId = null
  let elementButton = null
  let elementDropZone = null
  let elementInput = null
  //selectors
  const addnewname = 'button'
  const dropzone = '.dropzone'
  const dropitem = '.dropitem'
  const firstname = '[placeholder="firstname"]'

  before(async () => {
    const body = await initSession()
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.be.exist
    sessionId = body.sessionId
    await goToUrl(sessionId, 'http://localhost:9090')
    elementButton = new Element(addnewname, sessionId)
    elementDropZone = new Element(dropzone, sessionId)
    elementInput = new Element(firstname, sessionId)
  })

  after(async () => {
    await killSession(sessionId)
  })

  it('getElementHTML', async () => {
    const nodeHtml = await elementButton.getElementHTML()
    expect(nodeHtml.includes('button')).to.be.true
    expect(nodeHtml.includes('Add new name')).to.be.true
  })

  it('getText', async () => {
    const nodeText = await elementButton.getText()
    expect(nodeText).to.eql('Add new name')
  })

  it('click', async () => {
    const clickResult = await elementButton.click()
    expect(clickResult.status).to.eql(0)
  })

  it('element get element', async () => {
    expect(elementDropZone).to.be.instanceOf(Element)
    {
      const elementDropItem = await elementDropZone.getElement(dropitem)
      expect(elementDropItem).to.be.instanceOf(Element)
    }
  })

  it('element get elements', async () => {
    expect(elementDropZone).to.be.instanceOf(Element)
    let dropItems = null
    {
      dropItems = await elementDropZone.getElements(dropitem)
      dropItems.forEach(element => {
        expect(element).to.be.instanceOf(Element)
      })
    }
    //for each
    {
      await dropItems.each(async (element) => {
        const html = await element.getElementHTML()
        expect(html).to.includes('dropitem')
        expect(html).to.includes('draggable="true"')
      })
    }
    //map
    {
      const textArr = await dropItems.mappy(async (element) => {
        return await element.getText()
      })
      expect(Array.isArray(textArr)).to.eql(true)
      textArr.forEach(str => {
        expect(typeof str).to.eql('string')
      })
    }
  })

  it('send keys to element and get attribure', async () => {
    expect(elementInput).to.be.instanceOf(Element)
    const inputValue = '!#!#!@#!'
    {
      const body = await elementInput.sendKeys(inputValue)
      expect(body).to.be.exist
      expect(body.sessionId).to.eql(sessionId)
    }
    {
      const value = await elementInput.getAttribute('value')
      expect(value).to.be.exist
      expect(value).to.eql(inputValue)
    }
  })
})