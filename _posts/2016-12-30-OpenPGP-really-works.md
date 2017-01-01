---
layout: post
title:  "OpenPGP really works"
date:   2016-12-30 18:52:21
categories: infosec
---


# OpenPGP really works
``or it's more sexy to create the next secure chat applications than improving existing RFCs``

Alexandre Dulaunoy <a@foo.be>

*version 1 - 2016-12-30*

In the past years, I have seen many articles, publications or blog posts mentioning that PGP is dead or has been replaced by the next-generation chat applications. We are obviously shifting our communication channels towards ephemeral communication schemes and the OpenPGP standard is maybe not the best suited protocol. Already in 2005, the well-known paper "Why Johnny Can’t Encrypt" was already pinpointing the shortcoming of the user-interface and experience in PGP. So I decided **to track one day of my activities relying on PGP** and especially to list where the OpenPGP standards[^1] play a significant role and especially its GnuPG free software implementation.

[![Talking on a boat]({{ site.baseurl }}/assets/talking.jpg)](https://www.flickr.com/photos/adulau/27871520064)

My day-to-day work is in the field of information security and especially incident handling, analysis and response. A significant volume of sensitive information is exchanged, handled, stored, processed and distributed when you perform incident response. Ensuring integrity, authentication and confidentiality is a key factor. So I installed [snoopy](https://github.com/a2o/snoopy) for a day to look how many times GnuPG or a related library is started and used on my laptop running a recent Ubuntu GNU/Linux distribution.

The output of snoopy looks like this:

~~~~
Dec 25 16:01:07 feistel snoopy[24094]: [uid:0 sid:13868 tty:(none) cwd:/var/log filename:/usr/lib/apt/methods/gpgv]: /usr/lib/apt/methods/gpgv
Dec 25 16:01:07 feistel snoopy[24095]: [uid:0 sid:13868 tty:(none) cwd:/var/log filename:/usr/lib/apt/methods/gpgv]: /usr/lib/apt/methods/gpgv
~~~~

So I did a simple script to extract all the related calls of GnuPG libraries, tools and software.

## Free software updates and digital signature

Starting the day, doing updates of your operating system is a very common and important process. GnuPG signing is actively used as the operating system checks the integrity and the authenticity of the packages using GnuPG. [apt-secure](https://wiki.debian.org/SecureApt) is not new and was introduced some years ago to validate downloaded and to be installed packages. It works and when it's complaining about signature failures, it's clearly a good hint to check your APT sources before going further.

GnuPG signature of packages is not limited to Debian or Ubuntu, it's also by default in [RPM](https://www.centos.org/docs/5/html/Deployment_Guide-en-US/s1-check-rpm-sig.html) (from Fedora, RedHat, Centos, ...), [archlinux / Pacman](https://wiki.archlinux.org/index.php/DeveloperWiki:Package_signing), [Gentoo](http://blog.siphos.be/2011/07/emerge-webrsync-and-gpg-verification/).

So for a dying standard, OpenPGP is still actively used for packages signature and the integration is not too bad if you install a standard GNU/Linux distribution.

Another interesting alternative to OpenPGP in the field of package signature is the [```signify``` tool](http://www.tedunangst.com/flak/post/signify) (from the OpenBSD team) which relies solely on [Ed25519](http://ed25519.cr.yp.to/index.html). ```signify``` is clearly simple and minimalist but the key management and so on is handled independently of the tool.

## CSIRTs and CERTs

In the CERT/CSIRT communities, PGP is the default mean to encrypt sensitive information in the various trusted groups like [FIRST](https://www.first.org/members/teams), [TF-CSIRT](https://www.trusted-introducer.org/directory/alpha_LICSA.html) or other groups that are not public. In my private local keyring, I have more than 3000 PGP public keys. A significant numbers of the my contact are used to PGP and its shortcomings. So every day, I'm sending encrypted and signed emails (or sometime just signed) with PGP and especially within my contacts within the CERT/CSIRT community.

I use two MUAs and one is relying on [Enigmail](https://www.enigmail.net), it's not perfect but the UI improved compared to the old PGP UI mentioned in the old paper "Why Johny Can't Encrypt" from 2005. Usually my ratio of professional mails using PGP (with encryption), it's close to 60%. We can argue that is because of the incident response community relying on PGP but it's still a reality for some security professionals.

Those emails are often used in complement to real-time chat session using OTR, so it's basically complementary to real-time communication relying on end-to-end encryption.

Another aspect to not underestimate in the CSIRT community, it's the use of ticketing systems like [RTIR](https://github.com/bestpractical/rtir) which supports PGP out-of-the-box.

Looking at the snoopy logs, I do backup of evidences on a daily basis relying on PGP and some files are even decrypted years later (e.g. new technical evidences, additional requests from the law enforcement). GnuPG works quite well to encrypt files with asymmetric encryption but also with symmetric encryption (```--symmetric``` check this option in GnuPG). Having a stable standard like OpenPGP/[rfc4880](https://tools.ietf.org/html/rfc4880) ensures a long-term archive of the evidences (I won't talk about the key renewal aspects and cryptographic algorithms but this could be another post).

So purely looking at my professional usage of encryption for backups or permanent communication, PGP is still largely used.

### Side note: "Show session key" escrow in the protocol is a requirement

In the past years, I had some sensitive cases where law enforcement or other authority wanted to have the decryption key of
a specific evidence which is encrypted. It's a rare case but you don't want to reveal an overall private
key for all your messages. GnuPG supports the ability to extract the session key of a specific encrypted PGP message.

~~~~
--show-session-key
              Display the session key used for one message. See --override-session-key for the counterpart of this option.

              We  think that Key Escrow is a Bad Thing; however the user should have the freedom to decide whether to go to prison or to reveal the content
              of one specific message without compromising all messages ever encrypted for one secret key. DON'T USE IT UNLESS YOU ARE REALLY FORCED TO  DO
              SO.

--override-session-key string
              Don't  use  the  public  key but the session key string. The format of this string is the same as the one printed by --show-session-key. This
              option is normally not used but comes handy in case someone forces you to reveal the content of an encrypted message; using this  option  you
              can do this without handing out the secret key.
~~~~

This functionality is one of the reason why I'm still actively using GnuPG.

## Information sharing

As I have a [MISP](https://github.com/MISP/) test instance on my laptop, the logs showed a peak usage of GnuPG when publishing events in the threat sharing platform.

In my professional activities, we are actively working on information sharing to improve the state of information security. One of the tool we co-developed is [MISP](http://www.misp-project.org/) which is actively using PGP to send signed and encrypted notifications, verifying users and organization. MISP is supporting S/MIME and PGP (the usage can be even mixed) but the majority of the MISP communities rely on PGP. In a day, a large sharing community can exchange thousands of encrypted PGP email in a day.

## Conclusion

After a day of analysis, PGP is used and significantly used at various layers in my day-to-day activities. I can clearly said "PGP works". Indeed, it's not perfect (that's the reality of a lot of cryptosystems) but PGP needs some love at the [IETF](https://datatracker.ietf.org/wg/openpgp/documents/), for the [implementations](http://openpgp.org/software/) or even [some financial support](https://www.gnupg.org/donate/index.html).

# References

- [Why Johnny Can’t Encrypt A Usability Evaluation of PGP 5.0](https://people.eecs.berkeley.edu/~tygar/papers/Why_Johnny_Cant_Encrypt/OReilly.pdf) by ALMA WHITTEN AND J. D. TYGAR in  Security and Usability:  Designing Secure Systems that People Can Use, eds. L. Cranor and G. Simson.  O'Reilly, 2005, pp. 679-702

[^1]: OpenPGP is Open Specification for Pretty Good Privacy with [multiple RFCs](https://datatracker.ietf.org/wg/openpgp/documents/) describing the standard.
