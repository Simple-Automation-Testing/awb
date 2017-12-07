UI automated testing framework powered by [Node.js](http://nodejs.org/).
Uses the [Selenium WebDriver API](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol).
Uses the [ChromeDriver API](https://chromium.googlesource.com/chromium/src/+/master/docs/chromedriver_status.md)

Base: lazy elements, chrome driver dirrect connection, own standalone server and chrome driver installer

Install [Node.js](http://nodejs.org/) and install framework

```sh
$ npm i --SD wd-interface
```
Drivers installation (now only for UNIX* systems)
```sh
$ wd-interface standalone chrome
```
Run driver selenium-standalone-server or chrome driver
```sh
$ wd-interface start standalone  #for standalone
$ wd-interface start chrome  #for chromedriver 
```

Simple as a library

Use with [mocha](https://mochajs.org/) or other test runner 

# Base example [Api](#api)

```js
const { expect } = require('chai')

const { client, element } = require('wd-interface')

describe('Google base example', () => {
  let browser = null
  const baseURL = 'https://www.google.com.ua/'

  //selectors
  const submitsearch = '[name="btnK"]'
  const inputsearch = '#lst-ib'
  const resultsearch = '#ires .g'
  //elements
  const submitSearch = element(submitsearch)
  const inputSearch = element(inputsearch)
  const resultSearch = element(resultsearch)

  before(async () => {
    browser = client().chrome() // for dirrect connection to chromedriver client().chrome(true)
    await browser.goTo(baseURL)
  })

  after(async () => {
    await browser.closeBrowser()
  })

  it('search git hub potapovDim', async () => {
    await inputSearch.sendKeys('git hub potapovDim')
    await submitSearch.click()
    await browser.sleep(1000)
    await resultSearch.waitForElement(1000)
    const allTextInSelector = await resultSearch.getText()
    expect(allTextInSelector).to.includes('potapovDim')
  })
})
```

## Api
- [Browser](#browser)
  * [chrome](#chrome)
  * [goTo](#goto)
  * [closeCurrentTab](#closecurrenttab)
  * [getTitle](#gettitle)
  * [switchToTab](#switchtotab)
  * [closeBrowser](#closebrowser)
  * [getCurrentBrowserTab](#getcurrentbrowsertab)
  * [getBrowserTabs](#getbrowsertabs)
  * [sleep](#sleep)
  * [getUrl](#geturl)
- [Element](#element)
  * [Constructor](#consctructor-element)
  * [sendKeys](#sendkeys)
  * [getElementHTML](#getelementhtml)
  * [waitForElementPresent](#waitforelementpresent)
  * [waitForElementVisible](#waitforelementvisible)
  * [getText](#gettext)
  * [waitForElement](#waitforelement)
  * [getElement](#getelement)
  * [getElements](#getelements)
    * [mappy](#mappy)
    * [each](#each)
  * [getAttribute](#getattribute)
  * [click](#click)
  * [isPresent](#ispresent)
  * [toElement](#toelement)
  * [isDisplayed](#isdisplayed)
  * [mouseDownAndMove](#mousedownandmove)

# Browser
```js
  const {client} = require('wd-interface')
  const browser = client.chrome() 

  /* return browser api instance
   * args directConnect
   * true - conncect direct to chromedriver port 9515 without selenium standalone
   * any, false , undefined - conncect to standalone server port 4444
   * /
```

## goTo
```js
  const browser = client.chrome() 
  await browser.goTo('https://google.com')
  /* args url
   * type string
   * /
```

## closeCurrentTab
```js
  const browser = client.chrome() 
  await browser.closeCurrentTab()
  /* 
   * will close current tab 
   * if opened tabs length more than 1
   * /
```

## getTitle
```js
  const browser = client.chrome() 
  const currentTitle = await browser.getTitle()
  /* 
   * will return tab title
   * /
```

## switchToTab
```js
  const browser = client.chrome() 
  await browser.switchToTab(1)
  /* for example if was opened link with _blank
   * will switch to opened tab
   * /
```
## closeBrowser
```js
  const browser = client.chrome() 
  await browser.closeBrowser()
  /* for example if was focused tab from switchToTab example
   * this will close current tab and focus you to previous
   * /
```
## getCurrentBrowserTab
```js
  const browser = client.chrome() 
  const tabId = await browser.getCurrentBrowserTab()
  /* return selenium tab id * /
```
## getBrowserTabs
```js
  const browser = client.chrome() 
  const tabIdS = await browser.getBrowserTabs()
  /*
  * return array with selenium tab ids
  */
```

## sleep
```js
  const browser = client.chrome() 
  await browser.sleep(1000)
  /* args number timeout 
  * will wait until timeout end
  */
```
## getUrl
```js
  const browser = client.chrome() 
  const currentUrl = await browser.getUrl()
  /* return current tab url*/
```
# Element

## Constructor element
```js
  const elementDiv = element('div')
  /* 
  * args css selector for example '#id', '[name="name"]', '.class'
  */
```
## sendKeys
```js
  const elementInput = element('input')
  await elementInput.sendKeys('test value')
  /* 
  * args string or array string
  */
```
## getElementHTML
```js
  const elementInput = element('input')
  const inputHTML = await elementInput.getElementHTML()
  /* 
  * return outerHTML of current element , return string
  * <input value="a"/> for example
  */
```
## getText

```js
  const elementDiv = element('div')
  const divText = await elementDiv.getText()
  /* 
  * return all text inside element , return string
  */
```

## waitForElement
```js
  const elementDiv = element('div')
  await elementDiv.waitForElement(1000)
  /* 
  * will wait for element mount to DOM node
  */
```
## waitForElementPresent
```js
  const elementDiv = element('div')
  await elementDiv.waitForElementPresent(1000)
  /* 
  * will wait for element mount to DOM node
  */
```
## waitForElementVisible
```js
  const elementDiv = element('div')
  await elementDiv.waitForElementVisible(1000)
  /* 
  * will wait for element visible in DOM node
  */
```
## getElement
```js
  const elementSpan = await element('div').getElement('span')
  /* 
  *  return element instanse
  */
```
## getElements
```js
  const elementsSpan = await element('div').getElements('span')
  /* 
  *  return array element instanse
  */
```
### mappy
```js
  const elementsSpan = await element('div').getElements('span')
  const textArr = await elementsSpan.mappy(async (element) => {
        return await element.getText()
      })
  /* 
  *  args async call back 
  *  return array  
  */
```
### each
```js
 const elementsSpan = await element('div').getElements('span')
 const textArr = await elementsSpan.each(async (element) => {
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
## getAttribute
```js
  const elementSpan = await element('div').getElement('span')
  const style = await elementSpan.getAttribute('style')
  /*
  * args strin , value name , for example 'value', 'href', 'style' etc 
  *  return string of attribute value
  */
```
## click
```js
  const elementSpan = await element('div').getElement('span')
  await elementSpan.click()
  /*
  * triger click 
  */
```
## isPresent
```js
  const elementSpan = await element('div').getElement('span')
  const present = await elementSpan.isPresent()
  /*
  * return true if element mounted to DOM
  * return false if element didn`t mount to DOM
  */
```
## isDisplayed
```js
  const elementSpan = await element('div').getElement('span')
  const display = await elementSpan.isDisplayed()
  /*
  * return true if visible and in view port
  * return false if doesn`t visible, for example display: none
  */
```
## toElement
```js
  const elementSpan = await element('div').getElement('span')
  await elementSpan.toElement()
  /*
  * will scroll view port to element 
  */
```

## mouseDownAndMove
```js
  const elementSpan = await element('div').getElement('span')
  await elementSpan.mouseDownAndMove({x: 100, y: 0})
  /*
  * args object with x and y 
  * will mouse down mouse move from x and y from arg
  */
```