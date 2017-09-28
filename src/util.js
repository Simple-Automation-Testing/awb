
// var saveData = (function () {
//   var a = document.createElement("a");
//   document.body.appendChild(a);
//   a.style = "display: none";
//   return function (data, fileName) {
//       // //JSON.stringify(data),
//          var blob = new Blob([data], {type: "octet/stream"}),
//           url = window.URL.createObjectURL(blob);
//       a.href = url;
//       a.download = fileName;
//       a.click();
//       window.URL.revokeObjectURL(url);
//   };
// }());

// var data = `{ x: 42, s: "hello, world", d: new Date() }`,
//   fileName = "my-download.js";

// saveData(data, fileName);

