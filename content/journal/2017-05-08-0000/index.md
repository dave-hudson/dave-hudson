---
title: "c8: Refactoring"
date: 2017-05-08T00:00:00+00:00
description: "c8: Refactoring."
---
Sometimes it's good to see what can be done to refactor code as it can lead to some surprises.  It turns out that
the simplifications from a few days ago made it quite obvious that some refactoring might be in order.

The first thing that was evident was that the handling of zero-digit values wasn't consistent with the approaches
of 1 and n, or m, digit values, as zero digit versions were handled inside the `c8::natural` class and not the
digit array code.  Moving all of these to the digit array code allowed for a lot of code to be deleted.

The next problem was that the digit array code wasn't consistently handling digit array buffers as sometimes we'd
need to copy source arrays to prevent problems with overwriting, but other times we wouldn't.  Now the digit array
layer is entirely responsible for this.

The constructor and stream output operations weren't using efficient digit array functions but, instead, using
features of the `c8::natural` class that they were helping implement.  Aside from being much slower, this sort of
recursive behaviour is harder to reason about.  Both now use the digit array layer and see a very nice speedup.

Finally, the GCD code was using digit array operations, but was still dealing in a lot of temporary `c8::natural`
objects.  A bit of analysis showed that there was a nice way to unroll the division sequence to avoid the
temporaries and see a nice speedup in any GCD usage.

Pretty-much all of the expensive operations see significant improvements over the last numbers we had from
[2017-03-17](../2017-03-17-0000).

```
nat cons 0     |          4 | pass | 0
nat cons 1     |          5 | pass | 123456789abc
nat cons 2     |         12 | pass | 0
nat cons 3     |        281 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |        728 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |        121 | pass | 115415157637671751
nat cons 6     |       2700 | pass | exception thrown: invalid digit
nat cons 7     |        125 | pass | 100000000000000000000000
nat sz bits 0  |          4 | pass | 0
nat sz bits 1  |          5 | pass | 64
nat sz bits 2  |         15 | pass | 17
nat sz bits 3  |          5 | pass | 185
nat add 0a     |          8 | pass | 73
nat add 0b     |         10 | pass | 73
nat add 1a     |         13 | pass | 42
nat add 1b     |          7 | pass | 42
nat add 2a     |          9 | pass | 10000000000000001
nat add 2b     |          8 | pass | 10000000000000001
nat add 3a     |         16 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 3b     |         15 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4a     |          6 | pass | 10000000000000008
nat add 4b     |          6 | pass | 10000000000000008
nat sub 0a     |          6 | pass | 50
nat sub 0b     |          5 | pass | 50
nat sub 1a     |         18 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 1b     |         16 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2a     |         31 | pass | 897
nat sub 2b     |         29 | pass | 897
nat sub 3a     |       3159 | pass | exception thrown: not a number
nat sub 3b     |       2417 | pass | exception thrown: not a number
nat comp 0a    |          4 | pass | 0
nat comp 0b    |          4 | pass | 1
nat comp 0c    |          4 | pass | 1
nat comp 0d    |          4 | pass | 1
nat comp 0e    |          4 | pass | 0
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
nat comp 2f    |          4 | pass | 1
nat comp 3a    |          5 | pass | 1
nat comp 3b    |          5 | pass | 0
nat comp 3c    |          6 | pass | 0
nat comp 3d    |          6 | pass | 1
nat comp 3e    |          6 | pass | 0
nat comp 3f    |          6 | pass | 1
nat lsh 0a     |          7 | pass | 349f
nat lsh 0b     |          6 | pass | 349f
nat lsh 1a     |          7 | pass | 693e
nat lsh 1b     |          7 | pass | 693e
nat lsh 2a     |          7 | pass | d27c0000
nat lsh 2b     |          7 | pass | d27c0000
nat lsh 3a     |          9 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 3b     |          7 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4a     |         19 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 4b     |         18 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 5a     |         12 | pass | 349f29837532398565620000000000000000
nat lsh 5b     |         12 | pass | 349f29837532398565620000000000000000
nat lsh 6a     |          7 | pass | 349f20000000000000000
nat lsh 6b     |          7 | pass | 349f20000000000000000
nat rsh 0a     |          8 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1a     |         15 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 1b     |         14 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2a     |         16 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 2b     |         14 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3a     |          7 | pass | 11a4800
nat rsh 3b     |          6 | pass | 11a4800
nat rsh 4a     |         15 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 4b     |         14 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 5a     |          6 | pass | 0
nat rsh 5b     |          2 | pass | 0
nat rsh 6a     |          6 | pass | 0
nat rsh 6b     |          5 | pass | 0
nat mul 0a     |          7 | pass | 66
nat mul 0b     |          7 | pass | 66
nat mul 1a     |         24 | pass | 9999999999999999999000000000000000000
nat mul 1b     |         26 | pass | 9999999999999999999000000000000000000
nat mul 2a     |         24 | pass | 8000000000000000000000000000000
nat mul 2b     |         25 | pass | 8000000000000000000000000000000
nat mul 3a     |        158 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 3b     |        169 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4a     |         13 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 4b     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5a     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5b     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0a     |         91 | pass | 10,10
nat div 0b     |         86 | pass | 10,10
nat div 0c     |         45 | pass | 10,10
nat div 1a     |        317 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1b     |        315 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1c     |        162 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2a     |        247 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2b     |        244 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2c     |        125 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3a     |       3130 | pass | exception thrown: divide by zero
nat div 3b     |       2375 | pass | exception thrown: divide by zero
nat div 3c     |       3179 | pass | exception thrown: divide by zero
nat div 4a     |         47 | pass | 1000000,0
nat div 4b     |         45 | pass | 1000000,0
nat div 4c     |         30 | pass | 1000000,0
nat div 5a     |        103 | pass | 10000000000000001000000000000000100000000,0
nat div 5b     |         98 | pass | 10000000000000001000000000000000100000000,0
nat div 5c     |         57 | pass | 10000000000000001000000000000000100000000,0
nat div 6a     |        174 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6b     |        170 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6c     |         88 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 7a     |         21 | pass | 0,10000000000000001000000000000000100000000
nat div 7b     |         17 | pass | 0,10000000000000001000000000000000100000000
nat div 7c     |         11 | pass | 0,10000000000000001000000000000000100000000
nat gcd 0      |         48 | pass | 8
nat gcd 1      |        427 | pass | 1
nat gcd 2      |         27 | pass | 8888888
nat gcd 3      |        197 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat toull 0    |          5 | pass | 0
nat toull 1    |          6 | pass | 2000
nat toull 2    |       1969 | pass | exception thrown: overflow error
nat toull 3    |          7 | pass | 123456789a
nat toull 4    |       1946 | pass | exception thrown: overflow error
nat prn 0      |        723 | pass | 4701397401952099592073
nat prn 1      |        631 | pass | fedcfedc0123456789
nat prn 2      |        629 | pass | FEDCFEDC0123456789
nat prn 3      |        781 | pass | 775563766700044321263611
nat prn 4      |        721 | pass | 4701397401952099592073
nat prn 5      |        652 | pass | 0xfedcfedc0123456789
nat prn 6      |        654 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        790 | pass | 0775563766700044321263611
int cons 0     |          3 | pass | 0
int cons 1     |          5 | pass | 123456789abc
int cons 2     |         22 | pass | 0
int cons 3     |        337 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |        783 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        174 | pass | 115415157637671751
int cons 6     |       4001 | pass | exception thrown: invalid digit
int cons 7     |          5 | pass | -123456789abc
int cons 8     |        343 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |        778 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        200 | pass | -115415157637671751
int cons 11    |       4039 | pass | exception thrown: invalid digit
int add 0a     |         16 | pass | 73
int add 0b     |         11 | pass | 73
int add 1a     |         19 | pass | 21
int add 1b     |         13 | pass | 21
int add 2a     |         23 | pass | -34738957485741895748957485743809574800000000
int add 2b     |         22 | pass | -34738957485741895748957485743809574800000000
int add 3a     |         26 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int add 3b     |         17 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0a     |         18 | pass | 50
int sub 0b     |         13 | pass | 50
int sub 1a     |         29 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 1b     |         21 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 2a     |         26 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 2b     |         17 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 3a     |         19 | pass | -50
int sub 3b     |         18 | pass | -50
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
int comp 3c    |          7 | pass | 0
int comp 3d    |          7 | pass | 1
int comp 3e    |          7 | pass | 0
int comp 3f    |          7 | pass | 1
int lsh 0a     |         14 | pass | 349f
int lsh 0b     |          6 | pass | 349f
int lsh 1a     |         14 | pass | 693e
int lsh 1b     |          7 | pass | 693e
int lsh 2a     |         14 | pass | d27c0000
int lsh 2b     |          7 | pass | d27c0000
int lsh 3a     |         16 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 3b     |          7 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4a     |         29 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int lsh 4b     |         24 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0a     |         17 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1a     |         24 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 1b     |         14 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2a     |         24 | pass | 469200000000000000000000000000000000000000000000000
int rsh 2b     |         14 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3a     |         14 | pass | 11a4800
int rsh 3b     |          6 | pass | 11a4800
int rsh 4a     |         24 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int rsh 4b     |         14 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0a     |         14 | pass | 66
int mul 0b     |          7 | pass | 66
int mul 1a     |         32 | pass | -9999999999999999999000000000000000000
int mul 1b     |         26 | pass | -9999999999999999999000000000000000000
int mul 2a     |         32 | pass | -8000000000000000000000000000000
int mul 2b     |         25 | pass | -8000000000000000000000000000000
int mul 3a     |        167 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int mul 3b     |        169 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
int div 0a     |        102 | pass | 10,10
int div 0b     |         86 | pass | 10,10
int div 1a     |        332 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 1b     |        313 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2a     |        261 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 2b     |        244 | pass | -ffffffffffffffff000000000000000,-100000000000000000000000
int div 3a     |       4350 | pass | exception thrown: divide by zero
int div 3b     |       2455 | pass | exception thrown: divide by zero
int div 4a     |        102 | pass | 10,-10
int div 4b     |         86 | pass | 10,-10
int mag 0      |         12 | pass | 0
int mag 1      |         17 | pass | 327972384723987892758278957285728937582792798275982711419841
int mag 2      |         16 | pass | 347137515815980165165781407409651563019573157
int toll 0     |          7 | pass | 0
int toll 1     |          9 | pass | -3000
int toll 2     |       1966 | pass | exception thrown: overflow error
int toll 3     |         11 | pass | -12345678987654321
int toll 4     |       1953 | pass | exception thrown: overflow error
int prn 0      |        724 | pass | -4701397401952099592073
int prn 1      |        633 | pass | -fedcfedc0123456789
int prn 2      |        633 | pass | -FEDCFEDC0123456789
int prn 3      |        778 | pass | -775563766700044321263611
int prn 4      |        724 | pass | -4701397401952099592073
int prn 5      |        657 | pass | -0xfedcfedc0123456789
int prn 6      |        656 | pass | -0XFEDCFEDC0123456789
int prn 7      |        796 | pass | -0775563766700044321263611
rat cons 0     |         44 | pass | 0/1
rat cons 1     |         74 | pass | 8/3
rat cons 2     |         76 | pass | -101/3
rat cons 3     |        610 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |        779 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |        656 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       5616 | pass | exception thrown: invalid digit
rat cons 7     |        217 | pass | 9/8
rat cons 8     |        175 | pass | -1/1048576
rat cons 9     |       2621 | pass | exception thrown: not a number
rat cons 10    |        204 | pass | ccccccccccccd/80000000000000
rat add 0a     |        126 | pass | 73/3
rat add 0b     |         90 | pass | 73/3
rat add 1a     |        159 | pass | 71/26
rat add 1b     |        118 | pass | 71/26
rat add 2a     |        406 | pass | -34738957485741895748957485743809574800000000/287923
rat add 2b     |        374 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3a     |        291 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat add 3b     |        245 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0a     |        137 | pass | 101/6
rat sub 0b     |         97 | pass | 101/6
rat sub 1a     |        342 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 1b     |        291 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2a     |        304 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 2b     |        258 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3a     |        151 | pass | -50/31459
rat sub 3b     |        117 | pass | -50/31459
rat comp 0a    |          7 | pass | 0
rat comp 0b    |          7 | pass | 1
rat comp 0c    |         31 | pass | 1
rat comp 0d    |         31 | pass | 1
rat comp 0e    |         32 | pass | 0
rat comp 0f    |         32 | pass | 0
rat comp 1a    |          5 | pass | 0
rat comp 1b    |          5 | pass | 1
rat comp 1c    |         32 | pass | 0
rat comp 1d    |         33 | pass | 0
rat comp 1e    |         32 | pass | 1
rat comp 1f    |         33 | pass | 1
rat comp 2a    |          5 | pass | 0
rat comp 2b    |          5 | pass | 1
rat comp 2c    |         32 | pass | 1
rat comp 2d    |         36 | pass | 1
rat comp 2e    |         32 | pass | 0
rat comp 2f    |         33 | pass | 0
rat comp 3a    |         12 | pass | 1
rat comp 3b    |         12 | pass | 0
rat comp 3c    |         37 | pass | 0
rat comp 3d    |         37 | pass | 1
rat comp 3e    |         37 | pass | 0
rat comp 3f    |         37 | pass | 1
rat mul 0a     |         98 | pass | 1/1250
rat mul 0b     |         64 | pass | 1/1250
rat mul 1a     |        175 | pass | -1111111111111111111000000000000000000/777
rat mul 1b     |        139 | pass | -1111111111111111111000000000000000000/777
rat mul 2a     |        165 | pass | -4000000000000000000000000000000/1
rat mul 2b     |        128 | pass | -4000000000000000000000000000000/1
rat mul 3a     |        619 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat mul 3b     |        594 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0a     |        195 | pass | 1000000000000000000/99999999999999999
rat div 0b     |        158 | pass | 1000000000000000000/99999999999999999
rat div 1a     |       1157 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 1b     |       1116 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2a     |       2855 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 2b     |       2827 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3a     |       2731 | pass | exception thrown: divide by zero
rat div 3b     |       1983 | pass | exception thrown: divide by zero
rat div 4a     |       1530 | pass | 28279753000000000000000000/2392375827899999976076241721
rat div 4b     |       1490 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |          9 | pass | 0
rat todouble 1 |         57 | pass | -50.8475
rat todouble 2 |        113 | pass | 1.23038e+50
rat todouble 3 |        113 | pass | 0.1
rat todouble 4 |       3000 | pass | exception thrown: overflow error
rat toparts 0  |         13 | pass | 0,1
rat toparts 1  |         13 | pass | -1500,29
rat prn 0      |        941 | pass | -4701397401952099592073/65689
rat prn 1      |        850 | pass | -fedcfedc0123456789/10099
rat prn 2      |        849 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |       1005 | pass | -775563766700044321263611/200231
rat prn 4      |        939 | pass | -4701397401952099592073/65689
rat prn 5      |        894 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |        894 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |       1035 | pass | -0775563766700044321263611/0200231
```

