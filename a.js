// function bbb(...args) {
//   function aaa(...args) {
//     if(typeof args[args.length - 1] === 'function') {
//       args[args.length - 1]()
//     }
//     console.log(args)
//   }
//   aaa(...args)
// }

// function x() {
//   console.log('XXXX')
// }

// bbb(1, 2, 3, 4, x)

function asyncFunc(e) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(e), e * 1000);
  });
}

const arr = [1, 2, 3];
let final = [];

function workMyCollection(arr) {
  return arr.reduce((promise, item) => {
    return promise
      .then(() => {
        console.log(`item ${item}`);
        return asyncFunc(item).then(result => final.push(result));
      }).catch(console.error);
  }, Promise.resolve())
}

workMyCollection(arr)
  .then(() => console.log(`FINAL RESULT is ${final}`));