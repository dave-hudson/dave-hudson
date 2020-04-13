---
title: "c8: Improving shifts and digit operations"
date: 2017-02-21T00:00:00+00:00
description: "c8: Improving shifts and digit operations."
---
## Improving shifts

The `<<` and `>>` operators are unusual in that we set them up to support in-place mutations of the sort required
for `<<=` and `>>=` but never implemented that code.  The divide logic does a lot of things that would benefit
from these, however.

While the fascination with divide/modulus and gcd performance may seem a little obsessive, they are not without
merit.  The rational number code makes extensive use of gcd and divide to normalize values.

As well as implementing the `<<=` and `>>=` operators, another area for improvement is the logic of what the shift
functions actually do.  Both left and right shifts have currently been defined to use double-digit logic, but this
isn't actually necessary.  In fact we'd like to make our single digit operations use the largest possible CPU
register size and that makes double digit operations, especially shifts, more expensive because they now have to
be composed, instead of being single opcodes.  Reworking these algorithms makes quite a difference.

## Digit operations 

Another fairly painful operation is moving and zeroing digit arrays.  While `std::memset()` and `std::memcpy()`
are actually very well implemented, neither is ideally suited to what we need.  A simple inline replacement
strategy works rather nicely!

## Results

`natural_check -b -v` now yields some substantial improvements in several functions.  Our only downside is that
string-based constructors are now running quite a lot slower, but we can revisit this later:

```
cons 0     |         62 | pass | 0
cons 1     |         59 | pass | 123456789abc
cons 2     |         63 | pass | 0
cons 3     |        467 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1183 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        248 | pass | 115415157637671751
cons 6     |       2533 | pass | exception thrown: invalid digit
cons 7     |        316 | pass | 100000000000000000000000
count 0    |         50 | pass | 0
count 1    |         52 | pass | 64
count 2    |         52 | pass | 17
count 3    |         52 | pass | 185
add 0      |         56 | pass | 73
add 1      |         55 | pass | 42
add 2      |         58 | pass | 10000000000000001
add 3      |         61 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
add 4      |         55 | pass | 55
add 5      |         59 | pass | 1000000000000000000000001
sub 0      |         55 | pass | 50
sub 1      |         63 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         69 | pass | 897
sub 3      |       2667 | pass | exception thrown: not a number
sub 4      |         66 | pass | 38
sub 5      |       2703 | pass | exception thrown: not a number
sub 6      |         53 | pass | 0
sub 7      |         58 | pass | ffffffffffffffffffffffff
comp 0a    |         52 | pass | 0
comp 0b    |         52 | pass | 1
comp 0c    |         52 | pass | 1
comp 0d    |         50 | pass | 1
comp 0e    |         52 | pass | 0
comp 0f    |         52 | pass | 0
comp 1a    |         51 | pass | 0
comp 1b    |         51 | pass | 1
comp 1c    |         51 | pass | 1
comp 1d    |         51 | pass | 1
comp 1e    |         52 | pass | 0
comp 1f    |         51 | pass | 0
comp 2a    |         51 | pass | 0
comp 2b    |         51 | pass | 1
comp 2c    |         51 | pass | 0
comp 2d    |         51 | pass | 0
comp 2e    |         52 | pass | 1
comp 2f    |         52 | pass | 1
comp 3a    |         53 | pass | 1
comp 3b    |         53 | pass | 0
comp 3c    |         53 | pass | 0
comp 3d    |         53 | pass | 1
comp 3e    |         53 | pass | 0
comp 3f    |         53 | pass | 1
lsh 0      |         54 | pass | 349f
lsh 1      |         56 | pass | 693e
lsh 2      |         55 | pass | d27c0000
lsh 3      |         58 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         64 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         55 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         62 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         62 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         54 | pass | 11a4800
rsh 4      |         62 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         61 | pass | 66
mul 1      |         75 | pass | 9999999999999999999000000000000000000
mul 2      |         75 | pass | 8000000000000000000000000000000
mul 3      |        230 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |         64 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0      |        182 | pass | 10,10
div 1      |        562 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        439 | pass | ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       3587 | pass | exception thrown: divide by zero
div 4      |        181 | pass | 100000,0
div 5      |        172 | pass | 10000000000000001000000000000000100000000,0
div 6      |        294 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
gcd 0      |        152 | pass | 8
gcd 1      |        944 | pass | 1
gcd 2      |         88 | pass | 8888888
gcd 3      |        365 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |         52 | pass | 0
toull 1    |         53 | pass | 2000
toull 2    |       1964 | pass | exception thrown: overflow error
toull 3    |         54 | pass | 123456789a
toull 4    |       1983 | pass | exception thrown: overflow error
prn 0      |        945 | pass | 4701397401952099592073
prn 1      |        817 | pass | fedcfedc0123456789
prn 2      |        827 | pass | FEDCFEDC0123456789
prn 3      |        981 | pass | 775563766700044321263611
prn 4      |        948 | pass | 4701397401952099592073
prn 5      |        853 | pass | 0xfedcfedc0123456789
prn 6      |        853 | pass | 0XFEDCFEDC0123456789
prn 7      |       1009 | pass | 0775563766700044321263611
```

