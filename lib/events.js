const mouseOver = `
  const node = arguments[0]
  const mouseoverEv = document.createEvent("MouseEvents")

  mouseoverEv.initMouseEvent(
    "mouseover", true,
    false, window,
    1, // detail : Event's mouse click count
    50, // screenX
    50, // screenY
    50, // clientX
    50, // clientY
    false, // ctrlKey
    false, // altKey
    false, // shiftKey
    false, // metaKey
    0, // button : 0 = click, 1 = middle button, 2 = right button
    null // relatedTarget : Only used with some event types (e.g. mouseover and mouseout). In other cases, pass null.
  )
  node.dispatchEvent(mouseoverEv)
`

const mouseLeave = `
  const node = arguments[0]
  const mouseoverEv = document.createEvent("MouseEvents")

  mouseoverEv.initMouseEvent(
    "mouseleave", true,
    false, window,
    1, // detail : Event's mouse click count
    50, // screenX
    50, // screenY
    50, // clientX
    50, // clientY
    false, // ctrlKey
    false, // altKey
    false, // shiftKey
    false, // metaKey
    0, // button : 0 = click, 1 = middle button, 2 = right button
    null // relatedTarget : Only used with some event types (e.g. mouseover and mouseout). In other cases, pass null.
  )
  node.dispatchEvent(mouseoverEv)
`

const mouseEnter = `
  const node = arguments[0]
  const mouseoverEv = document.createEvent("MouseEvents")

  mouseoverEv.initMouseEvent(
    "mouseenter", true,
    false, window,
    1, // detail : Event's mouse click count
    50, // screenX
    50, // screenY
    50, // clientX
    50, // clientY
    false, // ctrlKey
    false, // altKey
    false, // shiftKey
    false, // metaKey
    0, // button : 0 = click, 1 = middle button, 2 = right button
    null // relatedTarget : Only used with some event types (e.g. mouseover and mouseout). In other cases, pass null.
  )
  node.dispatchEvent(mouseoverEv)
`

const eventsList = {
  mouseEnter: 'mouseEnter',
  mouseOver: 'mouseOver',
  mouseLeave: 'mouseLeave'
}

module.exports = {
  eventsList,
  mouseEnter,
  mouseLeave,
  mouseOver
}