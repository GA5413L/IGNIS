# IGNIS win plan: event day 1 → submission

**Written:** 14 Nov 2026, ≈19:00 PKT.
**Assumed deadline:** Sun 15 Nov 23:59 PKT (the Team Owner's time zone is unverified, gate G1), which leaves about 29 h.
**Basis:** the 2026 judging guide (`DOCS/NASA Space Apps Challenge2.pdf`) scores Impact, Creativity, Validity, Relevance and Presentation, and asks for equal attention to Presentation. Relevance explicitly rewards projects that integrate NASA data "as a core component … rather than a superficial addition".

## Where IGNIS stands
**Strong:**
- reviewed NASA records;
- honest deterministic analysis (W1–W3);
- revision history;
- exports;
- 56 unit/integration tests and 7 browser tests passing.

**Weak against the rubric:**
1. **Not SI-powered yet.** The challenge names SI three times, and interpretation is disabled.
2. **No public URL** for judges.
3. **Thin coverage.** There are 10 investigations, three of them profile-only. The challenge suggests comparing objectives, fuels and sample geometry, O₂, airflow, variables and sensors across investigations, and IGNIS has no comparison view.
4. **No demo yet:** neither the 7 slides nor a 30-second video.
5. **Pre-event research is unused.** It is now permitted by D-050: the BASS-II rod data, endpoint dictionary and evidence cases.

## Priorities
| # | Work | Rubric target | Est. time | Blocked on |
|---|---|---|---|---|
| **P0-1** | SI interpreter adapter, catalogue-bound schema and the IE-1 harness with mocked transport (offline), then the live IE-1 run, then UI wiring | Relevance, Validity | 3 h offline + 0.5 h run + 1 h UI | Run: API key + approval |
| **P0-2** | Investigation comparison matrix covering ~20 PSI combustion investigations named in the challenge (BASS, BASS-II, Saffire I–VI, SAME, SAME-R, FLEX, FLEX-2, CFI, ACME BRE/CFI-G/E-FIELD, SPICE, SLICE, DAFT). It shows objective, fuel and sample, O₂, pressure, flow, apparatus and sensors, each **as printed with a locator or marked "not acquired"**. Includes a read-only attempt to render PSI pages with the installed headless Chrome. | Relevance, Impact | 4 h | — |
| **P0-3** | **Moon/Mars habitat lens.** Shows the challenge's atmosphere (≥30 % O₂ at ≤10.2 psi) next to each investigation's printed test atmospheres, for example Saffire VI events at 31.0 % O₂ / 54.1 kPa and 30.3 % / 54.6 kPa. The label states that conditions are shown, not equivalence (M07): no prediction and no safe/unsafe. | Impact, Relevance, Creativity | 2 h | — |
| **P0-4** | Public deployment, then a signed-out test on the public URL (M29) | Validity, Presentation | 1 h | Hosting choice + G9 approval |
| **P0-5** | Demo: a 7-slide deck (title, problem, solution, live SI interpretation, evidence honesty, Moon lens, team/next steps) and, if time allows, a 30-second captioned screen video | Presentation | 2.5 h | Running app |
| **P1-1** | BASS-II rod data (`research/data/`, as printed; B16/B19 quarantined; right-half S1 rows conditional; pressure unknown), shown as an investigation dataset with honest tables and an as-printed chart. Includes the endpoint dictionary and evidence cases EC02/EC03. | Relevance (real data depth), Validity | 3 h | — |
| **P1-2** | R2 verified SI summary for briefs and assessments | Relevance, Presentation | 2 h + check | Same approval as P0-1 |
| **P1-3** | Submission text, AI disclosure update (live SI + pre-event research reuse per D-050) and source-rights review | Eligibility | 1 h | — |
| P2-1 | Earth-applications panel: water mist, smoke detection and firefighter gear, from NASA pages the challenge cites | Impact | 1 h | — |
| P2-2 | Saffire I–VI timeline of flights, materials and scale | Presentation | 1 h | — |
| — | Not doing: NIST T3 module, embeddings, training, agents, a graph database, an ingestion platform | — | — | — |

**Order:**
1. Tonight: P0-1 offline, then P0-2 and P0-3.
2. As soon as authorized: the live IE-1 run, then UI wiring.
3. Tomorrow morning: P1-1, P1-2 and deployment (P0-4).
4. Tomorrow afternoon: the demo (P0-5), submission text (P1-3) and a full regression pass.
5. **Stop new features at 15 Nov 18:00 PKT.**

## Risks and their controls
| Risk | Control |
|---|---|
| No API key or approval in time | The typed form stays. All SI wording must then be removed from the submission. Decide by 15 Nov 12:00 PKT. |
| Model fails IE-1 | Ship the typed form or the next passing configuration. Never ship a failed configuration. |
| Deadline time zone differs from PKT | Verify the Team Owner's zone. Plan against the earliest plausible deadline. |
| PSI pages unreachable | Coverage comes from NASA ISS experiment pages and NTRS. A missing attribute shows "not acquired". |
| Overclaiming in the demo | The demo uses only app screens and printed values. Every slide claim maps to a record ID. |
| Slow E: USB drive | All builds run in the `F:\ignis extra\web-build` mirror; E: stays the source of truth. |

## Research update (14 Nov ≈20:30 PKT)
See `COMPETITIVE_RESEARCH_2026-11-14.md` and `IMPROVEMENT_RESEARCH_2026-11-14.md`.

- **P0-2 is now sourced.** Twelve NASA NTRS reports were acquired: ACME's six experiments, FLEX detailed results, BASS-II results, SAME-2/SAME-R, SPICE, BRE, LUCI, FM² and Moon atmospheres. The target is about 18 investigations. The PSI list awaits a user decision; the fetch was denied by the permission classifier.
- **P0-3 Moon lens** gets NASA's current framing (ICES-2026-324): the Artemis target of 8.2 psi / 34 % and the alternative test atmosphere of 9.6 psi / 28.5 %.
- **Differentiators to lead with:** comparability contracts, a constrained SI evaluated on a frozen test, and model-vs-experiment honesty. Provenance alone is now common: 133 competitor repos exist.

## Competitor deep dive (15 Nov ≈01:30 PKT)
See `COMPETITOR_DEEP_DIVE_2026-11-15.md`; this section supersedes the "Differentiators to lead with" above.
- **Table stakes:** all 24 PSI combustion records with their CC0 tables; a Moon atmosphere view; abstention; an SI eval with metrics; a live URL plus a deck or video.
- **Lead with:** Saffire V/VI published burns nearest the exploration atmosphere (not in PSI), with comparability contracts and model-vs-experiment checks.
- **Blocking decision:** PSI primary data access (options a/b/c).
