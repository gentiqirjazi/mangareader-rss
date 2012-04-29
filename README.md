mangareader-rss
===============

A simple DIY rss scrapper for mangareader.


What!?
======

Okay, there's more than that.

I discovered recently that a popular manga-reading website (I won't link to them but, hint: see the previous section) doesn't uses rss to alert users when a new chapter of their favorite series is available. So I took it upon me to "hack something out" (after all, ain't this what us hackers do?) and built myself a little scrapper that could be used with an rss reader to be alerted anytime one of my series was updated.


Usage:
======

Simply "node ./web.js" on your server and point your rss reader to http://your-host/[id]/ (with id replacing the id of your favorite series (on mangareader).


Testing:
========

I only tested this locally, I haven't yet decided on a server to host this for myself. I still need to translate the dates to "RFC-822 date-time" and give a guid to each item. Apart from this, the rss is good according to the w3c validator. But there's always room for improvement


The future:
===========

 * Support multiple series in one request (ie: http://your-host/[id1]/[id2]/.../[idN]/ )
 * "Real" rss ([node-rss](https://github.com/dylang/node-rss) should do the trick)
 * Accounts?
 * Pictures?
 * Code refactoring?
 * What's next?