---
title: "c8: More speedups"
date: 2017-01-31T00:00:00+00:00
description: "c8: More speedups."
---
So far our operations are all based around the `c8::natural` class, but in many instances we only want to operate
on a natural number in combination with a single `c8::natural_digit`.  The advantage is that we don't have to do
anything to create a second `c8::natural` object, and also we only have to consider a single digit rather than
iterating over more than one digit.

The speedups for divide, constructor and printing operations are up to 4x!

```
cons 0     |        308 | pass | 0
cons 1     |        372 | pass | 123456789abc
cons 2     |        388 | pass | 0
cons 3     |       5696 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       9132 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |       1924 | pass | 115415157637671751
cons 6     |    5203408 | pass | exception thrown: invalid digit
cons 7     |       3068 | pass | 100000000000000000000000
count 0    |         80 | pass | 0
count 1    |         56 | pass | 64
count 2    |         56 | pass | 17
count 3    |         56 | pass | 185
add 0      |        484 | pass | 73
add 1      |        212 | pass | 42
add 2      |        212 | pass | 10000000000000001
add 3      |        300 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
add 4      |        236 | pass | 55
add 5      |        212 | pass | 1000000000000000000000001
sub 0      |        588 | pass | 50
sub 1      |        808 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |        742 | pass | 897
sub 3      |      36969 | pass | exception thrown: not a number
sub 4      |        575 | pass | 38
sub 5      |      20414 | pass | exception thrown: not a number
sub 6      |        124 | pass | 0
sub 7      |        369 | pass | ffffffffffffffffffffffff
comp 0a    |        370 | pass | 0
comp 0b    |        124 | pass | 1
comp 0c    |         69 | pass | 1
comp 0d    |        103 | pass | 1
comp 0e    |         72 | pass | 0
comp 0f    |        109 | pass | 0
comp 1a    |        109 | pass | 0
comp 1b    |        127 | pass | 1
comp 1c    |         79 | pass | 1
comp 1d    |         72 | pass | 1
comp 1e    |         94 | pass | 0
comp 1f    |         63 | pass | 0
comp 2a    |        124 | pass | 0
comp 2b    |        121 | pass | 1
comp 2c    |         88 | pass | 0
comp 2d    |         88 | pass | 0
comp 2e    |         79 | pass | 1
comp 2f    |         70 | pass | 1
comp 3a    |        242 | pass | 1
comp 3b    |        130 | pass | 0
comp 3c    |        100 | pass | 0
comp 3d    |        100 | pass | 1
comp 3e    |        106 | pass | 0
comp 3f    |        109 | pass | 1
lsh 0a     |        675 | pass | 349f
lsh 0b     |        218 | pass | 693e
lsh 0c     |        197 | pass | d27c0000
lsh 0d     |        400 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 1a     |        330 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0a     |        445 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 0b     |        254 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 0c     |        209 | pass | 469200000000000000000000000000000000000000000000000
rsh 0d     |        160 | pass | 11a4800
rsh 1a     |        294 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |        635 | pass | 66
mul 1      |        490 | pass | 9999999999999999999000000000000000000
mul 2      |        315 | pass | 8000000000000000000000000000000
mul 3      |       1650 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |        303 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0a     |       3590 | pass | 10
div 0b     |       3590 | pass | 10
div 1a     |       7601 | pass | 78292387927518758972102054472775487212767983201652300846
div 1b     |       7601 | pass | 35600667362958008
div 2a     |       5361 | pass | ffffffffffffffff000000000000000
div 2b     |       5361 | pass | 100000000000000000000000
div 3      |      25388 | pass | exception thrown: divide by zero
div 4a     |       3036 | pass | 100000
div 4b     |       3036 | pass | 0
div 5a     |       3454 | pass | 10000000000000001000000000000000100000000
div 5b     |       3454 | pass | 0
div 6a     |       3835 | pass | 1000000000000000000000000ffffffff
div 6b     |       3835 | pass | ffffffffffffffff000000010000000000000000
gcd 0      |       6396 | pass | 8
gcd 1      |      29229 | pass | 1
gcd 2      |       1504 | pass | 8888888
gcd 3      |       6345 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |        115 | pass | 0
toull 1    |         73 | pass | 2000
toull 2    |      11354 | pass | exception thrown: overflow error
toull 3    |         85 | pass | 123456789a
toull 4    |       9063 | pass | exception thrown: overflow error
prn 0      |       7589 | pass | 4701397401952099592073
prn 1      |       6263 | pass | fedcfedc0123456789
prn 2      |       6085 | pass | FEDCFEDC0123456789
prn 3      |       7792 | pass | 775563766700044321263611
prn 4      |       7120 | pass | 4701397401952099592073
prn 5      |       6466 | pass | 0xfedcfedc0123456789
prn 6      |       6278 | pass | 0XFEDCFEDC0123456789
prn 7      |       7704 | pass | 0775563766700044321263611
```

