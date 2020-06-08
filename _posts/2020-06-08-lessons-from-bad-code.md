---
layout: post
title: Lessons from bad code
date: 2020-06-08 20:00:00 +0530
excerpt: Something I wish I knew in 2017.
categories: [experience]
comments: true
---

**Disclaimer**: _There is a chance that not everyone agrees with what I regard as take-home values from this experience. If you happen to be one of those people, please drop a comment, and let's talk. I'd love to stop taking the hard way out._

**Disclaimer 2**: _This story, unlike the others, have a second person involved, and for the sake of his (yes, I know I eliminated half the possibilities) privacy, let's name him Mr A._

**Disclaimer 3**: _To everyone I've said this story to before, if you notice slight variations in what I've told you vs what you read here, please note that they exist because I've forgotten minor details of the day myself._

Before I start describing my experience, I'd like to get a few things out of the way.

- According to me, this incident single-handedly has given me more perspective as a developer than any other project that I've worked on.
- This project had a few other developers working on them, but their inability to make blunders has revoked their privileges to be mentioned (Doubt they're missing out though 😂).
- Mr A is one of the best developers I've had the opportunity to work with, but he does have his quirks (like anybody else), this incident is just an example of how our quirks together _almost_ resulted in a disaster.

# Story Time 📗
Since my sophomore year in college, I have been a part of the Software Development Section in my college ([Check us out maybe?](https://sdscoep.codes/)). Right after I was inducted, I was assigned to an in-house project that targeted to serve as a repository for all publications made by COEP students.

Given that I had almost 0 experience in building full-stack applications with LAMP, it seemed like a mammoth task, but slowly through the course of the next few months, with a lot of guidance from seniors and Google, I was able to contribute to a few releases, after which the project was moved to maintenance pending deployment.

Fast forward a year: Mr A was added to the team and was assigned to directly work under me and we got a fresh (and huge) set of requirements; except this time I was expected to do the "guiding" (lol) and Mr A stepped into my shoes as the developer that was overwhelmed (but more equipped to deal with it, according to me). Through the course of that year, the project took a huge upgrade. Mr A and I were able to add a few major functionalities, all of which were written from scratch. We were quite proud of what we had accomplished, and we also realized that the two of us made a good working team.

Fast forward another couple of months: Mr A and I were settled into a comfort zone of sorts. We'd understood the codebase inside out, and were comfortable with making changes on the fly. Another good thing was, after having worked with SDS for a few years or so, we were now comfortable working with PHP (or so I thought).

This might seem like a happy story, right? I mean so far, I've told you that we had problems coping up, and then we managed our way through to a point where it was comfortable. Well, this is where the problems usually start. See the thing is, when you're not in your comfort zone, you tend to read and analyse everything that comes your way, and that's when you spot errors and fix them. However, when you start to get comfortable with anything, basic human tendencies lead you to start taking basic things for granted, and that causes blunders.

After having implemented, and re-factored majority of the code base, I assigned Mr A to do a few finishing touches (authority does come with an inherent benefit to be able to delegate boring tasks :P), and this is when the problems started to rise. Due to the level of comfort, I had with Mr A (and partly because of my laziness), I skipped the crucial part of code review before accepting his code into the deployment branch. 

For anyone not from a computer background: Generally in a team of developers, before anyone's work is accepted to be correct, there is an extensive process of code-review and testing before anything reaches the end-user. Usually, code-review is done by the maintainer, who in this case was yours truly.

Now, let me clarify again. Mr A is a very competent developer, and there weren't any critical flaws in his code (at least none that have been noticed, yet).

Luckily for us, there was a demo scheduled with our faculty in charge before what we made reached actual end-users. I'd promised myself to take a look at all the latest code, just to be safe. But, due to pure bad luck (and nothing else), the weeks leading up to the demo were very busy for both Mr A and I. We were swamped with college work and assignments and hadn't gotten around to doing an internal round of testing.

Fast forward another few weeks to the demo day; I must admit that I was quite chill about how it would go, we went over the top to finish the project, it was stable and we'd successfully incorporated all changes without having broken anything from the previous versions, it was, rather felt like a win!

But you know what they say, don't count your chickens before they hatch. Maybe 30 minutes or so before the demo was to start, Mr A and I met, hoping that time would pass quickly and we'd be done with what seemed like a straightforward and much-awaited demo (I remember this moment very clearly, I thought to myself, is this what toppers feel before an exam? Damn. 😂), which is when I thought to myself, now is a good time to see what the final product looks like (and give myself a tiny ego boost), after all the finishing touches Mr A had done.

# The Problem 😖
One of the functionalities of our application was to be able to upload documents required for the sanctioning of funds that are related to either the publication or travelling to/fro from a conference. 

Seems quite straightforward right? I mean you see thousands of websites that have an upload button, doesn't take a genius to infer that if they're so common, they're probably easy to do; and you're right. Uploading a file and storing it on a server is downright boilerplate, so much so, that there are whole libraries built around making it easier; which do fancy things like automatically divide them into folders for easier lookup, store the name of the file in a database automatically, etc.

But being who Mr A and I are (headstrong and just a little arrogant), we'd decided to do everything from scratch, (if you haven't guessed yet) this is where part of the problem began. Two newbies out there trying to get everything right in the first go.

Due to how comfortable I'd gotten with Mr A; during development, I'd told him "Mr A, add the form to upload files and save them in a folder.", knowing it would be a small thing which shouldn't take more than an hour to do end to end, including styling.

Back to the present (20 minutes away from the demo), while going through the end result; something stuck out to me which I shrugged off in the moment. _That's like a dumb thing to even consider, obv Mr A did it_.

You know we have those ticks, not the insect, just the thought, the compulsive thoughts which are equally annoying, that you need to get out of your system, well I had one of those, so I just asked Mr A, I mean wth, he'll give me a _"Are you serious?"_ look, and we'd move on, _except no._

So I asked, "Mr A, you did make sure to make a database entry to store the files right". Oh how I wanted his answer to something like 🙄, but it wasn't. It was more of a 🧐.

_"No, I didn't, you didn't ask me to na? You'd said add a form, and that's what I did."_

_"WHAT? 😲"_

_"Yeah I just assumed you did it after I was done."_

For people who haven't understood what happened: Our project now accepted files, and saved them. But had no way of identifying the names of the files after we had uploaded.

Something like, when someone gives you something of theirs; you keep it somewhere, but you also remember who gave it to you, and where you keep it, right? (well, most of the times :P). Except, computers ain't that smart. Our application accepted files, and then completely forgot we even took them. Fun stuff right?

_I mean, I did tell him to do the form, but I thought he'd see through the whole thing; but he wasn't wrong from his point of view either. But because this is my blog, I'm going to call Mr A out for his quirks 🤷‍♂️._

We were less than 20 minutes away from our demo (successful, lol), and well panic set in. For those who've never had to fix a bug in production, you don't know what stress is. But this gif pretty much sums it up 

<!-- <img src="https://yashshah1.github.io/blog/assets/4/bug-in-production.gif"> -->
{% include image.html url="http://localhost:4000/assets/4/bug-in-production.gif"%}

We frantically start to plug in pieces of code from internet snippets, all trying to maintain a fine balance between make-believe and functional; we had to focus on the short term uses, the demo. The functionality can be added later (by Mr A :P)

With about 5 minutes to the demo left, we see another professor walk into our faculty in charge's cabin, which we hoped would give us another 10-15 minutes of time to finish it off.

I might not be a good enough writer to adequately represent the stress level of the situation, so take my word for it when I say, it was **_bad_**. 

Over the next 10 minutes or so, we were able to finish off, with a lot of bugs in our code, which is the best that two inexperienced stressed developers could do. We didn't add checks for file types, file sizes or even duplicate file names. 

So in theory, if two people uploaded files named `myAwesomePaper.pdf`, too bad for the first one. Or even if someone uploaded a random zip file that was 10GB big, we would simply accept it. Amazing right?

Well, the silver lining was, our demo went decent, which is much better than what we could have asked for, and a few suggestions to be implemented. We called that a win.

# Lessons Learnt 🤖

At the beginning of this article, I'd told you that working on this project has given me more perspective than any other project/team that I've been on so far, and I wasn't lying.

Most of these things are also something I wish I could tell Yash from 2017 so that I wouldn't have to learn them the hard way. So if any of you are trying to start your way through Software Development, maybe these can help you.

- **Don't re-invent the wheel**: This is very common with new developers. All of us start with this thirst to go out there and write functionalities from scratch, when in fact that is probably the single biggest blunder you can make.<br /><br />
When building a software, always prefer using pre-existing libraries which implement functionalities that are required, unless you absolutely can't (If you say that you can't find one that does what you want to, you need to get better at Googling 😛).<br /><br />
The npmjs directory has over 1.3M and PyPi has over 230K packages. These don't include the countless libraries that are available on GitHub which aren't published.<br /><br />
I say this because of a simple fact: when you are starting you are nowhere close to being as good as it takes to write a library that does exactly what you want to in the most efficient way possible; and when you do become good enough, you realise that it is futile wasting manhours to re-write something that already exists (Open Source FTW).<br /><br />
I also empathize with the fact that when you're starting, using someone else's code might feel like taking the ~~dumb~~ easy way out, but during the course of building big projects, it is essential to use code that is thoroughly tested, which is almost guaranteed by using established libraries.<br /><br />
**However**, if your end goal _isn't_ to build something big, but just to learn something well, I'd 100% recommend you to try and build how much ever you can from scratch. Building something ground up, according to me is the fastest way to understand any concept inside out.

- **Software Development is more than just good code**: Every Computer Science student will testify this; In almost every DSA / OOP course we've taken, if there is one thing that the professor has tried to drill into our heads, is that we should aim to _write code that is simple, clean and concise. Your code should do as much as it's supposed to do. Anything unexpected given to you and you can raise your hands saying this is outside the scope of this function._<br/><br/>
Now, even though I completely agree with the given philosophy, without which probably no big software would exist (yeah, I'm serious, a large codebase that is poorly written is as difficult to maintain as a new years resolution to start working out, basically impossible). At the same time, having this thought engraved into our heads is quite ineffective, especially while working on a project from scratch. <br /><br />
It makes us a little myopic in our development process which can (and in my case, did) lead to problems that might go undetected till a much later stage. <br /><br />
Development requires each one to be able to see a feature end-to-end, which might consist of several concise functions, but the bigger goal of the feature needs to be seen from a users point of view, and not what we've learnt from our OOP courses.

- **Never get comfortable**: Repeat after me when I say this, _never get comfortable enough with any technology or team you work with_. Slipping into a comfort zone in an ever booming industry like this could lead to more than one problem (my fancy way of saying I could come up with two):
  - If you're lucky you probably end up in a situation like mine, where you just need some additional time to fix any bug that probably slipped through.
  - However, if you're unlucky, and this is more probable, you start getting comfortable with the tools and languages at your disposal and you stop trying to explore or learn something new. This is nothing short of catastrophic in a field like software development, where refusing to be versatile is very bad unless you're someone like [Kernighan](https://en.wikipedia.org/wiki/Brian_Kernighan), then it's okay.
  
- **Always write/perform tests**: Almost everyone in the profession of writing code will testify that at least once in their life, they'd have shrugged at the idea of writing tests for their code; either because they felt that writing tests were something _" my code doesn't need"_ or it just felt like a waste of your time.<br /><br />
As students, we barely pay any attention to whether or not our code is tested thoroughly before and after any functionality is added, and this could lead to major problems as the project size increases.<br /><br />
Well I can't say this enough, if you're a developer who doesn't know how tests are written, start now. Read up on testing frameworks (yes, there are whole frameworks built around it, it's that big a deal).


<br /><br />
This is all for you, for now!