---
title: "c8: May require some assembly"
date: 2017-05-29T00:00:00+00:00
description: "c8: May require some assembly."
---
One of the problems with C++ compilers is that sometimes they're not able to do the optimizations we might like.
In this instance we have a scenario where we want to divide a `c8::natural_double_digit` by a
`c8::natural_digit`, knowing that the result can only be another `c8::natural_digit`, but unfortunately there's
no way to express this restriction on the output.  As such the compiler inevitably generates a more expansive
divide, but this is always slower.  With a couple of very small pieces of inline assembler code we can get a
major speedup!

## Fixing bit rot

Code that isn't compiled and tested regularly enough can bit rot and that's been the case here.  The aim was that
the library be able to support many different sizes of digit, but that had become broken with other changes.
This has now been fixed, and with an aim to avoid this in the future, an item has been added to the issue
tracker.  Fixing this also exposed a couple of additional corner case problems and emphasizes the need for more
test coverage.  Improving this will be a priority over the next few weeks.

## Revised performance

The new performance numbers for `c8_check -b -v` are:

```
nat cons 0     |          2 | pass | 0
nat cons 1     |          3 | pass | 123456789abc
nat cons 2     |         11 | pass | 0
nat cons 3     |        156 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |        308 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |         90 | pass | 115415157637671751
nat cons 6     |       4100 | pass | exception thrown: invalid digit
nat cons 7     |        106 | pass | 100000000000000000000000
nat sz bits 0  |          2 | pass | 0
nat sz bits 1  |          3 | pass | 64
nat sz bits 2  |          5 | pass | 17
nat sz bits 3  |          5 | pass | 185
nat add 0a     |          7 | pass | 73
nat add 0b     |          5 | pass | 73
nat add 1a     |          5 | pass | 42
nat add 1b     |          4 | pass | 42
nat add 2a     |          5 | pass | 10000000000000001
nat add 2b     |          5 | pass | 10000000000000001
nat add 3a     |          9 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 3b     |          8 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4a     |          5 | pass | 10000000000000008
nat add 4b     |          5 | pass | 10000000000000008
nat sub 0a     |          5 | pass | 50
nat sub 0b     |          4 | pass | 50
nat sub 1a     |         14 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 1b     |          9 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2a     |         19 | pass | 897
nat sub 2b     |         17 | pass | 897
nat sub 3a     |       2759 | pass | exception thrown: not a number
nat sub 3b     |       2067 | pass | exception thrown: not a number
nat sub 4a     |          8 | pass | 1000000000000000000000000000000000000000000008797000000000000000000000000000000000
nat sub 4b     |         12 | pass | 1000000000000000000000000000000000000000000008797000000000000000000000000000000000
nat sub 5a     |         10 | pass | ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
nat sub 5b     |          8 | pass | ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
nat comp 0a    |          4 | pass | 0
nat comp 0b    |          4 | pass | 1
nat comp 0c    |          2 | pass | 1
nat comp 0d    |          2 | pass | 1
nat comp 0e    |          3 | pass | 0
nat comp 0f    |          3 | pass | 0
nat comp 1a    |          4 | pass | 0
nat comp 1b    |          3 | pass | 1
nat comp 1c    |          3 | pass | 1
nat comp 1d    |          5 | pass | 1
nat comp 1e    |          4 | pass | 0
nat comp 1f    |          3 | pass | 0
nat comp 2a    |          2 | pass | 0
nat comp 2b    |          3 | pass | 1
nat comp 2c    |          3 | pass | 0
nat comp 2d    |          3 | pass | 0
nat comp 2e    |          3 | pass | 1
nat comp 2f    |          3 | pass | 1
nat comp 3a    |          3 | pass | 1
nat comp 3b    |          5 | pass | 0
nat comp 3c    |          3 | pass | 0
nat comp 3d    |          3 | pass | 1
nat comp 3e    |          3 | pass | 0
nat comp 3f    |          3 | pass | 1
nat lsh 0a     |          4 | pass | 349f
nat lsh 0b     |          4 | pass | 349f
nat lsh 1a     |          5 | pass | 693e
nat lsh 1b     |          5 | pass | 693e
nat lsh 2a     |          7 | pass | d27c0000
nat lsh 2b     |          5 | pass | d27c0000
nat lsh 3a     |         14 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 3b     |          7 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4a     |         11 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 4b     |         10 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 5a     |          6 | pass | 349f29837532398565620000000000000000
nat lsh 5b     |          5 | pass | 349f29837532398565620000000000000000
nat lsh 6a     |          4 | pass | 349f20000000000000000
nat lsh 6b     |          6 | pass | 349f20000000000000000
nat rsh 0a     |          5 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 0b     |          5 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1a     |         11 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 1b     |          6 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2a     |          7 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 2b     |          7 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3a     |          7 | pass | 11a4800
nat rsh 3b     |          6 | pass | 11a4800
nat rsh 4a     |         11 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 4b     |         11 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 5a     |          4 | pass | 0
nat rsh 5b     |          3 | pass | 0
nat rsh 6a     |          6 | pass | 0
nat rsh 6b     |          5 | pass | 0
nat mul 0a     |          7 | pass | 66
nat mul 0b     |          6 | pass | 66
nat mul 1a     |          7 | pass | 9999999999999999999000000000000000000
nat mul 1b     |          7 | pass | 9999999999999999999000000000000000000
nat mul 2a     |          7 | pass | 8000000000000000000000000000000
nat mul 2b     |          7 | pass | 8000000000000000000000000000000
nat mul 3a     |         86 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 3b     |        102 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4a     |         10 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 4b     |          8 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5a     |          8 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5b     |          8 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0a     |         26 | pass | 10,10
nat div 0b     |         23 | pass | 10,10
nat div 0c     |         15 | pass | 10,10
nat div 1a     |        152 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1b     |        150 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1c     |         80 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2a     |        187 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2b     |        182 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2c     |         94 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3a     |       2705 | pass | exception thrown: divide by zero
nat div 3b     |       1972 | pass | exception thrown: divide by zero
nat div 3c     |       2775 | pass | exception thrown: divide by zero
nat div 4a     |         26 | pass | 1000000,0
nat div 4b     |         24 | pass | 1000000,0
nat div 4c     |         28 | pass | 1000000,0
nat div 5a     |         46 | pass | 10000000000000001000000000000000100000000,0
nat div 5b     |         45 | pass | 10000000000000001000000000000000100000000,0
nat div 5c     |         26 | pass | 10000000000000001000000000000000100000000,0
nat div 6a     |        156 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6b     |        147 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6c     |         79 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 7a     |         50 | pass | 0,10000000000000001000000000000000100000000
nat div 7b     |         46 | pass | 0,10000000000000001000000000000000100000000
nat div 7c     |         29 | pass | 0,10000000000000001000000000000000100000000
nat div 8a     |        113 | pass | fffffffffffffffd,3fffffffffffffffd
nat div 8b     |        112 | pass | fffffffffffffffd,3fffffffffffffffd
nat div 8c     |         60 | pass | fffffffffffffffd,3fffffffffffffffd
nat gcd 0      |         57 | pass | 8
nat gcd 1      |        289 | pass | 1
nat gcd 2      |         25 | pass | 8888888
nat gcd 3      |        159 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat gcd 4      |         74 | pass | 2
nat toull 0    |          3 | pass | 0
nat toull 1    |          5 | pass | 2000
nat toull 2    |       2061 | pass | exception thrown: overflow error
nat toull 3    |          6 | pass | 123456789a
nat toull 4    |       2035 | pass | exception thrown: overflow error
nat prn 0      |        270 | pass | 4701397401952099592073
nat prn 1      |        237 | pass | fedcfedc0123456789
nat prn 2      |        238 | pass | FEDCFEDC0123456789
nat prn 3      |        283 | pass | 775563766700044321263611
nat prn 4      |        272 | pass | 4701397401952099592073
nat prn 5      |        271 | pass | 0xfedcfedc0123456789
nat prn 6      |        267 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        296 | pass | 0775563766700044321263611
int cons 0     |          4 | pass | 0
int cons 1     |          3 | pass | 123456789abc
int cons 2     |         25 | pass | 0
int cons 3     |        205 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |        345 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        149 | pass | 115415157637671751
int cons 6     |       5333 | pass | exception thrown: invalid digit
int cons 7     |          3 | pass | -123456789abc
int cons 8     |        216 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |        350 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        152 | pass | -115415157637671751
int cons 11    |       5373 | pass | exception thrown: invalid digit
int add 0a     |         16 | pass | 73
int add 0b     |         12 | pass | 73
int add 1a     |         18 | pass | 21
int add 1b     |         12 | pass | 21
int add 2a     |         17 | pass | -34738957485741895748957485743809574800000000
int add 2b     |         17 | pass | -34738957485741895748957485743809574800000000
int add 3a     |         21 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int add 3b     |         10 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0a     |         11 | pass | 50
int sub 0b     |          9 | pass | 50
int sub 1a     |         24 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 1b     |         17 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 2a     |         19 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 2b     |         10 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 3a     |         17 | pass | -50
int sub 3b     |         16 | pass | -50
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
int comp 1e    |          9 | pass | 1
int comp 1f    |         14 | pass | 1
int comp 2a    |          2 | pass | 0
int comp 2b    |          2 | pass | 1
int comp 2c    |          2 | pass | 1
int comp 2d    |          2 | pass | 1
int comp 2e    |          3 | pass | 0
int comp 2f    |          4 | pass | 0
int comp 3a    |          6 | pass | 1
int comp 3b    |          4 | pass | 0
int comp 3c    |          6 | pass | 0
int comp 3d    |         17 | pass | 1
int comp 3e    |         13 | pass | 0
int comp 3f    |          4 | pass | 1
int lsh 0a     |          8 | pass | 349f
int lsh 0b     |          6 | pass | 349f
int lsh 1a     |         14 | pass | 693e
int lsh 1b     |          7 | pass | 693e
int lsh 2a     |         10 | pass | d27c0000
int lsh 2b     |          7 | pass | d27c0000
int lsh 3a     |         11 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 3b     |         14 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4a     |         19 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int lsh 4b     |         12 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0a     |         11 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 0b     |          5 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1a     |         17 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 1b     |          9 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2a     |         17 | pass | 469200000000000000000000000000000000000000000000000
int rsh 2b     |          8 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3a     |          9 | pass | 11a4800
int rsh 3b     |         13 | pass | 11a4800
int rsh 4a     |         19 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int rsh 4b     |          7 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0a     |         14 | pass | 66
int mul 0b     |          6 | pass | 66
int mul 1a     |         13 | pass | -9999999999999999999000000000000000000
int mul 1b     |          5 | pass | -9999999999999999999000000000000000000
int mul 2a     |          9 | pass | -8000000000000000000000000000000
int mul 2b     |          7 | pass | -8000000000000000000000000000000
int mul 3a     |         89 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int mul 3b     |        102 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int div 0a     |         37 | pass | 10,10
int div 0b     |         24 | pass | 10,10
int div 1a     |        163 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 1b     |        153 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2a     |        200 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 2b     |        189 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 3a     |       3944 | pass | exception thrown: divide by zero
int div 3b     |       2083 | pass | exception thrown: divide by zero
int div 4a     |         36 | pass | 10,-10
int div 4b     |         24 | pass | 10,-10
int mag 0      |         28 | pass | 0
int mag 1      |         13 | pass | 327972384723987892758278957285728937582792798275982711419841
int mag 2      |         13 | pass | 347137515815980165165781407409651563019573157
int toll 0     |          7 | pass | 0
int toll 1     |          7 | pass | -3000
int toll 2     |       2053 | pass | exception thrown: overflow error
int toll 3     |         12 | pass | -12345678987654321
int toll 4     |       1952 | pass | exception thrown: overflow error
int prn 0      |        274 | pass | -4701397401952099592073
int prn 1      |        247 | pass | -fedcfedc0123456789
int prn 2      |        250 | pass | -FEDCFEDC0123456789
int prn 3      |        296 | pass | -775563766700044321263611
int prn 4      |        280 | pass | -4701397401952099592073
int prn 5      |        280 | pass | -0xfedcfedc0123456789
int prn 6      |        277 | pass | -0XFEDCFEDC0123456789
int prn 7      |        310 | pass | -0775563766700044321263611
rat cons 0     |         39 | pass | 0/1
rat cons 1     |         76 | pass | 8/3
rat cons 2     |         76 | pass | -101/3
rat cons 3     |        492 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |        512 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |        469 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       7106 | pass | exception thrown: invalid digit
rat cons 7     |         91 | pass | 9/8
rat cons 8     |        123 | pass | -1/1048576
rat cons 9     |       2813 | pass | exception thrown: not a number
rat cons 10    |        111 | pass | ccccccccccccd/80000000000000
rat add 0a     |        127 | pass | 73/3
rat add 0b     |         94 | pass | 73/3
rat add 1a     |        161 | pass | 71/26
rat add 1b     |        122 | pass | 71/26
rat add 2a     |        269 | pass | -34738957485741895748957485743809574800000000/287923
rat add 2b     |        228 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3a     |        247 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat add 3b     |        204 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0a     |        134 | pass | 101/6
rat sub 0b     |         96 | pass | 101/6
rat sub 1a     |        331 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 1b     |        289 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2a     |        275 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 2b     |        234 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3a     |        153 | pass | -50/31459
rat sub 3b     |        119 | pass | -50/31459
rat comp 0a    |          4 | pass | 0
rat comp 0b    |          5 | pass | 1
rat comp 0c    |         33 | pass | 1
rat comp 0d    |         31 | pass | 1
rat comp 0e    |         30 | pass | 0
rat comp 0f    |         33 | pass | 0
rat comp 1a    |         11 | pass | 0
rat comp 1b    |          4 | pass | 1
rat comp 1c    |         32 | pass | 0
rat comp 1d    |         31 | pass | 0
rat comp 1e    |         27 | pass | 1
rat comp 1f    |         28 | pass | 1
rat comp 2a    |          5 | pass | 0
rat comp 2b    |          3 | pass | 1
rat comp 2c    |         31 | pass | 1
rat comp 2d    |         30 | pass | 1
rat comp 2e    |         27 | pass | 0
rat comp 2f    |         26 | pass | 0
rat comp 3a    |         11 | pass | 1
rat comp 3b    |         12 | pass | 0
rat comp 3c    |         34 | pass | 0
rat comp 3d    |         33 | pass | 1
rat comp 3e    |         33 | pass | 0
rat comp 3f    |         34 | pass | 1
rat mul 0a     |         92 | pass | 1/1250
rat mul 0b     |         62 | pass | 1/1250
rat mul 1a     |        133 | pass | -1111111111111111111000000000000000000/777
rat mul 1b     |         98 | pass | -1111111111111111111000000000000000000/777
rat mul 2a     |        108 | pass | -4000000000000000000000000000000/1
rat mul 2b     |         76 | pass | -4000000000000000000000000000000/1
rat mul 3a     |        517 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat mul 3b     |        486 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0a     |        124 | pass | 1000000000000000000/99999999999999999
rat div 0b     |         91 | pass | 1000000000000000000/99999999999999999
rat div 1a     |        606 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 1b     |        573 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2a     |       2117 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 2b     |       2124 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3a     |       2663 | pass | exception thrown: divide by zero
rat div 3b     |       2011 | pass | exception thrown: divide by zero
rat div 4a     |        951 | pass | 28279753000000000000000000/2392375827899999976076241721
rat div 4b     |        931 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |          6 | pass | 0
rat todouble 1 |         44 | pass | -50.8475
rat todouble 2 |         70 | pass | 1.23038e+50
rat todouble 3 |         66 | pass | 0.1
rat todouble 4 |       3231 | pass | exception thrown: overflow error
rat toparts 0  |          7 | pass | 0,1
rat toparts 1  |          7 | pass | -1500,29
rat prn 0      |        345 | pass | -4701397401952099592073/65689
rat prn 1      |        325 | pass | -fedcfedc0123456789/10099
rat prn 2      |        323 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |        369 | pass | -775563766700044321263611/200231
rat prn 4      |        345 | pass | -4701397401952099592073/65689
rat prn 5      |        377 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |        376 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |        396 | pass | -0775563766700044321263611/0200231
```

Also of note is the hot spot for the profiler run in `natural_perf`:

```
  0.32 │       mov    -0x10(%r14,%rcx,8),%rax
       │                      * taken and optimize everything else away.
       │                      */
       │                     do {
       │                         if (sizeof(natural_digit) == 8) {
       │     #if defined(C8_USE_ASM) && defined(__x86_64__)
       │                             asm volatile (
  0.02 │       div    %rdi
 56.76 │       mov    %rax,%r8
       │                 /*
       │                  * Did we estimate that there was a non-zero digit?  If yes, then we want to refine
       │                  * the estimate and subtract it from our dividend, but if we estimated zero then
       │                  * we do nothing to our dividend.
       │                  */
       │                 if (C8_LIKELY(q)) {
  0.01 │       test   %r8,%r8
```

Our divide instruction (this is one of the places where inline assembler is now in use) accounts for 56% of the
CPU time in the test.  This indicates that we've got very little scope to improve things too much more with
conventional CPU instructions.  There will always have to be extra overheads associated with divide operations
and yet our quotient estimation totally dominates our performance characteristics.

