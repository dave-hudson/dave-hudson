---
title: "c8: Extending capabilities"
date: 2017-01-14T00:00:00+00:00
description: "c8: Extending capabilities."
---
One of the more interesting problems for this library is to try to work out what features are required in order
to build out each successive layer.  Adding rational numbers turns out to require a few extra features from the
integers and the natural numbers.

Part of the thinking behind each type of number was to use the simplest representation possible for each, and in
the case of natural numbers that means that the numerators need to be integers, but the denominators need only be
natural numbers.  It might be easy to have made both integers, but in a normalized form the denominators should
always be positive.

Normalization is an important as it's much easier to reason about numbers when they're in a standardized, simplest
possible form.  Having things in normalized forms also means that we end up doing less work in any future
calculations.

For rational numbers, part of normalizing them is to divide both the numerator and denominator by any common
factors (divisors), so this means adding code to find the greatest common divisor of two natural numbers.

