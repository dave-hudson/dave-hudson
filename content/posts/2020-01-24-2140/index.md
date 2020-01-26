---
title: "Making this site work for real (AKA no more Git submodules)"
date: 2020-01-24T21:40:00+00:00
description: "I said I disliked Git submodules and they've not disappointed this time either.  Sometimes simpler really is better."
tags: [Hugo, Git, Git submodules, Complexity inversion]
---
So I think I typed too soon yesterday.  Git submodules may be tolerable to some people but after another hour wasted
on them today, it's time to admit defeat and find another path.  It turns out that putting the publication directory
at the same level as the source directory for this site is a far simpler way to make things work.  All it takes is
putting `../` in `publishDir` and we're ok :-)

And, with this, my disdain of Git submodules is renewed!  No matter how much I want them to be a good solution to any
problem they never really seem to be it.  This does leave me wondering just what type of problems they're the best solution
for?  Every time I think I might have found one, usually because someone else has suggested using them, there's a simpler
solution that just uses git normally and perhaps with a wrapper script.

I've seen and remarked on this sort of problem in the past.  Software developers love to add new modes and
complexities to simple designs, but don't pause to ask if they really should.  This leads to weird complexity inversions
in which complicated, fiddly, things end up being used to do simple tasks.  The complexity often means they do them
quite badly.

Anyway, that's a subject for another day.  I do, now, have a working site again and my sanity is restored.
