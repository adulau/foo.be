#!/bin/bash

python3 ~/git/rss-tools/bin/rssmerge.py "https://git.foo.be/adulau.rss"  "http://api.flickr.com/services/feeds/photos_public.gne?id=31797858@N00&lang=en-us&format=atom" "https://github.com/adulau.atom" "https://paperbay.org/@a.rss" "https://infosec.exchange/@adulau.rss" -o markdown --maxitem 100 >status
cat status.md.template status >../_pages/status.md
