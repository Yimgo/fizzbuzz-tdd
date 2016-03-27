'use strict';

const assert = require('assert');
const sinon = require('sinon');
const fizzbuzz = require('../src/fizzbuzz');

describe('FizzBuzz', function () {
    describe('#get', function () {
        it('should return "Fizz" when inputting a multiple of 3', function () {
            assert.equal(fizzbuzz.get(3), "Fizz");
        });
        
        it('should return "Buzz" when inputting a multiple of 5', function () {
            assert.equal(fizzbuzz.get(5), "Buzz");
        });
        
        it('should return "FizzBuzz" when inputting both a multiple of 3 and 5', function () {
            assert.equal(fizzbuzz.get(15), "FizzBuzz");
        });
        
        it('should return the input as stringif not a multiple or 3 or 5', function () {
            assert.equal(fizzbuzz.get(7), "7");
        });
    });
    
    describe('#run', function () {
        beforeEach(function () {
            sinon.spy(console, 'log');
        });
        
        afterEach(function () {
            console.log.restore();
        });
        
        it('should call console.log 100 times', function () {
            // given
            fizzbuzz.run();
            
            // assert
            assert.equal(console.log.callCount, 100);
            assert(console.log.getCall(99).calledWith('Buzz'));
        });
    });
});
