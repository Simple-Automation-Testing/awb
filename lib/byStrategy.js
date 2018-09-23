function initElement(ElementInstance) {
  const element = (...args) => {
    const [selector] = args
    args.shift()
    console.log('element args', args)
    const selectorObj = {using: 'css selector', value: selector}
    args.unshift(selectorObj)
    console.log(args, 'args from init elememt')
    return new ElementInstance(...args)
  }
  element.css = (...args) => {
    const [selector] = args
    args.shift()
    const selectorObj = {using: 'css selector', value: selector}
    return new ElementInstance(selectorObj, ...args)
  }
  element.xpath = (...args) => {
    const [selector] = args
    args.shift()
    const selectorObj = {using: 'xpath', value: selector}
    return new ElementInstance(selectorObj, ...args)
  }
  element.id = (...args) => {
    const [selector] = args
    args.shift()
    const selectorObj = {using: 'id', value: selector}
    return new ElementInstance(selectorObj, ...args)
  }
  element.accessibilityId = () => {
    const [selector] = args
    args.shift()
    const selectorObj = {using: 'accessibility id', value: selector}
    return new ElementInstance(selectorObj, ...args)
  }
  return element
}


module.exports = {
  initElement
}