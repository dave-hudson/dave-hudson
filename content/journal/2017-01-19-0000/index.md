---
title: "c8: Supporting conversions to C++ native types"
date: 2017-01-19T00:00:00+00:00
description: "c8: Supporting conversions to C++ native types."
---
In my last update I had introduced the function `c8::toull()` to convert a natural number to an unsigned long
long, and `c8::toll()` to convert an integer to a long long.  Today I've added `c8:todouble()` to convert a
rational to a double.  This means that all 3 types now have a means of converting in and out of C++ native types.

In my previous update I had added `c8::isull()` and `c8::isll()` too, but I've now removed them.  Implementing
the matching `c8::isdouble()` would have been almost impossible as it would have had to do all of the same work
as `c8::todouble()`, but the more I've thought about it, the more I've realized that they merely encouraged an
imperative approach, and one of my aims was to design the c8 library to support functional-style programming as
much as possible.  I also realized that it was pretty trivial to implement their functionality in user code
anyway (just compare against a pre-defined constant).

## What's in a name?

Having started at the `todouble()`, `toll()` and `toull()` style of names for a while I've also decided that
the C++ standard naming is better.  These have become `to_double()`, `to_long_long()`, `to_unsigned_long_long()`.
Yes these are longer, and yes they take a little more space, but they're also much more obvious, and yes I don't
like `CamelCaseNames` in C++ :-)

