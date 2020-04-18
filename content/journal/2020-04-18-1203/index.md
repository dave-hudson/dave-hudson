---
title: "Software design complexity"
date: 2020-04-18T12:03:00+00:00
description: "What makes software complex?"
---
A couple of days ago I saw a [tweet](https://twitter.com/CarloPescio/status/1249985759127404546) from Carlo Pescio in
which he links to a draft article called ["Design, Coceptual Integrity, and Algorithmic Information Theory"](http://www.physicsofsoftware.com/uploads/9/8/5/4/9854624/design_conceptual_integrity_algorithmic_information_theory.pdf).

While compression is something I think about quite a lot, I'd not thought about the implications for the compression of
conceptual design.  Regularity, as expressed in terms of standard design patterns (such as the gang-of-four book),
lets us express more complex things with less information.

This has got me thinking about complexity when we reach the level of very large software stacks in which no one person
can ever hold the whole design in their head.  The implications are that we will almost inevitably see unecessary
complexity in the overall design as different parts are implemented by different teams and with different guiding
principles.

The move to microservices, and before that, microkernel operating systems, seems to be an implicit recognition of this
and attempts to hide implementation complexity in order to facilitate system comprehensibility.  Somehow, though,
this is really disappointing because it leaves us with poor implementations.  There's something inherently wrong here.

Are we on the wrong path with our current computational abstractions, or are we simply missing some important
tooling?
