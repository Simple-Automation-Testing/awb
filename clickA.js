function removePrefix(headTitle) {
  return headTitle.charAt(0) === headTitle.charAt(0).toUpperCase() &&
    headTitle.charAt(1) === headTitle.charAt(1).toUpperCase() ? headTitle.slice(1) : headTitle
}

function merdgeInArr(tblHeaderArr) {
  return Array.prototype.reduce.call(tblHeaderArr, function(acc, curr) {
    Array.prototype.forEach.call(curr.querySelectorAll('div[title]'), function(item) {
      acc.push(item)
    })
    return acc
  }, [])
}

function bubbleSort(arr) {
  let swapped
  do {
    swapped = false
    for(let i = 0; i < arr.length - 1; i++) {
      if(arr[i].bottom > arr[i + 1].bottom) {
        const temp = arr[i]
        arr[i] = arr[i + 1]
        arr[i + 1] = temp
        swapped = true
      }
    }
  } while(swapped)
}
function removeNewLines(str) {
  return str.replace(RegExp(String.fromCharCode(10) + '|' + String.fromCharCode(13), 'ig'), '')
}

function replacer(str) {
  return str.trim().replace(/( )|(:)|\\(\\d\\)/ig, '').replace(RegExp(
    String.fromCharCode(10) + '|' + String.fromCharCode(160) + '|' +
    String.fromCharCode(13) + '|' + String.fromCharCode(32), 'ig'), '').replace('#', 'Number')
}


function buildHash(headElemes) {
  return Array.prototype.reduce.call(headElemes, function(acc, current, index) {
    if(current.innerText.trim().length === 0) {
      acc['EmptyTitle' + index] = index
      return acc
    }
    if(current.innerText.trim().length) {
      const spanText = current.querySelector('span').innerText
      acc[removePrefix(replacer(spanText))] = index
    }
    return acc
  }, {})
}

function mergeInArrDivFormat(tblHeaderArr) {
  return Array.prototype.reduce.call(tblHeaderArr, function(acc, curr) {
    Array.prototype.forEach.call(curr.querySelectorAll('div[title]'), function(item) {
      acc.push(item)
    })
    return acc
  }, [])
}
rootTbl = document.querySelector('#ctl00_contentSection_BudgetChangeControl_grdChangeItems')
callback = (arg) => console.log(arg)
tblHeader = rootTbl.querySelectorAll('[class*="slick-pane-header slick-pane"]')
headerHash = buildHash(merdgeInArr(tblHeader))


function clickData(tableRoot, editableData, data) {
  data = data || []
  const rows = tableRoot.querySelectorAll('.grid-canvas.grid-canvas-top.grid-canvas-left > div')

  const rowsToObject = Array.prototype.map.call(rows, function(row) {
    const rect = row.getBoundingClientRect()
    return {bottom: rect.bottom, row: row, content: row.innerText}
  })

  bubbleSort(rowsToObject)

  if(data.length && data[data.length - 1].content === rowsToObject[rowsToObject.length - 1].content) {
    return Promise.resolve(callback(false))
  }

  for(let i = 0; i < rowsToObject.length; i++) {
    const rowObj = rowsToObject[i]
    if(rowObj.row.querySelectorAll('.slick-cell')[
      headerHash[editableData.tableHeader]].innerText === editableData.searchByValue) {
      const edit = rowObj.row.querySelectorAll('.slick-cell')[headerHash[editableData.searchInColumn]]
      if(edit.className.indexOf('editable') >= 0) {
        edit.click()
        edit.querySelector('.editor-text').value = editableData.valueToSet
        callback(true); return Promise.resolve(true)
      }
      else {
        edit.click()
      }
    }
  }


  data.push(...rowsToObject)

  rowsToObject[rowsToObject.length - 1].row.scrollIntoView()

  return new Promise((resolve) => {
    setTimeout(() => {resolve(clickData(tableRoot, editableData, data))}, 150)
  })
}

clickEditData = {
  tableHeader: 'Description',
  searchByValue: 'Performance Bond',
  searchInColumn: 'ChangeAmount',
  valueToSet: '1444'
}