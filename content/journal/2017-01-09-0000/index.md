---
title: "c8: Implementing integers"
date: 2017-01-09T00:00:00+00:00
description: "c8: Implementing integers."
---
The first few commits started with handling natural numbers.  Today brings in integers.

Integers are built on top of the natural numbers, but have a "negative" flag that allows them to express
negative quantities too.  The code is actually very simple as a consequence of delegating all of the numeric
operations to an embedded natural number.  This same approach will also be used to introduce rational and
real numbers later.

## Delegation, not inheritance

The choice of delegation over inheritance is important.  While number classes might look like they're very
similar, in practice each type of number has subtly different semantics.  As an example the subtract operator
for natural numbers cannot be used to express values that would be less than zero, and thus throws an exception
if a result would be less than zero.  With integers there are no exceptions, and so there's a subtle difference
in the semantics.  As more complex number classes are added then the semantics vary more wildly (e.g. rational
numbers will be expressed as a ratio of an integer and a natural number).

