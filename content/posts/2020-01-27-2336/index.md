---
title: "The joys of HTML and CSS"
date: 2020-01-27T23:36:00+00:00
description: "The original HTML and CSS I picked for this site weren't quite as clean as I'd hoped, so they needed cleaning up"
tags: [Hugo, HTML, CSS, Software development]
---
When I decided to create this site, one of the main things I wanted to do was keep the blog as something of a journal.
I've tried this in the past when I was writing a C++ library, [C8](http://github.com/hashingitcom/c8/wiki/Dev-Notes) and it
was an interesting experience.

While my earlier efforts related to something a little more complex, one of the reasons I found the exercise interesting
was that it would allow me, and others, to come back and review what I did and why.  Looking back nearly 3 years on from
that previous experiment I realised there was a lot of interesting detail that wouldn't be at all obvious from the Git
commits.

Unlike C++, my HTML and CSS skills are pretty limited, but I found myself applying lessons learned in other software
development to keep my future self sane.

## Names matter

The names of things really matter.  We want them to make sense and not be surprising.  The original theme files I'd
picked up had some rather odd names.  For example the `<head>` tag had a partial HTML snippet file called `header.html`
while the HTML header was called `head.html`.  These are things that confused me over the last couple of days and would
have done so again.  They weren't big sources of confusion, but every incremental time would have been more time wasted for
mee.  More importantly, they'd have been an incremental source of confusion to anyone else who read the code for this site.

## Good source code is as simple as possible

I've seen too many examples of source code being made very dense in the apparent interests of simplification, but all
too often I see pointless refactoring.  Sometimes it's ok to just copy 2 or 3 lines of code to make it easy to
read things all in one place.  Sometimes it's better to make the CSS match up with the HTML structure, even if that
leads to a little duplication, as that can make it easier to work out how those things line up together.

## Great source code is consistent

One of the things that's most frustrating to me is lack of consistency.  Doing the same thing in different ways just
makes it harder for everyone who comes after you.  Future readers will wonder what makes one different to the other and
worry about what they've not understood.  Left unchecked this creates islands of code that maintainers don't want to
touch in case they didn't fully get it.

## Self documenting code completely misses the point of comments

This also brings me to a rant about commenting of code.  There's a school of thought that "self documenting" code is
possible, but I'd argue that that's ridiculous.  How do we tell the difference between buggy code and correct code?  How
do we tell our future selves about things that we shouldn't do because they don't work well?  How do we hint at things
that might want to happen in the future?  There are certainly bad comments; those that don't match up with the code, or
just describe obvious syntactic characteristics, but good comments explain why the code is the way it's written!

## Source code needs to be written for people

So, this brings me to the point that I wish more software developers thought about.

The objective of writing good source code isn't just for a compiler or interpreter - it's for the benefit of future
maintainers.  Those people are going to need a lot more hints and help.  They not only need to know what you
wanted the code to do now, but also how it might need to be modified by the time they're looking at it.

Thing's aren't done when the machine in front of you gets it right, they're done when the next developer who needs
to alter something is able to get it right too.
