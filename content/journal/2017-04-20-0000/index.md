---
title: "c8: Finishing the memory changes"
date: 2017-04-20T00:00:00+00:00
description: "c8: Finishing the memory changes."
---
Yesterday's changes prepared for replacing the "naked" memory management operations `new` and `delete`, and today
they were actually removed.  Aside from being better stylistically, the change actually makes it much easier to
build the code so that it is always correct.  `std::unique_ptr<>` requires that data be moved, rather than copied,
whereas this required more careful analysis to do this with naked pointers.

## Valgrind Headaches ##

Having made a change to the memory management code it's always useful to run `valgrind`.  This should have been
trivial but actually turned out to be a real nuissance.

The first problem was that `valgrind` actually found a bug.  One of the changes yesterday was faulty and had to
be reverted.  The much bigger problem was that `valgrind` ended up reporting thousands of problems related to
uninitialized data, yet after looking at the code there were no instances where this was actually happening.

After some frustrating time spent on Google searches it turns out that valgrind wasn't happy analyzing the test
application because it was using static linking (as opposed to dynamic linking).  I added a comment to this
effect, but the app is still built statically by default because that keeps the benchmark numbers consistent.

