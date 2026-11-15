# IGNIS — citations and source links

Compiled on **16 November 2026** from the project’s existing source records. This bibliography covers application evidence, datasets, retained research, and research/design references recorded before repository cleanup. It does not add new scientific findings or change the submitted application. Preparation references remain identified as preparation; their inclusion does not imply challenge-time creation.

Access notes distinguish inspected text, selected passages, metadata and background references. A citation is not independent validation, a license to redistribute the source, or a claim that its software is implemented in IGNIS. Titles and identifiers follow the recorded source version; incomplete bibliographic details are not invented.

Source records: [application registry](web/data/sources.json), [research register](research/source_register.md), [retrieval manifest](manifests/data_sources.csv), [rights and attribution](manifests/rights_and_attribution.csv), and [dated citation-metadata checks](web/src/data/citation-metadata.json). The later access updates in the research register supersede its historical access labels.


## 1. Application publication references

These are the publication entries cited by the application’s core evidence registry. The source IDs match the records used by IGNIS.

- **SRC-S-V.** [Vehicle Modeling during the Burning of Thermally Thick Samples in the Saffire V Experiments (ICES-2024-310)](https://ntrs.nasa.gov/citations/20240008602). Justin Niehaus; John Brooker; David Urban; Gary Ruff. 2024-07. Selected PDF passages checked: pages 5–6; vehicle-model interpretation.
- **SRC-S-VI.** [Vehicle Modeling During the Burn Events in the Saffire VI Experiments (ICES-2025-156)](https://ntrs.nasa.gov/citations/20250002675). Justin Niehaus; John Brooker; David Urban; Gary Ruff. 2025-07. Selected methods, event tables and results checked; no source curves digitized.
- **SRC-S-CAL.** [Preliminary Results from the Saffire VI Experiment (ICES-2024-365)](https://ntrs.nasa.gov/citations/20240002981). David L. Urban; Gary A. Ruff; Paul Ferkul; John Easton; Michael Johnston; Jay Owens; Sandra Olson; Claire Fortenberry; et al.. 2024-07. Tables 1–2 and conclusion inspected, including the table image; preliminary source version retained separately from the 2026 report.
- **SRC-R09.** [Evaluation of Spacecraft Smoke Detector Performance in the Low-Gravity Environment (Fire Safety Journal 98, 2018) — NIST publication page](https://www.nist.gov/publications/evaluation-spacecraft-smoke-detector-performance-low-gravity-environment). J. Yang; T. Cleary; M. Meyer; D. Urban; G. Mulholland; V. Bryg; Z. Yuan; G. Ruff. 2018. NIST publication abstract/excerpt inspected; full journal text is not claimed as reviewed. DOI: [10.1016/j.firesaf.2018.04.004](https://doi.org/10.1016/j.firesaf.2018.04.004).
- **SRC-R14.** [Isolated Single Droplet Combustion: FLEX Experiments onboard the International Space Station (JASMAC-33 presentation)](https://ntrs.nasa.gov/citations/20210022617). Vedha Nayagam; Daniel L. Dietrich; Forman A. Williams. 2021-10-15. Presentation inspected; droplet-combustion and endpoint context.

## 2. Primary research and source-specific analyses

- **SAFFIRE-2026.** [Heat and Smoke Emission from Tests on the Saffire VI Experiment](https://ntrs.nasa.gov/citations/20260001992). Urban, D. L., et al. (2026). ICES-2026-577. Table 1, PDF page 6, supplies the seven atmosphere cases. The NTRS record title is used here; the PDF is also described in the research notes as covering Saffire IV–VI. [Curated source and locators](web/data/condition-cases.json).
- **L18.** [The Effect of Gravity on Flame Spread over PMMA Cylinders](https://doi.org/10.1038/s41598-017-18398-4). Link, S.; Huang, X.; Fernandez-Pello, C.; Olson, S.; Ferkul, P. (2018). Scientific Reports, 8, 120. Article methods and results inspected. [Publisher article](https://www.nature.com/articles/s41598-017-18398-4).
- **L18-ESM.** [Supplementary Information to Link et al. (2018)](https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fs41598-017-18398-4/MediaObjects/41598_2017_18398_MOESM1_ESM.pdf). Tables S1–S2 and supplementary figures inspected. Source of the 52 microgravity and 46 normal-gravity table rows preserved in [research/data](research/data/README.md); these row counts are not independent-trial counts.
- **TM / BASS-II.** [Burning and Suppression of Solids–II (BASS–II) Summary Report](https://ntrs.nasa.gov/citations/20210011385). Olson, S. L.; Ferkul, P. V.; Bhattacharjee, S.; Miller, F. J.; Fernandez-Pello, C.; Link, S.; et al. (2021). NASA/TM-20210011385, E-19939. Selected methods, Table 2.1, Chapter 4 and Appendix A.3 inspected. [Official PDF](https://ntrs.nasa.gov/api/citations/20210011385/downloads/TM-20210011385.pdf).
- **RIES24.** [Effect of oxygen concentration, pressure, and opposed flow velocity on the flame spread along thin PMMA sheets](https://doi.org/10.1016/j.proci.2024.105358). Ries, H.-C.; Eigenbrod, C.; Meyer, F. (2024). Proceedings of the Combustion Institute, 40, 105358. All seven publisher-PDF pages reviewed; printed design and measurement definitions used, with no plot digitization. [Source dossier](web/data/design-studies/ries2024.json).
- **LIV24.** [The limiting oxygen volume fraction for opposed flame spread extinction](https://doi.org/10.1016/j.proci.2024.105224). Liveretou, C.; Scudiere, C.; Rivera, J.; Etzenbach, L.; Thomsen, M.; Fernandez-Pello, C.; Gollner, M. J.; Olson, S.; Ferkul, P. (2024). Proceedings of the Combustion Institute, 40, 105224. Nine-page accepted manuscript reviewed. Two supplied copies contain the same text and page images; they are one source. Version-of-record full text was not inspected. [Source dossier](web/data/endpoint-studies/liveretou2024.json).
- **LIV25.** [Effect of Pressure and External Heating on Microgravity and Earth Gravity Fires](https://escholarship.org/uc/item/5px3896h). Liveretou, C. (2025). PhD dissertation, University of California, Berkeley. Focused review of Chapters 3–6 and selected methods, outline, references and appendix; not every background page audited. [Source dossier](web/data/trajectory-studies/liveretou2025.json).
- **SAME-2.** [Particle Morphology and Size Results from the Smoke Aerosol Measurement Experiment-2](https://ntrs.nasa.gov/citations/20130000422). AIAA 2012-3536, 42nd International Conference on Environmental Systems (2012). Full PDF acquired; instrument/morphology methods and Table 1 checked. [Official PDF](https://ntrs.nasa.gov/api/citations/20130000422/downloads/20130000422.pdf).
- **DETECTION-TRADEOFFS.** [Fire Detection Tradeoffs as a Function of Vehicle Parameters](https://ntrs.nasa.gov/citations/20170000248). Urban; Dietrich; Brooker; Meyer; Ruff (2016). Conference paper. Detector-calibration and measurement context; selected table and text checked.
- **GRC-FIRE.** [Spacecraft Fire Safety Research](https://ntrs.nasa.gov/citations/20170007283). Meyer, M. (2016). NASA Glenn Research Center presentation, August 2016. Slide text inspected; source-specific threshold discrepancies retained.
- **FLEX-TP.** [Detailed Results From the Flame Extinguishment Experiment (FLEX) March 2009 to December 2011](https://ntrs.nasa.gov/citations/20150023456). NASA/TP-2015-216046 (2015). Full report acquired; selected methods, endpoints and test descriptions inspected, not all 314 pages independently audited.
- **COOL-FLAME.** [Cool-flame extinction during n-alkane droplet combustion in microgravity](https://ntrs.nasa.gov/citations/20140006750). Central States Section of the Combustion Institute (2014). Selected methods and conclusions inspected; hot-flame loss and later extinction distinguished.
- **SAFFIRE-IV-V.** [Evaluation of Combustion Products from Large-Scale Spacecraft Fires during the Saffire-IV and Saffire-V Experiments](https://ntrs.nasa.gov/citations/20210017343). 50th International Conference on Environmental Systems presentation (2021). Smoke transport, sampling and species-specific cleanup context; selected slides inspected.
- **WATER-MIST.** [The Water-Mist Fire Suppression Experiment (Mist): Preliminary Results From The STS-107 Mission](https://ntrs.nasa.gov/citations/20040053582). NASA/CP-2003-212376/REV1, pp. 281–284. Four-page source inspected; premixed-flame experiment context.
- **ISS-FWM.** [Development of the International Space Station Fine Water Mist Portable Fire Extinguisher](https://ntrs.nasa.gov/citations/20130011664). Rodriguez; Young (2013). AIAA/ICES conference paper. Selected development-test results inspected; not an operational certification by IGNIS.
- **ORION-PFE.** [Orion Portable Fire Extinguisher Performance Testing against a Laptop Lithium-ion Battery Stored-energy Fire](https://ntrs.nasa.gov/citations/20180005251). ICES-2018-260 (2018). Selected methods and conclusions inspected; stored-energy and toxic-product measurement context.
- **NIST-CALIBRATION.** [Cleary and Yang: smoke-aerosol photometer calibration study](https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=903316). Cleary; Yang (2009). NIST publication 903316. Selected PDF pages 5 and 7 inspected. This is a descriptive citation label; a complete title was not recorded in the retained note.
- **MIST-INHIBITION.** [Inhibition of Premixed Methane/Air Flames with Water Mist](https://www.nist.gov/system/files/documents/el/fire_research/Fuss-Inhibition-of-Premixed-Methane-Air-Flames-with-Water-Mist.pdf). Fuss et al. (2002), printed pp. 361–366. Selected methods/results inspected; droplet-size and burning-velocity context.
- **MIST-TASKBOOK.** [NASA Task Book: FY2026 MIST research summary](https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=A4E891655E49E9A6A0353DF3D9B4DE14&action=public_query_taskbook_content). Program-summary context for spread/regression limits and pressure. Source differences are recorded in [the conflict register](research/source_conflicts.md); this summary is not an independent replication.

## 3. NASA Physical Sciences Informatics datasets

NASA Physical Sciences Informatics (PSI). The 24 investigation records below are the public metadata profiles represented in [the investigation atlas](web/data/investigation-atlas.json). Catalogue coverage does not mean every file or finding in each investigation was reviewed. The captured record declares CC0 for 23 profiles; PSI-10 has no recorded license. Preserve each asset’s own rights and provenance.

| Accession | Investigation title | Dataset DOI |
|---|---|---|
| [PSI-10](https://psi.nasa.gov/physci/repo/data/investigations/PSI-10) | Advanced Combustion via Microgravity Experiments / Flame Design | [10.60555/w4zy-bt45](https://doi.org/10.60555/w4zy-bt45) |
| [PSI-20](https://psi.nasa.gov/physci/repo/data/investigations/PSI-20) | Advanced Combustion via Microgravity Experiments - Burning Rate Emulator | [10.60555/vb93-3y72](https://doi.org/10.60555/vb93-3y72) |
| [PSI-21](https://psi.nasa.gov/physci/repo/data/investigations/PSI-21) | Advanced Combustion via Microgravity Experiments / Coflow Laminar Diffusion Flame | [10.60555/23e1-9950](https://doi.org/10.60555/23e1-9950) |
| [PSI-22](https://psi.nasa.gov/physci/repo/data/investigations/PSI-22) | Advanced Combustion via Microgravity Experiments Electric-Field Effects on Laminar Diffusion Flames | [10.60555/se5a-8c73](https://doi.org/10.60555/se5a-8c73) |
| [PSI-23](https://psi.nasa.gov/physci/repo/data/investigations/PSI-23) | Advanced Combustion via Microgravity Experiments-Structure and Response of Spherical Diffusion Flames | [10.60555/k57n-p030](https://doi.org/10.60555/k57n-p030) |
| [PSI-25](https://psi.nasa.gov/physci/repo/data/investigations/PSI-25) | Burning and Suppression of Solids - II | [10.60555/4qc4-de67](https://doi.org/10.60555/4qc4-de67) |
| [PSI-26](https://psi.nasa.gov/physci/repo/data/investigations/PSI-26) | Burning and Suppression of Solids | [10.60555/58h4-dy80](https://doi.org/10.60555/58h4-dy80) |
| [PSI-39](https://psi.nasa.gov/physci/repo/data/investigations/PSI-39) | Cool Flames Investigation | [10.60555/m6pj-a914](https://doi.org/10.60555/m6pj-a914) |
| [PSI-47](https://psi.nasa.gov/physci/repo/data/investigations/PSI-47) | Dust and Aerosol Measurement Feasibility Test / Dust and Aerosol Measurement Feasibility Test-2 | [10.60555/ztgj-d202](https://doi.org/10.60555/ztgj-d202) |
| [PSI-60](https://psi.nasa.gov/physci/repo/data/investigations/PSI-60) | Computational and Experimental Analysis of SPICE Data Sets | [10.60555/mzjm-yv57](https://doi.org/10.60555/mzjm-yv57) |
| [PSI-62](https://psi.nasa.gov/physci/repo/data/investigations/PSI-62) | Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography | [10.60555/e9xp-ex83](https://doi.org/10.60555/e9xp-ex83) |
| [PSI-68](https://psi.nasa.gov/physci/repo/data/investigations/PSI-68) | Flame Extinguishment Experiment - 2 | [10.60555/byp8-h018](https://doi.org/10.60555/byp8-h018) |
| [PSI-69](https://psi.nasa.gov/physci/repo/data/investigations/PSI-69) | Flame Extinguishment Experiment | [10.60555/mbq8-0451](https://doi.org/10.60555/mbq8-0451) |
| [PSI-98](https://psi.nasa.gov/physci/repo/data/investigations/PSI-98) | Spacecraft Fire Safety Experiment-I | [10.60555/0t15-1z43](https://doi.org/10.60555/0t15-1z43) |
| [PSI-99](https://psi.nasa.gov/physci/repo/data/investigations/PSI-99) | Spacecraft Fire Experiment-II | [10.60555/2chp-m469](https://doi.org/10.60555/2chp-m469) |
| [PSI-100](https://psi.nasa.gov/physci/repo/data/investigations/PSI-100) | Spacecraft Fire Experiment-III | [10.60555/040q-4h36](https://doi.org/10.60555/040q-4h36) |
| [PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101) | Smoke Aerosol Measurement Experiment-Reflight | [10.60555/2np7-jv14](https://doi.org/10.60555/2np7-jv14) |
| [PSI-102](https://psi.nasa.gov/physci/repo/data/investigations/PSI-102) | Smoke and Aerosol Measurement Experiment | [10.60555/gd4k-8h62](https://doi.org/10.60555/gd4k-8h62) |
| [PSI-106](https://psi.nasa.gov/physci/repo/data/investigations/PSI-106) | Structure and Liftoff In Combustion Experiment | [10.60555/pm12-rg61](https://doi.org/10.60555/pm12-rg61) |
| [PSI-107](https://psi.nasa.gov/physci/repo/data/investigations/PSI-107) | Smoke Point In Co-flow Experiment | [10.60555/9kbh-e962](https://doi.org/10.60555/9kbh-e962) |
| [PSI-115](https://psi.nasa.gov/physci/repo/data/investigations/PSI-115) | Utilization of the Smoke Aerosol Measurement Experiment Data for Advanced Modeling and Simulation of Smoke Generation in Micro-Gravity | [10.60555/q0v5-1v28](https://doi.org/10.60555/q0v5-1v28) |
| [PSI-117](https://psi.nasa.gov/physci/repo/data/investigations/PSI-117) | Effect of External Thermo-Convective Perturbation on Cool Flame Dynamics: A Multidimensional Multi-Physics CFD Analysis | [10.60555/gz0q-b577](https://doi.org/10.60555/gz0q-b577) |
| [PSI-142](https://psi.nasa.gov/physci/repo/data/investigations/PSI-142) | Quantitative Studies of Cool Flame Transitions at Radiation / Stretch Extinction Using Counterflow Flames | [10.60555/80qf-vj95](https://doi.org/10.60555/80qf-vj95) |
| [PSI-159](https://psi.nasa.gov/physci/repo/data/investigations/PSI-159) | Advanced Combustion via Microgravity Experiments / Cool Flames Investigation with Gases | [10.60555/cyt1-kh64](https://doi.org/10.60555/cyt1-kh64) |

## 4. Identified data assets and measurement references

Dataset identifiers are paired with filenames and locators to distinguish the actual artifacts inspected. Additional opportunity assets remain research references unless explicitly admitted by the application’s data contract.

| Source | Artifact | Recorded locator / role |
|---|---|---|
| [NASA PSI-101 SAME/SAME-R analyzed results](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101) | `PSI-101_Analyzed Data_SAME, SAME-R_Results.xlsx` | Material Sort; headers row 2; flight marker A=1 or 2; AW50 is blank |
| [SAME-R final report](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101) | `PSI-101_Reports_SAME-R_Final Report.pdf` | PDF p. 3: run/carousel ancestry; pp. 16, 24–26: TEM and moment-instrument methods |
| [Kapton run 62 unaged TEM analysis](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101) | `PSI-101_Analyzed Data_62 Kapton unaged.xlsx` | all data!C5:C6; Binned data (2)!B5/D5; Comments on binned data!A2/A5 |
| [Kapton run 62 aged TEM analysis, source-flagged bin issue](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101) | `PSI-101_Analyzed Data_62 Kapton aged issue with bins.xlsx` | Binned data (2)!B5=870; D5=869; original filename retains issue with bins |
| [Data on Smoke Alarm Performance: compilation to NIST TN 1947](https://www.nist.gov/el/fire/engineered-fire-safety/data-smoke-alarm-performance) | `summary_nistsmokebox_roomresults.xlsx` | I 01-14!A8:P8; model/unit I-01-6; column groups B:D, E:G, H:J, K:M, N:P |
| [NIST Technical Note 1947](https://nvlpubs.nist.gov/nistpubs/TechnicalNotes/NIST.TN.1947.pdf) | `NIST.TN.1947.pdf` | PDF pp. 18–19 and 35 / printed pp. 8–9 and 25 |
| [Saffire-I processed telemetry](https://psi.nasa.gov/physci/repo/data/investigations/PSI-98) | `PSI-98_Raw Data_Saffire-I Telemetry Data Good Process Version.xlsx` | CygnusSmokeDetectorData!A2:D3/F2:I3; RawData headers A1:AV1; SaffireData headers A1:AG1 |
| [Saffire-I/III source organization README](https://psi.nasa.gov/physci/repo/data/investigations/PSI-98) | `PSI-98_Science Documents_SAFFIRE-I and SAFFIRE-III Readme.docx` | Tables 1 and 3: sample/camera and image-processing identifiers |

The combined SAME/SAME-R workbook is captured under PSI-101 record version 4, file version 1; worksheet `Material Sort` supplies the 154 stored rows used by IGNIS, including 20 DBP reference rows. [Detector provenance](web/docs/DETECTOR_DATA_PROVENANCE.md) records the checksum, exclusions and measurement units.

- **NIST-ALARM-DATA.** [Data on Smoke Alarm Performance: A Compilation to NIST TN 1947](https://doi.org/10.18434/T4530X). NIST (dataset dated 2016-12-14; captured landing-page update 2026-01-30). [Official workbook](https://www.nist.gov/document/summarynistsmokeboxroomresultsxlsx). Ground apparatus and alarm endpoints; not pooled with spacecraft detector voltages.
- **NIST-TN-1947.** [NIST Technical Note 1947](https://doi.org/10.6028/NIST.TN.1947). Methods and uncertainty reference for the smoke-alarm dataset; selected PDF pages 18–19 and 35 inspected. [Official PDF](https://nvlpubs.nist.gov/nistpubs/TechnicalNotes/NIST.TN.1947.pdf).

File versions, hashes, rights, inspection scope and unresolved joins for these additional assets are recorded in [research-opportunities.json](web/src/data/research-opportunities.json).

## 5. Related combustion literature and preparation references

These sources informed scope, comparability or future research. The access notes below follow the project records; inclusion does not turn an inaccessible paper into reviewed evidence.

- **R2.** [The critical flow velocity for radiative extinction in opposed-flow flame spread in a microgravity environment: A comparison of experimental, computational, and theoretical results](https://doi.org/10.1016/j.combustflame.2015.10.023). Bhattacharjee, S.; Simsek, A.; Olson, S.; Ferkul, P. (2016). Combustion and Flame, 163, 472–477. Metadata inspected. Related results appear in BASS-II §2.2; not independent confirmation.
- **RIV26.** [Opposed flame spread limit over PMMA rods in normal and micro gravity](https://doi.org/10.1016/j.firesaf.2026.104719). Rivera, J.; Liveretou, C.; Fernandez-Pello, C.; Gollner, M. J.; Stocker, D.; Ferkul, P.; Olson, S. (2026). Fire Safety Journal, 162, 104719. Publisher preview/metadata; full text not inspected.
- **TIEN25.** [Experimental determination of diffusion flame extinction boundaries over a PMMA sphere: The effect of sub-surface solid heating](https://doi.org/10.1016/j.combustflame.2025.114244). T’ien, J. S.; Li, C.; Ferkul, P. V.; Olson, S. L.; Johnston, M. C. (2025). Combustion and Flame, 277, 114244. Abstract/metadata context; full paper not inspected.
- **TAK26.** [Flame spread over charring and non-charring materials in microgravity on ISS/Kibo](https://doi.org/10.1016/j.combustflame.2026.114803). Takahashi, S.; Kobayashi, Y.; Kikuchi, M.; Fujita, O. (2026). Combustion and Flame, 286, 114803. Publisher abstract/metadata context.
- **OLS24.** [Partial gravity flammability of cast PMMA rods in concurrent axial stagnation flow](https://doi.org/10.1016/j.firesaf.2024.104267). Olson, S. L.; Neumann, E. S.; Valletta, V. M.; Ogorzaly, A. L.; Owens, J. C. (2024). Fire Safety Journal, 150, 104267. Abstract/metadata context; distinct flow configuration.
- **RIV26-PROCI.** [Rivera et al., Proceedings of the Combustion Institute, 106460](https://doi.org/10.1016/j.proci.2026.106460). (2026). Preview-only reference recorded in the endpoint/trajectory reviews. Full text not inspected; a complete title was not recorded there.
- **ONTO.** [Automated Calibration of a Poly(oxymethylene) Dimethyl Ether Oxidation Mechanism Using the Knowledge Graph Technology](https://doi.org/10.1021/acs.jcim.0c01322). Bai, J.; Geeson, R.; Farazi, F.; Mosbach, S.; Akroyd, J.; Bringley, E. J.; Kraft, M. (2021). Journal of Chemical Information and Modeling. OntoChemExp prior art; abstract and later selected methods excerpts recorded.
- **AOA.** [Predicting into unknown space? Estimating the area of applicability of spatial prediction models](https://arxiv.org/abs/2005.07939). Meyer, H.; Pebesma, E. (2020 preprint). Applicability and coverage reference; no IGNIS predictor validated by this citation.
- **PRIME.** [Dynamic Chemical Model for H2/O2 Combustion Developed Through a Community Workflow](https://arxiv.org/abs/1801.10093). Oreluk, J.; Needham, C. D.; Baskaran, S.; Sarathy, S. M.; Burke, M. P.; West, R. H.; Frenklach, M.; Westmoreland, P. R. (2018 preprint). Abstract-level prior art for PrIMe and bound-to-bound data collaboration.
- **COMBUSTION-LLM.** [A unified foundational framework for knowledge injection and evaluation of Large Language Models in Combustion Science](https://arxiv.org/abs/2603.04452). Yang, Z.; Mao, R.; Wu, T.; Li, H.; Zhou, Q.; Chen, Z. X. (2026 preprint). Scientific-AI prior art; external benchmark results were not reproduced.
- **NIST-MFD.** [The NIST Material Flammability Database](https://www.nist.gov/publications/nist-material-flammability-database). NIST publication 956810, IAFSS14. Database/curation prior art; publication page inspected.

## 6. NASA and NIST explanatory sources

- **SRC-NAV-D.** [Smoke Aerosol Measurement Experiment (SAME) overview](https://www.nasa.gov/wp-content/uploads/2025/07/smoke-aerosol-measurement-experiment-same.pdf). NASA. Publication date not recorded. Explanatory or navigation context; recorded access: full text.
- **SRC-R10.** [NIST/NASA Study Shows One Detector Doesn't 'Fit All' for Smoke in Spacecraft (NIST news, May 2018)](https://www.nist.gov/news-events/news/2018/05/nistnasa-study-shows-one-detector-doesnt-fit-all-smoke-spacecraft). NIST. 2018-05. Explanatory or navigation context; recorded access: full text.
- **SRC-NAV-S.** [20 Breakthroughs from 20 Years of Science aboard the International Space Station](https://www.nasa.gov/missions/station/20-breakthroughs-from-20-years-of-science-aboard-the-international-space-station/). NASA Space Station Research Integration Office. 2020-10-26. Explanatory or navigation context; recorded access: full text.
- **SRC-R15.** [Studying Combustion and Fire Safety](https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/). NASA Space Station Research Integration Office. 2023-12-26. Explanatory or navigation context; recorded access: full text.
- **SRC-R31.** [The Flame of Discovery Grows as Saffire Sets New Fires in Space](https://www.nasa.gov/humans-in-space/the-flame-of-discovery-grows-as-saffire-sets-new-fires-in-space/). Nikki Welch (NASA). 2020-05-20. Explanatory or navigation context; recorded access: full text.
- **SRC-NR02.** [Combustion Science (NASA Glenn Research Center physical sciences program)](https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/). NASA Glenn Research Center. Publication date not recorded. Explanatory or navigation context; recorded access: full text.

## 7. Methods, visualization and research-tool references

These references informed statistical definitions, reproducibility and workflow design. Listing a professional solver or platform does not mean IGNIS runs it or has reproduced its validation.

- **NASA-STD-7009B.** [Standard for Models and Simulations](https://standards.nasa.gov/sites/default/files/standards/NASA/B/1/NASA-STD-7009B-Final-3-5-2024.pdf). NASA (2024). Verification, validation, uncertainty and credibility terminology; no compliance certification claimed.
- **FAIR.** [The FAIR Guiding Principles for scientific data management and stewardship](https://doi.org/10.1038/sdata.2016.18). Wilkinson et al. (2016). Scientific Data. Identifiers, metadata, provenance and reuse principles.
- **PROV.** [PROV Overview](https://www.w3.org/TR/prov-overview/). W3C (2013). Entities, activities and derivations.
- **RO-CRATE.** [RO-Crate specification](https://www.researchobject.org/ro-crate/specification). Reproducible research-package design reference; not a claim of RO-Crate conformance.
- **SPEARMAN.** [scipy.stats.spearmanr](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.spearmanr.html). SciPy documentation. Rank association and constant-input behavior; no SciPy p-value used by IGNIS.
- **RANKS.** [scipy.stats.rankdata](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.rankdata.html). SciPy documentation. Average ranks for ties.
- **ECDF.** [scipy.stats.ecdf](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ecdf.html). SciPy documentation. Empirical distribution-function conventions.
- **OKABE-ITO.** [Color Universal Design: how to make figures and presentations that are friendly to Colorblind people](https://jfly.uni-koeln.de/color/). Okabe, M.; Ito, K. Palette and accessible scientific-figure design reference.
- **FLAME-TRACKER.** [Flame Tracker — Manual Tracking](https://github.com/combustionTools/flameTracker/wiki/3.-Manual-Tracking). Video-analysis workflow reference. [Berkeley Fire Research Lab software page](https://firelab.berkeley.edu/software/). No native Flame Tracker adapter is claimed.
- **PARAVIEW.** [Saving Results](https://docs.paraview.org/en/latest/UsersGuide/savingResults.html). ParaView User’s Guide. Saved state, source locations and export workflow reference.
- **IBM-QUANTUM.** [Save jobs](https://quantum.cloud.ibm.com/docs/en/ibm-quantum-compute/save-jobs). IBM Quantum documentation. Job/result record workflow reference; IGNIS does not perform quantum computation.
- **FDS-SMV.** [Fire Dynamics Simulator and Smokeview](https://pages.nist.gov/fds-smv/). NIST/firemodels. Professional fire-modeling and validation-workflow reference; selected pinned manuals/source files are indexed below.
- **CANTERA.** [Cantera reference documentation](https://cantera.org/stable/reference/index.html). Thermochemistry and transport software reference; selected examples were inspected as design context, not integrated as a solver.

## 8. Challenge, comparison and implementation references

Competition and competitor links were used for requirements or prior-art review, not as independent scientific evidence. Provider documentation records implementation/evaluation research; it does not imply an accepted live provider or an endorsement.

- **SRC-CHALLENGE.** [Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data (NASA Space Apps Challenge 2026)](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/). NASA Space Apps Challenge (2026); title and URL as stored in the application registry.
- **RULES.** [Space Apps Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/). Recorded project-planning or prior-art source; see the retrieval manifest for the dated use.
- **RULES.** [Space Apps 2026 home page](https://www.spaceappschallenge.org/2026/). Recorded project-planning or prior-art source; see the retrieval manifest for the dated use.
- **RULES.** [Team Formation Guide](https://www.spaceappschallenge.org/resources/team-formation-guide/). Recorded project-planning or prior-art source; see the retrieval manifest for the dated use.
- **RULES.** [Participant Terms & Conditions](https://www.spaceappschallenge.org/legal/). Recorded project-planning or prior-art source; see the retrieval manifest for the dated use.
- **RULES.** [Awards page](https://www.spaceappschallenge.org/awards/). Recorded project-planning or prior-art source; see the retrieval manifest for the dated use.
- **COMP.** [MicroFire Atlas README](https://github.com/A-K-M-Asifuzzaman/MicroFire-Atlas). Recorded project-planning or prior-art source; see the retrieval manifest for the dated use.
- **COMP.** [Fotia README](https://github.com/AnteurAbderraouf/Fotia). Recorded project-planning or prior-art source; see the retrieval manifest for the dated use.
- **COMP.** [FLARENEXUS README](https://github.com/KhalidHasan03/Flame-in-Freefall). Recorded project-planning or prior-art source; see the retrieval manifest for the dated use.
- **RULES.** [Contact Us page](https://www.spaceappschallenge.org/contact-us/). Recorded project-planning or prior-art source; see the retrieval manifest for the dated use.
- **DOCS.** [Cloudflare BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/). Implementation documentation; context in [SI_PREPARATION.md](web/docs/SI_PREPARATION.md).
- **DOCS.** [unified billing guard](https://developers.cloudflare.com/ai-gateway/features/unified-billing/). Implementation documentation; context in [SI_PREPARATION.md](web/docs/SI_PREPARATION.md).
- **DOCS.** [logging](https://developers.cloudflare.com/ai-gateway/observability/logging/). Implementation documentation; context in [SI_PREPARATION.md](web/docs/SI_PREPARATION.md).
- **DOCS.** [request handling](https://developers.cloudflare.com/ai-gateway/configuration/request-handling/). Implementation documentation; context in [SI_PREPARATION.md](web/docs/SI_PREPARATION.md).
- **DOCS.** [Groq model/rates](https://console.groq.com/docs/model/openai/gpt-oss-120b). Implementation documentation; context in [SI_PREPARATION.md](web/docs/SI_PREPARATION.md).
- **DOCS.** [Groq structured output](https://console.groq.com/docs/structured-outputs). Implementation documentation; context in [SI_PREPARATION.md](web/docs/SI_PREPARATION.md).
- **DOCS.** [OpenRouter routing](https://openrouter.ai/docs/guides/routing/provider-selection). Implementation documentation; context in [SI_PREPARATION.md](web/docs/SI_PREPARATION.md).
- **DOCS.** [Render documentation](https://render.com/docs/deploys#build-command). Implementation documentation; context in [HOSTING_HANDOFF_2026-11-15.md](web/docs/HOSTING_HANDOFF_2026-11-15.md).

## 9. Additional research and design reference index

The following links preserve additional references cited in the earlier research synthesis and specialist notes. They are a link index, not a claim that every full paper, codebase or dataset was reviewed. Access scope and version-specific conclusions remain in the original dated records. Repeated URLs and already-cited NTRS/PSI/DOI/arXiv identities are consolidated. Descriptive labels are used where the notes did not record a complete bibliographic title.

Historical source snapshot: [`6dc8f5e`](https://github.com/GA5413L/IGNIS/tree/6dc8f5e0c1bc9c1202e70b803c9e26f202f9cdd5). No archived document is restored or changed by this bibliography.


### Scientific publications and NASA research

- [Author abstract, revised 29 April 2026](https://arxiv.org/abs/2407.16212v2).
- [Barber et al.: Conformal prediction beyond exchangeability, author version v5](https://arxiv.org/abs/2202.13415v5).
- [Becerra et al., How a quantum computer could accurately solve a hydrogen-air combustion model, 2022](https://pubs.rsc.org/en/content/articlehtml/2022/dd/d2dd00049k).
- [Bhattacharjee, Paolini, Wakai, Takahashi, "Extinction Criteria for Opposed-Flow Flame Spread in a Microgravity Environment", NASA/CP-2003-212376/REV1, printed pp. 201 to 204 (PDF pp. 1 to 4). NTRS 20040053557](https://ntrs.nasa.gov/api/citations/20040053557/downloads/20040053557.pdf).
- [Bolshova et al., Reduced MMA oxidation mechanism, 2021, DOI 10.1134/S0010508221020040](https://www.pleiades.online/abstract/cesw/21/cesw0159_abstract.pdf).
- [Carmignani et al., Quiescent acrylic-sheet flame spread, 2026, DOI 10.1016/j.proci.2026.106484](https://www.sciencedirect.com/science/article/pii/S1540748926004803).
- [Conference report, §§2–4, PDF pp.2–6](https://taskbook.nasaprs.com/oscm/584935338F49F55589FFDEFBA49EF63E6ADF616ED119D8970B5BF77D8F08D1CA.pdf).
- [Daulton et al., NeurIPS 2020, §§2–3](https://papers.neurips.cc/paper_files/paper/2020/hash/6fec24eac8f18ed793f5eaad3dd7977c-Abstract.html).
- [Ferkul et al., "Combustion of Solids in Microgravity: Results from the BASS-II Experiment" (2014 poster). NTRS 20160000593](https://ntrs.nasa.gov/citations/20160000593).
- [Ferkul et al., "Results of Large-Scale Spacecraft Flammability Tests", ICES 2017 presentation. NTRS 20170008805](https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf).
- [Ferkul et al., LUCI, 2025 presentation record](https://ntrs.nasa.gov/citations/20250010653).
- [Ferkul, Kralik and Liao, "Material Flammability at Lunar and Martian Gravity", 57th LPSC (2026). NTRS 20260000646](https://ntrs.nasa.gov/api/citations/20260000646/downloads/Ferkul-Lunar%20and%20Planetary%20Science%20Conference%202026.pdf).
- [Hirsch et al., "Pressure Flammability Thresholds of Selected Aerospace Materials" (2010). NTRS 20100015582](https://ntrs.nasa.gov/citations/20100015582).
- [Hirsch, Juarez, Peyton, Harper and Olson, "Selected Parametric Effects on Materials Flammability Limits" (2011), JSC-CN-23164. NTRS 20110008636](https://ntrs.nasa.gov/api/citations/20110008636/downloads/20110008636.pdf).
- [Hirsch, Williams and Beeson, "Pressure Effects on Oxygen Concentration Flammability Thresholds of Materials for Aerospace Applications" (2006 preprint). NTRS 20070005041](https://ntrs.nasa.gov/api/citations/20070005041/downloads/20070005041.pdf).
- [Kapoor and Narayanan (2023): leakage in machine-learning-based science; Patterns 4, 100804](https://par.nsf.gov/servlets/purl/10513990).
- [Li et al., Effects of Confinement on Flame Spread in Microgravity, ICES-2020-407](https://ntrs.nasa.gov/api/citations/20205004657/downloads/ICES-2020-407-final.pdf).
- [Li et al., PureDocBench v2, September 27, 2026](https://arxiv.org/abs/2605.07492v2).
- [Li, T'ien, Ferkul, Olson and Johnston, "Extinction of Solid Diffusion Flame in Microgravity: Details of Quenching and Blowoff Processes", 40th International Symposium on Combustion. NTRS 20240007628](https://ntrs.nasa.gov/api/citations/20240007628/downloads/GELsymposiumfinalRev1.pdf).
- [Nakaya et al., 2025 journal publication, DOI registered with 2024 suffix](https://doi.org/10.1016/j.combustflame.2024.113828).
- [NASA atmosphere trade-space paper, ICES-2026-324](https://ntrs.nasa.gov/citations/20260002050).
- [NASA NTRS 20150021283: fire-modeling research reference](https://ntrs.nasa.gov/citations/20150021283).
- [NASA NTRS record 20140017780](https://ntrs.nasa.gov/api/citations/20140017780/downloads/20140017780.pdf).
- [NASA NTRS record 20160001023](https://ntrs.nasa.gov/api/citations/20160001023/downloads/20160001023.pdf).
- [NASA NTRS record 20160010073](https://ntrs.nasa.gov/api/citations/20160010073/downloads/20160010073.pdf).
- [NASA NTRS record 20210022402](https://ntrs.nasa.gov/api/citations/20210022402/downloads/217-_GollnerMichaelJ.pdf).
- [NASA NTRS record 20240015018](https://ntrs.nasa.gov/api/citations/20240015018/downloads/ASGSR%20Poster%202024.pdf).
- [NASA Task Book: Flame Spread and Extinction Over Solid Materials, FY2026/FY2025](https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=AB7D53A58994730B8E16F73F5BF545F7&action=public_query_taskbook_content).
- [NASA Task Book: RTDFS final phase, FY2026/FY2025](https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=2413F182B9F30E0CDB221036094EFF0F&action=public_query_taskbook_content).
- [NASA TaskBook research record led by Ya-Ting Liao](https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=31FF2895CF11A3D63C9B8986DB12A22A&action=public_query_taskbook_content).
- [Norcross et al., "Evidence Report: Risk of Hypobaric Hypoxia from the Exploration Atmosphere" (2015), JSC-CN-34806. NTRS 20150021491](https://ntrs.nasa.gov/api/citations/20150021491/downloads/20150021491.pdf).
- [Olson and Ferkul, "Evaluating Material Flammability in Microgravity and Martian Gravity Compared to the NASA Standard Normal Gravity Test" (2012). NTRS 20130010991](https://ntrs.nasa.gov/api/citations/20130010991/downloads/20130010991.pdf).
- [Olson, Beeson, Fernandez-Pello, "Applying Flammability Limit Probabilities and the Normoxic Upward Limiting Pressure Concept to NASA STD-6001 Test 1", ICES-2014-179. NTRS 20150004099](https://ntrs.nasa.gov/api/citations/20150004099/downloads/20150004099.pdf).
- [Olson, Ruff and Miller, "Microgravity Flame Spread in Exploration Atmospheres: Pressure, Oxygen, and Velocity Effects on Opposed and Concurrent Flame Spread", NASA/TM-2008-215260. NTRS 20080034883](https://ntrs.nasa.gov/api/citations/20080034883/downloads/20080034883.pdf).
- [OpenScholar](https://arxiv.org/html/2411.14199v1).
- [OpenScholar, Nature, 2026](https://www.nature.com/articles/s41586-025-10072-4).
- [Ouyang et al., OmniDocBench, CVPR 2025](https://openaccess.thecvf.com/content/CVPR2025/html/Ouyang_OmniDocBench_Benchmarking_Diverse_PDF_Document_Parsing_with_Comprehensive_Annotations_CVPR_2025_paper.html).
- [PaperQA2](https://arxiv.org/html/2409.13740v2).
- [Particle and Smoke Detection on ISS for Next Generation Smoke Detectors (abstract page + slides, ISDC 2007). NTRS 20070031686](https://ntrs.nasa.gov/api/citations/20070031686/downloads/20070031686.pdf).
- [Predicting Material Flammability in Partial Gravity Using Microgravity and Ground Data](https://taskbook.nasaprs.com/tbp/index.cfm?action=public_query_taskbook_content&TASKID=99BEAE9E7F5F1420D1506AD0FE9C1A6D).
- [Publication 10.1016/j.combustflame.2008.05.023](https://doi.org/10.1016/j.combustflame.2008.05.023).
- [Publication 10.1016/j.combustflame.2024.113880](https://doi.org/10.1016/j.combustflame.2024.113880).
- [Publication 10.2322/tastj.16.28](https://doi.org/10.2322/tastj.16.28).
- [Publisher abstract](https://www.sciencedirect.com/science/article/pii/S0888613X04001124).
- [Recent Research on Flames of Gaseous Fuel Aboard the International Space Station (D. P. Stocker, JASMAC paper, 2021). NTRS 20210021781](https://ntrs.nasa.gov/api/citations/20210021781/downloads/JASMAC%20ACME%20paper%2020210921.pdf).
- [Schumacher et al., 2025, GMD 18:10185–10202](https://gmd.copernicus.org/articles/18/10185/2025/).
- [Sharma et al., 2026 modeling record](https://ntrs.nasa.gov/citations/20260000641).
- [Simonsohn, Simmons and Nelson, 2020, specification-curve analysis](https://doi.org/10.1038/s41562-020-0912-z).
- [Solid Inflammability Boundary at Low-Speed (SIBAL)](https://ntrs.nasa.gov/api/citations/20010073996/downloads/20010073996.pdf).
- [SPICE: Smoke Point In Co-flow Experiment (investigation fact sheet, last update 02/17/2009). NTRS 20090014827](https://ntrs.nasa.gov/api/citations/20090014827/downloads/20090014827.pdf).
- [T'ien et al., Effect of sub-surface solid heating, 2025, DOI 10.1016/j.combustflame.2025.114244](https://commons.case.edu/facultyworks/1290/).
- [Thomsen et al., PMMA mixed-convection study](https://ntrs.nasa.gov/citations/20200000557).
- [Thomsen, Carmignani, Fernandez-Pello, Fereres, Urban, Ruff, "Determining the Cause of Reduced Concurrent Flame Spread over Thin Solid Fuels in Low Pressure and Low Gravity", ICES-2021-102. NTRS 20210017787](https://ntrs.nasa.gov/api/citations/20210017787/downloads/ICES-2021-102_Final.pdf).
- [Unraveling the thermolysis mechanisms of methyl methacrylate, 2026, DOI 10.1016/j.jaap.2026.107661](https://www.sciencedirect.com/science/article/pii/S0165237026000689).
- [Upward and Downward Flame Spreading and Extinction in Partial Gravity Environments](https://ntrs.nasa.gov/api/citations/20040053567/downloads/20040053567.pdf).
- [Urban et al., "Fire Safety Implications of Preliminary Results from Saffire IV and V Experiments on Large Scale Spacecraft Fires", ICES-2021-266. NTRS 20210011521](https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf).
- [Urban et al., "Solid Fuel Ignition Testing for Lunar Applications, Theory and Experimental Results", ICES-2025-392. NTRS 20250002114](https://ntrs.nasa.gov/api/citations/20250002114/downloads/ICES_2025-392-correctedcaptions.pdf).
- [www.sciencedirect.com — S2666352X25000925](https://www.sciencedirect.com/science/article/pii/S2666352X25000925).
- [Xiao et al., TableParseMap/DEC, arXiv:2608.09842v1, August 2026](https://arxiv.org/abs/2608.09842).
- [Yuan et al., ConfRAG, ACL 2026](https://aclanthology.org/2026.acl-long.11/).

### Methods, standards, data and software

- [Authors' institution bibliography](https://publications.systems.ethz.ch/author/109/Stephan%20B%C3%B6rzs%C3%B6nyi).
- [Brynjarsdottir and O’Hagan (2014): Learning about physical parameters: the importance of model discrepancy, author manuscript](https://www.tonyohagan.co.uk/academic/pdf/simmach.pdf).
- [Börzsönyi, Kossmann and Stocker, The Skyline Operator, 2001](https://cse.hkust.edu.hk/~raywong/reading/paper/skyline.pdf).
- [caching documentation](https://docs.streamlit.io/develop/concepts/architecture/caching).
- [Cantera](https://cantera.org/).
- [Cantera governing equations](https://cantera.org/stable/reference/onedim/governing-equations.html).
- [CFAST-overview](https://github.com/firemodels/cfast/blob/b43e74e0f43c704582c5782f5446597ce729a07f/Manuals/CFAST_Validation_Guide/Overview_Chapter.tex).
- [CFAST-tech](https://github.com/firemodels/cfast/releases/download/CFAST-7.7.7/CFAST_Tech_Ref.pdf).
- [CFAST-verification](https://github.com/firemodels/cfast/blob/b43e74e0f43c704582c5782f5446597ce729a07f/Manuals/CFAST_Validation_Guide/Verification_Chapter.tex).
- [CT-convergence](https://github.com/Cantera/cantera/blob/4a8358eb80cfeb50474386b5f9ec0b3a83519889/samples/python/onedim/flame_speed_convergence_analysis.py).
- [CT-mechanism](https://github.com/Cantera/cantera/blob/4a8358eb80cfeb50474386b5f9ec0b3a83519889/data/gri30.yaml).
- [CT-replay](https://github.com/Cantera/cantera/blob/4a8358eb80cfeb50474386b5f9ec0b3a83519889/samples/python/onedim/flame_initial_guess.py).
- [CT-sensitivity](https://github.com/Cantera/cantera/blob/4a8358eb80cfeb50474386b5f9ec0b3a83519889/samples/python/onedim/flamespeed_sensitivity.py).
- [current characterization program](https://www.nist.gov/programs-projects/material-flammability-characterization).
- [EXP-channels](https://github.com/firemodels/exp/blob/704e0d91f15088ae41c6a30a662a7524bf5ff4e8/NIST_NRC/NIST_NRC_Test_01_file_1.csv).
- [EXP-layer](https://github.com/firemodels/exp/blob/704e0d91f15088ae41c6a30a662a7524bf5ff4e8/NIST_NRC/NIST_NRC_Test_01_layer.csv).
- [EXP-root](https://github.com/firemodels/exp/tree/704e0d91f15088ae41c6a30a662a7524bf5ff4e8/NIST_NRC).
- [FDS 6.11.1 validation-guide source](https://raw.githubusercontent.com/firemodels/fds/FDS-6.11.1/Manuals/FDS_Validation_Guide/FDS_Validation_Guide.tex).
- [FDS-case](https://github.com/firemodels/fds/blob/ff928dbf68a2623ced3a007be75391c6dc6c9f90/Validation/NIST_NRC/FDS_Input_Files/NIST_NRC_01.fds).
- [FDS-config](https://github.com/firemodels/fds/releases/download/FDS-6.11.1/FDS_Config_Management_Plan.pdf).
- [FDS-error](https://github.com/firemodels/fds/blob/ff928dbf68a2623ced3a007be75391c6dc6c9f90/Manuals/FDS_Validation_Guide/Error_Chapter.tex).
- [FDS-experiments](https://github.com/firemodels/fds/blob/ff928dbf68a2623ced3a007be75391c6dc6c9f90/Manuals/FDS_Validation_Guide/Experiment_Chapter.tex#L1847).
- [FDS-manuals](https://pages.nist.gov/fds-smv/manuals.html).
- [FDS-overview](https://github.com/firemodels/fds/blob/ff928dbf68a2623ced3a007be75391c6dc6c9f90/Manuals/FDS_Validation_Guide/Overview_Chapter.tex).
- [Green, Karvounarakis and Tannen, 2007, Provenance Semirings](https://www.cs.ucdavis.edu/~green/papers/pods07.pdf).
- [humans-in-space.jaxa.jp — 000807.html](https://humans-in-space.jaxa.jp/en/biz-lab/experiment/theme/detail/000807.html).
- [JCGM 100:2008](https://www.bipm.org/documents/20126/2071204/JCGM1002008E.pdf/cb0ef43f-baa5-11cf-3f85-4dcd86f77bd6).
- [license statement](https://www.nist.gov/open/license).
- [link.springer.com — s10694-021-01121-1](https://link.springer.com/article/10.1007/s10694-021-01121-1).
- [Manuals](https://pages.nist.gov/fds/manuals.html).
- [NASA investigator account of cool flames](https://blogs.nasa.gov/ISS_Science_Blog/2013/11/25/cool-flames-on-the-international-space-station-an-anatomy-of-discovery/).
- [NASA MAPTIS](https://maptis.nasa.gov/register).
- [NASA PSI update](https://science.data.nasa.gov/features-events/physical-sciences-informatics-updates).
- [NASA, Flammability of Materials on the Moon](https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/flammability-of-materials-on-the-moon-fm2/).
- [NASA-HDBK-7009B handbook approved February 3, 2026](https://standards.nasa.gov/system/files/tmp/NASA-HDBK-7009B_Final%2002-03-2026.pdf).
- [NASA-STD-7009B](https://standards.nasa.gov/node/263).
- [NASA-STD-7009B](https://standards.nasa.gov/standard/nasa/nasa-std-7009).
- [NIST Uncertainty Machine](https://uncertainty.nist.gov/).
- [NIST's empirical-CDF description](https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ecdfplot.htm).
- [NIST-project](https://www.nist.gov/programs-projects/advanced-fire-modeling).
- [NIST-published federal catalog metadata](https://catalog.data.gov/dataset/data-on-smoke-alarm-performance-a-compilation-to-nist-tn-1947).
- [Official calibration documentation](https://scikit-learn.org/stable/modules/calibration.html).
- [official Connect guidance](https://github.com/nasa/spaceapps/discussions/1769).
- [Official grouped-CV documentation](https://scikit-learn.org/stable/modules/cross_validation.html#cross-validation-iterators-for-grouped-data).
- [Official scikit-learn cross-validation guidance](https://scikit-learn.org/stable/modules/cross_validation.html).
- [Official secrets guidance](https://docs.streamlit.io/develop/concepts/connections/secrets-management).
- [ParaView](https://www.paraview.org/about/).
- [Prediction of Limiting Oxygen Concentration of Thin Materials in Microgravity](https://www.jstage.jst.go.jp/article/tastj/16/1/16_28/_pdf).
- [scikit-survival competing risks](https://scikit-survival.readthedocs.io/en/stable/user_guide/competing-risks.html).
- [spinoff.nasa.gov — 9407](https://spinoff.nasa.gov/node/9407).
- [spinoff.nasa.gov — 9582](https://spinoff.nasa.gov/node/9582).
- [spinoff.nasa.gov — 9918](https://spinoff.nasa.gov/node/9918).
- [uncertainty chapter](https://raw.githubusercontent.com/firemodels/fds/FDS-6.11.1/Manuals/FDS_Validation_Guide/Error_Chapter.tex).
- [validation overview](https://raw.githubusercontent.com/firemodels/fds/FDS-6.11.1/Manuals/FDS_Validation_Guide/Overview_Chapter.tex).
- [www.jstage.jst.go.jp — _pdf](https://www.jstage.jst.go.jp/article/ijmsa/32/4/32_320403/_pdf).
- [www.jstage.jst.go.jp — _pdf](https://www.jstage.jst.go.jp/article/ijmsa/32/4/32_320405/_pdf).
- [www.nasa.gov — flammability-limits-at-reduced-g-experiment-flare](https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/flammability-limits-at-reduced-g-experiment-flare/).

### Prior-art projects and competition context

- [0xdevabir/runtime-terrors](https://github.com/0xdevabir/runtime-terrors).
- [A-K-M-Asifuzzaman/MicroFire-V2](https://github.com/A-K-M-Asifuzzaman/MicroFire-V2).
- [ADAI-ALEX/margin](https://github.com/ADAI-ALEX/margin).
- [Altamashazam7/FireGuard](https://github.com/Altamashazam7/FireGuard).
- [altugrakay-commits/flame-in-freefall](https://github.com/altugrakay-commits/flame-in-freefall).
- [Anurag-k-007/flames-in-freefall](https://github.com/Anurag-k-007/flames-in-freefall).
- [astro-sweepers.vercel.app — home](https://astro-sweepers.vercel.app/home).
- [astrot777/entropy-flame](https://github.com/astrot777/entropy-flame).
- [Challenge mode](https://microfire-atlas.vercel.app/challenge).
- [chxhyxn/SpacerWalker](https://github.com/chxhyxn/SpacerWalker).
- [deployed evidence module](https://itzjk.github.io/vesta/js/world/act-evidence.js).
- [DiyonGamage/firebreak](https://github.com/DiyonGamage/firebreak).
- [eres0045/spica-firelab](https://github.com/eres0045/spica-firelab).
- [evidence-gain JSON](https://microfire-atlas.vercel.app/downloads/evidence-gain.json).
- [G3hamza/astrofire](https://github.com/G3hamza/astrofire).
- [gabrielchayb/42-quake-heroes](https://github.com/gabrielchayb/42-quake-heroes).
- [HALO](https://halo-fire-brief.vercel.app/).
- [harshita713lab/NASA-Hackathon-flameguard](https://github.com/harshita713lab/NASA-Hackathon-flameguard).
- [Hekimovraiz/FIRE-X](https://github.com/Hekimovraiz/FIRE-X).
- [igeorgegabriel/Nasa_Space_Challenge](https://github.com/igeorgegabriel/Nasa_Space_Challenge).
- [itzjk/vesta](https://github.com/itzjk/vesta).
- [Joshua-Sotomayor/NASA-flame-in-freefal](https://github.com/Joshua-Sotomayor/NASA-flame-in-freefal).
- [Kaszioq/fire-readiness](https://github.com/Kaszioq/fire-readiness).
- [Kenyalang](https://flame-in-freefall-three.vercel.app/).
- [Laythraad/mors-aegis-flame-in-freefall-2026](https://github.com/Laythraad/mors-aegis-flame-in-freefall-2026).
- [Live scenario](https://flamebound-flame-in-freefall.vercel.app/?pillar=flammability&o2=34&kpa=56.5&flow=20&dir=concurrent&mat=pmma&g=0).
- [live URL](https://fire-x.onrender.com/).
- [Lucyyngceo/pyrion](https://github.com/Lucyyngceo/pyrion).
- [MaanavKrishna/HALO-Habitat-Assessment-from-Low-Gravity-Observations](https://github.com/MaanavKrishna/HALO-Habitat-Assessment-from-Low-Gravity-Observations).
- [maitriramkumar08-ui/nasa-hackthon-flames-in-freefall-](https://github.com/maitriramkumar08-ui/nasa-hackthon-flames-in-freefall-).
- [MARGIN](https://margin.adai.systems/).
- [masudurrahman-ds/prometheus-microgravity](https://github.com/masudurrahman-ds/prometheus-microgravity).
- [MicroFire-V2](https://microfire-v2-preview.vercel.app/).
- [Muneer-ul-hassan/flame-in-freefall](https://github.com/Muneer-ul-hassan/flame-in-freefall).
- [nasa-hackathon-2024-nine.vercel.app](https://nasa-hackathon-2024-nine.vercel.app/).
- [NASA: 2023 Space Apps global winners](https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners/).
- [NASA: 2024 Space Apps global winners](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/).
- [NASA: 2025 Space Apps global winners](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/).
- [Niki824/nasa-flame-in-freefall](https://github.com/Niki824/nasa-flame-in-freefall).
- [nohakhalednk1/flame-in-freefall](https://github.com/nohakhalednk1/flame-in-freefall).
- [Official indexed team record](https://www.spaceappschallenge.org/2025/find-a-team/jakdang-moui/?tab=details).
- [original project link](https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/gaamaramma/?tab=project).
- [prattaybanik03/flamebound-flame-in-freefall](https://github.com/prattaybanik03/flamebound-flame-in-freefall).
- [PyroTensor/EMBER](https://github.com/PyroTensor/EMBER).
- [sayeedalsahab12517-collab/flame-in-freefall](https://github.com/sayeedalsahab12517-collab/flame-in-freefall).
- [Seoul organizer's results](https://nasaspaceappskr.org/2025/en/awardees/).
- [SoyebuzamanNaim/ALPINE_IBEX](https://github.com/SoyebuzamanNaim/ALPINE_IBEX).
- [Space Apps judging and awards guide (recorded link; access limitations in original review)](https://www.spaceappschallenge.org/resources/judging-awards-guide/).
- [spacebee-technologies/Moonquakes-SpaceApps2023](https://github.com/spacebee-technologies/Moonquakes-SpaceApps2023).
- [spacegenes-plus.framer.website](https://spacegenes-plus.framer.website/).
- [SPICA homepage](https://eres0045.github.io/spica-firelab/).
- [Supermatrix-AI/aegis-mug-spaceapps-2026](https://github.com/Supermatrix-AI/aegis-mug-spaceapps-2026).
- [team retrospective](https://blog.devstory.co.kr/en/post/nasa-space-app-challenge/).
- [team-authored 2025 conference abstract](https://meteoroids2025.gfo.rocks/abstracts_received.html).
- [vaidehi-snk/fireline-atlas](https://github.com/vaidehi-snk/fireline-atlas).
- [VESTA homepage](https://itzjk.github.io/vesta/).
- [VESTA static API manifest](https://itzjk.github.io/vesta/api/v1/index.json).
- [WingManOO7/ignis-lab](https://github.com/WingManOO7/ignis-lab).
- [WitherStormOS/AstroLab-NASA-2026](https://github.com/WitherStormOS/AstroLab-NASA-2026).
- [yousufaways-23/zero-flare-lab](https://github.com/yousufaways-23/zero-flare-lab).
- [z1xO/flame-in-freefall](https://github.com/z1xO/flame-in-freefall).
- [ZERO FLARE homepage](https://zero-flare-lab.yousuf-aways.workers.dev/).
- [ZOGWORK/flamefall-analytics](https://github.com/ZOGWORK/flamefall-analytics).
- [Zucloak/Ignimetheus](https://github.com/Zucloak/Ignimetheus).

## 10. Rights and citation records

Source rights remain attached to the original record or publication. Linking a source does not grant redistribution permission.

- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): recorded for the Link article and the supplied Ries publisher article.
- [CC0-1.0](https://spdx.org/licenses/CC0-1.0.html): as declared by individual captured PSI records.
- [Elsevier user license](https://www.elsevier.com/open-access/userlicense/1.0/): recorded on the supplied Liveretou accepted manuscript.
- [NIST license statement](https://www.nist.gov/open/license): applies to the linked NIST data with its stated conditions.
- [Source rights](web/docs/SOURCE_RIGHTS.md) and [rights manifest](manifests/rights_and_attribution.csv): local attribution and reuse record.

The supplied dissertation and restricted PDFs are cited, not republished. Citation-metadata matches establish bibliographic identity only; they do not verify scientific claims. External URLs were consolidated from existing records for this file, without a fresh availability check.
