---
title: "c8: Reducing memory management overheads"
date: 2017-02-16T00:00:00+00:00
description: "c8: Reducing memory management overheads."
---
When looking at our profiler data about 50% of the total cost comes from heap (memory management) overheads.  The
problem is that calling `new` and `delete` involve lots of locking overheads, and locking is a very expensive
proposition for modern CPUs.

Most of the large numbers we're likely to deal with aren't actually all that huge, however, so we can mitigate
the costs for smaller numbers by including a small digit buffer in each `c8::natural` object.  This does mean
that we have to copy data a little more sometimes (move constructors don't provide as much advantage in such
situations), but in general the costs are dramatically offset!  Some of the divide-heavy operations are up to 2x
faster.

`natural_check -b -v`:

```
cons 0     |         64 | pass | 0
cons 1     |         52 | pass | 123456789abc
cons 2     |         60 | pass | 0
cons 3     |        407 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1092 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        234 | pass | 115415157637671751
cons 6     |       2673 | pass | exception thrown: invalid digit
cons 7     |        274 | pass | 100000000000000000000000
count 0    |         52 | pass | 0
count 1    |         52 | pass | 64
count 2    |         52 | pass | 17
count 3    |         52 | pass | 185
add 0      |         55 | pass | 73
add 1      |         55 | pass | 42
add 2      |         55 | pass | 10000000000000001
add 3      |         61 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
add 4      |         58 | pass | 55
add 5      |         60 | pass | 1000000000000000000000001
sub 0      |         55 | pass | 50
sub 1      |         63 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         69 | pass | 897
sub 3      |       2827 | pass | exception thrown: not a number
sub 4      |         54 | pass | 38
sub 5      |       2651 | pass | exception thrown: not a number
sub 6      |         52 | pass | 0
sub 7      |         59 | pass | ffffffffffffffffffffffff
comp 0a    |         52 | pass | 0
comp 0b    |         51 | pass | 1
comp 0c    |         52 | pass | 1
comp 0d    |         51 | pass | 1
comp 0e    |         52 | pass | 0
comp 0f    |         52 | pass | 0
comp 1a    |         51 | pass | 0
comp 1b    |         49 | pass | 1
comp 1c    |         51 | pass | 1
comp 1d    |         51 | pass | 1
comp 1e    |         51 | pass | 0
comp 1f    |         51 | pass | 0
comp 2a    |         51 | pass | 0
comp 2b    |         51 | pass | 1
comp 2c    |         51 | pass | 0
comp 2d    |         51 | pass | 0
comp 2e    |         51 | pass | 1
comp 2f    |         51 | pass | 1
comp 3a    |         52 | pass | 1
comp 3b    |         52 | pass | 0
comp 3c    |         53 | pass | 0
comp 3d    |         52 | pass | 1
comp 3e    |         52 | pass | 0
comp 3f    |         53 | pass | 1
lsh 0      |         60 | pass | 349f
lsh 1      |         60 | pass | 693e
lsh 2      |         60 | pass | d27c0000
lsh 3      |         60 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         63 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         61 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         63 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         60 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         54 | pass | 11a4800
rsh 4      |         61 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         62 | pass | 66
mul 1      |         76 | pass | 9999999999999999999000000000000000000
mul 2      |         76 | pass | 8000000000000000000000000000000
mul 3      |        236 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |         65 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0      |        240 | pass | 10,10
div 1      |        648 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        484 | pass | ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       3434 | pass | exception thrown: divide by zero
div 4      |        243 | pass | 100000,0
div 5      |        182 | pass | 10000000000000001000000000000000100000000,0
div 6      |        335 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
gcd 0      |        186 | pass | 8
gcd 1      |       1162 | pass | 1
gcd 2      |         94 | pass | 8888888
gcd 3      |        421 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |         53 | pass | 0
toull 1    |         56 | pass | 2000
toull 2    |       1994 | pass | exception thrown: overflow error
toull 3    |         58 | pass | 123456789a
toull 4    |       1988 | pass | exception thrown: overflow error
prn 0      |        948 | pass | 4701397401952099592073
prn 1      |        824 | pass | fedcfedc0123456789
prn 2      |        824 | pass | FEDCFEDC0123456789
prn 3      |       1000 | pass | 775563766700044321263611
prn 4      |        948 | pass | 4701397401952099592073
prn 5      |        844 | pass | 0xfedcfedc0123456789
prn 6      |        862 | pass | 0XFEDCFEDC0123456789
prn 7      |       1018 | pass | 0775563766700044321263611
```

