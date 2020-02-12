---
title: "The inevitable battle between the light side and the dark side... of this site"
date: 2020-02-11T23:59:00+00:00
description: "I really wanted to add a dark/light mode toggle to this site.  It couldn't be that difficult, could it?  One of these days I'll learn.  I did learn more about Hugo though, fixed a lot of bugs, and made things work a little better."
tags: [Hugo, Dark Mode, Light Mode]
---
Recently, lots of platforms have added support for "Dark Mode".  Some of us are old enough to remember that there never
used to be any such thing as "Light Mode" but I guess green screen terminals are a thing of the past.  Anyway, I'd
always set up this site to have light and dark mode CSS files, but there was no easy way to switch between them.  I wanted
to fix that.

It turns out the remnants of my original theme decided to trip me up again.  After many hours I rewrote the way the
social icons work in the header, and then added a sun and moon (it seems HTML5 and I disagree about the rendering of
SVG tags inside A tags inside lists).

For the light/dark mode, there's some new Javascript code that ensures that only one of the sun and moon are actually
visible at any one time (the sun puts the site in light mode, the moon puts it in dark mode).

While I was at this I found and fixed some quirks in the HTML and CSS.  I also spent a little more time getting the Hugo
templates working more cleanly.  I really disliked the way that some templates did 2 different things.

Still work in progress, but it's starting to feel like something I might admit to having developed :-)
