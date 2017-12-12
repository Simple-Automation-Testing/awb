const { expect } = require('chai')

const { resizeWindow, initSession, killSession, findElements, findElement, goToUrl, getUrl } = require('../../interface/core')

const element = require('../../interface/element')
const Element = element.elementInstance

describe.only('Element', () => {
  //parts
  let sessionId = null
  let elementButton = null
  let elementDropZone = null
  let elementInput = null
  let elementDisplayNoneDiv = null
  let elementBottomDiv = null
  let elementHandle = null
  let elementBar = null
  //selectors
  const handleswiper = '.my-handle'
  const addnewname = 'button'
  const dropzone = '.dropzone'
  const dropitem = '.dropitem'
  const firstname = '[placeholder="firstname"]'
  const dispaynonediv = '.not.displayed'
  const bottomdiv = '.bottom.div'
  const bar = '.bar.bar-0'

  before(async () => {
    const body = await initSession()
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.be.exist
    sessionId = body.sessionId
    await goToUrl(sessionId, 'http://localhost:9090')
    elementButton = element(addnewname, sessionId)
    elementDropZone = element(dropzone, sessionId)
    elementInput = element(firstname, sessionId)
    elementBottomDiv = element(bottomdiv, sessionId)
    elementDisplayNoneDiv = element(dispaynonediv, sessionId)
    elementHandle = element(handleswiper, sessionId)
    elementBar = element(bar, sessionId)
  })

  after(async () => {
    await killSession(sessionId)
  })

  it('element getElementHTML', async () => {
    const nodeHtml = await elementButton.getElementHTML()
    expect(nodeHtml.includes('button')).to.be.true
    expect(nodeHtml.includes('Go to async form')).to.be.true
  })

  it('element getText', async () => {
    const nodeText = await elementButton.getText()
    expect(nodeText).to.eql('Go to async form')
  })

  // it('element click', async () => {
  //   // const clickResult = await elementButton.click()
  //   expect(clickResult.status).to.eql(0)
  // })

  it('element get element', async () => {
    expect(elementDropZone).to.be.instanceOf(Element)

    const textInsideDropZone = await elementDropZone.getText()
    expect(textInsideDropZone).to.be.exist
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
    //filter
    {
      const elementsWith = await dropItems.filter(async (element) => {
        const text = await element.getText()
        return text.includes('0')
      })
      expect(elementsWith.length).to.eq(1)
      expect(await elementsWith[0].getText()).to.includes('0')
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

  it('element isPresent', async () => {
    expect(elementDisplayNoneDiv).to.be.instanceOf(Element)
    expect(elementBottomDiv).to.be.instanceOf(Element)
    {
      const ispresent = await elementDisplayNoneDiv.isPresent()
      expect(ispresent).to.eql(true)
    }
    {
      const ispresent = await elementBottomDiv.isPresent()
      expect(ispresent).to.eql(true)
    }
  })

  it('element isDisplayed', async () => {
    expect(elementDisplayNoneDiv).to.be.instanceOf(Element)
    expect(elementBottomDiv).to.be.instanceOf(Element)
    {
      const isdisplayed = await elementDisplayNoneDiv.isDisplayed()
      expect(isdisplayed).to.eql(false)
    }
    {
      const isdisplayed = await elementBottomDiv.isDisplayed()
      expect(isdisplayed).to.eql(true)
    }
  })

  it('element mouseDownAndMove', async () => {
    let styleBefore = null
    let styleAfter = null
    {
      const baseStyle = await elementBar.getAttribute('style')
      expect(baseStyle).to.be.exist
      styleBefore = baseStyle
    }
    {
      await elementHandle.mouseDownAndMove({ x: 60, y: 0 })
    }
    {
      const changedStyle = elementBar.getAttribute('style')
      expect(changedStyle).to.be.exist
      expect(styleBefore).to.not.eql(changedStyle)
    }
  })

  it('element toElement', async () => {
    const body = await elementBottomDiv.toElement()
  })
})