# Callbacks

Quick example:

```js
const co = require('co');
const Callbacks = require('skerla-callbacks');

//create an instance of a Callbacks class with namespace
const callbacks = Callbacks.init('scope1');

co(function *() {
  //define data to work with
  const ID = 10432;
  const DATA = 'data1';
  
  //create a callback
  const promise = callbacks.create({
    id: ID
  });
  
  //call callback providin ID and DATA in the future
  setTimeout(function () {
    callbacks.success(ID, DATA);
  }, 100);
  
  //wait for the response
  const result = yield promise;
  
  result.should.equals(DATA); //true
}).catch(err => console.error(err.stack));

```

## API
### Constructor
##### `new Callbacks(scope: String): Callbacks`
### Static methods
##### `Callbacks.init(scope: String): Callbacks`
### Instance methods
##### `create(options: Options)`

```js
define Options {
  id: Mixed //callback id. defaults to objectid()
  timeout: Number //callback timeout. defaults to 30000
  name: String //optinal callback name
}
```
##### `success(id: Mixed, data: Mixed)`
##### `fail(id: Mixed, data: Mixed)`