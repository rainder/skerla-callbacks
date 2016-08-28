# Callbacks

Callback implementation with native Promises

## Example

```js
const co = require('co');
const Callbacks = require('@rainder/callbacks');

const callbacks = new Callbacks();

co(function *() {
  //define data to work with
  const ID = '10432';
  const DATA = 'data1';
  
  //create a callback
  const promise = callbacks.create(ID);
  
  setTimeout(function () {
    callbacks.getCallback(ID).resolve(DATA);
  }, 100);
  const result = yield promise;
  
  result.should.equals(DATA); //true
}).catch(err => console.error(err.stack));

```

## Callbacks

### new Callbacks(): Callbacks
### static Callbacks.create(): Callbacks
### create(id: String, [timeout: Number = 30000]): Promise
### getCallback(id: String): Callback

## Callback
### new Callback(id: String, timeout: Number, onDestroy: Function)
### resolve(data)
### reject(err)
### destroy()
