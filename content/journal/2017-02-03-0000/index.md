---
title: "c8: Overhauling unit tests"
date: 2017-02-03T00:00:00+00:00
description: "c8: Overhauling unit tests."
---
As part of the efforts to get timings in unit tests more consistent the tests needed restructuring into a new
format.  The easiest way to do this was to change each of the tests so that they no longer handled their own
output reporting, and instead returned this back to their caller for reporting.  This will let the caller invoke
each test multiple times and generate better statistics (although the callers don't yet do this).

In addition it seemed like it would be better to drop the inline assembler code used for instruction-level
timings and instead use the `std::chrono` capabilities.  This has the effect of making new test results
different to what we've seen so far, but we'll establish a new baseline and start from there.  The good news is
that any new results will be times in ns and not clock cycles.

