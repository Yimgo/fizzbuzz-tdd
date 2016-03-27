'use strict';

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

function run() {
  for (let i = 1; i <= 100; i += 1) {
    console.log(get(i));
  }
}

module.exports = {
  get: get,
  run: run
};
