---
layout: page
title: "Machine tags: from social bookmarking to MISP taxonomies"
permalink: /machine-tags/
description: "Alexandre Dulaunoy’s history of machine tags, from Flickr and del.icio.us to MISP taxonomies and the MISP taxonomy format Internet-Draft."
---

I used to tag my bookmarks with the licence, programming language, and sometimes my own rating of a free software project. Each detail fit in a small label that I could read and a program could parse. That habit, which I documented on my old MachineTag wiki page, later inspired my work on MISP taxonomies and the JSON format we use to share them.[^wiki]

## 2007–2009: Machine tags on the social web

Flickr introduced machine tags in January 2007, building on geotagging practices that Dan Catt had described as *triple tags* in 2006. In a tag like `geo:lat=49.6`, the namespace (`geo`) groups related properties, the predicate (`lat`) names a property, and the value (`49.6`) supplies the detail. The convention I used also allowed tags with just a namespace and predicate, such as `cs_lang:python`. That form later carried over to MISP.[^flickr]

The appeal was that I could add these labels through the same interface I used for ordinary tags. In November 2008 I documented a del.icio.us bookmark for Liquidsoap with `cs_lang:ocaml`, `license:gpl`, and `fs_rating:5`. A reader could see the language, licence, and my rating at a glance. A program could use the same labels to find other projects with those properties.

<figure>
  <img src="https://live.staticflickr.com/3194/3051929923_1ffe22f249.jpg" width="500" height="357" loading="lazy" alt="An annotated del.icio.us bookmark showing machine tags for a free software project's licence, programming language, and rating">
  <figcaption>My 2008 bookmarking example. <a href="https://www.flickr.com/photos/adulau/3051929923/">Original on Flickr</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a></figcaption>
</figure>

The experiments went beyond bookmarks. I wrote down the conventions so that other people and their tools could use the same tags.[^namespaces]

- **Language, software, and licences.** I used `language:en` for content and `cs_lang:python` for software. The `license` notes explored how to tell specific licences and versions apart. My `fs_rating` scale let me record a personal judgement alongside those more descriptive tags.
- **Archiving and integrity.** The Free Archive crawler could read `fa:archive` or `fa:mirror` as instructions. In a separate 2008 experiment, `linkfingerprint` put a digest or a reference to a detached signature in a tag associated with a URL. The bookmark could carry that extra information while leaving the URL easy to read.[^fingerprints]
- **Books, places, and species.** I tried ISBNs under `book`, coordinates under `geo`, and tags such as `taxonomy:binomial="Phacelia tanacetifolia"` on photographs. I also made a fuzzy binomial-name lookup from the 2009 Catalogue of Life data to help people find the spelling and copy the resulting tag.
- **Security.** The old index also listed machine tags for CVE identifiers and the Traffic Light Protocol (TLP). The same form could identify a vulnerability or express how information was meant to be shared.

Other communities took the idea in different directions. Flickr made namespaces and predicates searchable, and some tags served as references to records elsewhere, such as MusicBrainz entries. Astrotags made it possible to describe where a photograph pointed in the sky. In cloud infrastructure, RightScale used tags to match application servers and load balancers. Aaron Straup Cope’s reading list preserves these branches of the history.[^reading-list]

## Folksonomy versus taxonomy

A folksonomy grows from the labels people choose in practice. The freedom to coin a namespace or predicate let people try an idea without asking a central authority. If others found it useful, they could adopt it. The cost showed up when one meaning acquired several spellings, or when two groups used the same term differently. In my licence notes I listed `license:gpl-2-only` for version 2 alone. Someone else’s `license:gpl` was easy for software to parse, but could still leave the version and the “or later” question open.[^folksonomy]

A taxonomy records the terms a group has agreed to use and what each one means. Machine tags give both approaches the same syntax. A person can try out a new tag on a bookmark, and a community can publish a vocabulary when others need to filter, compare, or automate against it. In threat intelligence, that shared meaning matters because the receiving analyst may never meet the person who applied the tag.

The SPDX License List shows how that idea works in practice for software licensing. It publishes a structured vocabulary of licences and exceptions with standard identifiers, full names, and texts. A source file can declare `SPDX-License-Identifier: GPL-2.0-only` for version 2 alone, or use `GPL-2.0-or-later` when later versions are permitted. The list is available as JSON. Like MISP taxonomies, it pairs a compact label with a shared definition that different tools can look up and use consistently.[^spdx]

## 2015–2017: From individual tags to shared MISP vocabularies

In 2015 we wanted analysts in different organisations to share context alongside indicators. A team might need its own way to describe confidence, source reliability, or handling restrictions. By putting vocabularies in data files, we could add them as teams needed them without changing MISP’s core software for each model. The public MISP Taxonomies repository gives each namespace a `machinetag.json` file and lists the vocabularies in a manifest.[^misp]

The tag on a record is still a short string. The taxonomy file supplies the descriptions, versions, predicates, and any defined values. The Admiralty Scale, for example, uses separate tags for how reliable a source is and how credible a specific piece of information is.[^admiralty]

```text
admiralty-scale:source-reliability="b"
admiralty-scale:information-credibility="1"
```

András Iklódy and I published the first *MISP taxonomy format* Internet-Draft in October 2016. It describes how to exchange the vocabulary in JSON, so that another tool can interpret the same terms. The repository publishes vocabularies using that format, and the MISP standards site publishes the specification. As of November 2026, the latest revision in the IETF Datatracker is revision 12, published in January 2026 and recorded as expired in July.[^draft]

In 2017 I wrote about applying the format to estimative language. An analyst can attach a phrase such as “very likely” to a judgement. The vocabulary can also supply a numerical value for software that explicitly uses that scale. Both readers then have access to the terms the analyst worked with. [Automation and Estimative Language]({{ '/2017/03/Automation_and_Estimative_Language.html' | relative_url }})

## 2024–2026: What came out of it

In 2024 I wrote about using a taxonomy based on published cyber-harms research to distinguish impacts such as disrupted operations, reputational damage, and wider social harm. An analyst can record the kind of impact observed and filter for comparable incidents later. [Improving Cybersecurity Impact Taxonomies]({{ '/2024/12/Improving-Cybersecurity-Impact-Taxonomies.html' | relative_url }})

The March 2026 MISP Taxonomies release shows how both the collection and its maintenance have evolved. It expanded the NIS2 vocabulary, added a taxonomy for the EU AI Act, and moved towards reproducible UUIDs for namespaces, predicates, and values. A short string remains useful on the record, while stable identifiers help tools recognise the same vocabulary entry across updates.[^release]

In November 2026 I added the `misp-gathering` taxonomy to record where a collected event came from. Its local tags distinguish the module that collected the event from the upstream source that provided the data. This lets an analyst trace an event back to both the collector and the provider. [MISP gathering provenance taxonomy](https://github.com/MISP/misp-taxonomies/commit/277e3f408eb246b65619198a10a4a1640ea7a1ad)

## Looking ahead to 2027

January 2027 marks twenty years since Flickr introduced machine tags. The early work made it possible for people to invent and share labels. The MISP work added a way to publish the definitions and keep track of changes so other tools could use them. The question I still care about is whether analysts can use those shared definitions to compare observations across organisations while keeping the context and uncertainty of each judgement.

[^wiki]: The original wiki page brings together the namespace list, the del.icio.us example, and the discussion of how standalone tags relate to RDFa and microformats. [MachineTag archive](https://www.foo.be/archive/pages/MachineTag.html)

[^flickr]: Flickr’s January 2007 announcement describes geotagged photos and credits Dan Catt’s earlier writing on triple tags. My December 2007 Flickr post captures how much tagging had already become part of my daily habits. [Introducing Machine Tags](https://www.flickr.com/groups/api/discuss/72157594497877875/) · [Lost in Tagging](https://www.flickr.com/photos/adulau/2124178869/)

[^namespaces]: The archived notes show the individual experiments and their syntax. [Language](https://www.foo.be/archive/pages/MachineTagLanguage.html) · [Programming languages](https://www.foo.be/archive/pages/MachineTagCSLang.html) · [Licences](https://www.foo.be/archive/pages/MachineTagLicense.html) · [Free software ratings](https://www.foo.be/archive/pages/MachineTagFsRating.html) · [Free Archive](https://www.foo.be/archive/pages/MachineTagFreeArchive.html) · [Books](https://www.foo.be/archive/pages/MachineTagBook.html) · [Geotags](https://www.foo.be/archive/pages/MachineTagGeo.html) · [Scientific classification](https://www.foo.be/archive/pages/MachineTagTaxonomy.html)

[^fingerprints]: My experiment drew on the earlier Link Fingerprints Internet-Draft and explored putting the information in a bookmark’s metadata. [May 2008 post](https://www.foo.be/archive/pages/2008-05-02_Linkfingerprint_MachineTag.html) · [Link fingerprint namespace](https://www.foo.be/archive/pages/MachineTagLinkFingerprint.html) · [Link Fingerprints Internet-Draft](https://datatracker.ietf.org/doc/draft-lee-uri-linkfingerprints/)

[^reading-list]: Aaron Straup Cope’s collection follows Flickr’s API from wildcard queries to browsing namespaces and predicates, then to references across sites. It also records projects in astronomy, biodiversity, library cataloguing, and cloud infrastructure. [Machine Tags Reading List](https://github.com/straup/machinetags-readinglist/blob/master/machinetags-readinglist.md)

[^folksonomy]: Thomas Vander Wal describes folksonomy as classification that emerges from people tagging material for their own retrieval. My licence notes show how different readings of a single label can affect automated reuse. [Folksonomy](https://vanderwal.net/folksonomy.html) · [MachineTagLicense](https://www.foo.be/archive/pages/MachineTagLicense.html)

[^spdx]: SPDX maintains the licence and exception entries and publishes machine-readable versions of the list. Its source-file guidance explains how to declare an identifier in code. [SPDX License List](https://spdx.org/licenses/) · [Machine-readable data](https://github.com/spdx/license-list-data) · [Source-file guidance](https://spdx.dev/learn/handling-license-info/)

[^misp]: The public collection includes the JSON vocabularies, a manifest, and tools for generating tags. The earlier CIRCL training material illustrates how analysts use them in MISP. [MISP Taxonomies repository](https://github.com/MISP/misp-taxonomies) · [Classification using MISP](https://www.circl.lu/assets/files/misp-training/3.2-MISP-Taxonomy-Tagging.pdf)

[^admiralty]: The vocabulary describes `b` as “Usually reliable” and `1` as “Confirmed by other sources.” [Admiralty Scale taxonomy](https://github.com/MISP/misp-taxonomies/blob/main/admiralty-scale/machinetag.json)

[^draft]: The October 2016 submission already described JSON as a way to exchange machine-tag vocabularies. The Datatracker history records revisions and their status. [First Internet-Draft](https://datatracker.ietf.org/doc/draft-dulaunoy-misp-taxonomy-format/00/) · [Datatracker history](https://datatracker.ietf.org/doc/draft-dulaunoy-misp-taxonomy-format/history/) · [MISP taxonomy format specification](https://www.misp-standard.org/rfc/misp-standard-taxonomy-format.html)

[^release]: The release notes list additions to the vocabulary, its UUIDv5 transition, and improvements to schema validation. [MISP Taxonomies release 2026031300](https://github.com/MISP/misp-taxonomies/releases/tag/2026031300)
