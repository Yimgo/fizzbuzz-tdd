# FizzBuzz, test-driven

Hiring is hard, everybody knows it. I mean, how can I judge anyone's ability to fulfill the job requirements in just one hour, or an afternoon ? How can I be sure that the questions I ask or the open discussion we had is a good discriminant in the matter ?
Truth is, I have no idea.

Here comes FizzBuzz : the algorithm behind is pretty straightforward, so event the most stressed and anxious candidate should be able to give out a simple implementation; it can be written  in a handful of paradigms; it is an opener to discussions we may never have in a standard interview.

## The spec

The specification to the problem is quite simple: print the integers from 1 to 100, except multiples of three, in which cases print "Fizz", and multiples of five, in which cases print "Buzz".

That's it.

## Test-driven

Let's add some directions: please do it test-driven.

> okay, let's throw up mocha, jasming, cucumber, or whatever...

Hum, it could be a bit overkill, couldn't it ?

Let's reduce the problem to the numbers from 1 to 10:

```
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
```

I see here a good opportunity to test our program given its output.

### Comparing outputs

Create a good ol' `Makefile`:

```
SHELL := /bin/bash
.PHONY: test

test:
	diff <(node src/fizzbuzz.js) test/fixtures/expectedOutput && echo 'OK' || echo 'NOK'
```

You can also add to the package.json:

```json
"scripts": {
  "start": "node src/fizzbuzz.js",
  "test": "make test"
}
```

That should be enough to test whether our implementation somehow matches the spec, right ?

```js
['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz'].forEach(str => console.log(str));
```

Now let's run `make test`:
```
$ make test
diff <(node src/fizzbuzz.js) test/fixtures/expectedOutput && echo 'OK' || echo 'NOK'
OK
```

Great, isn't it ?

Now let's come up with a more reasonable implementation of the problem:

```js
for (let i = 1; i <= 10; i += 1) {
  if (i % 3 === 0) {
    console.log('Fizz');
  } else if (i % 5 === 0) {
    console.log('Buzz');
  } else {
    console.log(i.toString());
  }
}
```

```
$ make test
diff <(node src/fizzbuzz.js) test/fixtures/expectedOutput && echo 'OK' || echo 'NOK'
OK
```

Neat, huh ? This is not the smartest implementation outta here, but, heck, it does the trick.

### Mocha

We can divide the above implementation in two logical entities: the for-loop allowing us to print from 1 to 100, and our business logic, inputting an integer and outputting Fizz, Buzz or the input.

We begin here with the latter, and mocha is the simplest tool around.

Let's add mocha to our `package.json`:

```json
{
  "scripts": {
    "test": "mocha --reporter spec test/fizzbuzz-spec.js"
  },
  "devDependencies": {
    "mocha": "*"
  }
}
```

and write our test suite:

```js
const assert = require('assert');
const fizzbuzz = require('../src/fizzbuzz');

describe('FizzBuzz', function () {
    it('should return "Fizz" when inputting a multiple of 3', function () {
        assert.equal(fizzbuzz.get(3), "Fizz");
    });
    
    it('should return "Buzz" when inputting a multiple of 5', function () {
        assert.equal(fizzbuzz.get(5), "Buzz");
    });
    
    it('should return the input as stringif not a multiple or 3 or 5', function () {
        assert.equal(fizzbuzz.get(7), "7");
    });
});
```

```
$ npm install
$ npm test

> fizzbuzz-tdd@0.0.0 test /home/ubuntu/workspace
> mocha --reporter spec test/fizzbuzz-spec.js

1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz


  FizzBuzz
    1) should return "Fizz" when inputting a multiple of 3
    2) should return "Buzz" when inputting a multiple of 5
    3) should return the input as stringif not a multiple or 3 or 5


  0 passing (14ms)
  3 failing

  1) FizzBuzz should return "Fizz" when inputting a multiple of 3:
     TypeError: fizzbuzz.get is not a function
      at Context.<anonymous> (test/fizzbuzz-spec.js:8:31)

  2) FizzBuzz should return "Buzz" when inputting a multiple of 5:
     TypeError: fizzbuzz.get is not a function
      at Context.<anonymous> (test/fizzbuzz-spec.js:12:31)

  3) FizzBuzz should return the number else:
     TypeError: fizzbuzz.get is not a function
      at Context.<anonymous> (test/fizzbuzz-spec.js:16:31)



npm ERR! Test failed.  See above for more details.
```

Well, we could expect that given our first implementation.
Let's rework our solution:

```js
function get(num) {
  if (num % 3 === 0) {
    return 'Fizz';
  } else if (num % 5 === 0) {
    return 'Buzz';
  }
  return num.toString();
}

for (let i = 1; i <= 10; i += 1) {
  console.log(get(i));
}

module.exports = {
    get: get
};
```

Run the tests:

```
$ npm test

  FizzBuzz
    ✓ should return "Fizz" when inputting a multiple of 3
    ✓ should return "Buzz" when inputting a multiple of 5
    ✓ should return the input as stringif not a multiple or 3 or 5


  3 passing (7ms)

$ make test
diff <(node src/fizzbuzz.js) test/fixtures/expectedOutput && echo 'OK' || echo 'NOK'
OK
```

Our implementation passes the unit tests and the output test both !

Wait, what about 15 ? It is a multiple of both 3 and 5, right ? So maybe we should write 'FizzBuzz' !

```js
const assert = require('assert');
const sinon = require('sinon');
const fizzbuzz = require('../src/fizzbuzz');

describe('FizzBuzz', function () {
    describe('#get', function () {
        it('should return "FuzzBuzz" when inputting both a multiple of 3 and 5', function () {
            assert.equal(fizzbuzz.get(5), "FizzBuzz");
        });
    });
});
```

```js
function get(num) {
  let str = '';

  if (num % 3 === 0 || num % 5 === 0) {
    if (num % 3 === 0) {
      str += 'Fizz';
    }
    if (num % 5 === 0) {
      str += 'Buzz';
    }
  } else {
    str += num.toString();
  }

  return str;
}
```

```
$ npm test

> fizzbuzz-tdd@0.0.0 test /home/ubuntu/workspace
> mocha --reporter spec test/fizzbuzz-spec.js



  FizzBuzz
    #get
      ✓ should return "FizzBuzz" when inputting both a multiple of 3 and 5

  1 passing (4ms)
```

But, weren't we supposed to count to 100 ?

### Spies

We can forget our Makefile-base testing here, as we only have an output from 1 to 10 and it's be fastidious to complete it from 10 to 100.

What if we could know how many times console.log() was called ? Here come spies !

Sinon is a test spies and stubs libraries enabling you to know how many times a function was called, and the arguments it was called with.

What if we could do:

```js
const assert = require('assert');
const sinon = require('sinon');
const fizzbuzz = require('../src/fizzbuzz');

describe('FizzBuzz', function () {
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
```

With:

```js
function run() {
    for (let i = 1; i <= 100; i += 1) {
      console.log(get(i));
    }
}

module.exports = {
    get: get,
    run: run
};
```

That'll get you:

```
$ npm test

> fizzbuzz-tdd@0.0.0 test /home/ubuntu/workspace
> mocha --reporter spec test/fizzbuzz-spec.js



  FizzBuzz
    #run
      ✓ should call console.log 100 times (54ms)


  1 passing (54ms)
```

## Bonus

Your challenge now is to change the implementation without modify the tests OR modify the tests first.

## Show me the code !

You can check out a copy of this project on Github: [Yimgo/fizzbuzz-tdd](TODO)

## Conclusion

I hope this article gave you a good insight on how to test your Node.js programs.
