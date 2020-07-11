---
layout: post
title: A showdown of languages - I
date: 2020-07-11 12:00:00 +0530
excerpt: A brief breakdown, well as brief as I can be.
categories: [tech]
comments: true
---

After only (what seems an eternity, but is actually just) a few weeks of "blogging", I'm accustomed to starting each post with a disclaimer 😂

**Disclaimer**: _I'm not the best authority on any of the below languages, but I've had little experience with each one of them, and these are merely my observations about each one of them._

This is the first part of a two part series, which should be out in a couple of days.

# Introduction
I've wanted to be a computer engineer / software developer / programmer for the longest time that I can remember. Why, what or how I got this idea is still a mystery. I wrote my first program when I was 12 in QBasic, and it was a simple program to do addition after taking the input of two numbers (after the "Hello World" ofc).

I've come a long way since then, and I've had the luck to experiment with a lot of languages / frameworks and use some of them extensively. The following article is just a small ~~rant~~ summary of my experience with them, where I highlight certain things that _really really_ got on my nerves along with certain things that I absolutely love. 

Since this is a highly subjective (and controversial) topic, I'd love to hear your opinions! Drop a comment below or get in touch with me on [LinkedIn](https://linkedin.com/in/yashshah13) / [Twitter](https://twitter.com/JustAnotherYash).

If you want to skip to a specific section, you can do so by using these:

# Contents
- [Python](#python)
- [C](#c)
- [Footnotes](#footnotes)

# Python
I was first introduced to Python in my 11th grade as part of the CBSE curriculum, back when Python2.7 was still a huge thing, and as any kid who loved shiny objects, I was hooked. 

I started off by using IDLE as my primary editor (yeah, roll your eyes all you want), and even then I loved it. It was so clean, super simple to get a hang of, and as a person who was just starting out, I loved how datatypes weren't needed to be explicitly stated. It made the learning curve of a whole new language practically a flat line, and even though I wouldn't realise how big a mistake this was until a few years later, I was thankful that Python didn't have pointers (All the C++ kids kept whining about it.)

Also, I loved the Easter eggs that were sprinkled all around. Read the [Footnotes](#footnotes) for a small list of them.

## The good
The internet is filled with in-depth explanation of a lot of praise and otherwise for Python, so I'll try and concentrate more on the ones that I feel need to be highlighted. If you're someone who's used Python, feel free to skip #1.
1. **The basics**: Python is _incredibly_ simple to the point where it's almost English (cue pseudocode to pseudocode.py memes). No, like honestly. If you're someone who hasn't had any experience with Python, first off, where have you been my friend? Second, check this out. It's a code to return a list after removing all the duplicates. 
```python
def remove_duplicates(first_list):
    second_list = []
    for item in first_list: # check for all items in the list
        if item not in second_list: # check if it is not present in another list
            second_list.append(item) # if it isn't, add it.
    return second_list
```
And there you have it. It's mind boggling how simple and high level (and beautiful) this language is.

2. **The (OH SO SO SO SO MANY) libraries**: This is kinda like the "Who came first, the chicken or the egg?"<br /><br />
There is a library for everything, and I mean it literally. You want to build responsive and dynamic webpages without knowing HTML/JS? [Dash](https://plotly.com/dash/). You want to plot amazing graphs? [Matplotlib](https://matplotlib.org/) (oh, and while you're at it, probably check out [Bashplotlib](https://github.com/glamp/bashplotlib) too). You want to use your GPU to do complex mathematical operations (and neural networks)? [Tensorflow](https://www.tensorflow.org/), [PyTorch](https://pytorch.org/). <br /><br />
Oh, I recently learned about this too. It does exactly what it's name says it does. Check it out [F*ckit](https://github.com/ajalt/fuckitpy).<br /><br />
The reason why there are so many libraries that do a whole spectrum of things from dumb utilities to extremely powerful calculations, all while maintaining an almost english-like API is beyond me. Either they exist because so many people use Python, or so many people use Python because they exist (Like I said, chicken or egg). 

3. **Versatility**: Like I said above, Python is probably your preferred language for anything small to medium scale. Prototyping or even building small to medium scale production ready software is a breeze in Python. The usual jargons of untraceable segmentation faults, cryptic error messages, the oh so annoying typechecks aren't something that you look forward to when you want to build something quick.<br /><br />
I've used Python for a whole lot of things, from extremely dumb utility scripts to help clean my Desktop, [spam my friends' Instagram accounts](https://github.com/yashshah1/Instagram-Hacks), to building complex data and machine learning pipelines and Python has almost never let me down.


## The bad
All that said, there are a few things that ABSOLUTELY get on my nerves about this language. No, it's not just the speed of the language. I don't do a lot of competitive coding, so it's not something that has bothered me critically. 

Fair disclaimer, almost each item on this list is something that doesn't actively bother me, but when you encounter it, you feel like throwing a shoe at your screen.

1. **The dumb indentation**: Whoever thought it was a smart idea to allow _**both**_ tabs and spaces to be allowed was clearly out of his mind. I can't tell you how many times I've had the trouble of shifting code between machines and using a differently configured editor to modify a few lines, only to end up with a bitter looking error. Yes I know it's a simple find and replace, but it is still very annoying. 

2. **There's just too much power**: Quoting Uncle Ben "With great power, comes great responsibility"; well that's true for almost everyone that uses Python. It's sort of like a double edged sword, let me explain. <br /><br />
Just because of it's extremely simple interface, developers tend to misuse Python's abilities to do all sorts of horrendous things like this:
```python
a = [list(sorted(map(lambda x: x + 'a' if x == '1' else x, [i[0] for i in input().strip().split()]))) for _ in range(int(input()))]
```
Now what this does, isn't the point. The point I'm trying to make is, I've seen such code come up in the worst of places, which makes debugging **_hell_**. This is a clear abuse of the language, and if you're someone who participates in this, please stop. If seeing this hasn't made you feel even a little sick in your guts, maybe take a look at {% include link.html url="https://github.com/sobolevn/python-code-disasters" text="this."%}

3. **GIL**: The Global Interpreter Lock in Python is a mechanism which ensures that only one thread can execute at any given time. This causes a HUGE bottleneck for any actual application that Python can be applied to. <br /><br />
The GIL has to be Python's biggest painpoint and probably the only hurdle it has in it's path to global domination. Yes I know workarounds exist, but almost all of them come with a very large set of caveats that need to be taken care of, which results in a lot of boiler plate.

# C
C according to me is what any aspiring software developer should start with. Writing code in C ensures that you have an exact idea of how things are actually working; how memory allocation works, how to take care of pointers, references etc.

C is also (very accurately) known as the language of the computer because of how low level and powerful it is. There is nothing that is not possible using this language, you've just got to be brave enough to do it.

## The good
1. **The (lack of) abstraction**: C as a language does absolutely nothing for you, unless you explicitly tell it to do something. Unlike a lot of high level languages you have complete control over your user and program space to do any and all changes you deem fit. <br /> <br/>
Because of this extreme level of control, you are now able to write efficient and critical code that you know is very predictable. Eg: If you were tasked to write code for a flight control system, you wouldn't want to do it in any other language other than C. <br /> <br/>Why? Let's assume you write a function to control certain critical functions when the flight is in the middle of an emergency landing. In a situation like this, you want to make sure your computer is doing exactly what you want it to do and nothing else, which is what C lets you do. If this were written in Python, there is absolutely no guarantee that at the instance when this function is called, the runtime wouldn't invoke it's garbage collector stalling the other (more critical) function.

## The bad
1. **The oh so crazy possibilities**: C has a lot of concepts that are probably non existent in other languages. Things like function pointers, void pointers, hierarchy within pointers etc. Well, a lot has to do with pointers. This also gives rise to extremely crazy possibilities like the following.
```c
int* (*foo)(char*) // or
int* (*bar[10])(char *) // or
int* (*(*foo[5])(int *))
```
Yep those are all valid C declaration, and these aren't even the worst of it. Trying to read C programs apart from the ones that are taught to you in class takes a very steep learning curve. <br /><br />
PS: If you want to see an article about how to convert the above mumbo-jumbo into english, do let me know!

2. **The abundance of cryptic error messages**: Though there are a lot of instances for this, Segmentation Faults take the crown for this one. It is painful to see hours of work reduced to one line of a fatal error message and no other information whatsoever. <br /><br /> Yes I know, gdb is a overpowered workaround for this, and can be very efficiently used to pinpoint the source of the error, but gdb is a whole new world which takes quite a bit of time to get a hang of.

# Footnotes
## Python Easter eggs
1. Try doing `import this` for a pleasant surprise
2. This <br /><br />
```python
>>> from __future__ import braces
  File "<stdin>", line 1
SyntaxError: not a chance
```
3. When [BDFL](https://en.wikipedia.org/wiki/Benevolent_dictator_for_life) retired:
```python
>>> from __future__ import barry_as_FLUFL
>>> 1 <> 2
True
>>> 1 != 2
  File "<stdin>", line 1
    1 != 2
       ^
SyntaxError: with Barry as BDFL, use '<>' instead of '!='
>>> 
```
[This](https://www.python.org/dev/peps/pep-0401/) is a fun read too.
4. Infinity?
```python
>>> hash(float('infinity'))
314159
```
That's π * 10<sup>5</sup>

And that's the end of part I, stay tuned for part II!

This is all for you, for now!