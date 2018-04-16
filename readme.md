<h1>Another webdriver binding</h1>

UI automated testing framework powered by [Node.js](http://nodejs.org/).
Uses the [Selenium WebDriver API](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol).
Uses the [ChromeDriver API](https://chromium.googlesource.com/chromium/src/+/master/docs/chromedriver_status.md)

Base: lazy elements, chrome driver dirrect connection, own standalone server, chrome and gecko driver installer

![npm downloads](https://img.shields.io/npm/dm/awb.svg?style=flat-square)

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

const { client, $ } = awb()

describe('Google base example', () => {
  const baseURL = 'https://www.google.com.ua/'
  //selectors
  const submitsearch = '[name="btnK"]'
  const inputsearch = '#lst-ib'
  const resultsearch = '#ires .g'
  //elements
  const submitSearch = $(submitsearch).waitForClickable(1000) //lazy element with  expected condition
  const resultSearch = $(resultsearch).waitForElement(1000) //lazy element with  expected condition
  const inputSearch = $(inputsearch)
  before(async () => {
    await client.startDriver()
    await client.goTo(baseURL)
  })
  after(async () => {
    await client.close()
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
- [Client](#client)
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
  * [alert](#alert)
    - [accept](#accept)
    - [dismiss](#dismiss)
    - [getText](#gettext)
  * [waitForUrlIncludes](#waitforurlincludes)
  * [wait](#wait)
  * [waitForTitleInclude](#waitfortitleinclude)
  * [startDriver](#startdriver)
  * [stopDriver](#stopdriver)
  * [switchToFrame](#switchtoframe)
  * [switchBack](#switchback)
  * [refresh](#refresh)
  * [back](#back)
  * [getSize](#getsize)
  * [forward](#forward)
  * [goTo](#goto)
  * [closeCurrentTab](#closecurrenttab)
  * [getTitle](#gettitle)
  * [executeScript](#executescript)
  * [executeScriptAsync](#executescriptasync)
  * [switchToTab](#switchtotab)
  * [close](#close)
  * [getCurrentclientTab](#getcurrentclienttab)
  * [getclientTabs](#getclienttabs)
  * [sleep](#sleep)
  * [getUrl](#geturl)
- [Elements](#elements) alias is $$
  * [elements.css](#element.css)
  * [elements.xpath](#element.xpath)
  * [elements.id](#element.id)
  * [elements.id](#element.accessibilityId)
  * [waitForElements](#waitforelements)
  * [map](#map)
  * [forEach](#foreach)
  * [filter](#filter)
  * [get](#get)
  * [waitUntilDisappear](#waituntildisappear)
  * [count](#count)
- [Element](#element) alias is $
  * [element.css](#element.css)
  * [element.xpath](#element.xpath)
  * [element.id](#element.id)
  * [element.id](#element.accessibilityId)
  * [sendKeys](#sendkeys)
  * [getRect](#getrect)
  * [clear](#clear)
  * [location](#location)
  * [locationView](#locationview)
  * [size](#size)
  * [getElementHTML](#getelementhtml)
  * [waitForElementPresent](#waitforelementpresent)
  * [waitForElementVisible](#waitforelementvisible)
  * [wait](#wait)
  * [waitForClickable](#waitforclickable)
  * [waitUntilDisappear](#waituntildisappear)
  * [getText](#gettext)
  * [waitForElement](#waitforelement)
  * [element](#element)
  * [elements](#elements)
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
    remote: false, // if remote true startDriver() will not work, default false
    directConnect: false, // if directConnect true directConnect() will run gecko or chrome driver without selenium standalone server, default false
    host: 'localhost', // host, default 'localhost' or '127.0.0.1' or '0.0.0.0'
    port: 4444, // port on what will be runned client driver
    desiredCapabilities: {
      javascriptEnabled: true,
      acceptSslCerts: true,
      platform: 'ANY',
      clientName: 'chrome'
    },
    timeout: 5000 // time what will wait response from driver
  }

  const awb = require('awb')
  const {client, $, $$} = awb(config)
  /*
   * awb() returns element, elements, client instance
   * if run awb without args, will be used default config from example
   */
```
## goTo
```js
  const awb = require('awb')
  const {client} = awb()
  await client.goTo('https://google.com')
  /*
   * args url
   * type string
   */
```
## wait
```js
  const awb = require('awb')
  const {client, $} = awb()
  await client.goTo('https://google.com')
  await client.wait(5000,async () => $('#test').isDisplayed(), 'Test error message')
  /*
   * will wail 5000 ms until appear element with css selector #test
   */
```
## Keys
```js
  const awb = require('awb')
  const {element, client }= awb()
  const el = element('.test.class')
  await el.sendKeys('test name', client.Keys.ENTER) // for submit
```
## getSize
```js
  const awb = require('awb')
  const {element, client }= awb()
  const size = client.getSize() //{ height: 983, width: 1200 } for example
  /*
   * any args
   * return current window size {height: number, width: number}
   */
```
## alert
```js
  const awb = require('awb')
  const {element, client }= awb()
  const alert = client.alert //getter
  // return client alert api
```
## accept
```js
await alert.accept()

```
## dismiss
```js
 await alert.dismiss()
```
## getText
```js
const alertText =  await alert.getText()
/*
return text from alert
*/

```
## localStorage
```js
  const awb = require('awb')
  const {element, client }= awb()
  const localStorage = client.localStorage //getter
 // return client localStorage api
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
  const {element, client }= awb()
  const sessionStorage = client.sessionStorage //getter
  // return client sessionStorage api
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
  const {element, client }= awb()
  await client.startDriver()
  /*
   * it will start selenium process
   * if selenium standalone chromedriver geckdriver was install
   * /
```
## stopDriver
```js
  await client.stopDriver()
  /*
   * it will stop selenium process
   * if it was runned by previous command
   * /
```
## closeCurrentTab
```js
  const awb = require('awb')
  const {element, client }= awb()
  await client.closeCurrentTab()
  /*
   * will close current tab
   * if opened tabs length more than 1
   * /
```
## waitForUrlIncludes
```js
  const awb = require('awb')
  const {element, client }= awb()
  await client.waitForUrlIncludes('test', 1000)
  /*
   * will wait 1000ms for url includes test
   * /
```
## waitForTitleInclude
```js
  const awb = require('awb')
  const {element, client }= awb()
  await
  await client.waitForTitleInclude('New title', 1000)
  /*
   * will wait 1000ms for title includes test
   * /
```
## switchToFrame
```js
  const awb = require('awb')
  const {element, client } = awb()
  await client.switchToFrame(element('#myFrame'))
  /*
   * arg element frame
   * /
```
## switchBack
```js
  const awb = require('awb')
  const {element, client }= awb()
  await client.switchToFrame('#myFrame')
  // do some action with elements with frame
  await client.switchBack()
  /*
   * return to initial context
   * /
```
## refresh
```js
  const awb = require('awb')
  const {element, client }= awb()
  await client.refresh()
  /*
   * refresh client current page
   * /
```
## back
```js
  const awb = require('awb')
  const {element, client }= awb()
  await client.back()
  /*
   * client histor go back
   * /
```
## forward
```js
  const awb = require('awb')
  const {element, client }= awb()
  await client.forward()
  /*
   * client histor go forward
   * /
```
## getTitle
```js
  const awb = require('awb')
  const {element, client }= awb()
  const currentTitle = await client.getTitle()
  /*
   * will return tab title
   * /
```
## executeScript
```js
  const awb = require('awb')
  const {element, client }= awb()
  const currentTitle = await client.executeScript(function () {
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
  const {element, client }= awb()
  const currentTitle = await client.executeScriptAsync(function () {
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
  const {element, client }= awb()
  await client.switchToTab(1)
  /* for example if was opened link with _blank
   * will switch to opened tab
   * /
```
## close
```js
  const awb = require('awb')
  const {element, client }= awb()
  await client.close()
  /* for example if was focused tab from switchToTab example
   * this will close current tab and focus you to previous
   * /
```
## getCurrentclientTab
```js
  const awb = require('awb')
  const {element, client }= awb()
  const tabId = await client.getCurrentclientTab()
  /* return selenium tab id * /
```
## getclientTabs
```js
  const awb = require('awb')
  const {element, client }= awb()
  const tabIdS = await client.getclientTabs()
  /*
  * return array with selenium tab ids
  */
```
## sleep
```js
  const awb = require('awb')
  const {element, client }= awb()
  await client.sleep(1000)
  /* args number timeout
  * will wait until timeout end
  */
```
## getUrl
```js
  const awb = require('awb')
  const {element, client }= awb()
  const currentUrl = await client.getUrl()
  /* return current tab url*/
```
# Element
## ConstructorElement
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementDiv = element('div')
  /*
  * args css selector for example '#id', '[name="name"]', '.class'
  */
```
## element.css
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementDiv = element.css('div') //args css selector for example '#id', '[name="name"]', '.class'
  /*
  * args css selector for example '#id', '[name="name"]', '.class'
  */
```
## element.xpath
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementDiv = element.xpath('/html/body/div')
  /*
  * args xpath
  */
```
## element.id
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementDiv = element.id('uniq-id')
  /*
  * args element id
  */
```
## sendKeys
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementInput = element('input')
  await elementInput.sendKeys('test value')
  /*
  * args string or array string
  */
```
## size
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementInput = element('input')

  const {width, height} = await elementInput.size()
  /*
  * return element`s width and height
  */
```

## getRect
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementInput = element('input')

  const {width, height, x, y } = await elementInput.getRect()
  /*
  * return element`s width and height, and location x, y
  */
```

## location
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementInput = element('input')

  const {y, x} = await elementInput.location()
  /*
  * return element`s start, x and y where element begins
  */
```
## locationView
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementInput = element('input')

  const {x, y} = await elementInput.locationView()
  /*
  * return element`s start, x and y where element begins in view port
  */
```

## clear
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementInput = element('input')
  await elementInput.clear()
  /*
  * clear value inside input
  */
```
## getElementHTML
```js
  const awb = require('awb')
  const {element, client }= awb()
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
  const {element, client }= awb()
  const elementDiv = element('div')
  const divText = await elementDiv.getText()
  /*
  * return all text inside element , return string
  */
```
## waitForElement
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementDiv = element('div').waitForElement(1000)

  /*
  * will wait for element mount to DOM node
  */
```
## waitForElementPresent
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementDiv = element('div').waitForElementPresent(1000)
  /*
  * will wait for element mount to DOM node
  */
```
## wait
```js
const awb = require('awb')
const {element, client }= awb()
const elementDiv = element('div').wait(1000, async (el) => await el.getText() ==='test')
  /*
  * will wait for element mount to DOM node
  */
```

## waitForClickable
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementDiv = element('div').waitForClickable(1000)
  /*
  * will wait for element mount to DOM node
  */
```
## waitForElementVisible
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementDiv = element('div').waitForElementVisible(1000)
  /*
  * will wait for element visible in DOM 1000ms
  */
```
## waitUntilDisappear

```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementDiv = element('div').waitForElementVisible(1000)
  await elementDiv.click()
  await elementDiv.waitUntilDisappear(10000)
  // do other
  /*
  * will wait for element unmount from DOM 1000ms
  */
```
## element
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementSpan = element('div').element('span').element('a')
  /*
  *  return element instanse
  */
```
## elements
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementsSpan = element('div').elements('span')
  /*
  *  return Elements instance
  */
```
## elements.css
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementsSpan = element('div').elements('span')
  /*
  *  return Elements instance
  */
```
## getAttribute
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementSpan = element('div').element('span')
  const style = await elementSpan.getAttribute('style')
  /*
  * args strin , value name , for example 'value', 'href', 'style' etc
  *  return string of attribute value
  */
```
## click
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementSpan = element('div').element('span')
  await elementSpan.click()
  /*
  * triger click
  */
```
## isPresent
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementSpan = element('div').element('span')
  const present = await elementSpan.isPresent()
  /*
  * return true if element mounted to DOM
  * return false if element didn`t mount to DOM
  */
```
## isDisplayed
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementSpan = element('div').element('span')
  const display = await elementSpan.isDisplayed()
  /*
  * return true if visible and in view port
  * return false if doesn`t visible, for example display: none
  */
```
## toElement
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementSpan = element('div').element('span')
  await elementSpan.toElement()
  /*
  * will scroll view port to element
  */
```
## mouseDownAndMove
```js
  const awb = require('awb')
  const {element, client }= awb()
  const elementSpan = element('div').element('span')
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
  const {element, elements, client }= awb()
  // by css selector
  const elementsSpan = elements('span')// work the same as element.css
 /*
  *  return array Element instaces
  */
```
## elements.css
```js
  const awb = require('awb')
  const {element, elements, client }= awb()
  const elementDiv = elements('div')
  // by css selector
  const elementsSpan = elements.css('span') // will find element by css selector
 /*
  *  return array Element instaces
  */
```
## elements.xpath
```js
  const awb = require('awb')
  const {element, elements, client }= awb()
  // by css selector
  const elementsDiv = elements.xpath('/html/body/div') // will find element by xpath
 /*
  *  return array Element instaces
  */
```
## waitForElements
```js
  const awb = require('awb')
  const {element, elements, client }= awb()
  const elementDiv = elements('div').waitForElements(1000)
  /*
  * will wait for first element with selector mount to DOM node
  */
```
### map
```js
  // by css selector
  const awb = require('awb')
  const {element, elements, client }= awb()
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
  const {element, elements, client }= awb()
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
## waitUntilDisappear

```js
  const awb = require('awb')
  const {elements, client }= awb()
  const links = element('a')
  await links.waitUntilDisappear(10000) // will assert that every element with css selector disappear from page
  /*
  * will wait for elements unmount from DOM 1000m
  */
```

### count
```js
  const awb = require('awb')
  const {element, elements, client }= awb()
  const elementsCount = await elements('span').count()
  /*
  * return elements quantity, return number
  * /
```
### filter
```js
  const awb = require('awb')
  const {element, elements, client }= awb()
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
  const {element, elements, client }= awb()
  const elementsSpan = elements('span')
  const elementWithText = elementsSpan.get(3)
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