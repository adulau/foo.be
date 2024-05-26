---
layout: post
title:  "Pinpointing Locations: Analyzing Regular Activities to Guess Timezones Using LLMs"
date:   2024-05-26 10:01:00
categories: infosec
---

# Pinpointing Locations: Analyzing Regular Activities to Guess Timezones Using LLMs

Alexandre Dulaunoy <a@foo.be>

## Scope 

![A chat Time Series coming from a monitored Telegram channel in AIL](/assets/timeseries-chat.png)

In the field of threat intelligence, analyzing the time-based activities of threat actors is a routine task. This analysis can reveal their work patterns, organizational structure, practices, and sometimes even their geographic or cultural origin. Regular time series data can be extracted from various sources, such as compilation times from malicious binaries, access logs to threat actor infrastructures, and chat log activities over time.

We are now incorporating extensive time-based intelligence into [MISP](https://www.misp-project.org/) and other tools like the [AIL framework](https://www.ail-project.org/) to ensure the information is accessible and usable for threat intelligence analysis. In the past years, I created numerous scripts to deduce timezone information or even location based on these indicators. While this approach is valuable, it can be time-consuming due to the need for various hypotheses, and the process is not always straightforward.

So, I decided to try using a Large Language Model (LLM), specifically the latest OpenAI ChatGPT-4o, and compare its accuracy with manual analysis.

## Input time Series

The graph above is extracted from the AIL framework, showing activity from a monitored threat actor channel over a period of several months. The data is expressed in UTC and represents the number of messages sent.

If you are an experienced analyst, you can quickly identify interesting patterns and potentially formulate hypotheses.

So, I decided to upload the images to ChatGPT-4 (without providing specific context or the origin of the graph) using a very simple prompt:

~~~
With the following graph of activity per user in a chat channel, could you deduce the country location of the activity? 
~~~

and the result

~~~
To deduce the country location of the chat activity based on the provided heatmap, let's analyze the following:

1. **Time Zones and Activity Patterns**:
   - The x-axis represents hours (0 to 23), likely in a 24-hour format.
   - The y-axis represents days of the week (Mo, Tu, We, Th, Fr, Sa, Su).

2. **Peak Activity**:
   - The peak activity times are between 7:00 and 19:00, with the highest concentration of messages around midday (12:00 - 13:00) and later in the afternoon (17:00 - 18:00).
   - There is a gradual increase in activity starting from around 7:00 and tapering off after 18:00.

3. **Patterns by Day**:
   - The activity is consistent throughout the week, with slight variations, but no significant drop-off on weekends, indicating it might not be tied to a traditional workweek pattern.

**Interpretation**:
- The pattern suggests a time zone where people are active mostly during the standard working hours and early evening.
- Given the absence of significant activity during late-night and early morning hours (0:00 - 6:00), the data seems to align with a typical workday schedule.

To narrow down the possible country:
- Assuming the provided times are in UTC:
  - If the local peak activity corresponds to midday and early evening in the heatmap, and this aligns with standard working hours (let's say from 9 AM to 6 PM in local time), the peak activity in UTC would be 7:00 to 18:00.
  - If we assume the peak at around 12:00 - 13:00 corresponds to local time, this suggests a time zone offset close to UTC, possibly UTC+1 to UTC+3.

Considering these factors, the chat activity could potentially be from a European country, as they typically follow the time zones around UTC+1 (Central European Time) to UTC+3 (Eastern European Time).

**Conclusion**: The activity pattern and time zone alignment suggest that the chat activity is likely from a country in Europe.
~~~

The result is quite impressive, especially the image analysis. The interpretation includes assumptions about specific elements, despite the fact that I didn't specify that the times are in UTC in the original prompt. During the analysis within our team, we came to a complementary assumption and we wanted to ask if our assumption is inline with the potential finding of the LLM.

The prompt in the same context is 

~~~
What would be the probability of this graph to be users located in Russia (especially Moscow) ? 
~~~

and the result:

~~~
To assess the probability that the chat activity graph represents users located in Russia, particularly Moscow, we need to align the activity patterns with Moscow's local time and typical user behavior.

### Key Points of Analysis:

1. **Time Zone Consideration**:
   - Moscow operates on Moscow Standard Time (MSK), which is UTC+3.

2. **Activity Pattern**:
   - The peak activity is from 7:00 to 19:00 UTC. 
   - This would translate to 10:00 to 22:00 in Moscow time (UTC+3).

3. **Typical Russian (Moscow) Daily Schedule**:
   - In Moscow, a typical workday starts around 9:00 or 10:00 and ends around 18:00 or 19:00.
   - Evening activities and social interactions often extend to 21:00 or 22:00.

### Alignment with Moscow's Schedule:

- **Morning Peak (7:00 UTC / 10:00 MSK)**: 
  - This aligns with the start of the workday in Moscow, where people begin their day and start sending messages.

- **Midday Peak (12:00 - 13:00 UTC / 15:00 - 16:00 MSK)**:
  - This matches the lunchtime period when people might be more active in chat due to breaks.

- **Afternoon to Evening Peak (17:00 - 19:00 UTC / 20:00 - 22:00 MSK)**:
  - This aligns with the end of the workday and early evening activities.

### Conclusion:

Given the peak times of activity and their alignment with Moscow's typical daily schedule, there is a strong probability that the chat activity could be from users located in Moscow. The consistency of activity throughout the week without significant drop-offs on weekends also suggests a user base that follows a regular daily routine, which fits well with the typical behavior in a metropolitan area like Moscow.

### Probability Assessment:

- Based on the provided data and analysis, the probability that this graph represents users located in Moscow is high. While it is difficult to assign a precise numerical probability without more specific data, the alignment of activity times with Moscow's local time strongly supports this hypothesis.

Thus, considering the activity patterns and the time zone alignment, it is quite plausible that this chat activity graph represents users located in Moscow, Russia.
~~~

The assessment is very close to what we obtained from a quick manual analysis. While this technique is not foolproof, it provides a valuable way to cross-check assumptions, especially when you have limited analysts or a significant number of time series to analyze. 

The ability to have a model interpret graphs or visualizations is also advantageous if you have a large set of existing time series data. In threat intelligence, attribution is challenging and doesn't always provide actionable information for protecting infrastructure. Nevertheless, time and time-based activity analysis can be very helpful when you need to analyze large datasets or logs, providing insights into the actual activity of the threat actor or even their location.

## Potential Future Work

- Testing and validating other LLM models that might be better tuned for this type of analysis. (any idea of a better model?)
- Enhancing the analysis by incorporating specific time and cultural behaviors of people depending on their location (such as lunch times, weekly vacation periods, official or unofficial holidays, and local or global events).
- Integrating additional data sources to improve the accuracy of timezone and location predictions (such as population per timezone, Internet accessibility per timezone) .
- Implementing feedback loops to refine LLM models based on the accuracy of their predictions and real-world outcomes.   
