---
layout: post
title: '"Tasteful" code'
date: 2020-07-01 13:00:00 +0530
excerpt: Made me question a lot of things
categories: [tech, code]
comments: true
read_time: 15
---

**Disclaimer**: _Though this article is not targeted to be very code heavy, it might end up being so._

**Disclaimer 2**: _However this article is targeted at an audience who have a little experience with writing and reading code._

# Introduction

I don't know if this is true, but I think almost everyone who started writing code as a high school student, irrespective of the language, has had a few (or more) traits; things that we are almost ashamed of accepting now.

We would name our variables a generic `x` or `y` and when that wouldn't suffice, we would append a number to them, our functions would be some rendition of `fun()` or `test()` and our filenames would be `1.py` (or any other language)

I'm hoping at least a few of you relate to this (and save me a part of the embarrassment). Also if any of you reading this still do any one of the above mentioned things, **stop before someone throws a sharp object at you**.

I wrote a [tangential post](https://yashshah1.github.io/blog/articles/2020-06/lessons-from-bad-code) a while back, where I talked about things I've learnt over the last couple of years, in which I briefly tried to talk about things that you should avoid doing.

However, most of the things that I mentioned there are the bare minimums of writing good code. Through this blog, I am trying to have a different take on things. I'm trying to sum up a few things that very distinctly separate good developers from average ones (I know, quite cocky coming from a college senior, take my level of "good" with a pinch of salt). This article isn't aimed at being a sieve to put yourself through, but rather a sort of mental exercise to justle your mind into changing how you look at or write code.

# "Tasteful" Code

(Yeah, I was out of unique names)

In Feb 2016, [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) gave an [interview at TED](https://www.ted.com/talks/linus_torvalds_the_mind_behind_linux) where he spoke about how he works, how the Linux project has come so far etc.

> "I'm perfectly happy with all the people who are walking around and just staring at the clouds ... but I'm looking at the ground, and I want to fix the pothole that's right in front of me before I fall in." - Linus Torvalds

If you're someone like me, who enjoys watching interviews, and someone who admires Torvalds for his attitude towards solving problems (irrespective of all the criticism he receives), this is a nice way to spend 20 minutes.

However, there was something that very very clearly stood out for me in the whole presentation. At around 14:30 into the interview, Linus talks about how certain programmers have "taste". _Huh?_ I've heard a lot of adjectives to describe developers from either end of the spectrum but I've never heard one being judged on the parameter of "taste".

Over the next minute or so he talks about what exactly he means by taste, and drops an example that personally made me go nuts. Here's a slightly modified version of the slide.

{% highlight c %}
void remove_entry_from_list(entry) {
    prev = NULL;
    walk = head;

    // walk the list till you find it
    while(walk != entry) {
        prev = walk;
        walk = walk->next;
    }

    // check if the entry to be removed is the head
    if(!prev) head = walk->next;
    else prev->next = walk->next;
}
{% endhighlight %}

Before you come screaming at me, I know the code is both syntactically and logically wrong. There isn't a datatype associated with entry and there isn't any logic to check whether or not it actually exists. Bear with me, there is a larger point to be made.

Now anyone who's done even a single course in Algorithms and C, will identify the function instantly. It's to remove an element from a Singly Linked List. It's something that all of us have written at least once, and it's a classic way to teach any one about linked lists and how to manipulate pointers.

This is what Linus referred to as code with "no taste". _WHAT?_ I mean scores of students all around the world have written and still write the delete function exactly like above thinking that this is the only (and the best) way of doing it. In fact, even my repository of {% include link.html url="https://github.com/yashshah1/yard-ts/blob/master/src/linked-list/singly-linked-list/SinglyLinkedList.ts#L69L92" text="algorithms in TypeScript"%} tackles this in a very similar fashion.

Torvalds said that the most interesting part to him are the last 4 lines, where we check whether the entry to be removed is the first or not, depending on which completely different operations are carried out. If it was the first element, you'd need to change the `head` pointer, else you'd change the pointer of the previous element.

Torvalds went on to show a snippet that he thought qualified to be of good taste. Here it is:
{% highlight c %}
void remove_entry_from_list(entry) {
    // indirect is now a pointer that points to the address
    // of the item that needs to be removed
    indirect = &head;

    // walk the list, checking each entry
    while((*indirect) != entry) {
        indirect = &(*indirect)->next;
    }

    // remove it
    *indirect = entry->next;
}
{% endhighlight %}

If your first reaction was _"Wth?"_, _"Eh?"_ or something similar, don't worry you're not alone. The code takes sometime to wrap your head around, so give it another read and you'll probably have a little idea about how it works.

The first thing that I noticed was that the function body was significantly smaller.

But that isn't why this code was better. In fact _anyone who tells you that the line code of a function defines it's quality probably doesn't know what they're talking about._

If you notice, the `if-else` condition is gone. Linus says that understanding how or why the if statement isn't required anymore is not of significance. He says that the ability to look at a problem in a certain way such that the special cases fit into the normal case, is what "good" taste is about.

**MINDBLOW!**

Even if I was given a week to write the above function in a way that wouldn't have any corner case, I would've failed in all likelihood. Through all my years of education, I've been taught to identify corner cases, and make sure that my code handles them, but I've never had anyone come and tell me to try and include the corner case in the main logic of my code.

Linus goes on to say that "good taste" is much bigger than an inconsequential function, it's about instinctively knowing the right way of doing things (_Yeah, that makes a lot of sense, and gives me so much more clarity, thanks Linus._🙄).

## Another Example

Let's talk about another small problem where "taste" might not be easily evident, but once seen, can be very easily identified.

> Given a 2D array of dimension SIZE x SIZE, initialize all the edges to 1.

Seems very dumb right? You have to set all the elements of the top row, bottom row, left column and the right column to 1.

{% highlight c %}
for (int r = 0; r < SIZE; ++r) {
    for(int c = 0; c < SIZE; ++c) {
        if (r == 0) arr[r][c] = 1; // top row
        if (c == 0) arr[r][c] = 1; // left column
        if (r == SIZE - 1) arr[r][c] = 1; // right edge
        if (c == SIZE - 1) arr[r][c] = 1; // bottom edge
    }
}
{% endhighlight %}

The above code works, but there are a few issues with it.

- Just looking at it, makes you feel like there's just too much going on for something as simple as initializing edges.
- Another problem is, that this code has a time complexity O(N<sup>2</sup>), I'm sure this is not the best that can be done.
- There are also a lot of conditionals (`if` statements), which will affect the runtime in practice (If you don't know what I'm talking about, you should really read {%include link.html url="https://stackoverflow.com/a/11227902/11362183" text="this"%}).

A sizeable portion of you probably have a faint idea with what the final code should look like, but before we get there, I want to try and emphasize what Linus thought separated "tasteful" code from the lot: _Code that tests for fewer conditions, is better code._

It's a simple idea, but very powerful in itself. It's the idea that being able to look at a problem from a different perspective makes all your cases fall into order.

If you don't know how the above snippet can be written in a better way, I would encourage that you stop reading and try it out once for yourself.

<hr class="inpost-divider"/>

Okay, so let's take a look at the code I could come up with.

{% highlight c %}
for (int i = 0; i < SIZE; ++i) {
    arr[0][i] = 1; // top row
    arr[i][0] = 1; // left column
    arr[i][size - 1] = 1; // right column
    arr[SIZE - 1][i] = 1; // bottom
}
{% endhighlight %}

This snippet does the same thing in a much (much much) cleaner way. The time complexity is down to O(N), we've removed all the conditionals and it's easier to read. This _could qualify _as "tasteful" code (Irrespective of how dumb the function actually is.)

# The Unix Philosophy

<i>Read the whole thing {%include link.html url="https://homepage.cs.uri.edu/~thenry/resources/unix_art/ch01s06.html" text="here." %}</i>

> Rule of Separation: Separate policy from mechanism; separate interfaces from engines.

This is rule #4 from the "Basics of UNIX Philosophy", and it's relevant in almost every sphere of development.

Here, policy is implied to be something along the lines of _How it looks_ while the mechanism is _How it works_ and Rule 4 advocates that the two must be as separate as possible. Why? Well think about it. How a particular application's GUI is will change more frequently over time, but the mechanism of it is probably a more static thing.

Putting the "policy" and "mechanism" of any system as a tightly coupled mechanism can lead to two devastating problems.

- It makes the _look and feel_ of something much harder to change based on requirements.
- It also opens the door to destabilizing the _look and feel_ when you're trying to change how it works.

## An example

Let me try and illustrate all of this by an example. A simple one at that.

_NOTE: The following example is built using basic React, but knowing React is not a requirement._

> Hey, can you build me something simulates a coin flip?

Cool, no biggie!

```javascript
const coinFlip = () => {
  if (Math.random() < 0.5) return <img src="/heads.png" alt="Heads" />;
  else return <img src="/tails.png" alt="Tails" />;
};
```

> This looks great, can you also add some way for us to show the text "Heads" or "Tails"?

Um, sure. I'll make it configurable.

```javascript
const coinFlip = options => {
  const showLabels = options.showLabels || false;
  if (Math.random() < 0.5)
    return (
      <div>
        <img src="/heads.png" alt="Heads" />
        {showLabels && <span>Heads</span>}
      </div>
    );
  else
    return (
      <div>
        <img src="/tails.png" alt="Tails" />
        {showLabels && <span>Tails</span>}
      </div>
    );
};
```

You think to yourself, that maybe, this can be done a little cleaner, after all it is 2020.

```javascript
const coinFlip = ({ showLabels = false }) =>
  Math.random() < 0.5 ? (
    <>
      <img src="/heads.png" alt="Heads" />
      {showLabels && <span>Heads</span>}
    </>
  ) : (
    <>
      <img src="/tails.png" alt="Tails" />
      {showLabels && <span>Tails</span>}
    </>
  );
```

> That's amazing dude, but our users don't really like the odds they're getting. Add a button to re-run the flip? But also have an option to not have the button. You get what I'm saying?

Okayy, I guess? But stuff is starting to get ugly.

```javascript
import { useState } from "react"
const flip = () => Math.random();

const CoinFlip = (props) => {
    const { showLabels, showButton } = props
    const [probability, setProbability] = useState(flip());
    
    const handleClick = () => setProbability(flip());
    
    return (
      <>
        {showButton && (
          <button onClick={this.handleClick}>Flip!</button>
        )}
        {probability < 0.5 ? (
          <>
            <img src="/heads.png" alt="Heads" />
            {showLabels && <span>Heads</span>}
          </>
        ) : (
          <>
            <img src="/tails.png" alt="Tails" />
            {showLabels && <span>Tails</span>}
          </>
        )}
      </>
    ); 
}

CoinFlip.defaultProps = {
    showLabels: false, // yeah we need to take care of this too
    showButton: false,
};
```
<br />

> Nice, this is perfect. But we're targeting a different market now, we want to be able to do a Dice Roll too!
> No new feature, just the same; showing labels, the button to rerun, same old.

Now, you can do one of a few things

- Write a whole new component <DiceRoll /> and link them somehow so that they merge together
- Try to magically incorporate a DiceRoll in the same component. I say magically because you'll probably break your computer in finding a good way to do it.

Let's take a pause, and evaluate. We started off with a clean block of code right? But somewhere along the way, we kept adding things to out component.

But no where along the way did we try and separate out the policy from the mechanism. The same component took care of running the coinflip and showing it, which isn't a nice thing to do.

Now, this is different in almost every language, but since we're on React, let's take a look at one of the many right ways of doing it.

We know that the right way of doing it is to somehow separate out the UI from the logic. So let's break down the problem statement given to us

1. We want to be able to run odds (dice roll / coin flip)
2. We want to be able to trigger a re run.

Let's take a look at what the mechanism could be, when it's separated from the UI

```javascript
import { useState } from "react"
const flip = () => Math.random();

const Probability = () => {
    const [probability, setProbability] = useState(flip());
    const handleClick = () => setProbability(flip());
    const RenderComponent = props.renderComponent;
    
    return (
      <RenderComponent
        rerun={handleClick}
        result={probability}
      />
    );
}

```

So this is a component that only takes care of running the mechanism, and relies solely on another component to display the result. Let's take a look as to how that would be.

```javascript

const CoinFlip = (props) => {
    return (
      <>
        {props.result < 0.5 ? (
          <img src="/heads.png" alt="Heads" /> // 1.
        ) : (
          <>
            <img src="/tails.png" alt="Tails" />
            <span>Tails</span>
          </>
        )}
      </>
    );
}

const App = () => <Probability renderComponent={CoinFlip} />

```

1. If we don't need to be shown a label for one case, it is easily possible.

Similarly, not showing the button is equally configurable. Perfect!

All we need to do is pass our Display component to the Probability class, and our functionality is up and running. Let's try to tackle the DiceRoll problem now.

```javascript
const DiceRoll = (props) => (
    <>
        <p> The outcome is {Math.ceil(props.result * 6)} </p> 
        <button onDoubleClick={props.rerun}>Try me again</button> // 1.
    </>
)

const App = () => <Probability renderComponent={DiceRoll} /> // 2.
```

1. If you notice, we now trigger a re run on the **double click** of the button, and not a single click with no extra effort.
2. Without changing any of our main code, we now have a dice roll component too.


This usage provides a much greater functionality compared to our previous versions, all because our UI and mechanism are appropriately separated.

Sweet right?

Now, these isn't the only way of doing things, we could have done this as a [Higher Order Component](https://reactjs.org/docs/higher-order-components.html) as well.

For examples that follow this philosophy at a very large scale, check out [react-table](https://github.com/tannerlinsley/react-table) and [Downshift](https://github.com/downshift-js/downshift).

React Table is a very powerful data table library while downshift is a state-of-the-art dropdown/select menu generating library, and if you haven't guessed yet, both of these libraries _**don't provide any UI whatsoever**_, which is what makes them so great.

# Footnote(s)

If you've read the article so far, first of, wow. You seem to have a lot of patience to read through a long theoretical (and possibly boring) article.

But if you've made it so far, and you have a little interest in what you've read, I highly highly recommend you watch {% include link.html url="https://www.youtube.com/watch?v=f84n5oFoZBc" text="this video" %}. It is a very good presentation given by Rich Hickey almost a decade ago, and anything I say about it will probably dilute it's charm.

# Credits

- The CoinFlip example: [Merrick Christensen](https://www.merrickchristensen.com/)
