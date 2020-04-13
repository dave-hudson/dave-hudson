---
title: "c8: Introducing digit arrays"
date: 2017-02-27T00:00:00+00:00
description: "c8: Introducing digit arrays."
---
While the C++ code has been written to be pretty fast, there's always an opportunity to make this sort of library
code go faster by making use of assembler code.  The problem is that building assembler support mixed in with the
object class operations is really difficult.

In order to get around this we really need the core of each numerical operation to be abstracted into a form
that's easier to optimize in the future.  The abstraction chosen is a digit array, where a digit array is an
array of `c8::natural_digit` values.  All of the `c8::natural` operations can be reworked in terms of these digit
arrays.

The use of digit arrays turns out to have quite a number of advantages:

* Where each `c8::natural` operation might use multiple digit array operations we can now avoid doing unnecessary
zero checks, exception checks, etc.  Instead we can do these all in one place per numeric operation.

* The inline operations can be much more efficient than making function calls, especially for something like the
`divide_modulus` operations.

* Many of our operators can actually use the same core digit array operations, reducing the amount of code
duplication, and improving our ability to optimize things.

The performance impact is substantial!

`natural_check -b -v`:

```
cons 0     |         62 | pass | 0
cons 1     |         50 | pass | 123456789abc
cons 2     |         55 | pass | 0
cons 3     |        465 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1191 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        256 | pass | 115415157637671751
cons 6     |       2516 | pass | exception thrown: invalid digit
cons 7     |        319 | pass | 100000000000000000000000
count 0    |         52 | pass | 0
count 1    |         61 | pass | 64
count 2    |         52 | pass | 17
count 3    |         50 | pass | 185
add 0      |         58 | pass | 73
add 1      |         58 | pass | 42
add 2      |         60 | pass | 10000000000000001
add 3      |         63 | pass | 98888880000000000000000000000000000000000000000000000000000001000000789
add 4      |         53 | pass | 55
add 5      |         55 | pass | 1000000000000000000000001
sub 0      |         56 | pass | 50
sub 1      |         64 | pass | 5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         75 | pass | 897
sub 3      |       1889 | pass | exception thrown: not a number
sub 4      |         54 | pass | 38
sub 5      |       1973 | pass | exception thrown: not a number
sub 6      |         54 | pass | 0
sub 7      |         58 | pass | ffffffffffffffffffffffff
comp 0a    |         51 | pass | 0
comp 0b    |         52 | pass | 1
comp 0c    |         51 | pass | 1
comp 0d    |         51 | pass | 1
comp 0e    |         51 | pass | 0
comp 0f    |         51 | pass | 0
comp 1a    |         51 | pass | 0
comp 1b    |         50 | pass | 1
comp 1c    |         50 | pass | 1
comp 1d    |         50 | pass | 1
comp 1e    |         51 | pass | 0
comp 1f    |         51 | pass | 0
comp 2a    |         49 | pass | 0
comp 2b    |         50 | pass | 1
comp 2c    |         50 | pass | 0
comp 2d    |         51 | pass | 0
comp 2e    |         51 | pass | 1
comp 2f    |         50 | pass | 1
comp 3a    |         52 | pass | 1
comp 3b    |         52 | pass | 0
comp 3c    |         52 | pass | 0
comp 3d    |         52 | pass | 1
comp 3e    |         52 | pass | 0
comp 3f    |         52 | pass | 1
lsh 0      |         56 | pass | 349f
lsh 1      |         58 | pass | 693e
lsh 2      |         58 | pass | d27c0000
lsh 3      |         58 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         68 | pass | 693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         55 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         62 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         62 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         54 | pass | 11a4800
rsh 4      |         62 | pass | d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         56 | pass | 66
mul 1      |         70 | pass | 9999999999999999999000000000000000000
mul 2      |         69 | pass | 8000000000000000000000000000000
mul 3      |        201 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100
mul 4      |         60 | pass | abcdef1200000000abcdef120000000abcdef1200000000
div 0      |        175 | pass | 10,10
div 1      |        423 | pass | 78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        347 | pass | ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       2601 | pass | exception thrown: divide by zero
div 4      |        151 | pass | 100000,0
div 5      |        154 | pass | 10000000000000001000000000000000100000000,0
div 6      |        253 | pass | 1000000000000000000000000ffffffff,ffffffffffffffff000000010000000000000000
gcd 0      |        136 | pass | 8
gcd 1      |        785 | pass | 1
gcd 2      |         85 | pass | 8888888
gcd 3      |        310 | pass | 20181732873032947492728336135378088830674353623374417329043358630878748833567
toull 0    |         52 | pass | 0
toull 1    |         53 | pass | 2000
toull 2    |       1843 | pass | exception thrown: overflow error
toull 3    |         53 | pass | 123456789a
toull 4    |       1877 | pass | exception thrown: overflow error
prn 0      |        880 | pass | 4701397401952099592073
prn 1      |        761 | pass | fedcfedc0123456789
prn 2      |        765 | pass | FEDCFEDC0123456789
prn 3      |        930 | pass | 775563766700044321263611
prn 4      |        881 | pass | 4701397401952099592073
prn 5      |        811 | pass | 0xfedcfedc0123456789
prn 6      |        796 | pass | 0XFEDCFEDC0123456789
prn 7      |        922 | pass | 0775563766700044321263611
```

`integer_check -b -v`:

```
cons 0     |         68 | pass | 0
cons 1     |         56 | pass | 123456789abc
cons 2     |         66 | pass | 0
cons 3     |        487 | pass | 3837439787487386792386728abcd88379dc
cons 4     |       1215 | pass | 3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 5     |        278 | pass | 115415157637671751
cons 6     |       3999 | pass | exception thrown: invalid digit
cons 7     |         52 | pass | -123456789abc
cons 8     |        496 | pass | -3837439787487386792386728abcd88379dc
cons 9     |       1224 | pass | -3897894117580750151618270927682762897697428275427542907478758957487582700682675349287325097
cons 10    |        284 | pass | -115415157637671751
cons 11    |       3980 | pass | exception thrown: invalid digit
add 0      |         68 | pass | 73
add 1      |         70 | pass | 21
add 2      |         69 | pass | -34738957485741895748957485743809574800000000
add 3      |         76 | pass | -98888880000000000000000000000000000000000000000000000000000001000000789
sub 0      |         70 | pass | 50
sub 1      |         80 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143
sub 2      |         73 | pass | 20000000000000000000000000000000000000000000000000000000000000000000000
sub 3      |         63 | pass | -50
comp 0a    |         52 | pass | 0
comp 0b    |         52 | pass | 1
comp 0c    |         52 | pass | 1
comp 0d    |         52 | pass | 1
comp 0e    |         52 | pass | 0
comp 0f    |         52 | pass | 0
comp 1a    |         51 | pass | 0
comp 1b    |         51 | pass | 1
comp 1c    |         51 | pass | 0
comp 1d    |         74 | pass | 0
comp 1e    |         75 | pass | 1
comp 1f    |         78 | pass | 1
comp 2a    |         51 | pass | 0
comp 2b    |         51 | pass | 1
comp 2c    |         49 | pass | 1
comp 2d    |         49 | pass | 1
comp 2e    |         50 | pass | 0
comp 2f    |         51 | pass | 0
comp 3a    |         53 | pass | 1
comp 3b    |         53 | pass | 0
comp 3c    |         53 | pass | 0
comp 3d    |         53 | pass | 1
comp 3e    |         53 | pass | 0
comp 3f    |         53 | pass | 1
lsh 0      |         65 | pass | 349f
lsh 1      |         69 | pass | 693e
lsh 2      |         69 | pass | d27c0000
lsh 3      |         71 | pass | 1a4f80000000000000000000000000000000000000000000000
lsh 4      |         74 | pass | -693e5306ea64730b5f79d306f250f30f13bffdffdd30ecf0d0ecf0ceceacac400000000000000000
rsh 0      |         64 | pass | 23490000000000000000000000000000000000000000000000000000
rsh 1      |         70 | pass | 11a48000000000000000000000000000000000000000000000000000
rsh 2      |         70 | pass | 469200000000000000000000000000000000000000000000000
rsh 3      |         61 | pass | 11a4800
rsh 4      |         70 | pass | -d27ca60dd4c8e616bef3a60de4a1e61e277ffbffba61d9e1a
mul 0      |         68 | pass | 66
mul 1      |         77 | pass | -9999999999999999999000000000000000000
mul 2      |         74 | pass | -8000000000000000000000000000000
mul 2      |         74 | pass | -8000000000000000000000000000000
div 0      |        185 | pass | 10,10
div 1      |        465 | pass | -78292387927518758972102054472775487212767983201652300846,35600667362958008
div 2      |        387 | pass | -ffffffffffffffff000000000000000,100000000000000000000000
div 3      |       3474 | pass | exception thrown: divide by zero
div 4      |        186 | pass | 10,10
toll 0     |         84 | pass | 0
toll 1     |         62 | pass | -3000
toll 2     |       2065 | pass | exception thrown: overflow error
toll 3     |         56 | pass | -12345678987654321
toll 4     |       2024 | pass | exception thrown: overflow error
prn 0      |        886 | pass | -4701397401952099592073
prn 1      |        765 | pass | -fedcfedc0123456789
prn 2      |        765 | pass | -FEDCFEDC0123456789
prn 3      |        915 | pass | -775563766700044321263611
prn 4      |        884 | pass | -4701397401952099592073
prn 5      |        787 | pass | -0xfedcfedc0123456789
prn 6      |        790 | pass | -0XFEDCFEDC0123456789
prn 7      |        932 | pass | -0775563766700044321263611
```

`rational_check -b -v`:

```
cons 0     |        137 | pass | 0/1
cons 1     |        187 | pass | 8/3
cons 2     |        185 | pass | -101/3
cons 3     |        842 | pass | -19999837590318351965518515651585519655196/5
cons 4     |       1063 | pass | 2/5154875894574578457805710875418754097512875120572105234652346059
cons 5     |       1094 | pass | 0x1/0x1000000000000000000000000000000000000000000000000000000000000000
cons 6     |       4195 | pass | exception thrown: invalid digit
cons 7     |        318 | pass | 9/8
cons 8     |        263 | pass | -1/1048576
cons 9     |       2762 | pass | exception thrown: not a number
cons 10    |        326 | pass | ccccccccccccd/80000000000000
add 0      |        222 | pass | 73/3
add 1      |        294 | pass | 71/26
add 2      |        617 | pass | -34738957485741895748957485743809574800000000/287923
add 3      |        447 | pass | -192222213333333333333333333333333333333333333333333333333333334333416153/31
sub 0      |        241 | pass | 101/6
sub 1      |        494 | pass | -5872488729698595999749602411500766185722239445613509099777952305512191704320129156897500143/3
sub 2      |        477 | pass | 1020000000000000000000000000000000000000000000000000000000000000000000000/707
sub 3      |        279 | pass | -50/31459
comp 0a    |         85 | pass | 0
comp 0b    |         85 | pass | 1
comp 0c    |         85 | pass | 1
comp 0d    |         85 | pass | 1
comp 0e    |         85 | pass | 0
comp 0f    |         85 | pass | 0
comp 1a    |         84 | pass | 0
comp 1b    |         85 | pass | 1
comp 1c    |         85 | pass | 0
comp 1d    |         85 | pass | 0
comp 1e    |         85 | pass | 1
comp 1f    |         85 | pass | 1
comp 2a    |         85 | pass | 0
comp 2b    |         86 | pass | 1
comp 2c    |         85 | pass | 1
comp 2d    |         85 | pass | 1
comp 2e    |         84 | pass | 0
comp 2f    |         85 | pass | 0
comp 3a    |         90 | pass | 1
comp 3b    |         89 | pass | 0
comp 3c    |         88 | pass | 0
comp 3d    |         89 | pass | 1
comp 3e    |         88 | pass | 0
comp 3f    |         89 | pass | 1
mul 0      |        172 | pass | 1/1250
mul 1      |        263 | pass | -1111111111111111111000000000000000000/777
mul 2      |        242 | pass | -4000000000000000000000000000000/1
mul 3      |        938 | pass | 15241578753238836750495351562566681945008382873376009755225118122311263526910001371743100137174310012193273126047859425087639153757049236500533455762536198787501905199875019052100/169
div 0      |        334 | pass | 1000000000000000000/99999999999999999
div 1      |       1783 | pass | -7829238792751875818917817519758789749174743847389742871867617465710657162/99999999999999999
div 2      |       4015 | pass | -17000000000000000000000000000000000000000000000000000000000000000/8a851921000000008a851921000000008a851921
div 3      |       3268 | pass | exception thrown: divide by zero
div 4      |       2298 | pass | 28279753000000000000000000/2392375827899999976076241721
todouble 0 |         54 | pass | 0
todouble 1 |         98 | pass | -50.8475
todouble 2 |        163 | pass | 1.23038e+50
todouble 3 |        160 | pass | 0.1
todouble 4 |       3207 | pass | exception thrown: overflow error
toparts 0  |         54 | pass | 0,1
toparts 1  |         54 | pass | -1500,29
prn 0      |       1128 | pass | -4701397401952099592073/65689
prn 1      |       1003 | pass | -fedcfedc0123456789/10099
prn 2      |        988 | pass | -FEDCFEDC0123456789/10099
prn 3      |       1185 | pass | -775563766700044321263611/200231
prn 4      |       1132 | pass | -4701397401952099592073/65689
prn 5      |       1055 | pass | -0xfedcfedc0123456789/0x10099
prn 6      |       1035 | pass | -0XFEDCFEDC0123456789/0X10099
prn 7      |       1218 | pass | -0775563766700044321263611/0200231
```

## Profiling

Having made these changes it's interesting to see what impact they have on our profiler demo, `natural_perf`.
Here are the results from running `perf record natural_perf`:

```
# To display the perf.data header info, please use --header/--header-only options.
#
#
# Total Lost Samples: 0
#
# Samples: 115K of event 'cycles'
# Event count (approx.): 109365698497
#
# Overhead  Command       Shared Object      Symbol                           
# ........  ............  .................  .................................
#
    68.51%  natural_perf  natural_perf       [.] c8::natural::divide_modulus  
    28.78%  natural_perf  natural_perf       [.] c8::natural::operator*       
     2.09%  natural_perf  natural_perf       [.] c8::natural::operator/       
     0.49%  natural_perf  natural_perf       [.] main                         
     0.03%  natural_perf  [kernel.kallsyms]  [k] native_write_msr_safe        
     0.01%  natural_perf  natural_perf       [.] time                         
     0.01%  natural_perf  [kernel.kallsyms]  [k] apic_timer_interrupt         
     0.01%  natural_perf  [kernel.kallsyms]  [k] entry_SYSCALL_64_after_swapgs
     0.01%  natural_perf  [kernel.kallsyms]  [k] __hrtimer_run_queues         
     0.01%  natural_perf  [kernel.kallsyms]  [k] entry_SYSCALL_64             
```

The inlining of digit arrays has definitely had the right impact, so now we can look at the most interesting things that happen at an instruction level.

Here's the most interesting snippet from `divide_modulus`:

```
    0.18 :	  40384f:       mov    -0x8(%r11,%r9,4),%ecx
         :	            natural_double_digit d_hi_d = static_cast<natural_double_digit>(d_hi);
         :	            natural_double_digit d = static_cast<natural_double_digit>(d_hi_d << natural_digit_bits) + d_lo_d;
    0.02 :	  403854:       shl    $0x20,%rax
    0.42 :	  403858:       or     %rcx,%rax
         :	            natural_digit q = static_cast<natural_digit>(d / static_cast<natural_double_digit>(upper_div_digit));
    0.19 :	  40385b:       xor    %edx,%edx
    0.21 :	  40385d:       div    %rsi
   22.52 :	  403860:       mov    %rax,-0x240(%rbp)
    0.80 :	  403867:       test   %rdi,%rdi
    0.00 :	  40386a:       mov    $0x0,%r15d
    0.01 :	  403870:       je     403956 <c8::natural::divide_modulus(c8::natural const&) const+0x656>
    0.00 :	  403876:       mov    %rdi,%r11
    0.83 :	  403879:       test   %r13,%r13
         :	_ZN2c826multiply_digit_array_digitEPjPKjmj():
```

We can see the that move following the `div` instruction is taking 22.52% of the CPU time in this function.  That's really encouraging as that's the instruction that takes the latency of the `div` instruction.  It indicates that even if we could eliminate everything else we could not get much more than 4x the performance that we already have, and that 4x isn't possible because we must do multiply, subtract and compare operations.

The test divide operation divides an 8 digit value by a 4 digit one, so we require at least 4 digit-level divides per `c8::natural` divide (because we have 4 digits in our result).

