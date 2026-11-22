---
layout: page
title: Alexandre Dulaunoy
---

You just found the messy place of [Alexandre Dulaunoy](./about) who enjoys when human are using machines in unexpected ways. I break stuff and I do stuff.

## Interests

My interest primarily revolves around the elegance of [computer science](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD896.html), especially the concept of "simple and surprisingly effective" as described by Edsger W. Dijkstra in [EWD896](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD896.html). I actively apply these principles in practice through [free software crafting](https://github.com/adulau/), information security, and information representation.

When I want to take a break from computers, I engage in [photography](https://flickr.com/photos/adulau), attempting to convey my photographic emotions through a [photo blog](/photoblog/) and [artistic works](https://www.instagram.com/alexandredulaunoy/). I also have an interest in understanding the tough realities of biology and ecological systems, which I explore through [gardening](/cgi-bin/wiki.pl/GardeningStuff).

I also enjoy writing and actively contribute to an open reading club called [le sillon fictionnel](https://sillon-fictionnel.club/), which I help maintain.

## Activities

My day job is located in the information security field and especially in incident response, threat intelligence and security research.

Beside my day job, I'm also an intermittent security researcher in various organizations. Organizing a security conference called
[hack.lu](https://2025.hack.lu/) (it's the 18th edition in 2024) and [lecturing in various universities](/cours/) about information security (like [An introduction to network forensic, system forensic, memory forensic and malware analysis](/cours/dess-20172018/)) are also part of my regular activities.

If you're curious, you can check out a collection of my live activities on [this page](/status/) or the [automatic journal](/journal/) or the [archive of my Mastodon account](_mastodon).

## Projects

I build and maintain free software, open data, and open specifications with collaborators across several communities. My [GitHub profile](https://github.com/adulau/adulau/) traces how this work has evolved over time, and my [repositories](https://github.com/adulau?tab=repositories) include smaller experiments.

### Threat intelligence and collaborative analysis

I’m part of the [MISP](https://github.com/MISP) core team and work with the [AIL Project](https://github.com/ail-project), [D4 Project](https://github.com/D4-project), and [CIRCL](https://github.com/circl) communities. I also started a MISP hackathon to bring contributors together.

- [MISP](https://github.com/MISP/MISP) helps organisations collect, correlate, and share threat intelligence. Its [taxonomies](https://github.com/MISP/misp-taxonomies), [galaxies](https://github.com/MISP/misp-galaxy), [objects](https://github.com/MISP/misp-objects), and [warning lists](https://github.com/MISP/misp-warninglists) provide shared vocabularies, context, structured data, and checks for potentially misleading indicators.
- [misp-modules](https://github.com/MISP/misp-modules) provides reusable enrichment, import, export, and workflow actions for MISP and other threat intelligence tools. I continue to maintain it.
- [AIL](https://github.com/ail-project/ail-framework) supports investigations by collecting and analysing unstructured information. [Tempolocus](https://github.com/ail-project/tempolocus) helps analysts infer likely time zones and locations from activity patterns.
- [D4](https://github.com/D4-project/d4-core) provides distributed sensors for collecting and analysing security telemetry.
- [RansomLook](https://github.com/RansomLook/RansomLook) tracks ransomware groups' public activity, including leak-site publications.
- [Threat Actor Explorer](https://github.com/adulau/threat-actor-explorer) lets you explore the MISP galaxy threat-actor dataset locally in a browser.
- [Fanything](https://github.com/fanything-project) experiments with network fingerprints for correlating observations in threat intelligence.

### Vulnerabilities and disclosure

I co-develop and co-maintain tools with the [cve-search](https://github.com/cve-search) and [Vulnerability-Lookup](https://github.com/vulnerability-lookup) communities.

- [cve-search](https://github.com/cve-search/cve-search) aggregates vulnerability data for local searches by CVE and affected product.
- [Vulnerability-Lookup](https://github.com/vulnerability-lookup/vulnerability-lookup) helps correlate advisories, share sightings and comments, coordinate disclosure, and publish advisories.
- [git-vuln-finder](https://github.com/cve-search/git-vuln-finder) flags commit messages that may describe vulnerability fixes. [cpe-guesser](https://github.com/cve-search/cpe-guesser) suggests CPE identifiers from software names.
- [SHVI allocator](https://github.com/cve-search/allocator) was an experiment in community allocation of software and hardware vulnerability identifiers.

### Digital forensics and Internet infrastructure

- [hashlookup](https://github.com/hashlookup) helps investigators identify known files using reference datasets. [hashlookup-server](https://github.com/adulau/hashlookup-server) powers the [CIRCL hashlookup service](https://hashlookup.circl.lu/), and [hashlookup-forensic-analyser](https://github.com/hashlookup/hashlookup-forensic-analyser) uses it to report known and unknown files. [hashlookup-lib](https://github.com/hashlookup/hashlookup-lib) and [hashlookup-nsrl](https://github.com/hashlookup/hashlookup-nsrl) help import hash records and NIST NSRL datasets.
- [DomainClassifier](https://github.com/adulau/DomainClassifier) extracts and classifies domains, hostnames, and IP addresses from unstructured text. [ptrclassify](https://github.com/adulau/ptrclassify) infers likely IP usage and location from reverse-DNS hostnames.
- [mmdb-server](https://github.com/adulau/mmdb-server) serves geographic and autonomous-system lookups from MaxMind-format databases, including the [GeoOpen dataset](https://cra.circl.lu/opendata/geo-open/).
- I maintain [ssldump](https://github.com/adulau/ssldump) for analysing SSL/TLS traffic. [netbeacon](https://github.com/adulau/netbeacon) checks the accuracy and visibility of network capture systems.
- Earlier work on passive DNS and certificate monitoring includes [pdns-qof-server](https://github.com/adulau/pdns-qof-server), [pdns-toolkit](https://github.com/adulau/pdns-toolkit), and [crl-monitor](https://github.com/adulau/crl-monitor).

### Open standards

I work on open formats and specifications that help independent tools exchange information. I also participate in the [OASIS Cyber Threat Intelligence Technical Committee](https://github.com/oasis-tcs/cti-stix2).

#### GCVE

I contribute to the [Global CVE Allocation System](https://github.com/gcve-eu), which develops specifications for decentralised vulnerability identification and publication. The [GCVE Best Current Practices collection](https://github.com/gcve-eu/gcve.eu/tree/main/content/bcp) includes published documents and drafts under [open review](https://github.com/gcve-eu/gcve.eu/blob/main/content/process.md).

- **Directories and publication** cover [directory signature verification (BCP-01)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-01.md) and [decentralised publication (BCP-03)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-03.md).
- **Disclosure and governance** cover [vulnerability handling and disclosure (BCP-02)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-02.md), [identifier allocation (BCP-04)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-04.md), [numbering authority requirements (BCP-06)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-06.md), [record scope (BCP-09)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-09.md), and the [vulnerability assigner scorecard (BCP-13)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-13.md).
- **Records and provenance** cover the [GCVE vulnerability format (BCP-05)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-05.md) and its extensions for [AI-assisted annotations (X-01)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/extension/gcve-bcp-05-x-01.md), [patch-to-vulnerability generation provenance (X-02)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/extension/gcve-bcp-05-x-02.md), and [handling and disclosure timelines (X-03)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/extension/gcve-bcp-05-x-03.md).
- **Exploitation evidence and sightings** cover [KEV assertions and NKEV assessments (BCP-07)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-07.md) and the [vulnerability sighting format (BCP-12)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-12.md).
- **Affected products** are described in the [improved Common Platform Enumeration (BCP-10)](https://github.com/gcve-eu/gcve.eu/blob/main/content/bcp/gcve-bcp-10.md).

#### MISP standards

Through [misp-standard.org](https://www.misp-standard.org/), I help publish interoperable formats for collaborative intelligence. The [website sources](https://github.com/MISP/misp-standard.org) and [specification sources](https://github.com/MISP/misp-rfc) accompany the IETF Internet-Drafts for the [core](https://datatracker.ietf.org/doc/draft-dulaunoy-misp-core-format/), [taxonomy](https://datatracker.ietf.org/doc/draft-dulaunoy-misp-taxonomy-format/), [galaxy](https://datatracker.ietf.org/doc/draft-dulaunoy-misp-galaxy-format/), and [object template](https://datatracker.ietf.org/doc/draft-dulaunoy-misp-object-template-format/) formats.

#### Other IETF Internet-Drafts

- The [Passive DNS Common Output Format](https://datatracker.ietf.org/doc/draft-dulaunoy-dnsop-passive-dns-cof/) gives passive DNS services a common way to represent results. The [hashlookup format](https://datatracker.ietf.org/doc/draft-dulaunoy-hashlookup-format/) describes how tools can exchange hash records and metadata.
- The [Programming Methodology Framework](https://datatracker.ietf.org/doc/draft-dulaunoy-programming-methodology-framework/) documents a practical approach to software engineering. [Project source](https://github.com/adulau/pmf)
- The [Open Contributions Descriptor](https://datatracker.ietf.org/doc/draft-dulaunoy-open-contributions-descriptor/) describes how organisations can publish machine-readable information about their contributions to open source, open data, and open standards.
- The [Radio Image Framing Protocol](https://datatracker.ietf.org/doc/draft-dulaunoy-rifp/) explores image transmission over low-rate radio links. [Experimental implementation](https://github.com/adulau/rifp)

### Writing, teaching, and software maintenance

- [The Art of Pivoting](https://github.com/adulau/the-art-of-pivoting) is my open book on finding relationships in intelligence investigations using reproducible techniques.
- [threat-intelligence.eu](https://github.com/adulau/threat-intelligence.eu) collects open standards, documents, and methods for threat intelligence.
- [OSSTRL](https://github.com/adulau/osstrl) explores how evidence from repositories can help assess open source software readiness.
- [rss-tools](https://github.com/adulau/rss-tools) is a collection of utilities for working with feeds, including the ones behind this site's [journal](/journal/).
- I write about security research, software, and open data on [foo.be](https://www.foo.be/), lecture on information security, and help organise [hack.lu](https://hack.lu/).

### Earlier tools and experiments

- [Forban](https://github.com/adulau/Forban) shares files over local networks without Internet access. [Project documentation](/forban/)
- [hotp-js](https://github.com/adulau/hotp-js) implements the HOTP one-time password algorithm in JavaScript. The project dates back to 2009.

## Information classification, representation and sharing

While being an avid reader, I'm always interested in the topics where information classication plays a role to support readers or writers in making information more accessible. I did some work on [machine tag usage](/cgi-bin/wiki.pl/MachineTag) and also maintains a specific JSON machine tags database for information sharing like [MISP taxonomies](https://github.com/MISP/misp-taxonomies).
