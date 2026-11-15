# Competitive research, event day 1 (14 Nov 2026, ≈19:45 PKT)

**Method:**
- GitHub public search API, unauthenticated, 6 queries; raw results in `_raw/research_2026-11-14/`.
- READMEs of the 20 most developed or relevant repos were read (`_raw/research_2026-11-14/readmes/`).
- No competitor code was run and no competitor site was opened.
- README statements are **documented, not verified**.

## Findings
1. **Very crowded field.** "flame in freefall" matches **133 repos**, 105 of them created since Aug 2026; many were pushed within the last hour.
2. **Name collisions:**
   - `IGNIS-Innovators/ignis-space-fire-intelligence` and `WingManOO7/ignis-lab` also use **IGNIS**;
   - `0xdevabir/runtime-terrors` describes its project as **"Emberfall"** (≈1,300 NTRS reports).

   **User decision:** consider a distinctive product name or subtitle before submission.
3. **Breadth gap.** Competitors commonly claim **20–24 PSI investigations**:
   - Fotia, StarryNight, ZERO FLARE, Moa-01 and Mohammed-Ayman claim 24;
   - FlameBound claims 23;
   - OSAMABASAM claims 20.

   Their READMEs cite PSI IDs such as PSI-10, -20, -25, -26, -68, -69, -98 to -107, -115, -117, -142 and -159. **IGNIS covers 10, three of them profile-only: the clearest scoring gap.**
4. **Provenance is no longer a differentiator:**
   - "Every value traced to its source sentence" (Entropy);
   - "DOI-verified" (FlameBound);
   - "evidence engine" (StarryNight);
   - "evidence-first" (FlameScope);
   - MicroFire Atlas already documents abstention and a claim checker.
5. **Many teams use the same AI providers:**
   - Claude: Opus 5.5 (runtime-terrors, mohamed-nasser11) and Haiku 5.5 (FlameBound);
   - Gemini (OSAMABASAM, ZERO FLARE, Mohammed-Ayman);
   - Groq: gpt-oss-120b, llama-3.3-70b;
   - OpenAI: gpt-5-mini, gpt-4o-mini;
   - local Qwen.

   The provider choice will not differentiate IGNIS. *How* the SI is constrained and evaluated can.

## Where IGNIS can still stand apart (not seen in the READMEs read)
- **Comparability contracts.** IGNIS shows *why* two results can or cannot be compared (route/outcome, missing requirements), not only a citation.
- **A frozen, published SI evaluation** with critical-error rules, plus enum-constrained output that cannot name a non-existent record. MicroFire documents an eval set; no other README read reports one.
- **Model-vs-experiment honesty on real NASA model papers** (Saffire V/VI W1–W3), and **revision history** ("what changed").

## Recommended changes to WIN_PLAN.md
1. Raise **P0-2 coverage** to the full ~24 PSI combustion list. Each attribute stays as printed or "not acquired".
   - Next research step: obtain the public PSI investigation list. Competitors evidently have it; our own access to PSI study records returned 403 on 20 Oct.
   - The user may check whether a free PSI login is needed; registering is the user's action.
2. Make the **SI evaluation result a headline demo slide**. That is only possible once valid keys exist.
3. Decide the **product name** early (collision risk).

**Not done (usage limit):**
- PSI list acquisition;
- the NTRS survey of uncovered investigations;
- the Moon-atmosphere standards (EAWG, NASA-STD-6001) research.

---
**Correction (15 Nov ≈01:30 PKT):** the claims under "Where IGNIS can still stand apart" were wrong. Several teams also publish SI eval sets (StarryNight, Emberfall, HALO, Caped-Crussader), and comparability gates are common (MARGIN, ZERO FLARE). See `COMPETITOR_DEEP_DIVE_2026-11-15.md`.
