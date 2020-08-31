---
title: "orgblit: Starting a new project!"
date: 2020-08-31T14:45:00+00:00
description: "I've decided it's time to have some fun and start a new project"
---
I've always loved writing software, and the most fun software is the sort that solves a real problem.  I've got one
of those in my day job, so time to break out my editor and compiler!

I lead quite a large Engineering team of just over 80 people, spread over multiple locations.  Flexibility is really
important so sub-teams and people change quite a lot during the year.  There are plenty of tools that will draw org
charts, but most of them are drawing packages and so don't handle some of the other things I'd like to do in the long
term.  I'm sure there are HR tools that can do some of what I'd like, but I can't find a good open-source one.  As I
can't find what I want then it's time to write something.

The simplest problem I'd like to solve is to render org charts.  Hence the name "orgblit", short for organisation
blitter.  Things will get more interesting later!

## Initial requirements

It's pretty obvious what I want at the outset, but let's try and call this out more explicitly.

* As the leader of a large team, I want to be able to visualise the organisation structure in various ways,
  so I can get a better sense of how to lead and evolve it.

* As a user, I want source data to be in a form that's easily used by other applications (e.g. spreadsheets), so I
  want data files to be stored in comma-separated value (CSV) form.

* As a user, I don't want to install new client software, so all output must be able to be rendered by a web browser.

* As the leader of a large team, my team is quite large I have several layers of team leads who need their own more
  restricted view of the organisation, so the tool must be able to render subsets of the whole org

* As a user, I value accuracy, so the tool must identify errors in source information and provide easily-understood
  error messages.

## Initial design choice

I'm a die-hard C and C++ fan so let's just say this will be done in modern C++.  Yes, a python script could do the
early part of this quite easily, but I'm imagining adding more capabilities over time and I'm happier planning this in
C++.
