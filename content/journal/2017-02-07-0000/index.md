---
title: "c8: Divide performance (again)"
date: 2017-02-07T00:00:00+00:00
description: "c8: Divide performance (again)."
---
The performance of the divide code continues to irritate me, because it felt like it should be able to run
faster.  After staring at it for a while I ended up noticing a few opportunities to make small improvements.
The performance gains were small, but the code is certainly a lot cleaner now.

A bigger change was to modify the divide and multiply code to invoke the versions that divide, or multiply,
by a single digit in cases where we're only operating with a single digit.  This had a much larger impact!

Results from `natural_check -b -v`:

```
cons 0     |         69 | pass | 0
cons 1     |         74 | pass | 123456789abc
cons 2     |         53 | pass | 0
cons 3     |        555 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1324 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        285 | pass | 115415157637671751
cons 6     |       2797 | pass | exception thrown: invalid digit
cons 7     |        371 | pass | 100000000000000000000000
count 0    |         51 | pass | 0
count 1    |         58 | pass | 64
count 2    |         58 | pass | 17
count 3    |         59 | pass | 185
add 0      |         79 | pass | 73
add 1      |         79 | pass | 42
add 2      |         80 | pass | 10000000000000001
add 3      |         82 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
add 4      |         74 | pass | 55
add 5      |         77 | pass | 1000000000000000000000001
sub 0      |         79 | pass | 50
sub 1      |         84 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         90 | pass | 897
sub 3      |       2823 | pass | exception thrown: not a number
sub 4      |         79 | pass | 38
sub 5      |       2782 | pass | exception thrown: not a number
sub 6      |         53 | pass | 0
sub 7      |         80 | pass | ffffffffffffffffffffffff
comp 0a    |         58 | pass | 0
comp 0b    |         58 | pass | 1
comp 0c    |         58 | pass | 1
comp 0d    |         58 | pass | 1
comp 0e    |         58 | pass | 0
comp 0f    |         58 | pass | 0
comp 1a    |         55 | pass | 0
comp 1b    |         55 | pass | 1
comp 1c    |         55 | pass | 1
comp 1d    |         55 | pass | 1
comp 1e    |         55 | pass | 0
comp 1f    |         55 | pass | 0
comp 2a    |         56 | pass | 0
comp 2b    |         56 | pass | 1
comp 2c    |         56 | pass | 0
comp 2d    |         56 | pass | 0
comp 2e    |         56 | pass | 1
comp 2f    |         56 | pass | 1
comp 3a    |         59 | pass | 1
comp 3b    |         59 | pass | 0
comp 3c    |         59 | pass | 0
comp 3d    |         59 | pass | 1
comp 3e    |         59 | pass | 0
comp 3f    |         59 | pass | 1
lsh 0      |         79 | pass | 349f
lsh 1      |         79 | pass | 693e
lsh 2      |         80 | pass | d27c0000
lsh 3      |         80 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         84 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         81 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         82 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         81 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         78 | pass | 11a4800
rsh 4      |         83 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         80 | pass | 66
mul 1      |         98 | pass | 9999999999999999999000000000000000000
mul 2      |         99 | pass | 8000000000000000000000000000000
mul 3      |        245 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |         81 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0      |        452 | pass | 10,10
div 1      |       1252 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        848 | pass | ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       3833 | pass | exception thrown: divide by zero
div 4      |        430 | pass | 100000,0
div 5      |        210 | pass | 10000000000000001000000000000000100000000,0
div 6      |        563 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
gcd 0      |        337 | pass | 8
gcd 1      |       2446 | pass | 1
gcd 2      |        148 | pass | 8888888
gcd 3      |        713 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |         51 | pass | 0
toull 1    |         60 | pass | 2000
toull 2    |       2048 | pass | exception thrown: overflow error
toull 3    |         60 | pass | 123456789a
toull 4    |       2044 | pass | exception thrown: overflow error
prn 0      |       1417 | pass | 4701397401952099592073
prn 1      |       1196 | pass | fedcfedc0123456789
prn 2      |       1194 | pass | FEDCFEDC0123456789
prn 3      |       1494 | pass | 775563766700044321263611
prn 4      |       1418 | pass | 4701397401952099592073
prn 5      |       1192 | pass | 0xfedcfedc0123456789
prn 6      |       1187 | pass | 0XFEDCFEDC0123456789
prn 7      |       1505 | pass | 0775563766700044321263611
```

There are big wins for divides and GCD operations.  These play nicely into the results for `rational_check -b -v`:

```
cons 0     |        408 | pass | 0/1
cons 1     |        606 | pass | 8/3
cons 2     |        607 | pass | -101/3
cons 3     |       1264 | pass | -19999837590318351965518515651585519655196/5
cons 4     |       1511 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
cons 5     |       1484 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
cons 6     |       4363 | pass | exception thrown: invalid digit
cons 7     |       1075 | pass | 9/8
cons 8     |        882 | pass | -1/1048576
cons 9     |       3041 | pass | exception thrown: not a number
cons 10    |        973 | pass | ccccccccccccd/80000000000000
add 0      |        737 | pass | 73/3
add 1      |        979 | pass | 71/26
add 2      |       1751 | pass | -34738957485741895748957485743809574800000000/287923
add 3      |       1023 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
sub 0      |        795 | pass | 101/6
sub 1      |       1031 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
sub 2      |       1090 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
sub 3      |        913 | pass | -50/31459
comp 0a    |        220 | pass | 0
comp 0b    |        221 | pass | 1
comp 0c    |        221 | pass | 1
comp 0d    |        220 | pass | 1
comp 0e    |        220 | pass | 0
comp 0f    |        221 | pass | 0
comp 1a    |        221 | pass | 0
comp 1b    |        221 | pass | 1
comp 1c    |        222 | pass | 0
comp 1d    |        221 | pass | 0
comp 1e    |        221 | pass | 1
comp 1f    |        221 | pass | 1
comp 2a    |        221 | pass | 0
comp 2b    |        221 | pass | 1
comp 2c    |        222 | pass | 1
comp 2d    |        221 | pass | 1
comp 2e    |        221 | pass | 0
comp 2f    |        221 | pass | 0
comp 3a    |        229 | pass | 1
comp 3b    |        229 | pass | 0
comp 3c    |        229 | pass | 0
comp 3d    |        230 | pass | 1
comp 3e    |        228 | pass | 0
comp 3f    |        228 | pass | 1
mul 0      |        502 | pass | 1/1250
mul 1      |        631 | pass | -1111111111111111111000000000000000000/777
mul 2      |        571 | pass | -4000000000000000000000000000000/1
mul 3      |       1280 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
div 0      |       1071 | pass | 1000000000000000000/99999999999999999
div 1      |       6190 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
div 2      |      13343 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
div 3      |       3560 | pass | exception thrown: divide by zero
div 4      |       8389 | pass | 28279753000000000000000000/2392375827899999976076241721
todouble 0 |        109 | pass | 0
todouble 1 |        262 | pass | -50.8475
todouble 2 |        521 | pass | 1.23038e+50
todouble 3 |        475 | pass | 0.1
todouble 4 |       3557 | pass | exception thrown: overflow error
toparts 0  |         82 | pass | 0,1
toparts 1  |         89 | pass | -1500,29
prn 0      |       1752 | pass | -4701397401952099592073/65689
prn 1      |       1530 | pass | -fedcfedc0123456789/10099
prn 2      |       1532 | pass | -FEDCFEDC0123456789/10099
prn 3      |       1914 | pass | -775563766700044321263611/200231
prn 4      |       1753 | pass | -4701397401952099592073/65689
prn 5      |       1581 | pass | -0xfedcfedc0123456789/0x10099
prn 6      |       1595 | pass | -0XFEDCFEDC0123456789/0X10099
prn 7      |       1949 | pass | -0775563766700044321263611/0200231
```

