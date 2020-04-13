---
title: "c8: Making the world a little better"
date: 2017-02-20T00:00:00+00:00
description: "c8: Supporting conversions to C++ native types."
---
## Better code layout

We're starting to find it much harder to make things faster, but there's still some scope.

One of the things that we can do is guide the compiler in how best to arrange the code.  By default the compiler
uses heuristics to work out if particular branches are likely or unlikely.  In general the compiler will
rearrange the code so that the branch will "fall through" to the most likely instruction.

In older CPU designs such hinting could have huge performance advantages, but most modern CPUs incorporate
hardware branch prediction that lets the CPU determine the most likely next instruction.  This significantly
mitigates the performance advantage of predicting branch outcomes, but there is still a small advantage from
falling through.  If we fall through then the CPU is likely to use the remaining instructions in the current
cache line, as opposed to having to switch cache lines.  A smaller cache footprint is definitely an advantage
for performance in the long run.

`gcc` and `clang` both support a builtin compiler function called `__builtin_expect` that allows a caller to
indicate whether an operation is likely or not.  This function causes the compiler to ignore its default
heuristics in favour of the annotation provided by the programmer.

## Better bit shifts

Our bit shifting operations are still quite expensive.  Curiously the left shift and right shift were not
implemented symmetrically, and this indicates a potential option to improve things.

One of the key things we've seen before is that we want to reduce the number of places that we either read or
write the memory associated with an object, leaving the compiler free to do better code and register selection.
A little rethinking would let this happen in the bit shifting code too.  By giving right shifts special case
handling for shifts of a whole digit then things could improve there too.

## Putting it together

The effect of making things more regular and setting up better code layout can be seen below
(`natural_check -b -v`).  We have a number of small performance gains:

```
cons 0     |         64 | pass | 0
cons 1     |         51 | pass | 123456789abc
cons 2     |         61 | pass | 0
cons 3     |        409 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1054 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        219 | pass | 115415157637671751
cons 6     |       2639 | pass | exception thrown: invalid digit
cons 7     |        276 | pass | 100000000000000000000000
count 0    |         52 | pass | 0
count 1    |         52 | pass | 64
count 2    |         52 | pass | 17
count 3    |         52 | pass | 185
add 0      |         56 | pass | 73
add 1      |         55 | pass | 42
add 2      |         56 | pass | 10000000000000001
add 3      |         62 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
add 4      |         70 | pass | 55
add 5      |         61 | pass | 1000000000000000000000001
sub 0      |         56 | pass | 50
sub 1      |         63 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         69 | pass | 897
sub 3      |       2727 | pass | exception thrown: not a number
sub 4      |         54 | pass | 38
sub 5      |       2750 | pass | exception thrown: not a number
sub 6      |         53 | pass | 0
sub 7      |         56 | pass | ffffffffffffffffffffffff
comp 0a    |         52 | pass | 0
comp 0b    |         52 | pass | 1
comp 0c    |         52 | pass | 1
comp 0d    |         52 | pass | 1
comp 0e    |         52 | pass | 0
comp 0f    |         52 | pass | 0
comp 1a    |         52 | pass | 0
comp 1b    |         52 | pass | 1
comp 1c    |         50 | pass | 1
comp 1d    |         52 | pass | 1
comp 1e    |         52 | pass | 0
comp 1f    |         52 | pass | 0
comp 2a    |         52 | pass | 0
comp 2b    |         52 | pass | 1
comp 2c    |         52 | pass | 0
comp 2d    |         52 | pass | 0
comp 2e    |         52 | pass | 1
comp 2f    |         52 | pass | 1
comp 3a    |         53 | pass | 1
comp 3b    |         53 | pass | 0
comp 3c    |         53 | pass | 0
comp 3d    |         53 | pass | 1
comp 3e    |         53 | pass | 0
comp 3f    |         53 | pass | 1
lsh 0      |         60 | pass | 349f
lsh 1      |         57 | pass | 693e
lsh 2      |         56 | pass | d27c0000
lsh 3      |         60 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         63 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         56 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         61 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         61 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         54 | pass | 11a4800
rsh 4      |         61 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         61 | pass | 66
mul 1      |         78 | pass | 9999999999999999999000000000000000000
mul 2      |         78 | pass | 8000000000000000000000000000000
mul 3      |        233 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |         65 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0      |        224 | pass | 10,10
div 1      |        624 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        468 | pass | ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       3939 | pass | exception thrown: divide by zero
div 4      |        221 | pass | 100000,0
div 5      |        179 | pass | 10000000000000001000000000000000100000000,0
div 6      |        327 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
gcd 0      |        180 | pass | 8
gcd 1      |       1129 | pass | 1
gcd 2      |         94 | pass | 8888888
gcd 3      |        406 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |         53 | pass | 0
toull 1    |         55 | pass | 2000
toull 2    |       2004 | pass | exception thrown: overflow error
toull 3    |         55 | pass | 123456789a
toull 4    |       2032 | pass | exception thrown: overflow error
prn 0      |        952 | pass | 4701397401952099592073
prn 1      |        832 | pass | fedcfedc0123456789
prn 2      |        831 | pass | FEDCFEDC0123456789
prn 3      |        997 | pass | 775563766700044321263611
prn 4      |        954 | pass | 4701397401952099592073
prn 5      |        859 | pass | 0xfedcfedc0123456789
prn 6      |        856 | pass | 0XFEDCFEDC0123456789
prn 7      |       1012 | pass | 0775563766700044321263611
```

