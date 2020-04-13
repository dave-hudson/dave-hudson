---
title: "c8: Continuing performance investigations"
date: 2017-01-21T00:00:00+00:00
description: "c8: Continuing performance investigations."
---
The numbers from yesterday strongly indicated that we were spending a lot of CPU time in memory management.
The most obvious place that we could be spending this would be the creation and deletion of temporary natural
number objects during our calculations.

Starting with C++11, one of the major performance improvements came from the ability to use move constructors
and move assignment operators.  By default our natural number class supported these, but it wasn't clear if we
were actually moving, rather than copying, everywhere that we should have been.

In theory we could just check our binary output and look for uses of the various constructors and operators, but
a pretty simple approach is simply to add non-default versions and then trace their use.

Doing this showed up some specific problems related to the use of `std::pair`.  By using `std::move()` quite a
number of copy operations could be replaced with more efficient moves.  The relevant commit is
[b04347b037f17af66ef8a397248288508bff7024](https://github.com/hashingitcom/c8/commit/b04347b037f17af66ef8a397248288508bff7024).

The performance doesn't change by a huge margin, but it's notably quicker:

```
cons 0     |        316 | pass | 0
cons 1     |       2660 | pass | 123456789abc
cons 2     |        900 | pass | 0
cons 3     |      19200 | pass | 3837439787487386792386728abcd88379dc
cons 4     |      40240 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |       6868 | pass | 115415157637671751
cons 6     |    5378579 | pass | exception thrown: invalid digit
cons 7     |       7928 | pass | 100000000000000000000000
count 0    |         72 | pass | 0
count 1    |         76 | pass | 64
count 2    |         76 | pass | 17
count 3    |         64 | pass | 185
add 0      |        132 | pass | 73
add 1      |        160 | pass | 42
add 2      |        440 | pass | 10000000000000001
add 3      |        260 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
sub 0      |        184 | pass | 50
sub 1      |        280 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |        332 | pass | 897
sub 3      |      18096 | pass | exception thrown: not a number
comp 0a    |        336 | pass | 0
comp 0b    |        108 | pass | 1
comp 0c    |         84 | pass | 1
comp 0d    |         76 | pass | 1
comp 0e    |         76 | pass | 0
comp 0f    |        328 | pass | 0
comp 1a    |         85 | pass | 0
comp 1b    |         85 | pass | 1
comp 1c    |         61 | pass | 1
comp 1d    |         42 | pass | 1
comp 1e    |         61 | pass | 0
comp 1f    |         61 | pass | 0
comp 2a    |        103 | pass | 0
comp 2b    |        103 | pass | 1
comp 2c    |         61 | pass | 0
comp 2d    |         61 | pass | 0
comp 2e    |         39 | pass | 1
comp 2f    |         64 | pass | 1
comp 3a    |        160 | pass | 1
comp 3b    |         97 | pass | 0
comp 3c    |         97 | pass | 0
comp 3d    |         60 | pass | 1
comp 3e    |         60 | pass | 0
comp 3f    |         97 | pass | 1
lsh 0a     |        164 | pass | 349f
lsh 0b     |        173 | pass | 693e
lsh 0c     |        142 | pass | d27c0000
lsh 0d     |        309 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 1a     |        300 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0a     |        257 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 0b     |        233 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 0c     |        258 | pass | 469200000000000000000000000000000000000000000000000
rsh 0d     |        112 | pass | 11a4800
rsh 1a     |        218 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |        175 | pass | 66
mul 1      |        266 | pass | 9999999999999999999000000000000000000
mul 2      |        212 | pass | 8000000000000000000000000000000
mul 3      |       1099 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
div 0a     |       3760 | pass | 10
div 0b     |       3760 | pass | 10
div 1a     |      15193 | pass | 78292387927518758972102054472775487212767983201652300846
div 1b     |      15193 | pass | 35600667362958008
div 2a     |      10386 | pass | ffffffffffffffff000000000000000
div 2b     |      10386 | pass | 100000000000000000000000
div 3      |      25712 | pass | exception thrown: divide by zero
div 4a     |       3375 | pass | 100000
div 4b     |       3375 | pass | 0
gcd 0      |       6475 | pass | 8
gcd 1      |      35789 | pass | 1
gcd 2      |       1544 | pass | 8888888
gcd 3      |       6817 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |         97 | pass | 0
toull 1    |        112 | pass | 2000
toull 2    |      10725 | pass | exception thrown: overflow error
toull 3    |         88 | pass | 123456789a
toull 4    |       8627 | pass | exception thrown: overflow error
prn 0      |      43160 | pass | 4701397401952099592073
prn 1      |      34063 | pass | fedcfedc0123456789
prn 2      |      34396 | pass | FEDCFEDC0123456789
prn 3      |      46232 | pass | 775563766700044321263611
prn 4      |      42436 | pass | 4701397401952099592073
prn 5      |      34423 | pass | 0xfedcfedc0123456789
prn 6      |      34054 | pass | 0XFEDCFEDC0123456789
prn 7      |      45911 | pass | 0775563766700044321263611
```

