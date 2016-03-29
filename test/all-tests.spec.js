'use strict';

require('co-mocha');
const chai = require('chai');
const Callbacks = require('./../index');
chai.should();

describe('all tests', function () {
  it('should execute a callback', function *() {
    const callbacks = new Callbacks('one');
    const promise = callbacks.create();

    callbacks.scope.size.should.equals(1);
    callbacks.success(promise.id, 'data1');

    promise.isFulfilled().should.equals(true);
    const result = yield promise;
    result.should.equals('data1');
  });

  it('should timeout a callback', function *() {
    const callbacks = new Callbacks();
    const promise = callbacks.create({
      timeout: 1
    });

    callbacks.scope.size.should.equals(1);
    promise.isFulfilled().should.equals(false);

    try {
      yield promise;
    } catch (e) {
      (e instanceof Error).should.equals(true);
      e.message.should.match(/^Callback timeout: /);
    }
  });

  it('should clear a callback', function *() {
    const callbacks = new Callbacks();
    const promise = callbacks.create({
      timeout: 1
    });
    callbacks.scope.size.should.equals(1);
    promise.clear();
    callbacks.scope.size.should.equals(0);

    yield cb => setTimeout(cb, 10);

    promise.isFulfilled().should.equals(false);
  });

  it('should callback an error', function *() {
    const callbacks = new Callbacks();
    const promise = callbacks.create();
    callbacks.scope.size.should.equals(1);

    promise.isFulfilled().should.equals(false);

    callbacks.fail(promise.id, 'error');
    try {
      yield promise;
    } catch (e) {
      e.should.equals('error');
    }

    callbacks.scope.size.should.equals(0);
  });

  it('should reuse a namespace', function *() {
    const c1 = new Callbacks('one');
    const c2 = new Callbacks('one');
    const c3 = new Callbacks('two');

    c1.create();

    c1.scope.size.should.equals(1);
    c2.scope.size.should.equals(1);
    c3.scope.size.should.equals(0);
  });

  it('should not allow to create a callback with the same id', function *() {
    const c1 = new Callbacks();
    const promise = c1.create({
      id: '1'
    });

    try {
      c1.create({
        id: '1'
      });
    } catch (e) {
      (e instanceof Error).should.equals(true);
      e.message.should.match(/already defined/);
    }

    c1.success('1', 'data');

    const result = yield promise;

    result.should.equals('data');
  });
});