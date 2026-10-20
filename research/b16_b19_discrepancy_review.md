# B16/B19 vs NASA P16/P19: adversarial review of the flow-configuration discrepancy (C-03)

**Date:** 20 October 2026, second session (adversarial audit). Pre-event source review only.
**Reviewer:** an AI assistant (Claude, via Claude Code). **No human has reviewed this file.** "Visually checked"
below means the assistant rendered the PDF page and read it. That is not independent verification.

**Classification (§9):** **GENUINE UNRESOLVED CONFLICT.**
- **Crosswalk:** established by more than label similarity.
- **The conflict itself:** documentary and confined to one appendix cell in each of two rows. Most of the accessible evidence, including NASA's own Chapter 4, treats these burns as **opposed** flow.
- **Not RESOLVED:** neither the authors, NASA, nor the raw video settles it.
- **The quarantine (D-006) is kept.** Its *framing* changes (§10).

Source keys:
- **[L18]** Link et al. 2018 article PDF (PDF page numbers).
- **[L18-ESM]** its Supplementary Information PDF.
- **[TM]** NASA/TM-20210011385, given as PDF page / printed page.

Files: ESM SHA-256 `e17c9511…1b23`; TM SHA-256 `5ffa911f…f770`. Both were re-hashed today and match `manifests/data_sources.csv`. Renders used for this review are in `_raw/audit_2026-10-20b/` (local, gitignored).

---

## 1. The claim under test

The previous session reported that Link's headline microgravity series B16/B19 (opposed flow, Fig. 6a) are recorded
as **"Concurrent"** in NASA's as-run matrix. It called this "the most consequential distinction found". The
user's brief asks whether that holds up, and whether the mapping B16↔P16, B19↔P19 is even right.

## 2. What each source says (verbatim, with locations)

### 2.1 Link et al. 2018 and its supplement (all say opposed)
| # | Quote | Location |
|---|---|---|
| L1 | "experiments on the spread of flames in an oxidizing gas flow **opposing the direction of flame spread**" (this is the paper's own definition of "opposed") | [L18] p.2 |
| L2 | "each PMMA sample was ignited at a relatively high **opposed** flow velocity by a hot coil … Then, the opposed flow velocity was subsequently reduced until extinction was observed" | [L18] p.4 (Methods) |
| L3 | "Figure 4 shows a sequence of photos from an **opposed** flame spread in microgravity over a 0.64 mm diameter black cast PMMA rod at two oxygen concentrations … of 17.5% and 18.2%" | [L18] p.4 (Results) |
| L4 | Fig. 4 caption: "Photo sequence of microgravity flame spread under various **opposed** flow velocity (a) X_O₂ = 18.2% (Sample B16), and (b) X_O₂ = 17.5% (Sample B19)". The panel has a V_g arrow pointing **up** and time stamps 1–11 min at 7.6 / 1.7 / 0.8 / 0.7 cm/s | [L18] p.4 |
| L5 | Fig. 6 caption: "measured flame-spread rate under various **opposed** flow velocity under (a) microgravity (μg) … (Sample B16, 0.64 cm) … (Sample B19, 0.64 cm)" | [L18] p.5 |
| L6 | Fig. S1: "Tracking of the flame leading edge as a function of time through a black PMMA rod of 0.64 cm diameter … (a) 18.2% (Sample B16) and (b) 17.5% (Sample B19)" | [L18-ESM] p.2 |
| L7 | "The microgravity flame extinction at high flow velocities (blow off) was not observed" | [L18] p.7 |

### 2.2 NASA/TM-20210011385: the appendix (says Concurrent)
| # | Content | Location |
|---|---|---|
| N1 | **P16:** 7/22/14, GMT 203, as-run **93**, sample **191m**, "6.35-mm black rod", igniter **–36**, flow restrictor 2, **"Concurrent"** in the column headed **"Sample distance"**, fan display "49, 62, 44, 41.5, 41 (pots 1.3, 2.8, 0.7, 0.4, 0.36, 0.32)", air display "5, 8, 2, low", cal. O₂ 18.2 → 17.4, "Extinguished at pot 0.32, one high flow setting". **Visually re-checked today** (220-dpi render) | [TM] p.114/106, Table A.3 |
| N2 | **P19:** 7/22/14, GMT 203, as-run **94**, sample **194m**, "6.35-mm black rod", igniter **–36**, restrictor 2, **"Concurrent"**, fan "49, 62, 44, 41.5, 122, 41 (pots 1.3, 2.8, 0.7, 0.4, 0.36, 10., 0.32)", air "5, 8, 2, maximum, 0", cal. O₂ 17.5 → 16.7, "Tried blowoff, did not blowoff at pot 10 2 restrictors, flame out at 0.32, sample mostly gone". **Visually re-checked today** | [TM] p.114/106 |
| N3 | The column headed "Sample distance" holds a configuration word in **every** row of every PI matrix inspected: Opposed (A.1, A.3, A.4), Concurrent (A.3, A.5, A.6), Stagnation (A.5, A.6). Reading it as flow configuration is therefore well supported. The header appears to be a shared template label | [TM] pp.111–121 |

### 2.3 NASA/TM-20210011385: the main text (treats these burns as opposed)
| # | Content | Location |
|---|---|---|
| N4 | "Ignition of the PMMA was accomplished by using a hot wire placed to heat the PMMA surface in the **downstream edge** of the rods." "Table 4.1 and Table 4.2 present the test conditions for the **opposed-flow** flame spread tests conducted in this task." | [TM] p.55/47 |
| N5 | Table 4.1: black PMMA, 6.35 mm: **23 test conditions, 9 samples burnt** | [TM] p.55/47 |
| N6 | Table 4.2: flow velocity for 0.00635 m rods **"0.0041 to 0.075" m/s** | [TM] p.56/48 |
| N7 | Fig. 4.1: "Flame spread rate versus **opposed-flow velocity** and O₂ concentration for three diameters of black polymethylmethacrylate rods in microgravity". The 0.635-cm panel shows **two points near 7.6 cm/s**, at about 0.0068 and 0.0047 cm/s. (The x-axis is labelled "Flame velocity, cm/s" while the caption says opposed-flow velocity; see C-25.) Visually checked; **not digitised** | [TM] p.57/49 |
| N8 | "The rods were ignited at the **downstream end**" | [TM] p.59/51 |
| N9 | Hardware: samples "could generally be mounted so that they could be burned in either the opposed or concurrent flow direction". Fig. 1.2: "(c) opposed rod higher flow … (f) concurrent rod, (g) opposed rod at low flow with open tip (**similar to concurrent rod**) … Forced flow is up in all images." | [TM] p.13/5 |
| N10 | "the concurrent PMMA rod **molten tip is upstream**"; opposed-flow rod: the bubble layer "extends downstream as the rod regresses … until … the molten tip forms a sphere" | [TM] p.60/52 |
| N11 | Olson (concurrent/stagnation PI): clear rods, plus "**Two black PMMA rods** (r = 0.318 cm …) were also tested". Table A.5 lists exactly two black rods: **O11 (184m)** and **O14 (183m)**. 191m and 194m are not among them | [TM] p.75/67; p.118/110 |

### 2.4 Same-day context in NASA's appendix (the strongest argument *for* a concurrent reading)
| As-run | Test | Date | Sample | Material | Igniter | Config. cell | Location |
|---|---|---|---|---|---|---|---|
| 89 | O5a | 7/21/14 15:59 | 220m | 12.7-mm clear rod | –41, –42, –30 | Concurrent | p.119/111 |
| 90 | O5b | 7/21/14 17:02 | 220m | 12.7-mm clear rod | –30 | Concurrent | p.119/111 |
| 91 | O13a | 7/21/14 17:22 | 221m | 12.7-mm clear rod | –29 | Concurrent | p.118/110 |
| 92 | O13b | 7/21/14 17:57 | 221m | 12.7-mm clear rod | –29 | Concurrent | p.118/110 |
| **93** | **P16** | 7/22/14 (no time) | 191m | 6.35-mm black rod | **–36** | **Concurrent** | p.114/106 |
| **94** | **P19** | 7/22/14 (no time) | 194m | 6.35-mm black rod | **–36** | **Concurrent** | p.114/106 |
| 95 | O10 | 7/22/14 13:26 | 210m | 6.35-mm clear rod | –31 | Concurrent | p.118/110 |
| 96 | O17 | 7/22/14 | 211m | 6.35-mm clear rod | –31 | Concurrent | p.118/110 |
| 97 | M10 | 7/23/14 | 180m | PMMA slab | Integral | Opposed | p.116/108 |

P16 and P19 are the only Fernandez-Pello burns inside a run of eight consecutive "Concurrent" as-run numbers.
Every other Fernandez-Pello burn is "Opposed".

Igniter IDs:
- **–36** is the ID on every Fernandez-Pello burn from 7/8 to 7/30: P25 (7/8); P12 and P17 (7/29); P18, P20, P23 and P24 (printed "36", 7/30). All of these are "Opposed".
- The Olson tests on either side used **–29** (7/21) and **–31** (7/22).
- The TM does not explain what an igniter ID implies about the mounting, so this is circumstantial only.

### 2.5 Other records checked
- **NASA PSI-25 BASS-II test table.** Seen only as a **third-party copy** (`AnteurAbderraouf/Fotia` on GitHub, file `combustion_science/microgravity_investigation/PSI-25/csv/BASS-II.csv`, SHA-256 `71e792bf…c042`, read 2026-10-20). It has **no configuration column**, so it cannot settle C-03. Its P16 and P19 rows agree with Table A.3 on date, sample, fan and air displays and O₂.
- **Rivera et al. 2026** (FSJ 162:104719) and **Liveretou et al. (PROCI 2024)**: not accessible (B-04). They may settle the question and remain unread.
- **NASA PSI raw video and overlays:** not accessible (B-03).

## 3. Is B16 = P16 and B19 = P19? (crosswalk test, item E)
The crosswalk does **not** rest on the shared number. These attributes were checked independently:

| Attribute | B16 (Link) vs P16 (NASA) | B19 (Link) vs P19 (NASA) | Alternatives among the 27 NASA rod burns |
|---|---|---|---|
| Diameter | 0.64 cm vs 6.35 mm | same | 12 burns are 6.35 mm |
| Colour | B = black vs "black rod" | same | — |
| O₂ | 18.2 = cal. initial 18.2 | 17.5 = cal. initial 17.5 | **P16 is the only 6.35-mm burn at 18.2, and P19 the only one at 17.5** (P23 is 18.2 but 9.525 mm; P12 is 17.5 but 9.525 mm) |
| Flow history | V_g 7.55, 1.67, 0.83, 0.72 (Fig. 4: 7.6 → 1.7 → 0.8 → 0.7) vs air display "5, 8, 2, low" and pots 1.3, 2.8, 0.7, 0.4, 0.36, 0.32 | same V_g sequence vs "5, 8, 2, maximum, 0" | **Only P16 and P19** among the 6.35-mm burns reached an air display of 8 (≈ 7.55 cm/s). P17 reached 22, during a blow-off attempt |
| Same-day flow values | B16 and B19 share identical V_g values | — | consistent with two burns on one day (see `adversarial_source_audit.md` §4, finding F-7) |
| End of burn | Link: extinguished "below 0.6 cm/s"; blow-off "not observed" | P19: "did not blowoff … flame out at 0.32" | consistent |
| Specimen block | 191m and 194m sit in the Fernandez-Pello sample-number block (185m–203m) | — | Olson's black rods are 183m and 184m |

**Verdict (E): PASS for the crosswalk.** Diameter, colour, exact initial O₂, the unique 8-cm/s air-display step,
and the burn ending each pick out P16 and P19 independently of the label. This is an inference from documents. No
author has confirmed it.

## 4. How the two sources define opposed and concurrent (items C, D)
- **Link:** opposed means the gas flow opposes the direction of flame spread (L1). Concurrent is not defined in [L18]. The ESM Fig. S2 legend uses "co-flow" for **axial flow along a rod in a 1 g simulation**, which is a flow-geometry description, not a flame-spread direction. That terminology could mislead a reader, but it doesn't concern B16/B19.
- **NASA, opposed:** the rod is ignited at its **downstream** end and the flame spreads upstream. The leading edge faces the incoming flow, and the remaining rod with its molten tip lies **downstream** inside the flame (N4, N8, N10).
- **NASA, concurrent:** the rod's hemispherical **stagnation tip faces upstream** and is ignited there. The flame spreads downstream along the rod, and the molten tip is **upstream** (N10, N11; Olson p.75/67).
- **Reference direction:** both documents describe a fan at the upstream end of the duct, so the flow direction is fixed. Configuration is set by **which way the rod points**, not by the flow. Flow cannot be reversed mid-burn, and the rod cannot be re-mounted while lit. So "a burn that changed configuration partway" is physically implausible.

**No difference in convention was found.** Both documents use "opposed" in the standard sense, and NASA's
own figure (N9) shows what each configuration looks like.

## 5. Image evidence (assistant's visual reading; qualitative, not data)
- **NASA's labelled examples, Fig. 1.2 (flow up in all images):**
  - **(c) opposed rod, higher flow**, and **(g) opposed rod, low flow, open tip:** a dark rod enters the flame **from below**, the upstream side, and ends in a rounded tip inside the flame.
  - **(f) concurrent rod:** the rod enters the flame **from above**, the downstream side, and its rounded tip sits at the **bottom** of a U-shaped flame.
- **Link Fig. 4 (B16 and B19, V_g arrow up):** in every blue/pink frame from 5 to 11 min, the dark rod rises **from the flame base** and ends in a rounded tip in the upper-middle of the flame. A thin glint line continues **below** the flame. Link's 0.8 cm/s frames closely resemble NASA Fig. 1.2(c), and the 0.7 cm/s frames resemble 1.2(g).
- **Reading:** Link's B16/B19 photos show the geometry NASA labels as **opposed**, and do not show the geometry NASA labels as concurrent.
- **Limits:**
  - This is one assistant's reading of published images. The orientation and cropping of the published panels are the authors' choices.
  - Whether NASA's Fig. 1.2 panels come from P16/P19 themselves is **not established**.
  - NASA itself says a low-flow opposed rod with an open tip looks "similar to concurrent rod". That is a plausible way a log entry could go wrong, but it is only a hypothesis.

## 6. Alternative explanations (item G)
| # | Hypothesis | For | Against | Assessment |
|---|---|---|---|---|
| H1 | P16/P19 were **opposed**; the A.3 configuration cells are an appendix entry error (e.g., carried over from the surrounding block of Olson concurrent tests when the matrix was compiled) | L1–L7; N4–N8 (Ch. 4 counts, range and figure include them); image geometry (§5); igniter –36 shared with the PI's opposed burns; not among Olson's two black rods (N11). (The PSI-25 table copy has no configuration column, so where the A.3 column came from is unknown) | the A.3 cell is a primary NASA log entry as printed; no erratum | **Most consistent with the accessible evidence. Not proven** |
| H2 | P16/P19 were genuinely run **concurrent** (the hardware was in concurrent configuration on 7/21–22), and Link and Ch. 4 present them as opposed | §2.4 block context; A.3 entry | Link's photos show the opposed geometry; Ch. 4 includes them in opposed-flow tables and figures; the burns used the Fernandez-Pello igniter, not Olson's; NASA's own concurrent-rod study counts only two black rods, neither of them these | **Less consistent.** It would require the photos and Ch. 4 both to misdescribe the burns |
| H3 | Different naming or label scheme (B16 is another test) | NASA A.1 also has "B16" (150m) and "B19" (151m), both 100-µm **films** (C-14) | films are not 0.64-cm rods; the attribute match in §3 is unique | **Rejected** for the crosswalk; it remains a real label-collision hazard |
| H4 | Different flow-reference convention | — | both sources describe a fixed upstream fan and the same ignite-downstream rule (§4) | **Not supported** |
| H5 | One label covers several runs | happens for B22 (P22a + P22b, C-15) | P16 and P19 are single burns of single specimens (191m, 194m); the V_g sequence matches one burn each | **Not supported** for B16/B19 |
| H6 | Typo in the configuration word | "Concurrent" appears in both rows, identically | a single-character typo cannot turn "Opposed" into "Concurrent" | Only as part of H1 (a copying error, not a typo) |
| H7 | Figure-label error in Link (Fig. 4/6 show other burns) | — | V_g values, O₂ and the flow history match P16/P19 exactly; Fig. S1 Δt matches Table S1 | **Not supported** |
| H8 | Mixed configuration within one burn | — | physically implausible (§4) | **Rejected** |

## 7. Classification and exact supporting locations
**GENUINE UNRESOLVED CONFLICT** between:
- **concurrent:** [TM] p.114/106, Table A.3, P16 and P19, column headed "Sample distance";
- **opposed:** [L18] pp.2, 4, 5, 7; [L18-ESM] p.2, Fig. S1; and [TM] pp.55–57/47–49 (Tables 4.1, 4.2 and Fig. 4.1) and p.59/51 (ignition at the downstream end), the last two by inference.

Why the other labels don't fit:
- **Not RESOLVED:** the register's rule requires an author, NASA or a primary record (video) to settle it. Every "opposed" item from the TM main text is an *inference* that the tabulated points are P16/P19, because the TM never names them.
- **Not CROSSWALK NOT ESTABLISHED:** §3.
- **Not INSUFFICIENT EVIDENCE:** there is enough evidence to see the conflict and to weigh it. What's missing is a decisive record.

**Direction of the evidence: it favours opposed.** One documentary entry (the configuration cell of two rows)
stands against the article, the TM's own chapter, the photographs and the specimen and igniter records.

## 8. What is CONFIRMED / INFERRED / UNKNOWN
- **CONFIRMED** (read in the sources):
  - A.3 prints "Concurrent" for P16 and P19.
  - Link labels B16 and B19 opposed.
  - TM Table 4.2 gives 0.075 m/s as the 6.35-mm maximum.
  - TM Fig. 4.1 has two 0.635-cm points near 7.6 cm/s.
  - The same-day as-run block (89–96) is all "Concurrent".
  - The igniter IDs are as tabulated.
  - Olson's chapter reports two black rods, and A.5 lists exactly two (183m, 184m).
- **INFERRED:**
  - B16 = P16 and B19 = P19.
  - The TM Ch. 4 points at 7.6 cm/s are B16/B19.
  - Link's photos show the opposed geometry.
  - H1 is the most likely explanation.
- **UNKNOWN:**
  - Which document is wrong.
  - How the A.3 configuration column was compiled.
  - What the igniter IDs imply about mounting.
  - What the raw video shows.
  - What Rivera 2026 says.

## 9. Effect on the scientific analysis
- **B16/B19 stay QUARANTINED** for any configuration-specific use (D-006 is kept). Their 8 rows are not used as opposed-flow evidence until the conflict is settled.
- The **non-monotonic V_f(V_g) result** in Link Fig. 6a remains a *source-reported* result. The previous wording, "rests on records whose flow configuration is disputed", is literally true but **misleading on its own**. It omitted that NASA's own Chapter 4 treats the same burns as opposed. Corrected wording: *"NASA's appendix log lists these two burns as concurrent. The article, NASA's own Chapter 4 summary, and the published photographs all present them as opposed. The conflict is unresolved, and the weight of accessible evidence favours opposed."*
- **Nothing is claimed as a physical discovery.** This is a documentation discrepancy.
- **No one is accused.** Neither the authors nor NASA is said to be in error.

## 10. Consequences for IGNIS
1. **Do not build the pitch on this discrepancy (D-017).** A judge or author who checks it will find that the evidence leans toward the paper. Presenting it as "NASA says the headline series was concurrent" would be an overclaim.
2. It is still a good **worked example of conflict handling**: a single log cell against several converging documents, kept quarantined, shown with its evidence balance. It belongs as one example among several, not as the headline.
3. **The question to the authors or NASA is now sharper.** See `planning/author_clarification_email.md`.

## 11. What would resolve it
1. A statement from the corresponding author or the NASA GRC BASS-II team.
2. PSI-25 video or overlay data for as-run 93 and 94 (the rod direction relative to the flow is visible in the video).
3. Rivera et al. 2026 or Liveretou et al. 2024, if either re-tabulates these burns with a configuration.
