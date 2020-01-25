---
title: "Making this site work for real (AKA no more Git submodules)"
date: 2020-01-24T21:40:00+00:00
description: "I said I disliked Git submodules and this is why"
tags: [Hugo, Git, Git submodules]
---
So I think I typed too soon yesterday.  Git submodules may be tolerable to some people but after another hour wasted
on them today it's time to admit defeat and find another path.  It turns out that putting the publication directory
at the same level as the source directory for this site then it's easy make things work.  All it takes is putting `../`
in `publishDir` and we're ok :-)

So, yes, my disdain of Git submodules is renewed - although that may just be confirmation bias!  I do, however, have
a working site again and my sanity is restored.
