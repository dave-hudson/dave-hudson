---
title: "c8: More improvements"
date: 2017-02-01T00:00:00+00:00
description: "c8: Supporting conversions to C++ native types."
---
## Making Things Consistent

Some of the operators weren't implemented in a way that was really consistent with C++ norms.  For example the
+= operator had a `void` return type.  This was something of an oversight so I corrected this!

## More Performance Tweaking

We've seen quite a lot of incremental improvements over the last couple of weeks, but it still seems like there's
a lot of unnecessary copying happening.  One easy way to check for this is to instrument calls to the copy
constructors in the various object classes and see if the copy operations are actually necessary or not.

In the case of the `c8::natural` class it turned out that there were several places in which copy operations
could be replaced with move operations instead.  This is an area that I find a little frustrating with C++,
because naive code can end up slow without realizing it, and is compounded by the compiler often inlining the
offending code so it's harder to spot.

One thing that is also becoming clear, however, is that the performance measurements in the unit tests aren't
actually good enough for our purposes.  The results are far too variable and that makes it very hard to reason
about the impact of changes.  This will need to be addressed shortly!

