---
layout: post
title: Hacking my virtual memory
date: 2020-06-13 20:00:00 +0530
excerpt: More interesting than it sounds, I promise!
categories: [tech, code]
comments: true
read_time: 15
---

**Disclaimer**: _Unlike the previous posts which talked about an experience of mine, this is just one of my fun (it's a subjective word) experiments. Note the idea of doing this stemmed from me wanting to write about it, and not the other way around, so if you're reading this, I succeeded._

**Disclaimer 2**: _The title might be a little clickbaity, but I promise it's pretty cool, so read on!_

# Introduction

While I'm writing this, I have no idea how I'm going to do what I want to do; I just know it is possible theoretically, so I'm going to work my way through the problem and hopefully take you all through the process of it all.

**What I want to do**: When you declare a string in your program `char str[] = "ThisBlogIsPrettyCool"`, I know it gets stored somewhere in my memory. I also know that the memory is technically available to every other process on my PC, so theoretically, it should be possible to change it from outside that program, with that program never knowing about it, right?

## My environment

- Pop!\_OS 20.04
  - Linux pop-os 5.4.0-7634-generic #38~1591219791~20.04~6b1c5de-Ubuntu SMP Thu Jun 4 02:56:10 UTC 2 x86_64 x86_64 x86_64 GNU/Linux
- gcc version 9.3.0
- Python 3.8

But any version of Linux and Python3.x should work in theory, let me know if it doesn't.

## Prerequisites

- Very basic C programming
- Basic Python programming

# Some Concepts

## Key words

- Main Memory: Fancy word for the RAM
- Memory Address: A number that uniquely identifies where your data is stored in a storage device.
- Process: Fancy word used for a program (this definition is limited to the scope of this article).
- PID / Process ID - A unique number that identifies each process running in your system.

## Virtual Memory

In computing, virtual memory is a memory management technique, that abstracts the physical storage that you have. It maps memory addresses used by a program (called the Virtual Memory) into actual physical memory addresses used by storage devices.

This allows the computer to do all sorts of fancy stuff like:

- It can now show each process a continuous block of memory which can be mapped to non continuous blocks in the actual memory.
- You can now have a virtual memory spread across multiple RAM sticks or in some cases even a small fraction of your harddrive, with no extra work, because your program won't know where it's actually getting stored.

Now, somethings to remember:

- Each process has it's own virtual memory.
- The virtual memory is divided into distinct sections meant to store different things. Depending on your operating system, these sections may differ, but generically, it is the one shown below.

{% include image.html url="/assets/5/memory-layout.jpg" sourceurl="https://www.geeksforgeeks.org/memory-layout-of-c-program/"%}

Now, to anyone going _Heh?_, we don't need a lot for this article, just the following points:

- The text segment, basically stores the "code" of your program.
- The stack and the heap are on opposite ends of the virtual memory; the stack _grows_ downwards (yeah, seems a little counterintuitive, but that's the way it is), while the heap grows upwards.
- The heap is where all the dynamically allocated memory is stored (i.e., memory that is assigned to a program during runtime (basically, `malloc()` calls.)). To everyone who didn't understand the previous line, this is the part of the virtual memory we'll be hacking!

# The C program

We want a very basic C program that will create a string and store it in the heap.

{% highlight c%}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
char s[] = "ThisIsAGoodStArt";
char _ptr = malloc(sizeof(char) _ 17);
strcpy(ptr, s);
printf("%s", ptr);

return 0;
}
{% endhighlight %}

Running this gives us what we'd expect, just the string nothing else.

```
ThisIsAGoodStArt
```

Okay, now we need a few other things too.

- We know that each process has its own virtual memory, so we need to find out that the process id of this process is.
- As soon as this program ends, the string is removed from the memory by the OS, which serves us no good. So we need to run this program for as long as we want.
- We also want to get the location of the string in the virtual memory, we probably won't use it, but it'll be a good thing to have.

So let's make those changes.

{% highlight c%}
// Ignore all these files.
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <unistd.h>

int main() {

char s[] = "ThisIsAGoodStArt";
char _ptr = malloc(sizeof(char) _ 17);
int i = 0;

printf("The process id is: %d\n", (int) getpid());

strcpy(ptr, s);

while(++i) {
printf("#%d - %s : %p\n", i, ptr, ptr);
sleep(1);
}

return 0;
}
{% endhighlight %}

After which we get the following output that runs forever:

```
The process id is: 32612
#1 - ThisIsAGoodStArt : 0x558bfee292a0
#2 - ThisIsAGoodStArt : 0x558bfee292a0
#3 - ThisIsAGoodStArt : 0x558bfee292a0
#4 - ThisIsAGoodStArt : 0x558bfee292a0
#5 - ThisIsAGoodStArt : 0x558bfee292a0
#6 - ThisIsAGoodStArt : 0x558bfee292a0
...
```

Now, if you try and run this, you _*will*_ end up getting different numbers (Seriously, it is impossible for you to get the same exact output). Infact, you probably will get different number every time you run it.

Now we know that the process id is 32612, and the string in our memory starts from somewhere around `0x558a5508c2a0` (This is a base 16 number).

Cool. So far so good.

# /proc - This is seriously cool stuff.

The /proc directory in a Linux System, according to me is the coolest directory to mess around with. It's a trove of information for all the processes running in your computer.

**Nerd Talk**: /proc isn't a regular directory, but a virtual file system. It doesn't contain real files but runtime information about your entire system. _Again, how cool is that?_

The /proc directory has a lot of folders, each corresponding to a individual process. Here's mine:

<div>
<pre class="inline-code"><font color="#4E9A06"><b>➜  </b></font><font color="#06989A"><b>~</b></font> ls /proc
<font color="#3465A4"><b>1</b></font>     <font color="#3465A4"><b>1094</b></font>   <font color="#3465A4"><b>13</b></font>    <font color="#3465A4"><b>1408</b></font>  <font color="#3465A4"><b>1590</b></font>  <font color="#3465A4"><b>166</b></font>    <font color="#3465A4"><b>177</b></font>    <font color="#3465A4"><b>1834</b></font>   <font color="#3465A4"><b>20</b></font>     <font color="#3465A4"><b>2192</b></font>   <font color="#3465A4"><b>1095</b></font>  <font color="#3465A4"><b>2401</b></font>   <font color="#3465A4"><b>26752</b></font>  <font color="#3465A4"><b>281</b></font>    <font color="#3465A4"><b>28904</b></font>  <font color="#3465A4"><b>3125</b></font>  <font color="#3465A4"><b>3834</b></font>  <font color="#3465A4"><b>48</b></font>    <font color="#3465A4"><b>54</b></font>    <font color="#3465A4"><b>60</b></font>   <font color="#3465A4"><b>acpi</b></font>         iomem        mtrr           <font color="#3465A4"><b>tty</b></font>
<font color="#3465A4"><b>10</b></font>    <font color="#3465A4"><b><mark>32612</mark></b></font>   <font color="#3465A4"><b>1300</b></font>  <font color="#3465A4"><b>1440</b></font>  <font color="#3465A4"><b>1592</b></font>  <font color="#3465A4"><b>167</b></font>    <font color="#3465A4"><b>1773</b></font>   <font color="#3465A4"><b>18369</b></font>  <font color="#3465A4"><b>202</b></font>    <font color="#3465A4"><b>21921</b></font>  <font color="#3465A4"><b>2347</b></font>  <font color="#3465A4"><b>2405</b></font>   <font color="#3465A4"><b>26963</b></font>  <font color="#3465A4"><b>282</b></font>    <font color="#3465A4"><b>28955</b></font>  <font color="#3465A4"><b>3165</b></font>  <font color="#3465A4"><b>39</b></font>    <font color="#3465A4"><b>4856</b></font>  <font color="#3465A4"><b>5402</b></font>  <font color="#3465A4"><b>622</b></font>  <font color="#3465A4"><b>asound</b></font>       ioports      <font color="#06989A"><b>net</b></font>            uptime
<font color="#3465A4"><b>1055</b></font>  <font color="#3465A4"><b>1097</b></font>   <font color="#3465A4"><b>1302</b></font>  <font color="#3465A4"><b>1445</b></font>  <font color="#3465A4"><b>1594</b></font>  <font color="#3465A4"><b>16715</b></font>  <font color="#3465A4"><b>1776</b></font>   <font color="#3465A4"><b>18399</b></font>  <font color="#3465A4"><b>2056</b></font>   <font color="#3465A4"><b>21927</b></font>  <font color="#3465A4"><b>2348</b></font>  <font color="#3465A4"><b>2425</b></font>   <font color="#3465A4"><b>27</b></font>     <font color="#3465A4"><b>283</b></font>    <font color="#3465A4"><b>29</b></font>     <font color="#3465A4"><b>3171</b></font>  <font color="#3465A4"><b>4</b></font>     <font color="#3465A4"><b>50</b></font>    <font color="#3465A4"><b>559</b></font>   <font color="#3465A4"><b>63</b></font>   buddyinfo    <font color="#3465A4"><b>irq</b></font>          pagetypeinfo   version
<font color="#3465A4"><b>1056</b></font>  <font color="#3465A4"><b>1098</b></font>   <font color="#3465A4"><b>1305</b></font>  <font color="#3465A4"><b>1462</b></font>  <font color="#3465A4"><b>1595</b></font>  <font color="#3465A4"><b>1675</b></font>   <font color="#3465A4"><b>178</b></font>    <font color="#3465A4"><b>18408</b></font>  <font color="#3465A4"><b>21</b></font>     <font color="#3465A4"><b>21928</b></font>  <font color="#3465A4"><b>2349</b></font>  <font color="#3465A4"><b>2426</b></font>   <font color="#3465A4"><b>27064</b></font>  <font color="#3465A4"><b>284</b></font>    <font color="#3465A4"><b>29025</b></font>  <font color="#3465A4"><b>3188</b></font>  <font color="#3465A4"><b>40</b></font>    <font color="#3465A4"><b>504</b></font>   <font color="#3465A4"><b>56</b></font>    <font color="#3465A4"><b>630</b></font>  <font color="#3465A4"><b>bus</b></font>          kallsyms     partitions     version_signature
<font color="#3465A4"><b>1059</b></font>  <font color="#3465A4"><b>11</b></font>     <font color="#3465A4"><b>1307</b></font>  <font color="#3465A4"><b>1467</b></font>  <font color="#3465A4"><b>1596</b></font>  <font color="#3465A4"><b>168</b></font>    <font color="#3465A4"><b>1797</b></font>   <font color="#3465A4"><b>1842</b></font>   <font color="#3465A4"><b>21191</b></font>  <font color="#3465A4"><b>22</b></font>     <font color="#3465A4"><b>2350</b></font>  <font color="#3465A4"><b>2431</b></font>   <font color="#3465A4"><b>2708</b></font>   <font color="#3465A4"><b>28488</b></font>  <font color="#3465A4"><b>291</b></font>    <font color="#3465A4"><b>32</b></font>    <font color="#3465A4"><b>4046</b></font>  <font color="#3465A4"><b>5040</b></font>  <font color="#3465A4"><b>560</b></font>   <font color="#3465A4"><b>64</b></font>   cgroups      kcore        <font color="#3465A4"><b>pressure</b></font>       vmallocinfo
<font color="#3465A4"><b>1060</b></font>  <font color="#3465A4"><b>1107</b></font>   <font color="#3465A4"><b>1309</b></font>  <font color="#3465A4"><b>1476</b></font>  <font color="#3465A4"><b>1597</b></font>  <font color="#3465A4"><b>169</b></font>    <font color="#3465A4"><b>18</b></font>     <font color="#3465A4"><b>1844</b></font>   <font color="#3465A4"><b>21211</b></font>  <font color="#3465A4"><b>2201</b></font>   <font color="#3465A4"><b>2353</b></font>  <font color="#3465A4"><b>2444</b></font>   <font color="#3465A4"><b>275</b></font>    <font color="#3465A4"><b>28515</b></font>  <font color="#3465A4"><b>2912</b></font>   <font color="#3465A4"><b>3201</b></font>  <font color="#3465A4"><b>41</b></font>    <font color="#3465A4"><b>5046</b></font>  <font color="#3465A4"><b>566</b></font>   <font color="#3465A4"><b>65</b></font>   cmdline      keys         sched_debug    vmstat
<font color="#3465A4"><b>1064</b></font>  <font color="#3465A4"><b>1116</b></font>   <font color="#3465A4"><b>1315</b></font>  <font color="#3465A4"><b>1484</b></font>  <font color="#3465A4"><b>1599</b></font>  <font color="#3465A4"><b>17</b></font>     <font color="#3465A4"><b>1802</b></font>   <font color="#3465A4"><b>1847</b></font>   <font color="#3465A4"><b>21224</b></font>  <font color="#3465A4"><b>2205</b></font>   <font color="#3465A4"><b>2355</b></font>  <font color="#3465A4"><b>2455</b></font>   <font color="#3465A4"><b>27554</b></font>  <font color="#3465A4"><b>2854</b></font>   <font color="#3465A4"><b>2970</b></font>   <font color="#3465A4"><b>3207</b></font>  <font color="#3465A4"><b>42</b></font>    <font color="#3465A4"><b>507</b></font>   <font color="#3465A4"><b>567</b></font>   <font color="#3465A4"><b>66</b></font>   consoles     key-users    schedstat      zoneinfo
<font color="#3465A4"><b>1067</b></font>  <font color="#3465A4"><b>11535</b></font>  <font color="#3465A4"><b>1330</b></font>  <font color="#3465A4"><b>15</b></font>    <font color="#3465A4"><b>16</b></font>    <font color="#3465A4"><b>170</b></font>    <font color="#3465A4"><b>18026</b></font>  <font color="#3465A4"><b>185</b></font>    <font color="#3465A4"><b>2134</b></font>   <font color="#3465A4"><b>2219</b></font>   <font color="#3465A4"><b>2358</b></font>  <font color="#3465A4"><b>24835</b></font>  <font color="#3465A4"><b>276</b></font>    <font color="#3465A4"><b>28547</b></font>  <font color="#3465A4"><b>29956</b></font>  <font color="#3465A4"><b>326</b></font>   <font color="#3465A4"><b>429</b></font>   <font color="#3465A4"><b>5078</b></font>  <font color="#3465A4"><b>568</b></font>   <font color="#3465A4"><b>67</b></font>   cpuinfo      kmsg         <font color="#3465A4"><b>scsi</b></font>
<font color="#3465A4"><b>1072</b></font>  <font color="#3465A4"><b>11537</b></font>  <font color="#3465A4"><b>1336</b></font>  <font color="#3465A4"><b>1532</b></font>  <font color="#3465A4"><b>1600</b></font>  <font color="#3465A4"><b>17090</b></font>  <font color="#3465A4"><b>1805</b></font>   <font color="#3465A4"><b>18680</b></font>  <font color="#3465A4"><b>21495</b></font>  <font color="#3465A4"><b>222</b></font>    <font color="#3465A4"><b>2359</b></font>  <font color="#3465A4"><b>24837</b></font>  <font color="#3465A4"><b>27606</b></font>  <font color="#3465A4"><b>2859</b></font>   <font color="#3465A4"><b>3</b></font>      <font color="#3465A4"><b>33</b></font>    <font color="#3465A4"><b>430</b></font>   <font color="#3465A4"><b>5094</b></font>  <font color="#3465A4"><b>569</b></font>   <font color="#3465A4"><b>68</b></font>   crypto       kpagecgroup  <font color="#06989A"><b>self</b></font>
<font color="#3465A4"><b>1073</b></font>  <font color="#3465A4"><b>11614</b></font>  <font color="#3465A4"><b>1342</b></font>  <font color="#3465A4"><b>1535</b></font>  <font color="#3465A4"><b>1601</b></font>  <font color="#3465A4"><b>17121</b></font>  <font color="#3465A4"><b>18082</b></font>  <font color="#3465A4"><b>18681</b></font>  <font color="#3465A4"><b>2151</b></font>   <font color="#3465A4"><b>2231</b></font>   <font color="#3465A4"><b>2372</b></font>  <font color="#3465A4"><b>24923</b></font>  <font color="#3465A4"><b>277</b></font>    <font color="#3465A4"><b>28598</b></font>  <font color="#3465A4"><b>30</b></font>     <font color="#3465A4"><b>330</b></font>   <font color="#3465A4"><b>44</b></font>    <font color="#3465A4"><b>51</b></font>    <font color="#3465A4"><b>57</b></font>    <font color="#3465A4"><b>848</b></font>  devices      kpagecount   slabinfo
<font color="#3465A4"><b>1075</b></font>  <font color="#3465A4"><b>1167</b></font>   <font color="#3465A4"><b>1346</b></font>  <font color="#3465A4"><b>1538</b></font>  <font color="#3465A4"><b>1602</b></font>  <font color="#3465A4"><b>17241</b></font>  <font color="#3465A4"><b>18104</b></font>  <font color="#3465A4"><b>187</b></font>    <font color="#3465A4"><b>2156</b></font>   <font color="#3465A4"><b>22468</b></font>  <font color="#3465A4"><b>2373</b></font>  <font color="#3465A4"><b>2503</b></font>   <font color="#3465A4"><b>27721</b></font>  <font color="#3465A4"><b>2860</b></font>   <font color="#3465A4"><b>30162</b></font>  <font color="#3465A4"><b>331</b></font>   <font color="#3465A4"><b>45</b></font>    <font color="#3465A4"><b>512</b></font>   <font color="#3465A4"><b>570</b></font>   <font color="#3465A4"><b>862</b></font>  diskstats    kpageflags   softirqs
<font color="#3465A4"><b>1077</b></font>  <font color="#3465A4"><b>1177</b></font>   <font color="#3465A4"><b>1352</b></font>  <font color="#3465A4"><b>1540</b></font>  <font color="#3465A4"><b>1603</b></font>  <font color="#3465A4"><b>173</b></font>    <font color="#3465A4"><b>18123</b></font>  <font color="#3465A4"><b>18742</b></font>  <font color="#3465A4"><b>2157</b></font>   <font color="#3465A4"><b>2266</b></font>   <font color="#3465A4"><b>2374</b></font>  <font color="#3465A4"><b>2524</b></font>   <font color="#3465A4"><b>27800</b></font>  <font color="#3465A4"><b>2863</b></font>   <font color="#3465A4"><b>30197</b></font>  <font color="#3465A4"><b>34</b></font>    <font color="#3465A4"><b>4542</b></font>  <font color="#3465A4"><b>5175</b></font>  <font color="#3465A4"><b>571</b></font>   <font color="#3465A4"><b>863</b></font>  dma          loadavg      stat
<font color="#3465A4"><b>1081</b></font>  <font color="#3465A4"><b>1184</b></font>   <font color="#3465A4"><b>1356</b></font>  <font color="#3465A4"><b>1554</b></font>  <font color="#3465A4"><b>1611</b></font>  <font color="#3465A4"><b>1735</b></font>   <font color="#3465A4"><b>1814</b></font>   <font color="#3465A4"><b>19237</b></font>  <font color="#3465A4"><b>2159</b></font>   <font color="#3465A4"><b>2283</b></font>   <font color="#3465A4"><b>2375</b></font>  <font color="#3465A4"><b>2598</b></font>   <font color="#3465A4"><b>27858</b></font>  <font color="#3465A4"><b>2864</b></font>   <font color="#3465A4"><b>30212</b></font>  <font color="#3465A4"><b>3489</b></font>  <font color="#3465A4"><b>4568</b></font>  <font color="#3465A4"><b>519</b></font>   <font color="#3465A4"><b>572</b></font>   <font color="#3465A4"><b>864</b></font>  <font color="#3465A4"><b>driver</b></font>       locks        swaps
<font color="#3465A4"><b>1085</b></font>  <font color="#3465A4"><b>12</b></font>     <font color="#3465A4"><b>1366</b></font>  <font color="#3465A4"><b>1558</b></font>  <font color="#3465A4"><b>162</b></font>   <font color="#3465A4"><b>174</b></font>    <font color="#3465A4"><b>18155</b></font>  <font color="#3465A4"><b>1931</b></font>   <font color="#3465A4"><b>2162</b></font>   <font color="#3465A4"><b>2286</b></font>   <font color="#3465A4"><b>2379</b></font>  <font color="#3465A4"><b>26</b></font>     <font color="#3465A4"><b>27867</b></font>  <font color="#3465A4"><b>28753</b></font>  <font color="#3465A4"><b>30230</b></font>  <font color="#3465A4"><b>35</b></font>    <font color="#3465A4"><b>46</b></font>    <font color="#3465A4"><b>52</b></font>    <font color="#3465A4"><b>573</b></font>   <font color="#3465A4"><b>9</b></font>    execdomains  mdstat       <font color="#3465A4"><b>sys</b></font>
<font color="#3465A4"><b>1088</b></font>  <font color="#3465A4"><b>1216</b></font>   <font color="#3465A4"><b>1373</b></font>  <font color="#3465A4"><b>1561</b></font>  <font color="#3465A4"><b>163</b></font>   <font color="#3465A4"><b>1752</b></font>   <font color="#3465A4"><b>1818</b></font>   <font color="#3465A4"><b>19672</b></font>  <font color="#3465A4"><b>2165</b></font>   <font color="#3465A4"><b>2295</b></font>   <font color="#3465A4"><b>2386</b></font>  <font color="#3465A4"><b>2639</b></font>   <font color="#3465A4"><b>279</b></font>    <font color="#3465A4"><b>2880</b></font>   <font color="#3465A4"><b>30237</b></font>  <font color="#3465A4"><b>36</b></font>    <font color="#3465A4"><b>4661</b></font>  <font color="#3465A4"><b>53</b></font>    <font color="#3465A4"><b>576</b></font>   <font color="#3465A4"><b>949</b></font>  fb           meminfo      sysrq-trigger
<font color="#3465A4"><b>1090</b></font>  <font color="#3465A4"><b>1267</b></font>   <font color="#3465A4"><b>1385</b></font>  <font color="#3465A4"><b>1576</b></font>  <font color="#3465A4"><b>164</b></font>   <font color="#3465A4"><b>1753</b></font>   <font color="#3465A4"><b>182</b></font>    <font color="#3465A4"><b>19747</b></font>  <font color="#3465A4"><b>21786</b></font>  <font color="#3465A4"><b>23</b></font>     <font color="#3465A4"><b>2390</b></font>  <font color="#3465A4"><b>26467</b></font>  <font color="#3465A4"><b>28</b></font>     <font color="#3465A4"><b>2883</b></font>   <font color="#3465A4"><b>30421</b></font>  <font color="#3465A4"><b>369</b></font>   <font color="#3465A4"><b>47</b></font>    <font color="#3465A4"><b>5352</b></font>  <font color="#3465A4"><b>58</b></font>    <font color="#3465A4"><b>950</b></font>  filesystems  misc         <font color="#3465A4"><b>sysvipc</b></font>
<font color="#3465A4"><b>1091</b></font>  <font color="#3465A4"><b>1288</b></font>   <font color="#3465A4"><b>1390</b></font>  <font color="#3465A4"><b>1588</b></font>  <font color="#3465A4"><b>165</b></font>   <font color="#3465A4"><b>1764</b></font>   <font color="#3465A4"><b>1823</b></font>   <font color="#3465A4"><b>198</b></font>    <font color="#3465A4"><b>21860</b></font>  <font color="#3465A4"><b>2303</b></font>   <font color="#3465A4"><b>2396</b></font>  <font color="#3465A4"><b>26468</b></font>  <font color="#3465A4"><b>280</b></font>    <font color="#3465A4"><b>28858</b></font>  <font color="#3465A4"><b>3071</b></font>   <font color="#3465A4"><b>38</b></font>    <font color="#3465A4"><b>475</b></font>   <font color="#3465A4"><b>536</b></font>   <font color="#3465A4"><b>59</b></font>    <font color="#3465A4"><b>976</b></font>  <font color="#3465A4"><b>fs</b></font>           modules      <font color="#06989A"><b>thread-self</b></font>
<font color="#3465A4"><b>1092</b></font>  <font color="#3465A4"><b>1289</b></font>   <font color="#3465A4"><b>14</b></font>    <font color="#3465A4"><b>1589</b></font>  <font color="#3465A4"><b>1657</b></font>  <font color="#3465A4"><b>1767</b></font>   <font color="#3465A4"><b>1827</b></font>   <font color="#3465A4"><b>2</b></font>      <font color="#3465A4"><b>2187</b></font>   <font color="#3465A4"><b>2318</b></font>   <font color="#3465A4"><b>24</b></font>    <font color="#3465A4"><b>26658</b></font>  <font color="#3465A4"><b>2802</b></font>   <font color="#3465A4"><b>2889</b></font>   <font color="#3465A4"><b>30862</b></font>  <font color="#3465A4"><b>3816</b></font>  <font color="#3465A4"><b>4781</b></font>  <font color="#3465A4"><b>5367</b></font>  <font color="#3465A4"><b>6</b></font>     <font color="#3465A4"><b>977</b></font>  interrupts   <font color="#06989A"><b>mounts</b></font>       timer_list
</pre>
</div>
Each item listed in a dark blue colour is a folder, and the name corresponds to the PID of the process. Now we know the process ID of our process is `32612`, so lets peek inside that folder. 
<div>
<pre class="inline-code"><font color="#4E9A06"><b>➜  </b></font><font color="#06989A"><b>32612</b></font> ls
arch_status      environ    mountinfo      personality   statm
<font color="#3465A4"><b>attr</b></font>             <font color="#06989A"><b>exe</b></font>        mounts         projid_map    status
autogroup        <font color="#3465A4"><b>fd</b></font>         mountstats     <font color="#06989A"><b>root</b></font>          syscall
auxv             <font color="#3465A4"><b>fdinfo</b></font>     <font color="#3465A4"><b>net</b></font>            sched         <font color="#3465A4"><b>task</b></font>
cgroup           gid_map    <font color="#3465A4"><b>ns</b></font>             schedstat     timers
clear_refs       io         numa_maps      sessionid     timerslack_ns
cmdline          limits     oom_adj        setgroups     uid_map
comm             loginuid   oom_score      smaps         wchan
coredump_filter  <font color="#3465A4"><b>map_files</b></font>  oom_score_adj  smaps_rollup
cpuset           maps       pagemap        stack
<font color="#06989A"><b>cwd</b></font>              mem        patch_state    stat
</pre>
</div>

For our project we only need to look at two files:

- /proc/32612/maps
- /proc/32612/mem

## /proc/pid/maps

From `man proc` (Basically a manual page)

```
  /proc/[pid]/maps
        A  file containing the currently mapped memory regions and their
        access permissions.  See mmap(2) for  some  further  information
        about memory mappings.
```

Okay, fancy stuff aside. Let's take a look at what my maps file looks like.

<pre class="inline-code"><font color="#4E9A06"><b>➜  </b></font><font color="#06989A"><b>~</b></font> cat /proc/32612/maps
558bfe5ca000-558bfe5cb000 r--p 00000000 08:04 1705261                    /home/yash/git_projects/blog/a.out
558bfe5cb000-558bfe5cc000 r-xp 00001000 08:04 1705261                    /home/yash/git_projects/blog/a.out
558bfe5cc000-558bfe5cd000 r--p 00002000 08:04 1705261                    /home/yash/git_projects/blog/a.out
558bfe5cd000-558bfe5ce000 r--p 00002000 08:04 1705261                    /home/yash/git_projects/blog/a.out
558bfe5ce000-558bfe5cf000 rw-p 00003000 08:04 1705261                    /home/yash/git_projects/blog/a.out
558bfee29000-558bfee4a000 rw-p 00000000 00:00 0                          [heap]
7f87d213b000-7f87d2160000 r--p 00000000 103:05 4628                      /usr/lib/x86_64-linux-gnu/libc-2.31.so
7f87d2160000-7f87d22d8000 r-xp 00025000 103:05 4628                      /usr/lib/x86_64-linux-gnu/libc-2.31.so
7f87d22d8000-7f87d2322000 r--p 0019d000 103:05 4628                      /usr/lib/x86_64-linux-gnu/libc-2.31.so
7f87d2322000-7f87d2323000 ---p 001e7000 103:05 4628                      /usr/lib/x86_64-linux-gnu/libc-2.31.so
7f87d2323000-7f87d2326000 r--p 001e7000 103:05 4628                      /usr/lib/x86_64-linux-gnu/libc-2.31.so
7f87d2326000-7f87d2329000 rw-p 001ea000 103:05 4628                      /usr/lib/x86_64-linux-gnu/libc-2.31.so
7f87d2329000-7f87d232f000 rw-p 00000000 00:00 0 
7f87d2346000-7f87d2347000 r--p 00000000 103:05 4236                      /usr/lib/x86_64-linux-gnu/ld-2.31.so
7f87d2347000-7f87d236a000 r-xp 00001000 103:05 4236                      /usr/lib/x86_64-linux-gnu/ld-2.31.so
7f87d236a000-7f87d2372000 r--p 00024000 103:05 4236                      /usr/lib/x86_64-linux-gnu/ld-2.31.so
7f87d2373000-7f87d2374000 r--p 0002c000 103:05 4236                      /usr/lib/x86_64-linux-gnu/ld-2.31.so
7f87d2374000-7f87d2375000 rw-p 0002d000 103:05 4236                      /usr/lib/x86_64-linux-gnu/ld-2.31.so
7f87d2375000-7f87d2376000 rw-p 00000000 00:00 0 
7ffeceb35000-7ffeceb56000 rw-p 00000000 00:00 0                          [stack]
7ffecebd1000-7ffecebd4000 r--p 00000000 00:00 0                          [vvar]
7ffecebd4000-7ffecebd5000 r-xp 00000000 00:00 0                          [vdso]
ffffffffff600000-ffffffffff601000 --xp 00000000 00:00 0                  [vsyscall]
</pre>

Okay, breathe in.

We see the `[heap]`, that sounds familiar. This line:

```
558bfee29000-558bfee4a000 rw-p 00000000 00:00 0                          [heap]
```

- `558bfee29000-558bfee4a000`: This is the address range of the heap for our program. Now going back to our code, we see that our string is stored at `0x558bfee292a0`, Now `0x558bfee29000 < 0x558bfee292a0 < 0x558bfee4a000`, which means now we have substantial proof that our string is somewhere in the heap. Good.
- The `rw` signifies that our program can read and write to this section (Duh!).

## /proc/pid/mem

From `man proc`

```
  /proc/[pid]/mem
      This file can be used to access the pages of a process's  memory
      through open(2), read(2), and lseek(2).
```

For people who haven't had a **mindblow** yet: The man page tells us /proc/pid/mem allows us access to the processors virtual memory like it's any other file on your PC, no special mumbojumbo.

Isn't that really really cool? (_Rhetorical_)

So, what do we have to do. Write a Python script which:

- Locates the addresses of the heap from `/proc/pid/maps`,
- Finds where our string is located in the heap, and
- Overwrite it. Simple!

_For anyone who wants to give this a shot on their own, stop reading here._

# The funnest part of them all

Writing the code. Now this is a fairly simple exercise and barely needs any explanation. Reading the code once is more than enough for you to understand it, else just scroll down to see the magic. This code is decently commented, but if you have any doubts / suggestions, please leave a comment below!

{% highlight python %}
#!/usr/bin/env python3
"""
No error handling done.
Run it as:
python3 name.py <pid of your c code> <string to replace> <replacement string>

NOTE: YOU MIGHT HAVE TO RUN THIS WITH SUDO
"""
from sys import argv

\_, pid, initial_string, new_string = argv[:4]

maps_filename = "/proc/{}/maps".format(pid)
mem_filename = "/proc/{}/mem".format(pid)

maps_file = open(maps_filename, 'r')

maps_file_line = maps_file.readline()

while maps*file_line:
temp = maps_file_line.split()
if temp[-1] != "[heap]": # If the line isn't describing the heap, move on.
maps_file_line = maps_file.readline()
else:
print("* Found the heap")
addr*range, perm, offset, dev, inode, path = temp
print("* Address range: ", addr_range)
print("\* Permissions: ", perm)

    try:
      assert('r' in perm and 'w' in perm) # Making sure we have all the permissions.
    except:
      print("Couldn't find permissions, try running with sudo?")
      maps_file.close()
      exit(1)

    low, high = addr_range.split("-") # Getting the addresses of my heap
    low = int(low, 16) # Getting it from Base 16
    high = int(high, 16) # Getting it from Base 16

    print("The heap starts at: {}".format(low))
    print("The heap ends at: {}".format(high))

    mem_file = open(mem_filename, 'rb+')

    # Now we want to seek to the start of our heap
    # The start address of the heap is given to us by low
    mem_file.seek(low)

    # Now, we need to read our heap
    # So from low, we read the size of the heap
    # Which is given by (high - low)
    heap = mem_file.read(high - low)

    # Now let's find our string
    # Because our heap is stored in binary, we'll convert our string to binary
    try:
      start_index = heap.index(bytes(initial_string, "ASCII"))
    except ValueError:
      print("Did not find {} in heap, are you sure that's what you want?".format(initial_string))
      maps_file.close()
      mem_file.close()
      exit(1)

    print("* Found {}".format(initial_string))

    print("* Writing {} in the heap".format(new_string))

    # We want to start writing our new string where
    # the old string is stored, which is at (low + start_index)
    mem_file.seek(low + start_index)
    mem_file.write(bytes(new_string, "ASCII"))

    maps_file.close()
    mem_file.close()

    break

{% endhighlight %}

# The magic

So I run my program as

<pre class="inline-code"><font color="#4E9A06"><b>➜  </b></font><font color="#06989A"><b>~</b></font> sudo python3 script.py 32612 ThisIsAGoodStArt ThisIsAmazing
* Found the heap
* Address range:  558bfee29000-558bfee4a000
* Permissions:  rw-p
The heap starts at: 94059765075968
The heap ends at: 94059765211136
* Found ThisIsAGoodStArt
* Writing ThisIsAmazing in the heap
</pre>

And back where my C code was executing, I see the magic.

```
...
#2456 - ThisIsAGoodStArt : 0x558bfee292a0
#2457 - ThisIsAGoodStArt : 0x558bfee292a0
#2458 - ThisIsAGoodStArt : 0x558bfee292a0
#2459 - ThisIsAGoodStArt : 0x558bfee292a0
#2460 - ThisIsAGoodStArt : 0x558bfee292a0
#2461 - ThisIsAGoodStArt : 0x558bfee292a0
#2462 - ThisIsAmazingArt : 0x558bfee292a0 <-- CHECK THIS OUT
#2463 - ThisIsAmazingArt : 0x558bfee292a0
#2464 - ThisIsAmazingArt : 0x558bfee292a0
#2465 - ThisIsAmazingArt : 0x558bfee292a0
```

{% include image.html url="/assets/5/mind-blow.gif" %}

**WOHOOOOOOOOOOO!**

> _Yes, 2465 means writing I had it on for 2400+ seconds (~40 minutes), which is how much time it took for me to smoothen over my code._

The string now reads and prints `ThisIsAmazingArt` (which it is, undeniably 😉) because we merely overwrote a part of the heap with our content, and didn't replace the whole string. Which is why `Art` is still stored in the heap. For better results try using strings of the same length.

# Serious Talk Time

Now, even though this is very fun for a side project, it has a few _very_ serious implications and things you should steer away from.

- Like our C program stored a dumb string in memory, know that usually a lot of important things are stored in program memory too, passwords, sensitive details etc., and all of them are usually accessible using the above method; so refrain from running programs with `sudo` or `Run as Administrator` on Windows unless you really trust it (Yes, Mr A, I'm looking at you too).
- A few of you reading this, with some experience in development might argue that passwords are hashed and not stored in the plain form, well yes, they are. That just prevents the malicious program from knowing what your password is, it doesn't stop it from replacing it in the memory with a different hash (which happen to be of the same size xD).

If any of you find any bugs, or have any suggestions/feedback, please feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/yashshah13/) or via [email](mailto:yashah1234@gmail.com)

Also, the source codes for this project are available on [GitHub](https://github.com/yashshah1/hack-my-memory)

This is all for you, for now!
