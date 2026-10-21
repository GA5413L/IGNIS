# Human review checklist: superseded

**Replaced on 22 Oct 2026 by the human review packet, `planning/review_packet/` (D-028).** The 21 Oct checklist is in git history (commit `7a2e277`).

**Why it was replaced (concrete defects):**
1. **Anchoring.** It printed our expected values next to each instruction (for example, P5's final gas readings, the shared O₂ cells, the 1 g minima). The reviewer was confirming our answers instead of reading the PDFs first.
2. **Leakage.** `future_evaluation_plan.md` §3b allowed the held-out task author to read this checklist, and it contained our conclusions.
3. **Gaps.** It did not check:
   - the nine shared-atmosphere pairs (C-26);
   - the distinction between tabulated measurements and flammability thresholds;
   - the distinction between spread-rate measurements and extinction criteria.

   Its hand-back recorded neither the reviewer's expertise nor their independence.

**Use instead:**
- `review_packet/README.md`: order, blinding and sources;
- `A_source_reading.md`: blind reading, then comparison;
- `B_interpretation_check.md`: the claims to test;
- `C_task_author_brief.md`: for the held-out task author only;
- `review_form.md`: what to hand back.
