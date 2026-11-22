---
layout: post
title: "Monitoring agentic framework exposure with Offensive Agency and MISP"
date: 2026-11-22 15:30:00 +0100
description: "How the Offensive Agency gathering module turns public exposure statistics into MISP events and supports checks against an approved asset inventory."
---

In [my previous post]({{ '/2026/11/From_SATAN_to_Agentic_Attacks.html' | relative_url }}), I wrote about the infrastructure that makes agentic attacks possible. One practical question for defenders is which interfaces these frameworks expose to the Internet and whether any of our own assets appear in those observations.

Thanks to Fafner (\_KeyZee\_) for making the Offensive Agency tracker and its data available, and to ONYPHE for the underlying Internet scan data. The tracker publishes aggregate statistics and records of exposed web consoles and APIs. Its methodology explains how it separates probable from confirmed observations, handles shared CDN addresses, and defines an active IP as one seen during the preceding seven days.[^source]

![Offensive Agency’s statistics page showing the 16–22 November observation window and daily IP counts by framework]({{ '/assets/offensive-agency-misp/source-stats.png' | relative_url }})

*Offensive Agency source snapshot on 22 November 2026. Each chart point reflects the scans collected that day. The active count covers the full seven-day window.*

## From the tracker to a MISP event

I maintain `misp-modules` and developed the `offensive_agency` gathering module to put Fafner’s data to work in MISP. I wanted a daily view of exposure across the tracker and a separate way to check addresses in an inventory. The initial module is on `misp-modules` main, and MISP’s `3.0_wip` branch can use it as a feed source. The module fetches the provider’s data and builds a ZIP with a standard MISP feed manifest and event files. MISP checks the archive size and SHA-256 checksum, then hands the events to its normal feed importer.[^versions]

The module has two collection modes:

- **Exposure statistics.** Use an empty parameters object (`{}`). The module fetches the public statistics snapshot and creates one event per source date. The event contains the headline counts and a JSON attachment with the breakdowns and daily series.
- **Approved asset inventory.** Supply individual IP addresses in `asset_ips`. The module asks the provider for observations of those addresses and creates an event for each match. A missing address produces no event. A match can show when the provider first and last observed the software, the provider’s confidence, and the recorded network type.

Both modes use local `misp-gathering` tags for the collector and the source. I wrote about the history of those structured vocabularies in [Machine tags, from social bookmarking to MISP taxonomies]({{ '/machine-tags/' | relative_url }}).

## Set up the gathering feed

Enable the gathering service in MISP’s plugin settings and point it at the `misp-modules` instance running the new module. On the branch snapshot I tested, I enabled Offensive Agency by setting `Gathering_offensive_agency_enabled` to `true` under `Plugin` in MISP’s local `app/Config/config.php`.

Open **Feeds** in the **Sync** menu, then choose **Add Feed**. Choose **MISP modules** as the input source, select **Offensive Agency** as the gathering module, and set the parameters to `{}`. Enable the feed, keep caching off, and set distribution to **Your organisation only** for a local trial.[^setup]

![MISP 3.0 Add Feed dialog with the Offensive Agency module selected and an empty parameters object]({{ '/assets/offensive-agency-misp/misp-feed-setup.png' | relative_url }})

*The gathering feed form in the test instance. The empty object selects the statistics snapshot.*

The form returned a CSRF error on submission in the build I tested. I saved the feed through the authenticated MISP API with the following body for `POST /feeds/add`.

```json
{
  "Feed": {
    "name": "Offensive Agency daily statistics",
    "provider": "Offensive Agency",
    "input_source": "misp-modules",
    "source_format": "misp",
    "enabled": true,
    "caching_enabled": false,
    "distribution": 0,
    "settings": {
      "gathering": { "module": "offensive_agency", "parameters": {} }
    }
  }
}
```

The feed list offers **Fetch all events** for the saved feed. I queued the import with its equivalent, `POST /feeds/fetchFromFeed/{id}`, using the ID returned by MISP. The pinned `3.0_wip` build also needed a local fix for the ZIP download.[^download]

![MISP feed preview showing one Offensive Agency statistics event with seven attributes]({{ '/assets/offensive-agency-misp/misp-feed-preview.png' | relative_url }})

*MISP’s preview of the event dated by the provider’s statistics snapshot.*

## Read the imported observations

The 22 November 2026 statistics snapshot counted **7,873 active IPs** and **8,060 IPs in the tracker’s history**. The module produced one event with seven attributes. Five were counts, one linked back to the source, and one was the JSON attachment. These figures describe IPs observed by the tracker and its scanning coverage. A host can have several IP addresses, and the data can miss consoles on unscanned ports or paths.[^source]

![The imported Offensive Agency statistics event in MISP with its two local provenance tags]({{ '/assets/offensive-agency-misp/misp-event.png' | relative_url }})

*The imported statistics event with both local provenance tags.*

## What an inventory observation looks like in MISP

The public export and the per-host API share the same host fields, and the per-host response also includes `services`. The module now groups the triage fields in an `offensive-agency-observation` object and attaches the complete per-host JSON as `source-record`. [Public hosts export](https://offensive.agency/api/hosts.json) · [Host record import](https://github.com/MISP/misp-modules/pull/1172) · [Gathering module PR](https://github.com/MISP/misp-modules/pull/1173) · [Object template PR](https://github.com/MISP/misp-objects/pull/609)

For the walkthrough I used a synthetic response for `192.0.2.3`, a documentation address. In the feed settings above, I replaced the empty `parameters` object with this one. On an operational feed, use addresses from your approved inventory.

```json
{"asset_ips": ["192.0.2.3"]}
```

The imported object has eight attributes. These cover the IP address, source link, network type, country, operator, ASN (using MISP’s `AS` type), framework and confidence, and the downloadable JSON. The object and its IP attribute carry the first and last observation dates at UTC day precision. MISP also stored both local collection tags on the event.

[![MISP Objects tab showing the Offensive Agency observation, its eight attributes and the downloadable JSON]({{ '/assets/offensive-agency-misp/misp-asset-observation.png' | relative_url }})]({{ '/assets/offensive-agency-misp/misp-asset-observation.png' | relative_url }})

*The synthetic asset event in MISP. The `source-record` attachment preserves the details behind the summary.*

Here’s the complete 18-field JSON I downloaded from MISP, formatted for readability.

```json
{
  "ip": "192.0.2.3",
  "first_seen": "2026-11-18",
  "last_seen": "2026-11-20",
  "kind": "cdn",
  "country": "FR",
  "org": "Example operator",
  "asn": "AS64500",
  "tools": {"example": "probable"},
  "domains": [{"name": "agent.example", "tools": {"example": "probable"}}],
  "rdns": ["host.example"],
  "ports": {"example": [443]},
  "families": {"example": ["page"]},
  "classes": ["Example device class"],
  "clusters": ["example-cluster"],
  "c2": ["example-cohosted-label"],
  "sources": ["ctiscan", "ctiurl"],
  "titles": ["Example console"],
  "services": [{
    "port": 443,
    "tls": true,
    "last_seen": "2026-11-20",
    "cert_cn": ["agent.example"],
    "classes": ["Example device class"],
    "products": ["Example product"],
    "titles": ["Example console"],
    "tools": ["example"]
  }]
}
```

## How defenders can use the feed

I’d run the two feeds on the regular fetch schedule. The daily statistics show which frameworks are becoming more visible in the tracker. A separate inventory feed keeps the team focused on observations of its own assets.

If a match shows an exposed console, check who owned the address on the observation date and whether the service was meant to be public. Compare any hostnames and ports in `source-record` with your inventory and logs, especially when the IP belongs to a shared CDN. If you confirm an unexpected exposure, work with the owner to restrict access, verify the change in your own systems, and watch for later sightings.

The local `misp-gathering:source="offensive.agency"` tag makes the observations easy to find in MISP. Each match is a lead to review, so the module leaves `to_ids` off. The provider’s confidence describes the software it observed, while the operator’s intent remains unknown.

## A first experiment with gathering modules

I built this as a first experiment with the new `gathering` module type in `misp-modules`. I wanted to see how a public data source could become part of a regular feed workflow, with each event recording where the data came from and which module collected it. I’ll update this post as the module and its MISP integration evolve, especially as teams try it with their own inventories.

[^source]: Offensive Agency explains the source data, seven-day active window, confidence levels, and coverage limits. [Tracker methodology](https://offensive.agency/about) · [Statistics](https://offensive.agency/stats)

[^versions]: I ran the first walkthrough with MISP `6c6e4c5` on `3.0_wip` and misp-modules `668d9a6` on `main`. I used the same MISP instance with the updated collector and observation template for the inventory example. [MISP branch snapshot](https://github.com/MISP/MISP/tree/6c6e4c5c7f93a47e8213277ad43b2c90550c8d28) · [Initial gathering module PR](https://github.com/MISP/misp-modules/pull/1169)

[^setup]: The gathering guide documents the feed contract, local provenance tags, and revision handling. [Gathering module guide](https://github.com/MISP/misp-modules/blob/668d9a68971fb09deaada74c456bc505fdc3423d/documentation/mkdocs/gathering-guide.md)

[^download]: In the pinned core snapshot `CurlClient` replaced the callback that writes the ZIP to disk. I corrected the callback selection locally and enforced the byte limit during streaming. MISP then checked the downloaded file’s size and SHA-256 before extraction. [HTTP client](https://github.com/MISP/MISP/blob/6c6e4c5c7f93a47e8213277ad43b2c90550c8d28/app/Lib/Tools/CurlClient.php#L352-L405) · [Archive validation](https://github.com/MISP/MISP/blob/6c6e4c5c7f93a47e8213277ad43b2c90550c8d28/app/Lib/Tools/GatheringFeedTool.php#L145-L150)
