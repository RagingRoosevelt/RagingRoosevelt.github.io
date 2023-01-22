---
layout: blog
title: Procedural All-Color Images
section: Blog
last_modified_at: 2016-12-28
tags:
  - post:tags=tag
  - post:type=python
categories:
  - Python
  - cv2
---

[Project Github link](https://github.com/RagingRoosevelt/allRGBImages)

A few years ago I ran into the [allRGB](https://allrgb.com/) contest.  The gist
of allRGB is to design a procedure for producing images with every single RGB
color used exactly once.  Since then I've had ideas simmering on the backburner
as I thought about how I would approach the problem.

I settled on populating my images using a modified
[2D random walk][random_walk] in which I can move in any of the cardinal
directions to any unvisited neighbor.  At each step of the walk, I select the
next color in sequence for placement. If the random walk ever gets trapped (all
four cardinal neighbors have already been visited), then I search for the
closest unvisited pixel. This approach, as I had it implemented, produces
images that pretty consistantly look like this

[random_walk]: https://en.wikipedia.org/wiki/Random_walk

<!--more-->

<a href="http://i.imgur.com/uCpPQHl.png"><img class="full" src="http://i.imgur.com/uCpPQHl.png" /></a>

The clustering bottom right is caused by my approach to teleportation.
Currently, the search for the nearest neighbor begins in the bottom right and
searches in a square of a given radius around the pixel.  Until an empty
neighbor is found, the radius of search is increased.  I moved to this approach
when teleporting from maintaining a list of all unused pixels and randomly
picking one for two reasons.  First, the list of all unused pixels approach
caused pretty significant slowdown when needing to add or remove elements and
when picking a random element (using the random.choice method).  Second, I
wanted a more cohesive image and teleporting to far away regions broke up color
regions.  When I moved to nearest-unvisited-neighbor teleports, the cohesion of
the image improved a lot.

Color advancement is handeled with an approach best described by the following
for loop:

    for red = 255 to 0 by red -= k
        green = 255 to 0 by green -= k
            blue = 255 to 0 by blue -= k
                use reggreenblue

By adjusting the value of `k`, I can more quickly cover the full range of rgb
colors (even if I don't hit quite all colors).  This is useful in both for
testing and in case I want to use the procedure to fill in colors on an image
smaller than 255^3 and produce results visually similar to a full-sized allRGB
image.

Although it's not compatible with the origional allRGB contest, I think it
might be adventageous to try a HSV color space rather than RGB.  Using this
approach provides, I think, a more natural way to think about moving within the
color space when picking colors to place in the image.

I'll post a new entry once I get the improvements to nearest neighbor searching
implemented and perhaps also once I get HSV implemented.
