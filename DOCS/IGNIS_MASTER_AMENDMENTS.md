# Dated amendments to IGNIS_MASTER_SOLUTION_AND_BUILD_SPEC_v1.0.md

The master file itself is not edited. Each amendment below was instructed by the user on 14 Nov 2026 (PKT) and is implemented in `web/`.

## A-001 — W1 route/outcome clarification (14 Nov 2026, 17:05 PKT instruction)

**Section 16.2 (W1) clarified.** For the proposed conditional comparison plan of the later remote CO₂ response of the published Saffire VI transport model:

- `route = conditional_model_candidate`
- `outcome = specified_conditional_comparison`

An underlying source finding, here the S-VI p.7 alignment statement (`FD-M-VI-ALIGN-01`), may separately have `route = direct`.

This aligns W1 with Section 8.5, where a conditional model candidate yields a specified conditional comparison. It replaces the 16.2 table wording "Main route: Directly supported comparison specification". **No scientific result changes.**

**Implementation and evidence:**
- contract `AC-SVI25-T1-LATER` (`web/data/applicability-contracts.json`, satisfied branch);
- test `tests/unit/assess.test.ts` › "W1 … is a conditional model candidate with a specified conditional comparison" — **PASS**, 14 Nov 2026.

## A-002 — Runtime-risk work brought forward (14 Nov 2026, 17:05 PKT instruction)

**Milestone order changed.** The interpretation contract is implemented and tested alongside the first data-backed interface (B3), instead of waiting for B5.

**Basis:** the repository audit `IGNIS_Interpreter_Failure_Audit_and_Repair.md` (8 Nov) and its IR2 typing. That audit was available locally, although the master's Appendix A.1 records it as not recovered. Its main points:
- intent is separated from handling;
- alternatives are typed and allow-listed;
- unknown keys, invented IDs and verdict fields are rejected, not coerced;
- stale envelopes are discarded.

**Implemented offline** (`web/src/core/interpretation.ts`, `web/src/core/handling.ts`) and tested in `tests/integration/api.test.ts` (5 interpretation-contract tests, PASS).

**No inference was run.** Neither previously tested Groq configuration is deployment-approved. No provider adapter is shipped, and `/api/interpret` returns 503 "AI interpretation unavailable" with zero outbound calls (test M17, PASS).

**Not done:**
- live interpretation through any provider;
- a mocked-transport adapter test, because no transport adapter exists to mock;
- the IR2 paired retest (still PROPOSED, NOT AUTHORIZED).
