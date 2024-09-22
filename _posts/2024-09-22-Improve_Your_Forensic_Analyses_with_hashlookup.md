---
layout: post
title: "Improve Your Forensic Analyses with hashlookup"
date: 2024-09-22 00:01:00
categories: infosec
---

# Improve Your Forensic Analyses with hashlookup

Alexandre Dulaunoy <a@foo.be>

## Introduction

For several decades, forensic analyses in cybersecurity have relied on known software hash sources. These sources are not numerous. Most investigators and security researchers use sources like the National Software Reference Library ([NSRL](https://www.nist.gov/itl/ssd/software-quality-group/national-software-reference-library-nsrl)) and its Reference Data Set (RDS) to distinguish known files from unknown ones. For several years at [CIRCL](https://www.circl.lu/), it became evident that we were finding it increasingly difficult to sort files using hash databases like NSRL during investigations on compromised systems. The reasons are multiple:

- The release of new software has accelerated across multiple platforms and architectures (Windows is no longer the predominant operating system);
- Software supply chains are numerous and even attacked by various adversaries ([supply chain attack](https://attack.mitre.org/techniques/T1195/));
- Software publication is continuous (for example, GNU/Linux distributions continually include new software packages), making it laborious for a cybersecurity investigator or incident responder to keep up with this activity.

To overcome these difficulties, [hashlookup](https://circl.lu/services/hashlookup/) was developed as a free-access service, available to the community with a series of open-source tools to facilitate investigators' work. This article covers the creation of the service, the included software catalogs, and how to use it to improve and facilitate forensic investigations on compromised systems.

## From Supply Chain Attacks to Forensic Analyses

Adversaries manipulate software distribution sources, as seen in several recent attacks (e.g., [SolarWinds](https://www.cfcs.dk/globalassets/cfcs/dokumenter/rapporter/en/CFCS-solarwinds-report-EN.pdf)). This attack technique, referenced in the ATT&CK model as "Supply Chain Compromise (T1195)", is accompanied by a countermeasure to detect them: verifying files against a hash database. But is this realistic? Can we easily find a file published by a software vendor in known file databases? The situation is not simple; there are a few historical databases, but they are not maintained and cover only a negligible part of all software releases.

During cyber incidents, acquiring technical evidence (disks, RAM, etc.) is a crucial step. These evidences per machine can contain more than 100,000 files related to installed programs, system files, user files, or hidden files. For an analyst, all these elements are unknowns and can become evidence during a technical investigation. Contextualizing these files helps to eliminate doubts or better understand the relationships between certain files and software installations. Many adversaries increasingly use existing tools. It is not uncommon to see standard tools used during the infection of a Linux system, such as netcat, socat, sshd, but also in Windows compromises during lateral movements.

## Limitations of Existing Solutions - History

For over twenty years, some reference databases have existed, like the National Software Reference Library ([NSRL](https://www.nist.gov/itl/ssd/software-quality-group/national-software-reference-library-nsrl)) or KFFs ("Known File Filters") integrated into some proprietary forensic solutions. These solutions no longer meet the forensic needs of incident response teams. There are several reasons for this:

- The publication cycle is slow (for example, NSRL is published quarterly on an ISO image), whereas software distribution is now continuous;
- Coverage of distributions is partial (there are dozens of Linux distributions with daily security updates);
- Proprietary or difficult-to-use interfaces, such as KFFs that only work on expensive proprietary forensic products;
- Some interfaces support only outdated cryptographic methods ([nsrlsvr](https://rjhansen.github.io/nsrlsvr/) only supports MD5);
- Difficult or non-existent integration for TIP platforms like [MISP](https://www.misp-project.org/);

## CIRCL hashlookup

We had this problem of known file databases, and it had become a recurring question within the CIRCL team. It seemed logical to try to solve this problem and help the community. Hashlookup consists of two parts: a collection part to build the database and a publicly accessible API interface to search by cryptographic hash. The collection is continuously performed from multiple sources such as:

- The repositories and mirrors of the most used Linux distributions like Ubuntu, Debian, CentOS, SuSE for different hardware architectures;
- Security updates of the different distributions;
- Repositories of alternative packaging systems like SnapCraft, AppImage, Flatpak, RPM, etc.;
- Alternative sources like CDNjs (the content of the most common JavaScript libraries);
- GitHub releases of the most used open-source software;

The import includes hashing (MD5, SHA-1, SHA-256, ssdeep, TLSH) of all files contained in each publicly distributed distribution or package. Several billion hashes are added to hashlookup per month and stored in a key/value (k/v) database using [RocksDB](https://rocksdb.org/). The database structure is built to support numerous queries with fast response times.

## How to Use hashlookup

The database of known hashes is accessible via a ReSTful API. The interface is documented in OpenAPI, and all API endpoints are accessible at [https://hashlookup.circl.lu](https://hashlookup.circl.lu).

If you want to verify a SHA-1 hash, a simple request with curl suffices:

```bash
curl https://hashlookup.circl.lu/lookup/sha1/732458574c63c3790cad093a36eadfb990d11ee6 | jq .
```

```json
{
  "FileName": "snap-hashlookup-import/bin/ls",
  "FileSize": "142144",
  "MD5": "E7793F15C2FF7E747B4BC7079F5CD4F7",
  "RDS:package_id": "294806",
  "SHA-1": "732458574C63C3790CAD093A36EADFB990D11EE6",
  "SHA-256": "1E39354A6E481DAC48375BFEBB126FD96AED4E23BAB3C53ED6ECF1C5E4D5736D",
  "SHA-512": "233382698C722F0AF209865F7E998BC5A0A957CA8389E8A84BA4172F2413BEA1889DD79B12607D9577FD2FC17F300C8E7F223C2179F66786E5A11E28F4D68E53",
  "SSDEEP": "1536:BgfDyKo9d0mLrTpjQ2xioEbuGMC0kDLmLUFqpfgBLO+qDutbxHFb65RRnSULS0pF:BADnGd0mxst7DLmg0OBLIupbn0pJqN",
  "TLSH": "T178D32C07F15308BCC5D1C071865B9262BA31BC599332263F3A8CF6791F66F795B7AA20",
  "insert-timestamp": "1712941499.8515584",
  "mimetype": "application/x-sharedlib",
  "source": "snap:AUhqNxroxCLKaqLTwtZGKUMbBpAe5EU4_221",
  "hashlookup:parent-total": 69,
  "parents": [
    {
      "SHA-1": "00363CBD7E44AA37137E8A6E797507704EF111AC",
      "snap-authority": "canonical",
      "snap-filename": "BC52ksa3GpCgET5MpLjg1WtmtpKvwI6c_11.snap",
      "snap-id": "BC52ksa3GpCgET5MpLjg1WtmtpKvwI6c_11",
      "snap-name": "qt5-core20",
      "snap-publisher-id": "ccpcJpODSdWMi621YDqnMi9Q8UO6hb8L",
      "snap-signkey": "BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul",
      "snap-timestamp": "2022-02-17T20:28:04.914700Z",
      "source-url": "https://api.snapcraft.io/api/v1/snaps/download/BC52ksa3GpCgET5MpLjg1WtmtpKvwI6c_11.snap"
    },
    {
      "SHA-1": "059BACD854F610F6FBF9E47CF49BA7CD8308F23C",
      "snap-authority": "canonical",
      "snap-filename": "H7gdMTiQzGYKTPAyHd34pZS0FBlyENrO_113.snap",
      "snap-id": "H7gdMTiQzGYKTPAyHd34pZS0FBlyENrO_113",
      "snap-name": "auto-cpufreq",
      "snap-publisher-id": "b3wvcwNu3SrCLcZS2ANMrEorRl9z7e6j",
      "snap-signkey": "BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul",
      "snap-timestamp": "2021-12-15T19:19:49.317528Z",
      "source-url": "https://api.snapcraft.io/api/v1/snaps/download/H7gdMTiQzGYKTPAyHd34pZS0FBlyENrO_113.snap"
    },
    {
      "SHA-1": "0844D3CB657F353AB2CE1DB164CE6BDFFD2BB6FD",
      "snap-authority": "canonical",
      "snap-filename": "8BtI009xODljWTvzy37M55T8ZQiOiVft_3.snap",
      "snap-id": "8BtI009xODljWTvzy37M55T8ZQiOiVft_3",
      "snap-name": "osreport",
      "snap-publisher-id": "Yrin91Qs2D8dW9QVSQgQg9VxaGkpfQsr",
      "snap-signkey": "BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul",
      "snap-timestamp": "2021-05-11T18:56:58.598072Z",
      "source-url": "https://api.snapcraft.io/api/v1/snaps/download/8BtI009xODljWTvzy37M55T8ZQiOiVft_3.snap"
    },
    {
      "SHA-1": "09FD28A9B2B6C1D7AFA0F35D63CB90E19607DD73",
      "snap-authority": "canonical",
      "snap-filename": "DLqre5XGLbDqg9jPtiAhRRjDuPVa5X1q_1778.snap",
      "snap-id": "DLqre5XGLbDqg9jPtiAhRRjDuPVa5X1q_1778",
      "snap-name": "core20",
      "snap-publisher-id": "canonical",
      "snap-signkey": "BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul",
      "snap-timestamp": "2019-05-29T16:03:15.848435Z",
      "source-url": "https://api.snapcraft.io/api/v1/snaps/download/DLqre5XGLbDqg9jPtiAhRRjDuPVa5X1q_1778.snap"
    },
    {
      "SHA-1": "0B1FF89DAAE9D4932E5A09A3FC6B014C43219B8C",
      "snap-authority": "canonical",
      "snap-filename": "3Ng7sRVkFDVIFzOMQmiHK1pdKWHbkOfW_492.snap",
      "snap-id": "3Ng7sRVkFDVIFzOMQmiHK1pdKWHbkOfW_492",
      "snap-name": "bashtop",
      "snap-publisher-id": "jyL6NPmmwE6knQhm89MUOgpM4FSKEUJa",
      "snap-signkey": "BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul",
      "snap-timestamp": "2020-07-03T20:19:52.131066Z",
      "source-url": "https://api.snapcraft.io/api/v1/snaps/download/3Ng7sRVkFDVIFzOMQmiHK1pdKWHbkOfW_492.snap"
    },
    {
      "SHA-1": "0EE1130462493787F486BF66B8DE49F6AC1F98CF",
      "snap-authority": "canonical",
      "snap-filename": "DLqre5XGLbDqg9jPtiAhRRjDuPVa5X1q_2105.snap",
      "snap-id": "DLqre5XGLbDqg9jPtiAhRRjDuPVa5X1q_2105",
      "snap-name": "core20",
      "snap-publisher-id": "canonical",
      "snap-signkey": "BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul",
      "snap-timestamp": "2019-05-29T16:03:15.848435Z",
      "source-url": "https://api.snapcraft.io/api/v1/snaps/download/DLqre5XGLbDqg9jPtiAhRRjDuPVa5X1q_2105.snap"
    },
    {
      "SHA-1": "1A092638422762239916983CBB72DE7DDA4AC55C",
      "snap-authority": "canonical",
      "snap-filename": "YLuShGmTbSKFis3tecfrbi8x3VhtxAQu_9.snap",
      "snap-id": "YLuShGmTbSKFis3tecfrbi8x3VhtxAQu_9",
      "snap-name": "xsos",
      "snap-publisher-id": "wsytObaH0PmCvRj7IuRcloFzbtXUu6rK",
      "snap-signkey": "BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul",
      "snap-timestamp": "2018-05-18T10:26:21.757359Z",
      "source-url": "https://api.snapcraft.io/api/v1/snaps/download/YLuShGmTbSKFis3tecfrbi8x3VhtxAQu_9.snap"
    },
    {
      "FileSize": "1249368",
      "MD5": "E8E201B6D1B7F39776DA07F6713E1675",
      "PackageDescription": "GNU core utilities\n This package contains the basic file, shell and text manipulation\n utilities which are expected
 to exist on every operating system.\n .\n Specifically, this package includes:\n arch base64 basename cat chcon chgrp chmod chown chroot cksum co
mm cp\n csplit cut date dd df dir dircolors dirname du echo env expand expr\n factor false flock fmt fold groups head hostid id install join link 
ln\n logname ls md5sum mkdir mkfifo mknod mktemp mv nice nl nohup nproc numfmt\n od paste pathchk pinky pr printenv printf ptx pwd readlink realpa
th rm\n rmdir runcon sha*sum seq shred sleep sort split stat stty sum sync tac\n tail tee test timeout touch tr true truncate tsort tty uname unex
pand\n uniq unlink users vdir wc who whoami yes",
      "PackageMaintainer": "Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>",
      "PackageName": "coreutils",
      "PackageSection": "utils",
      "PackageVersion": "8.30-3ubuntu2",
      "SHA-1": "1D4AB60C729A361D46A90D92DEFACA518B2918D2",
      "SHA-256": "99AA50AF84DE1737735F2F51E570D60F5842AA1D4A3129527906E7FFDA368853"
    },
    {
      "SHA-1": "1E10EA9987C122605DBE27813C264D123CD7F06D",
      "snap-authority": "canonical",
      "snap-filename": "3Ng7sRVkFDVIFzOMQmiHK1pdKWHbkOfW_435.snap",
      "snap-id": "3Ng7sRVkFDVIFzOMQmiHK1pdKWHbkOfW_435",
      "snap-name": "bashtop",
      "snap-publisher-id": "jyL6NPmmwE6knQhm89MUOgpM4FSKEUJa",
      "snap-signkey": "BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul",
      "snap-timestamp": "2020-07-03T20:19:52.131066Z",
      "source-url": "https://api.snapcraft.io/api/v1/snaps/download/3Ng7sRVkFDVIFzOMQmiHK1pdKWHbkOfW_435.snap"
    },
    {
      "SHA-1": "1EAE139BC814D30FD0A35EA65DE7B900D8F9B32E",
      "snap-authority": "canonical",
      "snap-filename": "n7gtTdzEszxnF6S3DCTG8BqIqQWflGcn_70.snap",
      "snap-id": "n7gtTdzEszxnF6S3DCTG8BqIqQWflGcn_70",
      "snap-name": "kdf",
      "snap-publisher-id": "2rsYZu6kqYVFsSejExu4YENdXQEO40Xb",
      "snap-signkey": "BWDEoaqyr25nF5SNCvEv2v7QnM9QsfCc0PBMYD_i2NGSQ32EF2d4D0hqUel3m8ul",
      "snap-timestamp": "2019-10-17T20:16:37.917856Z",
      "source-url": "https://api.snapcraft.io/api/v1/snaps/download/n7gtTdzEszxnF6S3DCTG8BqIqQWflGcn_70.snap"
    }
  ],
  "hashlookup:trust": 100
}
```

If the value is present in hashlookup, a JSON object is returned with the existing metadata for that hash. All known hashes are included, but for certain sources like NSRL, only the MD5 or SHA-1 value will be present. If during the hashlookup collection process new hashes are encountered, they are added to the existing metadata. In addition to the file's metadata, a list of "parents" or "children" containing the SHA-1 values of the file's parents or children is available. These are values that help determine the origin of a file, such as its package or the original archive.

To perform a quick analysis of a directory, the command:

```bash
sha1sum * | cut -f1 -d" " | parallel 'curl -s https://hashlookup.circl.lu/lookup/sha1/{}' | jq .
```

can do the job if you don't have much time or simply have a list of suspicious files to sort.

### ReSTful API Return Codes

The API returns HTTP codes depending on the success or failure of the result.

| HTTP Return Code | Description and Interpretation                                    |
|------------------|-------------------------------------------------------------------|
| 200              | The searched hash is present in at least one of the databases     |
| 404              | The searched hash is not present in any of the databases          |
| 400              | The input used for the hash is in an incorrect format             |

## Improving Query Speed

Hashlookup supports a `bulk` feature that makes a single request with a list of SHA-1 or MD5 values.

```bash
curl -X 'POST' 'https://hashlookup.circl.lu/bulk/sha1' -H "Content-Type: application/json" -d "{\"hashes\": [\"FFFFFDAC1B1B4C513896C805C2C698D9688BE69F\", \"FFFFFF4DB8282D002893A9BAF00E9E9D4BA45E65\", \"FFFFFE4C92E3F7282C7502F1734B243FA52326FB\"]}" | jq .
```

This approach is a bit better to improve performance and avoid issuing a request for each hash to test.

Nevertheless, the fastest approach is to use the Bloom filter provided by Hashlookup, which can be downloaded at the following location [https://cra.circl.lu/hashlookup/hashlookup-full.bloom](https://cra.circl.lu/hashlookup/hashlookup-full.bloom).

If you don't want to share the queries and prefer to avoid online queries, the Bloom filter is a file of around 1GB that can be used locally to perform lookups.

The [hashlookup-analyser](https://github.com/hashlookup/hashlookup-forensic-analyser) supports the Bloom filter natively.

```bash
python3 bin/hashlookup-analyser.py --bloomfilters /home/adulau/hashlookup/hashlookup-full.bloom --include-stats -d /bin
```

## Tools and Integration of hashlookup

To automate and facilitate the use of hashlookup, tools like [hashlookup-forensic-analyser](https://github.com/hashlookup/hashlookup-forensic-analyser) exist. This tool allows generating CSV files with known and unknown files. For example, during a forensic investigation on a Linux server, the command:

```bash
python3 hashlookup-analyser.py --cache -d /sbin/ --include-stats --print-unknown
```

will list the unknown files in the /sbin directory. The --cache option avoids making multiple requests for the same hash.

```
hashlookup_result,filename,sha-1,size
stats,Analysed directory /sbin/ on maurer running Linux-5.11.0-38-generic-x86_64-with-glibc2.29 at 2021-11-15 09:17:39.486575+00:00 - Found 472 on hashlookup.circl.lu - Unknown files 0 - Excluded files 0
```

The result on /sbin allows us to conclude that the 472 discovered files are known to hashlookup. This facilitates the elimination of files to analyze and ensures that the present files come from known sources.

There are several integrations with IT security tools to facilitate hash searches. For example, [MISP](https://www.misp-project.org/) has a [hashlookup expansion module](https://misp.github.io/misp-modules/expansion/#circl-hashlookup-lookup). MISP is a threat intelligence platform and can contain a significant number of IoCs (Indicators of Compromise). The hashlookup module can be used to better contextualize these indicators and verify if the origin of a file is already known.

![Result of a hash query with the results from Hashlookup.](/assets/hashlookup-lookup.png)

![Import of Hashlookup results into MISP with the corresponding relationships.](/assets/hashlookup-misp2.png)

Florian Roth's tool [munin](https://github.com/Neo23x0/munin) also integrates hashlookup support in addition to other sources like CAPE, VirusTotal, HybridAnalysis. Munin operates in three modes:

- A mode where hash extraction is done from raw files;
- A recursive mode that computes all hashes for files discovered recursively;
- A command-line mode to verify a given hash;

This provides an overview of known files as well as potential malware.

There are also several tools with hashlookup integration with [FlowIntel and misp-modules](https://github.com/flowintel/flowintel) to facilitate contextualization.

# Conclusion

[Hashlookup](https://hashlookup.io) is a relatively young project but helps to quickly classify file indicators or technical fingerprints in digital forensic cases. Improvements are planned, such as adding metadata on signatures and function exports, as well as the possibility of performing approximate searches based on SSDEEP.

The hashlookup export format is being standardized at the IETF with the [publication of a first Internet-Draft](https://www.ietf.org/archive/id/draft-dulaunoy-hashlookup-format-00.html). Do not hesitate to propose new sources for metadata, integrate your tools with the hashlookup API, or suggest improvements to the API.
