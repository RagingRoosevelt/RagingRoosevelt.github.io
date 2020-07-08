---
layout: blog
title: Autonomous DSLR trigger
section: Blog
last_modified_at: 2014-09-05
categories:
- WIP
- Arduino
- Photography
---

My goal with this project is to build a timelapse system.  When I’m done, I hope to have a camera control module (to automatically take photos on a specified interval), a motorized rail system that will allow my camera to perform pedestal (up/down), truck (forward/backward), and dolly(side to side) movements.

<a href="https://i.imgur.com/NObL5AA.jpg"><img class="half" src="https://i.imgur.com/NObL5AA.jpg" /></a>

I’ve finished wiring up my OMD to be triggered via my arduino.  A few months ago I purchased an aftermarket remote bulb because it featured a 2.5mm headphone plug and I figured the mechanics that triggered the bulb would be pretty simple

Playing around with the internals, it did turn out that the internals were quite simple

<a href="https://i.imgur.com/6Kz0lWQ.jpg"><img class="full" src="https://i.imgur.com/6Kz0lWQ.jpg" /></a>

When you press the first trigger of the bulb, it makes the top two plates contact and completes a circuit.  When you press the trigger forward, it makes the top two metal plates also come into contact with the bottom plate, completing the rest of the circuit.  The first trigger causes the camera to focus and the second one causes it to take a photo.  After playing around with it, I was able to determine that the ring is the common contact (the top plate, I think), the sleeve is the focus, and the tip is the shutter:

<a href="https://i.imgur.com/Edijb8i.png"><img class="half" src="https://i.imgur.com/Edijb8i.png" /></a>

I figured the easiest way to automate completing the two circuits would be via relay.  I purchased a standard 2 relay module (10A 250vac, 10A 30vac) that was designed to work with digital output pins like I have on my arduino (I didn’t want to bother figuring out how to get a relay component wired up while still prototyping).

<a href="https://i.imgur.com/fyu48zh.jpg"><img class="half" src="https://i.imgur.com/fyu48zh.jpg" /></a>

Anyhow, I’ve managed to get the arduino to cause the OMD to take photos.  I trigger the focus circuit, wait 500ms, trigger the shutter circuit, wait 500ms, then break both circuits.  I haven’t decided how far I plan to take this, so I may just leave configuration as something I hardcode whenever I upload sketches to the arduino.  If I’m feeling ambitions, I may integrate some simple method to cycle between several different intervals between photos while in the field.  In any case, this is pretty close to ready for use as a timelapse system.  I’ll probably work on setting up a sled in order to get motion while shooting timelapse.
