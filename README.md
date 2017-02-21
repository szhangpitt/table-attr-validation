# TOC
   - [Premise](#premise)
     - [data structure](#premise-data-structure)
   - [API](#api)
     - [/inherit](#api-inherit)
     - [/validate](#api-validate)
   - [Utils](#utils)
     - [/lambda](#utils-lambda)
   - [Use cases](#use-cases)
     - [/](#use-cases-)
<a name=""></a>
 
<a name="premise"></a>
# Premise
<a name="premise-data-structure"></a>
## data structure
### attrConfig
```js
attrConfig {name, required[, values]}
```
Test cases as below.

```js
var validAttrConfigs = [{
    name: 'scale',
    required: true,
}, {
    name: 'country',
    required: true,
}, {
    name: 'date',
    required: false,
}, {
    name: 'currency',
    required: true,
    values: ['USD', 'EUR', 'RMB'],
}];
validAttrConfigs.forEach(function (attrConfig) {
    expect(attrConfig).to.have.property('name');
    expect(attrConfig).to.have.property('required');
    expect(attrConfig.name).to.be.a('string');
    expect(attrConfig.required).to.be.oneOf([true, false]);
    attrConfig.values && expect(attrConfig.values).to.be.an('array');
});
```

### cellData
```js
cellData [ row[ cell{ attr{ name: value } } ] ]
```
Test cases as below.

```js
var validCellData = [
    // row 0
    [
        //cell 0-0, undefined cell OK, must take an array item
        undefined,
        // cell 0-1
        {
            attr: { currency: 'ISO Currency'},
        }
    ],
    // row 1
    [
        // cell 1-0
        {
            attr: { country: 'ISO Country' },
        },
        // cell 1-1, undefined cell OK, must take an array item
        undefined,
    ]
];
expect(validCellData).to.be.an('array');
expect(validCellData[0]).to.be.an('array');
expect(validCellData[1]).to.be.an('array');
expect(validCellData[0].length).to.equal(2);
expect(validCellData[1].length).to.equal(2);
expect(validCellData[0][1]).to.have.property('attr');
expect(validCellData[0][1].attr).to.have.property('currency');
```

<a name="api"></a>
# API
<a name="api-inherit"></a>
## /inherit
### inheritRow
```js
inheritRow(
  rowAttr {name1: val2}
  rowIndex,
  cellAttrs[[ {attr: {name1: val1}} ]],
) =>
[[ {attr: {name1: val2}} at rowIndex ]]
```
Test cases as below.

```js
var res = inheritRow(
    { country: 'Full Name Country' },
    0,
    cellAttrs
);
debug('res', JSON.stringify(res, null, 2));
expect(res).to.be.an('array');
expect(res[0][0].attr['country']).to.equal('Full Name Country');
expect(res[0][1].attr['country']).to.equal('Full Name Country');
// should return new cell obj at matched rowIndex
expect(res[0][0]).not.to.equal(cellAttrs[0][0]);
expect(res[0][1]).not.to.equal(cellAttrs[0][1]);
// should return original cell obj at unmatched rowIndex
expect(res[1][0]).to.equal(cellAttrs[1][0]);
expect(res[1][1]).to.equal(cellAttrs[1][1]);
expect(res[1][0]).to.deep.equal(cellAttrs[1][0]);
expect(res[1][1]).to.deep.equal(cellAttrs[1][1]);
```

### inheritCol
```js
inheritCol(
  colAttr {name1: val2},
  colIndex,
  cellAttrs[[ {attr: {name1: val1}} ]]
) =>
[[ {attr: {name1: val2}} at colIndex ]]
```
Test cases as below.

```js
var res = inheritCol(
    { currency: 'RMB' },
    1,
    cellAttrs
);
debug('inheritCol res', JSON.stringify(res, null, 2));
expect(res).to.be.an('array');
expect(res[0][1].attr['currency']).to.equal('RMB');
expect(res[1][1].attr['currency']).to.equal('RMB');
// should return new obj at matched colIndex
expect(res[0][1]).not.to.equal(cellAttrs[0][1]);
expect(res[1][1]).not.to.equal(cellAttrs[1][1]);
// should return original obj at unmatched colIndex
expect(res[0][0]).to.equal(cellAttrs[0][0]);
expect(res[1][0]).to.equal(cellAttrs[1][0]);
expect(res[0][0]).to.deep.equal(cellAttrs[0][0]);
expect(res[1][0]).to.deep.equal(cellAttrs[1][0]);
```

### inheritTable
```js
inheritTable(
  tableAttr {name1: val2},
  cellAttrs[[ {attr: {name1: val1}} ]]
) =>
[[ {attr: {name1: val2}} for all ]]
```
Test cases as below.

```js
var res = inheritTable(
    { currency: 'EUR' },
    cellAttrs
);
debug('inheritTable res', JSON.stringify(res, null, 2));
expect(res).to.be.an('array');
expect(res[0][0].attr['currency']).to.equal('EUR');
expect(res[0][1].attr['currency']).to.equal('EUR');
expect(res[1][0].attr['currency']).to.equal('EUR');
expect(res[1][1].attr['currency']).to.equal('EUR');
// should return new obj at all cells
expect(res[0][0]).not.to.equal(cellAttrs[0][0]);
expect(res[0][1]).not.to.equal(cellAttrs[0][1]);
expect(res[1][0]).not.to.equal(cellAttrs[1][0]);
expect(res[1][1]).not.to.equal(cellAttrs[0][1]);
```

<a name="utils"></a>
# Utils
<a name="utils-lambda"></a>
## /lambda
### input-map-cell(input)(fn)([[ cell ]])
```js
inputMapCellLambda(input)(fn)([[ cell ]])
=>
[[ cell|newCell <= fn(cell, ci, row, ri, input) ]]
```
Test cases as below.

```js
var mapFn = function mapFn (cell, ci, row, ri, input) {
    return cell === undefined ?
        { mapped: true, empty: true, r: ri, c: ci, input: input }
        : { mapped: true, empty: false, r: ri, c: ci, input: input }
};
var newCells = inputMapCellLambda('abc')(mapFn)(cellAttrs);
debug('newCells', JSON.stringify(newCells, null, 2));
expect(newCells).to.be.an('array');
exp(newCells[0][0], true, 0, 0, 'abc');
exp(newCells[0][1], false, 0, 1, 'abc');
exp(newCells[1][0], false, 1, 0, 'abc');
exp(newCells[1][1], true, 1, 1, 'abc');
function exp (cell, empty, r, c, input) {
    expect(cell.mapped).to.equal(true);
    expect(cell.empty).to.equal(empty);
    expect(cell.r).to.equal(r);
    expect(cell.c).to.equal(c);
    expect(cell.input).to.equal(input);
}
```

### config-value-validate(attrConfig)(attrValue)
```js
configValueValidateLambda(attrConfig)(attrValue)
=>
true | false
```
Test cases as below.

```js
var validCountry =
configValueValidateLambda({
    name: 'country',
    required: true,
});
expect(validCountry('US')).to.equal(true);
expect(validCountry(undefined)).to.equal(false);
var validCurrency =
configValueValidateLambda({
    name: 'currency',
    required: true,
    values: ['USD', 'EUR', 'RMB'],
});
expect(validCurrency('USD')).to.equal(true);
expect(validCurrency('GBP')).to.equal(false);
expect(validCurrency(null)).to.equal(false);
var validDate =
configValueValidateLambda({
    name: 'date',
    required: false,
});
expect(validDate(null)).to.equal(true);
```

<a name="use-cases"></a>
# Use cases
<a name="use-cases-"></a>
## /
### use case 1: highlight each cell
```js
inheritCol/inheritRow/inheritTable
-->
validateCells
=>
[[ {valid: {name1: true, name2: false, ...}} ]]
```
Test cases as below.

```js
var inherited = inheritTable(
    { person: 'name' },
    cellAttrs
);
var vc = validateCells(
    attrConfigs,
    inherited);
debug('vc', JSON.stringify(vc, null, 2));
vc
.reduce(function (flat, row) {
    return flat.concat(row);
}, [])
.map(function (cell) {
    return cell.valid;
})
.forEach(function (valid) {
    expect(valid).to.be.ok;
    expect(valid).to.have.property('person');
    expect(valid).to.have.property('country');
    expect(valid).to.have.property('currency');
    expect(valid.person).to.be.a('boolean');
    expect(valid.country).to.be.a('boolean');
    expect(valid.currency).to.be.a('boolean');
});
```

### use case 2: global attr alert
```js
inheritCol/inheritRow/inheritTable
-->
validateCellsReduce
=>
{name1: true, name2: false, ...}
```
Test cases as below.

```js
var inherited = inheritTable(
    { person: 'firstname' },
    cellAttrs
);
var vcr = validateCellsReduce(
    attrConfigs,
    inherited);
debug('vcr', JSON.stringify(vcr, null, 2));
expect(vcr).to.be.an('object');
expect(vcr).to.have.property('person');
expect(vcr).to.have.property('country');
expect(vcr).to.have.property('currency');
expect(vcr.person).to.be.a('boolean');
expect(vcr.country).to.be.a('boolean');
expect(vcr.currency).to.be.a('boolean');
expect(vcr.person).to.equal(true);
expect(vcr.country).to.equal(false);
expect(vcr.currency).to.equal(false);
```

<a name="api"></a>
# API
<a name="api-validate"></a>
## /validate
### validateCells
```js
validateCells(cellAttributes [[ {attr: {name1: val1, ...}} ]], attrConfigs)
=>
[[ {valid: {name1: true, name2: false, ...}} ]]
```
Test cases as below.

```js
var res = validateCells(attrConfigs, cellAttrs);
debug('res', JSON.stringify(res, null, 2));
expect(res).to.be.an('array');
expect(res[0][0].valid['currency']).to.equal(false);
expect(res[0][0].valid['country']).to.equal(false);
expect(res[0][1].valid['currency']).to.equal(false);
expect(res[0][1].valid['country']).to.equal(false);
expect(res[1][0].valid['currency']).to.equal(false);
expect(res[1][0].valid['country']).to.equal(true);
expect(res[1][1].valid['currency']).to.equal(false);
expect(res[1][1].valid['country']).to.equal(false);
```

### validateCellsReduce
```js
validateCellsReduce(attrConfigs, [[ cellAttrs ]])
=>
{name1: true, name2: false...}
```
Test cases as below.

```js
var res = validateCellsReduce(attrConfigs, cellAttrs);
debug('res', JSON.stringify(res, null, 2));
expect(res).to.be.an('object');
expect(res).to.have.property('country');
expect(res).to.have.property('currency');
expect(res.country).to.equal(false);
expect(res.currency).to.equal(false);
```

