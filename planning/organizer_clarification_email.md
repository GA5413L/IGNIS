# EMAIL A (draft): rules clarification for the Space Apps organizers

**Status: DRAFT for the user's review. Not sent.**
- The assistant does not contact anyone (D-013).
- Fill in the bracketed fields, check every statement against `CHRONOLOGY.md`, then send it yourself.

## Where to send it (from the official FAQ, re-read 2026-10-20)
1. **Your Local Lead first.** The FAQ says: "Local Leads are the organizers of NASA Space Apps Challenge Local Events. They are available to answer questions … You may find their contact information on your Local Event's page." If you are in the **Universal Event**, go straight to option 2.
2. **The Space Apps Contact Us page**, https://www.spaceappschallenge.org/contact-us/. The FAQ says: "If you have a question not answered in the guides, reach out on our Contact Us page."
   - The FAQ page also publishes the address `info@spaceappschallenge.org` (in its page source).
   - Ask the Local Lead to forward the question to the Global Organizing (GO) Team if they can't rule on it.
3. **Space Apps Connect** opens 3 Nov. A public post there would reveal the project idea, so prefer a private channel.

Keep the reply verbatim, with its date and sender, in `planning/competition_rules.md` (U1/U2).

---

**Subject:** Pre-event research and AI-assisted preparation: what may be reused? (Flame in Freefall, 2026)

Dear [Local Lead name / Space Apps Global Organizing Team],

I am registered for the 2026 NASA Space Apps Challenge at [Local Event name / the Universal Event], and my team
[team name, if formed] intends to take on **"Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity
Combustion Data."**

The Participant FAQ says that teams "are not allowed to begin working on the challenges prior to the hackathon",
and the Team Formation Guide says participants "should NOT begin working on their project until the hackathon
begins on November 14, 2026 (9:00 a.m. local time)". I want to make sure we comply, so I am telling you plainly
what has already been done and asking how we should treat it.

**What exists already (all before 14 November):**
- **Before 15 October:** informal concept reviews of the project idea (text documents).
- **15 October:** a short research packet that checked one published NASA table. It was accompanied by a small analysis script, a local database and a chart. Those files are **not** in our project repository.
- **20 October:** a private, local Git repository (never published) containing:
  - **Research notes** on public sources: NASA/TM-20210011385 (BASS-II Summary Report) and Link et al. 2018, *Scientific Reports* 8:120, with its supplementary tables.
  - **Manual transcriptions** of four published tables into CSV files (127 rows in total), each recording its source page.
  - **Python scripts** that check those transcriptions against the publisher's PDF text, and that cross-reference the journal's sample labels with NASA's test log.
  - A **register of disagreements** between the sources, and written **plans**: intended scope, an evaluation plan with test questions, and an outline of the software architecture we would build.
  - **No application, user interface, dashboard or demo has been built.**
- **AI use:** most of this preparation was carried out with an AI assistant (Anthropic's Claude, via Claude Code), working from our written instructions. We have kept a dated log of what was done.

**Our questions:**
1. Is **pre-event reading and review of public scientific literature** related to a challenge allowed?
2. May we **reuse the manually transcribed measurements** (made before the event from public NASA and journal sources) in our submission? Or must we re-transcribe them during the event?
3. May we **reuse the pre-event verification scripts**? Or must any code be written during the event?
4. May **pre-existing preparation files** (research notes, the source-disagreement register, planning documents) be included in our project repository, if they are clearly dated and disclosed?
5. How should **AI-assisted preparation** be disclosed, beyond the required description of how SI tools were used during development?
6. Does the **existence of this pre-event repository** affect our eligibility in any way? If so, what should we do now (for example, set it aside entirely and start from the public sources on 14 November)?

**Our default:** unless you advise otherwise, we will not copy any pre-event file into the submission. We will
re-derive anything we need from the public sources during the event, and we will disclose the pre-event research
in the submission. I'm happy to share our dated chronology if useful.

Thank you for your help.

Kind regards,
[Name]
[Team name, Local Event]
[Space Apps registration e-mail]

---

## Pre-send checklist
- [ ] Every factual statement matches `CHRONOLOGY.md`. Update the counts if anything has changed.
- [ ] The Local Event (or Universal Event) is correct. Team size and members are stated only if true.
- [ ] Nothing is attached that contains third-party PDFs.
- [ ] After sending: record the date, channel and recipient in `CHRONOLOGY.md` and `planning/competition_rules.md`.
