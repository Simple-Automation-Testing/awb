function bbb(...args) {
  function aaa(...args) {
    if(typeof args[args.length - 1] === 'function') {
      args[args.length - 1]()
    }
    console.log(args)
  }
  aaa(...args)
}

function x () {
  console.log('XXXX')
}

bbb(1, 2, 3, 4, x)
