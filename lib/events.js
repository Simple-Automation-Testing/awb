const getEvent = (evType) => `
  const node = arguments[0]
  const mouseoverEv = document.createEvent("MouseEvents")

  mouseoverEv.initMouseEvent(
    "${evType}", true,
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

const mouseOver = getEvent('mouseover')
const mouseLeave = getEvent('mouseleave')
const mouseEnter = getEvent('mouseenter')
const mouseOut = getEvent('mouseout')

const eventsScripts = {
  mouseEnter,
  mouseLeave,
  mouseOver,
  mouseOut
}

const eventsList = {
  mouseEnter: 'mouseEnter',
  mouseOver: 'mouseOver',
  mouseLeave: 'mouseLeave',
  mouseOut: 'mouseOut'
}

module.exports = {
  eventsList,
  eventsScripts
}