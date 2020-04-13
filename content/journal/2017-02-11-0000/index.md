---
title: "c8: Faster digit operations"
date: 2017-02-11T00:00:00+00:00
description: "c8: Faster digit operations."
---
Our memory allocation overheads dominate, and we'll deal with them shortly, but a quick scan through our profiler
data shows that we're spending time in other places too.

The function-level profiling doesn't reveal anything too interesting, but if we look at the individual functions
and the profiler annotations (at the assembler level) we can see two areas for immediate improvement in the
`c8::natural` class:

* The `normalize()` operations are generic, but the actual operations required to define the size of a function
output rarely require iterations.

* There are a lot of uses of the `digits_` array that can be replaced by using temporary pointers to the
`digits_` array directly, rather than indirectly.

This last option is a general performance optimization.  In general, any time we need a duplicate sub-expression
it's much better to do so explicitly, rather than to expect the compiler to find them for us.  All too often
compilers are limited in their ability to extract things that we might hope they would.  Even if the compiler
does do the right thing, though, we will never see worse readability or maintainability by explicitly extracting
sub-expressions.

