'use strict';

require('co-mocha');
const chai = require('chai');
const Callbacks = require('./../index');
chai.should();

describe('all tests', function () {
  it('should execute a callback', function *() {
    const callbacks = new Callbacks();
    const promise = callbacks.create('1');

    callbacks.size.should.equals(1);
    callbacks.getCallback('1').resolve('data1');

    const result = yield promise;
    result.should.equals('data1');
  });

  it('should timeout a callback', function *() {
    const callbacks = new Callbacks();
    const promise = callbacks.create('2', {
      timeout: 1,
      error_constructor: class MyError extends Error {
        constructor(message, namespace, id) {
          super();
          this.message = message;
          this.id = id;
          this.namespace = namespace;
        }
      }
    });

    callbacks.size.should.equals(1);

    try {
      yield promise;
    } catch (e) {
      (e instanceof Error).should.equals(true);
      e.message.should.match(/^callback timeout: default::2/);
      e.namespace.should.equals('default');
      e.id.should.equals('2');
    }

    callbacks.size.should.equals(0);
  });

  it('should clear a callback', function *() {
    const callbacks = new Callbacks();
    const promise = callbacks.create('3', 1);
    callbacks.size.should.equals(1);
    callbacks.getCallback('3').destroy();
    callbacks.size.should.equals(0);

    yield cb => setTimeout(cb, 10);
  });

  it('should callback an error', function *() {
    const callbacks = new Callbacks();
    const promise = callbacks.create('5');
    callbacks.size.should.equals(1);

    callbacks.getCallback('5').reject('error');
    try {
      yield promise;
    } catch (e) {
      e.should.equals('error');
    }

    callbacks.size.should.equals(0);
  });

  it('should not allow to create a callback with the same id', function *() {
    const c1 = new Callbacks();
    const promise = c1.create('1');
    c1.getCallbacks().size.should.equals(1);

    try {
      c1.create('1');
    } catch (e) {
      (e instanceof Error).should.equals(true);
      e.message.should.match(/already defined/);
    }

    c1.getCallbacks().size.should.equals(1);
    c1.getCallback('1').resolve('data');
    c1.getCallbacks().size.should.equals(0);

    const result = yield promise;

    result.should.equals('data');
  });

});
