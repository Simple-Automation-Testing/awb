import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'



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



class Main extends Component {


  download = (filename, text) => {
    const elementFile = document.createElement('a');
    elementFile.setAttribute('href', 'data:application/octet-stream;charset=utf-8;base64,Zm9vIGJhcg==,'+ text);
    elementFile.setAttribute('download', filename);

    elementFile.style.display = 'none';
    document.body.appendChild(elementFile);

    elementFile.click();

    document.body.removeChild(elementFile);
  }

  componentDidMount() {
    // Start file download.
    document.getElementById("dwn-btn").addEventListener("click", function () {
      // Generate download of hello.txt file with some content
      var text = `exports.config = {
        framework: 'jasmine',
        seleniumAddress: 'http://localhost:4444/wd/hub',
        specs: ['spec.js']
      }`
      var filename = "hello.js";

      download(filename, text);
    }, false);
  }
  render() {
    return (
      <div>
        Test app
        <button id="dwn-btn" onClick={this.download}>Create SetUp protractorFile</button>
      </div>
    )
  }
}

ReactDom.render(<Main />, document.getElementById('app'))