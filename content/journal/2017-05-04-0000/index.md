---
title: "c8: Simplifying things"
date: 2017-05-04T00:00:00+00:00
description: "c8: Simplifying things."
---
Up to this point the `c8::natural` class has been a little different to the integer and rational classes.  Unlike
the other two it has supported `c8::natural` and `c8::natural_digit` operands.  The thinking was that the
`c8::natural_digit` versions would be significantly quicker than the `c8::natural` variants.

While this approach might have been correct early on in the development cycle, it hasn't actually been correct
for some time.  The generic versions now handle special cases efficiently, and the overheads associated with
natural number construction have been dramatically reduced.  Removing the `c8::natural_digit` operations gives
us a design that's much cleaner because it avoids leaking something that was really intended to be in an internal
implementation detail.  The result is much easier to understand and use.

Having made this initial simplification, the naming of some of the digit array processing functions really needed
to change.  The new names reflect the numbers of digits of each source operand, and this sets the scene for even
more specialized versions to be added over time.

