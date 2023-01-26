---
layout: blog
title: Shooting in RAW vs jpeg – Exposure experiment
section: Blog
last_modified_at: 2014-09-29
categories:
- Photography
---

I was curious if there were any perceptible benefits of shooting in raw.  I
know it's a pretty well covered topic but I had some time on my hands and
wanted an excuse to play with lightroom.  Here’s the rundown of the experiment
I did to test the question.  I shot a photo in raw.  I made sure it started out
with an over-exposed portion.  I cropped it to just the part I wanted to
observe.  I exported it from lightroom so that I would have an jpeg copy.  I
then preformed the same operations on the raw copy and the jpeg copy:

<!--more-->

lower the highlight portions as much as lightroom would allow (it corresponded
with the over-exposed portion no longer being over-exposed) decrease the
exposure by 1/3 stop twice experiment notes:

jpeg quality was always kept at a 100 (the maximum possible).
The watermark got applied a 2nd time in the jpeg images.  This was the result
of carelessness on my part but it has no effect on the outcome.
Camera: Olympus OM-D E-M5
Lens: Olympus M.Zuiko 17mm f1.8
Settings: ISO 200, f/4.5, 1/400 sec
Here are the original images (raw on the left, jpeg on the right)

<a href="http://i.imgur.com/VZMvaWV.jpg"><img class="split" src="http://i.imgur.com/VZMvaWV.jpg" /></a><a href="http://i.imgur.com/smghIRP.jpg"><img class="split" src="http://i.imgur.com/smghIRP.jpg" /></a>

Here are the images after the highlight levels have been decreased (raw on the
left, jpeg on the right)

<a href="http://i.imgur.com/67Xmi3s.jpg"><img class="split" src="http://i.imgur.com/67Xmi3s.jpg" /></a><a href="http://i.imgur.com/UH4hTlD.jpg"><img class="split" src="http://i.imgur.com/UH4hTlD.jpg" /></a>

Note that we can start to see the effect of the lack of information in the
over-exposed portion of the jpeg image. It’s showing up as lacking in color
definition.

Here are the images after dropping by 1/3 stops twice

<a href="http://i.imgur.com/6wxazXZ.jpg"><img class="split" src="http://i.imgur.com/6wxazXZ.jpg"></a><a href="http://i.imgur.com/2Xp0Ewh.jpg"><img class="split" src="http://i.imgur.com/2Xp0Ewh.jpg" /></a>

This is where the result of fixing the over-exposure really highlights the
difference between raw and jpeg.

The reason this occurs is of course well understood. Raw images are the raw
sensor readings from the camera, jpeg images are stored as integer values
between 0 and 255. As a result, over-exposed jpeg images just have a lot of
pixels at 255 and raw images, for those same pixels, still have a lot of
differentiation between neighboring pixels that have been over-exposed. When no
efforts have been made to fix the over-exposure, both raw and jpeg display
those pixels at and intensity of 255. But when you reduce the intensity of the
highlights and also when you reduce the overall exposure, the raw image still
maintains the differentiation between neighboring pixels, but the jpeg image
only knows that they are all 255 and it still looks like a solid mass.

In the particular image I used, the over-exposure wasn’t as bad as it could
have been. This means that in the white area of her arm, the jpeg image was
able to capture some definition between neighboring pixels (maybe it stored
them as values very close to 255 rather than just bracketing them all as 255).
As a result, after attempting to fix the over-exposure, some information about
the freckles was preserved. If there was more contrast between the
non-over-exposed portion and the over-exposed areas, the jpeg image would have
had less differentiation and repairs wouldn’t have been possible.

Anyhow, I’ve always shot in raw just because it seemed cooler and other folks
did it too. After playing around with it and seeing what it means for fixing
exposure issues, I see why it is helpful.  If nothing else, it’s useful because
you can be lazier about getting your lighting right or, if you accidentally
screw the lighting up, the photo is easier to recover.
