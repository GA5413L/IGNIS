# Competition rules status

Checked 2026-10-20 against official pages on spaceappschallenge.org. Page bodies are saved locally under
`_raw/spaceapps/`. **Re-check on 28 Oct (challenge statement) and 13 Nov (submission + judging guides).**

**Re-checked 2026-10-20, 19:04 UTC (21 Oct local; third session).** The FAQ, Team Formation Guide and T&C text is identical to the 16:53 UTC copies, and the challenge page GraphQL response is byte-identical. Copies are in `_raw/spaceapps_2026-10-21/`. Reading: the rules remain **ambiguous, not clearly prohibitive**, for research and documentation (U1). Email A was revised and is **not sent**.

**Re-checked 2026-10-20, 16:53–16:56 UTC (second session).**
- **Unchanged:** the FAQ, Team Formation Guide, T&C and home page text; the challenge page (identical GraphQL response; resources tab still empty).
- **New:** the Awards page lists 10 Global Award categories (e.g. "Best Use of Science: the project that makes the best and most valid use of science and/or the scientific method"). These are award categories, **not** the 2026 scoring rubric (U5 stays open).
- **Where the full status lives now:** CONFIRMED / UNRESOLVED / EVENT-SPECIFIC / REQUIRES CLARIFICATION, plus strategy, are in `competition_readiness.md`. The clarification request is drafted in `organizer_clarification_email.md` (**not sent**).

## Confirmed (quoted)

| Topic | Exact wording | Source (as dated on the page) |
|---|---|---|
| Event dates | "The 2026 NASA Space Apps Challenge will take place November 14-15, 2026." | Participant FAQs, 13 Oct 2026 |
| Timeline | "October 28: Challenge Statements available." / "November 3: Space Apps Connect Opens…" / "November 13: Global Offers Available. Project Submission and Judging & Awards Participant Guides available." / "November 14-15: NASA Space Apps Challenge event." / "December 2026: Global Nominees, Global Finalists, and Honorable Mentions are announced." / "January 2027: Global Winners are announced!" | Participant FAQs |
| **Pre-event work** | "A summary of each challenge will be released on September 17, followed by challenge statements on October 28 … Teams **are not allowed** to begin working on the challenges prior to the hackathon." | Participant FAQs |
| **Pre-event work** | "participants should NOT begin working on their project until the hackathon begins on November 14, 2026 (9:00 a.m. local time) to ensure a fair and equitable process." | Team Formation Guide, 23 Sep 2026 |
| Submission window | "Project submission opens on Saturday, November 14 at 9:00 AM and closes on Sunday, November 15 at 11:59 PM local time." The FAQ adds: "Submit your project for judging according to the ending time of your Local Event." | 2026 home page; FAQ |
| Teams | "Local Event teams must have at least one (1) person and Universal Event teams must have at least two (2) people to be eligible for global judging. Teams may have no more than six (6) members… You may only be on one team and teams are only permitted to work on one challenge." | FAQ |
| AI ("Super Intelligence") | "Participants may use SI tools to accelerate innovation, streamline development, and enhance creativity in support of their challenge solution. Each team's project submission **must include a description of how SI tools were used** during the development of their project." (The FAQ cites a 29 Sep 2026 U.S. Executive Order for the "SI" terminology.) | FAQ |
| Challenge (summary only) | "…create an interactive, super intelligence (SI) powered dashboard that summarizes, ranks, and interprets those findings to deliver fire safety insights for human space exploration." The resources tab is **empty**; the full statement arrives 28 Oct. | Challenge page via the site's public GraphQL (`pageByPath`), 2026-10-20 |
| Original content licence | "You agree that any original content (that is, content that you have created for the NASA Space Apps Challenge) is freely available without restriction or is licensed as open source as defined by the Open Source Initiative… If you do not specify… NASA will distribute your original content under an Apache 2.0 license." | Participant Terms & Conditions, updated 7 Aug 2026 |
| Third-party materials | non-NASA materials must be "freely and publicly available without restriction or, at a minimum, … licensed as open source"; "Any licenses applicable to your Solution Materials must be identified"; "**You must cite every source** that is used in the creation of your project, even if it is open source or freely available." | T&C |
| Exclusions | Solutions are not accepted if they include "Proprietary or business sensitive information that you do not have the right to make public" or material "for which you do not hold the copyright or other intellectual property rights"; no export-controlled information | T&C |

Project rule (ours, not an organizer quote): IGNIS never describes itself as affiliated with or endorsed by NASA.

## Unresolved, and the interpretation we use until ruled otherwise

| # | Question | Why unresolved | Working interpretation (conservative) |
|---|---|---|---|
| U1 | Does pre-event **research** (reading papers, recovering supplements, transcribing tables, writing notes, planning) count as "working on the challenges/project"? | "working" is not defined. Both texts are short. The full statement is not out yet | Treat **all** IGNIS-specific outputs made before 14 Nov 09:00 local as potentially restricted. No submission code, UI, demo assets or ready-to-submit content before then. Ask for a written ruling (U4) |
| U2 | May pre-event research notes or transcriptions be **used** during the event? | The T&C define original content as content "created for the NASA Space Apps Challenge", with no rule on timing | Do not copy pre-event files into the submission unless a ruling allows it. Otherwise re-derive during the event from the public sources (the procedure is documented; the transcription check takes minutes) and disclose this pre-event research in the submission |
| U3 | The 15 Oct packet describes pre-event **code** (`test_analysis.py`, SQLite baseline, chart) | Not present in this repo; created before the event | Do not reuse it. Disclose that it existed if asked. Record in `CHRONOLOGY.md` |
| U4 | Who can rule? | — | The user's Local Lead (contact on the Local Event page), or the GO team via the Contact Us page. Space Apps Connect opens 3 Nov. **Not contacted by this assistant.** |
| U5 | 2026 judging criteria | Judging & Awards Guide due 13 Nov | Unknown. Do not optimise to 2025 criteria (Impact, Creativity, Validity, Relevance, Presentation per the brief; not re-verified) |
| U6 | User's registration, Local Event vs Universal Event, team size | Not known to this assistant | Unknown. A Universal Event team needs ≥ 2 members for global judging |
| U7 | Rights to show figures or tables from Elsevier sources | Proprietary | Cite only. Do not reproduce |
| U8 | Full challenge statement (requirements, resources, any mandated data) | due 28 Oct | Unknown. Do not anticipate its requirements |
| U9 | Many other teams have public pre-event "Flame in Freefall" repositories (≥ 20 found on 20 Oct) | not an organizer statement | **Not** evidence of what is permitted. Do not infer authorization from it |

## Implication for the next actions
Until U1/U2 are ruled on, permitted pre-event work is limited to: reading public sources, verifying records,
writing research notes, and planning. This session wrote **research tooling** (download, PDF-extraction and
transcription-check scripts) and **research analysis scripts** (crosswalk, evidence-case arithmetic). These are not
an application and contain no UI, but they are code. They are listed in `CHRONOLOGY.md` so the team can disclose
them and decide, with the organizers' answer, whether to re-create them during the event.
