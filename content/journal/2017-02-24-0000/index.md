---
title: "c8: Compiler frustrations!"
date: 2017-02-24T00:00:00+00:00
description: "c8: Compiler frustrations!"
---
One of the nice performance features of C++ is that it should be possible to support return value optimization
(RVO).  In this the compiler will avoid unnecessary copy and move operations when returning a local object from
a called function.  This allows us to write code in which our various number objects should be handled very
efficiently and should have value semantics (we can return by value).

There's only one problem: g++ and clang don't always like things that are actually OK.  If we have 2 different
types of return value from a function (e.g. returning 2 different value objects), then the compilers can get upset
and not do RVO.  When this happens we end up doing a lot of extra work!

We can make things better by defining a single return variable at the head of a function/method and always
returning that.  It's a nuisance though, because it makes our code more messy.

Another source of frustrations is that making fairly minor changes to code can result in our compilers rearranging
code so that things that used to be fast, suddenly aren't anymore.  Another minor change and things end up back
where they were.  The problem is that compilers use a lot of heuristics to decide if particular optimizations
should or should not be used, so minor changes trigger different optimization decisions.

This means that when trying to work out if a change is good or not, the only approach is to stare at the assembler
output from the compiler and see if it's better!

Sigh!

## New performance numbers

Not always better than we've seen before, but for the record...

`natural_check -b -v`:

```
cons 0     |         63 | pass | 0
cons 1     |         50 | pass | 123456789abc
cons 2     |         55 | pass | 0
cons 3     |        481 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1187 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        265 | pass | 115415157637671751
cons 6     |       2566 | pass | exception thrown: invalid digit
cons 7     |        321 | pass | 100000000000000000000000
count 0    |         51 | pass | 0
count 1    |         52 | pass | 64
count 2    |         52 | pass | 17
count 3    |         52 | pass | 185
add 0      |         55 | pass | 73
add 1      |         55 | pass | 42
add 2      |         56 | pass | 10000000000000001
add 3      |         61 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
add 4      |         53 | pass | 55
add 5      |         53 | pass | 1000000000000000000000001
sub 0      |         55 | pass | 50
sub 1      |         63 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         69 | pass | 897
sub 3      |       2720 | pass | exception thrown: not a number
sub 4      |         54 | pass | 38
sub 5      |       2748 | pass | exception thrown: not a number
sub 6      |         53 | pass | 0
sub 7      |         58 | pass | ffffffffffffffffffffffff
comp 0a    |         51 | pass | 0
comp 0b    |         52 | pass | 1
comp 0c    |         51 | pass | 1
comp 0d    |         51 | pass | 1
comp 0e    |         52 | pass | 0
comp 0f    |         51 | pass | 0
comp 1a    |         50 | pass | 0
comp 1b    |         49 | pass | 1
comp 1c    |         49 | pass | 1
comp 1d    |         49 | pass | 1
comp 1e    |         49 | pass | 0
comp 1f    |         49 | pass | 0
comp 2a    |         49 | pass | 0
comp 2b    |         50 | pass | 1
comp 2c    |         51 | pass | 0
comp 2d    |         51 | pass | 0
comp 2e    |         51 | pass | 1
comp 2f    |         51 | pass | 1
comp 3a    |         52 | pass | 1
comp 3b    |         52 | pass | 0
comp 3c    |         52 | pass | 0
comp 3d    |         52 | pass | 1
comp 3e    |         52 | pass | 0
comp 3f    |         52 | pass | 1
lsh 0      |         55 | pass | 349f
lsh 1      |         55 | pass | 693e
lsh 2      |         55 | pass | d27c0000
lsh 3      |         56 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         64 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         55 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         62 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         62 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         55 | pass | 11a4800
rsh 4      |         63 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         62 | pass | 66
mul 1      |         70 | pass | 9999999999999999999000000000000000000
mul 2      |         70 | pass | 8000000000000000000000000000000
mul 3      |        205 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |         68 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0      |        209 | pass | 10,10
div 1      |        533 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        412 | pass | ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       2866 | pass | exception thrown: divide by zero
div 4      |        174 | pass | 100000,0
div 5      |        172 | pass | 10000000000000001000000000000000100000000,0
div 6      |        294 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
gcd 0      |        155 | pass | 8
gcd 1      |        965 | pass | 1
gcd 2      |         85 | pass | 8888888
gcd 3      |        350 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |         52 | pass | 0
toull 1    |         53 | pass | 2000
toull 2    |       1879 | pass | exception thrown: overflow error
toull 3    |         53 | pass | 123456789a
toull 4    |       1883 | pass | exception thrown: overflow error
prn 0      |        875 | pass | 4701397401952099592073
prn 1      |        757 | pass | fedcfedc0123456789
prn 2      |        761 | pass | FEDCFEDC0123456789
prn 3      |        907 | pass | 775563766700044321263611
prn 4      |        877 | pass | 4701397401952099592073
prn 5      |        797 | pass | 0xfedcfedc0123456789
prn 6      |        782 | pass | 0XFEDCFEDC0123456789
prn 7      |        919 | pass | 0775563766700044321263611
```

`integer_check -b -v`:

```
cons 0     |         62 | pass | 0
cons 1     |         50 | pass | 123456789abc
cons 2     |         68 | pass | 0
cons 3     |        496 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1237 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        283 | pass | 115415157637671751
cons 6     |       4004 | pass | exception thrown: invalid digit
cons 7     |         52 | pass | -123456789abc
cons 8     |        500 | pass | -3837439787487386792386728abcd88379dc
cons 9     |       1230 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 10    |        280 | pass | -115415157637671751
cons 11    |       3977 | pass | exception thrown: invalid digit
add 0      |         62 | pass | 73
add 1      |         79 | pass | 21
add 2      |         65 | pass | -34738957485741895748957485743809574800000000
add 3      |         70 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
sub 0      |         64 | pass | 50
sub 1      |         79 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         71 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
sub 3      |         63 | pass | -50
comp 0a    |         52 | pass | 0
comp 0b    |         52 | pass | 1
comp 0c    |         52 | pass | 1
comp 0d    |         52 | pass | 1
comp 0e    |         53 | pass | 0
comp 0f    |         52 | pass | 0
comp 1a    |         51 | pass | 0
comp 1b    |         51 | pass | 1
comp 1c    |         51 | pass | 0
comp 1d    |         51 | pass | 0
comp 1e    |         51 | pass | 1
comp 1f    |         51 | pass | 1
comp 2a    |         51 | pass | 0
comp 2b    |         51 | pass | 1
comp 2c    |         51 | pass | 1
comp 2d    |         51 | pass | 1
comp 2e    |         51 | pass | 0
comp 2f    |         52 | pass | 0
comp 3a    |         64 | pass | 1
comp 3b    |         53 | pass | 0
comp 3c    |         53 | pass | 0
comp 3d    |         51 | pass | 1
comp 3e    |         51 | pass | 0
comp 3f    |         53 | pass | 1
lsh 0      |         61 | pass | 349f
lsh 1      |         61 | pass | 693e
lsh 2      |         61 | pass | d27c0000
lsh 3      |         63 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         73 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         63 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         70 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         70 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         61 | pass | 11a4800
rsh 4      |         71 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         68 | pass | 66
mul 1      |         74 | pass | -9999999999999999999000000000000000000
mul 2      |         74 | pass | -8000000000000000000000000000000
mul 2      |         74 | pass | -8000000000000000000000000000000
div 0      |        207 | pass | 10,10
div 1      |        572 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        461 | pass | -ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       3612 | pass | exception thrown: divide by zero
div 4      |        208 | pass | 10,10
toll 0     |         81 | pass | 0
toll 1     |         55 | pass | -3000
toll 2     |       2002 | pass | exception thrown: overflow error
toll 3     |         58 | pass | -12345678987654321
toll 4     |       1999 | pass | exception thrown: overflow error
prn 0      |        886 | pass | -4701397401952099592073
prn 1      |        768 | pass | -fedcfedc0123456789
prn 2      |        772 | pass | -FEDCFEDC0123456789
prn 3      |        919 | pass | -775563766700044321263611
prn 4      |        888 | pass | -4701397401952099592073
prn 5      |        787 | pass | -0xfedcfedc0123456789
prn 6      |        790 | pass | -0XFEDCFEDC0123456789
prn 7      |        933 | pass | -0775563766700044321263611
```

`rational_check -b -v`:

(This one is dramatically better than we had before)

```
cons 0     |        128 | pass | 0/1
cons 1     |        212 | pass | 8/3
cons 2     |        221 | pass | -101/3
cons 3     |        888 | pass | -19999837590318351965518515651585519655196/5
cons 4     |       1088 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
cons 5     |       1113 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
cons 6     |       4116 | pass | exception thrown: invalid digit
cons 7     |        360 | pass | 9/8
cons 8     |        298 | pass | -1/1048576
cons 9     |       2584 | pass | exception thrown: not a number
cons 10    |        371 | pass | ccccccccccccd/80000000000000
add 0      |        255 | pass | 73/3
add 1      |        351 | pass | 71/26
add 2      |        712 | pass | -34738957485741895748957485743809574800000000/287923
add 3      |        494 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
sub 0      |        282 | pass | 101/6
sub 1      |        544 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
sub 2      |        529 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
sub 3      |        325 | pass | -50/31459
comp 0a    |         96 | pass | 0
comp 0b    |         96 | pass | 1
comp 0c    |         96 | pass | 1
comp 0d    |         96 | pass | 1
comp 0e    |         96 | pass | 0
comp 0f    |         96 | pass | 0
comp 1a    |         96 | pass | 0
comp 1b    |         96 | pass | 1
comp 1c    |         95 | pass | 0
comp 1d    |         96 | pass | 0
comp 1e    |         96 | pass | 1
comp 1f    |         96 | pass | 1
comp 2a    |         96 | pass | 0
comp 2b    |         96 | pass | 1
comp 2c    |         96 | pass | 1
comp 2d    |         96 | pass | 1
comp 2e    |         96 | pass | 0
comp 2f    |         96 | pass | 0
comp 3a    |        101 | pass | 1
comp 3b    |        101 | pass | 0
comp 3c    |        101 | pass | 0
comp 3d    |        101 | pass | 1
comp 3e    |        101 | pass | 0
comp 3f    |        101 | pass | 1
mul 0      |        199 | pass | 1/1250
mul 1      |        290 | pass | -1111111111111111111000000000000000000/777
mul 2      |        265 | pass | -4000000000000000000000000000000/1
mul 3      |        992 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
div 0      |        381 | pass | 1000000000000000000/99999999999999999
div 1      |       2230 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
div 2      |       4859 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
div 3      |       3286 | pass | exception thrown: divide by zero
div 4      |       2871 | pass | 28279753000000000000000000/2392375827899999976076241721
todouble 0 |         58 | pass | 0
todouble 1 |        103 | pass | -50.8475
todouble 2 |        182 | pass | 1.23038e+50
todouble 3 |        175 | pass | 0.1
todouble 4 |       3176 | pass | exception thrown: overflow error
toparts 0  |         54 | pass | 0,1
toparts 1  |         55 | pass | -1500,29
prn 0      |       1103 | pass | -4701397401952099592073/65689
prn 1      |        992 | pass | -fedcfedc0123456789/10099
prn 2      |       1004 | pass | -FEDCFEDC0123456789/10099
prn 3      |       1205 | pass | -775563766700044321263611/200231
prn 4      |       1106 | pass | -4701397401952099592073/65689
prn 5      |       1045 | pass | -0xfedcfedc0123456789/0x10099
prn 6      |       1043 | pass | -0XFEDCFEDC0123456789/0X10099
prn 7      |       1223 | pass | -0775563766700044321263611/0200231
```

