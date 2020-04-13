---
title: "c8: More incremental improvements"
date: 2017-03-04T00:00:00+00:00
description: "c8: More incremental improvements."
---
The last few days have seen some steady changes:

* Implementations have become more regular.

* Divide and modulus operations have been broken into pieces and made more efficient.

* Comments have been improved.

* Variable names have ben made more regular.

* More logic has been moved into the digit-array layer, so the digit-array behaviour is no longer visible in the
  public headers.

None of this is particular radical stuff, but it makes the code easier to understand, and easier to improve in
the future.  It has a nice impact on the performance right now, though, as divide-heavy code (which includes all
rationals) is anything from 10% to 20% faster:

`c8_check -b -v`:

```
nat cons 0     |          4 | pass | 0
nat cons 1     |          5 | pass | 123456789abc
nat cons 2     |         13 | pass | 0
nat cons 3     |        421 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |       1138 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |        206 | pass | 115415157637671751
nat cons 6     |       2539 | pass | exception thrown: invalid digit
nat cons 7     |        268 | pass | 100000000000000000000000
nat count 0    |          4 | pass | 0
nat count 1    |          5 | pass | 64
nat count 2    |          5 | pass | 17
nat count 3    |          5 | pass | 185
nat add 0      |         12 | pass | 73
nat add 1      |         12 | pass | 42
nat add 2      |         13 | pass | 10000000000000001
nat add 3      |         16 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4      |          6 | pass | 55
nat add 5      |          8 | pass | 1000000000000000000000001
nat sub 0      |          8 | pass | 50
nat sub 1      |         16 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2      |         27 | pass | 897
nat sub 3      |       1928 | pass | exception thrown: not a number
nat sub 4      |          8 | pass | 38
nat sub 5      |       2003 | pass | exception thrown: not a number
nat sub 6      |          6 | pass | 0
nat sub 7      |         10 | pass | ffffffffffffffffffffffff
nat comp 0a    |          5 | pass | 0
nat comp 0b    |          5 | pass | 1
nat comp 0c    |          5 | pass | 1
nat comp 0d    |          5 | pass | 1
nat comp 0e    |          5 | pass | 0
nat comp 0f    |          5 | pass | 0
nat comp 1a    |          4 | pass | 0
nat comp 1b    |          4 | pass | 1
nat comp 1c    |          4 | pass | 1
nat comp 1d    |          4 | pass | 1
nat comp 1e    |          4 | pass | 0
nat comp 1f    |          4 | pass | 0
nat comp 2a    |          5 | pass | 0
nat comp 2b    |          4 | pass | 1
nat comp 2c    |          4 | pass | 0
nat comp 2d    |          5 | pass | 0
nat comp 2e    |          5 | pass | 1
nat comp 2f    |          5 | pass | 1
nat comp 3a    |          6 | pass | 1
nat comp 3b    |          6 | pass | 0
nat comp 3c    |          6 | pass | 0
nat comp 3d    |          6 | pass | 1
nat comp 3e    |          6 | pass | 0
nat comp 3f    |          6 | pass | 1
nat lsh 0      |          9 | pass | 349f
nat lsh 1      |          9 | pass | 693e
nat lsh 2      |          9 | pass | d27c0000
nat lsh 3      |         12 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4      |         19 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat rsh 0      |          9 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1      |         15 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2      |         15 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3      |          7 | pass | 11a4800
nat rsh 4      |         15 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat mul 0      |          9 | pass | 66
nat mul 1      |         22 | pass | 9999999999999999999000000000000000000
nat mul 2      |         22 | pass | 8000000000000000000000000000000
nat mul 3      |        155 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4      |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0      |         91 | pass | 10,10
nat div 1      |        331 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2      |        263 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3      |       1944 | pass | exception thrown: divide by zero
nat div 4      |         87 | pass | 100000,0
nat div 5      |        103 | pass | 10000000000000001000000000000000100000000,0
nat div 6      |        172 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat gcd 0      |         84 | pass | 8
nat gcd 1      |        663 | pass | 1
nat gcd 2      |         33 | pass | 8888888
nat gcd 3      |        231 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat toull 0    |          5 | pass | 0
nat toull 1    |          6 | pass | 2000
nat toull 2    |       1940 | pass | exception thrown: overflow error
nat toull 3    |          7 | pass | 123456789a
nat toull 4    |       1947 | pass | exception thrown: overflow error
nat prn 0      |        830 | pass | 4701397401952099592073
nat prn 1      |        712 | pass | fedcfedc0123456789
nat prn 2      |        731 | pass | FEDCFEDC0123456789
nat prn 3      |        864 | pass | 775563766700044321263611
nat prn 4      |        831 | pass | 4701397401952099592073
nat prn 5      |        755 | pass | 0xfedcfedc0123456789
nat prn 6      |        750 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        894 | pass | 0775563766700044321263611
int cons 0     |          4 | pass | 0
int cons 1     |          5 | pass | 123456789abc
int cons 2     |         21 | pass | 0
int cons 3     |        452 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |       1178 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        242 | pass | 115415157637671751
int cons 6     |       4001 | pass | exception thrown: invalid digit
int cons 7     |          9 | pass | -123456789abc
int cons 8     |        471 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |       1192 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        246 | pass | -115415157637671751
int cons 11    |       3916 | pass | exception thrown: invalid digit
int add 0      |         19 | pass | 73
int add 1      |         18 | pass | 21
int add 2      |         21 | pass | -34738957485741895748957485743809574800000000
int add 3      |         30 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0      |         13 | pass | 50
int sub 1      |         26 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 2      |         25 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 3      |         18 | pass | -50
int comp 0a    |          6 | pass | 0
int comp 0b    |          6 | pass | 1
int comp 0c    |          6 | pass | 1
int comp 0d    |          6 | pass | 1
int comp 0e    |          6 | pass | 0
int comp 0f    |          6 | pass | 0
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
int comp 3a    |          8 | pass | 1
int comp 3b    |          8 | pass | 0
int comp 3c    |          8 | pass | 0
int comp 3d    |          8 | pass | 1
int comp 3e    |          8 | pass | 0
int comp 3f    |          8 | pass | 1
int lsh 0      |         16 | pass | 349f
int lsh 1      |         16 | pass | 693e
int lsh 2      |         16 | pass | d27c0000
int lsh 3      |         18 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4      |         26 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0      |         16 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1      |         23 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2      |         29 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3      |         17 | pass | 11a4800
int rsh 4      |         28 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0      |         24 | pass | 66
int mul 1      |         28 | pass | -9999999999999999999000000000000000000
int mul 2      |         27 | pass | -8000000000000000000000000000000
int mul 2      |         27 | pass | -8000000000000000000000000000000
int div 0      |        102 | pass | 10,10
int div 1      |        343 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2      |        279 | pass | -ffffffffffffffff000000000000000,100000000000000000000000
int div 3      |       3178 | pass | exception thrown: divide by zero
int div 4      |        114 | pass | 10,10
int toll 0     |         20 | pass | 0
int toll 1     |          6 | pass | -3000
int toll 2     |       1953 | pass | exception thrown: overflow error
int toll 3     |         14 | pass | -12345678987654321
int toll 4     |       1991 | pass | exception thrown: overflow error
int prn 0      |        890 | pass | -4701397401952099592073
int prn 1      |        773 | pass | -fedcfedc0123456789
int prn 2      |        771 | pass | -FEDCFEDC0123456789
int prn 3      |        934 | pass | -775563766700044321263611
int prn 4      |        916 | pass | -4701397401952099592073
int prn 5      |        779 | pass | -0xfedcfedc0123456789
int prn 6      |        783 | pass | -0XFEDCFEDC0123456789
int prn 7      |        943 | pass | -0775563766700044321263611
rat cons 0     |         56 | pass | 0/1
rat cons 1     |        115 | pass | 8/3
rat cons 2     |        115 | pass | -101/3
rat cons 3     |        783 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |       1045 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |       1078 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       5487 | pass | exception thrown: invalid digit
rat cons 7     |        244 | pass | 9/8
rat cons 8     |        199 | pass | -1/1048576
rat cons 9     |       2948 | pass | exception thrown: not a number
rat cons 10    |        262 | pass | ccccccccccccd/80000000000000
rat add 0      |        171 | pass | 73/3
rat add 1      |        235 | pass | 71/26
rat add 2      |        530 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3      |        386 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0      |        181 | pass | 101/6
rat sub 1      |        429 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2      |        417 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3      |        208 | pass | -50/31459
rat comp 0a    |         46 | pass | 0
rat comp 0b    |         34 | pass | 1
rat comp 0c    |         35 | pass | 1
rat comp 0d    |         35 | pass | 1
rat comp 0e    |         34 | pass | 0
rat comp 0f    |         34 | pass | 0
rat comp 1a    |         36 | pass | 0
rat comp 1b    |         36 | pass | 1
rat comp 1c    |         34 | pass | 0
rat comp 1d    |         34 | pass | 0
rat comp 1e    |         33 | pass | 1
rat comp 1f    |         33 | pass | 1
rat comp 2a    |         32 | pass | 0
rat comp 2b    |         32 | pass | 1
rat comp 2c    |         32 | pass | 1
rat comp 2d    |         57 | pass | 1
rat comp 2e    |         32 | pass | 0
rat comp 2f    |         32 | pass | 0
rat comp 3a    |         35 | pass | 1
rat comp 3b    |         36 | pass | 0
rat comp 3c    |         36 | pass | 0
rat comp 3d    |         35 | pass | 1
rat comp 3e    |         35 | pass | 0
rat comp 3f    |         36 | pass | 1
rat mul 0      |        117 | pass | 1/1250
rat mul 1      |        198 | pass | -1111111111111111111000000000000000000/777
rat mul 2      |        181 | pass | -4000000000000000000000000000000/1
rat mul 3      |        697 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0      |        246 | pass | 1000000000000000000/99999999999999999
rat div 1      |       1527 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2      |       3461 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3      |       3013 | pass | exception thrown: divide by zero
rat div 4      |       1949 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |         12 | pass | 0
rat todouble 1 |         57 | pass | -50.8475
rat todouble 2 |        147 | pass | 1.23038e+50
rat todouble 3 |        133 | pass | 0.1
rat todouble 4 |       3179 | pass | exception thrown: overflow error
rat toparts 0  |          8 | pass | 0,1
rat toparts 1  |          9 | pass | -1500,29
rat prn 0      |       1047 | pass | -4701397401952099592073/65689
rat prn 1      |        926 | pass | -fedcfedc0123456789/10099
rat prn 2      |        954 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |       1128 | pass | -775563766700044321263611/200231
rat prn 4      |       1078 | pass | -4701397401952099592073/65689
rat prn 5      |       1029 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |       1028 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |       1189 | pass | -0775563766700044321263611/0200231
```

