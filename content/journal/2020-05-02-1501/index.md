---
title: "Database design reading"
date: 2020-05-02T15:01:00+00:00
description: "Some reading on the subject of databases"
---
I ran across a researcher called Daniel Lemire who has a really interesting blog about performance at
[lemire.me](http://lemire.me).  The blog is great and also has some really good advice about writing good papers.

This led me to read his paper [A Call to Arms: Revisiting Database Design](../../../elements/research-resources/2011-11-call-to-arms.pdf)
in which he and Antonio Badia argue that we need to think about database design in a very different way.  Rather
than using normalised RDBMS principles, we need something that meets the needs of people who are not trained to
handle this formal model.

This feels like an important concept.  Programmers design schemas because we're used to thinking about how we
organise things, but even we're not very good at dealing with the implications of versioning.

This is also leading me to a bunch of Pat Helland's papers.  Some of these I've read before but had lost track of,
especially [Immutability Changes Everything](../../../elements/research-resources/2015-01-immutability-changes-everything.pdf).
