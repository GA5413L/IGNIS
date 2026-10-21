# EMAIL A (final draft): rules clarification for the Space Apps organizers

**Status: FINAL DRAFT for the user's review. NOT SENT.**
- The assistant does not contact anyone (D-013). Only the user sends this.
- **Finalised 22 Oct 2026 (local), fourth session.** It asks about the six reuse items one by one, plus disclosure and eligibility.
- Rule quotes were re-checked against the official pages on 21 Oct 2026 at 19:45 UTC. Their text is unchanged since 20 Oct.
- Supersedes the 21 Oct version (git history keeps it).

## Where to send it (official Contact Us page, read 21 Oct 19:45 UTC)
Pick the line that matches your registration. The page is at https://www.spaceappschallenge.org/contact-us/.
- **Local Event:** your **Local Lead**. "For a question about your Local Event, please contact your Local Lead. Their contact information can be found on the Local Event page. To find your Local Event, go to Profile > Participant Information > Local Event." Ask them to forward it to the Global Organizing Team if they can't rule.
- **Universal Event:** "please email **info@spaceappschallenge.org** and include 'Universal Event' in the subject line. Please provide your team name …"
- **Any other route:** "For all other questions or inquiries: please email **info@spaceappschallenge.org**."
- **Not on Space Apps Connect** (it opens 3 Nov). A public post would disclose the idea.

The address is copied from the page, not guessed. The FAQ's own "Contact Us page" link points to `/contact-space-apps/`, which showed no readable text when fetched; the routes above come from `/contact-us/`.

---

**Subject:** Rules question: may we reuse pre-event research? (Flame in Freefall, 2026) [add "Universal Event" if that applies]

Dear [Local Lead name / Space Apps Global Organizing Team],

I am registered for the 2026 NASA Space Apps Challenge at [Local Event name / the Universal Event] and plan to work on "Flame in Freefall: AI-Powered Fire Safety Insights from Microgravity Combustion Data". [Team name, if a team exists.]

The Participant FAQ says teams "are not allowed to begin working on the challenges prior to the hackathon". The Team Formation Guide says participants "should NOT begin working on their project until the hackathon begins on November 14, 2026 (9:00 a.m. local time)". I have already done some preparation. I would like to disclose it and follow your ruling before reusing any of it.

**What exists** (in a private, unpublished folder with a dated log):
1. **Concept:** the project idea, an evidence tool for published microgravity fire experiments, was developed before the event.
2. **Literature:** notes on public sources, mainly a NASA technical report (NASA/TM-20210011385) and a journal article with supplementary tables (Link et al. 2018, *Scientific Reports* 8:120). I also read, without running or copying them, a few public GitHub projects other participants have posted for this challenge.
3. **Data:** 127 rows from four published tables, typed into spreadsheet files with their source pages. I cross-referenced the article's sample labels to NASA's test records.
4. **Registers:** a record of where each source came from, and a list of disagreements between the sources.
5. **Code:** small Python scripts that check our transcriptions against the PDFs and do simple analysis (matching records, arithmetic), plus download and PDF-reading helpers.
6. **Plans:** an outline of what we might build and how we would evaluate it.
7. **AI assistance:** almost all of the above was produced with an AI assistant (Anthropic's Claude, via Claude Code), following my written instructions.
8. **Not built:** no application, user interface, dashboard, demo, video or submission text.

**Dates:**
- Concept notes before 15 October.
- On 15 October, a short packet checking one NASA table, with a small analysis script, a local database and a chart. It is kept outside the folder above.
- Everything else on 20–22 October, after we had found the two sentences quoted above. Because "working on the project" is not defined, I limited this to research and documentation. I would like to check that reading with you.

**Could you answer each question (yes / no / with conditions)?** May we reuse, in the event project:
1. our research notes and literature findings?
2. our manual transcriptions of the published experimental tables, or must we redo them during the event?
3. our source-provenance and source-conflict registers?
4. our verification scripts and small research-analysis scripts, or must all code be written during the event?
5. our pre-event implementation plan?
6. any of these materials, given that they were prepared with AI assistance?

Also:

7. If any reuse is allowed, must it be disclosed in a particular way, for example in the submission or in the required description of SI-tool use?
8. Does this preparation affect our eligibility, and should we stop all further preparation until 14 November?

Until we hear from you, we will do no further project work beyond reading public sources. We will not copy any pre-event material into the project.

Thank you.

Kind regards,
[Name]
[Team name, if any; Local Event or Universal Event]
[Space Apps registration e-mail]

---

## Before you send it (≈ 5 min)
- [ ] **Brackets.** Fill in the recipient, your event, your team (only if one exists), your name and your registration e-mail. Delete any bracket that doesn't apply.
- [ ] **Facts.** Every item agrees with `CHRONOLOGY.md`:
  - 127 rows = 52 + 46 + 27 + 2;
  - the 15 Oct packet, as you reported it;
  - the rules pages were retrieved and read at the start of the 20 Oct session (12:58 UTC), before most of the work.
  - Item 2's sentence about other teams' repositories is optional. It is there for full disclosure.
- [ ] **The last paragraph is a commitment.** Keep it only if you will stop all further project work until the reply. Otherwise replace it with what you will actually do.
- [ ] **No attachments.** Offer the dated log on request.
- [ ] **After sending.** Record the date, channel and recipient in `CHRONOLOGY.md` and `planning/competition_rules.md` (U1/U2). Save the reply verbatim.
