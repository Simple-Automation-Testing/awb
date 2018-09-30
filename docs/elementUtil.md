## element util is API for some elements, as table, list ul, list select ect

```js
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
    Country: { text: 'Austria' } },
  { Company: { text: 'Island Trading' },
    Contact: { text: 'Helen Bennett' },
    Country: { text: 'UK' } },
  { Company: { text: 'Laughing Bacchus Winecellars' },
    Contact: { text: 'Yoshi Tannamuri' },
    Country: { text: 'Canada' } },
  { Company: { text: 'Magazzini Alimentari Riuniti' },
    Contact: { text: 'Giovanni Rovelli' },
    Country: { text: 'Italy' } }
    ]
```


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
      <tr>
        <td>Island Trading</td>
        <td>Helen Bennett</td>
        <td>UK</td>
      </tr>
      <tr>
        <td>Laughing Bacchus Winecellars</td>
        <td>Yoshi Tannamuri</td>
        <td>Canada</td>
      </tr>
      <tr>
        <td>Magazzini Alimentari Riuniti</td>
        <td>Giovanni Rovelli</td>
        <td>Italy</td>
      </tr>
    </tbody>
  </table>
```