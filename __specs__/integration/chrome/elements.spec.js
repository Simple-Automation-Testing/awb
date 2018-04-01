// const { expect } = require('chai')
// const fetchy = require('../../../lib/fetchy')
// const initializator = require('../../../lib/core')

// const elementInitializer = require('../../../lib/element')

// describe.skip('Elements', () => {
//   const baseRequest = {
//     get: fetchy.bind(fetchy, "GET", 'http://localhost:4444/wd/hub/', 1000),
//     post: fetchy.bind(fetchy, "POST", 'http://localhost:4444/wd/hub/', 1000),
//     put: fetchy.bind(fetchy, "PUT", 'http://localhost:4444/wd/hub/', 1000),
//     del: fetchy.bind(fetchy, "DELETE", 'http://localhost:4444/wd/hub/', 1000)
//   }
//   const wireJSONAPI = initializator(baseRequest)
//   const { resizeWindow, initSession, killSession, findElements, findElement, goToUrl, getUrl } = wireJSONAPI

//   //parts
//   let sessionId = null
//   //selectors
//   const dropitem = '.dropitem'

//   //elements
//   let elementDropItems = null

//   before(async () => {
//     const body = await initSession()
//     expect(body.status).to.eql(0)
//     expect(body.sessionId).to.be.exist
//     const {
//       Elements
//     } = elementInitializer(wireJSONAPI, { sessionId: body.sessionId })
//     sessionId = body.sessionId
//     elementDropItems = elements(dropitem)
//     await goToUrl(sessionId, 'http://localhost:9090')
//     global.___sessionId = sessionId
//   })

//   after(async () => {
//     await killSession(sessionId)
//   })

//   it('element getElementHTML', async () => {
//     await elementDropItems.forEach(async (element) => {
//       expect(await element.getText()).to.contains('Click me')
//     })
//   })
// })