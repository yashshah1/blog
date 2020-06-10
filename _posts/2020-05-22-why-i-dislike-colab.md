---
layout: post
title: Why I dislike Google Colab
excerpt: I mean, it's a love-hate kinda thing
date: 2020-05-23 23:00:00 +0530
# updated_at: 2020-06-05 12:00:00 +0530
categories: [tech, experience]
comments: true
---

**Disclaimer**: _I've used [Colab](https://colab.research.google.com/) quite a bit through my undergraduate work. It's a huge life saver, especially when you're looking for a training job with a low to mid level computing load. It's got amazing network speeds and the inbuilt support for mounting Drive folders right out of the box is just something else! Oh did I mention, the fact that Google gives you a K80 (or better) just for free is **wow**! But like they say, there is no free meal, neither is this (of sorts)._

<hr />
For anyone who doesn't know what Colab is: It's this amazing SaaS(I think, correct me if I'm wrong) that has the interface of a Jupyter Notebook that runs either on a hosted or a local environment. In simpler words, you can execute Python (and a few other languages) code either on Google's hardware or your own. Google further allows you to choose if you want to run your code on CPUs, GPUs or TPUs (_so fancy_).<br /><br />
Before I start my rant, I just want to get this cleared. Colab is _AMAZING_, it's got everything a student who wants access to fancy stuff but isn't willing to pay for hardware could wish for. It's got 12 hour runtimes, access to very fast internet, oh and I almost forgot, it's based of Linux, so you can do practically anything on it as Jupyter Supports `!` prefixes for `bash` commands. So you could, in practice, compile kernels or just execute a "Hello World" in [Brainf\*ck](https://en.wikipedia.org/wiki/Brainfuck) for all you care. <br /><br />
Now, before you start screaming at me, Yes I know that Google recommends Colab only for interactive users (read: [Limits](https://research.google.com/colaboratory/faq.html#resource-limits)) and not for heavy training loads, but when I have such a thing in front of me, can you really blame me for wanting to abuse it? I mean, it's natural and if you're saying that you'd never thought of doing it, stop lying.<br /><br />

# Backstory

For my senior year project, our group decided to tackle the problem statement of Image Deblurring, and we made some progress with it, and finally the day came when we had to begin training. Our college had given us access to a Quadro P1000 which was decent, but each epoch took us about a day to finish. <br /><br />
As our experimentation continued, we wanted to explore an alternative approach to the same problem, but we were very reluctant to stop the training that we'd started a few weeks back. So I proposed that we try and use Colab, (because why not?) thinking I can circumvent the 12 hour runtime limit by restarting the session twice a day, all in all sounds like cool a plan. <br /><br />
Our training dataset was approximately 45GB (340k images) in size and we decided to get a Google One subscription and pay a nominal fee of 130 INR a month and it was sorted.<br /><br />
Just a few clarifications:

- We had RDP(-ish) access to our college PC and decided to use that to upload our 45GB to the drive. This was post lockdown and the bandwidth would be phenomenal.
- We (obviously) weren't going to upload a folder with that many images, it would take ages. We'd zipped it up so it would be a single file upload, and then unzip it by using Colab (it had access to GDrive, and would be a piece of cake (or so I thought))

# #1 - Google Drive can't purge files.

After we zipped and uploaded the file, the next logical step was to unzip it, and things were looking to be really really bright, until they weren't.

After I set unzip to run for a night, I woke up with a very common error, saying `Runtime has timed out`. Cool, no biggie, just delete all the files and restart yeah? Except no.

When I tried to delete the 140k or so images that were unzipped, I realised that Drive wasn't accurately showing the free space left (which should've been 55GB). It displayed an available space of 38GB, which was alarming. I did what any inexperienced person would, panicked. _Where is all the extra space going?_ _Was the 100GB really some sort of scam where I couldn't write again and again over it?_

A few panicky Google searches didn't lead me anywhere. _Was the problem so stupid that no one had bothered asking about it?_

Maybe an hour or so later, of doing the worst thing a computer engineer can do: "Do the same actions and expect different results", I noticed that the free space was now 40GB, which hit me to my first realisation.

**Google Drive doesn't really delete a large number of files at once, it does it in batches; when I hit delete on the folder with 120k or so images, the Drive Engine would trash maybe 300 items at once and I had to manually clear the trash.**

I mean, as a student who's always been in praise of how robust and star-spangled awesome Google's architecture was, I realised, that it wasn't perfect. (Yes I know, the scale of GDrive is probably in petabytes and being able to handle so much data is already impressive beyond doubts, but can you really blame me for being a _**little**_ greedy?)

# #2 - Writes into a mounted GDrive are _asynchronous_

So after the colossal failure of unzipping it in one go. We thought, let's split up the huge folder into smaller folders with 50k images each so even if a timeout occurred, we would only need to clear 50k images and not the whole thing. Cool? Cool.

So with a lot of vigour, I re-attempted; split the dataset into 7 folders, zipped them, uploaded them and began.

A part of me thought, let's just start two simultaneous sessions to unzip, but (luckily), I stopped myself.

The same boilerplate happened, mount the drive, change to the right directory and run `!unzip ...`. Done right? Now all I had to do is comeback sometime later and restart. But wait, why do all that? I'm not from the stone age, I can make my life easier.

A quick Google search about for loops in bash later, I was overjoyed with what the final result looked like. A clean for loop that would run for each of the 7 zips and `echo` the status once it's done.

A routine status check 2 or so hours later, and I noticed something, which I so desperately wanted to shrug off to browser caching (oh, I prayed this would be the case).

My Colab Notebook was telling me that it had finished unzipping 4 folders, but I could only see 3 on my drive. _Weird_. A couple of hard refreshes, incognito mode checks and checking the drive from my phone, I was convinced that those files weren't actually on my drive. **How's that possible?**

A mounted drive, by all my experience and intuitions was just supposed to be an abstraction, right? I have NTFS drives mounted on my Linux system, and when I write a file to them, they usually show up.

But that wasn't happening, and I was baffled. Again, like before, a lot of panicked searches later, hoping to see _something_ in the documentation, I come across [this](https://github.com/googlecolab/colabtools/issues/287#issuecomment-478098785). It's a reply from the Colab team on an old issue raised by `@mantou16` (Thank you!)

{% include image.html url="/assets/2/async-writes.png" local=true %}

**What this means is, when I write onto the mounted drive, there is no guarantee when the files _actually_ show up on my drive, it could be in a few seconds or an hour. _OH AND YES_, If you're wondering, if I timeout before that call finishes, then those files vanish. _POOF!_**

Note: Google has a function `drive.flush_and_unmount()` which you can run to flush all your writes, but it forces you to unmount the drive, which isn't really helpful. Also, if you haven't guessed, the runtime of this function is also indeterminate, it could take a minute, or more than an hour. And yes if the timeout happens when this is running, again _POOF!_

# #3 - Reads from a mounted GDrive are **_also asynchronous_**

#2 caused us a lot of headaches. To circumvent it. We decided to take the _normal_ way out.

I set up the GDrive client for Windows(Yes, Google has long promised one for Linux, but hasn't delivered.), and started uploading my dataset, unzipped, a single image at a time (UGH!)

Fast Forward 3 days, the dataset is uploaded. No more unzipping required 🥳🥳.

Our training loop has a simple DataLoader which uses `os.listdir()` and `imread()`, the typical.

Just to recap, ~340k images; 7 folders, 6 of which have 50k images and the last one has ~40k. We begin training, and BOOM it works, WOHOOO! right? Wrong.

Colab was reporting an epoch time of a minute😱. (It took 23 hours on a P1000). I knew Colab was fast, but not this fast. Something was up.

I added a few (okay more than a few) sanity checks, and as suspected, something was wrong.

It showed me a total training dataset size of **_0 images_**. What? Back to more checks; Images were there on the drive, the path was correct, drive had mounted accurately. All seemed to be right except it wasn't working.

Back to googling, luckily this time, the Colab team did have an official solution. Read it in their words [here](https://research.google.com/colaboratory/faq.html#drive-timeout).

{% include image.html url="/assets/2/timeout.png" local=true %}

Basically what they say is: I/O operations such as `os.listdir()` on a mounted drive are _asynchronous_ (Ugh, at this point I start to hate this word). This had a two fold problem, not only would the files not get read, my Python code would continue like nothing was wrong. **The least they could do is throw an exception**.

They suggest moving folders into smaller subfolders, so that Colab wouldn't time out. I obviously couldn't do that in Colab because the writes were asynchronous too. **UGH**.

So back to the GDrive client. Wrote a python script to divide it into 341 folders, each having 1k or so files, and the upload resumes.

# #4 - 12 hours of a session time is a scam.

Fast Forward 4 more days, upload has finished. And Colab finally agrees to read the files, I see the magic number of 340k files, and I think to myself, YAY!

The training runs super super smooth, where it now took around 10 hours per epoch (that's an ungodly 56% increase), and I think to myself that maybe it was all worth it.

Learning from my experience with asynchronous writes, I decided to change the save frequency to every 20k iterations, so that even if I did lose some training time, it wouldn't be a lot.

The first few days were a breeze, I'd restart it twice a day and it went very well. After which some sort of Google Algo flagged my account because it would refuse to give me a GPU runtime, and if it did, it would timeout within the hour.

YES, I KNOW, Google prefers interactive users, bite me.

Our effective training time reduced to 12 hours every 2 days or so. So all the gain we had because of the better hardware, we'd lost because of the time outs.

This problem is listed as the last one because Google warns us quite explicitly that they prefer interactive users. Even for Colab Pro, Google doesn't _guarantee_ a runtime always, they just say that there's a higher chance that you'll get one

{% include image.html url="/assets/2/colab-pro.png" local=true %}

I just got a little greedy and decided to work around the limitations Google set for me. For a few, I emerged victorious; for others, I humbly accept defeat.

**TL;DR**: Google Colab is nice, don't try and get smart by overusing it, it's really not worth it.
<br /><br />
This is all for you, for now!
