---
title: "Thoughts after reading Pat Helland's \"If You Have Too Much Data\" paper"
date: 2020-05-03T11:14:00+00:00
description: "More reading from Pat Helland"
---
Just read [If You Have Too Much Data, then 'Good Enough' Is Good Enough](../../../elements/research-resources/2011-06-too-much-data.pdf)
by Pat Helland.  His argument is that strong schemas were something we could afford in an era of single node computers
and the ability to formally normalise data, but that this is doomed to failure with large scale data sets and
distributed systems.

Somehow this feels quite intuitive.  We have small islands of coherent things within the world and then vast amounts
of unstructured "stuff".

It also feels like it matches the way I seen dynamic vs static typing.  In a purely dynamic language a variable can
represent anything.  In a strongly typed language we restrict things, but not as much as we like to pretend.  A C++
`int` could be 32 bits in size, say, but the odds are that it's being used to represent a value that might only be
allowed to be 0 to 99.  We've restricted some of the operations that can be performed on it, but nowhere near as much
as we want to.  If we're conscientious we might put runtime assertions or error checking around it but pretending we're
precise is self-delusion.

In practice, it feels like we want to start by assuming any discrete thing we see is a blob.  Blobs don't have an
interesting "type".  If we know something about what's in the blob (or we can work it out) then we might instead
determine some amount of structure within the blob.  In Helland's argument we might see lossy ETL activities, but
this feels like a cop-out.  Instead we should always be precise and have our derived form reference back to the original.
The data provenance is really important.
