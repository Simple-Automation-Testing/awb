const { expect } = require('chai')

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
  syncWithDOM,
  getElementText
} = require('../core')

describe('core function positive scenario', () => {
  //test variables
  let sessionId = null
  let elementButton = null
  let elementInput_firstname = null
  let elementInput_lastname = null
  const baseURL = 'http://localhost:9090'
  const testString1 = 'test 1'
  const testString2 = 'test 2'
  //css selectors
  const firstname = '[placeholder="firstname"]'
  const lastname = '[placeholder="lastname"]'
  const addnewname = 'button'

  it('get sessionId', async () => {
    const body = await initSession()
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.be.exist
    sessionId = body.sessionId
  })

  it('go to url', async () => {
    const body = await goToUrl(sessionId, 'http://localhost:9090')
    expect(body.sessionId).to.eql(sessionId)
    expect(body.status).to.eql(0)
    expect(body.value).to.eql(null)
  })

  it('get element (input)', async () => {
    {
      const body = await findElement(sessionId, firstname)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value.ELEMENT).to.be.exist
      elementInput_firstname = body.value.ELEMENT
    }
    {
      const body = await findElement(sessionId, lastname)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value.ELEMENT).to.be.exist
      elementInput_lastname = body.value.ELEMENT
    }
  })

  it('get element (button)', async () => {
    const body = await findElement(sessionId, addnewname)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value.ELEMENT).to.be.exist
    elementButton = body.value.ELEMENT
  })

  it('get elements (buttons)', async () => {
    const body = await findElements(sessionId, addnewname)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value.length).to.eql(9)
    expect(body.value[0].ELEMENT).to.be.exist
    expect(body.value[0].ELEMENT).to.eql(elementButton)
  })

  it('send keys to input (1)', async () => {
    const body = await sendKeys(sessionId, elementInput_firstname, testString1)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(null)
  })

  it('get value from input (1)', async () => {
    const body = await getAttribute(sessionId, elementInput_firstname, 'value')
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(testString1)
  })

  it('send keys to input (2)', async () => {
    const body = await sendKeys(sessionId, elementInput_lastname, testString2)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(null)
  })

  it('get value from input (2)', async () => {
    const body = await getAttribute(sessionId, elementInput_lastname, 'value')
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(testString2)
  })

  it('combine data', async () => {
    let elements
    const elValue = []
    const elementSelector = '[draggable="true"]'
    {
      const body = await findElements(sessionId, elementSelector)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value.length).to.eql(9)
      elements = body.value
    }
    {
      for (let item of elements) {
        const body = await getElementText(sessionId, item.ELEMENT)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.be.exist
        elValue.push(body.value)
      }
      console.log(elValue)
    }
  })

  it('combine data by execute script', async () => {
    {
      const body = await executeScript(sessionId, function () {
        const elValue = []
        document.querySelectorAll('[draggable="true"]').forEach(item => {
          elValue.push(item.innerText)
        })
        return elValue
      })
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.be.exist 
      console.log(body.value)
    }
  })

  it('execute script', async () => {
    {
      const body = await executeScript(sessionId, function () {
        return document.body.baseURI
      })
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.eql(`${baseURL}/`)
    }
    {
      const body = await executeScript(sessionId, 'return document.querySelector(arguments[0]).placeholder', lastname)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.eql('lastname')
    }
  })

  it('kill session', async () => {
    const body = await killSession(sessionId)
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.eql(sessionId)
    expect(body.value).to.eql(null)
  })
})



const test = async () => {
  const firstname = '[placeholder="firstname"]'
  const lastname = '[placeholder="lastname"]'

  const { sessionId } = await initSession()
  await goToUrl(sessionId, 'http://localhost:9090')
  await syncWithDOM(sessionId, 50000)
  const a = await executeScript(sessionId, function () {
    return document.body.baseURI
  })
  await resizeWindow(sessionId, { width: 1200, height: 900 })
  const getStaerted = await findElement(sessionId, '[title="Get started"]')
  const dataElement = await findElement(sessionId, firstname)
  console.log(dataElement)
  const dataElements = await findElements(sessionId, firstname)
  console.log(dataElements)
  // const data1 = await getUrl(sessionId);
  // const data2 = await getTitle(sessionId);
  // await clickElement(sessionId, getStaerted)
  // const loginTab = await findElement(sessionId, '.tabs__link:nth-child(1)');
  // await clickElement(sessionId, loginTab);
  // const emailInput = await findElement(sessionId, '#id5');
  // const passwordInput = await findElement(sessionId, '#id9');
  // await sendKeys(sessionId, emailInput, 'test_d@weblium.com');
  // await sendKeys(sessionId, passwordInput, 'password');
  await killSession(sessionId)
}
