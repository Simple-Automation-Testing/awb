<h1>Another webdriver binding</h1>

UI automated testing framework powered by [Node.js](http://nodejs.org/).
Uses the [Selenium WebDriver API](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol).
Uses the [ChromeDriver API](https://chromium.googlesource.com/chromium/src/+/master/docs/chromedriver_status.md)

Base: lazy elements, chrome driver dirrect connection, own standalone server and chrome driver installer

Install [Node.js](http://nodejs.org/) and install framework
```sh
$ npm i --SD awb
```
Drivers installation 
```sh
$ awb standalone chrome gecko
```

Run driver selenium-standalone-server or chrome driver 
```sh
$ awb start standalone  #for standalone
$ awb start chrome  #for chromedriver 
$ awb start gecko  #for geckdriver
```
or postinstall, will install gecko chrome drivers and selenium standalone server

```json
"postinstall": "awb standalone gecko chrome"
```

Simple as a library

Use with [mocha](https://mochajs.org/) or other test runner 
</br>
</br>
## Take a look awb [Api](#api)

# Base example 
```js
const { expect } = require('chai')

const awb = require('awb')

const { client, element } = awb()

describe('Google base example', () => {
  let browser = null
  const baseURL = 'https://www.google.com.ua/'
  //selectors
  const submitsearch = '[name="btnK"]'
  const inputsearch = '#lst-ib'
  const resultsearch = '#ires .g'
  //elements
  const submitSearch = element(submitsearch).waitForClicable(1000) //lazy element with  expected condition
  const resultSearch = element(resultsearch).waitForElement(1000) //lazy element with  expected condition
  const inputSearch = element(inputsearch)
  before(async () => {
    await client.startDriver()
    await client.goTo(baseURL)
  })
  after(async () => {
    await client.stopDriver()
    await client.stopDriver()
  })
  it('search git hub potapovDim', async () => {
    await inputSearch.sendKeys('git hub potapovDim')
    await submitSearch.click()
    const allTextInSelector = await resultSearch.getText()
    expect(allTextInSelector).to.includes('potapovDim')
  })
})
```
[More examples here -> ](https://github.com/potapovDim/interface-webdriver/tree/another-webdriver-binding/examples)
## Api
- [Browser](#browser)
  * [localStorage](#localstorage)
    - [get](#get)
    - [set](#set)
    - [clear](#clear)
    - [getAll](#getall)
  * [sessionStorage](#sessionstorage)
    - [get](#get)
    - [set](#set)
    - [clear](#clear)
    - [getAll](#getall)
  * [waitForUrlIncludes](#waitforurlincludes)
  * [startDriver](#startdriver)
  * [stopDriver](#stopdriver)
  * [switchToFrame](#switchtoframe)
  * [refresh](#refresh)
  * [back](#back)
  * [forward](#forward)
  * [goTo](#goto)
  * [closeCurrentTab](#closecurrenttab)
  * [getTitle](#gettitle)
  * [executeScript](#executescript)
  * [executeScriptAsync](#executescriptasync)
  * [switchToTab](#switchtotab)
  * [closeBrowser](#closebrowser)
  * [getCurrentBrowserTab](#getcurrentbrowsertab)
  * [getBrowserTabs](#getbrowsertabs)
  * [sleep](#sleep)
  * [getUrl](#geturl)
- [Elements](#elements)
  * [waitForElements](#waitforelements)
  * [map](#map)
  * [forEach](#foreach)
  * [filter](#filter)
  * [get](#get)
- [Element](#element)
  * [sendKeys](#sendkeys)
  * [cliear](#clear)
  * [location](#location)
  * [locationView](#locationview)
  * [size](#size)
  * [getElementHTML](#getelementhtml)
  * [waitForElementPresent](#waitforelementpresent)
  * [waitForElementVisible](#waitforelementvisible)
  * [waitForClicable](#waitForClicable)
  * [getText](#gettext)
  * [waitForElement](#waitforelement)
  * [getElement](#getelement)
  * [getElements](#getelements)
  * [getAttribute](#getattribute)
  * [click](#click)
  * [isPresent](#ispresent)
  * [toElement](#toelement)
  * [isDisplayed](#isdisplayed)
  * [mouseDownAndMove](#mousedownandmove)


[More about DesiredCapabilities](https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities)
# Client
```js
  /* 
   * config example, optional, this example config is default config
   */
  const defautlOpts = {
    withStandalone: true, // if true will run selenium standalone server when call start startDriver(), default true
    remote: false, // if remote true startDriver() will not work, default false
    directConnect: false, // if directConnect true directConnect() will run gecko or chrome driver without selenium standalone server, default false
    host: 'localhost', // host, default 'localhost' or '127.0.0.1' or '0.0.0.0'
    port: 4444, // port on what will be runned browser driver 
    desiredCapabilities: {
      javascriptEnabled: true,
      acceptSslCerts: true,
      platform: 'ANY',
      browserName: 'chrome'
    },
    timeout: 5000 // time what will wait response from driver 
  }
  
  const awb = require('awb')
  const {client, element, elements} = awb(config)
  /* 
   * awb() returns element, elements, client instance 
   * if run awb without args, will be used default config from example
   */
```

## goTo
```js
  const awb = require('awb')
  const {client: browser} = awb()
  await browser.goTo('https://google.com')
  /* 
   * args url
   * type string
   */
```
## Keys
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  const el = element('.test.class')
  await el.sendKeys('test name', browser.Keys.ENTER) // for submit
```
## localStorage
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  const localStorage = browser.localStorage //getter 
 // return browser localStorage api 
```
## get
```js
const token = await localStorage.get('token')
/*
  args key = string
  return value
*/
```
## set
```js
 await localStorage.get('token', 'test-token')
/*
  args: key = string, value = string
*/ 
```
## clear
```js
 await localStorage.clear()
 /*
  clear all localStorage data
 */
```
## getAll
```js
 const data = await localStorage.getAll()
 /*
 return all localStorage data
 */
```
## sessionStorage
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  const sessionStorage = browser.sessionStorage //getter 
  // return browser sessionStorage api 
```
## get
```js
const token = await sessionStorage.get('token')
/*
  args key = string
  return value
*/
```
## set
```js
 await sessionStorage.get('token', 'test-token')
/*
  args: key = string, value = string
*/ 
```
## clear
```js
 await sessionStorage.clear()
 /*
  clear all sessionStorage data
 */
```
## getAll
```js
 const data = await sessionStorage.getAll()
 /*
 return all sessionStorage data
 */
```
## startDriver
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  await browser.startDriver()
  /* 
   * it will start selenium process 
   * if selenium standalone chromedriver geckdriver was install 
   * /
```
## stopDriver
```js
  await browser.stopDriver()
  /* 
   * it will stop selenium process 
   * if it was runned by previous command
   * /
```
## closeCurrentTab
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  await browser.closeCurrentTab()
  /* 
   * will close current tab 
   * if opened tabs length more than 1
   * /
```
## waitForUrlIncludes
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  await browser.waitForUrlIncludes('test', 1000)
  /* 
   * will wait 1000ms for url includes test 
   * /
```
## switchToFrame
```js 
  const awb = require('awb')
  const {element, client: browser }= awb()
  await browser.switchToFrame('#myFrame')
  /* 
   * arg css selector (id , class or some atribute)
   * / 
```
## refresh
```js 
  const awb = require('awb')
  const {element, client: browser }= awb()
  await browser.refresh()
  /* 
   * refresh browser current page
   * / 
```
## back
```js 
  const awb = require('awb')
  const {element, client: browser }= awb()
  await browser.back()
  /* 
   * browser histor go back 
   * / 
```
## forward
```js 
  const awb = require('awb')
  const {element, client: browser }= awb()
  await browser.forward()
  /* 
   * browser histor go forward 
   * / 
```
## getTitle
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  const currentTitle = await browser.getTitle()
  /* 
   * will return tab title
   * /
```
## executeScript
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  const currentTitle = await browser.executeScript(function () {
    const [cssSelector] = arguments
    return document.querySelector(cssSelector).innerHTML
  }, 'body')
  /* first arg is function or string function ,for example 'return arguments[0]'
   * if function return value it will be returned
   * /
```

## executeScriptAsync
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  const currentTitle = await browser.executeScriptAsync(function () {
    const [callback] = arguments
      fetch('http://localhost:8085/bar', {
        node: 'no-cors'
      }).then(resp => resp.json()).then(callback)
  })
  /* first arg is function or string function ,for example 'return arguments[0]'
   * if function return value it will be returned
   * /
```

## switchToTab
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  await browser.switchToTab(1)
  /* for example if was opened link with _blank
   * will switch to opened tab
   * /
```
## closeBrowser
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  await browser.closeBrowser()
  /* for example if was focused tab from switchToTab example
   * this will close current tab and focus you to previous
   * /
```
## getCurrentBrowserTab
```js
  const awb = require('awb')
  const {element, client: browser }= awb()
  const tabId = await browser.getCurrentBrowserTab()
  /* return selenium tab id * /
```
## getBrowserTabs
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const tabIdS = await browser.getBrowserTabs()
  /*
  * return array with selenium tab ids
  */
```
## sleep
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  await browser.sleep(1000)
  /* args number timeout 
  * will wait until timeout end
  */
```
## getUrl
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const currentUrl = await browser.getUrl()
  /* return current tab url*/
```
# Element
## ConstructorElement
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementDiv = element('div')
  /* 
  * args css selector for example '#id', '[name="name"]', '.class'
  */
```
## sendKeys
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementInput = element('input')
  await elementInput.sendKeys('test value')
  /* 
  * args string or array string
  */
```
## size
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementInput = element('input')

  const {width, height} = await elementInput.size()
  /* 
  * return element`s width and height
  */
```

## location
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementInput = element('input')

  const {y, x} = await elementInput.location()
  /* 
  * return element`s start, x and y where element begins 
  */
```
## location
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementInput = element('input')

  const {x, y} = await elementInput.locationView()
  /* 
  * return element`s start, x and y where element begins in view port
  */
```

## clear
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementInput = element('input')
  await elementInput.clear()
  /* 
  * clear value inside input
  */
```
## getElementHTML
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementInput = element('input')
  const inputHTML = await elementInput.getElementHTML()
  /* 
  * return outerHTML of current element , return string
  * <input value="a"/> for example
  */
```
## getText
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementDiv = element('div')
  const divText = await elementDiv.getText()
  /* 
  * return all text inside element , return string
  */
```
## waitForElement
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementDiv = element('div').waitForElement(1000)

  /* 
  * will wait for element mount to DOM node
  */
```
## waitForElementPresent
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementDiv = element('div').waitForElementPresent(1000)
  /* 
  * will wait for element mount to DOM node
  */
```
## waitForClicable
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementDiv = element('div').waitForClicable(1000)
  /* 
  * will wait for element mount to DOM node
  */
```
## waitForElementVisible
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementDiv = element('div').waitForElementVisible(1000)
  /* 
  * will wait for element visible in DOM node
  */
```
## getElement
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementSpan = element('div').getElement('span').getElement('a')
  /* 
  *  return element instanse
  */
```
## getElements
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementsSpan = element('div').getElements('span')
  /* 
  *  return Elements instance
  */
```
## getAttribute
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementSpan = element('div').getElement('span')
  const style = await elementSpan.getAttribute('style')
  /*
  * args strin , value name , for example 'value', 'href', 'style' etc 
  *  return string of attribute value
  */
```
## click
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementSpan = element('div').getElement('span')
  await elementSpan.click()
  /*
  * triger click 
  */
```
## isPresent
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementSpan = element('div').getElement('span')
  const present = await elementSpan.isPresent()
  /*
  * return true if element mounted to DOM
  * return false if element didn`t mount to DOM
  */
```
## isDisplayed
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementSpan = element('div').getElement('span')
  const display = await elementSpan.isDisplayed()
  /*
  * return true if visible and in view port
  * return false if doesn`t visible, for example display: none
  */
```
## toElement
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementSpan = element('div').getElement('span')
  await elementSpan.toElement()
  /*
  * will scroll view port to element 
  */
```
## mouseDownAndMove
```js
  const awb = require('awb')
  const {element, client: browser }= awb() 
  const elementSpan = element('div').getElement('span')
  await elementSpan.mouseDownAndMove({x: 100, y: 0})
  /*
  * args object with x and y 
  * will mouse down mouse move from x and y from arg
  */
```
# Elements
## Constructor elements
```js
  const awb = require('awb')
  const {element, elements, client: browser }= awb() 
  const elementDiv = elements('div')
  // by css selector
  const elementsSpan = elements('span')
  // by xpath 
  const elementsDiv = elements('xpath: /html/body/div[1]/div/div/div/div[1]/div[2]/div[2]/div/div')
 /* 
  *  args css selector for example '#id', '[name="name"]', '.class' or xpath format xpath: /html/body/div (for example)
  *  return array Element instaces
  */
```
## waitForElements
```js
  const awb = require('awb')
  const {element, elements, client: browser }= awb() 
  const elementDiv = elements('div').waitForElements(1000)
  /* 
  * will wait for first element with selector mount to DOM node
  */
```
### map
```js
  // by css selector
  const awb = require('awb')
  const {element, elements, client: browser }= awb() 
  const elementsSpan = elements('span')
  const textArr = await elementsSpan.map(async (element) => {
        return await element.getText()
      })
  /* 
  *  args async call back 
  *  return array  
  */
```
### forEach
```js
  const awb = require('awb')
  const {element, elements, client: browser }= awb() 
  //by css selector
  const elementsSpan = elements('span')

  const textArr = await elementsSpan.forEach(async (element) => {
        const html = await element.getElementHTML()
        expect(html).to.includes('dropitem')
        expect(html).to.includes('draggable="true"')
      })
  /* 
  * args async call back 
  * call async funcs with await 
  * does not return 
  * /
```
### filter
```js
  const awb = require('awb')
  const {element, elements, client: browser }= awb() 
  const elementsSpan = elements('span')
  const textArr = await elementsSpan.filter(async (element) => {
        const html = await element.getElementHTML()
        return html.includes('class="test"')
      })
  /* 
  * args async call back 
  * call async funcs with await
  * return new elements array  
  * /
```
### get
```js
  const awb = require('awb')
  const {element, elements, client: browser }= awb() 
  const elementsSpan = elements('span')
  const elementWithText = await elementsSpan.get(0)
  await elementWithText.getText()
  /* 
  * args index number
  * return Element instance 
  * /
```


## Improvement plan
 * [x] Run selenium server from a client instance method 
 * [x] Add possibility find element by xpath (done)
 * [ ] Develop error handler system 
 * [x] Develop and improve enviroment installer for every OS 