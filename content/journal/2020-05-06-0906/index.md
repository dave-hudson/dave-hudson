---
title: "More musings from Pat Helland"
date: 2020-05-06T09:06:00+00:00
description: "More reading from Pat Helland"
---
I've just read [Life beyond Distributed Transactions: an Apostate's Opinion](../../../elements/research-resources/2007-01-cidr07p15.pdf).
This is another Pat Helland paper, in which he describes the problems of building distributed systems at extreme scales.

The most important part of this, to me, is that his view of scale doesn't allow for oversimplifications.  If we can't
prove that two things exist together in the same place then we can't rely on things that need them to be
together at the same place.  An infinity of weird things can happen.

I've been trying to find ways to convince people that they need to be designing for things to go wrong at all times.
Perhaps this is the paper to point them at in future?

His paper 8 years later, [Immutability Changes Everything](../../../elements/research-resources/2015-01-immutability-changes-everything.pdf)
recognises the problems of mutating state far more effectively but doesn't describe the distributed systems problems.  It
feels like these are really two halves of some bigger manifesto.
