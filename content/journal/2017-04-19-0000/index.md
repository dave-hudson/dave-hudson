---
title: "c8: Improving memory management"
date: 2017-04-19T00:00:00+00:00
description: "c8: Improving memory management."
---
One of the things that I don't like about the current implementation is that it uses some "naked" `new` and
`delete` operators.  The implementation goes to some lengths to hide the use of `new` and `delete` so it's not
visible to users of the `c8` library, but any time we can do things right it will be better.

While the implementation was designed to be safe, it was actually a little problematic because it had a private
pointer that could change meaning.  If we were using the `small_digits_` array then the pointer would point to
that array, but if we weren't using `small_digits_` then the pointer would point to a heap-allocated block.
Double meanings are rarely a good idea!

The change today eliminates the double meaning, but is only a first step.  In general we'd like to see `new`
and `delete` removed from all modern C++ codebases, so the next change will probably replace these with
`std::make_unique`, and `std::unique_ptr`.

## Bug squashing

While debugging the revised code I wanted to run `valgrind`, and dropped the optimization from `-O2` to `-O1`.
Doing this exposed a segfault, that turned out to be a stack corruption.  Having found that I wanted to improve
unit test coverage and then found a couple of places where zero results weren't handled correctly.  Fixed all
of these!

