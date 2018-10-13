const {WEB_EMENET_ID} = require('./util')


const getVisible = `function getVisible(elementList) {
  return Array.prototype.filter.call(elementList, function(el) {
    const rects = el.getBoundingClientRect()
    return (rects.height !== 0 && rects.width !== 0)
  })
}`

const uploadFileToDropZoneInput = `function uploadFileToDropZone(target) {
  const document = target.ownerDocument || document
  const window = document.defaultView || window
  const input = document.createElement('INPUT')
  input.type = 'file'
  input.id = '__awb_upload_file_to_dop_zone'
  input.onchange = function() {
    try {target.scrollIntoView(true)}
    catch(e) {console.log(e)}
    const rect = target.getBoundingClientRect()
    const offsetX = rect.width >> 1
    const offsetY = rect.height >> 1
    const x = rect.left + offsetX
    const y = rect.top + offsetY
    const dataTransfer = {files: this.files}
    const events = ['dragenter', 'dragover', 'drop']
    events.forEach(function(name) {
      const evt = document.createEvent('MouseEvent');
      evt.initMouseEvent(name, !0, !0, window, 0, 0, 0, x, y, !1, !1, !1, !1, 0, null)
      evt.dataTransfer = dataTransfer
      target.dispatchEvent(evt)
    })
    setTimeout(function() {document.body.removeChild(input)}, 25)
  }
  document.body.appendChild(input)
  return input
}`

const buildHeaderHash = `function buildHeaderHash(headerCells) {
  function replacer(str) {
    return str.trim().replace(/( )|(:)|\\(\\d\\)/ig, '').replace(RegExp(
      String.fromCharCode(10) + '|' + String.fromCharCode(160) + '|' +
      String.fromCharCode(13) + '|' + String.fromCharCode(32), 'ig'), '')
  }
  return Array.prototype.reduce.call(headerCells, function(acc, current, index) {
    const title = replacer(current.innerText.trim()).replace('*', '')
    if(!title.length) {acc['EmptyTitle' + index] = index; return acc}
    if(acc.hasOwnProperty(title)) {acc[title + index] = index; return acc}
    acc[title] = index
    return acc
  }, {})
}`

const getTableHeaderObject = `function getTableHeaderObject(rootTbl, indexRowHeader) {
  const buildHeaderHash = ${buildHeaderHash}
  let tbl = null
  if(rootTbl.tagName !== 'TABLE') {rootTbl = rootTbl.querySelector('table')}

  for(let i = 0; i < rootTbl.children.length; i++) {
    if(rootTbl.children[i].tagName === 'TBODY') {tbl = rootTbl.children[i]; break}
  }
  let header = rootTbl.querySelector('thead')

  let headerCells = null
  if(!header) {
    header = tbl.querySelectorAll('tr')[indexRowHeader]
    headerCells = header.querySelector('th') ? header.querySelectorAll('th') : header.querySelectorAll('td')
  } else {
    headerCells = tblHeader.querySelectorAll('th')
  }

  const headerHash = buildHeaderHash(headerCells)
  return headerHash
}`


const getTableData = `function getTableData(rootTbl, indexRowHeader, indexRowFooter) {
  const buildHeaderHash = ${buildHeaderHash}
  const getVisible = ${getVisible}
  let tbl = null
  if(rootTbl.tagName !== 'TABLE') {rootTbl = rootTbl.querySelector('table')}

  for(let i = 0; i < rootTbl.children.length; i++) {
    if(rootTbl.children[i].tagName === 'TBODY') {tbl = rootTbl.children[i]; break}
  }

  let footer = rootTbl.querySelector('tfoot')
  let header = rootTbl.querySelector('thead')

  let headerCells = null
  let bodyRows = null

  if(!header) {
    header = tbl.querySelectorAll('tr')[indexRowHeader]
    headerCells = header.querySelector('th') ? header.querySelectorAll('th') : header.querySelectorAll('td')
    bodyRows = Array.prototype.map.call(tbl.children, function(el) {return el})
    bodyRows.splice(indexRowHeader, 1)[0]
  } else {
    headerCells = tblHeader.querySelectorAll('th')
    bodyRows = tbl.children
  }

  if(typeof indexRowFooter === 'number' && !footer) {
    footer = Array.prototype.map.call(bodyRows, function(el) {return el}).splice(indexRowFooter, 1)[0]
  }

  const headerHash = buildHeaderHash(headerCells)
  const headerHashKeys = Object.keys(headerHash)
  let bodyData = Array.prototype.map.call(bodyRows, function(row) {

    return headerHashKeys.reduce(function(acc, current, index, hashArr) {
      if(row.children.length !== hashArr.length) {
        acc['Separator'] = row.innerText; return acc
      }

      acc[current] = {}
      acc[current].text = row.children[headerHash[current]].innerText.trim()

      const imgs = getVisible(row.children[headerHash[current]].querySelectorAll('img'))
      const checkboxes = getVisible(row.children[headerHash[current]].querySelectorAll('input[type="checkbox"]'))
      const inpts = getVisible(row.children[headerHash[current]].querySelectorAll('input[type="text"]'))

      if(imgs.length) {
        acc[current].imgs = imgs.reduce(function(imAcc, curIm) {
          imAcc.push(curIm.src); return imAcc
        }, [])
      }
      if(checkboxes.length) {
        acc[current].checkboxes = checkboxes.reduce(function(ac, chb) {
          if(chb.type !== 'hidden') {ac.push(chb.checked)} return ac
        }, [])
      }
      if(inpts.length) {
        acc[current].inputs = inpts.reduce(function(ac, inp) {
          if(inp.type !== 'hidden') {ac.push(inp.value)} return ac
        }, [])
      }
      return acc
    }, {})
  })

  bodyData = bodyData.filter(function(rowObj) {return !!Object.keys(rowObj).length})

  if(footer && (footer.querySelectorAll('tr > td').length === headerHashKeys.length)) {
    const futterInfo = headerHashKeys.reduce(function(acc, current, index) {
      const footerCells = footer.querySelectorAll('td')
      if(footerCells[headerHash[current]].innerText.length) {
        acc['footer' + current] = footerCells[index].innerText.trim()
      }
      return acc
    }, {})
    bodyData.push(futterInfo)
  }
  return bodyData
}`

const getOptionList = `function getOptionList(list) {
  const getVisible = ${getVisible}
  function buildOptionCollection(options) {
    return getVisible(options).reduce(function(acc, cur, ind) {
      acc.push({
        index: ind,
        text: cur.innerText,
        value: cur.value,
        isSelected: cur.selected
      })
      return acc
    }, [])
  }

  if(!list.querySelector('optgroup')) {
    return buildOptionCollection(list.querySelectorAll('option'))
  } else {
    return Array.prototype.reduce.call(list.querySelectorAll('optgroup'), function(acc, cur, ind) {
      acc[cur.label.length ? cur.label : cur.title] = buildOptionCollection(cur.querySelectorAll('option'))
      return acc
    }, {})
  }
}`

function GetElementUtils(client, element) {
  this.client = client
  this.element = element
  const toFileobj = (elId) => ({ELEMENT: elId, [WEB_EMENET_ID]: elId})

  this.getTableCollection = async function(indexRowHeader = 0, indexRowFooter = null) {
    if(!this.element.elementId) {await this.element.getThisElement()}
    return this.client.executeScript(`
      const getTableData = ${getTableData};
      return getTableData(arguments[0], arguments[1], arguments[2])
    `, toFileobj(this.element.elementId), indexRowHeader, indexRowFooter)
  }
  this.uploadFileViaDnD = async function(file) {
    if(!this.element.elementId) {await this.element.getThisElement()}
    const elementIdBefore = this.element.elementId
    const {ELEMENT} = await this.client.executeScript(`
      const uploadFileToDropZoneInput = ${uploadFileToDropZoneInput};
      return uploadFileToDropZoneInput(arguments[0])
    `, toFileobj(this.element.elementId))
    // use element as current element
    this.element.elementId = ELEMENT
    // use element API
    await this.element.sendKeys(file)
    // back element id to initial
    this.element.elementId = elementIdBefore
  }
  this.getTableHeaderObject = async function(indexRowHeader = 0) {
    if(!this.element.elementId) {await this.element.getThisElement()}
    return this.client.executeScript(`
      const getTableData = ${getTableHeaderObject};
      return getTableData(arguments[0], arguments[1])
    `, toFileobj(this.element.elementId), indexRowHeader)
  }
  this.getSelectListCollection = async function() {
    if(!this.element.elementId) {await this.element.getThisElement()}
    return this.client.executeScript(`
      const getOptionList = ${getOptionList};
      return getOptionList(arguments[0])
    `, toFileobj(this.element.elementId))
  }
}


module.exports = {
  GetElementUtils
}