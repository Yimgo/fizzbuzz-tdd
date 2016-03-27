SHELL := /bin/bash
.PHONY: test

test:
	diff <(node src/fizzbuzz.js) test/fixtures/expectedOutput && echo 'OK' || echo 'NOK'
