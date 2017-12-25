# karmia-converter-jsonrpc
Convert karmia-rpc response to JSON-RPC 2.0

## Installation
```
npm install karmia-converter-jsonrpc
```

## Example
### Convert response
```javascript
const karmia_converter_jsonrpc = require('karmia-converter-jsonrpc'),
    converter = karmia_converter_jsonrpc();

const request = {
        jsonrpc: '2.0',
        method: 'method.name',
        params: {},
        id: 'test'
    },
    response = {success: true};

const result = converter.convert(request, response);
```

### Convert error response
#### convert method
```javascript
const karmia_converter_jsonrpc = require('karmia-converter-jsonrpc'),
    converter = karmia_converter_jsonrpc();

const request = {
        jsonrpc: '2.0',
        method: 'method.name',
        params: {},
        id: 'test'
    },
    response = new Error('TEST_EXCEPTION');
response.code = 500;

const result = converter.convert(request, response);
```

#### convertError method
```javascript
const karmia_converter_jsonrpc = require('karmia-converter-jsonrpc'),
    converter = karmia_converter_jsonrpc();

const request = {
        jsonrpc: '2.0',
        method: 'method.name',
        params: {},
        id: 'test'
    },
    response = new Error('TEST_EXCEPTION');
response.code = 500;

const result = converter.convertError(request, response);
```
