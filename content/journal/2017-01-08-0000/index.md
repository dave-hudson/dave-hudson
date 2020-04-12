---
title: "c8: Initial thoughts for an arbitrary precision maths library"
date: 2017-01-08T00:00:00+00:00
description: "c8: Initial thoughts for an arbitrary precision maths library."
---
The first version of the library only supports natural numbers (zero and positive integers), although these are
intended to be used as the basis of building quite a few more types later.

The code is intended to have a straightforward implementation, rather than being designed for the highest levels
of performance.  It supports an initial set of C++ operators: +, -, \*, /, %, <<, >>, and bit counting.  The <<
stream operator is also available.

From the outset there are a small set of unit tests that will be extended over time.  The unit test infrastructure
also includes performance tests so we can see how fast each operation is.  The performance numbers will let us assess
the effects of any improvements over time.

## Build environment

The code is currently built using `clang`.  Go to the top level directory and run `make`.

## Design

The design follows the essential approaches to simple maths operations that are usually taught in schools.  While
most people are familiar with this approach using base 10 (decimal) digits, the same approach works for base 2
(binary) digits just as well, although binary is slower to use long-hand.  When using binary digits it is possible
to implement all operations using just addition, subtraction and bit shifting, but if we use any larger digit size
then divide operations require multiplication too.

In our case we want things to be as fast as we can, so we default to using digits that are much larger: 32 bits.
In theory we could make these larger still with some 64-bit CPUs, and the software is designed with the idea that
this might happen in the future.

Throughout the code I've tried to comment on the algorithms that are being used as making them comprehensible is
actually more important than anything else at this point.

## Performance results

Running `natural_check -v` on an Intel Core i7 @ 2.8 GHz gives results such as these:

```
cons 0     |        312 | pass | 0
cons 1     |      11628 | pass | 123456789abc
cons 2     |       2144 | pass | 0
cons 3     |      27140 | pass | 3837439787487386792386728abcd88379dc
cons 4     |      45112 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |       9028 | pass | 115415157637671751
cons 6     |      92784 | pass | exception thrown: invalid digit
count 0    |        100 | pass | 0
count 1    |        100 | pass | 64
count 2    |        100 | pass | 17
count 3    |         64 | pass | 185
add 0      |        224 | pass | 73
add 1      |        188 | pass | 42
add 2      |        604 | pass | 10000000000000001
add 3      |        372 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
sub 0      |        236 | pass | 50
sub 1      |        392 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |        436 | pass | 897
sub 3      |      23212 | pass | exception thrown: negative result
comp 0a    |        344 | pass | 0
comp 0b    |        104 | pass | 1
comp 0c    |        104 | pass | 1
comp 0d    |        104 | pass | 1
comp 0e    |        100 | pass | 0
comp 0f    |        100 | pass | 0
comp 1a    |        124 | pass | 0
comp 1b    |        116 | pass | 1
comp 1c    |         88 | pass | 1
comp 1d    |        104 | pass | 1
comp 1e    |         88 | pass | 0
comp 1f    |         88 | pass | 0
comp 2a    |        148 | pass | 0
comp 2b    |        144 | pass | 1
comp 2c    |         88 | pass | 0
comp 2d    |         88 | pass | 0
comp 2e    |         92 | pass | 1
comp 2f    |         88 | pass | 1
comp 3a    |        220 | pass | 1
comp 3b    |        144 | pass | 0
comp 3c    |        120 | pass | 0
comp 3d    |        120 | pass | 1
comp 3e    |        120 | pass | 0
comp 3f    |        120 | pass | 1
lsh 0a     |        228 | pass | 349f
lsh 0b     |        272 | pass | 693e
lsh 0c     |        244 | pass | d27c0000
lsh 0d     |        528 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 1a     |        360 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0a     |        416 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 0b     |        292 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 0c     |        240 | pass | 469200000000000000000000000000000000000000000000000
rsh 0d     |        236 | pass | 11a4800
rsh 1a     |        315 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |        324 | pass | 66
mul 1      |        363 | pass | 9999999999999999999000000000000000000
mul 2      |        312 | pass | 8000000000000000000000000000000
mul 3      |       1293 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
div 0a     |       5585 | pass | 10
div 0b     |       5585 | pass | 10
div 1a     |      18492 | pass | 78292387927518758972102054472775487212767983201652300846
div 1b     |      18492 | pass | 35600667362958008
div 2a     |      12250 | pass | ffffffffffffffff000000000000000
div 2b     |      12250 | pass | 100000000000000000000000
prn 0      |      51127 | pass | 4701397401952099592073
prn 1      |      39194 | pass | fedcfedc0123456789
prn 2      |      38824 | pass | FEDCFEDC0123456789
prn 3      |      52407 | pass | 775563766700044321263611
prn 4      |      48469 | pass | 4701397401952099592073
prn 5      |      39400 | pass | 0xfedcfedc0123456789
prn 6      |      39124 | pass | 0XFEDCFEDC0123456789
prn 7      |      52489 | pass | 0775563766700044321263611
All tests passed
```

The result format is the test name, runtime in CPU clocks, test status, and the computed result.

