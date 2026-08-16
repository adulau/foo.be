---
layout: post
title: "How mature is this repository? My long quest for open-source software metrics"
date: 2026-08-15
---

# How mature is this repository? My long quest for open-source software metrics

For years, I have been looking for a reasonable answer to a deceptively simple question:

> **When I discover an open-source software project for the first time, how can I estimate whether it is mature, healthy and usable?**

Usually the first encounter is a repository on GitHub, GitLab, Codeberg or another forge. And usually we start looking at the obvious things.

How many stars does it have? When was the last commit? How many contributors are there? Are there recent releases? Are issues being answered?

Those indicators are useful. But none of them answers the question.

A project with 20,000 GitHub stars can be abandoned. A project with 20 stars can be a boring but essential component maintained for fifteen years. A project with hundreds of commits per week may simply have a lot of automated dependency updates. A project with very few commits might actually be finished and extremely stable.

Even GitHub describes stars primarily as a way to bookmark repositories and, at best, as an approximate indication of interest.[^github-stars]

So the problem is not the absence of metrics.

The problem is that there are **far too many metrics**, they measure different things, and combining them into something meaningful is surprisingly difficult.

## Metrics everywhere

There has been a lot of excellent work in this area.

CHAOSS develops metrics and metric models specifically for understanding open-source community health and sustainability.[^chaoss] Its catalogue contains metrics ranging from release frequency and time to first response to Contributor Absence Factor, organizational diversity, project burnout, documentation accessibility and licensing.

The **Apereo OSS Health and Sustainability Rubric** takes another approach and groups more than forty criteria into broad areas covering Community, Governance, Development, Support and Security/Privacy.[^apereo]

The Apache Software Foundation has its own **Project Maturity Model**, covering code, licensing, releases, quality, community, consensus building, independence and governance.[^apache]

For security there is the **OpenSSF Scorecard**, which automatically evaluates a repository against security-related heuristics.[^scorecard] OpenSSF also maintains its Best Practices Badge programme, which combines automatically verifiable information with information supplied by maintainers.[^best-practices]

There is even an OpenSSF **Criticality Score**, which tries to estimate how important an open-source project is using signals such as project age, contributor count, organizations involved, commit frequency, releases, issue activity and dependency information.[^criticality]

Academic research reaches the same conclusion from another direction: OSS health is inherently multidimensional. One literature review identified more than one hundred characteristics distributed over fifteen themes.[^oss-health-paper]

So we have metrics.

Lots of metrics.

What we don't really have is a simple answer when encountering an unknown repository for the first time.

## The TRL idea

For many years, in various discussions around open-source projects, we came back to the idea of reusing **Technology Readiness Levels**, or TRLs.

TRL is the familiar scale from **1 to 9**, first developed in the NASA context and later reused by ESA, the European Commission and many research programmes.[^nasa-trl][^esa-trl]

Anyone involved in European research projects has probably encountered TRLs in one proposal or another. Horizon Europe continues to use the concept to describe the maturity expected from research and innovation activities.[^horizon]

Of course, applying traditional TRL directly to open-source software doesn't really work.

A Git repository cannot tell us whether a technology has been demonstrated in an operational environment. GitHub cannot reliably tell us how many hospitals, companies, CERTs, universities or spacecraft are actually using a piece of software.

But I still like one property of TRL:

**everybody understands a progression from 1 to 9.**

So perhaps we could reuse the *idea* of TRL without pretending that repository metrics are equivalent to NASA's technology assessment.

This became **OSSTRL — Open Source Software Technology Readiness Level**.[^osstrl]

## OSSTRL

[OSSTRL](https://github.com/adulau/osstrl) is an experiment.

Its goal is to estimate an **open-source software readiness level from 1 to 9 using evidence that can be automatically collected from a GitHub repository**.

The current prototype borrows heavily from the structure of the Apereo OSS Health and Sustainability Rubric and groups evidence into:

* Community;
* Governance;
* Development;
* Support;
* Security and Privacy.

It collects things such as repository age, contributors, activity, releases, documentation, governance files, CI, tests, security policies and responsiveness.

Those individual observations produce a weighted evidence score, which is mapped to an OSSTRL level.

But there are two important twists.

First, **coverage/confidence is reported separately from the score**. If something cannot be measured from GitHub, it should not silently become a zero.

Second, there are **readiness gates**. A repository cannot reach a high level merely by collecting enough cheap points. For example, higher OSSTRL levels progressively expect evidence such as active development, releases, several contributors, governance, a security policy, CI and tests.[^osstrl]

This is deliberately imperfect.

And that's actually part of the experiment.

## What can we measure?

While working on OSSTRL, I started compiling the metrics that *could* be useful when evaluating an open-source project.

The following catalogue is intentionally broad. Some metrics overlap. Some are good indicators, some are terrible indicators when used alone, and some are almost impossible to automate correctly.

I use three rough classes:

* **[A] Automatable** — normally obtainable from a forge, repository, package ecosystem or automated analysis.
* **[P] Partially automatable** — useful evidence can be collected automatically, but interpretation is required.
* **[H] Human/external evidence** — usually requires maintainers, users or external verification.

These categories are intentionally approximate. Even an apparently simple automated metric can become ambiguous once different development models, mirrors, bots or external infrastructure enter the picture.

### Repository identity and discoverability

* **[A] Repository age** — time since repository creation.
* **[A] Public accessibility** — whether the authoritative source repository is publicly accessible.
* **[A] Archived status** — whether the repository is explicitly archived.
* **[A] README presence**.
* **[P] README completeness**.
* **[A] Project description present**.
* **[A] Homepage/project website configured**.
* **[A] Repository topics/tags**.
* **[A] Documentation directory present**.
* **[P] Documentation discoverability**.
* **[P] Documentation usability**.
* **[P] Documentation accessibility**.
* **[A] Installation instructions present**.
* **[A] Developer setup instructions present**.
* **[A] Examples/tutorials present**.
* **[A] API documentation artifacts**.
* **[A] CHANGELOG/history present**.
* **[A] CONTRIBUTING file present**.
* **[A] Code of Conduct present**.
* **[A] Issue templates present**.
* **[A] Pull-request templates present**.
* **[A] SECURITY policy present**.
* **[A] Governance documentation present**.
* **[A] Maintainer list present**.
* **[A] CODEOWNERS present**.
* **[A] Roadmap present**.
* **[A] Funding metadata present**.

GitHub itself exposes a community-profile API based on several of these repository artefacts, such as the presence of a README, licence, Code of Conduct and contribution documentation.[^github-community]

These metrics are useful because they are easy to collect. They are also dangerous because the existence of `GOVERNANCE.md` does not prove that governance works, just as the existence of `SECURITY.md` does not prove that vulnerabilities are handled properly.

### Popularity, visibility and adoption

This is the category where misleading metrics are especially common.

* **[A] Star count**.
* **[A] Star growth/velocity**.
* **[A] Watchers/subscribers**.
* **[A] Fork count**.
* **[P] Active forks** rather than merely created forks.
* **[A] Repository clones** where statistics are available.
* **[A] Unique cloners**.
* **[A] Repository page views**.
* **[A] Unique visitors**.
* **[A] Package downloads**.
* **[A] Number of distinct package versions downloaded**.
* **[A] Container image pulls**.
* **[A] Number of downstream dependencies/dependents**.
* **[A] Reverse dependency count**.
* **[P] Inclusion in operating-system distributions**.
* **[P] Number of integration projects**.
* **[P] Number of plugins/extensions built around the project**.
* **[H] Number of known installations**.
* **[H] Number of production installations**.
* **[H] Number of distinct user organisations**.
* **[H] Number of public references/case studies**.
* **[P] Academic citations**.
* **[P] Conference/tutorial references**.
* **[P] External community activity**.
* **[P] Project popularity/recommendability**.

Stars are therefore one metric among many, not a maturity level.[^github-stars]

The same is true of downloads. A dependency may be downloaded millions of times because it is part of automated build systems, while another project may have a few hundred downloads but be deployed on extremely important infrastructure.

### Development activity

* **[A] Time since last commit**.
* **[A] Time since last push**.
* **[A] Commits during the last 30/90/365 days**.
* **[A] Commit frequency**.
* **[A] Active development days per month**.
* **[A] Number of active branches**.
* **[A] Branch lifecycle/duration**.
* **[A] Code churn**.
* **[A] Lines added/removed**.
* **[A] Burstiness of activity**.
* **[A] Development velocity**.
* **[A] Periods without development activity**.
* **[P] Ratio of maintenance commits to feature development**.
* **[P] Ratio of human to bot activity**.
* **[A] Bot activity**.
* **[P] Technical forks**.
* **[P] Development activity trend** — growing, stable or declining.

Absolute activity is less useful than the **trend**.

A project going from fifty active contributors to five tells us something very different from a project that has operated happily with five people for ten years.

Even commit counts are not straightforward. A repository can contain generated code, automated dependency-update commits, vendored source or extremely granular commits. GitHub exposes many useful repository statistics through its APIs, but interpretation remains the difficult part.[^github-metrics]

### Contributors and community sustainability

* **[A] Number of unique contributors**.
* **[A] Number of non-bot contributors**.
* **[A] Active contributors during a defined period**.
* **[A] New contributors**.
* **[A] Returning contributors**.
* **[A] Occasional contributors**.
* **[A] Inactive contributors**.
* **[A] Contributor growth rate**.
* **[A] Contributor retention**.
* **[A] Contributor churn**.
* **[A] Contribution frequency per contributor**.
* **[A] Distribution of contributions between contributors**.
* **[A] Contributor Absence Factor** — the smallest number of contributors responsible for a given proportion of contributions.
* **[A] Elephant Factor** — organizational concentration of contributions.
* **[P] Bus factor**.
* **[A/P] Organizational diversity**.
* **[P] Organizational influence**.
* **[P] Contributor location diversity**.
* **[P] Time-zone diversity**.
* **[P] Types of contributions** — code, documentation, issues, reviews, translations, community work, etc.
* **[P] Labor investment**.
* **[P] Contributor recognition**.
* **[H] Contributor satisfaction**.
* **[H] Newcomer experience**.
* **[H] Psychological safety**.
* **[H] Project burnout**.
* **[P] Mentorship activity**.
* **[P] Job opportunities around the project**.
* **[P] Sponsorship of contributors**.

CHAOSS is particularly valuable here because it explicitly treats community health as more than commit counting.[^chaoss]

A repository with one thousand historical contributors may today be maintained by one exhausted person. Conversely, a highly focused library maintained by two people for twenty years may be perfectly sustainable.

The *distribution* and *evolution* of contributions often tell us more than the absolute number.

### Issues and bug management

* **[A] Number of open issues**.
* **[A] New issues per period**.
* **[A] Closed issues per period**.
* **[A] Active issues**.
* **[A] Issue closure ratio**.
* **[A] Median issue age**.
* **[A] Age of oldest unresolved issue**.
* **[A] Time to first response**.
* **[A] Issue response time distribution**.
* **[A] Time to close**.
* **[A] Issue resolution duration**.
* **[A] Defect resolution duration**.
* **[A] Percentage of issues receiving a human response**.
* **[A] Backlog growth rate**.
* **[A] Stale issue ratio**.
* **[P] Label quality/consistency**.
* **[P] Ratio of bugs/features/questions**.
* **[P] New contributors successfully closing issues**.

Time to first response is particularly interesting because it can be measured fairly consistently and says something about whether someone arriving at the project will encounter an active community.

CHAOSS includes response and closure metrics in its starter health model alongside release frequency and contributor-concentration metrics.[^chaoss-starter]

But even here context matters. A project deliberately using a mailing list instead of GitHub Issues may look completely unresponsive if we only inspect the forge.

### Pull requests and code-review practices

* **[A] Number of change requests/pull requests**.
* **[A] Accepted pull requests**.
* **[A] Declined pull requests**.
* **[A] Pull-request acceptance ratio**.
* **[A] Pull-request closure ratio**.
* **[A] Pull-request duration**.
* **[A] Time to first review**.
* **[A] Review duration**.
* **[A] Number of review cycles**.
* **[A] Reviews per pull request**.
* **[A] Commits per pull request**.
* **[A] Number of distinct reviewers**.
* **[A] Self-merge rate**.
* **[A] Percentage of changes reviewed by another person**.
* **[A] Stale pull-request count**.
* **[A] Pull-request backlog trend**.
* **[P] Contribution attribution quality**.

These metrics help distinguish "many contributors exist in Git history" from "there is still a functioning collaborative development process".

Review practices are also relevant from a security perspective. OpenSSF Scorecard, for example, includes code review as one of its checks because independent review reduces the risk associated with direct, unreviewed changes.[^scorecard-checks]

### Releases

* **[A] Number of releases**.
* **[A] Number of stable releases**.
* **[A] Release frequency**.
* **[A] Time since latest release**.
* **[A] Releases during the last 12/24 months**.
* **[A] Median interval between releases**.
* **[A] Release cadence regularity/variance**.
* **[A] Presence of prereleases**.
* **[A] Semantic-version-like tags**.
* **[P] Semantic Versioning compliance**.
* **[A] Release notes present**.
* **[A] Changelog present**.
* **[P] Backwards-incompatible changes documented**.
* **[P] Supported release branches**.
* **[P] Length of support window**.
* **[P] Security release latency**.
* **[A] Release artifacts available**.
* **[A] Packages generated by CI/CD**.
* **[A] Cryptographically signed releases**.
* **[A] Checksums supplied for releases**.

Release frequency should not automatically reward projects that release every Tuesday.

A small, stable library might legitimately release once every few years. A web application exposed to an evolving ecosystem might need a much faster cadence.

Regularity and recency are useful observations, but they should not automatically become universal requirements.

### Code and engineering quality

Repository metadata alone is insufficient here, but a local checkout and CI results provide many additional metrics.

* **[A] Lines of code**.
* **[A] Programming-language distribution**.
* **[A] Code-change volume**.
* **[A] Number of tests**.
* **[A] Automated test suite present**.
* **[A] Unit-test coverage**.
* **[A] Integration-test coverage**.
* **[A] End-to-end tests present**.
* **[A] CI configured**.
* **[A] CI success rate**.
* **[A] Build success rate**.
* **[A] Build duration**.
* **[A] Number/rate of flaky tests**.
* **[A] Static-analysis findings**.
* **[A] Linter warnings/errors**.
* **[A] Type-checking coverage**.
* **[A] Cyclomatic complexity**.
* **[A] Maintainability index**.
* **[A] Code duplication percentage**.
* **[A] Function/method size distribution**.
* **[A] Defect density**.
* **[A] Fuzzing present**.
* **[P] Fuzzing coverage**.
* **[A/P] Performance benchmarks**.
* **[A/P] Performance regression rate**.
* **[P] Reproducible builds**.

Test coverage is itself a nice example of the general problem: 90% coverage tells us something, but it certainly doesn't mean that 90% of the bugs have disappeared.

Similarly, code complexity has very different meanings across languages and project types.

These metrics are often useful for comparisons **within the same project over time**, but are less reliable when ranking unrelated projects.

### Dependencies and software supply chain

* **[A] Number of direct dependencies**.
* **[A] Number of transitive dependencies**.
* **[A] Dependency depth**.
* **[A] Upstream dependency count**.
* **[A] Outdated dependencies**.
* **[A] Dependency age / Libyears**.
* **[A] Pinned build dependencies**.
* **[A] Automated dependency-update tooling**.
* **[A] Lock files present**.
* **[A] SBOM present**.
* **[A] SBOM published with releases**.
* **[A] SPDX document present**.
* **[A] CycloneDX/SPDX validity**.
* **[A] Build provenance present**.
* **[P] SLSA build level**.
* **[A/P] Reproducible build evidence**.
* **[A] Package published through CI**.
* **[A] Artifact signing/attestation**.

The number of dependencies is not inherently good or bad. Reusing a well-maintained library is usually preferable to reimplementing it badly.

But dependency depth, outdated components and supply-chain provenance can expose risks that do not appear in ordinary source-code activity metrics.

SLSA is interesting here because it defines increasing guarantees around software build integrity and provenance.[^slsa]

SPDX provides a standardized representation for software components, licences, copyrights and relationships, making some supply-chain and legal information machine readable.[^spdx]

### Security

Security deserves its own set of metrics, and OpenSSF Scorecard already demonstrates how much can be checked automatically.[^scorecard]

Candidate signals include:

* **[A] SECURITY.md present**.
* **[P] Clear vulnerability disclosure process**.
* **[A/P] Security contact available**.
* **[P] Supported versions documented**.
* **[P] Disclosure timeline documented**.
* **[A] Security advisories published**.
* **[A] Known unfixed vulnerabilities**.
* **[A] Vulnerable dependencies**.
* **[A] Vulnerability backlog**.
* **[A/P] Mean vulnerability remediation time**.
* **[A/P] Time from disclosure to fixed release**.
* **[A] Dependency-update automation**.
* **[A] Static Application Security Testing (SAST)**.
* **[A] Fuzzing**.
* **[A] Secret scanning/security automation**.
* **[A] Branch protection**.
* **[A] Code review before merge**.
* **[A] Dangerous CI workflow patterns**.
* **[A] Workflow token permissions**.
* **[A] Pinned build dependencies**.
* **[A] Checked-in binary artifacts**.
* **[A] Signed releases**.
* **[A] SBOM publication**.
* **[A] OpenSSF Scorecard score**.
* **[A/P] OpenSSF Best Practices level**.
* **[H] Independent security audit**.
* **[H] Security-review history**.
* **[H] Evidence of an operational CVD/PSIRT process**.

The OpenSSF approach is useful precisely because it does **not** reduce everything to "does `SECURITY.md` exist?". Its checks include code review, dangerous workflows, dependency updates, fuzzing, pinned dependencies, SAST, token permissions, signed releases and known vulnerabilities, among other signals.[^scorecard-checks]

OpenSSF's Best Practices programme provides another useful model because it mixes observable properties with declarations from maintainers.[^best-practices]

That hybrid model is probably unavoidable if we want to evaluate things such as actual vulnerability-handling practices.

### Licensing and legal clarity

* **[A] License file present**.
* **[A] Recognized SPDX license identifier**.
* **[A] OSI-approved license**.
* **[A] License coverage across source files**.
* **[A/P] REUSE specification compliance**.
* **[A] Copyright statements**.
* **[P] Copyright ownership clarity**.
* **[A/P] Dependency-license compatibility**.
* **[A] SPDX document available**.
* **[P] Contributor License Agreement process**.
* **[P] Developer Certificate of Origin/sign-off process**.
* **[P] Third-party code attribution**.
* **[P] NOTICE/attribution completeness**.

A top-level `LICENSE` file is valuable evidence, but it is not sufficient to establish the legal status of every file and dependency.

The REUSE specification is particularly interesting for automation because it aims to make copyright and licensing information unambiguous and machine readable on a per-file basis.[^reuse]

SPDX provides another important building block by defining standardized identifiers and document formats for communicating software licensing and component information.[^spdx]

### Governance

This is where repository automation starts becoming much less reliable.

* **[A] GOVERNANCE document exists**.
* **[A] Maintainers documented**.
* **[A] CODEOWNERS documented**.
* **[P] Decision-making process documented**.
* **[P] Contributor-to-maintainer promotion process**.
* **[P] Voting/consensus rules**.
* **[P] Conflict-resolution process**.
* **[P] Public decision records**.
* **[P] Communication transparency**.
* **[P] Roadmap publication**.
* **[P] Roadmap freshness**.
* **[P] Leadership diversity**.
* **[P] Board/council diversity**.
* **[P] Organizational concentration of decision power**.
* **[P] Organizational concentration of commits**.
* **[P] Organizational concentration of funding**.
* **[P] Maintainer succession plan**.
* **[P] Trademark/branding ownership clarity**.
* **[H] Effective independence from a single vendor**.
* **[H] Whether documented governance corresponds to actual practice**.

The Apache maturity model is especially useful here because it makes explicit that mature open source is not just code: it includes licensing, releases, community, consensus building and independence.[^apache]

Similarly, the Apereo rubric considers governance and management alongside development activity and technical characteristics.[^apereo]

This matters because an apparently healthy repository can still be fragile if every important decision, credential and release key belongs to one individual.

### Support

* **[A] Public issue tracker available**.
* **[A] Discussion forum available**.
* **[A/P] Chat/community channel available**.
* **[P] Support channel discoverability**.
* **[A] Response time to questions**.
* **[A] Question-resolution time**.
* **[P] Documentation freshness**.
* **[P] Backwards-compatibility policy**.
* **[P] Upgrade/migration documentation**.
* **[P] Supported versions**.
* **[P] Support lifecycle**.
* **[H] Commercial support availability**.
* **[H] Community support capacity**.
* **[H] Training availability**.

Support is another area where external context matters.

A project can look inactive on GitHub while having a very active mailing list. Another project can have hundreds of unanswered GitHub issues but excellent commercial support for production users.

The repository tells us something, but rarely everything.

### Diversity, inclusion and community culture

These metrics are difficult to collect responsibly and should not simply be scraped from contributor profiles.

CHAOSS nevertheless identifies useful areas to consider as part of the health of an open-source community.[^chaoss]

Potential dimensions include:

* **[H/P] Inclusive leadership**.
* **[H] Psychological safety**.
* **[H] Newcomer experience**.
* **[P] Inclusive issue labels and terminology**.
* **[H/P] Chat-platform inclusivity**.
* **[H/P] Meeting attendance**.
* **[H/P] Meeting accessibility**.
* **[H/P] Time-zone inclusion**.
* **[H/P] Event accessibility**.
* **[H/P] Event-location inclusivity**.
* **[H] Family friendliness of events**.
* **[H] Conflict resolution and mediation**.
* **[H] Contributor satisfaction**.

Some things are worth measuring precisely because they **cannot responsibly be inferred from GitHub usernames**.

This is an important boundary for an automated evaluator: the existence of data does not imply that collecting or inferring it is appropriate.

### Funding and economic sustainability

* **[A/P] Funding mechanisms documented**.
* **[A/P] GitHub Sponsors/OpenCollective/etc. configured**.
* **[P] Number of sponsors**.
* **[P] Sponsor diversity**.
* **[P] Recurring versus one-off funding**.
* **[P] Funding concentration**.
* **[H] Funding runway**.
* **[H] Number of maintainers paid to work on the project**.
* **[H] Percentage of maintenance work funded**.
* **[H] Dependency on a single employer**.
* **[H] Ability to finance infrastructure/security work**.
* **[H] Availability of long-term institutional support**.

A project maintained by one developer in their spare time and a project maintained by five full-time developers may have identical GitHub activity today while having very different sustainability risks tomorrow.

Funding is therefore important, but difficult to reduce to a repository metric.

A `.github/FUNDING.yml` file tells us that a funding mechanism exists. It says almost nothing about whether the project is economically sustainable.

### Ecosystem importance and criticality

Health and importance are also different concepts.

An abandoned project with millions of dependents may be extremely important while being spectacularly unhealthy.

Potential criticality metrics include:

* **[A] Number of downstream dependents**.
* **[A] Transitive dependency reach**.
* **[A] Reverse dependency centrality**.
* **[P] Number of ecosystems distributing the software**.
* **[P] Number of operating-system distributions containing it**.
* **[P] Number of organizations contributing**.
* **[P] Number of organizations relying on it**.
* **[P] OpenSSF Criticality Score**.
* **[P] Dependency-network centrality**.
* **[H] Use in critical infrastructure**.
* **[H] Availability of realistic substitutes**.
* **[H] Cost of replacing the project**.

The OpenSSF Criticality Score is an interesting existing experiment. It combines a range of repository signals into an estimate intended to help identify projects that may deserve particular attention.[^criticality]

But **criticality still doesn't mean quality**.

And it doesn't mean maturity.

This distinction matters when deciding where to invest security or maintenance resources. Sometimes the project we should care most about is precisely the unhealthy one because half the software ecosystem depends on it.

### Operational maturity — the missing evidence

And finally we reach the information that a Git repository usually cannot tell us.

This is also where traditional TRL and OSSTRL diverge most strongly.

* **[H] Number of real-world deployments**.
* **[H] Number of production deployments**.
* **[H] Number of independent organisations operating the software**.
* **[H] Years of production use**.
* **[H] Deployment scale**.
* **[H] Availability/uptime history**.
* **[H] Performance under realistic workloads**.
* **[H] Scalability evidence**.
* **[H] Operational incident history**.
* **[H] Recovery procedures tested**.
* **[H] Upgrade procedures tested in production**.
* **[H] Long-term data migration experience**.
* **[H] Compatibility across supported environments**.
* **[H] External security assessments**.
* **[H] Accessibility assessments**.
* **[H] User references/case studies**.
* **[H] Long-term support commitments**.

These are precisely the signals required to make statements resembling traditional high TRL levels.

NASA's TRL concept progresses toward systems demonstrated and ultimately proven in operational conditions.[^nasa-trl]

GitHub cannot magically provide that evidence.

This is probably the single biggest limitation of any attempt to derive a TRL-like value purely from repository information.

## Automation is the difficult part

The interesting challenge is therefore not defining another list of metrics.

The challenge is deciding:

- what can be collected automatically;
- what can be collected reliably;
- what actually means something;
- how metrics should be normalized;
- how metrics should be weighted;
- what information should remain explicitly **unknown**;
- and what combinations of evidence are required before claiming a higher level.

This last point is important.

Imagine a repository with:

* excellent documentation;
* a Code of Conduct;
* issue templates;
* a governance document;
* a security policy;
* lots of GitHub stars;

but no release for four years.

A pure weighted average could still give it a surprisingly respectable score.

That feels wrong.

This is why OSSTRL uses **gates** in addition to weights.[^osstrl]

Some evidence should be prerequisites rather than merely additional points.

For example, documentation should help a project score better, but documentation alone should not compensate indefinitely for the absence of active development, tests, stable releases or a functioning contributor community.

## Unknown is not zero

Another lesson from this exercise is that:

> **missing evidence and negative evidence are different things.**

If GitHub doesn't show a privacy policy, that doesn't necessarily mean the project has no privacy policy.

If there are no GitHub Releases, the project might publish through Debian, PyPI, npm, Maven, its own infrastructure or somewhere else.

If we cannot discover production deployments, that doesn't mean there are none.

If the project doesn't use GitHub Issues, it may be using Bugzilla, Jira, GitLab, a mailing list or another support system.

An automated system therefore needs at least three states:

```text
yes
no
unknown
```

And probably a fourth one:

```text
not applicable
```

This sounds trivial, but many scoring systems effectively collapse `unknown` into `no`.

That creates a strange incentive: projects that expose more information can actually appear worse because there is more evidence available to evaluate them.

This is also why I think an OSSTRL report should always display **coverage/confidence next to the score**.[^osstrl]

For example:

```text
OSSTRL 7/9
score: 76%
confidence/coverage: 42%
```

means something very different from:

```text
OSSTRL 7/9
score: 76%
confidence/coverage: 100%
```

The first result should encourage investigation rather than confidence.

## Repository evidence and asserted evidence

A possible next step for OSSTRL would be to use two separate evidence channels. The first one remains completely automatic:

```text
GitHub/GitLab/forge
        |
        v
repository evidence
        |
        v
automatic OSSTRL
```

A second channel could allow maintainers to provide an `osstrl.yaml` file containing externally verifiable evidence:

```yaml
deployments:
  known_organisations: 27
  references:
    - https://example.org/case-study

security:
  external_audit:
    date: 2026-05-12
    report: https://example.org/audit.pdf

support:
  supported_versions:
    - "6.x"

operations:
  production_since: 2018
```

The distinction would remain explicit:

* **observed evidence** — collected independently from the repository or other public sources;
* **asserted evidence** — provided by the project;
* **verified external evidence** — assertions backed by independent references.

This is similar in spirit to the distinction implicit in initiatives such as the OpenSSF Best Practices programme, where some evidence can be automatically checked while other properties must be declared by the project.[^best-practices]

That could bring OSSTRL closer to actual technology readiness without pretending that a GitHub API contains information it simply doesn't have. But the reality is many projects won't create a YAML file with the ddetails and why I kept OSSTRL[^osstrl] as is.

## Different metrics for different questions

Another conclusion from this long quest is that the question itself matters.

When somebody says:

> Is this a good open-source project?

they may actually be asking several different questions.

### Is it alive?

Look at:

* recent development;
* recent releases;
* responsiveness;
* contributor activity;
* backlog evolution.

### Is it mature?

Look at:

* age;
* release history;
* documentation;
* testing;
* governance;
* compatibility practices;
* operational references.

### Is it sustainable?

Look at:

* contributor concentration;
* organizational diversity;
* funding;
* maintainer turnover;
* governance;
* succession;
* community growth and retention.

### Is it secure?

Look at:

* vulnerability disclosure;
* dependency management;
* security automation;
* code review;
* SAST;
* fuzzing;
* provenance;
* release signing;
* known vulnerabilities.

OpenSSF Scorecard focuses deliberately on this particular dimension rather than claiming to measure complete project health.[^scorecard]

### Is it important?

Look at:

* dependents;
* deployments;
* ecosystem centrality;
* downstream usage;
* organizational adoption.

This is closer to what OpenSSF Criticality Score attempts to estimate.[^criticality]

### Is it open?

Look at:

* licensing;
* public development;
* contribution process;
* governance;
* decision transparency;
* contributor independence.

### Is it ready for my use case?

And this one is almost impossible to answer generically. A project can be perfectly mature and still be the wrong software for your requirements. This is why there is probably no meaningful universal ranking of all open-source projects.

## No magic score

I don't think OSSTRL will ever provide an objectively correct answer.  And I don't think it should. There is probably no universal formula where:

```text
42 contributors
+ 8300 stars
+ 93% test coverage
+ SECURITY.md
= mature open-source project
```

Different software has different needs. Linux, SQLite, a Python library, a Kubernetes operator, a desktop application and a twenty-line Unix tool cannot reasonably be evaluated in exactly the same way.

Metrics are observations. A score is an interpretation of those observations.

This distinction is visible throughout the existing work on OSS health. CHAOSS provides a large collection of metrics and metric models rather than one universal health score.[^chaoss] Apache describes maturity as a collection of characteristics instead of a numerical ranking.[^apache] Apereo similarly evaluates a broad set of organizational, community and technical properties.[^apereo]

That is probably not accidental. OSSTRL[^osstrl] is therefore best understood as a **first-pass maturity estimator**: something that can quickly inspect an unfamiliar repository, expose the evidence behind its result, and highlight where we need to look deeper.

The real objective is not the number.

The useful part is being able to say:

> *This project looks mature because of these observable facts, we could not verify these other facts, and these are the areas that deserve human investigation.*

That, to me, is already much more useful than counting GitHub stars.

And the quest continues.

[^osstrl]: **OSSTRL — Open Source Software Technology Readiness Level**, Alexandre Dulaunoy et al. OSSTRL is an experimental open-source application that estimates a readiness/maturity level from 1 to 9 using evidence that can be gathered automatically from a GitHub repository. The current implementation evaluates repository evidence across Community, Governance, Development, Support and Security/Privacy. It produces both a weighted score and a separate confidence/coverage value, then applies readiness gates to prevent easily observable repository artefacts from being sufficient on their own for a high maturity level. The project explicitly presents the result as an estimate rather than a replacement for a formal Technology Readiness Level assessment. Source code, methodology and examples: [https://github.com/adulau/osstrl](https://github.com/adulau/osstrl).

[^nasa-trl]: **NASA — Technology Readiness Levels (TRLs)**. NASA uses a nine-level scale for describing the maturity of technology, beginning with basic principles and progressing through proof of concept, validation and demonstration toward technology that has been proven in successful operational use. TRLs originated in the NASA environment before spreading to other space agencies, governments and research-funding programmes. The distinction between repository maturity and actual operational demonstration is particularly important for OSSTRL: Git repository data can provide substantial evidence about software-development maturity, but cannot by itself establish the operational evidence expected at the upper end of a traditional TRL scale. NASA overview: [https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/](https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/).

[^esa-trl]: **European Space Agency — Technology Readiness Levels**. ESA uses the nine-level TRL scale as part of its technology-development activities and notes that the concept was originally proposed by NASA. In the ESA context, TRLs describe progression from fundamental technology principles through validation and demonstration toward flight-proven or operational technology. The widespread reuse of this common 1-to-9 vocabulary is one reason it provides an attractive conceptual model for an OSS maturity indicator, even though repository-based evidence and traditional TRL evidence are fundamentally different. ESA, *About ESA technology programmes*: [https://www.esa.int/Enabling_Support/Space_Engineering_Technology/About_ESA_technology_programmes](https://www.esa.int/Enabling_Support/Space_Engineering_Technology/About_ESA_technology_programmes).

[^horizon]: **European Commission — Horizon Europe and Technology Readiness Levels**. TRLs are widely used in European Union research and innovation programmes to describe the expected maturity of technologies at different stages of funded activities. Calls may specify the expected TRL at the start or end of a project, distinguishing activities oriented toward research, validation, demonstration, piloting or deployment. This repeated use in European projects makes the 1-to-9 TRL vocabulary particularly familiar to organisations participating in EU-funded research. European Commission, *Horizon Europe work programmes*: [https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe/horizon-europe-work-programmes_en](https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe/horizon-europe-work-programmes_en).

[^chaoss]: **CHAOSS — Community Health Analytics in Open Source Software**. CHAOSS is a Linux Foundation project developing open methodologies, metrics and metric models for understanding the health and sustainability of open-source communities. Its work covers technical activity as well as contributor behaviour, responsiveness, organizational diversity, governance, inclusion, risk, sustainability and ecosystem characteristics. Rather than defining one universal OSS health score, CHAOSS provides a large catalogue of individual metrics and combinations of metrics intended to answer particular questions. This makes CHAOSS a useful illustration of the central problem discussed in this post: open-source health is inherently multidimensional, and metrics only become meaningful when the question being asked is clear. See the CHAOSS overview of metrics and metric models at [https://www.chaoss.community/kb-metrics-and-metrics-models/](https://www.chaoss.community/kb-metrics-and-metrics-models/) and the complete catalogue at [https://www.chaoss.community/kbtopic/all-metrics/](https://www.chaoss.community/kbtopic/all-metrics/).

[^chaoss-starter]: **CHAOSS — Starter Project Health Metrics Model**. The CHAOSS Starter Project Health Metrics Model provides a deliberately small collection of metrics intended to give newcomers an initial view of project health without requiring analysis of the entire CHAOSS catalogue. It includes complementary signals such as release frequency, time to first response, change-request closure ratio and Contributor Absence Factor. The model is relevant to OSSTRL because it demonstrates that even a first-pass assessment benefits from mixing different dimensions: development activity, responsiveness and concentration of contributions reveal different kinds of project risk. [https://www.chaoss.community/kb/metrics-model-starter-project-health/](https://www.chaoss.community/kb/metrics-model-starter-project-health/).

[^apereo]: **Apereo Foundation — OSS Health and Sustainability Rubric**. The Apereo OSS Health and Sustainability Rubric provides a structured methodology for evaluating the health and long-term sustainability of open-source software projects. The rubric contains more than forty assessment criteria spanning areas including **Community, Governance, Development, Support, and Security/Privacy**. Criteria include project maturity, contributor diversity, responsiveness, governance and management practices, roadmaps, funding, development activity, release consistency, licensing, integrations, documentation, backwards compatibility, support, security review and privacy practices. A particularly useful aspect of the rubric is that it mixes properties that can be inferred from repository evidence with properties that require knowledge about real implementations, organisations, funding and community practices. OSSTRL uses the Apereo rubric as a major source of inspiration but intentionally implements only the subset for which useful evidence can currently be gathered automatically; it does not claim to reproduce an official Apereo score. The rubric is maintained openly on GitHub and is licensed under Creative Commons Attribution 4.0: [https://github.com/apereo/oss-rubric](https://github.com/apereo/oss-rubric).

[^apache]: **Apache Software Foundation — Apache Project Maturity Model**. The Apache Project Maturity Model describes a collection of characteristics commonly found in mature open-source projects. Rather than reducing maturity to a numerical score, the model examines code, licensing, releases, quality, community, consensus building and independence. Its emphasis on independence and consensus is particularly relevant because technical activity alone does not guarantee a sustainable open-source project: a repository can be technically excellent while remaining completely dependent on one individual or one company. The model therefore provides a useful complement to metrics based primarily on forge activity. [https://community.apache.org/apache-way/apache-project-maturity-model](https://community.apache.org/apache-way/apache-project-maturity-model).

[^scorecard]: **OpenSSF — Scorecard**. OpenSSF Scorecard is an automated security-analysis project for open-source repositories. It evaluates repository configuration and development practices using a set of security-oriented checks and produces results that can be integrated into automated workflows. Scorecard checks cover areas such as code review, branch protection, dependency updates, dangerous CI workflows, fuzzing, licences, maintained status, packaging, pinned dependencies, static analysis, security policies, signed releases, token permissions and known vulnerabilities. Scorecard is an important precedent for OSSTRL because it demonstrates that meaningful repository properties can be estimated automatically while still acknowledging that each individual check is a heuristic rather than proof of complete security. OpenSSF project page: [https://openssf.org/projects/scorecard/](https://openssf.org/projects/scorecard/). Source code: [https://github.com/ossf/scorecard](https://github.com/ossf/scorecard).

[^scorecard-checks]: **OpenSSF Scorecard — Check Documentation**. The Scorecard check documentation describes the individual security properties evaluated by the tool and the evidence used to estimate each property. Examples include `Binary-Artifacts`, `Branch-Protection`, `CI-Tests`, `Code-Review`, `Contributors`, `Dangerous-Workflow`, `Dependency-Update-Tool`, `Fuzzing`, `License`, `Maintained`, `Packaging`, `Pinned-Dependencies`, `SAST`, `Security-Policy`, `Signed-Releases`, `Token-Permissions` and `Vulnerabilities`. The documentation is also a useful example of the limitations inherent in automated metrics: a detectable repository practice is normally a proxy for a desirable security property rather than definitive evidence that the project is secure. [https://github.com/ossf/scorecard/blob/main/docs/checks.md](https://github.com/ossf/scorecard/blob/main/docs/checks.md).

[^best-practices]: **OpenSSF — Best Practices Badge Program**. The OpenSSF Best Practices Badge programme provides projects with a structured set of criteria covering secure development, basic quality practices, change control, vulnerability reporting, build processes and documentation. Unlike a purely automated repository scanner, the badge process combines information that can be checked automatically with declarations provided by project maintainers. This hybrid model is relevant to OSSTRL because many important maturity characteristics — production deployments, support commitments, security audits, governance effectiveness or accessibility practices — cannot be reliably inferred from repository metadata alone. [https://openssf.org/projects/best-practices-badge/](https://openssf.org/projects/best-practices-badge/).

[^criticality]: **OpenSSF — Criticality Score**. Criticality Score is an OpenSSF project designed to estimate the relative criticality or influence of open-source projects. Its model combines observable signals such as project age, contributor activity, participating organisations, commits, releases, issue activity and dependency information. The important distinction is that criticality is not equivalent to project health, quality or maturity. A poorly maintained library can have very high criticality if a large software ecosystem depends upon it, while a healthy and mature specialised project may have little ecosystem-wide criticality. OpenSSF project page: [https://openssf.org/projects/criticality-score/](https://openssf.org/projects/criticality-score/). Source implementation: [https://github.com/ossf/criticality_score](https://github.com/ossf/criticality_score).

[^github-stars]: **GitHub — Starring repositories**. GitHub presents starring primarily as a mechanism for users to bookmark repositories and discover projects of interest. Star counts can therefore serve as an approximate signal of visibility or interest, but they do not directly measure active usage, production deployment, software quality, maintainability, security or sustainability. Stars are especially problematic when comparing projects from different ecosystems or age groups: an old developer tool, a fashionable JavaScript project and a deeply embedded infrastructure library can have completely different star dynamics. GitHub REST API documentation for starring: [https://docs.github.com/en/rest/activity/starring](https://docs.github.com/en/rest/activity/starring).

[^github-community]: **GitHub — Community Profile Metrics**. GitHub's community-profile API reports the presence of several common repository artefacts associated with an accessible open-source project, including files such as a README, licence, Code of Conduct, contributing guidelines, issue templates and pull-request templates. These signals are attractive for automated maturity assessment because they are cheap and consistent to collect. Their limitation is equally important: the presence of documentation proves only that an artefact exists. A `CODE_OF_CONDUCT.md` file does not demonstrate a healthy community, just as a contribution guide does not prove that external contributions are actually welcomed. GitHub REST API documentation: [https://docs.github.com/en/rest/metrics/community](https://docs.github.com/en/rest/metrics/community).

[^github-metrics]: **GitHub — Repository Metrics API**. GitHub exposes APIs for several categories of repository statistics, including contributor statistics, commit activity, code-frequency statistics, participation, repository traffic and community information. These APIs make it technically straightforward to collect large quantities of data about public software projects. The difficulty lies in interpretation. Commit counts may include bots or generated changes, forks may never contain original work, and repository traffic may reflect temporary publicity rather than adoption. The availability of a metric should therefore not be confused with its suitability for a maturity score. [https://docs.github.com/en/rest/metrics](https://docs.github.com/en/rest/metrics).

[^slsa]: **SLSA — Supply-chain Levels for Software Artifacts**. SLSA is a framework for strengthening the integrity of software supply chains, particularly the process by which source code is transformed into distributed software artifacts. The specification defines requirements around provenance, build environments and verification so that consumers can obtain stronger assurances about how an artifact was produced. For OSS maturity assessment, SLSA-related evidence provides information that ordinary repository activity does not: a project may maintain source code actively yet have an opaque or weak release pipeline. SLSA specification version 1.2: [https://slsa.dev/spec/v1.2/](https://slsa.dev/spec/v1.2/).

[^spdx]: **SPDX — Software Package Data Exchange**. SPDX is an international open standard for communicating information about software packages, components, licences, copyrights and relationships between software elements. SPDX identifiers are widely used for representing licences in machine-readable form, while SPDX documents can also serve as Software Bills of Materials. SPDX is relevant to automated OSS maturity analysis because it transforms parts of software provenance and licensing that were traditionally expressed in unstructured text into information that tools can validate and compare. SPDX specifications: [https://spdx.dev/use/specifications/](https://spdx.dev/use/specifications/).

[^reuse]: **Free Software Foundation Europe — REUSE Specification**. REUSE defines a practical convention for making copyright and licensing information in source-code repositories machine readable. Instead of relying only on a single top-level `LICENSE` file, REUSE provides mechanisms for associating copyright notices and SPDX licence identifiers with individual files or groups of files. This makes it possible to automatically check whether licensing information is complete and unambiguous across a repository. REUSE therefore provides a stronger automatable legal signal than merely checking that a `LICENSE` file exists. [https://reuse.software/spec/](https://reuse.software/spec/).

[^oss-health-paper]: **Johan Linåker, Efi Papatheocharous and Thomas Olsson — “How to characterize the health of an Open Source Software project? A snowball literature review of an emerging practice.”** Published in the proceedings of OpenSym 2022, this literature review surveys research and practitioner work on open-source project health and identifies more than one hundred characteristics grouped across fifteen themes. The paper is useful evidence for the idea that there is no single natural OSS health metric: technical development, community activity, governance, ecosystem relationships, sustainability and other dimensions all contribute different information. The large number of identified characteristics also highlights the practical problem faced by automated scoring systems — selecting a meaningful subset is as important as collecting the data itself. DOI: `10.1145/3555051.3555067`. [https://doi.org/10.1145/3555051.3555067](https://doi.org/10.1145/3555051.3555067).

