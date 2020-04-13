---
title: "c8: Improving the documentation"
date: 2017-05-01T00:00:00+00:00
description: "c8: Improving the documentation."
---
A few weeks ago I set up the first set of (incomplete) documentation pages.  The aim was to get something written
so that it might be possible to understand how the library was intended to be used, but it was pretty evident to
me that this wasn't anywhere near as polished as I'd been hoping.  Over the bank holiday (long) weekend I've been
trying to fix this!

This had a number of steps:

* Broke large documents into a more fine-grained form that documents each member function of a class separately.
  While this means there are a lot more documents it does also mean that each one tends to be more consistent
  with all the others.

* Improved the text to make each one easier to understand.

* Checked that each member function made sense.

This last step proved interesting.  Several member functions were not defined with the correct exception
annotations, but several were also set up to do deep copying where a const reference could be used instead.
These are now resolved.

