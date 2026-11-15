# Source register

## LIV25 supplied dissertation: 15 November 2026, later access update

Christina Liveretou, [Effect of Pressure and External Heating on Microgravity and Earth Gravity Fires](https://escholarship.org/uc/item/5px3896h), UC Berkeley PhD, 2025. Supplied PDF: 96 pages, 26,721,273 bytes, SHA-256 `f64dbd7ad0e23e79a5ab2fd686ec858a0e4a5ce31240552760db11c6ff978a6b`. Chapters 3–6 and selected methods/outline/references/appendix reviewed, with table/method/equation page images inspected. Full-file acquisition does not mean every background page was audited. PDF/figures remain local; no redistribution license established. The [factual dossier](../web/data/trajectory-studies/liveretou2025.json) preserves eight printed derived HRR values and six approximate sheet-study correlation exponents, with source roles and common-experiment ancestry. No raw trajectory or run identities acquired. See [review](../web/docs/DISSERTATION_AND_TRAJECTORY_METHODS_2026-11-15.md); earlier access notes below are historical.

## Full accepted-manuscript access: LIV24, 15 November 2026

The owner supplied two nine-page copies of Liveretou et al. (2024), DOI [10.1016/j.proci.2024.105224](https://doi.org/10.1016/j.proci.2024.105224). Both were checked; all pages were read and methods/results pages visually inspected. Canonical hash `a1899bf28581fa30a480a65d7868a94019821e7fc7b02b3f51ff2c34fc2b6bb0` (1,385,409 bytes); alternate `8ff9c5214eac0f2d7da53ddac4493578b1cba9954ccd6fbbf813c0cfef5398fc` (1,384,104 bytes). Text and nine 72-dpi renders match, despite byte differences. These are duplicate manifestations, not independent sources. Page 1 states the Elsevier user license; the PDFs remain local. The version-of-record full text remains uninspected.

The [source dossier](../web/data/endpoint-studies/liveretou2024.json) records the combined endpoint, finite-step protocol, mean/SD statistic, mixed convection, nonuniform radiant heating and unevaluated source correlation. No per-run transitions or graph values are reconstructed. [C-29](source_conflicts.md) and the [technical report](../web/docs/ENDPOINT_PROTOCOL_AUDIT_2026-11-15.md) explain why source LOC cannot be promoted to complete extinction. This updates access only; older reports below retain their dated limitations.

## Full-text access update: RIES24, 15 November 2026

The owner supplied the full publisher PDF of Ries, Eigenbrod and Meyer (2024), DOI [10.1016/j.proci.2024.105358](https://doi.org/10.1016/j.proci.2024.105358). All seven pages were read; Table 1 and Figures 3/6/10 context were inspected. SHA-256 `3c4fa8278cae1da73bc15a4b5443d927006a8150b3d8a83d4c79582f127008f2`, 2,105,330 bytes. The article states CC BY. This supersedes earlier access limits for this source only, not their historical records. The new [source collection](../web/data/design-studies/ries2024.json) transcribes printed coordinates and method definitions; no figure measurements were digitized. It is separate from the frozen registry/evaluation packet. See [C-28](source_conflicts.md) for the pressure discrepancy and the [nominal-design audit](../web/docs/EXPERIMENTAL_DESIGN_AUDIT_2026-11-15.md). Curation is assistant-checked, not independent human review.

## Historical register

Identity checks were done on 2026-10-20. "Inspected" means read in this session. Metadata-only records are labelled
as such. Rights are in `manifests/rights_and_attribution.csv`. Retrieval details and checksums are in
`manifests/data_sources.csv`.

## Primary evidence (rod and thin-sheet cases)

| Key | Identity (verified how) | What was inspected | Role | Notes |
|---|---|---|---|---|
| **L18** | Link S., Huang X., Fernandez-Pello C., Olson S., Ferkul P. "The Effect of Gravity on Flame Spread over PMMA Cylinders." *Sci. Rep.* **8**, 120 (2018). doi:10.1038/s41598-017-18398-4. Received 17 Aug 2017, published 9 Jan 2018. Verified via Crossref and the article page. PMCID PMC5760683, PMID 29317681 (NCBI ID converter) | full text (HTML) and PDF (9 pp.); Figs 5–7 viewed as page renders | rod μg/1 g spread; methods; claims | CC BY 4.0. Version of record 9 Jan 2018 |
| **L18-ESM** | Supplementary Information to L18, Springer ESM `41598_2017_18398_MOESM1_ESM.pdf` (PDF metadata author "Xinyan", created 15 Aug 2017, Word 2016) | all 4 pages: Table S1 (μg, 52 rows), Table S2 (1 g, 46 rows), Figs S1–S3, refs | **primary numeric data** for Evidence Case 02 | Transcribed: `research/data/link2018_table*.csv` |
| **TM** | Olson S.L., Ferkul P.V., Bhattacharjee S., Miller F.J., Fernandez-Pello C., Link S., et al. *Burning and Suppression of Solids–II (BASS–II) Summary Report.* NASA/TM-20210011385, E-19939. NTRS 20210011385; distribution date 2021-04-01, publication date 2021-10-01 (NTRS API) | §2.2 incl. Table 2.1 (PDF p.36 / printed p.28); Ch. 4 (PDF pp.55–62); App. A Tables A.1 (part), **A.3 (all)**, A.5 (part) | thin-sheet V_g,cr; **as-run test matrix**; rod chapter claims | 144 pp. NTRS copyright `GOV_PERMITTED`. Only the NTRS official PDF is used; the ResearchGate copy cited on 15 Oct is not needed |
| **R2** | Bhattacharjee S., Simsek A., Olson S., Ferkul P. "The critical flow velocity for radiative extinction in opposed-flow flame spread in a microgravity environment: A comparison of experimental, computational, and theoretical results." *Combust. Flame* **163**, 472–477 (2016). doi:10.1016/j.combustflame.2015.10.023 (Crossref) | metadata only | same result as TM §2.2 (TM p.27 footnote: "Previously published as") | Not an independent confirmation of TM Table 2.1 |

## Directly relevant, not yet accessible in full

| Key | Identity (Crossref unless noted) | Relevance | Access |
|---|---|---|---|
| **RIV26** | Rivera J., Liveretou C., Fernandez-Pello C., Gollner M.J., Stocker D., Ferkul P., Olson S. "Opposed flame spread limit over PMMA rods in normal and micro gravity." *Fire Saf. J.* **162**, 104719 (Jul 2026). doi:10.1016/j.firesaf.2026.104719 | **same material, geometry and endpoint family** as the rod case; newer μg data likely | ScienceDirect 403; no abstract in Crossref. Must be read before the rod scope is finalised |
| **LIV24** | Liveretou C., Scudiere C., Rivera J., Etzenbach L., Thomsen M., Fernandez-Pello C., Gollner M.J., Olson S., Ferkul P. "The limiting oxygen volume fraction for opposed flame spread extinction." PROCI, doi 10.1016/j.proci.2024.105224 (**NTRS record 44513796802494 only; DOI not resolved via Crossref this session**) | LOC for opposed spread (endpoint E-05) | NTRS record has no download |

## Context-layer studies (identity verified via Crossref; contents not read)

| Key | Identity | Why context only (for now) |
|---|---|---|
| **RIES24** | Ries H.-C., Eigenbrod C., Meyer F. "Effect of oxygen concentration, pressure, and opposed flow velocity on the flame spread along thin PMMA sheets." *Proc. Combust. Inst.* **40**, 105358 (2024) | thin sheets, not rods; pressure is a variable there and is absent in L18 |
| **TIEN25** | T'ien J.S., Li C., Ferkul P.V., Olson S.L., Johnston M.C. "Experimental determination of diffusion flame extinction boundaries over a PMMA sphere: The effect of sub-surface solid heating." *Combust. Flame* **277**, 114244 (Jul 2025) | sphere geometry; extinction boundary endpoint; thermal-history evidence relevant to C-05/C-23 |
| **TAK26** | Takahashi S., Kobayashi Y., Kikuchi M., Fujita O. "Flame spread over charring and non-charring materials in microgravity on ISS/Kibo." *Combust. Flame* **286**, 114803 (Apr 2026) | different facility (FLARE, Kibo) and materials; possible PMMA comparison data |
| **OLS24** | Olson S.L., Neumann E.S., Valletta V.M., Ogorzaly A.L., Owens J.C. "Partial gravity flammability of cast PMMA rods in concurrent axial stagnation flow." *Fire Saf. J.* **150**, 104267 (Dec 2024) | PMMA rods, but **concurrent / stagnation** flow and partial g: a different configuration from Q1 |

## Repositories

| Key | Identity | Status |
|---|---|---|
| **PSI-25** | NASA Physical Sciences Informatics, BASS-II investigation | sign-in required (403); not inspected |
| **PSI-26** | NASA PSI "Burning and Suppression of Solids" (BASS), ISS, 2009-10-01 → 2013-06-30; lists PSI-25 as related | public search-index metadata only; study endpoint 403 |

## Prior art and methods (see `prior_art.md`)

| Key | Identity (verified how) |
|---|---|
| NIST-MFD | "The NIST Material Flammability Database", IAFSS14 (Tsukuba), NIST pub_id 956810 (nist.gov page, 200) |
| ONTO | Bai J., Geeson R., Farazi F., Mosbach S., Akroyd J., Bringley E.J., Kraft M. "Automated Calibration of a Poly(oxymethylene) Dimethyl Ether Oxidation Mechanism Using the Knowledge Graph Technology." *J. Chem. Inf. Model.* 2021; doi 10.1021/acs.jcim.0c01322; PMC8154252 (PubMed esummary + abstract). Introduces **OntoChemExp** |
| AOA | Meyer H., Pebesma E. "Predicting into unknown space? Estimating the area of applicability of spatial prediction models." arXiv:2005.07939 (2020) (arXiv API) |
| PRIME | Oreluk J., Needham C.D., Baskaran S., Sarathy S.M., Burke M.P., West R.H., Frenklach M., Westmoreland P.R. "Dynamic Chemical Model for H2/O2 Combustion Developed Through a Community Workflow." arXiv:1801.10093 (2018) (arXiv API). Uses PrIMe and Bound-to-Bound Data Collaboration |
| CLLM | Yang Z., Mao R., Wu T., Li H., Zhou Q., Chen Z.X. "A unified foundational framework for knowledge injection and evaluation of Large Language Models in Combustion Science." arXiv:2603.04452 (27 Feb 2026) (arXiv API) |
| STD-7009 | NASA-STD-7009, "Standard for Models and Simulations" (standards.nasa.gov page lists NASA-STD-7009B, file dated 2024-03-05, plus earlier revisions) |

## Third-party copies and competitor repositories (2nd session, 20 Oct; leads and prior art, not evidence)

| Key | Identity | Inspected | Role |
|---|---|---|---|
| **PSI25-COPY** | NASA PSI-25 BASS-II test table, as redistributed in the GitHub repo `AnteurAbderraouf/Fotia` (`…/PSI-25/csv/BASS-II.csv`, SHA-256 `71e792bf…c042`) | all 129 rows (P and selected O rows read) | corroborates A.3 fields. **Not** verified against PSI (D-020) |
| **MFA** | MicroFire Atlas, `github.com/A-K-M-Asifuzzaman/MicroFire-Atlas` (MIT), README and `apps/web/data/{experiments,findings,sources}.json` | README; data fields and families | prior art / competitor |
| **FOTIA** | `github.com/AnteurAbderraouf/Fotia` (MIT code), README and tree | README; tree; PSI-25 CSV | prior art / competitor |
| **FLARENEXUS** | `github.com/KhalidHasan03/Flame-in-Freefall` ("Team Cosmic Nexus"), README and tree | README; tree | prior art / competitor (synthetic data, per its README) |

## Competition sources
See `planning/competition_rules.md`. All were fetched on 2026-10-20 from spaceappschallenge.org: FAQ page dated
13 Oct 2026; Team Formation Guide dated 23 Sep 2026; Participant Terms & Conditions updated 7 Aug 2026; the 2026
home page; and the challenge page through the site's public GraphQL endpoint.
