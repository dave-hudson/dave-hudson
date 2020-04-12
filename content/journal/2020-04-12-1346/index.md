---
title: "Compression and big numbers"
date: 2020-04-12T13:46:00+00:00
description: "Turing machines have got me thinking about compression and big numbers again."
---
A few years ago I was thinking about big numbers and the nature of symbols.  Reading
[Alan Turing's 1936 paper on computable numbers](../../../elements/research-resources/1936-11-12-turing.pdf) got
me thinking about the nature of symbols again.

Conventional computer architectures invariably work in terms of machine words regardless of efficiency, yet compression
schemes generally ignore such things in order to pack more into less.  Bignums do the same, of course, although they
do tend to use machine words for efficiency reasons.

This got me thinking about compression.  A perfect compression scheme is invariably going to be a custom program that
produces the original data as its output.  In an idealised world I wonder how small such programs might be?

Along these lines, data just feels a bit passive.  Compressed data is something that needs to be computationally unpacked
in order to do anything useful with it.  It also occurs to me that bignums can be compressed this way too.  Not all bignums,
of course, but something like 2^1024 can be represented as 1 << 1024.
