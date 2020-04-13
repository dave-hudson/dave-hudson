---
title: "c8: Speeding string conversions with divide-and-conquer"
date: 2017-05-09T00:00:00+00:00
description: "c8: Speeding string conversions with divide-and-conquer."
---
One of the more telling performance stories in the benchmark data has been that the string constructors and string
stream output functions are somewhat slow.  The refactoring in the last week made the basic arithmetic operations
much more regular, and with that also put a spotlight on performance differences between different sizes of
operand values.

When we convert to, or from, a string, we had previously been using quite a naive approach, but we would
invariably end up invoking an m by 1 operation.  These were pretty efficient, although weren't taking advantage of
knowing that the m argument size would always be greater than zero.  Knowing this allowed the loops to be peeled
and made a little more efficient.

A much more significant realization was that a divide-and-conquer approach could be much more effective.  For
example, consider converting the string "2874".

In our original implementation we would turn this operation into a series of adds and multiplies, one pair for
each character in the string.  In our example we would compute: (((((2 * 10) + 8) * 10) + 7) * 10) + 4.  As the
string gets longer, however, the multiply and add get progressively more expensive for each digit.

If, instead, we look at pairs of characters, rather than individual ones, then we can reduce this to one
progressively more expensive multiply and add per pair, but with an extra cost of a much simpler multiply and add
of the characters in each pair.  These simpler ops are actually much faster, and the cumulative impact is
substantial, although the code footprint does increase a little.  In our example case this would look like:
(((2 * 10) + 8) * 100) + ((7 * 10) + 4).  Of course the "digits" we're using here are larger still and so we can
extend this idea further.

```
nat cons 0     |          4 | pass | 0
nat cons 1     |          5 | pass | 123456789abc
nat cons 2     |         15 | pass | 0
nat cons 3     |        194 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |        413 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |        107 | pass | 115415157637671751
nat cons 6     |       3855 | pass | exception thrown: invalid digit
nat cons 7     |        114 | pass | 100000000000000000000000
nat sz bits 0  |          4 | pass | 0
nat sz bits 1  |          5 | pass | 64
nat sz bits 2  |          5 | pass | 17
nat sz bits 3  |          6 | pass | 185
nat add 0a     |          8 | pass | 73
nat add 0b     |          7 | pass | 73
nat add 1a     |          7 | pass | 42
nat add 1b     |         10 | pass | 42
nat add 2a     |         11 | pass | 10000000000000001
nat add 2b     |         11 | pass | 10000000000000001
nat add 3a     |         16 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 3b     |         17 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4a     |         12 | pass | 10000000000000008
nat add 4b     |         11 | pass | 10000000000000008
nat sub 0a     |         11 | pass | 50
nat sub 0b     |         10 | pass | 50
nat sub 1a     |         18 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 1b     |         17 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2a     |         31 | pass | 897
nat sub 2b     |         29 | pass | 897
nat sub 3a     |       3140 | pass | exception thrown: not a number
nat sub 3b     |       2373 | pass | exception thrown: not a number
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
nat comp 2a    |          4 | pass | 0
nat comp 2b    |          4 | pass | 1
nat comp 2c    |          4 | pass | 0
nat comp 2d    |          4 | pass | 0
nat comp 2e    |          4 | pass | 1
nat comp 2f    |          9 | pass | 1
nat comp 3a    |          5 | pass | 1
nat comp 3b    |          6 | pass | 0
nat comp 3c    |          5 | pass | 0
nat comp 3d    |          9 | pass | 1
nat comp 3e    |          6 | pass | 0
nat comp 3f    |          5 | pass | 1
nat lsh 0a     |          9 | pass | 349f
nat lsh 0b     |          6 | pass | 349f
nat lsh 1a     |          7 | pass | 693e
nat lsh 1b     |          6 | pass | 693e
nat lsh 2a     |         10 | pass | d27c0000
nat lsh 2b     |          7 | pass | d27c0000
nat lsh 3a     |         10 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 3b     |          8 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4a     |         22 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 4b     |         21 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 5a     |         11 | pass | 349f29837532398565620000000000000000
nat lsh 5b     |         11 | pass | 349f29837532398565620000000000000000
nat lsh 6a     |          7 | pass | 349f20000000000000000
nat lsh 6b     |          7 | pass | 349f20000000000000000
nat rsh 0a     |         13 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1a     |         17 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 1b     |         15 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2a     |         16 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 2b     |         14 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3a     |         10 | pass | 11a4800
nat rsh 3b     |          7 | pass | 11a4800
nat rsh 4a     |         16 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 4b     |         14 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 5a     |          6 | pass | 0
nat rsh 5b     |          5 | pass | 0
nat rsh 6a     |          7 | pass | 0
nat rsh 6b     |         11 | pass | 0
nat mul 0a     |          7 | pass | 66
nat mul 0b     |          7 | pass | 66
nat mul 1a     |         25 | pass | 9999999999999999999000000000000000000
nat mul 1b     |         26 | pass | 9999999999999999999000000000000000000
nat mul 2a     |         26 | pass | 8000000000000000000000000000000
nat mul 2b     |         26 | pass | 8000000000000000000000000000000
nat mul 3a     |        165 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 3b     |        167 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4a     |         13 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 4b     |         13 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5a     |         13 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5b     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0a     |         89 | pass | 10,10
nat div 0b     |         86 | pass | 10,10
nat div 0c     |         45 | pass | 10,10
nat div 1a     |        319 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1b     |        316 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1c     |        162 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2a     |        246 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2b     |        244 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2c     |        126 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3a     |       3138 | pass | exception thrown: divide by zero
nat div 3b     |       2352 | pass | exception thrown: divide by zero
nat div 3c     |       3049 | pass | exception thrown: divide by zero
nat div 4a     |         41 | pass | 1000000,0
nat div 4b     |         36 | pass | 1000000,0
nat div 4c     |         24 | pass | 1000000,0
nat div 5a     |         96 | pass | 10000000000000001000000000000000100000000,0
nat div 5b     |         93 | pass | 10000000000000001000000000000000100000000,0
nat div 5c     |         54 | pass | 10000000000000001000000000000000100000000,0
nat div 6a     |        173 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6b     |        168 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6c     |         87 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 7a     |         21 | pass | 0,10000000000000001000000000000000100000000
nat div 7b     |         17 | pass | 0,10000000000000001000000000000000100000000
nat div 7c     |         11 | pass | 0,10000000000000001000000000000000100000000
nat gcd 0      |         53 | pass | 8
nat gcd 1      |        438 | pass | 1
nat gcd 2      |         31 | pass | 8888888
nat gcd 3      |        219 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat toull 0    |          5 | pass | 0
nat toull 1    |          4 | pass | 2000
nat toull 2    |       1945 | pass | exception thrown: overflow error
nat toull 3    |          7 | pass | 123456789a
nat toull 4    |       1951 | pass | exception thrown: overflow error
nat prn 0      |        187 | pass | 4701397401952099592073
nat prn 1      |        174 | pass | fedcfedc0123456789
nat prn 2      |        175 | pass | FEDCFEDC0123456789
nat prn 3      |        205 | pass | 775563766700044321263611
nat prn 4      |        193 | pass | 4701397401952099592073
nat prn 5      |        202 | pass | 0xfedcfedc0123456789
nat prn 6      |        203 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        220 | pass | 0775563766700044321263611
int cons 0     |          4 | pass | 0
int cons 1     |          5 | pass | 123456789abc
int cons 2     |         25 | pass | 0
int cons 3     |        245 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |        478 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        168 | pass | 115415157637671751
int cons 6     |       5109 | pass | exception thrown: invalid digit
int cons 7     |          5 | pass | -123456789abc
int cons 8     |        249 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |        475 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        169 | pass | -115415157637671751
int cons 11    |       5106 | pass | exception thrown: invalid digit
int add 0a     |         15 | pass | 73
int add 0b     |         11 | pass | 73
int add 1a     |         18 | pass | 21
int add 1b     |         13 | pass | 21
int add 2a     |         23 | pass | -34738957485741895748957485743809574800000000
int add 2b     |         23 | pass | -34738957485741895748957485743809574800000000
int add 3a     |         26 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int add 3b     |         17 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0a     |         18 | pass | 50
int sub 0b     |         13 | pass | 50
int sub 1a     |         28 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 1b     |         20 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 2a     |         25 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 2b     |         17 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 3a     |         18 | pass | -50
int sub 3b     |         17 | pass | -50
int comp 0a    |          5 | pass | 0
int comp 0b    |          5 | pass | 1
int comp 0c    |          5 | pass | 1
int comp 0d    |          5 | pass | 1
int comp 0e    |          6 | pass | 0
int comp 0f    |          4 | pass | 0
int comp 1a    |          2 | pass | 0
int comp 1b    |          4 | pass | 1
int comp 1c    |          4 | pass | 0
int comp 1d    |          4 | pass | 0
int comp 1e    |          4 | pass | 1
int comp 1f    |          4 | pass | 1
int comp 2a    |          4 | pass | 0
int comp 2b    |          4 | pass | 1
int comp 2c    |          5 | pass | 1
int comp 2d    |          4 | pass | 1
int comp 2e    |          4 | pass | 0
int comp 2f    |          4 | pass | 0
int comp 3a    |          6 | pass | 1
int comp 3b    |          6 | pass | 0
int comp 3c    |          7 | pass | 0
int comp 3d    |          9 | pass | 1
int comp 3e    |          8 | pass | 0
int comp 3f    |         13 | pass | 1
int lsh 0a     |         14 | pass | 349f
int lsh 0b     |          6 | pass | 349f
int lsh 1a     |         14 | pass | 693e
int lsh 1b     |          7 | pass | 693e
int lsh 2a     |         14 | pass | d27c0000
int lsh 2b     |          7 | pass | d27c0000
int lsh 3a     |         16 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 3b     |          7 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4a     |         29 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int lsh 4b     |         18 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0a     |         16 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1a     |         24 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 1b     |         14 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2a     |         24 | pass | 469200000000000000000000000000000000000000000000000
int rsh 2b     |         15 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3a     |         14 | pass | 11a4800
int rsh 3b     |          6 | pass | 11a4800
int rsh 4a     |         24 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int rsh 4b     |         14 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0a     |         14 | pass | 66
int mul 0b     |          7 | pass | 66
int mul 1a     |         32 | pass | -9999999999999999999000000000000000000
int mul 1b     |         26 | pass | -9999999999999999999000000000000000000
int mul 2a     |         32 | pass | -8000000000000000000000000000000
int mul 2b     |         26 | pass | -8000000000000000000000000000000
int mul 3a     |        163 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int mul 3b     |        168 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int div 0a     |        102 | pass | 10,10
int div 0b     |         86 | pass | 10,10
int div 1a     |        331 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 1b     |        316 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2a     |        262 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 2b     |        244 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 3a     |       4290 | pass | exception thrown: divide by zero
int div 3b     |       2385 | pass | exception thrown: divide by zero
int div 4a     |        102 | pass | 10,-10
int div 4b     |         86 | pass | 10,-10
int mag 0      |         12 | pass | 0
int mag 1      |         17 | pass | 327972384723987892758278957285728937582792798275982711419841
int mag 2      |         16 | pass | 347137515815980165165781407409651563019573157
int toll 0     |          8 | pass | 0
int toll 1     |         10 | pass | -3000
int toll 2     |       1996 | pass | exception thrown: overflow error
int toll 3     |         12 | pass | -12345678987654321
int toll 4     |       2013 | pass | exception thrown: overflow error
int prn 0      |        199 | pass | -4701397401952099592073
int prn 1      |        185 | pass | -fedcfedc0123456789
int prn 2      |        185 | pass | -FEDCFEDC0123456789
int prn 3      |        217 | pass | -775563766700044321263611
int prn 4      |        200 | pass | -4701397401952099592073
int prn 5      |        213 | pass | -0xfedcfedc0123456789
int prn 6      |        213 | pass | -0XFEDCFEDC0123456789
int prn 7      |        227 | pass | -0775563766700044321263611
rat cons 0     |         46 | pass | 0/1
rat cons 1     |         81 | pass | 8/3
rat cons 2     |         79 | pass | -101/3
rat cons 3     |        529 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |        626 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |        583 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       6618 | pass | exception thrown: invalid digit
rat cons 7     |        243 | pass | 9/8
rat cons 8     |        204 | pass | -1/1048576
rat cons 9     |       2685 | pass | exception thrown: not a number
rat cons 10    |        215 | pass | ccccccccccccd/80000000000000
rat add 0a     |        138 | pass | 73/3
rat add 0b     |        102 | pass | 73/3
rat add 1a     |        167 | pass | 71/26
rat add 1b     |        130 | pass | 71/26
rat add 2a     |        420 | pass | -34738957485741895748957485743809574800000000/287923
rat add 2b     |        373 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3a     |        293 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat add 3b     |        245 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0a     |        142 | pass | 101/6
rat sub 0b     |        103 | pass | 101/6
rat sub 1a     |        335 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 1b     |        285 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2a     |        303 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 2b     |        256 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3a     |        154 | pass | -50/31459
rat sub 3b     |        120 | pass | -50/31459
rat comp 0a    |          8 | pass | 0
rat comp 0b    |          8 | pass | 1
rat comp 0c    |         34 | pass | 1
rat comp 0d    |         34 | pass | 1
rat comp 0e    |         34 | pass | 0
rat comp 0f    |         34 | pass | 0
rat comp 1a    |          7 | pass | 0
rat comp 1b    |          7 | pass | 1
rat comp 1c    |         33 | pass | 0
rat comp 1d    |         34 | pass | 0
rat comp 1e    |         41 | pass | 1
rat comp 1f    |         34 | pass | 1
rat comp 2a    |          6 | pass | 0
rat comp 2b    |          6 | pass | 1
rat comp 2c    |         34 | pass | 1
rat comp 2d    |         34 | pass | 1
rat comp 2e    |         34 | pass | 0
rat comp 2f    |         34 | pass | 0
rat comp 3a    |         13 | pass | 1
rat comp 3b    |         13 | pass | 0
rat comp 3c    |         39 | pass | 0
rat comp 3d    |         38 | pass | 1
rat comp 3e    |         40 | pass | 0
rat comp 3f    |         40 | pass | 1
rat mul 0a     |        100 | pass | 1/1250
rat mul 0b     |         67 | pass | 1/1250
rat mul 1a     |        173 | pass | -1111111111111111111000000000000000000/777
rat mul 1b     |        137 | pass | -1111111111111111111000000000000000000/777
rat mul 2a     |        166 | pass | -4000000000000000000000000000000/1
rat mul 2b     |        125 | pass | -4000000000000000000000000000000/1
rat mul 3a     |        622 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat mul 3b     |        595 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0a     |        195 | pass | 1000000000000000000/99999999999999999
rat div 0b     |        159 | pass | 1000000000000000000/99999999999999999
rat div 1a     |       1161 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 1b     |       1125 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2a     |       2876 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 2b     |       2824 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3a     |       2811 | pass | exception thrown: divide by zero
rat div 3b     |       2098 | pass | exception thrown: divide by zero
rat div 4a     |       1528 | pass | 28279753000000000000000000/2392375827899999976076241721
rat div 4b     |       1491 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |         15 | pass | 0
rat todouble 1 |         57 | pass | -50.8475
rat todouble 2 |        117 | pass | 1.23038e+50
rat todouble 3 |        115 | pass | 0.1
rat todouble 4 |       3294 | pass | exception thrown: overflow error
rat toparts 0  |         16 | pass | 0,1
rat toparts 1  |         14 | pass | -1500,29
rat prn 0      |        269 | pass | -4701397401952099592073/65689
rat prn 1      |        254 | pass | -fedcfedc0123456789/10099
rat prn 2      |        256 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |        289 | pass | -775563766700044321263611/200231
rat prn 4      |        272 | pass | -4701397401952099592073/65689
rat prn 5      |        304 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |        304 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |        316 | pass | -0775563766700044321263611/0200231
```

