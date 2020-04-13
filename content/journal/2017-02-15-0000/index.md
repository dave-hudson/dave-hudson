---
title: "c8: Yet (again) more performance work"
date: 2017-02-15T00:00:00+00:00
description: "c8: Yet (again) more performance work."
---
One of the things that the previous changes to normalization highlighted was that we might be touching memory
more than we might want.  As CPUs get faster, but memories don't, then memory access costs get increasingly more
expensive, and so any unnecessary memory touches are to be avoided:

* The `c8::natural::reserve()` method was zeroing memory when the `new` operator was called, but in most cases
this wasn't required.

* Some member variables of the `c8::natural` class were being accessed in ways that might lead to more registers
being required (although in general this didn't happen with clang as a compiler).

Results for `normal_check -v -b`:

```
cons 0     |         64 | pass | 0
cons 1     |         73 | pass | 123456789abc
cons 2     |         54 | pass | 0
cons 3     |        554 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1381 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        287 | pass | 115415157637671751
cons 6     |       2783 | pass | exception thrown: invalid digit
cons 7     |        371 | pass | 100000000000000000000000
count 0    |         52 | pass | 0
count 1    |         52 | pass | 64
count 2    |         52 | pass | 17
count 3    |         51 | pass | 185
add 0      |         69 | pass | 73
add 1      |         70 | pass | 42
add 2      |         71 | pass | 10000000000000001
add 3      |         74 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
add 4      |         69 | pass | 55
add 5      |         69 | pass | 1000000000000000000000001
sub 0      |         71 | pass | 50
sub 1      |         80 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         82 | pass | 897
sub 3      |       2666 | pass | exception thrown: not a number
sub 4      |         70 | pass | 38
sub 5      |       2740 | pass | exception thrown: not a number
sub 6      |         53 | pass | 0
sub 7      |         71 | pass | ffffffffffffffffffffffff
comp 0a    |         52 | pass | 0
comp 0b    |         52 | pass | 1
comp 0c    |         52 | pass | 1
comp 0d    |         52 | pass | 1
comp 0e    |         52 | pass | 0
comp 0f    |         52 | pass | 0
comp 1a    |         52 | pass | 0
comp 1b    |         52 | pass | 1
comp 1c    |         55 | pass | 1
comp 1d    |         52 | pass | 1
comp 1e    |         52 | pass | 0
comp 1f    |         52 | pass | 0
comp 2a    |         52 | pass | 0
comp 2b    |         52 | pass | 1
comp 2c    |         52 | pass | 0
comp 2d    |         52 | pass | 0
comp 2e    |         50 | pass | 1
comp 2f    |         59 | pass | 1
comp 3a    |         53 | pass | 1
comp 3b    |         53 | pass | 0
comp 3c    |         53 | pass | 0
comp 3d    |         53 | pass | 1
comp 3e    |         53 | pass | 0
comp 3f    |         53 | pass | 1
lsh 0      |         73 | pass | 349f
lsh 1      |         76 | pass | 693e
lsh 2      |         74 | pass | d27c0000
lsh 3      |         73 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         79 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         72 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         72 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         73 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         69 | pass | 11a4800
rsh 4      |         72 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         71 | pass | 66
mul 1      |         86 | pass | 9999999999999999999000000000000000000
mul 2      |         85 | pass | 8000000000000000000000000000000
mul 3      |        241 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |         71 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0      |        405 | pass | 10,10
div 1      |       1207 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        813 | pass | ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       3207 | pass | exception thrown: divide by zero
div 4      |        355 | pass | 100000,0
div 5      |        192 | pass | 10000000000000001000000000000000100000000,0
div 6      |        562 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
gcd 0      |        318 | pass | 8
gcd 1      |       2277 | pass | 1
gcd 2      |        132 | pass | 8888888
gcd 3      |        662 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |         52 | pass | 0
toull 1    |         53 | pass | 2000
toull 2    |       1991 | pass | exception thrown: overflow error
toull 3    |         54 | pass | 123456789a
toull 4    |       1990 | pass | exception thrown: overflow error
prn 0      |       1320 | pass | 4701397401952099592073
prn 1      |       1137 | pass | fedcfedc0123456789
prn 2      |       1144 | pass | FEDCFEDC0123456789
prn 3      |       1385 | pass | 775563766700044321263611
prn 4      |       1356 | pass | 4701397401952099592073
prn 5      |       1135 | pass | 0xfedcfedc0123456789
prn 6      |       1114 | pass | 0XFEDCFEDC0123456789
prn 7      |       1432 | pass | 0775563766700044321263611
```

