---
title: "c8: Starting to understand performance"
date: 2017-01-20T00:00:00+00:00
description: "c8: Starting to understand performance."
---
I realized that the test apps were being built with dynamic linking so switched the builds to use static
linking.  Dynamically linked libraries use small stubs in a procedure linkage table (PLT) that sit between
callers and the actual code in the dynamic library; using static linking avoids this.

With these changes we can look at the performance characteristics of the natural number unit test:

```
cons 0     |        316 | pass | 0
cons 1     |       3608 | pass | 123456789abc
cons 2     |        928 | pass | 0
cons 3     |      17384 | pass | 3837439787487386792386728abcd88379dc
cons 4     |      44984 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |       8184 | pass | 115415157637671751
cons 6     |    5376327 | pass | exception thrown: invalid digit
cons 7     |       8976 | pass | 100000000000000000000000
count 0    |         92 | pass | 0
count 1    |         84 | pass | 64
count 2    |         56 | pass | 17
count 3    |         56 | pass | 185
add 0      |        132 | pass | 73
add 1      |        156 | pass | 42
add 2      |        464 | pass | 10000000000000001
add 3      |        239 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
sub 0      |        324 | pass | 50
sub 1      |        260 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |        412 | pass | 897
sub 3      |      20536 | pass | exception thrown: not a number
comp 0a    |       1054 | pass | 0
comp 0b    |        179 | pass | 1
comp 0c    |         94 | pass | 1
comp 0d    |         97 | pass | 1
comp 0e    |        109 | pass | 0
comp 0f    |         94 | pass | 0
comp 1a    |        106 | pass | 0
comp 1b    |        106 | pass | 1
comp 1c    |         60 | pass | 1
comp 1d    |         79 | pass | 1
comp 1e    |         79 | pass | 0
comp 1f    |         94 | pass | 0
comp 2a    |        121 | pass | 0
comp 2b    |        109 | pass | 1
comp 2c    |         94 | pass | 0
comp 2d    |         67 | pass | 0
comp 2e    |         48 | pass | 1
comp 2f    |         73 | pass | 1
comp 3a    |        166 | pass | 1
comp 3b    |        109 | pass | 0
comp 3c    |        100 | pass | 0
comp 3d    |         81 | pass | 1
comp 3e    |        103 | pass | 0
comp 3f    |         97 | pass | 1
lsh 0a     |        142 | pass | 349f
lsh 0b     |        551 | pass | 693e
lsh 0c     |        161 | pass | d27c0000
lsh 0d     |        312 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 1a     |        297 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0a     |        306 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 0b     |        560 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 0c     |        587 | pass | 469200000000000000000000000000000000000000000000000
rsh 0d     |        133 | pass | 11a4800
rsh 1a     |        206 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |        491 | pass | 66
mul 1      |        300 | pass | 9999999999999999999000000000000000000
mul 2      |        285 | pass | 8000000000000000000000000000000
mul 3      |       1165 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
div 0a     |       4955 | pass | 10
div 0b     |       4955 | pass | 10
div 1a     |      16107 | pass | 78292387927518758972102054472775487212767983201652300846
div 1b     |      16107 | pass | 35600667362958008
div 2a     |      11127 | pass | ffffffffffffffff000000000000000
div 2b     |      11127 | pass | 100000000000000000000000
div 3      |      28621 | pass | exception thrown: divide by zero
div 4a     |       4777 | pass | 100000
div 4b     |       4777 | pass | 0
gcd 0      |       7065 | pass | 8
gcd 1      |      43431 | pass | 1
gcd 2      |       1892 | pass | 8888888
gcd 3      |       7595 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |        233 | pass | 0
toull 1    |         57 | pass | 2000
toull 2    |      13288 | pass | exception thrown: overflow error
toull 3    |         91 | pass | 123456789a
toull 4    |       9148 | pass | exception thrown: overflow error
prn 0      |      47591 | pass | 4701397401952099592073
prn 1      |      38628 | pass | fedcfedc0123456789
prn 2      |      37245 | pass | FEDCFEDC0123456789
prn 3      |      51338 | pass | 775563766700044321263611
prn 4      |      46528 | pass | 4701397401952099592073
prn 5      |      38982 | pass | 0xfedcfedc0123456789
prn 6      |      37405 | pass | 0XFEDCFEDC0123456789
prn 7      |      51012 | pass | 0775563766700044321263611
```

For now we can ignore the constructor and print functions because both make heavy use of divide functions, and
the divide functionality is clearly pretty expensive!  This seems worth investigating.

The easiest way to do this is to write a simple test program and profile it.  The test program is `natural_perf`
in the test directory:

{{< highlight c >}}
/*
 * natural_dep.c
 */
#include <ctime>

#include <natural.h>

/*
 * Multiply test.
 */
auto multiply_test(const c8::natural &r1, const c8::natural &r2) -> c8::natural {
    return r1 / r2;
}

/*
 * Divide test.
 */
auto divide_test(const c8::natural &r1, const c8::natural &r2) -> c8::natural {
    return r1 / r2;
}

/*
 * Entry point.
 */
auto main(int argc, char **argv) -> int {
    c8::natural r1("4975847591750184768091681057471987491740875821075048278327409237823905");
    c8::natural r2("78405718571641225890105715801578107321");

    std::time_t t = std::time(nullptr);
    std::time_t s;

    do {
        for (int i = 0; i < 1000; i++) {
            multiply_test(r1, r2);
            divide_test(r1, r2);
        }

        s = std::time(nullptr);
    } while ((s - t) < 30);

    return 0;
}
{{< / highlight >}}

The test is relatively simple.  It's set to construct two natural numbers and then run repeated loops over
the multiply and divide functionality for 30 seconds.

We run it with the Linux `perf` tool thus:

`perf record ./test/natural_perf/natural_perf`

We can then use `perf report -n > out.txt` to generate a statistical analysis, with this being the first few
lines that result:

```
# To display the perf.data header info, please use --header/--header-only options.
#
#
# Total Lost Samples: 0
#
# Samples: 115K of event 'cycles'
# Event count (approx.): 109838236521
#
# Overhead       Samples  Command       Shared Object     Symbol                         
# ........  ............  ............  ................  ...............................
#
    16.67%         19293  natural_perf  natural_perf      [.] _int_malloc                
    15.51%         17949  natural_perf  natural_perf      [.] c8::natural::divide_modulus
    14.55%         16844  natural_perf  natural_perf      [.] c8::natural::multiply      
    14.21%         16454  natural_perf  natural_perf      [.] _int_free                  
    12.24%         14161  natural_perf  natural_perf      [.] malloc                     
     7.34%          8500  natural_perf  natural_perf      [.] c8::natural::shiftl        
     5.78%          6686  natural_perf  natural_perf      [.] free                       
     5.69%          6586  natural_perf  natural_perf      [.] c8::natural::subtract      
     3.12%          3607  natural_perf  natural_perf      [.] c8::natural::add           
     2.52%          2912  natural_perf  natural_perf      [.] operator new               
     0.82%           948  natural_perf  natural_perf      [.] c8::natural::shiftr        
     0.56%           645  natural_perf  natural_perf      [.] __memmove_avx_unaligned    
     0.41%           472  natural_perf  natural_perf      [.] c8::natural::divide        
     0.28%           328  natural_perf  natural_perf      [.] operator delete            
     0.13%           152  natural_perf  natural_perf      [.] main                       
     0.04%            52  natural_perf  natural_perf      [.] _init                      
```

As so often happens with profiler reports, the results aren't what we might have expected.  We might expect
that most of the work would go in computation, but we actually see a large amount spent in memory management:

```
    16.67%         19293  natural_perf  natural_perf      [.] _int_malloc                
    14.21%         16454  natural_perf  natural_perf      [.] _int_free                  
    12.24%         14161  natural_perf  natural_perf      [.] malloc                     
     5.78%          6686  natural_perf  natural_perf      [.] free                       
     2.52%          2912  natural_perf  natural_perf      [.] operator new               
     0.28%           328  natural_perf  natural_perf      [.] operator delete            
```

Memory management overheads account for more than 50% of our total CPU time!  If we want to make things run
faster then our starting point needs to be to understand why we're doing so many memory allocations and releases.

## Starting improvements

Having found that we're spending too much time on allocations it's time to look at the
`c8::natural::divide_modulus()` method and see what's going on.

The first problem was an unused temporary.  Fixed in commit
[5fd6c6d3c7bb584e9e2038b7eaf0667af7de69a7](https://github.com/hashingitcom/c8/commit/5fd6c6d3c7bb584e9e2038b7eaf0667af7de69a7).
This wasn't a huge performance loss, but a small one, nonetheless.

