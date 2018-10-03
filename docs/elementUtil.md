## element util is API for some elements, as table, list ul, list select ect

### Table util
```html
<table>
    <tbody>
      <tr>
        <th>Company</th>
        <th>Contact</th>
        <th>Country</th>
      </tr>
      <tr>
        <td>Alfreds Futterkiste</td>
        <td>Maria Anders</td>
        <td>Germany</td>
      </tr>
      <tr>
        <td>Centro comercial Moctezuma</td>
        <td>Francisco Chang</td>
        <td>Mexico</td>
      </tr>
      <tr>
        <td>Ernst Handel</td>
        <td>Roland Mendel</td>
        <td>Austria</td>
      </tr>
    </tbody>
  </table>
```

```js
//  util.getTableCollection()
const awb = require('awb')
const {$} = awb()
const tableElement = $('table').waitForElement(150)

const tableCollection = await tableElement.util.getTableCollection()
// table collection will be next
```
```js
[
   { Company: { text: 'Alfreds Futterkiste' },
    Contact: { text: 'Maria Anders' },
    Country: { text: 'Germany' } },
  { Company: { text: 'Centro comercial Moctezuma' },
    Contact: { text: 'Francisco Chang' },
    Country: { text: 'Mexico' } },
  { Company: { text: 'Ernst Handel' },
    Contact: { text: 'Roland Mendel' },
    Country: { text: 'Austria' } }
    ]
```

```js
// util.getTableHeaderObject()
const awb = require('awb')
const {$} = awb()
const tableElement = $('table').waitForElement(150)

const tableCollection = await tableElement.util.getTableHeaderObject()
// table header object will be next
```

```js
  { Company: 0, Contact: 1, Country: 2 }
```
### Select list util
```html
 <select name="test" id="test-select">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
 </select>
```
```js
// util.getTableHeaderObject()
const awb = require('awb')
const {$} = awb()
const selectElement = $('select').waitForElement(150)

const collection = await selectElement.util.getSelectListCollection()
// select collection  will be next
```
```js
[ { index: 0, isSelected: true, text: '1', value: '1' },
  { index: 1, isSelected: false, text: '2', value: '2' },
  { index: 2, isSelected: false, text: '3', value: '3' },
  { index: 3, isSelected: false, text: '4', value: '4' },
  { index: 4, isSelected: false, text: '5', value: '5' } ]
```