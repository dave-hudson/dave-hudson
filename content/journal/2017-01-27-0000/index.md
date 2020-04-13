---
title: "c8: More performance work"
date: 2017-01-27T00:00:00+00:00
description: "c8: More performance work."
---
Improving the performance of the code clearly means reducing some of the memory management overheads.

The use of `std::vector` has been a great way to start things, and it's always a good idea to avoid explicit
uses of `new` and `delete`, but in this case any small overheads are a problem because we tend to create a lot
of objects.  In addition, being able to use a customized approach will allow alternative approaches that will
significantly optimize things for smaller numbers.  Using an array-based approach also means being able to
directly access result digit arrays.

All of the current operations are 3-operand forms: A = B op C, in which B and C are constant, but this means
that we have to allocate a new object, A, for the result.  We have 2-operand forms, A op= B, but they're
expressed in terms of the 3-operand variants.  Defining explicit versions allows us to avoid this extra overhead.

After the initial set of changes we get the following results for the `natural_check` test:

```
cons 0     |        316 | pass | 0
cons 1     |        376 | pass | 123456789abc
cons 2     |        604 | pass | 0
cons 3     |      17320 | pass | 3837439787487386792386728abcd88379dc
cons 4     |      34236 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |       5356 | pass | 115415157637671751
cons 6     |    5453013 | pass | exception thrown: invalid digit
cons 7     |       5651 | pass | 100000000000000000000000
count 0    |         66 | pass | 0
count 1    |         48 | pass | 64
count 2    |         48 | pass | 17
count 3    |         67 | pass | 185
add 0      |        224 | pass | 73
add 1      |        179 | pass | 42
add 2      |        206 | pass | 10000000000000001
add 3      |        269 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
sub 0      |        354 | pass | 50
sub 1      |        324 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |        342 | pass | 897
sub 3      |      16131 | pass | exception thrown: not a number
comp 0a    |        324 | pass | 0
comp 0b    |         70 | pass | 1
comp 0c    |         76 | pass | 1
comp 0d    |         67 | pass | 1
comp 0e    |         48 | pass | 0
comp 0f    |         45 | pass | 0
comp 1a    |         94 | pass | 0
comp 1b    |         85 | pass | 1
comp 1c    |         39 | pass | 1
comp 1d    |         58 | pass | 1
comp 1e    |         58 | pass | 0
comp 1f    |         39 | pass | 0
comp 2a    |        100 | pass | 0
comp 2b    |        106 | pass | 1
comp 2c    |         39 | pass | 0
comp 2d    |         42 | pass | 0
comp 2e    |         39 | pass | 1
comp 2f    |         58 | pass | 1
comp 3a    |        191 | pass | 1
comp 3b    |        106 | pass | 0
comp 3c    |        106 | pass | 0
comp 3d    |         82 | pass | 1
comp 3e    |         82 | pass | 0
comp 3f    |         82 | pass | 1
lsh 0a     |        376 | pass | 349f
lsh 0b     |        163 | pass | 693e
lsh 0c     |        118 | pass | d27c0000
lsh 0d     |        221 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 1a     |        293 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0a     |        272 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 0b     |        136 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 0c     |        139 | pass | 469200000000000000000000000000000000000000000000000
rsh 0d     |        148 | pass | 11a4800
rsh 1a     |        158 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |        161 | pass | 66
mul 1      |        291 | pass | 9999999999999999999000000000000000000
mul 2      |        236 | pass | 8000000000000000000000000000000
mul 3      |       1165 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |        281 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0a     |       2755 | pass | 10
div 0b     |       2755 | pass | 10
div 1a     |       8951 | pass | 78292387927518758972102054472775487212767983201652300846
div 1b     |       8951 | pass | 35600667362958008
div 2a     |       6145 | pass | ffffffffffffffff000000000000000
div 2b     |       6145 | pass | 100000000000000000000000
div 3      |      21141 | pass | exception thrown: divide by zero
div 4a     |       2770 | pass | 100000
div 4b     |       2770 | pass | 0
div 5a     |       2982 | pass | 10000000000000001000000000000000100000000
div 5b     |       2982 | pass | 0
gcd 0      |       6054 | pass | 8
gcd 1      |      31539 | pass | 1
gcd 2      |       1429 | pass | 8888888
gcd 3      |       6336 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |        103 | pass | 0
toull 1    |         66 | pass | 2000
toull 2    |      10655 | pass | exception thrown: overflow error
toull 3    |         85 | pass | 123456789a
toull 4    |       9526 | pass | exception thrown: overflow error
prn 0      |      32779 | pass | 4701397401952099592073
prn 1      |      25515 | pass | fedcfedc0123456789
prn 2      |      25197 | pass | FEDCFEDC0123456789
prn 3      |      34139 | pass | 775563766700044321263611
prn 4      |      31665 | pass | 4701397401952099592073
prn 5      |      25760 | pass | 0xfedcfedc0123456789
prn 6      |      25333 | pass | 0XFEDCFEDC0123456789
prn 7      |      33812 | pass | 0775563766700044321263611
```

The numbers for divide-heavy operations (some of the constructors, and print routines are included) are anywhere
from 8% to 20% faster.

