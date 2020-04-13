---
title: "c8: Improving integers & rationals"
date: 2017-03-17T00:00:00+00:00
description: "c8: Improving integers & rationals."
---
So far most of the work has been on improving the performance of the `c8::natural` class as integers and rationals
are constructed from it, but this means that integers and rationals have been somewhat ignored.  In practice, of
course, these other two are actually the most common ones to want to use.

The first problem is that the test coverage for both of these is insufficient, so we need to make sure that we
cover all of operators that we support.  This has been less important so far because things like `+=` and `/=`
have been implemented in terms of the simpler operators (`+` and `/` in these examples).

The next improvement is to handle zero checking in a more uniform, faster manner.

Cumulatively we see:

```
nat cons 0     |          4 | pass | 0
nat cons 1     |          8 | pass | 123456789abc
nat cons 2     |         14 | pass | 0
nat cons 3     |        417 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |       1133 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |        192 | pass | 115415157637671751
nat cons 6     |       2521 | pass | exception thrown: invalid digit
nat cons 7     |        217 | pass | 100000000000000000000000
nat count 0    |          3 | pass | 0
nat count 1    |          5 | pass | 64
nat count 2    |          5 | pass | 17
nat count 3    |          4 | pass | 185
nat add 0a     |          7 | pass | 73
nat add 0b     |          6 | pass | 73
nat add 1a     |          9 | pass | 42
nat add 1b     |         12 | pass | 42
nat add 2a     |         10 | pass | 10000000000000001
nat add 2b     |          8 | pass | 10000000000000001
nat add 3a     |         16 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 3b     |         15 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4a     |          7 | pass | 55
nat add 4b     |          4 | pass | 55
nat add 5a     |          8 | pass | 1000000000000000000000001
nat add 5b     |          7 | pass | 1000000000000000000000001
nat add 6a     |          9 | pass | 10000000000000008
nat add 6b     |          8 | pass | 10000000000000008
nat sub 0a     |          6 | pass | 50
nat sub 0b     |          7 | pass | 50
nat sub 1a     |         18 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 1b     |         16 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2a     |         33 | pass | 897
nat sub 2b     |         30 | pass | 897
nat sub 3a     |       3122 | pass | exception thrown: not a number
nat sub 3b     |       2456 | pass | exception thrown: not a number
nat sub 4a     |          6 | pass | 38
nat sub 4b     |          3 | pass | 38
nat sub 5a     |       2780 | pass | exception thrown: not a number
nat sub 5b     |       2003 | pass | exception thrown: not a number
nat sub 6a     |          5 | pass | 0
nat sub 6b     |          4 | pass | 0
nat sub 7a     |          9 | pass | ffffffffffffffffffffffff
nat sub 7b     |          7 | pass | ffffffffffffffffffffffff
nat comp 0a    |          5 | pass | 0
nat comp 0b    |          4 | pass | 1
nat comp 0c    |          3 | pass | 1
nat comp 0d    |          5 | pass | 1
nat comp 0e    |          5 | pass | 0
nat comp 0f    |          3 | pass | 0
nat comp 1a    |          4 | pass | 0
nat comp 1b    |          4 | pass | 1
nat comp 1c    |          4 | pass | 1
nat comp 1d    |          4 | pass | 1
nat comp 1e    |          4 | pass | 0
nat comp 1f    |          4 | pass | 0
nat comp 2a    |          4 | pass | 0
nat comp 2b    |          5 | pass | 1
nat comp 2c    |          5 | pass | 0
nat comp 2d    |          5 | pass | 0
nat comp 2e    |          5 | pass | 1
nat comp 2f    |          4 | pass | 1
nat comp 3a    |          6 | pass | 1
nat comp 3b    |          6 | pass | 0
nat comp 3c    |          6 | pass | 0
nat comp 3d    |          6 | pass | 1
nat comp 3e    |          6 | pass | 0
nat comp 3f    |          6 | pass | 1
nat lsh 0a     |          8 | pass | 349f
nat lsh 0b     |          6 | pass | 349f
nat lsh 1a     |          7 | pass | 693e
nat lsh 1b     |          5 | pass | 693e
nat lsh 2a     |          6 | pass | d27c0000
nat lsh 2b     |          5 | pass | d27c0000
nat lsh 3a     |          8 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 3b     |          8 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4a     |         21 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 4b     |         17 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 5a     |         12 | pass | 349f29837532398565620000000000000000
nat lsh 5b     |          9 | pass | 349f29837532398565620000000000000000
nat lsh 6a     |          7 | pass | 349f20000000000000000
nat lsh 6b     |          6 | pass | 349f20000000000000000
nat rsh 0a     |          9 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1a     |         15 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 1b     |         14 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2a     |         15 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 2b     |         14 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3a     |          7 | pass | 11a4800
nat rsh 3b     |          6 | pass | 11a4800
nat rsh 4a     |         15 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 4b     |         14 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 5a     |          6 | pass | 0
nat rsh 5b     |          4 | pass | 0
nat rsh 6a     |          7 | pass | 0
nat rsh 6b     |          5 | pass | 0
nat mul 0a     |          9 | pass | 66
nat mul 0b     |          8 | pass | 66
nat mul 1a     |         25 | pass | 9999999999999999999000000000000000000
nat mul 1b     |         25 | pass | 9999999999999999999000000000000000000
nat mul 2a     |         25 | pass | 8000000000000000000000000000000
nat mul 2b     |         25 | pass | 8000000000000000000000000000000
nat mul 3a     |        158 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 3b     |        172 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4a     |         14 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 4b     |         13 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5a     |         14 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5b     |         13 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 6a     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 6b     |         11 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0a     |        113 | pass | 10,10
nat div 0b     |         85 | pass | 10,10
nat div 0c     |         44 | pass | 10,10
nat div 1a     |        312 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1b     |        308 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1c     |        157 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2a     |        242 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2b     |        237 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2c     |        123 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3a     |       1875 | pass | exception thrown: divide by zero
nat div 3b     |       1924 | pass | exception thrown: divide by zero
nat div 3c     |       1914 | pass | exception thrown: divide by zero
nat div 4a     |         43 | pass | 1000000,0
nat div 4b     |         39 | pass | 1000000,0
nat div 4c     |         25 | pass | 1000000,0
nat div 5a     |         98 | pass | 10000000000000001000000000000000100000000,0
nat div 5b     |         96 | pass | 10000000000000001000000000000000100000000,0
nat div 5c     |         55 | pass | 10000000000000001000000000000000100000000,0
nat div 6a     |        174 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6b     |        168 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6c     |         86 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 7a     |         46 | pass | 10000000000,0
nat div 7b     |         45 | pass | 10000000000,0
nat div 7c     |         28 | pass | 10000000000,0
nat div 8a     |         17 | pass | 27109017,17
nat div 8b     |         16 | pass | 27109017,17
nat div 8c     |         13 | pass | 27109017,17
nat gcd 0      |         58 | pass | 8
nat gcd 1      |        515 | pass | 1
nat gcd 2      |         25 | pass | 8888888
nat gcd 3      |        215 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat toull 0    |          5 | pass | 0
nat toull 1    |          6 | pass | 2000
nat toull 2    |       1908 | pass | exception thrown: overflow error
nat toull 3    |          7 | pass | 123456789a
nat toull 4    |       1914 | pass | exception thrown: overflow error
nat prn 0      |        843 | pass | 4701397401952099592073
nat prn 1      |        725 | pass | fedcfedc0123456789
nat prn 2      |        740 | pass | FEDCFEDC0123456789
nat prn 3      |        875 | pass | 775563766700044321263611
nat prn 4      |        844 | pass | 4701397401952099592073
nat prn 5      |        760 | pass | 0xfedcfedc0123456789
nat prn 6      |        764 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        902 | pass | 0775563766700044321263611
int cons 0     |          4 | pass | 0
int cons 1     |          5 | pass | 123456789abc
int cons 2     |         22 | pass | 0
int cons 3     |        456 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |       1185 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        229 | pass | 115415157637671751
int cons 6     |       3741 | pass | exception thrown: invalid digit
int cons 7     |          5 | pass | -123456789abc
int cons 8     |        463 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |       1192 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        235 | pass | -115415157637671751
int cons 11    |       3771 | pass | exception thrown: invalid digit
int add 0a     |         16 | pass | 73
int add 0b     |         11 | pass | 73
int add 1a     |         20 | pass | 21
int add 1b     |         13 | pass | 21
int add 2a     |         23 | pass | -34738957485741895748957485743809574800000000
int add 2b     |         23 | pass | -34738957485741895748957485743809574800000000
int add 3a     |         26 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int add 3b     |         17 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0a     |         18 | pass | 50
int sub 0b     |         12 | pass | 50
int sub 1a     |         32 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 1b     |         21 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 2a     |         27 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 2b     |         17 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 3a     |         18 | pass | -50
int sub 3b     |         22 | pass | -50
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
int comp 2f    |          2 | pass | 0
int comp 3a    |          8 | pass | 1
int comp 3b    |          8 | pass | 0
int comp 3c    |          8 | pass | 0
int comp 3d    |          8 | pass | 1
int comp 3e    |          8 | pass | 0
int comp 3f    |          8 | pass | 1
int lsh 0a     |         14 | pass | 349f
int lsh 0b     |          6 | pass | 349f
int lsh 1a     |         14 | pass | 693e
int lsh 1b     |          7 | pass | 693e
int lsh 2a     |         14 | pass | d27c0000
int lsh 2b     |          6 | pass | d27c0000
int lsh 3a     |         17 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 3b     |          7 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4a     |         28 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int lsh 4b     |         17 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0a     |         17 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1a     |         25 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 1b     |         14 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2a     |         24 | pass | 469200000000000000000000000000000000000000000000000
int rsh 2b     |         14 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3a     |         14 | pass | 11a4800
int rsh 3b     |          6 | pass | 11a4800
int rsh 4a     |         24 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int rsh 4b     |         13 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0a     |         16 | pass | 66
int mul 0b     |          8 | pass | 66
int mul 1a     |         33 | pass | -9999999999999999999000000000000000000
int mul 1b     |         25 | pass | -9999999999999999999000000000000000000
int mul 2a     |         33 | pass | -8000000000000000000000000000000
int mul 2b     |         25 | pass | -8000000000000000000000000000000
int mul 3a     |        165 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int mul 3b     |        172 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int div 0a     |        101 | pass | 10,10
int div 0b     |         85 | pass | 10,10
int div 1a     |        326 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 1b     |        309 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2a     |        255 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 2b     |        237 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 3a     |       3065 | pass | exception thrown: divide by zero
int div 3b     |       1948 | pass | exception thrown: divide by zero
int div 4a     |        101 | pass | 10,-10
int div 4b     |         85 | pass | 10,-10
int toll 0     |          7 | pass | 0
int toll 1     |          9 | pass | -3000
int toll 2     |       1932 | pass | exception thrown: overflow error
int toll 3     |         11 | pass | -12345678987654321
int toll 4     |       1939 | pass | exception thrown: overflow error
int prn 0      |        849 | pass | -4701397401952099592073
int prn 1      |        738 | pass | -fedcfedc0123456789
int prn 2      |        757 | pass | -FEDCFEDC0123456789
int prn 3      |        883 | pass | -775563766700044321263611
int prn 4      |        849 | pass | -4701397401952099592073
int prn 5      |        776 | pass | -0xfedcfedc0123456789
int prn 6      |        774 | pass | -0XFEDCFEDC0123456789
int prn 7      |        916 | pass | -0775563766700044321263611
rat cons 0     |         41 | pass | 0/1
rat cons 1     |         74 | pass | 8/3
rat cons 2     |         74 | pass | -101/3
rat cons 3     |        760 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |        995 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |        887 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       5411 | pass | exception thrown: invalid digit
rat cons 7     |        215 | pass | 9/8
rat cons 8     |        176 | pass | -1/1048576
rat cons 9     |       2629 | pass | exception thrown: not a number
rat cons 10    |        205 | pass | ccccccccccccd/80000000000000
rat add 0a     |        134 | pass | 73/3
rat add 0b     |         92 | pass | 73/3
rat add 1a     |        182 | pass | 71/26
rat add 1b     |        136 | pass | 71/26
rat add 2a     |        439 | pass | -34738957485741895748957485743809574800000000/287923
rat add 2b     |        387 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3a     |        314 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat add 3b     |        261 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0a     |        150 | pass | 101/6
rat sub 0b     |        104 | pass | 101/6
rat sub 1a     |        364 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 1b     |        306 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2a     |        334 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 2b     |        282 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3a     |        173 | pass | -50/31459
rat sub 3b     |        135 | pass | -50/31459
rat comp 0a    |         35 | pass | 0
rat comp 0b    |         35 | pass | 1
rat comp 0c    |         35 | pass | 1
rat comp 0d    |         35 | pass | 1
rat comp 0e    |         35 | pass | 0
rat comp 0f    |         35 | pass | 0
rat comp 1a    |         37 | pass | 0
rat comp 1b    |         36 | pass | 1
rat comp 1c    |         36 | pass | 0
rat comp 1d    |         36 | pass | 0
rat comp 1e    |         37 | pass | 1
rat comp 1f    |         36 | pass | 1
rat comp 2a    |         36 | pass | 0
rat comp 2b    |         36 | pass | 1
rat comp 2c    |         36 | pass | 1
rat comp 2d    |         36 | pass | 1
rat comp 2e    |         36 | pass | 0
rat comp 2f    |         36 | pass | 0
rat comp 3a    |         44 | pass | 1
rat comp 3b    |         44 | pass | 0
rat comp 3c    |         44 | pass | 0
rat comp 3d    |         44 | pass | 1
rat comp 3e    |         44 | pass | 0
rat comp 3f    |         44 | pass | 1
rat mul 0a     |        103 | pass | 1/1250
rat mul 0b     |         63 | pass | 1/1250
rat mul 1a     |        181 | pass | -1111111111111111111000000000000000000/777
rat mul 1b     |        140 | pass | -1111111111111111111000000000000000000/777
rat mul 2a     |        168 | pass | -4000000000000000000000000000000/1
rat mul 2b     |        126 | pass | -4000000000000000000000000000000/1
rat mul 3a     |        632 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat mul 3b     |        607 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0a     |        204 | pass | 1000000000000000000/99999999999999999
rat div 0b     |        163 | pass | 1000000000000000000/99999999999999999
rat div 1a     |       1284 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 1b     |       1237 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2a     |       3128 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 2b     |       3065 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3a     |       2669 | pass | exception thrown: divide by zero
rat div 3b     |       1907 | pass | exception thrown: divide by zero
rat div 4a     |       1684 | pass | 28279753000000000000000000/2392375827899999976076241721
rat div 4b     |       1643 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |          8 | pass | 0
rat todouble 1 |         49 | pass | -50.8475
rat todouble 2 |        115 | pass | 1.23038e+50
rat todouble 3 |        105 | pass | 0.1
rat todouble 4 |       3024 | pass | exception thrown: overflow error
rat toparts 0  |          6 | pass | 0,1
rat toparts 1  |         13 | pass | -1500,29
rat prn 0      |       1080 | pass | -4701397401952099592073/65689
rat prn 1      |        936 | pass | -fedcfedc0123456789/10099
rat prn 2      |        959 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |       1125 | pass | -775563766700044321263611/200231
rat prn 4      |       1048 | pass | -4701397401952099592073/65689
rat prn 5      |        982 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |        985 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |       1166 | pass | -0775563766700044321263611/0200231
```

