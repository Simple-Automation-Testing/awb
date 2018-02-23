export function swipeTo(driver, element, positios) {
  const assertStatus = (body) => { if (body.status !== 0) throw new Error('Swipe broken') }

  const { sessionId, href } = getSessionAndHref(driver)
  const toRound = (value) => Math.round(value)

  const swipe = async (down, moveup) => {
    const bodyDown = await fetch(`${href}/session/${sessionId}/touch/down`, {
      method: 'POST', body: JSON.stringify(down)
    }).then(resp => resp.json()); assertStatus(bodyDown)
    const bodyMove = await fetch(`${href}/session/${sessionId}/touch/move`, {
      method: 'POST', body: JSON.stringify(moveup)
    }).then(resp => resp.json()); assertStatus(bodyMove)
    const bodyUp = await fetch(`${href}/session/${sessionId}/touch/up`, {
      method: 'POST', body: JSON.stringify(moveup)
    }).then(resp => resp.json()); assertStatus(bodyUp)
  }

  const getElementRects = async () => {
    if (!element.simpleObject) {
      const { x, y } = await element.getLocation()
      const { width, height } = await element.getSize()
      return { x, y, width, height }
    } else {
      return { ...element }
    }
  }

  return {
    fromCenter: async () => {
      const { x, y, width, height } = await getElementRects()
      const center = { x: toRound(x + width / 2), y: toRound(y + height / 2) }
      const down = { params: center }
      const moveAndUp = { params: { x: center.x + positios.xTo, y: center.y + positios.yTo } }
      await swipe(down, moveAndUp)
    },
    fromBottom: async () => {
      const { x, y, width, height } = await getElementRects()
      const bottom = { x: toRound(x + width / 2), y: toRound(y + height - 2) }
      const down = { params: bottom }
      const moveAndUp = { params: { x: bottom.x + positios.xTo, y: bottom.y + positios.yTo } }
      await swipe(down, moveAndUp)
    },
    fromTop: async () => {
      const { x, y, width, height } = await getElementRects()
      const top = { x: toRound(x + width / 2), y: toRound(y - 2) }
      const down = { params: top }
      const moveAndUp = { params: { x: top.x + positios.xTo, y: top.y + positios.yTo } }
      await swipe(down, moveAndUp)
    }
  }
}