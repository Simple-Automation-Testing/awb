const sort = `
function bubbleSort(a) {
  let swapped
  do {
    swapped = false
    for(var i = 0; i < a.length - 1; i++) {
      if(a[i].bottom > a[i + 1].bottom) {
        const temp = a[i]
        a[i] = a[i + 1]
        a[i + 1] = temp
        swapped = true
      }
    }
  } while(swapped)
}
`


// build headerHash
function buildHash(headElemes = document.querySelector('.slick-header-columns.slick-header-columns-left').querySelectorAll('div[title]')) {

  function replacer(str) {
    return str.trim().replace(/( )|(:)/ig, '').replace(RegExp(
      String.fromCharCode(10) + '|' + String.fromCharCode(160) + '|' +
      String.fromCharCode(13) + '|' + String.fromCharCode(32), 'ig'), '').replace('#', 'Number')
  }

  function removePrefix(headTitle) {
    return headTitle.charAt(0) === headTitle.charAt(0).toUpperCase() &&
      headTitle.charAt(1) === headTitle.charAt(1).toUpperCase() ? headTitle.slice(1) : headTitle
  }

  return Array.prototype.reduce.call(headElemes, function(acc, current, index) {

    if(current.innerText.trim().length === 0) {
      acc['EmptyTitle' + index] = index; return acc
    }

    if(current.innerText.trim().length) {
      const spanText = current.innerText
      console.log(spanText.replace)
      acc[replacer(removePrefix(spanText.replace(/ *\([^)]*\) */g, '')))] = index
    }

    return acc
  }, {})
}

// headerHash = buildHash()

function combineData(data = []) {

  const rows = document.querySelectorAll('.grid-canvas.grid-canvas-top.grid-canvas-left > div')

  const rowsToObject = Array.prototype.map.call(rows, function(row1) {
    const rect1 = row1.getBoundingClientRect()
    return {bottom: rect1.bottom, row: row1, content: row1.querySelector('.slick-cell.l1.r1').innerText}
  })

  bubbleSort(rowsToObject)

  if(data.length && data[data.length - 1].content === rowsToObject[rowsToObject.length - 1].content) {
    return Promise.resolve(data)
  }

  data.push(...rowsToObject)

  rowsToObject[rowsToObject.length - 1].row.scrollIntoView()

  return new Promise((resolve) => {
    setTimeout(() => {console.log('x'); resolve(combineData(data))}, 150)
  })
}

combineData().then(arr => {

  arr = arr.map(a => {
    delete a.bottom
    return a
  })

  return arr.reduce(function(acc, current) {
    let push = true
    for(let i = 0; i < acc.length; i++) {
      if(JSON.stringify(acc[i]) === JSON.stringify(current)) {push = false; break}
    }
    if(push) {acc.push(current)}
    return acc
  }, []).map(a => a.row)

}).then(a => a.map(row => {
  const columns = row.querySelectorAll('.slick-cell')
  return Object.keys(headerHash).reduce(function(acc, curr) {
    acc[curr] = columns[headerHash[curr]].innerText; return acc
  }, {})
})).then(console.log)