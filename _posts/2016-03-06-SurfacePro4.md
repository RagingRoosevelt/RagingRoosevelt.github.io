---
layout: blog
title: Surface Pro 4 and Academic Note Taking
section: Blog
last_modified_at: 2016-03-06
categories: Musings
tags:
- Computers
---

### Background
I've been looking for a way to take digital notes for a while.  I started out
with an [Asus Transformer TF101][asus_link] and planned to use a
[capacitive stylus][stylus].  I quickly realized that stylus/tablet combo
didn't have the necessary precision and there really wasn't any good software
on android to handle something as precise as note taking.  Later, I moved on to
the [Nvidia Shield Tablet][nvidia_shield].  It suffered from the same problem
as the Transformer: not enough precision and no useful software.

[asus_link]: http://www.gsmarena.com/asus_transformer_tf101-3936.php
[stylus]: https://en.wikipedia.org/wiki/Capacitive_sensing#Pen_computing
[nvidia_shield]: https://en.wikipedia.org/wiki/Shield_Tablet

Anyhow, I was going to get a Thinkpad X1 Yoga until a friend suggested I check
out the SP4 and I was blown away.  In particular, the precision, accuracy, and
speed of the stylus was astounding.  I ended up getting the Core i5 / 8gb ram
256gb ssd variant.

<!--more-->

I've been using the desktop version of OneNote 2016 for taking notes, however,
I also wanted to do some more artistic stuff.  The problem that I ran into,
however, is that the stylus's pressure sensitivity features don't work in some
3rd-party programs (I had problems with Gimp, Inkscape, and Krita).

### Fixing Pressure Sensitivity
So there were two parts of getting the pressure sensitivity fixed: updating pen
drivers, updating C++ redistributables.  To update the pen drivers get the
[Wintab x64 from Microsoft][wintab].  Next we'll need several C++
redistributables: [x64 C++ 2010][2010], [x64 C++ 2012][2012],
[x64 C++ 2013][2013].  Make sure to get the 64bit versions of each.  From
there, if you're using Gimp, go to "Edit" &rArr; "Input Devices" &rArr;
"Microsoft device Stylus".  Change the mode to "Screen".  Do the same for
"Microsoft device Eraser" and "Microsoft device Puck".

[wintab]: https://www.microsoft.com/en-us/download/details.aspx?id=49498
[2010]: https://www.microsoft.com/en-us/download/details.aspx?id=14632
[2012]: https://www.microsoft.com/en-us/download/details.aspx?id=30679
[2013]: https://www.microsoft.com/en-us/download/details.aspx?id=40784

### Note Taking

I've been using a combination of OneNote 2016 and Drawboard PDF.  I've had
problems with OneNote importing PDFs directly so any time I want to take notes
on a PDF, I either have to send the PDF to OneNote's send-to-onenote "printer"
or I use Drawboard.  The printer seems to be slow and I suspect it's because
I'm using the onedrive cloud sync features.  Drawboard's circle menu is a good
way to store frequently-used features such as several pens, an eraser, and an
undo button.  Annotations done in drawboard don't show up
