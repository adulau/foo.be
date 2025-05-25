---
layout: post
title: "How to Choose an Open Source Project for the Long Term"
date: 2025-05-25 08:02:00
categories: free-software open-source 
---

How to Choose an Open Source Project for the Long Term

*version 1.0 - 25th May 2025*

Many of us face the challenge of selecting open source projects for long-term use. This could involve choosing dependencies for your own open source project, or simply selecting software you plan to run and rely on over time.

After experiencing multiple failures, disappointments with projects that turned proprietary, or even the complete disappearance of some repositories, I decided to compile a list of parameters, indicators, and signals that might help identify solid, sustainable open source projects, as well as warning signs that could indicate potential risks.

![a bigger splash](/assets/review.jpg)

## CLA - Contributor License Agreement

One of the first and most important parameters to consider is the CLA (Contributor License Agreement). As you may know, a CLA is a legal tool but it can be misused to lock in contributions while allowing the original creator (often an organization, but not always) to relicense the work under any terms they choose.

In my personal experience with CLAs over the past 25 years, *[CLAs are just tools invented by lawyers to exploit human contributions](https://infosec.exchange/@adulau/114546480279205323).*

If you see a CLA in an open source project, it’s already a strong signal that the project might eventually be relicensed, shift its objectives, or even be rebranded by a commercial entity that views open source merely as a marketing vehicle and nothing more.

If someone tells you that a CLA is there to protect you and your contributions, it's complete bullshit. Honestly, the CLA was one of the biggest screw-ups of the FSF, it legitimized a bad practice and gave corporate borgs a free pass to exploit it for years. If you want to dig deeper, check out these excellent resources: [Why Your Project Doesn't Need a Contributor Licensing Agreement](https://sfconservancy.org/blog/2014/jun/09/do-not-need-cla/), the [CLA-Free Initiative](https://ossbase.org/initiatives/cla-free/), and [Seriously, don't sign a CLA](https://drewdevault.com/2023/07/04/Dont-sign-a-CLA-2.html).

Software can also be proprietarized even without a CLA [just like it happened with Benthos](https://www.warpstream.com/blog/announcing-bento-the-open-source-fork-of-the-project-formerly-known-as-benthos). But CLAs are usually there to protect organizations, not contributors, especially shielding them from potential litigation. So yes, CLAs are strong indicators of possible bad practices down the road.

On the other hand, seeing a [DCO](https://developercertificate.org/) (Developer Certificate of Origin) is usually a good sign. It’s not a transfer of ownership, but simply a statement that you agree (and have the right) to have your contribution included in the open source project.

From a contributor’s perspective, this is a positive sign, it shows that contributors are respected and that the project is focused on building a healthy, sustainable community for the long term.

## Does the project merge pull requests from outside their organization?

It’s very common to see projects run by a specific organization that don’t accept any contributions from external contributors, only merging pull requests from authors within their own company. Even good contributions often get rewritten, and the original pull request is closed with a comment saying it was “merged,” even though it wasn’t.

This is a classic tactic used by organizations that avoid CLAs just to appear friendly to contributors, while still sidestepping legal risk and keeping full ownership of the codebase which makes relicensing easier down the line.

## Does the project interact with contributors and especially how?

Another strong indicator of a project's long-term health is how it interacts with contributors. Are external contributors welcomed into the development process, or are they quietly pushed aside? Are they included in discussions about design decisions or the direction of a pull request, or is everything decided behind closed doors?

Pay attention to how the maintainers respond to contributions. When a pull request is rejected, is there a respectful, constructive explanation, or just silence or a vague dismissal? Do maintainers engage with feedback and questions in the issue tracker or discussion forums?

A healthy open source project values its community. Transparency, respectful communication, and public discussions are signs of a project that is likely to grow and survive. If you see a pattern of gatekeeping, dismissiveness, or lack of documentation around decision-making, that's a red flag for long-term sustainability.

## Is the open source license a strong indicator of sustainability?

At first, I used to think that using a copyleft-style license was a strong sign of long-term sustainability. But nowadays, I’d say it’s not a reliable indicator on its own.

Of course, the license should be a proper free license, approved by the [FSF](https://www.gnu.org/licenses/license-list.html#SoftwareLicenses) or [OSI](https://opensource.org/licenses), but that’s just the baseline for choosing an open source project. The type of open source license alone doesn’t guarantee longevity or a healthy project.

# Summary

- **If you see a CLA, avoid the project**, especially if you need to rely on it for the long term.
- If you see projects that **never merge contributions and instead rewrite them**, stay away, they’re a bad bet for long-term use.
- If a project’s handling of contributions is hidden behind closed doors, that’s another clear reason to avoid it.

# Additional Notes

- I may update this article from time to time to add more strong indicators that can help others choose and evaluate open source projects for long-term use.
- Can these indicators be automatically analyzed to create a scoring system for open source projects? I don't think so, there's a strong element of perception and context in this kind of analysis. And honestly, I suspect organizations would quickly start gaming the system just to get a better score.

