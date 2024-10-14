---
layout: post
title: "From Ruins to Resilience: How Developing and Utilizing Open Source Solutions Enhances CSIRT Capabilities"
date: 2024-10-12 00:01:00
categories: infosec
---

# From Ruins to Resilience: How Developing and Utilizing Open Source Solutions Enhances CSIRT Capabilities

---

”Some cities have fallen into ruin and
some are built upon ruins but others
contain their own ruins while still
growing.” *Jeffrey Eugenides*

### Introduction

At CIRCL (Computer Incident Response Center Luxembourg), part of the Luxembourg House of Cybersecurity (LHC), we embarked on a journey to build and sustain open-source solutions for CSIRTs. With over 14 years of experience, we've gained valuable insights into open-source software development and community engagement in the cybersecurity field. Below are some of the key lessons we've learned along the way.

---

![](/assets/opensource-csirt.png)

When you buy proprietary tools, you're at the low end of both "doing" and "capabilities." You rely on external vendors, and your organization has less control over customization or internal improvement. Integrating proprietary or open-source tooling via APIs is a step up in capabilities. You are working to connect systems but may still be reliant on external providers for updates or changes. Contributing to open-source projects increases both capabilities and autonomy. At this stage, your organization is actively shaping the tools it uses, and you're likely interacting directly with the open-source community. The peak of capabilities and "doing" occurs when your team is actively maintaining open-source tooling. Here, the organization takes full ownership of development, support, and customization, gaining the highest level of control and expertise or even rewarding from a creative experience. 


## First Lesson: Publish and Embrace Criticism

- Many organizations hesitate to release open-source software due to fear of criticism.  
- **Don’t be afraid**—release early and release often. You are more likely to attract early adopters than critics in the beginning.  
- Document and share your specific programming methodologies to benefit the wider community. Even if the methodology sounds silly or too simple, it can be a factor of attractiveness.

[Read more about our methodology framework](https://datatracker.ietf.org/doc/draft-dulaunoy-programming-methodology-framework/02/)

---

## Second Lesson: Practice Vulnerability Handling

- Leading the development of open-source tools means taking responsibility for managing vulnerabilities in your projects.  
- For a CSIRT, this experience is invaluable, putting you in the shoes of a software vendor.  
- With widely-used projects like MISP, vulnerability handling is critical.  
- We've learned challenges like release notifications, vulnerability ID assignments, and proper disclosure.  
- The next time you handle a security vulnerability disclosure for software, you can share common experiences or even the painful challenges faced in coordinated vulnerability disclosure.

[Read more about MISP security and our approach to coordinated vulnerability disclosure](https://www.misp-project.org/security/)

---

## Third Lesson: Open Source as a Facilitator for Partnerships

- **Nothing fosters collaboration better than a successful open-source project**.  
- Open-source contribution models often eliminate the need for NDAs, confidentiality agreements, or IPR agreements.  
- In EU research projects, contributing to open-source projects provides clear outcomes and measurable Technology Readiness Levels (TRL).
- Contributing to an open-source project within a larger initiative often provides clarity on deliverables and emphasizes the practical ("doint"), hands-on aspects of the work.

---

## Fourth Lesson: Managing the Ruins of Software Dependencies

- Building and maintaining long-term open-source projects helps to grow a community of users and contributors.  
- Over time, outdated or obsolete software dependencies accumulate, becoming part of the development process.  
- As an “archeologist” of software stacks, you must address the inherent security risks, much like any software vendor would.

#### What about the ruins quote?

“Some cities have fallen into ruin and some are built upon ruins, but others contain their own ruins while still growing.” *Jeffrey Eugenides*

Software and security are indeed built on top of ruins. There are different ways to acknowledge this fact. One option is to ignore it and let the city fall into disrepair. Another is to simply build on top of the existing ruins. But the most interesting and rewarding approach is to embrace the ruins and use them as a foundation for growth. Open source and software, in general, are full of such ruins, and that is precisely how growth happens.

---

## Fifth Lesson: Open Source as a Standard Generator

- Developing information security standards without open-source implementations often leads to more discussion than creating interoperable tools.  
- Tools and formats created from open-source projects can serve as strong foundations for standards.  
- The MISP standard was built on real-world implementations, rather than theoretical committees.  
- Don’t hesitate to draft IETF Internet-Drafts based on your open-source tools—this can be the start of practical open and freely-accessible standards.

---

## Sixth Lesson: Learning from Threat Intelligence Collection

- Developing open-source tools for intelligence collection provides insights into the challenges faced by threat intelligence vendors.  
- Managing collection mechanisms allows your CSIRT to assess intelligence quality and understand fluctuations over time.  
- Building autonomy in intelligence collection often provides more value than relying solely on purchased vendor feeds.
- Although threat intelligence collection may initially seem time-consuming, the experience gained enables your organization to become more agile in building accurate intelligence from new collections.

---

## Seventh Lesson: Embrace Failure

- Failure is an essential part of designing new open-source tools for CSIRTs.  
- The vulnerability management landscape evolves constantly, requiring adaptable tools.  
- We initially developed and maintained cve-search but faced challenges with cve-portal due to a lack of proper software identifiers, leading us to develop [vulnerability-lookup](https://github.com/cve-search/vulnerability-lookup).  
- Each failure is necessary to create innovative open-source software that solves real-world problems.

---

## Eighth Lesson: Licenses and Copyright Are Critical

- Don’t underestimate the importance of open-source software licenses.  
- Pay attention to Contributor License Agreements (CLAs) and who ultimately owns the code.  
- After experiencing open-source dependencies becoming proprietary, we have taken a strong stance against CLAs and favor multiple copyright ownerships.

[Learn more about CLA-free initiatives](https://ossbase.org/initiatives/cla-free/)

---

## Ninth Lesson: Open Source as a Tool for Staff Retention and Skill Development

- The cybersecurity field often faces a skills shortage, with high turnover due to intellectual fatigue.  
- Enhancing CSIRT capabilities through open-source projects helps retain talent and expand expertise.  
- Open-source projects promote staff autonomy, benefiting both individual team members and the organization as a whole.
- Being part of an open-source project allows team members to feel individually recognized, which is a key factor in staff retention.

---

### Conclusion

The open-source journey for a CSIRT team is challenging but rewarding. It pushes back against the status quo, enhances team capabilities, and allows for a focus on developing staff instead of acquiring products. By continuously contributing to and maintaining open-source projects, organizations can significantly boost their capabilities.

---

### Additional Notes

#### Does this apply to other teams or organizations besides CSIRTs?

Most likely, these experiences have been shared by various teams, and some of the lessons may also apply to your organization, team, or project. Feel free to adapt and use any of these ideas.


### Acknowledgement 

Thanks to my teammates and colleagues at CIRCL for the discussions and work on this topic over the past 14 years. A special shoutout to [Jean-Louis](https://github.com/gallypette) for the insightful conversations around *[Turn the Ship Around](https://davidmarquet.com/turn-the-ship-around-book/)*. This presentation was first given at the CERT-EU Conference 2024. Many thanks to the CERT-EU team, and especially to Saâd Kadhi, for the opportunity and support.

### Some Open Source at CIRCL

- [MISP Project](https://www.misp-project.org/)  
- [AIL Project](https://www.ail-project.org/)  
- [D4 Project](https://www.d4-project.org/)  
- [Vulnerability-Lookup](https://vulnerability.circl.lu/)  
- [Flowintel](https://github.com/flowintel/flowintel)  
- [LookyLoo](https://github.com/Lookyloo/lookyloo)
- [pandora](https://github.com/pandora-analysis/pandora)
- [hashlookup](https://github.com/hashlookup/)
- [typosquatter](https://github.com/typosquatter/)
- [SkillAegies](https://github.com/MISP/SkillAegis)
- [misp-stix](https://github.com/misp/misp-stix)
- [Cerebrate](https://github.com/cerebrate-project/cerebrate)
- [Open Source Metrics at CIRCL](https://opensource-metrics.circl.lu/)


