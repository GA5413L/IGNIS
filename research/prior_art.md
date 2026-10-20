# Prior art: what already exists and what IGNIS must not claim as new

Identities are verified in `source_register.md`. Except for the abstracts quoted below, the contents of these works
were **not** read in this session. Statements are limited to what the retrieved abstracts and pages say.

| Work | What it already does | Consequence for IGNIS |
|---|---|---|
| **OntoChemExp** (Bai et al. 2021, *J. Chem. Inf. Model.*) | "an ontological representation for combustion experiments … that allows for the semantic enrichment of experiments within the J-Park simulator … OntoChemExp is fully capable of supporting experimental results in the Process Informatics Model (PrIMe) database"; agents for retrieval, sensitivity analysis and calibration (abstract) | Representing combustion experiments in a knowledge graph is **not new**. IGNIS's canonical schema should borrow vocabulary where it fits and must not be presented as a first combustion ontology. OntoChemExp targets gas-phase kinetics experiments (ignition delay, flame speed), not solid-fuel flame spread with specimen history |
| **PrIMe community workflow** (Oreluk et al., arXiv:1801.10093) | assigning uncertainties, choosing quantities of interest, and evaluating "model-vs.-data consistency using Bound-to-Bound Data Collaboration" | Formal model–data consistency methods exist. IGNIS's Table 2.1 comparison is plain arithmetic, not B2B-DC, and must say so |
| **Area of applicability** (Meyer & Pebesma, arXiv:2005.07939) | a "dissimilarity index" in predictor space and an AOA threshold derived from cross-validation | The template for "where does a conclusion stop transferring": IGNIS's applicability checks are categorical rule checks. Any future predictor would need an AOA-style analysis, and with 4 admitted burns it cannot be calibrated now |
| **Combustion LLM framework** (Yang et al., arXiv:2603.04452, Feb 2026) | 3.5 B-token combustion knowledge base; CombustionQA (436 questions); reports naive RAG peaking at 60 % accuracy vs 23 % zero-shot and an 87 % upper bound | General combustion QA with RAG/KG/continued pretraining exists, and its own RAG ceiling is a warning. IGNIS should not compete on general QA. Its contribution, if any, is record-level applicability and provenance for a narrow endpoint |
| **NIST Material Flammability Database** (IAFSS14) | curated material property and flammability data supporting fire modelling | A curated, source-linked materials database is an established pattern and a fair reference point for data curation, not something IGNIS invents |
| **NASA-STD-7009B** (Models and Simulations) | requirements for M&S credibility: verification, validation, uncertainty quantification, sensitivity | If IGNIS ever shows a model output, its credibility claims should follow NASA-STD-7009's vocabulary. IGNIS must not imply NASA endorsement |
| **Conventional spreadsheet / filtered table** | holds the same 52 + 46 rows and computes every difference in Evidence Cases 01 and 02 | **The baseline to beat.** Evidence Case 02 shows no computational advantage. Any claimed advantage has to come from fewer admission errors or less effort, measured (`planning/evaluation_plan.md`) |

## What might be novel (hypotheses, not claims)
1. A record-level **crosswalk** between a journal supplement and NASA's as-run test matrix, with explicit conflict flags (C-02 to C-16). We have not found this published. We also haven't searched exhaustively, so it remains unverified.
2. Using **specimen identity and burn order** (NASA sample numbers) as independence groups when comparing published microgravity flame-spread rows.
3. Treating the *journal's headline series* as quarantinable when an archival record disagrees (C-03).

None of these is an algorithm. Each is a data-curation and reasoning discipline, and each has to show value
against the spreadsheet baseline.
