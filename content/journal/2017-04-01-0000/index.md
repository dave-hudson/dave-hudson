---
title: "c8: Explaining it all"
date: 2017-04-01T00:00:00+00:00
description: "c8: Explaining it all."
---
We really need some documentation; after all, without docs how will we know what the library can do, or how to
use it?  The problem is that we really want a couple of different types of documentation.  We'd like both offline
and online versions, with the online version hosted here on GitHub.

The easiest approach is to choose a source format that can serve both needs, and as GitHub uses markdown then
that's the obvious one to use.

The use of markdown means that we need a way to render the documentation offline, so the easiest approach is to
translate it to HTML.  To do this we use `pandoc`.

