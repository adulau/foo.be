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

The feed list offers **Fetch all events** for the saved feed. I queued the import with its equivalent, `POST /feeds/fetchFromFeed/{id}`, using the ID returned by MISP.

![MISP feed preview showing one Offensive Agency statistics event with seven attributes]({{ '/assets/offensive-agency-misp/misp-feed-preview.png' | relative_url }})

*MISP’s preview of the source-dated event after the local download fix described below.*

## Read the imported observations

The 22 November 2026 statistics snapshot counted **7,873 active IPs** and **8,060 IPs in the tracker’s history**. The module produced one event with seven attributes. Five were counts, one linked back to the source, and one was the JSON attachment. These figures describe IPs observed by the tracker and its scanning coverage. A host can have several IP addresses, and the data can miss consoles on unscanned ports or paths.[^source]

![The imported Offensive Agency statistics event in MISP with its two local provenance tags]({{ '/assets/offensive-agency-misp/misp-event.png' | relative_url }})

*The imported event in the local MISP test instance after the download fix described below.*

## What an inventory observation looks like in MISP

I compared the fields in the public export with the data from the per-host API. They share the same host fields, and the per-host response also includes `services`. I added the complete per-host JSON to the gathering module as an attachment. The follow-up PR groups the triage fields in an `offensive-agency-observation` object and moves the attachment into its `source-record` field. [Public hosts export](https://offensive.agency/api/hosts.json) · [Host record import](https://github.com/MISP/misp-modules/pull/1172) · [Gathering module PR](https://github.com/MISP/misp-modules/pull/1173) · [Object template PR](https://github.com/MISP/misp-objects/pull/609)

For the walkthrough I used a synthetic response for `192.0.2.3`, a documentation address. In the feed settings above, I replaced the empty `parameters` object with this one. On an operational feed, use addresses from your approved inventory.

```json
{"asset_ips": ["192.0.2.3"]}
```

The imported object has eight attributes. These cover the IP address, source link, network type, country, operator, ASN (using MISP’s `AS` type), framework and confidence, and the downloadable JSON. The object and its IP attribute carry the first and last observation dates at UTC day precision. MISP also stored both local collection tags on the event.

[![MISP Objects tab showing the Offensive Agency observation, its eight attributes and the downloadable JSON]({{ '/assets/offensive-agency-misp/misp-asset-observation.png' | relative_url }})]({{ '/assets/offensive-agency-misp/misp-asset-observation.png' | relative_url }})

*The synthetic asset event imported into MISP using the proposed object template. The `source-record` attachment preserves the details behind the summary.*

I downloaded the attachment from MISP and compared all 18 fields with the fixture. Here is the JSON, formatted for readability.

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

Repeating the fixture fetch kept the same event and object. I also checked the upgrade from an earlier flat event. When a newer source revision arrived, MISP added the observation object to the existing event and kept its previously imported standalone attributes.

For day-to-day monitoring, keep the aggregate feed separate from an inventory feed. The aggregate events give a dated record of the provider’s observations. An inventory match gives your team something actionable to check against its asset owner, expected public exposure, and the observation dates. A shared CDN address can represent unrelated services. The provider’s confidence concerns the software it observed, while the operator’s intent remains unknown.

The module sets `to_ids` to false on the attributes. In aggregate mode it also disables correlation on each attribute. I can use the local `misp-gathering:source="offensive.agency"` tag to find the collection events and review them before using any of the information in a detection rule.

Once the feed is configured, use it in your regular feed fetch schedule. The module keys a statistics event by the upstream snapshot date. An unchanged snapshot keeps the same event UUID and source timestamp, so MISP can skip it on repeat pulls. A new snapshot date gets its own event. Same-day corrections with the same source timestamp are also skipped by the importer.[^setup]

## What I tested

The gathering contract and Offensive Agency tests passed all 58 cases. I ran the live module twice in statistics mode and checked the ZIP’s checksum, the manifest, the event, and its stable UUID and timestamp. A live inventory lookup for the documentation address `192.0.2.1` returned zero events. For a positive inventory match, I used the synthetic example above.[^tests]

The unmodified MISP core rejected the ZIP with a size or SHA-256 mismatch. The core’s HTTP client replaced the callback that writes the ZIP to disk with its normal in-memory body collector. In the local test instance I corrected the callback selection and enforced the byte limit while streaming, so the importer could check the downloaded file’s size and SHA-256. Both worker runs then completed. The first saved one organisation-only event with seven attributes and two local provenance tags. The repeat kept the same event and attributes.[^download]

[^source]: Offensive Agency explains the source data, seven-day active window, confidence levels, and coverage limits. [Tracker methodology](https://offensive.agency/about) · [Statistics](https://offensive.agency/stats)

[^versions]: I ran the first walkthrough with MISP `6c6e4c5` on `3.0_wip` and misp-modules `668d9a6` on `main`. I used the same MISP instance with the updated collector and proposed template for the inventory example. [MISP branch snapshot](https://github.com/MISP/MISP/tree/6c6e4c5c7f93a47e8213277ad43b2c90550c8d28) · [Initial gathering module PR](https://github.com/MISP/misp-modules/pull/1169)

[^setup]: The gathering guide documents the feed contract, local provenance tags, and revision handling. [Gathering module guide](https://github.com/MISP/misp-modules/blob/668d9a68971fb09deaada74c456bc505fdc3423d/documentation/mkdocs/gathering-guide.md)

[^tests]: The run included the generic gathering suite and the source-specific suite. [Gathering tests](https://github.com/MISP/misp-modules/blob/668d9a68971fb09deaada74c456bc505fdc3423d/tests/test_gathering.py) · [Offensive Agency tests](https://github.com/MISP/misp-modules/blob/668d9a68971fb09deaada74c456bc505fdc3423d/tests/test_offensive_agency_gathering.py)

[^download]: In the tested core snapshot the later body collector replaces the streaming callback in `CurlClient`. The gathering importer validates the size and digest before extraction. [HTTP client](https://github.com/MISP/MISP/blob/6c6e4c5c7f93a47e8213277ad43b2c90550c8d28/app/Lib/Tools/CurlClient.php#L352-L405) · [Archive validation](https://github.com/MISP/MISP/blob/6c6e4c5c7f93a47e8213277ad43b2c90550c8d28/app/Lib/Tools/GatheringFeedTool.php#L145-L150)
