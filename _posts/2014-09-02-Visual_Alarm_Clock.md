---
layout: blog
title: Visual Alarm Clock
section: Blog
last_modified_at: 2014-09-02
categories:
- WIP
- Arduino
---

It’s been a while since I last worked on my visual alarm clock project.  Since
I haven’t mentioned it before, here’s the gist:  I’m working on an alarm clock
that will turn on [this][bulb_amazon] very bright 85w compact fluorescent bulb
(note: not 85w equivalent) in an attempt to abandon an audible alarm (on my
phone).  I’m hoping that this will be a much gentler wakeup experience.  When I
get this finished, I’ll have an outlet that the arduino controls with a large
3-380vac relay.  I’ll then plug the CFL into that outlet.  Additionally, I’ll
have a 4-digit 7-segment display to show the time and allow for easily setting
the alarm.

<!--more-->

[bulb_amazon]: http://www.amazon.com/Square-Perfect-3077-Professional-Fluorescent/dp/B000W07Y5M/


When I last worked on this project, I wasn’t all that good at soldering.  I was
also using a cheap $25 radioshack iron.  I’ve since upgraded to a Weller WES51
and refined my technique (once I realized I had no clue what I was doing).  For
comparison, here’s the difference that knowing what you are doing and having a
good iron can do:

<a href="http://i.imgur.com/UxRlyYs.jpg"><img class="full" src="http://i.imgur.com/UxRlyYs.jpg" /></a>

I stopped working on the project around 9 months ago because I had thought I’d
burnt out my led display (I’d been running it without resistors).  After a lot
of practice soldering the SMD diodes on my ErgoDox, I figured that may have at
least been a contributing factor to the issues I was previously having so I
might as well give it a shot with updated technique.  Rather than trying to
repair the old solder job, I decided to just re-do it.  So far, the solder job
seems to be working well.  I also re-checked my pin diagram from the last time
I was working on this (the display didn’t come with any documentation).  It’s a
common cathode display (also required testing to determine that).  Anyhow,
here’s the pin layout:

<a href="http://i.imgur.com/w7NndxA.png"><img class="full" src="http://i.imgur.com/w7NndxA.png" /></a>

All the segments seem to work and I’ve been working on getting the harness to
wire it into the arduino.  I already know more or less how I’ll handle the
display from the software side (essentially, it’s just a POV display), so
getting that part working should be pretty quick.  After that, I’ll just have
to get my relay finished and everything should be golden.

Here’s the clock-specific code:

{% highlight c++ %}

#include <Time.h>

//time initilization
int hour_d1 = 0;
int hour_d2 = 0;
int minute_d1 = 0;
int minute_d2 = 0;
int t_hour = 0;
int t_minute = 0;
//segments
const int a = 9;
const int b = 8;
const int c = 7;
const int d = 6;
const int e = 5;
const int f = 4;
const int g = 3;
const int colon = 2;
//digits
const int d1 = 10;
const int d2 = 11;
const int d3 = 12;
int d4 = 13;

//set all pins as output
void setup()
{
Serial.begin(9600);
pinMode(a, OUTPUT);
pinMode(b, OUTPUT);
pinMode(c, OUTPUT);
pinMode(d, OUTPUT);
pinMode(e, OUTPUT);
pinMode(f, OUTPUT);
pinMode(g, OUTPUT);
pinMode(colon, OUTPUT);
pinMode(d1, OUTPUT);
pinMode(d2, OUTPUT);
pinMode(d3, OUTPUT);
pinMode(d4, OUTPUT);
setTime(23,52,0,9,02,14);
}

void loop()
{
t_hour = hour();
t_minute = minute();

hour_d1 = hour()/10;
hour_d2 = t_hour - hour_d1 * 10;
minute_d1 = .1 * (t_minute - (t_minute % 10));
minute_d2 = minute() % 10;

// display a random integer on each digit
displayer(hour_d1,hour_d2,minute_d1,minute_d2);
}

// uses a persistance of vision trick to display
// different numbers on each digit
// inputs:
// * digit1: number for digit 1
// * digit2: number for digit 2
// * digit3: number for digit 3
// * digit4: number for digit 4
// * dela : amount of time for which to
//          display numbers
void displayer(
    int digit1,
    int digit2,
    int digit3,
    int digit4
)
{
pickDigit(1);
pickNumber(digit1);
delay(5);

pickDigit(2);
pickNumber(digit2);
delay(5);

pickDigit(3);
pickNumber(digit3);
delay(5);

pickDigit(4);
pickNumber(digit4);
delay(5);
}

// Displays a number of active digits
// inputs:
// x: what number to display
void pickNumber(int x)
{
switch(x)
{
default: blank(); break;
case 0: zero(); break;
case 1: one(); break;
case 2: two(); break;
case 3: three(); break;
case 4: four(); break;
case 5: five(); break;
case 6: six(); break;
case 7: seven(); break;
case 8: eight(); break;
case 9: nine(); break;
}
}

// Makes a digit active
// inputs:
// x: which digit to make active
// (1 for left-most, 4 for right-most)
void pickDigit(int x)
{
digitalWrite(d1, HIGH);
digitalWrite(d2, HIGH);
digitalWrite(d3, HIGH);
digitalWrite(d4, HIGH);

switch(x)
{
case 1: digitalWrite(d1, LOW); break;
case 2: digitalWrite(d2, LOW); break;
case 3: digitalWrite(d3, LOW); break;
default: digitalWrite(d4, LOW); break;
}
}

// //////////////////////////
// Number display definitions
// //////////////////////////
void blank()
{
digitalWrite(a, LOW);
digitalWrite(b, LOW);
digitalWrite(c, LOW);
digitalWrite(d, LOW);
digitalWrite(e, LOW);
digitalWrite(f, LOW);
digitalWrite(g, LOW);
}

void zero()
{
digitalWrite(a, HIGH);
digitalWrite(b, HIGH);
digitalWrite(c, HIGH);
digitalWrite(d, HIGH);
digitalWrite(e, HIGH);
digitalWrite(f, HIGH);
digitalWrite(g, LOW);
}

void one()
{
digitalWrite(a, LOW);
digitalWrite(b, HIGH);
digitalWrite(c, HIGH);
digitalWrite(d, LOW);
digitalWrite(e, LOW);
digitalWrite(f, LOW);
digitalWrite(g, LOW);
}

void two()
{
digitalWrite(a, HIGH);
digitalWrite(b, HIGH);
digitalWrite(c, LOW);
digitalWrite(d, HIGH);
digitalWrite(e, HIGH);
digitalWrite(f, LOW);
digitalWrite(g, HIGH);
}

void three()
{
digitalWrite(a, HIGH);
digitalWrite(b, HIGH);
digitalWrite(c, HIGH);
digitalWrite(d, HIGH);
digitalWrite(e, LOW);
digitalWrite(f, LOW);
digitalWrite(g, HIGH);
}

void four()
{
digitalWrite(a, LOW);
digitalWrite(b, HIGH);
digitalWrite(c, HIGH);
digitalWrite(d, LOW);
digitalWrite(e, LOW);
digitalWrite(f, HIGH);
digitalWrite(g, HIGH);
}

void five()
{
digitalWrite(a, HIGH);
digitalWrite(b, LOW);
digitalWrite(c, HIGH);
digitalWrite(d, HIGH);
digitalWrite(e, LOW);
digitalWrite(f, HIGH);
digitalWrite(g, HIGH);
}

void six()
{
digitalWrite(a, HIGH);
digitalWrite(b, LOW);
digitalWrite(c, HIGH);
digitalWrite(d, HIGH);
digitalWrite(e, HIGH);
digitalWrite(f, HIGH);
digitalWrite(g, HIGH);
}

void seven()
{
digitalWrite(a, HIGH);
digitalWrite(b, HIGH);
digitalWrite(c, HIGH);
digitalWrite(d, LOW);
digitalWrite(e, LOW);
digitalWrite(f, LOW);
digitalWrite(g, LOW);
}

void eight()
{
digitalWrite(a, HIGH);
digitalWrite(b, HIGH);
digitalWrite(c, HIGH);
digitalWrite(d, HIGH);
digitalWrite(e, HIGH);
digitalWrite(f, HIGH);
digitalWrite(g, HIGH);
}

void nine()
{
digitalWrite(a, HIGH);
digitalWrite(b, HIGH);
digitalWrite(c, HIGH);
digitalWrite(d, LOW);
digitalWrite(e, LOW);
digitalWrite(f, HIGH);
digitalWrite(g, HIGH);
}

{% endhighlight %}
