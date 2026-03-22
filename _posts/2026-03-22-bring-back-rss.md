---
layout: post
title: "Bring Back RSS for Operational Security"
date: 2026-03-22 10:02:00
categories: opensource rss cti 
---

# Bring Back RSS for Operational Security

This post expands on ideas I previously presented at [Pass the SALT 2024](https://www.pass-the-salt.org/) in my talk *Bring Back RSS For Operational Security*.[^slides][^video] The short version is simple: operational security teams still need a reliable way to track change, automate collection, and reduce dependency on closed platforms. RSS already solves much of that problem.

Operational security teams spend an enormous amount of time watching for change.

- A new vulnerability advisory is published.
- A vendor updates a CSAF document.
- A threat actor leaks a new victim.
- A trusted researcher posts a new analysis.
- A CERT publishes an incident note.
- A MISP event is enriched.
- A public dashboard changes.

Most of these changes matter because they are *new*. And yet, in many security teams, we still collect this information in the most fragile way possible: by manually checking websites, relying on algorithmic social platforms, scraping pages that were never designed for machine consumption, or subscribing to closed platforms that add friction instead of removing it.

This is why RSS needs to come back in operational security.

Not as nostalgia. Not as a retro technology for bloggers. But as a simple, robust, auditable, automatable transport format for change detection and information sharing.

## RSS was built for exactly this problem

RSS and Atom were designed to describe streams of updates: a list of items, each with metadata such as a title, a publication date, a link, and often a short description. In other words, they were designed to answer a basic operational question:

**What changed since the last time I looked?**

That question is at the heart of security operations.

A SOC does not only need raw telemetry. It also needs structured awareness of external change:

- newly published vulnerabilities
- changes in vendor advisories
- new threat intelligence reports
- updates from trusted researchers
- public claims from threat actors
- newly published forensic write-ups
- software release notes with security impact
- updates in shared intelligence platforms

RSS solves this in a way that is boring, open, and dependable. That is precisely why it remains useful.

## Security operations need boring technology

Security teams already deal with enough complexity. We do not need every upstream source to invent its own notification model, API semantics, authentication flow, JavaScript-heavy frontend, and rate-limit strategy.

We need more sources that simply publish updates in a standard format.

RSS has several properties that make it especially attractive for operational use:

### It is simple

The model is easy to understand: a feed contains entries. Each entry points to something new or changed. There is very little ambiguity about the purpose.

### It is machine-readable

Feeds are meant to be consumed by software. This matters because security work quickly becomes repetitive at scale.

### It is decentralized

There is no central platform that decides what is visible. Every producer can publish their own feed. Every consumer can subscribe using their own tooling.

### It is automatable

Feeds can be polled, filtered, transformed, merged, archived, enriched, and redistributed with minimal effort.

### It is auditable

Unlike opaque recommendation engines and engagement-driven timelines, RSS is explicit. You know what you subscribed to. You can replay entries. You can store them. You can build deterministic workflows around them.

In operational security, those properties are not just nice to have. They are essential.

## Analyst fatigue is real, and RSS helps reduce it

Security analysts have a broad range of responsibilities: collecting events, detecting threats, triaging signals, analyzing context, and coordinating response. Repetitive collection work adds friction and contributes directly to fatigue. Automation is vital to keep humans focused on judgment rather than polling websites.[^slides]

RSS is one of the easiest ways to automate the collection of external updates without building a fragile dependency on every source.

Instead of asking analysts to remember twenty websites, ten vendor portals, and a handful of social accounts, you can move to a model like this:

- subscribe once
- normalize once
- filter continuously
- alert selectively
- archive automatically

That is a much healthier model for a SOC than "open browser tabs and refresh all morning."

## RSS is already useful in vulnerability management

One of the most obvious operational use cases is vulnerability intelligence.

The vulnerability ecosystem has changed significantly. NVD is no longer the only practical source of vulnerability information. We now have CNA publications, vendor advisories, CSAF feeds, project-level disclosures, and many other upstream sources. A modern vulnerability workflow must handle multiple sources, not just one canonical database.[^slides]

This is exactly where feeds shine.

A multi-source vulnerability platform can expose a feed per source, allowing teams to:

- monitor newly disclosed items
- separate vendor-specific updates from generic CVE publication
- follow only the ecosystems they care about
- trigger enrichment or prioritization pipelines when new entries appear
- generate internal dashboards or digests from the latest changes

In Vulnerability-Lookup, this model is natural: every source can expose recent updates through RSS or Atom, which makes it easy to subscribe, aggregate, and operationalize the latest disclosures.[^vulnerability-lookup][^example-nvd][^example-siemens]

That matters because vulnerability operations are not only about querying a database. They are also about tracking *what changed recently*.

## RSS is also a strong fit for threat intelligence collection

RSS should not be limited to vulnerability advisories.

Threat intelligence often starts with watching trusted public sources: researchers, incident responders, CERTs, vendor blogs, community projects, bot accounts, and public reporting streams.

A good example is Mastodon. By default, Mastodon accounts expose RSS feeds, which means public accounts can be consumed by standard feed tooling without depending on the platform interface. In practice, that makes it easy to subscribe to high-signal accounts and process updates automatically.[^slides]

This creates useful possibilities:

- track public ransomware victim disclosures
- monitor researcher reporting on campaigns, malware, or infrastructure
- watch topic-specific accounts for changes relevant to your organization
- filter by keywords, sectors, product names, or geography
- capture public reporting into internal knowledge systems

This is often more reliable than asking analysts to watch social media timelines manually.

## RSS works well as an operational building block

One reason RSS deserves a comeback is that it composes well.

It does not need to be the final destination. It can be the transport layer between a source and your workflows.

For example:

### Feed -> filter -> dashboard

A self-hosted reader can aggregate feeds from vendors, CERTs, researchers, and internal sources. Analysts can use this as a shared situational-awareness layer.[^newspipe]

### Feed -> transform -> alert

A script can parse entries, match on keywords, extract URLs, and generate notifications only for relevant updates.[^rss-tools]

### Feed -> enrich -> MISP

A workflow can ingest feed items, pull linked content, create or update MISP events, and extract indicators or context from the referenced material.[^misp-scraper]

### Feed -> merge -> publish

Multiple feeds can be combined into a reverse-chronological stream for a team portal, internal digest, or external situational-awareness page.[^rssmerge]

### Feed -> archive -> search

Entries can be stored over time, indexed, and replayed later for investigations, reporting, and retrospective analysis.

That modularity is one of RSS's biggest strengths. It is not trying to be the whole platform. It is a small, useful component that fits into many platforms.

## We should stop confusing "old" with "obsolete"

A recurring mistake in technology is assuming that older protocols are irrelevant simply because they are not fashionable.

RSS is old. So is email. So is DNS. So is syslog.

Age is not a good reason to discard a protocol that still solves a real problem effectively.

In fact, RSS compares favorably to many modern alternatives:

- it is easier to consume than most bespoke APIs
- it is easier to preserve than social media streams
- it is more interoperable than proprietary notification systems
- it is easier to self-host than most "intelligence platform" workflows
- it creates less lock-in than platform-native feeds and dashboards

The security community often talks about resilience, open standards, and reducing dependency on single vendors. RSS is aligned with all three.

## Practical use cases for operational security teams

Here are concrete places where RSS can provide immediate value:

### Vendor advisory monitoring

Subscribe to vendor advisory feeds, product security feeds, and CSAF-derived updates. Route them to product owners, vulnerability teams, or sector-specific analysts.

### CERT and CSIRT awareness

Track advisories, incident notes, and vulnerability communications from national and sectoral CERTs.

### Research monitoring

Follow high-signal blogs, project release feeds, and public researcher accounts.

### Threat actor visibility

In some cases, public reporting streams or bot-published updates can be monitored via RSS for early awareness and trend tracking.

### Internal SOC dashboarding

Use a self-hosted feed reader or custom dashboard as a collaborative stream of external operational context.

### MISP enrichment workflows

Consume feeds, extract linked content, and create or enrich events with contextual reports and indicators.

### Executive or sector digests

Merge multiple feeds and publish filtered summaries in text, HTML, or Markdown for targeted internal audiences.

## The tooling barrier is very low

Another reason to bring RSS back is that the tooling required is minimal.

You do not need a huge platform migration to start using it well.

A small stack can already deliver a lot of value:

- a self-hosted reader for aggregation and sharing
- a few scripts for filtering or transformation
- MISP integration for enrichment and extraction
- a merger tool for combined output
- a discovery tool to find feeds on target sites

This is attractive for small and medium teams because the cost of experimentation is low. It is also attractive for larger teams because the result is transparent and composable.

There is no mystery box here. Just feeds, parsers, filters, and workflows.

## RSS supports open security ecosystems

Operational security benefits when information can move between communities, tools, and organizations with as little friction as possible.

RSS supports that goal because it is:

- open
- well understood
- easy to generate
- easy to mirror
- easy to transform
- easy to redistribute

That makes it a good fit not only for consumption, but also for publication.

Security projects should publish feeds by default.

If you operate any of the following, you should consider exposing an RSS or Atom feed:

- vulnerability databases
- advisory portals
- research blogs
- release notes
- incident summaries
- MISP exports or derived views
- sector-specific intelligence summaries
- curated watchlists
- public dashboards of recent changes

Publishing a feed is a simple way to make your information more usable operationally.

## What the security community should do next

Bringing RSS back does not require a grand initiative. It requires a change in defaults.

### If you produce information

Publish a feed.

Do not force users to scrape your site or depend on a proprietary platform just to know what changed.

### If you build tools

Support feeds as both input and output.

Do not assume every workflow starts with a REST API and ends in a web UI.

### If you run a SOC or CSIRT

Treat feeds as first-class operational inputs, not as a side channel.

Build subscription, filtering, enrichment, and archival workflows around them.

### If you maintain intelligence-sharing platforms

Make RSS and Atom part of the interoperability story again.

Simple export formats often have the biggest practical impact.

## RSS is not dead. We just stopped using it enough.

RSS never disappeared. It was simply pushed to the margins while platforms optimized for attention, lock-in, and opacity.

But in operational security, those platform incentives are often the opposite of what we need.

- We need explicit subscriptions instead of algorithmic ranking.
- We need structured updates instead of noisy timelines.
- We need automation instead of manual checking.
- We need open formats instead of closed ecosystems.

RSS still provides that.

So yes, bring back RSS for operational security.

Not because it is old-school. Because it is useful. Because it is interoperable. Because it reduces friction. Because it helps analysts focus on what matters. And because a lot of security information is, at its core, simply a stream of changes that deserves a clean and standard way to be consumed.

## Footnotes

[^slides]: Pass the SALT 2024 slides, *Bring Back RSS For Operational Security*: <https://www.vulnerability-lookup.org/files/events/2024/20240603-bring-back-rss-for-operational-security.pdf>
[^video]: Pass the SALT 2024 recording: <https://passthesalt.ubicast.tv/videos/2024-bring-back-rss-for-operational-security/>
[^vulnerability-lookup]: Vulnerability-Lookup project: <https://github.com/cve-search/vulnerability-lookup>
[^example-nvd]: Example recent NVD Atom feed: <https://vulnerability.circl.lu/recent/nvd.atom>
[^example-siemens]: Example recent Siemens CSAF RSS feed: <https://vulnerability.circl.lu/recent/csaf_siemens.rss>
[^newspipe]: Newspipe: <https://github.com/cedricbonhomme/newspipe>
[^misp-scraper]: MISP scraper blog post: <https://www.misp-project.org/2022/08/08/MISP-scraper.html/>
[^rss-tools]: RSS tools collection: <https://github.com/adulau/rss-tools>
[^rssmerge]: `rssmerge.py` example: <https://github.com/adulau/rss-tools/blob/master/bin/rssmerge.py>
[^rssfind]: `rssfind.py` example: <https://github.com/adulau/rss-tools/blob/master/bin/rssfind.py>
