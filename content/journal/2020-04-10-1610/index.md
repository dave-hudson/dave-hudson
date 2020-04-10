---
title: "Adding the \"Journal\" section to hashingit.com"
date: 2020-04-10T16:10:00+00:00
description: "I wanted this site to work as a journal as well as a more traditional blog site."
---
When I created this site I was thinking that it would be a fairly traditional blog site, but had always intended
to capture my work in progress too.  I could have done that in the blog posts, but that risked diluting their value.
The blog posts should really represent carefully curated work.

To this end I've now created the "[Journal]({{< relref "journal" >}})" area.  This is a space to drop notes as I go.

## Updates to the hashingit.com site

In order to add the Journal area I've tweaked the order of the top-level nav so it goes from most authoritative to
least (Elements, Blog, Journal).  Also realised that some of the CSS formatting for the site was quite obscure
because it was using semi-global overrides for a number of different pages and that made things harder to reason
about when editing the structure.  While there's a little more duplication, it's easier to maintain.

The other thing I discovered was that on my newly-built Ubuntu 19.10 system, some of the pages would horizontally
shift for no obviously good reason.  Turns out this was due to vertical scroll bars being present on some pages and not
others.  This got fixed by adding:

```diff
+html {
+    margin-left: calc(100vw - 100%);
+    margin-right: 0;
+}
+
```
