const { expect } = require('chai')

const { Keys } = require('../../../interface/event/keys')

const SELENIUM_STATUSES = require('../../../interface/reponseSeleniumStatus')

const { defaultFirefoxCapabilities, defaultSafariCapabilities } = require('../../../interface/capabilitiesAndBaseOpts')

const { InterfaceError } = require('../../../interface/interfaceError')

const { resizeWindow, initSession, killSession, findElements, findElement, goToUrl, getUrl, setScriptTimeout } = require('../../../interface/core')
const { getTitle, clickElement, sendKeys, getAttribute, executeScript, sleep, syncWithDOM, clearElementText } = require('../../../interface/core')
const { getElementText, moveTo, mouseDown, elementFromElement, elementsFromElement, present, displayed, executeScriptAsync } = require('../../../interface/core')
const { maximizeWindow, minimizeWindow, getScreenshot } = require('../../../interface/core')

describe('core function positive scenario', () => {
  //test variables
  describe('positive', () => {
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
    //mouse down mouse move mouse up
    const bar3 = '.bar.bar-0'
    const handler = '.my-handle'

    before('get session', async () => {
      {
        const body = await initSession()
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.be.exist
        sessionId = body.sessionId
      }
    })

    after('kill session ', async () => {
      const body = await killSession(sessionId)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.eql(null)
    })

    it.skip('minimize window', async () => {
      const body = await minimizeWindow(sessionId)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.eql(null)
    })

    it('maximize window', async () => {
      const body = await maximizeWindow(sessionId)
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.eql(null)
    })

    it('resize window', async () => {
      const body = await resizeWindow(sessionId, { width: 1200, height: 900 })
      expect(body.status).to.eql(0)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.value).to.eql(null)
    })

    it.only('go to url', async () => {
      const body = await goToUrl(sessionId, baseURL)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.status).to.eql(0)
      expect(body.value).to.eql(null)
    })

    it('get url', async () => {
      const body = await getUrl(sessionId)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.status).to.eql(0)
      expect(body.value).to.eql(`${baseURL}/`)
    })

    it('take screen', async () => {
      const body = await getScreenshot(sessionId)
      require('fs').writeFileSync('test.png', new Buffer(body.value, 'base64'))
    })

    it('mouse down move up', async () => {
      let initialStyle = null
      let changedStyleValue = null
      let bar3ElementId = null
      {
        const { value: { ELEMENT } } = await findElement(sessionId, bar3)
        expect(ELEMENT).to.be.exist
        bar3ElementId = ELEMENT
      }
      {
        //get initial style
        const body = await getAttribute(sessionId, bar3ElementId, 'style')
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.be.exist
        initialStyle = body.value
      }
      {
        //mouse down mouse move mouse up
        const { value: { ELEMENT } } = await findElement(sessionId, handler)
        const bodyMouseMoveTo = await moveTo(sessionId, { element: ELEMENT })
        const bodyMouseDown = await mouseDown(sessionId, handler)
        const bodyMouseMove = await moveTo(sessionId, { x: 60, y: 0 })
      }
      {
        const body = await getAttribute(sessionId, bar3ElementId, 'style')
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.be.exist
        changedStyleValue = body.value
      }
      {
        expect(changedStyleValue).to.not.eql(initialStyle)
      }
    })

    it('get title', async () => {
      const body = await getTitle(sessionId)
      expect(body.sessionId).to.eql(sessionId)
      expect(body.status).to.eql(0)
      expect(body.value).to.eql('Webdriver Interface')
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
      expect(body.value.length).to.eql(11)
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

    it.skip('execute script async', async () => {
      const body = await executeScriptAsync(sessionId, function (callback) {
        fetch('http://localhost:8085/bar', {
          node: 'no-cors'
        }).then(resp => resp.json()).then(callback)
      })
      expect(body.value).to.eql({ bar: 'bar' })
    })

    it('send keys with enter', async () => {
      let elementInput = null
      let elementInputValue = null
      let apearDisapearField = null
      const enterInput = '[placeholder="KEY ENTER"]'
      const apearDisapearFieldSelector = '.apear.disapear'
      {
        const body = await findElement(sessionId, enterInput)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        elementInput = body.value.ELEMENT
      }
      {
        await sendKeys(sessionId, elementInput, testString1)
        const body = await sendKeys(sessionId, elementInput, Keys.ENTER)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql(null)
      }
      {
        const body = await findElement(sessionId, apearDisapearFieldSelector)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        apearDisapearField = body.value.ELEMENT
      }
      {
        const body = await getElementText(sessionId, apearDisapearField)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.be.exist
        expect(body.value).to.eql(testString1)
      }
    })

    it('element from element', async () => {
      const dropZoneSelector = '.dropzone'
      const dropItemSelector = '[draggable="true"]'
      let dropZone = null
      let dropItem = null
      {
        const body = await findElement(sessionId, dropZoneSelector)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        dropZone = body.value.ELEMENT
      }
      {
        const body = await elementFromElement(sessionId, dropZone, dropItemSelector)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        dropItem = body.value.ELEMENT
      }
      {
        const body = await getAttribute(sessionId, dropItem, 'style')
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql('')
      }
    })

    it.only('elements from element', async () => {
      const dropZoneSelector = '.dropzone'
      const dropItemSelector = '[draggable="true"]'
      let dropZone = null
      let dropItem = null
      {
        const body = await findElement(sessionId, dropZoneSelector)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        dropZone = body.value.ELEMENT
      }
      {
        const body = await elementsFromElement(sessionId, dropZone, dropItemSelector)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.length).to.eql(8)
        dropItem = body.value[0].ELEMENT
      }
      {
        const a = await getElementText(sessionId, dropItem)
      }
      {
        const body = await getAttribute(sessionId, dropItem, 'style')
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql('')
      }
    })

    it('present', async () => {
      const notDisplayedDivSelector = '.not.displayed.div'
      const bottomDivSelector = '.bottom.div'
      let notDisplayedDiv = null
      let bottomDiv = null
      {
        const body = await findElement(sessionId, notDisplayedDivSelector)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        notDisplayedDiv = body.value.ELEMENT
      }
      {
        const body = await present(sessionId, notDisplayedDiv)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql(true)
      }
      {
        const body = await findElement(sessionId, bottomDivSelector)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        bottomDiv = body.value.ELEMENT
      }
      {
        const body = await present(sessionId, bottomDiv)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql(true)
      }
    })

    it('displayed', async () => {
      const notDisplayedDivSelector = '.not.displayed.div'
      const bottomDivSelector = '.bottom.div'
      let notDisplayedDiv = null
      let bottomDiv = null
      {
        const body = await findElement(sessionId, notDisplayedDivSelector)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        notDisplayedDiv = body.value.ELEMENT
      }
      {
        const body = await displayed(sessionId, notDisplayedDiv)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql(false)
      }
      {
        const body = await findElement(sessionId, bottomDivSelector)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        bottomDiv = body.value.ELEMENT
      }
      {
        const body = await displayed(sessionId, bottomDiv)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql(true)
      }
    })

    it('clearElementText', async () => {
      {
        const body = await findElement(sessionId, firstname)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value.ELEMENT).to.be.exist
        elementInput_firstname = body.value.ELEMENT
      }
      {
        const body = await sendKeys(sessionId, elementInput_firstname, testString1)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql(null)
      }
      {
        const body = await clearElementText(sessionId, elementInput_firstname)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql(null)
      }
    })
  })

  describe('negative', () => {
    let sessionId
    let sessionIdFireFox
    let sessionIdSafari

    let unitURL1 = 'file:///Users/dpot/Documents/interface-webdriver/__specs__/util.html'

    before('get session', async () => {
      {
        const body = await initSession()
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.be.exist
        sessionId = body.sessionId
      }
      // {
      //   const body = await initSession(defaultFirefoxCapabilities)
      //   expect(body.status).to.eql(0)
      //   sessionIdFireFox = body.sessionId
      // }
      // {
      //   const body = await initSession(defaultSafariCapabilities)
      //   expect(body.status).to.eql(0)
      //   expect(body.sessionId).to.be.exist
      //   sessionIdSafari = body.sessionId
      // }
    })

    after('kill session ', async () => {
      {
        const body = await killSession(sessionId)
        expect(body.status).to.eql(0)
        expect(body.sessionId).to.eql(sessionId)
        expect(body.value).to.eql(null)
      }
      {
        const resp = await getTitle(sessionId)
        expect(resp.status).to.eql(SELENIUM_STATUSES.INVALID_SESSION_ID)
      }
      // {
      //   const body = await killSession(sessionIdFireFox)
      //   expect(body.status).to.eql(0)
      // }
      // {
      //   const body = await killSession(sessionIdSafari)
      //   expect(body.status).to.eql(0)
      // }
    })
    it('element not found', async () => {
      // css selector
      {
        const resp = await findElement(sessionId, '.not.found.element')
        expect(resp.status).to.eql(SELENIUM_STATUSES.ELEMENT_NOT_FOUND)
      }
      // {
      //   const resp = await findElement(sessionIdFireFox, '.not.found.element')
      //   expect(resp.status).to.eql(SELENIUM_STATUSES.ELEMENT_NOT_FOUND)
      // }
      // {
      //   const resp = await findElement(sessionIdSafari, '.not.found.element')
      //   expect(resp.status).to.eql(SELENIUM_STATUSES.ELEMENT_NOT_FOUND)
      // }
      //xpath selector
      {
        const resp = await findElement(sessionId, 'xpath: /html/body/div[2]/div/div/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div[6]/div/a')
        expect(resp.status).to.eql(SELENIUM_STATUSES.ELEMENT_NOT_FOUND)
      }
      // {
      //   const resp = await findElement(sessionIdFireFox, 'xpath: /html/body/div[2]/div/div/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div[6]/div/a')
      //   expect(resp.status).to.eql(SELENIUM_STATUSES.ELEMENT_NOT_FOUND)
      // }
      // {
      //   const resp = await findElement(sessionIdSafari, 'xpath: /html/body/div[2]/div/div/div[2]/div/div[1]/div/div/div[2]/div/div/div/div/div[6]/div/a')
      //   expect(resp.status).to.eql(SELENIUM_STATUSES.ELEMENT_NOT_FOUND)
      // }
    })

    it('not valid selectors', async () => {
      // css selector
      {
        const resp = await findElement(sessionId, '#@#Q$@!')
        expect(resp.status).to.eql(SELENIUM_STATUSES.INVALID_SELECTOR)
      }
      // {
      //   const resp = await findElement(sessionIdFireFox, '#@#Q$@!')
      //   expect(resp.status).to.eql(SELENIUM_STATUSES.INVALID_SELECTOR)
      // }
      // {
      //   const resp = await findElement(sessionIdSafari, '#@#Q$@!')
      //   expect(resp.status).to.eql(SELENIUM_STATUSES.ELEMENT_NOT_FOUND) //safari still unique BROWSER 
      // }
      //xpath selector
      {
        const resp = await findElement(sessionId, 'xpath: \\\CXZCBXZMCBXMZNBCMZ')
        expect(resp.status).to.eql(SELENIUM_STATUSES.INVALID_SELECTOR)
      }
      // {
      //   const resp = await findElement(sessionIdFireFox, 'xpath: \\\CXZCBXZMCBXMZNBCMZ')
      //   expect(resp.status).to.eql(SELENIUM_STATUSES.INVALID_SELECTOR)
      // }
      // {
      //   const resp = await findElement(sessionIdSafari, 'xpath: \\\CXZCBXZMCBXMZNBCMZ')
      //   expect(resp.status).to.eql(SELENIUM_STATUSES.XPATH_ERROR) //safari still unique BROWSER 
      // }
    })

    it('java script not valid', async () => {
      {
        const resp = await executeScript(sessionId, function (params) {
          return a.b.c
        })
        expect(resp.status).to.eql(SELENIUM_STATUSES.UNKNOWN_ERROR)
      }
      // {
      //   const resp = await await executeScript(sessionIdFireFox, function (params) {
      //     return a.b.c
      //   })
      //   expect(resp.status).to.eql(SELENIUM_STATUSES.COMMAND_NOT_FOUND)
      // }
      // {
      //   const resp = await await executeScript(sessionIdSafari, function (params) {
      //     return a.b.c
      //   })
      //   // The command 'POST /session/3784B3AE-4E03-4243-8939-2E37E7A8B7EE/execute/sync' was not found. //safari still unique BROWSER 
      // }
    })

    it('element disappears chrome', async () => {
      {
        await goToUrl(sessionId, unitURL1)
        await sleep(500)
        const el = await findElement(sessionId, 'button')
        expect(el.status).to.eql(SELENIUM_STATUSES.SUCCESS)
        await sleep(2000)
        const respText = await getElementText(sessionId, el.value.ELEMENT)
        expect(respText.status).to.eql(10)
        const respAttribute = await getAttribute(sessionId, el.value.ELEMENT, 'id')
        expect(respText.status).to.eql(10)
      }
    })

    // it('element disappears firefox', async () => {
    //   {
    //     // trouble with firefox 
    //     await goToUrl(sessionIdFireFox, unitURL1)
    //     await sleep(500)
    //     const el = await findElement(sessionId, 'button')
    //     console.log(el)
    //     expect(el.status).to.eql(SELENIUM_STATUSES.SUCCESS)
    //     await sleep(2000)
    //     console.log(el)
    //   }
    // })

    // it('element disappears firefox', async () => {
    //   {
    //     await goToUrl(sessionIdSafari, unitURL1)
    //     await sleep(1500)
    //     const el = await findElement(sessionId, 'button')
    //     console.log(el)
    //     expect(el.status).to.eql(SELENIUM_STATUSES.SUCCESS)
    //     await sleep()
    //   }
    // })
  })
})
