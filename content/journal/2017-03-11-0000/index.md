---
title: "c8: Improving consistency and test coverage"
date: 2017-03-11T00:00:00+00:00
description: "c8: Improving consistency and test coverage."
---
## Improving consistency

One of the things that has become evident over the last few weeks is that it's much easier to make things work well
if the code is as consistent as possible.

Over the last few days I've reordered lots of things, moved pieces around and generally tried to make similar
functions behave in a consistent way.

As an example, almost every `c8::natural` function now has early-out cases for zero-sized or zero-value operands.
Each operator also gained special cases for both operands being one digit in size.

## Improving test coverage

Long-overdue has been to increase the unit test coverage.  All operators now have specific tests for `op=` variants
as well as the `op` versions.

## Performance numbers

The latest performance numbers run with `clang` 3.8, and running `c8_test -b -v` are:

```
nat cons 0     |         10 | pass | 0
nat cons 1     |          9 | pass | 123456789abc
nat cons 2     |         24 | pass | 0
nat cons 3     |        460 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |       1170 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |        216 | pass | 115415157637671751
nat cons 6     |       2800 | pass | exception thrown: invalid digit
nat cons 7     |        243 | pass | 100000000000000000000000
nat count 0    |          2 | pass | 0
nat count 1    |          3 | pass | 64
nat count 2    |          3 | pass | 17
nat count 3    |          3 | pass | 185
nat add 0a     |          5 | pass | 73
nat add 0b     |          4 | pass | 73
nat add 1a     |          6 | pass | 42
nat add 1b     |          6 | pass | 42
nat add 2a     |          6 | pass | 10000000000000001
nat add 2b     |          8 | pass | 10000000000000001
nat add 3a     |         15 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 3b     |         16 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4a     |          6 | pass | 55
nat add 4b     |          6 | pass | 55
nat add 5a     |          6 | pass | 1000000000000000000000001
nat add 5b     |          7 | pass | 1000000000000000000000001
nat add 6a     |          9 | pass | 10000000000000008
nat add 6b     |          6 | pass | 10000000000000008
nat sub 0a     |          5 | pass | 50
nat sub 0b     |          3 | pass | 50
nat sub 1a     |         18 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 1b     |         17 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2a     |         33 | pass | 897
nat sub 2b     |         30 | pass | 897
nat sub 3a     |       3078 | pass | exception thrown: not a number
nat sub 3b     |       2244 | pass | exception thrown: not a number
nat sub 4a     |         11 | pass | 38
nat sub 4b     |         10 | pass | 38
nat sub 5a     |       3025 | pass | exception thrown: not a number
nat sub 5b     |       2149 | pass | exception thrown: not a number
nat sub 6a     |         15 | pass | 0
nat sub 6b     |         10 | pass | 0
nat sub 7a     |         17 | pass | ffffffffffffffffffffffff
nat sub 7b     |         16 | pass | ffffffffffffffffffffffff
nat comp 0a    |         10 | pass | 0
nat comp 0b    |         10 | pass | 1
nat comp 0c    |         11 | pass | 1
nat comp 0d    |         11 | pass | 1
nat comp 0e    |         10 | pass | 0
nat comp 0f    |          3 | pass | 0
nat comp 1a    |          2 | pass | 0
nat comp 1b    |          2 | pass | 1
nat comp 1c    |          3 | pass | 1
nat comp 1d    |          3 | pass | 1
nat comp 1e    |          4 | pass | 0
nat comp 1f    |          3 | pass | 0
nat comp 2a    |         16 | pass | 0
nat comp 2b    |          9 | pass | 1
nat comp 2c    |          2 | pass | 0
nat comp 2d    |          3 | pass | 0
nat comp 2e    |          8 | pass | 1
nat comp 2f    |          3 | pass | 1
nat comp 3a    |          4 | pass | 1
nat comp 3b    |          4 | pass | 0
nat comp 3c    |          4 | pass | 0
nat comp 3d    |          4 | pass | 1
nat comp 3e    |         10 | pass | 0
nat comp 3f    |         11 | pass | 1
nat lsh 0a     |         14 | pass | 349f
nat lsh 0b     |          4 | pass | 349f
nat lsh 1a     |          7 | pass | 693e
nat lsh 1b     |          5 | pass | 693e
nat lsh 2a     |          5 | pass | d27c0000
nat lsh 2b     |          5 | pass | d27c0000
nat lsh 3a     |         13 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 3b     |          5 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4a     |         21 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 4b     |         20 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 5a     |         15 | pass | 349f29837532398565620000000000000000
nat lsh 5b     |         14 | pass | 349f29837532398565620000000000000000
nat lsh 6a     |         14 | pass | 349f20000000000000000
nat lsh 6b     |         12 | pass | 349f20000000000000000
nat rsh 0a     |         13 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 0b     |          6 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1a     |         17 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 1b     |         18 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2a     |         11 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 2b     |         18 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3a     |          5 | pass | 11a4800
nat rsh 3b     |         10 | pass | 11a4800
nat rsh 4a     |         16 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 4b     |         18 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 5a     |          4 | pass | 0
nat rsh 5b     |          2 | pass | 0
nat rsh 6a     |          4 | pass | 0
nat rsh 6b     |          3 | pass | 0
nat mul 0a     |         14 | pass | 66
nat mul 0b     |         14 | pass | 66
nat mul 1a     |         27 | pass | 9999999999999999999000000000000000000
nat mul 1b     |         23 | pass | 9999999999999999999000000000000000000
nat mul 2a     |         23 | pass | 8000000000000000000000000000000
nat mul 2b     |         27 | pass | 8000000000000000000000000000000
nat mul 3a     |        160 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 3b     |        168 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4a     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 4b     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5a     |          8 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5b     |         11 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 6a     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 6b     |         13 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0a     |         96 | pass | 10,10
nat div 0b     |         93 | pass | 10,10
nat div 0c     |         43 | pass | 10,10
nat div 1a     |        306 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1b     |        322 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1c     |        161 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2a     |        236 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2b     |        245 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2c     |        122 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3a     |       2160 | pass | exception thrown: divide by zero
nat div 3b     |       2559 | pass | exception thrown: divide by zero
nat div 3c     |       2023 | pass | exception thrown: divide by zero
nat div 4a     |         42 | pass | 1000000,0
nat div 4b     |         51 | pass | 1000000,0
nat div 4c     |         25 | pass | 1000000,0
nat div 5a     |         96 | pass | 10000000000000001000000000000000100000000,0
nat div 5b     |        107 | pass | 10000000000000001000000000000000100000000,0
nat div 5c     |         55 | pass | 10000000000000001000000000000000100000000,0
nat div 6a     |        167 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6b     |        179 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6c     |         86 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 7a     |         44 | pass | 10000000000,0
nat div 7b     |         59 | pass | 10000000000,0
nat div 7c     |         33 | pass | 10000000000,0
nat div 8a     |         19 | pass | 27109017,17
nat div 8b     |         32 | pass | 27109017,17
nat div 8c     |         15 | pass | 27109017,17
nat gcd 0      |         70 | pass | 8
nat gcd 1      |        563 | pass | 1
nat gcd 2      |         31 | pass | 8888888
nat gcd 3      |        227 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat toull 0    |          3 | pass | 0
nat toull 1    |          4 | pass | 2000
nat toull 2    |       2053 | pass | exception thrown: overflow error
nat toull 3    |         12 | pass | 123456789a
nat toull 4    |       2101 | pass | exception thrown: overflow error
nat prn 0      |        873 | pass | 4701397401952099592073
nat prn 1      |        751 | pass | fedcfedc0123456789
nat prn 2      |        750 | pass | FEDCFEDC0123456789
nat prn 3      |        889 | pass | 775563766700044321263611
nat prn 4      |        869 | pass | 4701397401952099592073
nat prn 5      |        764 | pass | 0xfedcfedc0123456789
nat prn 6      |        765 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        936 | pass | 0775563766700044321263611
int cons 0     |          8 | pass | 0
int cons 1     |         10 | pass | 123456789abc
int cons 2     |         31 | pass | 0
int cons 3     |        499 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |       1256 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        257 | pass | 115415157637671751
int cons 6     |       4046 | pass | exception thrown: invalid digit
int cons 7     |          9 | pass | -123456789abc
int cons 8     |        485 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |       1222 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        281 | pass | -115415157637671751
int cons 11    |       4112 | pass | exception thrown: invalid digit
int add 0      |         17 | pass | 73
int add 1      |         18 | pass | 21
int add 2      |         20 | pass | -34738957485741895748957485743809574800000000
int add 3      |         25 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0      |         19 | pass | 50
int sub 1      |         30 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 2      |         24 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 3      |         19 | pass | -50
int comp 0a    |          4 | pass | 0
int comp 0b    |          4 | pass | 1
int comp 0c    |          4 | pass | 1
int comp 0d    |          4 | pass | 1
int comp 0e    |          4 | pass | 0
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
int comp 3a    |          7 | pass | 1
int comp 3b    |          7 | pass | 0
int comp 3c    |          7 | pass | 0
int comp 3d    |         33 | pass | 1
int comp 3e    |          5 | pass | 0
int comp 3f    |          6 | pass | 1
int lsh 0      |         15 | pass | 349f
int lsh 1      |         15 | pass | 693e
int lsh 2      |         15 | pass | d27c0000
int lsh 3      |         16 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4      |         30 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0      |         37 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1      |         47 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2      |         41 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3      |         34 | pass | 11a4800
int rsh 4      |         49 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0      |         38 | pass | 66
int mul 1      |         33 | pass | -9999999999999999999000000000000000000
int mul 2      |         33 | pass | -8000000000000000000000000000000
int mul 2      |         34 | pass | -8000000000000000000000000000000
int div 0      |        108 | pass | 10,10
int div 1      |        336 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2      |        261 | pass | -ffffffffffffffff000000000000000,100000000000000000000000
int div 3      |       3391 | pass | exception thrown: divide by zero
int div 4      |        104 | pass | 10,10
int toll 0     |         12 | pass | 0
int toll 1     |         14 | pass | -3000
int toll 2     |       2174 | pass | exception thrown: overflow error
int toll 3     |          8 | pass | -12345678987654321
int toll 4     |       2065 | pass | exception thrown: overflow error
int prn 0      |        883 | pass | -4701397401952099592073
int prn 1      |        733 | pass | -fedcfedc0123456789
int prn 2      |        733 | pass | -FEDCFEDC0123456789
int prn 3      |        882 | pass | -775563766700044321263611
int prn 4      |        854 | pass | -4701397401952099592073
int prn 5      |        755 | pass | -0xfedcfedc0123456789
int prn 6      |        769 | pass | -0XFEDCFEDC0123456789
int prn 7      |        896 | pass | -0775563766700044321263611
rat cons 0     |         51 | pass | 0/1
rat cons 1     |        104 | pass | 8/3
rat cons 2     |        106 | pass | -101/3
rat cons 3     |        810 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |       1052 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |        921 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       5636 | pass | exception thrown: invalid digit
rat cons 7     |        239 | pass | 9/8
rat cons 8     |        197 | pass | -1/1048576
rat cons 9     |       3024 | pass | exception thrown: not a number
rat cons 10    |        241 | pass | ccccccccccccd/80000000000000
rat add 0      |        151 | pass | 73/3
rat add 1      |        197 | pass | 71/26
rat add 2      |        471 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3      |        325 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0      |        162 | pass | 101/6
rat sub 1      |        373 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2      |        352 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3      |        181 | pass | -50/31459
rat comp 0a    |         28 | pass | 0
rat comp 0b    |         28 | pass | 1
rat comp 0c    |         28 | pass | 1
rat comp 0d    |         28 | pass | 1
rat comp 0e    |         28 | pass | 0
rat comp 0f    |         29 | pass | 0
rat comp 1a    |         31 | pass | 0
rat comp 1b    |         31 | pass | 1
rat comp 1c    |         31 | pass | 0
rat comp 1d    |         31 | pass | 0
rat comp 1e    |         31 | pass | 1
rat comp 1f    |         31 | pass | 1
rat comp 2a    |         31 | pass | 0
rat comp 2b    |         31 | pass | 1
rat comp 2c    |         31 | pass | 1
rat comp 2d    |         31 | pass | 1
rat comp 2e    |         29 | pass | 0
rat comp 2f    |         31 | pass | 0
rat comp 3a    |         36 | pass | 1
rat comp 3b    |         36 | pass | 0
rat comp 3c    |         36 | pass | 0
rat comp 3d    |         36 | pass | 1
rat comp 3e    |         36 | pass | 0
rat comp 3f    |         36 | pass | 1
rat mul 0      |        111 | pass | 1/1250
rat mul 1      |        188 | pass | -1111111111111111111000000000000000000/777
rat mul 2      |        176 | pass | -4000000000000000000000000000000/1
rat mul 3      |        668 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0      |        228 | pass | 1000000000000000000/99999999999999999
rat div 1      |       1397 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2      |       3360 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3      |       3222 | pass | exception thrown: divide by zero
rat div 4      |       1852 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |          8 | pass | 0
rat todouble 1 |         56 | pass | -50.8475
rat todouble 2 |        131 | pass | 1.23038e+50
rat todouble 3 |        112 | pass | 0.1
rat todouble 4 |       3493 | pass | exception thrown: overflow error
rat toparts 0  |          8 | pass | 0,1
rat toparts 1  |          9 | pass | -1500,29
rat prn 0      |       1046 | pass | -4701397401952099592073/65689
rat prn 1      |        935 | pass | -fedcfedc0123456789/10099
rat prn 2      |        936 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |       1126 | pass | -775563766700044321263611/200231
rat prn 4      |       1047 | pass | -4701397401952099592073/65689
rat prn 5      |        975 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |        976 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |       1150 | pass | -0775563766700044321263611/0200231
```

