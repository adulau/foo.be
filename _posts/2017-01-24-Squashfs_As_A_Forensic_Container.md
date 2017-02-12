---
layout: post
title:  "Squashfs As A Forensic Container"
date:   2017-01-24 21:52:21
categories: infosec
---


# Squashfs As A Forensic Container

> "Every program has (at least) two purposes: the one for which it was written and another for which it wasn't."
>
> -- <cite>[Alan J. Perlis](https://en.wikipedia.org/wiki/Alan_Perlis)</cite>

[![The frame of life]({{ site.baseurl }}/assets/frame.jpg)](https://www.flickr.com/photos/adulau/32487967615/)

Alexandre Dulaunoy <a@foo.be>

*version 1.0 - 2017-02-12*

Digital forensic incident response (DFIR) is a critical field in the process of incident response. Analysing disks, removal devices or memory can be a long and tedious process but provide insightful information to better under the course of action of an incident along with the impact on the systems. When performing regular digital forensic, you know that the acquisition process and the storage of the evidences are important steps to ensure smooth, quick and accurate results. While reading the excellent book of Bruce Nikkel ["Practical Forensic Imaging: Securing Digital Evidence with Linux Tools"](https://www.nostarch.com/forensicimaging) there is a chapter dedicated to the use of "squashfs" as a forensic evidence container. The ```squashfs``` filesystem is often known by forensic examiners as used for embedded systems. But using it as forensic container is quite nifty (compared to other forensic containers), I decided to share my notes on how to use ```squashfs```[^1] as an evidence container.

# Why using another forensic format?

Many forensic investigators used (knowing or not knowing about the underlying formats) existing forensic formats (from open and free standard up to proprietary format used by a single vendor). There are notorious open formats like "The Advanced Forensic Format" (AFF[^2]) which provides a complete set properties recommended for storing forensic evidences and keeping the associated metadata. AFFv3 supports encryptions and digital signature on-the-fly while allowing to keep a single file for the forensic data and metadata. Many of tools require additional libraries or even proprietary software which is counter productive in an auditable DFIR software stack. AFFv3 and AFF4 are quite good candidates as forensic container. I did use some of these but there is major drawback is the ability to use all standard DFIR tools (from [dc3dd](https://packages.debian.org/sid/dc3dd), [dcfldd](https://github.com/adulau/dcfldd) to any obscure DFIR tools relying solely on raw images) without needing to install additional libraries to support access to the forensic containers.

# Interesting Forensic Properties of squashfs

- squashfs is an **append-only read-only file-system**. A property required for archiving and especially forensic containers.
- squashfs provides a flexible and speedy **seek-enabled archiving format**. (think of a compressed tar file that you can mount)
- Compression is efficient compared to other solutions (**everything is compressed** from data, inodes to directory structure, block size can be customized to achiever better compression ratio and recent version supports fragment blocks).
- Duplicates are automatically detected and removed.
- a squashfs can be mounted as a loopback device and used transparently by any DFIR tools including [Sleuthkit](https://www.sleuthkit.org).

# Practical usage

An issue when doing disk forensic is the capacity of your DFIR workstation. Acquired raw disks can take space and create significant challenges while performing analysis.  Many acquired raw disks have usually
very good compression ratio. It's really where squashfs can help any forensic investigator especially to save time and space in your analysis process. As an example, I have acquired a flash card from a camera:

~~~~shell
[adulau:~/disk-image] 130 $ hashrat -sha1 camera.dd 
hash='sha1:90b7e3f68eb91338b4adfb930f0c618514e83657' type='file' mode='100644' uid='1000' gid='1000' size='128450560' mtime='1486909752' inode='7342242' path='camera.dd'
~~~~

Then if you add it in a squashfs container with `mksquashfs`:

~~~~shell
[adulau:~/disk-image] 1 $ mksquashfs camera.dd evidence.shfs
Parallel mksquashfs: Using 4 processors
Creating 4.0 filesystem on evidence.shfs, block size 131072.
[==================================================================================================================================================================================================================|] 980/980 100%

Exportable Squashfs 4.0 filesystem, gzip compressed, data block size 131072
        compressed data, compressed metadata, compressed fragments, compressed xattrs
        duplicates are removed
Filesystem size 5617.54 Kbytes (5.49 Mbytes)
        4.48% of uncompressed filesystem size (125444.05 Kbytes)
Inode table size 121 bytes (0.12 Kbytes)
        3.04% of uncompressed inode table size (3986 bytes)
Directory table size 29 bytes (0.03 Kbytes)
        93.55% of uncompressed directory table size (31 bytes)
Number of duplicate files found 0
Number of inodes 2
Number of files 1
Number of fragments 0
Number of symbolic links  0
Number of device nodes 0
Number of fifo nodes 0
Number of socket nodes 0
Number of directories 1
Number of ids (unique uids + gids) 1
Number of uids 1
        adulau (1000)
Number of gids 1
        adulau (1000)
[adulau:~/disk-image] $ hashrat -sha1 evidence.shfs 
hash='sha1:034e5e62f69f3dc428fe29382d5a3da05932bf2e' type='file' mode='100644' uid='1000' gid='1000' size='5754880' mtime='1486909902' inode='7342598' path='evidence.shfs'
~~~~

The evidence.shfs contains the original evidence and is 5.5MB large instead of 128MB. The container can be mounted back as a loop device:

~~~~shell
[adulau:~/disk-image] 1 $ sudo mount -t squashfs evidence.shfs ./evidence-dir
mount: warning: ./evidence-dir/ seems to be mounted read-only.
[adulau:~/disk-image] $ cd evidence-dir/
[adulau:~/disk-image/evidence-dir] $ hashrat -sha1 camera.dd 
hash='sha1:90b7e3f68eb91338b4adfb930f0c618514e83657' type='file' mode='100644' uid='1000' gid='1000' size='128450560' mtime='1486909752' inode='1' path='camera.dd'
~~~~

Now as the raw images are mounted via the squashfs, you can freely use your favourite forensic tools:

~~~~shell
[adulau:~/disk-image/evidence-dir] $ mmls camera.dd 
DOS Partition Table
Offset Sector: 0
Units are in 512-byte sectors

     Slot    Start        End          Length       Description
     00:  Meta    0000000000   0000000000   0000000001   Primary Table (#0)
     01:  -----   0000000000   0000000096   0000000097   Unallocated
     02:  00:00   0000000097   0000250879   0000250783   DOS FAT16 (0x06)
[adulau:~/disk-image/evidence-dir] 1 $ fls -o 97 -r camera.dd 
r/r 3:  CANON_DC    (Volume Label Entry)
d/d 4:  DCIM
+ d/d 517:  111___06
++ r/r * 1029:  _MG_0125.JPG
++ r/r 1030:    IMG_0126.JPG
+ d/d 518:  CANONMSC
++ r/r 183301:  M0111.CTG
v/v 4011523:    $MBR
v/v 4011524:    $FAT1
v/v 4011525:    $FAT2
d/d 4011526:    $OrphanFiles
~~~~

This offers an endless door of opportunities especially that the DFIR investigator can continue to append evidences to the squashfs file like other memory or disk acquisitions, trusted timestamping notes or information. You can also easily share the squashfs container with other investigators (even on the same DFIR workstation) and ensuring a consistent investigation workflow.

Bruce Nikkel did a helper script called [sfsimage](http://www.digitalforensics.ch/sfsimage/) to support the use of squashfs in forensic acquisition. It's up to the investigator to decide if they want to use the standard tools or to make his own script. As the format is the same, you can safely use the script or/and rely solely on the squashfs tools.

# References

- [Practical Forensic Imaging](https://www.nostarch.com/forensicimaging) by [Bruce Nikkel](http://www.digitalforensics.ch/)

# Footnotes

[^1]: [SquashFS](https://en.wikipedia.org/wiki/SquashFS) is a compressed read-only file system for Linux. SquashFS compresses files, inodes and directories, and supports block sizes up to 1 MB for greater compression.
[^2]: [The Advanced Forensic Format Library and Tools Version 3](https://github.com/sshock/AFFLIBv3). [AFFv4](http://www.aff4.org/) is an updated version to AFF version 3 which includes partially the recommendation from "Extending the advanced forensic format to accommodate multiple data sources, logical evidence, arbitrary information and forensic workflow” M.I. Cohen, Simson Garfinkel and Bradley Schatz, digital investigation 6 (2009) S57–S68. At the current date, AFF4 is implemented in pmem (part of Google [Rekall](https://github.com/google/rekall)). AFF4 seems very promising on mid-term but requires significant works for having s standard seekable filesystem.
