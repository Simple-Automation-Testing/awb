


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
    setTimeout(() => {resolve(combineData(data))}, 150)
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