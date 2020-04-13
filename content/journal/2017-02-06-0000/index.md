---
title: "c8: Improving performance measurement"
date: 2017-02-06T00:00:00+00:00
description: "c8: Improving performance measurement."
---
Having already broken out each of the individual tests within the "check" test apps, we really need to be able
to get more reliable measurements.

The easiest way to do this is run each test multiple times, sort the results, and then take a value that's some
specific centile.  This approach lets us ingore larger numbers that are generated when kernel pre-emptions
occur, and also very small numbers that may result form atypical operational states.

This approach definitely improves the consistency of results, and having switched to `std::chrono` for timing we
now have results in ns.  Here is an example, from `rational_check -b -v`:

```
cons 0     |        430 | pass | 0/1
cons 1     |       1217 | pass | 8/3
cons 2     |       1232 | pass | -101/3
cons 3     |       2322 | pass | -19999837590318351965518515651585519655196/5
cons 4     |       2788 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
cons 5     |       1771 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
cons 6     |       4385 | pass | exception thrown: invalid digit
cons 7     |       1071 | pass | 9/8
cons 8     |        935 | pass | -1/1048576
cons 9     |       3033 | pass | exception thrown: not a number
cons 10    |       1634 | pass | ccccccccccccd/80000000000000
add 0      |       1268 | pass | 73/3
add 1      |       1958 | pass | 71/26
add 2      |       2757 | pass | -34738957485741895748957485743809574800000000/287923
add 3      |       2748 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
sub 0      |       1420 | pass | 101/6
sub 1      |       2886 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
sub 2      |       2786 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
sub 3      |       1825 | pass | -50/31459
comp 0a    |        235 | pass | 0
comp 0b    |        235 | pass | 1
comp 0c    |        235 | pass | 1
comp 0d    |        235 | pass | 1
comp 0e    |        235 | pass | 0
comp 0f    |        235 | pass | 0
comp 1a    |        240 | pass | 0
comp 1b    |        241 | pass | 1
comp 1c    |        241 | pass | 0
comp 1d    |        241 | pass | 0
comp 1e    |        241 | pass | 1
comp 1f    |        241 | pass | 1
comp 2a    |        241 | pass | 0
comp 2b    |        242 | pass | 1
comp 2c    |        243 | pass | 1
comp 2d    |        241 | pass | 1
comp 2e    |        242 | pass | 0
comp 2f    |        241 | pass | 0
comp 3a    |        249 | pass | 1
comp 3b    |        248 | pass | 0
comp 3c    |        249 | pass | 0
comp 3d    |        249 | pass | 1
comp 3e    |        249 | pass | 0
comp 3f    |        249 | pass | 1
mul 0      |        855 | pass | 1/1250
mul 1      |       1523 | pass | -1111111111111111111000000000000000000/777
mul 2      |        912 | pass | -4000000000000000000000000000000/1
mul 3      |       4829 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
div 0      |       1911 | pass | 1000000000000000000/99999999999999999
div 1      |       9323 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
div 2      |      13512 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
div 3      |       3568 | pass | exception thrown: divide by zero
div 4      |      10629 | pass | 28279753000000000000000000/2392375827899999976076241721
todouble 0 |         61 | pass | 0
todouble 1 |        455 | pass | -50.8475
todouble 2 |        523 | pass | 1.23038e+50
todouble 3 |        479 | pass | 0.1
todouble 4 |       3728 | pass | exception thrown: overflow error
toparts 0  |         70 | pass | 0,1
toparts 1  |         90 | pass | -1500,29
prn 0      |       1772 | pass | -4701397401952099592073/65689
prn 1      |       1546 | pass | -fedcfedc0123456789/10099
prn 2      |       1551 | pass | -FEDCFEDC0123456789/10099
prn 3      |       1921 | pass | -775563766700044321263611/200231
prn 4      |       1775 | pass | -4701397401952099592073/65689
prn 5      |       1590 | pass | -0xfedcfedc0123456789/0x10099
prn 6      |       1595 | pass | -0XFEDCFEDC0123456789/0X10099
prn 7      |       1942 | pass | -0775563766700044321263611/0200231
```

## More measurement inconsistencies

Even with the approach we've just taken there are still times where the results can end up quite different.
After a little thinking, however, the reason was quite obvious:  Turbo Boost!  More precisely, the problem is
actually power saving and performance boosting support.  The hardware in most modern high performance, or mobile,
CPUs is designed to allow the system to dynamically adjust operating voltages and frequencies to suit the
workload and the operating environment (e.g. use of batteries, or thermal issues).  In the worst cases we might
see results that are dramatically faster or slower than previous results.

One approach to this would be to try to set all benchmarks to run with all power saving and speed boosting
disabled, but this isn't always so easy to do.

Another approach is to try to ensure that each test is run after the CPU has been idle for 60 seconds,
essentially starting each test run under the same conditions.  This is more tricky than the alternative, because
we may see background processes perturbing things, but if we're careful then this will work.

## Reference results

Now that we've reworked the results it's worth documenting the latest results:

`natural_check -b -v`:

```
cons 0     |         63 | pass | 0
cons 1     |         74 | pass | 123456789abc
cons 2     |         56 | pass | 0
cons 3     |        530 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1331 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        279 | pass | 115415157637671751
cons 6     |       2802 | pass | exception thrown: invalid digit
cons 7     |        353 | pass | 100000000000000000000000
count 0    |         51 | pass | 0
count 1    |         52 | pass | 64
count 2    |         52 | pass | 17
count 3    |         52 | pass | 185
add 0      |         73 | pass | 73
add 1      |         72 | pass | 42
add 2      |         74 | pass | 10000000000000001
add 3      |         78 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
add 4      |         70 | pass | 55
add 5      |         71 | pass | 1000000000000000000000001
sub 0      |         73 | pass | 50
sub 1      |         81 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         84 | pass | 897
sub 3      |       2710 | pass | exception thrown: not a number
sub 4      |         76 | pass | 38
sub 5      |       2762 | pass | exception thrown: not a number
sub 6      |         53 | pass | 0
sub 7      |         74 | pass | ffffffffffffffffffffffff
comp 0a    |         52 | pass | 0
comp 0b    |         52 | pass | 1
comp 0c    |         52 | pass | 1
comp 0d    |         52 | pass | 1
comp 0e    |         52 | pass | 0
comp 0f    |         52 | pass | 0
comp 1a    |         52 | pass | 0
comp 1b    |         52 | pass | 1
comp 1c    |         52 | pass | 1
comp 1d    |         52 | pass | 1
comp 1e    |         52 | pass | 0
comp 1f    |         52 | pass | 0
comp 2a    |         52 | pass | 0
comp 2b    |         52 | pass | 1
comp 2c    |         52 | pass | 0
comp 2d    |         52 | pass | 0
comp 2e    |         52 | pass | 1
comp 2f    |         52 | pass | 1
comp 3a    |         53 | pass | 1
comp 3b    |         53 | pass | 0
comp 3c    |         53 | pass | 0
comp 3d    |         53 | pass | 1
comp 3e    |         53 | pass | 0
comp 3f    |         53 | pass | 1
lsh 0      |         73 | pass | 349f
lsh 1      |         74 | pass | 693e
lsh 2      |         74 | pass | d27c0000
lsh 3      |         73 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         79 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         75 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         75 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         75 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         71 | pass | 11a4800
rsh 4      |         78 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         80 | pass | 66
mul 1      |         90 | pass | 9999999999999999999000000000000000000
mul 2      |         90 | pass | 8000000000000000000000000000000
mul 3      |        230 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |         95 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0      |        443 | pass | 10,10
div 1      |       1305 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        841 | pass | ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       3574 | pass | exception thrown: divide by zero
div 4      |        448 | pass | 100000,0
div 5      |        480 | pass | 10000000000000001000000000000000100000000,0
div 6      |        623 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
gcd 0      |        838 | pass | 8
gcd 1      |       4919 | pass | 1
gcd 2      |        234 | pass | 8888888
gcd 3      |        714 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |         52 | pass | 0
toull 1    |         53 | pass | 2000
toull 2    |       2031 | pass | exception thrown: overflow error
toull 3    |         54 | pass | 123456789a
toull 4    |       2037 | pass | exception thrown: overflow error
prn 0      |       1413 | pass | 4701397401952099592073
prn 1      |       1204 | pass | fedcfedc0123456789
prn 2      |       1205 | pass | FEDCFEDC0123456789
prn 3      |       1485 | pass | 775563766700044321263611
prn 4      |       1420 | pass | 4701397401952099592073
prn 5      |       1196 | pass | 0xfedcfedc0123456789
prn 6      |       1196 | pass | 0XFEDCFEDC0123456789
prn 7      |       1495 | pass | 0775563766700044321263611
```

`integer_check -b -v`:

```
cons 0     |         68 | pass | 0
cons 1     |         73 | pass | 123456789abc
cons 2     |         59 | pass | 0
cons 3     |        571 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1394 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        320 | pass | 115415157637671751
cons 6     |       4088 | pass | exception thrown: invalid digit
cons 7     |         66 | pass | -123456789abc
cons 8     |        576 | pass | -3837439787487386792386728abcd88379dc
cons 9     |       1384 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 10    |        320 | pass | -115415157637671751
cons 11    |       4118 | pass | exception thrown: invalid digit
add 0      |         80 | pass | 73
add 1      |         83 | pass | 21
add 2      |         83 | pass | -34738957485741895748957485743809574800000000
add 3      |         84 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
sub 0      |         84 | pass | 50
sub 1      |         90 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         89 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
sub 3      |         82 | pass | -50
comp 0a    |         53 | pass | 0
comp 0b    |         54 | pass | 1
comp 0c    |         54 | pass | 1
comp 0d    |         54 | pass | 1
comp 0e    |         54 | pass | 0
comp 0f    |         54 | pass | 0
comp 1a    |         52 | pass | 0
comp 1b    |         52 | pass | 1
comp 1c    |         52 | pass | 0
comp 1d    |         52 | pass | 0
comp 1e    |         52 | pass | 1
comp 1f    |         52 | pass | 1
comp 2a    |         52 | pass | 0
comp 2b    |         51 | pass | 1
comp 2c    |         52 | pass | 1
comp 2d    |         52 | pass | 1
comp 2e    |         52 | pass | 0
comp 2f    |         52 | pass | 0
comp 3a    |         55 | pass | 1
comp 3b    |         55 | pass | 0
comp 3c    |         55 | pass | 0
comp 3d    |         55 | pass | 1
comp 3e    |         55 | pass | 0
comp 3f    |         55 | pass | 1
lsh 0      |         80 | pass | 349f
lsh 1      |         80 | pass | 693e
lsh 2      |         79 | pass | d27c0000
lsh 3      |         79 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         82 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         81 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         81 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         81 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         75 | pass | 11a4800
rsh 4      |         82 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         87 | pass | 66
mul 1      |         95 | pass | -9999999999999999999000000000000000000
mul 2      |         95 | pass | -8000000000000000000000000000000
mul 2      |         96 | pass | -8000000000000000000000000000000
div 0      |        687 | pass | 10,10
div 1      |       1537 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |       1110 | pass | -ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       4675 | pass | exception thrown: divide by zero
div 4      |        683 | pass | 10,10
toll 0     |         55 | pass | 0
toll 1     |         58 | pass | -3000
toll 2     |       1974 | pass | exception thrown: overflow error
toll 3     |         59 | pass | -12345678987654321
toll 4     |       2017 | pass | exception thrown: overflow error
prn 0      |       1557 | pass | -4701397401952099592073
prn 1      |       1251 | pass | -fedcfedc0123456789
prn 2      |       1226 | pass | -FEDCFEDC0123456789
prn 3      |       1512 | pass | -775563766700044321263611
prn 4      |       1437 | pass | -4701397401952099592073
prn 5      |       1252 | pass | -0xfedcfedc0123456789
prn 6      |       1252 | pass | -0XFEDCFEDC0123456789
prn 7      |       1528 | pass | -0775563766700044321263611
```

`rational_check -b -v`:

```
cons 0     |        430 | pass | 0/1
cons 1     |       1217 | pass | 8/3
cons 2     |       1232 | pass | -101/3
cons 3     |       2322 | pass | -19999837590318351965518515651585519655196/5
cons 4     |       2788 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
cons 5     |       1771 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
cons 6     |       4385 | pass | exception thrown: invalid digit
cons 7     |       1071 | pass | 9/8
cons 8     |        935 | pass | -1/1048576
cons 9     |       3033 | pass | exception thrown: not a number
cons 10    |       1634 | pass | ccccccccccccd/80000000000000
add 0      |       1268 | pass | 73/3
add 1      |       1958 | pass | 71/26
add 2      |       2757 | pass | -34738957485741895748957485743809574800000000/287923
add 3      |       2748 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
sub 0      |       1420 | pass | 101/6
sub 1      |       2886 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
sub 2      |       2786 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
sub 3      |       1825 | pass | -50/31459
comp 0a    |        235 | pass | 0
comp 0b    |        235 | pass | 1
comp 0c    |        235 | pass | 1
comp 0d    |        235 | pass | 1
comp 0e    |        235 | pass | 0
comp 0f    |        235 | pass | 0
comp 1a    |        240 | pass | 0
comp 1b    |        241 | pass | 1
comp 1c    |        241 | pass | 0
comp 1d    |        241 | pass | 0
comp 1e    |        241 | pass | 1
comp 1f    |        241 | pass | 1
comp 2a    |        241 | pass | 0
comp 2b    |        242 | pass | 1
comp 2c    |        243 | pass | 1
comp 2d    |        241 | pass | 1
comp 2e    |        242 | pass | 0
comp 2f    |        241 | pass | 0
comp 3a    |        249 | pass | 1
comp 3b    |        248 | pass | 0
comp 3c    |        249 | pass | 0
comp 3d    |        249 | pass | 1
comp 3e    |        249 | pass | 0
comp 3f    |        249 | pass | 1
mul 0      |        855 | pass | 1/1250
mul 1      |       1523 | pass | -1111111111111111111000000000000000000/777
mul 2      |        912 | pass | -4000000000000000000000000000000/1
mul 3      |       4829 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
div 0      |       1911 | pass | 1000000000000000000/99999999999999999
div 1      |       9323 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
div 2      |      13512 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
div 3      |       3568 | pass | exception thrown: divide by zero
div 4      |      10629 | pass | 28279753000000000000000000/2392375827899999976076241721
todouble 0 |         61 | pass | 0
todouble 1 |        455 | pass | -50.8475
todouble 2 |        523 | pass | 1.23038e+50
todouble 3 |        479 | pass | 0.1
todouble 4 |       3728 | pass | exception thrown: overflow error
toparts 0  |         70 | pass | 0,1
toparts 1  |         90 | pass | -1500,29
prn 0      |       1772 | pass | -4701397401952099592073/65689
prn 1      |       1546 | pass | -fedcfedc0123456789/10099
prn 2      |       1551 | pass | -FEDCFEDC0123456789/10099
prn 3      |       1921 | pass | -775563766700044321263611/200231
prn 4      |       1775 | pass | -4701397401952099592073/65689
prn 5      |       1590 | pass | -0xfedcfedc0123456789/0x10099
prn 6      |       1595 | pass | -0XFEDCFEDC0123456789/0X10099
prn 7      |       1942 | pass | -0775563766700044321263611/0200231
```

