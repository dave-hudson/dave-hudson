---
title: "c8: Dropping the idea for real numbers"
date: 2017-01-15T00:00:00+00:00
description: "c8: Dropping the idea for real numbers."
---
Up until today I'd been planning to add some support for real numbers, or at least scalable floating-point-like
numbers that approximate real numbers.  That's no longer on the to-do list.

Real numbers aren't actually representable with the discrete mathematics available within a digital system.
The numbers that are representable are all equally representable as rational numbers.  In terms of what can
actually be represented, rationals are, in fact, a bigger set.

What this does mean is that rationals now gain much more significance than I'd originally expected.  It's
possible that I may want to build a more efficient form of scaled natural number instead.  It also suggests
that there should be functions to create rationals from floating point types, or to generate fixed-size floating
point values from rationals.  Similarly, though, there need to be functions to generate fixed-size integer
values from the natural and integer number types. 

