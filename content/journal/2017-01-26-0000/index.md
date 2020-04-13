---
title: "c8: More performance improvements"
date: 2017-01-26T00:00:00+00:00
description: "c8: More performance improvements."
---
Looking at the natural number divide logic, I realized that there was some scope to improve performance by
avoiding too many computations using other natural number operations.  In some instances shifts and multiplies
could just be modified to shifts, while in others there was no reason to use adds and shifts when result digits
could be written directly.

It turns out that there was a nasty bug exposed by the attempts to improve performance, and that one of the unit
tests should have picked it up, but was set up with the wrong result.  All now fixed!

The new results for `./test/natural_check/natural_check -v` are:

```
cons 0     |        404 | pass | 0
cons 1     |       2312 | pass | 123456789abc
cons 2     |        976 | pass | 0
cons 3     |      17612 | pass | 3837439787487386792386728abcd88379dc
cons 4     |      44028 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |       7440 | pass | 115415157637671751
cons 6     |    5272401 | pass | exception thrown: invalid digit
cons 7     |       8360 | pass | 100000000000000000000000
count 0    |         84 | pass | 0
count 1    |         56 | pass | 64
count 2    |         56 | pass | 17
count 3    |         56 | pass | 185
add 0      |        184 | pass | 73
add 1      |        132 | pass | 42
add 2      |        468 | pass | 10000000000000001
add 3      |        251 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
sub 0      |        170 | pass | 50
sub 1      |        324 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |        379 | pass | 897
sub 3      |      17754 | pass | exception thrown: not a number
comp 0a    |        342 | pass | 0
comp 0b    |         97 | pass | 1
comp 0c    |         69 | pass | 1
comp 0d    |         76 | pass | 1
comp 0e    |         76 | pass | 0
comp 0f    |         57 | pass | 0
comp 1a    |         85 | pass | 0
comp 1b    |         88 | pass | 1
comp 1c    |         61 | pass | 1
comp 1d    |         61 | pass | 1
comp 1e    |         42 | pass | 0
comp 1f    |         42 | pass | 0
comp 2a    |        103 | pass | 0
comp 2b    |        103 | pass | 1
comp 2c    |         61 | pass | 0
comp 2d    |         42 | pass | 0
comp 2e    |         42 | pass | 1
comp 2f    |         42 | pass | 1
comp 3a    |        182 | pass | 1
comp 3b    |         97 | pass | 0
comp 3c    |         79 | pass | 0
comp 3d    |         60 | pass | 1
comp 3e    |         60 | pass | 0
comp 3f    |         79 | pass | 1
lsh 0a     |        130 | pass | 349f
lsh 0b     |        124 | pass | 693e
lsh 0c     |        115 | pass | d27c0000
lsh 0d     |        257 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 1a     |        302 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0a     |        303 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 0b     |        215 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 0c     |        212 | pass | 469200000000000000000000000000000000000000000000000
rsh 0d     |        133 | pass | 11a4800
rsh 1a     |        178 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |        203 | pass | 66
mul 1      |        239 | pass | 9999999999999999999000000000000000000
mul 2      |        196 | pass | 8000000000000000000000000000000
mul 3      |       1211 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |        288 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0a     |       3039 | pass | 10
div 0b     |       3039 | pass | 10
div 1a     |      10446 | pass | 78292387927518758972102054472775487212767983201652300846
div 1b     |      10446 | pass | 35600667362958008
div 2a     |       7434 | pass | ffffffffffffffff000000000000000
div 2b     |       7434 | pass | 100000000000000000000000
div 3      |      25854 | pass | exception thrown: divide by zero
div 4a     |       2906 | pass | 100000
div 4b     |       2906 | pass | 0
div 5a     |       3457 | pass | 10000000000000001000000000000000100000000
div 5b     |       3457 | pass | 0
gcd 0      |       5757 | pass | 8
gcd 1      |      31835 | pass | 1
gcd 2      |       1659 | pass | 8888888
gcd 3      |       6895 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |        103 | pass | 0
toull 1    |         97 | pass | 2000
toull 2    |      11254 | pass | exception thrown: overflow error
toull 3    |         91 | pass | 123456789a
toull 4    |       9577 | pass | exception thrown: overflow error
prn 0      |      35919 | pass | 4701397401952099592073
prn 1      |      27725 | pass | fedcfedc0123456789
prn 2      |      27416 | pass | FEDCFEDC0123456789
prn 3      |      37102 | pass | 775563766700044321263611
prn 4      |      34535 | pass | 4701397401952099592073
prn 5      |      27788 | pass | 0xfedcfedc0123456789
prn 6      |      27806 | pass | 0XFEDCFEDC0123456789
prn 7      |      36972 | pass | 0775563766700044321263611
```

The divides are taking about 60% of the time that they were doing.

The new profiler results are revealing:

```
#
# Overhead       Samples  Command       Shared Object     Symbol                                                                 
# ........  ............  ............  ................  .......................................................................
#
    17.42%         20620  natural_perf  natural_perf      [.] c8::natural::multiply                                              
    16.39%         19398  natural_perf  natural_perf      [.] c8::natural::divide_modulus                                        
    14.48%         17134  natural_perf  natural_perf      [.] _int_malloc                                                        
    12.49%         14786  natural_perf  natural_perf      [.] _int_free                                                          
     9.99%         11830  natural_perf  natural_perf      [.] malloc                                                             
     9.36%         11080  natural_perf  natural_perf      [.] c8::natural::shiftl                                                
     8.60%         10180  natural_perf  natural_perf      [.] c8::natural::subtract                                              
     5.20%          6155  natural_perf  natural_perf      [.] free                                                               
     2.32%          2752  natural_perf  natural_perf      [.] operator new                                                       
     1.30%          1533  natural_perf  natural_perf      [.] c8::natural::shiftr                                                
     1.08%          1270  natural_perf  natural_perf      [.] std::vector<unsigned int, std::allocator<unsigned int> >::operator=
     0.46%           548  natural_perf  natural_perf      [.] memcpy                                                             
     0.36%           421  natural_perf  natural_perf      [.] operator delete                                                    
     0.35%           410  natural_perf  natural_perf      [.] c8::natural::divide                                                
     0.06%            76  natural_perf  natural_perf      [.] main                                                               
     0.03%            36  natural_perf  [unknown]         [k] 0xffffffff810644aa                                                 
     0.02%            24  natural_perf  natural_perf      [.] c8::natural::~natural                                              
     0.01%            11  natural_perf  [unknown]         [k] 0xffffffff818391e0                                                 
     0.00%             5  natural_perf  natural_perf      [.] time                                                               
```

The memory allocation overheads are still very significant, but they're reduced from what we saw a few days ago.

