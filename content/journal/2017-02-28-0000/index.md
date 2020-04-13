---
title: "c8: Improving testing"
date: 2017-02-28T00:00:00+00:00
description: "c8: Improving testing."
---
One of the major headaches so far has been that the functional test timings included the overheads of doing
the timing measurement.  Given that the tests had to change it also seemed like a good opportunity to merge all
of the tests into one location so that they're easier to manage and run.

The timing changes were a little tricky to implement because of the way most modern systems implement power
management and performance boosting.  The code now runs a no-op test for a couple of seconds before measuring
the timing overhead and then subtracts this out from the individual test scores.

The new results are `c8_check -v -b`:

```
nat cons 0     |          4 | pass | 0
nat cons 1     |          5 | pass | 123456789abc
nat cons 2     |         13 | pass | 0
nat cons 3     |        422 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |       1145 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |        207 | pass | 115415157637671751
nat cons 6     |       2587 | pass | exception thrown: invalid digit
nat cons 7     |        277 | pass | 100000000000000000000000
nat count 0    |          3 | pass | 0
nat count 1    |          4 | pass | 64
nat count 2    |          4 | pass | 17
nat count 3    |          4 | pass | 185
nat add 0      |         11 | pass | 73
nat add 1      |         11 | pass | 42
nat add 2      |         13 | pass | 10000000000000001
nat add 3      |         16 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4      |          6 | pass | 55
nat add 5      |          8 | pass | 1000000000000000000000001
nat sub 0      |          9 | pass | 50
nat sub 1      |         16 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2      |         28 | pass | 897
nat sub 3      |       1955 | pass | exception thrown: not a number
nat sub 4      |          8 | pass | 38
nat sub 5      |       2025 | pass | exception thrown: not a number
nat sub 6      |          6 | pass | 0
nat sub 7      |          9 | pass | ffffffffffffffffffffffff
nat comp 0a    |          4 | pass | 0
nat comp 0b    |          4 | pass | 1
nat comp 0c    |          4 | pass | 1
nat comp 0d    |          4 | pass | 1
nat comp 0e    |          4 | pass | 0
nat comp 0f    |          4 | pass | 0
nat comp 1a    |          3 | pass | 0
nat comp 1b    |          3 | pass | 1
nat comp 1c    |          3 | pass | 1
nat comp 1d    |          3 | pass | 1
nat comp 1e    |          4 | pass | 0
nat comp 1f    |          4 | pass | 0
nat comp 2a    |          3 | pass | 0
nat comp 2b    |          3 | pass | 1
nat comp 2c    |          4 | pass | 0
nat comp 2d    |          4 | pass | 0
nat comp 2e    |          3 | pass | 1
nat comp 2f    |          3 | pass | 1
nat comp 3a    |          5 | pass | 1
nat comp 3b    |          5 | pass | 0
nat comp 3c    |          5 | pass | 0
nat comp 3d    |          5 | pass | 1
nat comp 3e    |          5 | pass | 0
nat comp 3f    |          5 | pass | 1
nat lsh 0      |         19 | pass | 349f
nat lsh 1      |         19 | pass | 693e
nat lsh 2      |         19 | pass | d27c0000
nat lsh 3      |         21 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4      |         28 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat rsh 0      |          8 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1      |         15 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2      |         15 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3      |          8 | pass | 11a4800
nat rsh 4      |         15 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat mul 0      |          8 | pass | 66
nat mul 1      |         22 | pass | 9999999999999999999000000000000000000
nat mul 2      |         22 | pass | 8000000000000000000000000000000
nat mul 3      |        154 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4      |         13 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0      |        107 | pass | 10,10
nat div 1      |        379 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2      |        306 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3      |       2677 | pass | exception thrown: divide by zero
nat div 4      |        104 | pass | 100000,0
nat div 5      |        115 | pass | 10000000000000001000000000000000100000000,0
nat div 6      |        200 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat gcd 0      |         88 | pass | 8
nat gcd 1      |        738 | pass | 1
nat gcd 2      |         33 | pass | 8888888
nat gcd 3      |        258 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat toull 0    |          5 | pass | 0
nat toull 1    |          6 | pass | 2000
nat toull 2    |       1983 | pass | exception thrown: overflow error
nat toull 3    |          7 | pass | 123456789a
nat toull 4    |       1965 | pass | exception thrown: overflow error
nat prn 0      |        832 | pass | 4701397401952099592073
nat prn 1      |        716 | pass | fedcfedc0123456789
nat prn 2      |        715 | pass | FEDCFEDC0123456789
nat prn 3      |        862 | pass | 775563766700044321263611
nat prn 4      |        834 | pass | 4701397401952099592073
nat prn 5      |        751 | pass | 0xfedcfedc0123456789
nat prn 6      |        735 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        873 | pass | 0775563766700044321263611
int cons 0     |          4 | pass | 0
int cons 1     |          5 | pass | 123456789abc
int cons 2     |         21 | pass | 0
int cons 3     |        455 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |       1186 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        243 | pass | 115415157637671751
int cons 6     |       3995 | pass | exception thrown: invalid digit
int cons 7     |          5 | pass | -123456789abc
int cons 8     |        464 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |       1189 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        245 | pass | -115415157637671751
int cons 11    |       4010 | pass | exception thrown: invalid digit
int add 0      |         16 | pass | 73
int add 1      |         18 | pass | 21
int add 2      |         22 | pass | -34738957485741895748957485743809574800000000
int add 3      |         26 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0      |         17 | pass | 50
int sub 1      |         30 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 2      |         27 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 3      |         17 | pass | -50
int comp 0a    |          5 | pass | 0
int comp 0b    |          5 | pass | 1
int comp 0c    |          5 | pass | 1
int comp 0d    |          5 | pass | 1
int comp 0e    |          5 | pass | 0
int comp 0f    |          5 | pass | 0
int comp 1a    |          4 | pass | 0
int comp 1b    |          4 | pass | 1
int comp 1c    |          4 | pass | 0
int comp 1d    |          4 | pass | 0
int comp 1e    |          4 | pass | 1
int comp 1f    |          4 | pass | 1
int comp 2a    |          4 | pass | 0
int comp 2b    |          4 | pass | 1
int comp 2c    |          4 | pass | 1
int comp 2d    |          4 | pass | 1
int comp 2e    |          4 | pass | 0
int comp 2f    |          4 | pass | 0
int comp 3a    |          6 | pass | 1
int comp 3b    |          6 | pass | 0
int comp 3c    |          6 | pass | 0
int comp 3d    |          4 | pass | 1
int comp 3e    |          6 | pass | 0
int comp 3f    |          6 | pass | 1
int lsh 0      |         26 | pass | 349f
int lsh 1      |         26 | pass | 693e
int lsh 2      |         26 | pass | d27c0000
int lsh 3      |         31 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4      |         39 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0      |         18 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1      |         24 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2      |         24 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3      |         14 | pass | 11a4800
int rsh 4      |         24 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0      |         16 | pass | 66
int mul 1      |         29 | pass | -9999999999999999999000000000000000000
int mul 2      |         29 | pass | -8000000000000000000000000000000
int mul 2      |         29 | pass | -8000000000000000000000000000000
int div 0      |        126 | pass | 10,10
int div 1      |        404 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2      |        327 | pass | -ffffffffffffffff000000000000000,100000000000000000000000
int div 3      |       3308 | pass | exception thrown: divide by zero
int div 4      |        127 | pass | 10,10
int toll 0     |          7 | pass | 0
int toll 1     |          8 | pass | -3000
int toll 2     |       1945 | pass | exception thrown: overflow error
int toll 3     |          9 | pass | -12345678987654321
int toll 4     |       1935 | pass | exception thrown: overflow error
int prn 0      |        836 | pass | -4701397401952099592073
int prn 1      |        723 | pass | -fedcfedc0123456789
int prn 2      |        719 | pass | -FEDCFEDC0123456789
int prn 3      |        867 | pass | -775563766700044321263611
int prn 4      |        837 | pass | -4701397401952099592073
int prn 5      |        746 | pass | -0xfedcfedc0123456789
int prn 6      |        742 | pass | -0XFEDCFEDC0123456789
int prn 7      |        880 | pass | -0775563766700044321263611
rat cons 0     |         83 | pass | 0/1
rat cons 1     |        145 | pass | 8/3
rat cons 2     |        144 | pass | -101/3
rat cons 3     |        819 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |       1084 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |       1115 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       5594 | pass | exception thrown: invalid digit
rat cons 7     |        293 | pass | 9/8
rat cons 8     |        242 | pass | -1/1048576
rat cons 9     |       2939 | pass | exception thrown: not a number
rat cons 10    |        311 | pass | ccccccccccccd/80000000000000
rat add 0      |        184 | pass | 73/3
rat add 1      |        256 | pass | 71/26
rat add 2      |        574 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3      |        404 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0      |        204 | pass | 101/6
rat sub 1      |        447 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2      |        434 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3      |        242 | pass | -50/31459
rat comp 0a    |         33 | pass | 0
rat comp 0b    |         33 | pass | 1
rat comp 0c    |         33 | pass | 1
rat comp 0d    |         34 | pass | 1
rat comp 0e    |         48 | pass | 0
rat comp 0f    |         34 | pass | 0
rat comp 1a    |         33 | pass | 0
rat comp 1b    |         33 | pass | 1
rat comp 1c    |         49 | pass | 0
rat comp 1d    |         33 | pass | 0
rat comp 1e    |         33 | pass | 1
rat comp 1f    |         33 | pass | 1
rat comp 2a    |         33 | pass | 0
rat comp 2b    |         34 | pass | 1
rat comp 2c    |         33 | pass | 1
rat comp 2d    |         33 | pass | 1
rat comp 2e    |         33 | pass | 0
rat comp 2f    |         33 | pass | 0
rat comp 3a    |         35 | pass | 1
rat comp 3b    |         36 | pass | 0
rat comp 3c    |         36 | pass | 0
rat comp 3d    |         36 | pass | 1
rat comp 3e    |         36 | pass | 0
rat comp 3f    |         36 | pass | 1
rat mul 0      |        141 | pass | 1/1250
rat mul 1      |        228 | pass | -1111111111111111111000000000000000000/777
rat mul 2      |        207 | pass | -4000000000000000000000000000000/1
rat mul 3      |        754 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0      |        285 | pass | 1000000000000000000/99999999999999999
rat div 1      |       1713 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2      |       3927 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3      |       3011 | pass | exception thrown: divide by zero
rat div 4      |       2227 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |         12 | pass | 0
rat todouble 1 |         63 | pass | -50.8475
rat todouble 2 |        124 | pass | 1.23038e+50
rat todouble 3 |        124 | pass | 0.1
rat todouble 4 |       3177 | pass | exception thrown: overflow error
rat toparts 0  |          8 | pass | 0,1
rat toparts 1  |          9 | pass | -1500,29
rat prn 0      |       1048 | pass | -4701397401952099592073/65689
rat prn 1      |        934 | pass | -fedcfedc0123456789/10099
rat prn 2      |        933 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |       1126 | pass | -775563766700044321263611/200231
rat prn 4      |       1049 | pass | -4701397401952099592073/65689
rat prn 5      |        977 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |        979 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |       1149 | pass | -0775563766700044321263611/0200231
```

## Functional improvements

The original implementation of `c8::rational` was to use a `c8::integer` numerator and a `c8::natural`
denominator.  While this is quite a good approach from a pure maths perspective, it was pretty terrible from
a performance standpoint as we had to constantly convert between integers and naturals.  Now both the numerator
and denominator are `c8::integer` and the `normalize()` method ensures that denominators are always positive.

