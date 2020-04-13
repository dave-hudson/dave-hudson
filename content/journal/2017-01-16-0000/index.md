---
title: "c8: Rational numbers and floating point"
date: 2017-01-16T00:00:00+00:00
description: "c8: Rational numbers and floating point."
---
## Rational numbers and floating point

Rational numbers can represent any of the floating point numbers that we can represent in C++ (single, or double),
although they may be a little large.  The advantage is that rationals don't have to lose precision in subsequent
calculations, but there are a couple of problems.

The first problem is that rational numbers will typically be larger than floating point, but this isn't a major
concern right now.  The second, more significant, problem is that floating point numbers are often not particularly
good approximations to more interesting rational numbers.

If we consider, say, the rational 1/10 (0.1) then there's no way to accurately represent it with a conventional
power-of-2-based floating point number.  We end up with a representation that is close, but not quite the same.
The IEEE754 double precision form of 0.1 is actually closer to 0.1000000000000000055511151231257827021181583404541015625,
encoded as 0x3fb999999999999a.  When we convert this to a rational we get 0x1999999999999a/0x100000000000000, and
this gets normalized to 0xccccccccccccd/0x80000000000000.

## Converting back to native forms

So far we've had code to convert native C++ data types to c8 forms, but we need to be able to convert things back
too.  Started this process with the `c8::isull()` and `c8::toull()` functions/methods for `c8::natural`.
`c8::isull()` checks if a conversion can be supported without a loss of precision, while `c8::toull()` does
the conversion, but throws a `c8::overflow_error` exception if there would be a loss of precision.  For integers
there is `c8::isll()` and `c8::toll()` that have similar behaviour.

The equivalent code for rationals isn't yet written but will provide `c8::isdouble()` and `c8::todouble()`.
These may need a little more thought in the long term, though, as doubles are only going to be an approximation
to rationals.

