---
title: "c8: Improving performance & fixing bugs"
date: 2017-05-25T00:00:00+00:00
description: "c8: Improving performance & fixing bugs."
---
Whenever it's looked like the performance of the code has reached its limit another opportunity arises.  In this
case reading the assembler output from the compiler showed that there were some opportunities to rearrange the
sources to reduce register pressure.

While looking at the divide code though (m by n digits) it was obvious that there was a potential problem with
quotient estimation.  It seemed like a good opportunity to resolve some long-standing performance problems at the
same time.

The overall effect is notable.  While a few test cases aren't as fast as they used to be, many are significantly
faster:

```
nat cons 0     |          4 | pass | 0
nat cons 1     |          4 | pass | 123456789abc
nat cons 2     |         13 | pass | 0
nat cons 3     |        168 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |        373 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |         99 | pass | 115415157637671751
nat cons 6     |       3731 | pass | exception thrown: invalid digit
nat cons 7     |        107 | pass | 100000000000000000000000
nat sz bits 0  |          4 | pass | 0
nat sz bits 1  |          5 | pass | 64
nat sz bits 2  |          5 | pass | 17
nat sz bits 3  |          5 | pass | 185
nat add 0a     |          7 | pass | 73
nat add 0b     |          6 | pass | 73
nat add 1a     |          7 | pass | 42
nat add 1b     |          6 | pass | 42
nat add 2a     |          7 | pass | 10000000000000001
nat add 2b     |         12 | pass | 10000000000000001
nat add 3a     |         14 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 3b     |         13 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4a     |          7 | pass | 10000000000000008
nat add 4b     |          7 | pass | 10000000000000008
nat sub 0a     |          7 | pass | 50
nat sub 0b     |          6 | pass | 50
nat sub 1a     |         14 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 1b     |         13 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2a     |         20 | pass | 897
nat sub 2b     |         17 | pass | 897
nat sub 3a     |       2531 | pass | exception thrown: not a number
nat sub 3b     |       1911 | pass | exception thrown: not a number
nat sub 4a     |         13 | pass | 1000000000000000000000000000000000000000000008797000000000000000000000000000000000
nat sub 4b     |         12 | pass | 1000000000000000000000000000000000000000000008797000000000000000000000000000000000
nat sub 5a     |         13 | pass | ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
nat sub 5b     |         12 | pass | ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
nat comp 0a    |          4 | pass | 0
nat comp 0b    |          4 | pass | 1
nat comp 0c    |          4 | pass | 1
nat comp 0d    |          4 | pass | 1
nat comp 0e    |          5 | pass | 0
nat comp 0f    |          5 | pass | 0
nat comp 1a    |          4 | pass | 0
nat comp 1b    |          4 | pass | 1
nat comp 1c    |          4 | pass | 1
nat comp 1d    |          4 | pass | 1
nat comp 1e    |          5 | pass | 0
nat comp 1f    |          5 | pass | 0
nat comp 2a    |          4 | pass | 0
nat comp 2b    |          4 | pass | 1
nat comp 2c    |          5 | pass | 0
nat comp 2d    |          5 | pass | 0
nat comp 2e    |          5 | pass | 1
nat comp 2f    |          5 | pass | 1
nat comp 3a    |          5 | pass | 1
nat comp 3b    |          5 | pass | 0
nat comp 3c    |          5 | pass | 0
nat comp 3d    |          5 | pass | 1
nat comp 3e    |          5 | pass | 0
nat comp 3f    |          5 | pass | 1
nat lsh 0a     |          7 | pass | 349f
nat lsh 0b     |          6 | pass | 349f
nat lsh 1a     |          8 | pass | 693e
nat lsh 1b     |          7 | pass | 693e
nat lsh 2a     |          8 | pass | d27c0000
nat lsh 2b     |          7 | pass | d27c0000
nat lsh 3a     |          8 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 3b     |          7 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4a     |         13 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 4b     |         13 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 5a     |          8 | pass | 349f29837532398565620000000000000000
nat lsh 5b     |          8 | pass | 349f29837532398565620000000000000000
nat lsh 6a     |          7 | pass | 349f20000000000000000
nat lsh 6b     |          6 | pass | 349f20000000000000000
nat rsh 0a     |          8 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1a     |         12 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 1b     |          9 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2a     |         12 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 2b     |          9 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3a     |          8 | pass | 11a4800
nat rsh 3b     |          6 | pass | 11a4800
nat rsh 4a     |         12 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 4b     |          9 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 5a     |          7 | pass | 0
nat rsh 5b     |          4 | pass | 0
nat rsh 6a     |          6 | pass | 0
nat rsh 6b     |          5 | pass | 0
nat mul 0a     |          7 | pass | 66
nat mul 0b     |          6 | pass | 66
nat mul 1a     |          7 | pass | 9999999999999999999000000000000000000
nat mul 1b     |          7 | pass | 9999999999999999999000000000000000000
nat mul 2a     |          7 | pass | 8000000000000000000000000000000
nat mul 2b     |          7 | pass | 8000000000000000000000000000000
nat mul 3a     |         87 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 3b     |        103 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4a     |         11 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 4b     |          9 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5a     |         11 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5b     |          9 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0a     |         27 | pass | 10,10
nat div 0b     |         26 | pass | 10,10
nat div 0c     |         16 | pass | 10,10
nat div 1a     |        296 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1b     |        296 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1c     |        148 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2a     |        195 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2b     |        193 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2c     |        101 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3a     |       2614 | pass | exception thrown: divide by zero
nat div 3b     |       1827 | pass | exception thrown: divide by zero
nat div 3c     |       2673 | pass | exception thrown: divide by zero
nat div 4a     |         27 | pass | 1000000,0
nat div 4b     |         26 | pass | 1000000,0
nat div 4c     |         16 | pass | 1000000,0
nat div 5a     |         88 | pass | 10000000000000001000000000000000100000000,0
nat div 5b     |         86 | pass | 10000000000000001000000000000000100000000,0
nat div 5c     |         46 | pass | 10000000000000001000000000000000100000000,0
nat div 6a     |        178 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6b     |        177 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6c     |         91 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 7a     |         14 | pass | 0,10000000000000001000000000000000100000000
nat div 7b     |         12 | pass | 0,10000000000000001000000000000000100000000
nat div 7c     |          8 | pass | 0,10000000000000001000000000000000100000000
nat div 8a     |        121 | pass | fffffffffffffffd,3fffffffffffffffd
nat div 8b     |        118 | pass | fffffffffffffffd,3fffffffffffffffd
nat div 8c     |         62 | pass | fffffffffffffffd,3fffffffffffffffd
nat gcd 0      |         54 | pass | 8
nat gcd 1      |        335 | pass | 1
nat gcd 2      |         25 | pass | 8888888
nat gcd 3      |        163 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat toull 0    |          5 | pass | 0
nat toull 1    |          6 | pass | 2000
nat toull 2    |       1909 | pass | exception thrown: overflow error
nat toull 3    |          6 | pass | 123456789a
nat toull 4    |       1901 | pass | exception thrown: overflow error
nat prn 0      |        316 | pass | 4701397401952099592073
nat prn 1      |        292 | pass | fedcfedc0123456789
nat prn 2      |        307 | pass | FEDCFEDC0123456789
nat prn 3      |        338 | pass | 775563766700044321263611
nat prn 4      |        316 | pass | 4701397401952099592073
nat prn 5      |        322 | pass | 0xfedcfedc0123456789
nat prn 6      |        329 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        351 | pass | 0775563766700044321263611
int cons 0     |          4 | pass | 0
int cons 1     |          5 | pass | 123456789abc
int cons 2     |         23 | pass | 0
int cons 3     |        223 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |        411 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        152 | pass | 115415157637671751
int cons 6     |       5008 | pass | exception thrown: invalid digit
int cons 7     |          4 | pass | -123456789abc
int cons 8     |        234 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |        422 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        156 | pass | -115415157637671751
int cons 11    |       5056 | pass | exception thrown: invalid digit
int add 0a     |         17 | pass | 73
int add 0b     |          9 | pass | 73
int add 1a     |         17 | pass | 21
int add 1b     |         12 | pass | 21
int add 2a     |         19 | pass | -34738957485741895748957485743809574800000000
int add 2b     |         22 | pass | -34738957485741895748957485743809574800000000
int add 3a     |         24 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int add 3b     |         15 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0a     |         17 | pass | 50
int sub 0b     |         11 | pass | 50
int sub 1a     |         25 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 1b     |         17 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 2a     |         22 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 2b     |         15 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 3a     |         18 | pass | -50
int sub 3b     |         17 | pass | -50
int comp 0a    |          5 | pass | 0
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
int comp 3a    |          6 | pass | 1
int comp 3b    |          6 | pass | 0
int comp 3c    |          6 | pass | 0
int comp 3d    |          6 | pass | 1
int comp 3e    |          6 | pass | 0
int comp 3f    |          6 | pass | 1
int lsh 0a     |         14 | pass | 349f
int lsh 0b     |          6 | pass | 349f
int lsh 1a     |         14 | pass | 693e
int lsh 1b     |          7 | pass | 693e
int lsh 2a     |         14 | pass | d27c0000
int lsh 2b     |          7 | pass | d27c0000
int lsh 3a     |         16 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 3b     |          8 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4a     |         20 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int lsh 4b     |         17 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0a     |         16 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1a     |         18 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 1b     |          9 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2a     |         18 | pass | 469200000000000000000000000000000000000000000000000
int rsh 2b     |          9 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3a     |         14 | pass | 11a4800
int rsh 3b     |          6 | pass | 11a4800
int rsh 4a     |         19 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int rsh 4b     |          9 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0a     |         14 | pass | 66
int mul 0b     |          7 | pass | 66
int mul 1a     |         14 | pass | -9999999999999999999000000000000000000
int mul 1b     |          7 | pass | -9999999999999999999000000000000000000
int mul 2a     |         14 | pass | -8000000000000000000000000000000
int mul 2b     |          7 | pass | -8000000000000000000000000000000
int mul 3a     |         93 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int mul 3b     |        102 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int div 0a     |         38 | pass | 10,10
int div 0b     |         26 | pass | 10,10
int div 1a     |        306 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 1b     |        296 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2a     |        209 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 2b     |        194 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 3a     |       3731 | pass | exception thrown: divide by zero
int div 3b     |       1896 | pass | exception thrown: divide by zero
int div 4a     |         38 | pass | 10,-10
int div 4b     |         26 | pass | 10,-10
int mag 0      |         11 | pass | 0
int mag 1      |         14 | pass | 327972384723987892758278957285728937582792798275982711419841
int mag 2      |         14 | pass | 347137515815980165165781407409651563019573157
int toll 0     |          7 | pass | 0
int toll 1     |          9 | pass | -3000
int toll 2     |       1868 | pass | exception thrown: overflow error
int toll 3     |         11 | pass | -12345678987654321
int toll 4     |       1817 | pass | exception thrown: overflow error
int prn 0      |        328 | pass | -4701397401952099592073
int prn 1      |        302 | pass | -fedcfedc0123456789
int prn 2      |        317 | pass | -FEDCFEDC0123456789
int prn 3      |        346 | pass | -775563766700044321263611
int prn 4      |        329 | pass | -4701397401952099592073
int prn 5      |        329 | pass | -0xfedcfedc0123456789
int prn 6      |        333 | pass | -0XFEDCFEDC0123456789
int prn 7      |        367 | pass | -0775563766700044321263611
rat cons 0     |         45 | pass | 0/1
rat cons 1     |         80 | pass | 8/3
rat cons 2     |         79 | pass | -101/3
rat cons 3     |        630 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |        642 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |        542 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       6640 | pass | exception thrown: invalid digit
rat cons 7     |         99 | pass | 9/8
rat cons 8     |        176 | pass | -1/1048576
rat cons 9     |       2630 | pass | exception thrown: not a number
rat cons 10    |        117 | pass | ccccccccccccd/80000000000000
rat add 0a     |        133 | pass | 73/3
rat add 0b     |         94 | pass | 73/3
rat add 1a     |        169 | pass | 71/26
rat add 1b     |        128 | pass | 71/26
rat add 2a     |        372 | pass | -34738957485741895748957485743809574800000000/287923
rat add 2b     |        336 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3a     |        368 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat add 3b     |        323 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0a     |        144 | pass | 101/6
rat sub 0b     |        103 | pass | 101/6
rat sub 1a     |        531 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 1b     |        486 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2a     |        401 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 2b     |        359 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3a     |        162 | pass | -50/31459
rat sub 3b     |        126 | pass | -50/31459
rat comp 0a    |          7 | pass | 0
rat comp 0b    |          7 | pass | 1
rat comp 0c    |         31 | pass | 1
rat comp 0d    |         32 | pass | 1
rat comp 0e    |         32 | pass | 0
rat comp 0f    |         32 | pass | 0
rat comp 1a    |          5 | pass | 0
rat comp 1b    |          5 | pass | 1
rat comp 1c    |         29 | pass | 0
rat comp 1d    |         29 | pass | 0
rat comp 1e    |         31 | pass | 1
rat comp 1f    |         29 | pass | 1
rat comp 2a    |          5 | pass | 0
rat comp 2b    |          5 | pass | 1
rat comp 2c    |         31 | pass | 1
rat comp 2d    |         29 | pass | 1
rat comp 2e    |         29 | pass | 0
rat comp 2f    |         29 | pass | 0
rat comp 3a    |         12 | pass | 1
rat comp 3b    |         11 | pass | 0
rat comp 3c    |         32 | pass | 0
rat comp 3d    |         33 | pass | 1
rat comp 3e    |         32 | pass | 0
rat comp 3f    |         32 | pass | 1
rat mul 0a     |        102 | pass | 1/1250
rat mul 0b     |         67 | pass | 1/1250
rat mul 1a     |        178 | pass | -1111111111111111111000000000000000000/777
rat mul 1b     |        144 | pass | -1111111111111111111000000000000000000/777
rat mul 2a     |        135 | pass | -4000000000000000000000000000000/1
rat mul 2b     |         98 | pass | -4000000000000000000000000000000/1
rat mul 3a     |        838 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat mul 3b     |        819 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0a     |        133 | pass | 1000000000000000000/99999999999999999
rat div 0b     |         98 | pass | 1000000000000000000/99999999999999999
rat div 1a     |        750 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 1b     |        715 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2a     |       2266 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 2b     |       2224 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3a     |       2605 | pass | exception thrown: divide by zero
rat div 3b     |       1869 | pass | exception thrown: divide by zero
rat div 4a     |       1025 | pass | 28279753000000000000000000/2392375827899999976076241721
rat div 4b     |        987 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |          9 | pass | 0
rat todouble 1 |         46 | pass | -50.8475
rat todouble 2 |        103 | pass | 1.23038e+50
rat todouble 3 |         96 | pass | 0.1
rat todouble 4 |       2904 | pass | exception thrown: overflow error
rat toparts 0  |         12 | pass | 0,1
rat toparts 1  |         13 | pass | -1500,29
rat prn 0      |        405 | pass | -4701397401952099592073/65689
rat prn 1      |        377 | pass | -fedcfedc0123456789/10099
rat prn 2      |        379 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |        424 | pass | -775563766700044321263611/200231
rat prn 4      |        404 | pass | -4701397401952099592073/65689
rat prn 5      |        427 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |        428 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |        449 | pass | -0775563766700044321263611/0200231
```

I'd not profiled the code for a while and this was interesting (`natural_perf`):

```
  40.11%  natural_perf  natural_perf      [.] __udivti3
  29.88%  natural_perf  natural_perf      [.] c8::__digit_array_divide_modulus_m_n
  21.82%  natural_perf  natural_perf      [.] c8::__digit_array_multiply_m_n
   3.79%  natural_perf  natural_perf      [.] c8::natural::operator/
   3.06%  natural_perf  natural_perf      [.] c8::natural::operator*
   1.19%  natural_perf  natural_perf      [.] main
   0.03%  natural_perf  [unknown]         [k] 0xffffffff810644aa
   0.01%  natural_perf  [unknown]         [k] 0xffffffff8183c590
   0.01%  natural_perf  [unknown]         [k] 0xffffffff8183d2e0
   0.01%  natural_perf  natural_perf      [.] time
```

The use of `__int128` shows up with the compiler invoking a small divide function, `__udivti3` and that's clearly
an opportunity for optimization.  This seems like a good potential candidate for inline assembler in the future.

