---
layout: post
title: "Monitoring agentic framework exposure with Offensive Agency and MISP"
date: 2026-11-22 15:30:00 +0100
description: "How to import Offensive Agency statistics and host history into MISP, monitor an asset inventory, and enrich a single IP address during triage."
---

In [my previous post]({{ '/2026/11/From_SATAN_to_Agentic_Attacks.html' | relative_url }}), I wrote about the infrastructure that makes agentic attacks possible. One practical question for defenders is which interfaces these frameworks expose to the Internet and whether any of our own assets appear in those observations.

Thanks to Fafner (\_KeyZee\_) for making the Offensive Agency tracker and its data available, and to ONYPHE for the underlying Internet scan data. The tracker publishes aggregate statistics and records of exposed web consoles and APIs. Its methodology explains how it separates probable from confirmed observations, handles shared CDN addresses, and defines an active IP as one seen during the preceding seven days.[^source]

![Offensive Agency’s statistics page showing the 16–22 November observation window and daily IP counts by framework]({{ '/assets/offensive-agency-misp/source-stats.png' | relative_url }})

*Offensive Agency source snapshot on 22 November 2026. Each chart point reflects the scans collected that day. The active count covers the full seven-day window.*

## From the tracker to a MISP event

I maintain `misp-modules` and developed the `offensive_agency` gathering module to put Fafner’s data to work in MISP. I started with daily statistics and inventory checks. The current module on `misp-modules` main can also import the complete host export. MISP’s `3.0_wip` branch can use it as a feed source. The module builds a ZIP with a standard MISP feed manifest and event files. MISP checks the archive size and SHA-256 checksum, then hands the events to its normal feed importer.[^versions]

The gathering module has three collection modes.

- **Exposure statistics.** Use an empty parameters object (`{}`). The module fetches the public statistics snapshot and creates one event per source date. The event contains the headline counts and a JSON attachment with the breakdowns and daily series.
- **Approved asset inventory.** Supply individual IP addresses in `asset_ips`. The module asks the provider for observations of those addresses and creates an event for each match. A missing address produces no event. A match can show when the provider first and last observed the software, the provider’s confidence, and the recorded network type.
- **Full host history.** Set `all_hosts` to `true` and leave `asset_ips` empty. The module imports one event per IP from the historical export, including hosts last seen outside the seven-day active window.

All three modes use local `misp-gathering` tags for the collector and the source. I wrote about the history of those structured vocabularies in [Machine tags, from social bookmarking to MISP taxonomies]({{ '/machine-tags/' | relative_url }}).

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

## Import the full host history

Create a separate gathering feed using the same setup with these parameters.

```json
{"all_hosts": true}
```

The module reads the historical export in one request and limits the decoded JSON to 64 MiB. Each event records the first and last dates reported for that IP. The same IP gets distinct event UUIDs in history and inventory mode so both records can coexist. The bulk event preserves the export row, and the inventory event keeps the richer per-IP response, including `services` when the provider supplies it.

The live run in the module PR produced 8,062 events. I used a two-row synthetic export for the example below. The October observation shows what a host outside the active window looks like in the feed. [Full-history gathering and IP expansion](https://github.com/MISP/misp-modules/pull/1174)

[![MISP host history feed preview with synthetic observations from October and November]({{ '/assets/offensive-agency-misp/misp-host-history-preview.png' | relative_url }})]({{ '/assets/offensive-agency-misp/misp-host-history-preview.png' | relative_url }})

*The full-history preview shows one event per IP, using the last observation date as the event date.*

## What an inventory observation looks like in MISP

Both host feeds group the triage fields in an `offensive-agency-observation` object and attach the complete source row as `source-record`. Linked `domain-ip` objects represent reported domains and reverse DNS names. Linked `ip-port` objects record the ports and identify the frameworks seen on each port. [Object template](https://github.com/MISP/misp-objects/pull/609)

For the walkthrough I used a synthetic per-IP response for the documentation address `192.0.2.20`. In the feed settings above, I replaced the empty `parameters` object with this one. On an operational feed, use addresses from your approved inventory.

```json
{"asset_ips": ["192.0.2.20"]}
```

The main observation in this example has eight attributes. They cover the IP address, source link, network type, country, operator, ASN (using MISP’s `AS` type), framework and confidence, and the downloadable JSON. The observation and its IP attribute carry the first and last dates at UTC day precision. The event also has two `domain-ip` objects, one for each DNS name, and an `ip-port` object for port 443.

[![MISP Objects tab showing the Offensive Agency observation, linked DNS and port objects, and the source-record download]({{ '/assets/offensive-agency-misp/misp-asset-observation.png' | relative_url }})]({{ '/assets/offensive-agency-misp/misp-asset-observation.png' | relative_url }})

*The synthetic asset event in MISP. The `source-record` attachment preserves the details behind the summary.*

Here’s the complete 18-field JSON I downloaded from MISP, formatted for readability.

```json
{
  "ip": "192.0.2.20",
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

## Look up an IP during triage

I also added **Offensive Agency Lookup** (`offensive_agency_lookup`) for the times I’m already investigating an IP in a MISP event. Enable it under **Enrichment**. From an `ip-src` or `ip-dst` attribute, open its actions menu, select **Enrich**, and choose `offensive_agency_lookup`. It queries the provider’s per-IP endpoint without an API key. [Expansion module documentation](https://github.com/MISP/misp-modules/blob/b495a41d7bc4172492b8dd7b864375c4133b5387/documentation/expansion/offensive_agency_lookup.md)

A match returns an observation with a `describes` reference to the original IP attribute, any related DNS and port objects, and the complete per-IP JSON. Review the result before importing the selected items into the event. A missing record yields no new observation.

[![MISP expansion results for a synthetic IP with the Offensive Agency observation, DNS and port objects]({{ '/assets/offensive-agency-misp/misp-ip-expansion.png' | relative_url }})]({{ '/assets/offensive-agency-misp/misp-ip-expansion.png' | relative_url }})

*The expansion results for `192.0.2.20` before import, with the original IP and the objects returned by the lookup.*

## How defenders can use the feed

I’d schedule the statistics feed to track changes in reported exposure and the inventory feed to check my own assets. The history feed gives an investigation a record of older sightings. The expansion fits an individual case where I want dates, DNS names and ports for an IP already in my event.

If a match shows an exposed console, check who owned the address on the observation date and whether the service was meant to be public. Compare any hostnames and ports in `source-record` with your inventory and logs, especially when the IP belongs to a shared CDN. If you confirm an unexpected exposure, work with the owner to restrict access, verify the change in your own systems, and watch for later sightings.

The local `misp-gathering:source="offensive.agency"` tag makes feed events easy to find in MISP. The gathering and expansion modules leave `to_ids` off on the attributes they create. The provider’s confidence describes the software it observed, while the operator’s intent remains unknown.

## A first experiment with gathering modules

I built this as a first experiment with the new `gathering` module type in `misp-modules`. I wanted to see how a public data source could become part of a regular feed workflow, with each event recording where the data came from and which module collected it. I’ll update this post as the module and its MISP integration evolve, especially as teams try it with their own inventories.

[^source]: Offensive Agency explains the source data, seven-day active window, confidence levels, and coverage limits. [Tracker methodology](https://offensive.agency/about) · [Statistics](https://offensive.agency/stats)

[^versions]: I ran the statistics walkthrough with MISP `6c6e4c5` on `3.0_wip` and misp-modules `668d9a6` on `main`. The updated screenshots use the same MISP instance and misp-modules `b495a41`, which includes full-history gathering and IP expansion. [MISP branch snapshot](https://github.com/MISP/MISP/tree/6c6e4c5c7f93a47e8213277ad43b2c90550c8d28) · [Updated module snapshot](https://github.com/MISP/misp-modules/tree/b495a41d7bc4172492b8dd7b864375c4133b5387)

[^setup]: The gathering guide documents the feed contract, local provenance tags, and revision handling. [Gathering module guide](https://github.com/MISP/misp-modules/blob/b495a41d7bc4172492b8dd7b864375c4133b5387/documentation/mkdocs/gathering-guide.md#offensive-agency)

[^download]: In the pinned core snapshot `CurlClient` replaced the callback that writes the ZIP to disk. I used the proposed streaming fix in the test instance. MISP still checks the downloaded file’s size and SHA-256 before extraction. [MISP core fix](https://github.com/MISP/MISP/pull/11312) · [Archive validation](https://github.com/MISP/MISP/blob/6c6e4c5c7f93a47e8213277ad43b2c90550c8d28/app/Lib/Tools/GatheringFeedTool.php#L145-L150)
