---
title: "c8: Refactoring"
date: 2017-03-13T00:00:00+00:00
description: "c8: Refactoring."
---
All good codebases need constant refactoring to ensure that they don't get hard to maintain, and this one is no
exception.  Many of the arithmetic operations on `c8::natural` have ended up duplicating common code sequences
of digit array code.  Refactoring this reduces the number of lines of code and improves the readability and
maintainability.

In this case there's a side benefit too.  Allowing the modulus implementation to be expressed in a more compact
manner lets us inline a more compact version of the code, and `c8::natural::gcd()` gets a nice speed-up.

## Performance update

As previously we'll start with the numbers compiled with clang v3.8.  The updated performance numbers for
`c8_check -b -v` are:

```
nat cons 0     |          4 | pass | 0
nat cons 1     |          5 | pass | 123456789abc
nat cons 2     |         13 | pass | 0
nat cons 3     |        441 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |       1152 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |        203 | pass | 115415157637671751
nat cons 6     |       2563 | pass | exception thrown: invalid digit
nat cons 7     |        224 | pass | 100000000000000000000000
nat count 0    |          2 | pass | 0
nat count 1    |          3 | pass | 64
nat count 2    |          3 | pass | 17
nat count 3    |          5 | pass | 185
nat add 0a     |          8 | pass | 73
nat add 0b     |          7 | pass | 73
nat add 1a     |          9 | pass | 42
nat add 1b     |          8 | pass | 42
nat add 2a     |         11 | pass | 10000000000000001
nat add 2b     |          9 | pass | 10000000000000001
nat add 3a     |         16 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 3b     |         15 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4a     |          5 | pass | 55
nat add 4b     |          4 | pass | 55
nat add 5a     |          8 | pass | 1000000000000000000000001
nat add 5b     |          7 | pass | 1000000000000000000000001
nat add 6a     |         12 | pass | 10000000000000008
nat add 6b     |          9 | pass | 10000000000000008
nat sub 0a     |          8 | pass | 50
nat sub 0b     |          7 | pass | 50
nat sub 1a     |         18 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 1b     |         16 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2a     |         32 | pass | 897
nat sub 2b     |         28 | pass | 897
nat sub 3a     |       3106 | pass | exception thrown: not a number
nat sub 3b     |       2468 | pass | exception thrown: not a number
nat sub 4a     |          4 | pass | 38
nat sub 4b     |          3 | pass | 38
nat sub 5a     |       2731 | pass | exception thrown: not a number
nat sub 5b     |       1980 | pass | exception thrown: not a number
nat sub 6a     |          8 | pass | 0
nat sub 6b     |          4 | pass | 0
nat sub 7a     |         12 | pass | ffffffffffffffffffffffff
nat sub 7b     |          9 | pass | ffffffffffffffffffffffff
nat comp 0a    |          5 | pass | 0
nat comp 0b    |          5 | pass | 1
nat comp 0c    |          5 | pass | 1
nat comp 0d    |          5 | pass | 1
nat comp 0e    |          5 | pass | 0
nat comp 0f    |          5 | pass | 0
nat comp 1a    |          2 | pass | 0
nat comp 1b    |          2 | pass | 1
nat comp 1c    |          2 | pass | 1
nat comp 1d    |          3 | pass | 1
nat comp 1e    |          4 | pass | 0
nat comp 1f    |          4 | pass | 0
nat comp 2a    |          5 | pass | 0
nat comp 2b    |          5 | pass | 1
nat comp 2c    |          5 | pass | 0
nat comp 2d    |          5 | pass | 0
nat comp 2e    |          5 | pass | 1
nat comp 2f    |          3 | pass | 1
nat comp 3a    |          6 | pass | 1
nat comp 3b    |          4 | pass | 0
nat comp 3c    |          3 | pass | 0
nat comp 3d    |          6 | pass | 1
nat comp 3e    |          6 | pass | 0
nat comp 3f    |          6 | pass | 1
nat lsh 0a     |          8 | pass | 349f
nat lsh 0b     |          6 | pass | 349f
nat lsh 1a     |          8 | pass | 693e
nat lsh 1b     |          7 | pass | 693e
nat lsh 2a     |          7 | pass | d27c0000
nat lsh 2b     |          7 | pass | d27c0000
nat lsh 3a     |          9 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 3b     |         29 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4a     |         27 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 4b     |         21 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 5a     |         12 | pass | 349f29837532398565620000000000000000
nat lsh 5b     |         11 | pass | 349f29837532398565620000000000000000
nat lsh 6a     |          8 | pass | 349f20000000000000000
nat lsh 6b     |          7 | pass | 349f20000000000000000
nat rsh 0a     |          9 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1a     |         15 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 1b     |         13 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2a     |         15 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 2b     |         14 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3a     |          7 | pass | 11a4800
nat rsh 3b     |          6 | pass | 11a4800
nat rsh 4a     |         15 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 4b     |         13 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 5a     |          6 | pass | 0
nat rsh 5b     |          4 | pass | 0
nat rsh 6a     |          7 | pass | 0
nat rsh 6b     |          4 | pass | 0
nat mul 0a     |          9 | pass | 66
nat mul 0b     |          8 | pass | 66
nat mul 1a     |         25 | pass | 9999999999999999999000000000000000000
nat mul 1b     |         25 | pass | 9999999999999999999000000000000000000
nat mul 2a     |         25 | pass | 8000000000000000000000000000000
nat mul 2b     |         25 | pass | 8000000000000000000000000000000
nat mul 3a     |        171 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 3b     |        165 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4a     |         14 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 4b     |         14 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5a     |         14 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5b     |         14 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 6a     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 6b     |         11 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0a     |         88 | pass | 10,10
nat div 0b     |         86 | pass | 10,10
nat div 0c     |         44 | pass | 10,10
nat div 1a     |        314 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1b     |        309 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1c     |        160 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2a     |        240 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2b     |        236 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2c     |        122 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3a     |       1919 | pass | exception thrown: divide by zero
nat div 3b     |       1983 | pass | exception thrown: divide by zero
nat div 3c     |       1952 | pass | exception thrown: divide by zero
nat div 4a     |         48 | pass | 1000000,0
nat div 4b     |         42 | pass | 1000000,0
nat div 4c     |         28 | pass | 1000000,0
nat div 5a     |        101 | pass | 10000000000000001000000000000000100000000,0
nat div 5b     |         97 | pass | 10000000000000001000000000000000100000000,0
nat div 5c     |         56 | pass | 10000000000000001000000000000000100000000,0
nat div 6a     |        170 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6b     |        166 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6c     |         87 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 7a     |         46 | pass | 10000000000,0
nat div 7b     |         45 | pass | 10000000000,0
nat div 7c     |         28 | pass | 10000000000,0
nat div 8a     |         17 | pass | 27109017,17
nat div 8b     |         16 | pass | 27109017,17
nat div 8c     |         13 | pass | 27109017,17
nat gcd 0      |         58 | pass | 8
nat gcd 1      |        518 | pass | 1
nat gcd 2      |         26 | pass | 8888888
nat gcd 3      |        223 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat toull 0    |          5 | pass | 0
nat toull 1    |          6 | pass | 2000
nat toull 2    |       1924 | pass | exception thrown: overflow error
nat toull 3    |          7 | pass | 123456789a
nat toull 4    |       1915 | pass | exception thrown: overflow error
nat prn 0      |        844 | pass | 4701397401952099592073
nat prn 1      |        727 | pass | fedcfedc0123456789
nat prn 2      |        727 | pass | FEDCFEDC0123456789
nat prn 3      |        878 | pass | 775563766700044321263611
nat prn 4      |        845 | pass | 4701397401952099592073
nat prn 5      |        754 | pass | 0xfedcfedc0123456789
nat prn 6      |        749 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        888 | pass | 0775563766700044321263611
int cons 0     |          4 | pass | 0
int cons 1     |          5 | pass | 123456789abc
int cons 2     |         21 | pass | 0
int cons 3     |        471 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |       1205 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        238 | pass | 115415157637671751
int cons 6     |       3852 | pass | exception thrown: invalid digit
int cons 7     |          5 | pass | -123456789abc
int cons 8     |        482 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |       1212 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        244 | pass | -115415157637671751
int cons 11    |       3844 | pass | exception thrown: invalid digit
int add 0      |         15 | pass | 73
int add 1      |         17 | pass | 21
int add 2      |         21 | pass | -34738957485741895748957485743809574800000000
int add 3      |         25 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0      |         18 | pass | 50
int sub 1      |         29 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
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
int comp 1d    |          3 | pass | 0
int comp 1e    |          4 | pass | 1
int comp 1f    |          4 | pass | 1
int comp 2a    |          4 | pass | 0
int comp 2b    |          4 | pass | 1
int comp 2c    |          3 | pass | 1
int comp 2d    |          2 | pass | 1
int comp 2e    |          2 | pass | 0
int comp 2f    |          4 | pass | 0
int comp 3a    |          7 | pass | 1
int comp 3b    |          7 | pass | 0
int comp 3c    |          7 | pass | 0
int comp 3d    |          8 | pass | 1
int comp 3e    |          7 | pass | 0
int comp 3f    |          7 | pass | 1
int lsh 0      |         15 | pass | 349f
int lsh 1      |         15 | pass | 693e
int lsh 2      |         15 | pass | d27c0000
int lsh 3      |         16 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4      |         27 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0      |         17 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1      |         23 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2      |         23 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3      |         14 | pass | 11a4800
int rsh 4      |         23 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0      |         15 | pass | 66
int mul 1      |         35 | pass | -9999999999999999999000000000000000000
int mul 2      |         31 | pass | -8000000000000000000000000000000
int mul 2      |         31 | pass | -8000000000000000000000000000000
int div 0      |         98 | pass | 10,10
int div 1      |        325 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2      |        253 | pass | -ffffffffffffffff000000000000000,100000000000000000000000
int div 3      |       3145 | pass | exception thrown: divide by zero
int div 4      |         98 | pass | 10,10
int toll 0     |          7 | pass | 0
int toll 1     |          8 | pass | -3000
int toll 2     |       1936 | pass | exception thrown: overflow error
int toll 3     |         11 | pass | -12345678987654321
int toll 4     |       1933 | pass | exception thrown: overflow error
int prn 0      |        848 | pass | -4701397401952099592073
int prn 1      |        736 | pass | -fedcfedc0123456789
int prn 2      |        743 | pass | -FEDCFEDC0123456789
int prn 3      |        887 | pass | -775563766700044321263611
int prn 4      |        849 | pass | -4701397401952099592073
int prn 5      |        757 | pass | -0xfedcfedc0123456789
int prn 6      |        757 | pass | -0XFEDCFEDC0123456789
int prn 7      |        893 | pass | -0775563766700044321263611
rat cons 0     |         61 | pass | 0/1
rat cons 1     |         96 | pass | 8/3
rat cons 2     |         96 | pass | -101/3
rat cons 3     |        791 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |       1038 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |        908 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       5440 | pass | exception thrown: invalid digit
rat cons 7     |        234 | pass | 9/8
rat cons 8     |        195 | pass | -1/1048576
rat cons 9     |       2912 | pass | exception thrown: not a number
rat cons 10    |        225 | pass | ccccccccccccd/80000000000000
rat add 0      |        151 | pass | 73/3
rat add 1      |        196 | pass | 71/26
rat add 2      |        451 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3      |        325 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0      |        163 | pass | 101/6
rat sub 1      |        376 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2      |        347 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3      |        186 | pass | -50/31459
rat comp 0a    |         34 | pass | 0
rat comp 0b    |         34 | pass | 1
rat comp 0c    |         34 | pass | 1
rat comp 0d    |         34 | pass | 1
rat comp 0e    |         34 | pass | 0
rat comp 0f    |         34 | pass | 0
rat comp 1a    |         35 | pass | 0
rat comp 1b    |         35 | pass | 1
rat comp 1c    |         35 | pass | 0
rat comp 1d    |         35 | pass | 0
rat comp 1e    |         35 | pass | 1
rat comp 1f    |         35 | pass | 1
rat comp 2a    |         34 | pass | 0
rat comp 2b    |         34 | pass | 1
rat comp 2c    |         34 | pass | 1
rat comp 2d    |         34 | pass | 1
rat comp 2e    |         34 | pass | 0
rat comp 2f    |         34 | pass | 0
rat comp 3a    |         42 | pass | 1
rat comp 3b    |         41 | pass | 0
rat comp 3c    |         42 | pass | 0
rat comp 3d    |         42 | pass | 1
rat comp 3e    |         41 | pass | 0
rat comp 3f    |         41 | pass | 1
rat mul 0      |        116 | pass | 1/1250
rat mul 1      |        194 | pass | -1111111111111111111000000000000000000/777
rat mul 2      |        183 | pass | -4000000000000000000000000000000/1
rat mul 3      |        663 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0      |        226 | pass | 1000000000000000000/99999999999999999
rat div 1      |       1331 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2      |       3172 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3      |       2988 | pass | exception thrown: divide by zero
rat div 4      |       1727 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |         13 | pass | 0
rat todouble 1 |         56 | pass | -50.8475
rat todouble 2 |        117 | pass | 1.23038e+50
rat todouble 3 |        112 | pass | 0.1
rat todouble 4 |       3146 | pass | exception thrown: overflow error
rat toparts 0  |          8 | pass | 0,1
rat toparts 1  |         10 | pass | -1500,29
rat prn 0      |       1057 | pass | -4701397401952099592073/65689
rat prn 1      |        942 | pass | -fedcfedc0123456789/10099
rat prn 2      |        955 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |       1134 | pass | -775563766700044321263611/200231
rat prn 4      |       1056 | pass | -4701397401952099592073/65689
rat prn 5      |        989 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |       1005 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |       1175 | pass | -0775563766700044321263611/0200231
```

When this project started out clang was giving significantly better performance numbers that gcc, but as the code structure has been refined it has become more gcc friendly.  This might not be a complete coincidence as I worked on gcc backend development for about 10 years and know a style of code that gcc tends to like.

The numbers for gcc v5.4.0:

```
nat cons 0     |          4 | pass | 0
nat cons 1     |          5 | pass | 123456789abc
nat cons 2     |         14 | pass | 0
nat cons 3     |        368 | pass | 3837439787487386792386728abcd88379dc
nat cons 4     |        965 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
nat cons 5     |        177 | pass | 115415157637671751
nat cons 6     |       2761 | pass | exception thrown: invalid digit
nat cons 7     |        193 | pass | 100000000000000000000000
nat count 0    |          4 | pass | 0
nat count 1    |          5 | pass | 64
nat count 2    |          5 | pass | 17
nat count 3    |          5 | pass | 185
nat add 0a     |          7 | pass | 73
nat add 0b     |          6 | pass | 73
nat add 1a     |          8 | pass | 42
nat add 1b     |          8 | pass | 42
nat add 2a     |          7 | pass | 10000000000000001
nat add 2b     |          7 | pass | 10000000000000001
nat add 3a     |         14 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 3b     |         13 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
nat add 4a     |          7 | pass | 55
nat add 4b     |          6 | pass | 55
nat add 5a     |          7 | pass | 1000000000000000000000001
nat add 5b     |          7 | pass | 1000000000000000000000001
nat add 6a     |          7 | pass | 10000000000000008
nat add 6b     |          8 | pass | 10000000000000008
nat sub 0a     |          6 | pass | 50
nat sub 0b     |          6 | pass | 50
nat sub 1a     |         16 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 1b     |         16 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
nat sub 2a     |         29 | pass | 897
nat sub 2b     |         29 | pass | 897
nat sub 3a     |       2844 | pass | exception thrown: not a number
nat sub 3b     |       1975 | pass | exception thrown: not a number
nat sub 4a     |          7 | pass | 38
nat sub 4b     |          5 | pass | 38
nat sub 5a     |       2862 | pass | exception thrown: not a number
nat sub 5b     |       1967 | pass | exception thrown: not a number
nat sub 6a     |          7 | pass | 0
nat sub 6b     |          4 | pass | 0
nat sub 7a     |         11 | pass | ffffffffffffffffffffffff
nat sub 7b     |         11 | pass | ffffffffffffffffffffffff
nat comp 0a    |          5 | pass | 0
nat comp 0b    |          5 | pass | 1
nat comp 0c    |          5 | pass | 1
nat comp 0d    |          5 | pass | 1
nat comp 0e    |          6 | pass | 0
nat comp 0f    |          6 | pass | 0
nat comp 1a    |          4 | pass | 0
nat comp 1b    |          4 | pass | 1
nat comp 1c    |          5 | pass | 1
nat comp 1d    |          4 | pass | 1
nat comp 1e    |          4 | pass | 0
nat comp 1f    |          4 | pass | 0
nat comp 2a    |          5 | pass | 0
nat comp 2b    |          5 | pass | 1
nat comp 2c    |          5 | pass | 0
nat comp 2d    |          5 | pass | 0
nat comp 2e    |          4 | pass | 1
nat comp 2f    |          5 | pass | 1
nat comp 3a    |          6 | pass | 1
nat comp 3b    |          6 | pass | 0
nat comp 3c    |          6 | pass | 0
nat comp 3d    |          6 | pass | 1
nat comp 3e    |          6 | pass | 0
nat comp 3f    |          6 | pass | 1
nat lsh 0a     |         18 | pass | 349f
nat lsh 0b     |          7 | pass | 349f
nat lsh 1a     |          8 | pass | 693e
nat lsh 1b     |          7 | pass | 693e
nat lsh 2a     |          8 | pass | d27c0000
nat lsh 2b     |          6 | pass | d27c0000
nat lsh 3a     |          8 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 3b     |          7 | pass | 1a4f80000000000000000000000000000000000000000000000
nat lsh 4a     |         17 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 4b     |         16 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
nat lsh 5a     |          9 | pass | 349f29837532398565620000000000000000
nat lsh 5b     |          8 | pass | 349f29837532398565620000000000000000
nat lsh 6a     |          8 | pass | 349f20000000000000000
nat lsh 6b     |          7 | pass | 349f20000000000000000
nat rsh 0a     |         11 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 0b     |          7 | pass | 23490000000000000000000000000000000000000000000000000000
nat rsh 1a     |         16 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 1b     |         15 | pass | 11a48000000000000000000000000000000000000000000000000000
nat rsh 2a     |         16 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 2b     |         15 | pass | 469200000000000000000000000000000000000000000000000
nat rsh 3a     |          7 | pass | 11a4800
nat rsh 3b     |          6 | pass | 11a4800
nat rsh 4a     |         16 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 4b     |         15 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
nat rsh 5a     |          6 | pass | 0
nat rsh 5b     |          4 | pass | 0
nat rsh 6a     |          7 | pass | 0
nat rsh 6b     |          5 | pass | 0
nat mul 0a     |          8 | pass | 66
nat mul 0b     |          7 | pass | 66
nat mul 1a     |         16 | pass | 9999999999999999999000000000000000000
nat mul 1b     |         17 | pass | 9999999999999999999000000000000000000
nat mul 2a     |         17 | pass | 8000000000000000000000000000000
nat mul 2b     |         18 | pass | 8000000000000000000000000000000
nat mul 3a     |        142 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 3b     |        140 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
nat mul 4a     |         10 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 4b     |         12 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5a     |         11 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 5b     |          9 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 6a     |          8 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat mul 6b     |          8 | pass | abcdef1200000000abcdef120000000abcdef1200000000
nat div 0a     |         77 | pass | 10,10
nat div 0b     |         75 | pass | 10,10
nat div 0c     |         42 | pass | 10,10
nat div 1a     |        288 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1b     |        289 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 1c     |        147 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
nat div 2a     |        237 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2b     |        232 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 2c     |        123 | pass | ffffffffffffffff000000000000000,100000000000000000000000
nat div 3a     |       2154 | pass | exception thrown: divide by zero
nat div 3b     |       2033 | pass | exception thrown: divide by zero
nat div 3c     |       2102 | pass | exception thrown: divide by zero
nat div 4a     |         44 | pass | 1000000,0
nat div 4b     |         44 | pass | 1000000,0
nat div 4c     |         27 | pass | 1000000,0
nat div 5a     |         97 | pass | 10000000000000001000000000000000100000000,0
nat div 5b     |        101 | pass | 10000000000000001000000000000000100000000,0
nat div 5c     |         57 | pass | 10000000000000001000000000000000100000000,0
nat div 6a     |        172 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6b     |        168 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 6c     |         92 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
nat div 7a     |         52 | pass | 10000000000,0
nat div 7b     |         49 | pass | 10000000000,0
nat div 7c     |         33 | pass | 10000000000,0
nat div 8a     |         16 | pass | 27109017,17
nat div 8b     |         16 | pass | 27109017,17
nat div 8c     |         13 | pass | 27109017,17
nat gcd 0      |         59 | pass | 8
nat gcd 1      |        481 | pass | 1
nat gcd 2      |         25 | pass | 8888888
nat gcd 3      |        219 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
nat toull 0    |          6 | pass | 0
nat toull 1    |          7 | pass | 2000
nat toull 2    |       2005 | pass | exception thrown: overflow error
nat toull 3    |          8 | pass | 123456789a
nat toull 4    |       1990 | pass | exception thrown: overflow error
nat prn 0      |        855 | pass | 4701397401952099592073
nat prn 1      |        734 | pass | fedcfedc0123456789
nat prn 2      |        734 | pass | FEDCFEDC0123456789
nat prn 3      |        887 | pass | 775563766700044321263611
nat prn 4      |        855 | pass | 4701397401952099592073
nat prn 5      |        761 | pass | 0xfedcfedc0123456789
nat prn 6      |        762 | pass | 0XFEDCFEDC0123456789
nat prn 7      |        900 | pass | 0775563766700044321263611
int cons 0     |          4 | pass | 0
int cons 1     |          5 | pass | 123456789abc
int cons 2     |         24 | pass | 0
int cons 3     |        408 | pass | 3837439787487386792386728abcd88379dc
int cons 4     |       1028 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 5     |        216 | pass | 115415157637671751
int cons 6     |       4016 | pass | exception thrown: invalid digit
int cons 7     |          5 | pass | -123456789abc
int cons 8     |        414 | pass | -3837439787487386792386728abcd88379dc
int cons 9     |       1025 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
int cons 10    |        216 | pass | -115415157637671751
int cons 11    |       4094 | pass | exception thrown: invalid digit
int add 0      |         15 | pass | 73
int add 1      |         16 | pass | 21
int add 2      |         19 | pass | -34738957485741895748957485743809574800000000
int add 3      |         23 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
int sub 0      |         16 | pass | 50
int sub 1      |         28 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
int sub 2      |         22 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
int sub 3      |         16 | pass | -50
int comp 0a    |          6 | pass | 0
int comp 0b    |          6 | pass | 1
int comp 0c    |          6 | pass | 1
int comp 0d    |          6 | pass | 1
int comp 0e    |          6 | pass | 0
int comp 0f    |          6 | pass | 0
int comp 1a    |          4 | pass | 0
int comp 1b    |          5 | pass | 1
int comp 1c    |          5 | pass | 0
int comp 1d    |          4 | pass | 0
int comp 1e    |          5 | pass | 1
int comp 1f    |          4 | pass | 1
int comp 2a    |          4 | pass | 0
int comp 2b    |          4 | pass | 1
int comp 2c    |          4 | pass | 1
int comp 2d    |          4 | pass | 1
int comp 2e    |          5 | pass | 0
int comp 2f    |          4 | pass | 0
int comp 3a    |          8 | pass | 1
int comp 3b    |          8 | pass | 0
int comp 3c    |          7 | pass | 0
int comp 3d    |          8 | pass | 1
int comp 3e    |          8 | pass | 0
int comp 3f    |          7 | pass | 1
int lsh 0      |         14 | pass | 349f
int lsh 1      |         15 | pass | 693e
int lsh 2      |         15 | pass | d27c0000
int lsh 3      |         16 | pass | 1a4f80000000000000000000000000000000000000000000000
int lsh 4      |         26 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
int rsh 0      |         36 | pass | 23490000000000000000000000000000000000000000000000000000
int rsh 1      |         47 | pass | 11a48000000000000000000000000000000000000000000000000000
int rsh 2      |         44 | pass | 469200000000000000000000000000000000000000000000000
int rsh 3      |         34 | pass | 11a4800
int rsh 4      |         43 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
int mul 0      |         14 | pass | 66
int mul 1      |         24 | pass | -9999999999999999999000000000000000000
int mul 2      |         24 | pass | -8000000000000000000000000000000
int mul 2      |         24 | pass | -8000000000000000000000000000000
int div 0      |         89 | pass | 10,10
int div 1      |        303 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
int div 2      |        249 | pass | -ffffffffffffffff000000000000000,100000000000000000000000
int div 3      |       3363 | pass | exception thrown: divide by zero
int div 4      |         89 | pass | 10,10
int toll 0     |         12 | pass | 0
int toll 1     |         13 | pass | -3000
int toll 2     |       2006 | pass | exception thrown: overflow error
int toll 3     |         14 | pass | -12345678987654321
int toll 4     |       2016 | pass | exception thrown: overflow error
int prn 0      |        886 | pass | -4701397401952099592073
int prn 1      |        747 | pass | -fedcfedc0123456789
int prn 2      |        745 | pass | -FEDCFEDC0123456789
int prn 3      |        898 | pass | -775563766700044321263611
int prn 4      |        866 | pass | -4701397401952099592073
int prn 5      |        768 | pass | -0xfedcfedc0123456789
int prn 6      |        770 | pass | -0XFEDCFEDC0123456789
int prn 7      |        908 | pass | -0775563766700044321263611
rat cons 0     |         55 | pass | 0/1
rat cons 1     |         94 | pass | 8/3
rat cons 2     |         94 | pass | -101/3
rat cons 3     |        704 | pass | -19999837590318351965518515651585519655196/5
rat cons 4     |        930 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
rat cons 5     |        829 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
rat cons 6     |       5723 | pass | exception thrown: invalid digit
rat cons 7     |        217 | pass | 9/8
rat cons 8     |        179 | pass | -1/1048576
rat cons 9     |       2964 | pass | exception thrown: not a number
rat cons 10    |        234 | pass | ccccccccccccd/80000000000000
rat add 0      |        150 | pass | 73/3
rat add 1      |        194 | pass | 71/26
rat add 2      |        426 | pass | -34738957485741895748957485743809574800000000/287923
rat add 3      |        305 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
rat sub 0      |        155 | pass | 101/6
rat sub 1      |        358 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
rat sub 2      |        338 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
rat sub 3      |        176 | pass | -50/31459
rat comp 0a    |         31 | pass | 0
rat comp 0b    |         31 | pass | 1
rat comp 0c    |         31 | pass | 1
rat comp 0d    |         31 | pass | 1
rat comp 0e    |         31 | pass | 0
rat comp 0f    |         30 | pass | 0
rat comp 1a    |         28 | pass | 0
rat comp 1b    |         29 | pass | 1
rat comp 1c    |         31 | pass | 0
rat comp 1d    |         28 | pass | 0
rat comp 1e    |         28 | pass | 1
rat comp 1f    |         29 | pass | 1
rat comp 2a    |         31 | pass | 0
rat comp 2b    |         29 | pass | 1
rat comp 2c    |         29 | pass | 1
rat comp 2d    |         31 | pass | 1
rat comp 2e    |         31 | pass | 0
rat comp 2f    |         29 | pass | 0
rat comp 3a    |         34 | pass | 1
rat comp 3b    |         35 | pass | 0
rat comp 3c    |         35 | pass | 0
rat comp 3d    |         34 | pass | 1
rat comp 3e    |         35 | pass | 0
rat comp 3f    |         35 | pass | 1
rat mul 0      |        108 | pass | 1/1250
rat mul 1      |        183 | pass | -1111111111111111111000000000000000000/777
rat mul 2      |        169 | pass | -4000000000000000000000000000000/1
rat mul 3      |        647 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
rat div 0      |        211 | pass | 1000000000000000000/99999999999999999
rat div 1      |       1271 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
rat div 2      |       3124 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
rat div 3      |       3167 | pass | exception thrown: divide by zero
rat div 4      |       1709 | pass | 28279753000000000000000000/2392375827899999976076241721
rat todouble 0 |         11 | pass | 0
rat todouble 1 |         62 | pass | -50.8475
rat todouble 2 |        114 | pass | 1.23038e+50
rat todouble 3 |        107 | pass | 0.1
rat todouble 4 |       3437 | pass | exception thrown: overflow error
rat toparts 0  |          7 | pass | 0,1
rat toparts 1  |          8 | pass | -1500,29
rat prn 0      |       1082 | pass | -4701397401952099592073/65689
rat prn 1      |        960 | pass | -fedcfedc0123456789/10099
rat prn 2      |        960 | pass | -FEDCFEDC0123456789/10099
rat prn 3      |       1158 | pass | -775563766700044321263611/200231
rat prn 4      |       1080 | pass | -4701397401952099592073/65689
rat prn 5      |       1014 | pass | -0xfedcfedc0123456789/0x10099
rat prn 6      |       1012 | pass | -0XFEDCFEDC0123456789/0X10099
rat prn 7      |       1183 | pass | -0775563766700044321263611/0200231
```

