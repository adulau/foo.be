---
layout: post
title: "Improving Cybersecurity Impact Taxonomies"
date: 2024-12-08 00:01:00
categories: infosec
---

# Improving Cybersecurity Taxonomies Describing Impact and Cyber Harms Against Organizations

If you work in the cybersecurity field, the term `impact` is ubiquitous, appearing frequently in information security regulations such as NIS2 (and previously NIS1). It plays a critical role in reporting obligations and the definition of a `significant cyber threat`. 

The definition and classification of `impact` have been subjects of debate for some time. I recently incorporated a MISP taxonomy inspired by a [2018 publication](https://academic.oup.com/cybersecurity/article/4/1/tyy006/5133288?login=false) titled *"A taxonomy of cyber-harms: Defining the impacts of cyber-attacks and understanding how they propagate."* This publication offers a detailed taxonomy of cyber-harms experienced by organizations, helping to better define and classify the impacts of cyber-attacks.

If you are incident responder or DFIR practioners, it's giving a good way to classify the impact of what you analyse or used as discussion source for the victims of the cyber attacks. Even within a SOC or CSIRT team, you can use consistent terminology to classify the actual impact.

The [organizational cyber harms taxonomy](https://www.misp-project.org/taxonomies.html#_organizational_cyber_harm) is divided into several clear categories (predicates):

- **physical-digital**
- **economic**
- **psychological**
- **reputational**
- **social-societal**

For example, the **economic** category provides a well-defined set of impacts that can be applied in various organizational contexts and cases, ranging from `disrupted-operations` and `reduced-profits` to `pr-response-costs`.

In 2015, when we began designing the MISP taxonomy format, we didn’t anticipate the widespread success of the [misp-taxonomies repository](https://github.com/misp/misp-taxonomies). Today, it is widely used across various open source (and proprietary) threat intelligence tools, analytical projects, and open data classification initiatives.

If you use and/or manage a [MISP](https://www.misp-project.org/) instance, the taxonomy integration is seamless. You can choose to use one or more taxonomies, select specific parts (e.g., a single tag from a larger taxonomy), enforce their usage, run analytics on specific tags, or even filter API responses based on selected tags from the taxonomies.

The [organizational cyber harms taxonomy](https://www.misp-project.org/taxonomies.html#_organizational_cyber_harm) provides a good basis for describing impact on specific events or incidents. This can be used in complement with 

- [economical-impact](https://www.misp-project.org/taxonomies.html#_economical_impact) is a taxonomy designed to describe the financial impact, whether as a positive or negative outcome, on the tagged information (e.g., data exfiltration loss representing a negative impact for the victim but a positive gain for an adversary).
- [nis2](https://www.misp-project.org/taxonomies.html#_nis2) is a taxonomy that includes impacted sectors, the severity of the impact (which is open to interpretation), and the impact outlook (e.g., whether it is increasing or decreasing over time).

An overview of the taxonomy as used in MISP:

![An overview of the taxonomy organizational cyber harms taxonomy in MISP, the open source threat intelligence sharing platform](/assets/taxo.png)

My hope is that more organizations will share details about the impacts of their own events, as well as insights from other incidents. I understand this can be challenging, as sharing TTPs of threat actors is currently more widely accepted than sharing details about impacts. However, I truly hope this trend will shift, enabling more robust analytics and a clearer understanding of the actual impact of incidents—whether it is accurately represented or inflated. The formalized [organizational cyber harms taxonomy](https://www.misp-project.org/taxonomies.html#_organizational_cyber_harm) provides a solid foundation for improving the description and analysis of impacts.

Don't hesitate to propose new taxonomies or suggest improvements via the [GitHub repository](https://github.com/misp/misp-taxonomies).

# References

- MISP Taxonomy: [organizational-cyber-harm](https://www.misp-project.org/taxonomies.html#_organizational_cyber_harm) - A taxonomy for classifying organizational cyber harms based on categories such as physical, economic, psychological, reputational, and social/societal impacts in [MISP standard](https://www.misp-standard.org/) format.
- The [MISP Taxonomies collaborative GitHub repository](https://github.com/misp/misp-taxonomies) allows you to propose changes, updates, or corrections to the directory of taxonomies.
