---
title: "c8: Improving comparisons"
date: 2017-03-29T00:00:00+00:00
description: "c8: Improving comparisons."
---
The original approach to comparison operators was to have a single compare function and then compare the value
returned from it.  This has the advantage of being easy to implement, but the disadvantage that we can't easily
take early-outs in cases that might help.  Our compilers might do that for us, but there's no guarantee.

Instead, if we make these things explicit we get better performance, but also eliminate some abstractions that
aren't obviously useful.  The most noticeable examples are for the `==` and `!=` operators where many tests
simplify.  In the case of rational numbers these simplifications also avoid any arithmetic operations too.

