---
layout: post
title:  "HTTP Headers Hashing (HHHash) or improving correlation of crawled content"
date:   2023-07-08 10:01:00
categories: infosec
---

# Improving classification and correlation of HTTP servers crawled/scanned

Alexandre Dulaunoy <a@foo.be>

# Context

When developing open-source tools like the [AIL project](https://www.ail-project.org/), it is common to encounter overwhelming crawling results that pose challenges for analysis. To address this issue, the use of pivotal or correlation hashes becomes crucial as they enable automatic grouping of content for further examination by human analysts. Common techniques for grouping specific sets of crawled items include utilizing cookie keys or eTag HTTP values. By leveraging a consistent crawling infrastructure, certain artifacts remain stable and can be employed for correlation purposes. Surprisingly, one often underutilized artifact is the list of returned HTTP headers from the crawled infrastructure. In order to explore this concept, I have hastily devised a minimal hash format, HHHash, which facilitates the hashing of similar returned HTTP headers. This approach holds great potential in improving the analysis of crawling results within the context of the AIL project or any CTI processes involving content crawling.

## HTTP Headers Hashing (HHHash)

HTTP Headers Hashing (HHHash) is a technique used to create a fingerprint of an HTTP server based on the headers it returns. HHHash employs one-way hashing to generate a hash value for the set of header keys returned by the server.

### Calculation of the HHHash

To calculate the HHHash, we concatenate the list of headers returned by the HTTP server. This list is ordered according to the sequence in which the headers appear in the server's response. Each header value is separated with `:`. 

You may be wondering why the set of headers is not sorted. This decision stems from our observations of a significant number of servers attempting to mimic other servers, often resulting in variations in the order of their returned HTTP headers.

The HHHash value is the SHA256 of the list.

### HHHash format

`hhh`:`1`:`20247663b5c63bf1291fe5350010dafb6d5e845e4c0daaf7dc9c0f646e947c29`

`prefix`:`version`:`SHA 256 value`

### Example

#### Calculating HHHash from a curl command

~~~
$ curl -s -D - https://www.circl.lu/ -o /dev/null  | awk 'NR != 1' | cut -f1 -d: | sed '/^[[:space:]]*$/d' | sed -z 's/\n/:/g' | sed 's/.$//' | sha256sum | cut -f1 -d " " | awk {'print "hhh:1:"$1'}
~~~

Output value
~~~
hhh:1:78f7ef0651bac1a5ea42ed9d22242ed8725f07815091032a34ab4e30d3c3cefc
~~~

## Limitations 

HHHash is an effective technique; however, its performance is heavily reliant on the characteristics of the HTTP client requests. Therefore, it is important to note that correlations between a set of hashes are typically established when using the same crawler or HTTP client parameters.

## Potential improvements

As you can observe, HHHash incorporates a version identifier in its value, enabling seamless updates to new hashing functions or concatenation strategies for the headers. One potential approach would be to employ a locality-sensitive hashing algorithm, which calculates distances between sets of headers and facilitates efficient comparisons.

# References

- A first version of a [Python library - HHHash](https://github.com/adulau/HHHash)
- [c-hhhash](https://github.com/hrbrmstr/c-hhhash) - C++ HTTP Headers Hashing CLI
- [go-hhhash](https://github.com/hrbrmstr/go-hhhash) - golang HTTP Headers Hashing CLI
- [R hhhash](https://github.com/hrbrmstr/hhhash) - R library HHHash

