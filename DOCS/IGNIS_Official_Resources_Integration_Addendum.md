# IGNIS — Official challenge resources: acquisition and integration addendum

**Date:** 14 November 2026  
**Companion to:** `IGNIS_MASTER_SOLUTION_AND_BUILD_SPEC_v1.0.md`  
**Scope:** A targeted resource-integration note. The original master is unchanged. This note does not authorize application development, spending, account creation, public release, bulk downloads or communication; it does not pass scientific or runtime gates.

## 1. Decision

Use the challenge's official resources as a structured entry point into the existing evidence bank. Prioritize PSI investigation records and legitimately acquired artifacts; use the NASA scientific guide and programme pages for context and discovery; retain accident histories and technology-transfer stories in separate contextual roles.

The product remains the SI-powered Explore / Analysis fire-safety workspace. These resources strengthen its data foundation and presentation. They do not justify restarting the architecture, claiming numerical completeness, or training a universal predictor.

**Source-role distinction:** being an official NASA resource establishes institutional origin, not that every statement is an experimental measurement or every page is current. An objective is not an observed outcome. A historical incident is not an experimental burn. A technology-transfer example is not validation of IGNIS.

## 2. What was checked in this pass

The exact user-supplied NASA programme, researcher-guide, Apollo, Mir and Spinoff URLs were opened. The guide's 56-page PDF was located; its introductory text and contents were inspected, and PDF pages 5 and 7 were visually inspected. This is not a full scientific audit of all 56 pages. Several other screenshot attempts failed.

The PSI search URL failed to render in this browser. An individual Saffire-I landing page also returned no readable body, although an official indexed result exposed metadata. No experimental dataset, table CSV, video or synchronized sensor series was downloaded in this pass. The YouTube URL did not load; an ISS National Laboratory page confirms the video's title and 2018 date. No viewing or transcript audit is claimed.

The current local master was reopened to inspect its acquisition, source, investigation and architecture contracts. This was not a rereview of every line or a new TypeScript/application test. No user repository was accessed or changed.

## 3. Resource inventory and proposed use

The ten logical resources below include a single PSI portal entry with two search URL variants. The roles and build priorities are design recommendations, not additional NASA requirements.

| ID | Resource | Checked scope | Proposed role in IGNIS |
|---|---|---|---|
| NR01 | PSI combustion repository | Search rendering failed; official documentation and indexed investigation metadata inspected | Primary discovery and acquisition route; preserve actual access state |
| NR02 | NASA Glenn Combustion Science | Programme overview, experiment list and facility descriptions inspected | Investigation descriptions and source discovery; distinguish objectives, archived text and results |
| NR03 | NASA ScienceCasts video | Exact video not accessible; ISS National Laboratory description inspected | Optional learning link; not a numerical evidence source |
| NR04 | Researcher's Guide to Combustion Science | October 2015 edition, 56-page PDF; introduction/contents and selected page images inspected | Foundational glossary, apparatus context and bibliography leads; date all historical/planned statements |
| NR05 | Apollo 1 | NASA accident/lessons page inspected | Context for the significance of fire-safety research; not a microgravity test row |
| NR06 | Apollo 13 | NASA accident/lessons page inspected | Systems-safety context; not a habitat-combustion prediction dataset |
| NR07 | Mir fire account | NASA incident description inspected | Context for detection, smoke, response and escape; not a controlled intervention study |
| NR08 | Fireman's Air Tanks | NASA Spinoff page inspected; original publication 1976 | Optional historical terrestrial-impact example |
| NR09 | Fire Detector | NASA Spinoff page inspected; original publication 1978 | Optional historical detector-transfer example; not current universal detector performance |
| NR10 | New Technology for the Fire Attire | NASA Spinoff page inspected; original publication 1982 | Optional historical materials/protection-transfer example |

NR02 names the principal combustion families and hardware; its page mixes project objectives with dated programme descriptions. NR04 organizes droplets, gaseous flames, solid fuels, fire safety, lessons, facilities and acceleration context. Its October 2015 edition and the webpage's July 2016 date are distinct. Neither is an authoritative inventory of everything acquired or completed in 2026. [NR02, NR04]

NR05/NR06 explicitly contain accident-investigation and lessons sections; NR07 describes the Mir incident. Their relevance does not license mixing accidents with experimental rate records. [NR05–NR07]

## 4. PSI access: repair the inference, not the historical log

NASA describes PSI datasets as publicly available and documents a 2024 redesign with persistent identifiers. The submission portal is an account-based path for researchers submitting data. These facts do not prove every download currently succeeds, but they make a blanket statement that all data require a login unjustified. [NRA1, NRA2]

Preserve earlier endpoint-specific 403 errors with their dates and URLs. For new work, inspect the current public investigation page and its documented downloads first. A shell, cache failure or old API rejection is an access observation, not a statement that the dataset does not exist. Do not bypass controls or invent replacement endpoints.

The newer PSI database guide describes investigation IDs/DOIs, distinct objective/hypothesis sections, downloadable experiment tables, linked hardware/publications, file categories and version history. Raw and analysed data are separated, including gravity context. It also describes a larger-download email workflow. [NRA3]

The AWS open-data registry is a possible documented route, but its listed bucket resource description specifically names DSI and OASIS. Do not assume this establishes BASS, SAME or Saffire coverage, or copy its rights statement onto unrelated articles. No bucket enumeration was performed. [NRA5]

## 5. Acquisition work order for the coding/research agent

This is a proposed work order subject to the existing permissions, not a claim it has been executed.

1. Build a small acquisition manifest for the named challenge families: BASS, BASS-II, Saffire-I/II/III, SAME, SAME-R and FLEX. Retain Saffire V/VI as the already researched advanced path. Add a family-level navigation relationship only when its source supports it.
2. Open each actual current PSI investigation page. Capture the official accession, title, citation/DOI, version, available experiment table, documentation, related publications and file inventory. Do not infer identifiers from sequence numbers or borrow unverified competitor mappings.
3. Acquire the smallest useful public files first: experiment tables, README files, variable dictionaries, processing notes and selected analysed outputs. Do not bulk-download raw videos merely to increase the apparent data volume.
4. Record filename, exact acquisition URL, byte count, local checksum, source version, rights and review scope. An unavailable item stays unavailable; do not populate its checksum from an expected value.
5. Preserve source bytes. Create normalized records separately, carrying original values, units, missing-value conventions, measurements and row-level lineage. A dash is not zero and a table row is not automatically an independent experiment.
6. Map each finding to the specific source and inspected content. Use official overview/guide statements as appropriately dated descriptions or objectives. Follow their bibliography to primary evidence for detailed numerical claims.
7. Admit reviewed records through the existing master contract. Update actual catalogue coverage and rerun the affected deterministic/regression checks. A metadata expansion must not silently alter an existing physical-model history.
8. Produce a concise acquired/not-acquired report. Stop at the finite source subset needed for a complete working path; keep optional historical and Earth-impact additions off the critical path.

The design target is a visible chain:

`official PSI investigation → specific source/artifact/version → reviewed finding or observation → qualified assessment → cited export`.

A NASA paper can still supply legitimate findings or processed measurements when raw PSI files are not acquired. Label that route honestly. Do not imply raw-data analysis merely because the paper discusses a PSI investigation. Neither the resource list nor this note requires automatic numerical coverage of every family.

## 6. Minimal manifest delta; no architecture migration

Add a resource-purpose field to the acquisition manifest, not a new graph/database subsystem. Suggested values are `dataset_portal`, `investigation_metadata`, `experimental_artifact`, `scientific_reference`, `historical_case`, `technology_transfer`, and `educational_media`.

Preserve the master's separate `Source.access`, review level, publication/retrieval dates and `Investigation.coverage`. Purpose is not an evidence-confidence rating. Use existing assertion kinds for objectives, hypotheses, observed results, model results and derivations. A PSI objective remains an objective even when downloaded beside a numerical table.

Suggested manifest fields:

```text
resource_id, resource_role, supplied_url, resolved_url,
source_title, edition_or_publication_date, checked_at,
access_observation, official_investigation_id, investigation_doi,
file_inventory_inspected, selected_artifacts_acquired,
source_review_scope, numerical_use_limit, rights_status,
next_bounded_action
```

Use null/unknown where not established. Do not invent a reviewed DOI or export a temporary authorized download URL as a durable public identifier.

## 7. UI and retrieval policy

Keep the same workspace. Investigations show actual data depth and a source link. An optional Learn/context area can hold the educational guide, accident lessons and terrestrial examples. That context should not outrank the requested experiment merely because its narrative is compelling.

In a numerical comparison request, a historical incident or Spinoff story cannot supply a missing flammability value. In an impact/background question, that same resource may be appropriate context. Do not exclude it globally; constrain its use.

Do not offer the YouTube link as the team's project demonstration. It is background material, not an IGNIS demonstration. Any image or clip reuse needs its applicable credit/rights review; linking an official page does not create blanket rights to re-edit all media on it.

The publication dates 1976, 1978 and 1982 belong next to the Spinoff examples. They support historical technology-transfer context, not a claim about today's market or detector standards. [NR08–NR10]

## 8. Additional proposed checks (all NOT RUN)

| ID | Input or event | Required behaviour |
|---|---|---|
| OR-01 | A PSI search page fails to render | Keep access unresolved; do not mark all PSI datasets unavailable or infer mandatory login |
| OR-02 | A submission-login page is found | Do not treat it as proof that public browsing uses the same authorization path |
| OR-03 | Guide text describes an experiment as planned in 2015 | Preserve historical tense; verify later status independently |
| OR-04 | An investigation objective and a measured finding coexist | Keep their evidence roles distinct in summary and export |
| OR-05 | User requests a numerical flame comparison; Apollo/Mir material is retrieved | Offer contextual relevance only; no fabricated experimental row or rate |
| OR-06 | A Spinoff page is used in an impact narrative | Preserve historical date and avoid present-day performance claims |
| OR-07 | PSI metadata was read but no file acquired | Show metadata-level access, not raw-data analysis |
| OR-08 | An actual experiment table is acquired | Bind accession/citation/version and inspected artifact to the records and export |
| OR-09 | Current source differs from the 2015 guide | Preserve versions and resolve the exact claim, rather than silently merging them |
| OR-10 | A dataset covers related papers/events | Preserve shared lineage; do not count papers as independent experiments |

## 9. What remains unchanged or unverified

T1–T4, AC04, physical applicability domains, original source transcriptions and frozen runtime outcomes remain unchanged. Neither failed Groq configuration becomes accepted. No account, bulk-download job, paid inference, physical replay, user test or application test occurred.

This resource check does not resolve preparation reuse, AI-origin interpretation, or any organizer ruling. It does not require a new product proposal. The next useful step is the small PSI file inventory and acquisition described above, followed by the existing source-to-result vertical slice.

## References and exact source locations

The following URLs are acquisition references. Access observations above are part of their meaning.

- **NR01:** https://psi.nasa.gov/physci/repo/search?q=combustion  
  Investigation-filter variant: https://psi.nasa.gov/physci/repo/search?q=combustion&data_source=psi&data_type=investigation
- **NR02:** https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/ — Overview, experiment sections, facilities.
- **NR03:** https://www.youtube.com/watch?v=W1oXykoz9zg — exact video could not be opened. Supporting description: https://issnationallab.org/iss360/nasa-sciencecasts-the-power-of-studying-combustion-on-the-iss/ — dated March 14, 2018; not a transcript audit.
- **NR04:** https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/ — identifies October 2015 edition; webpage July 6, 2016. PDF: https://www.nasa.gov/wp-content/uploads/2016/05/np-2015-10-034-jsc_combustion_in_reduced_gravity-iss-mini-book-011116-508.pdf — introduction and contents, printed pp. 3, 6–7; 56 PDF pages.
- **NR05:** https://sma.nasa.gov/sma-disciplines/accllp/apollo-1 — investigation/lessons sections.
- **NR06:** https://sma.nasa.gov/sma-disciplines/accllp/apollo-13 — investigation/lessons sections; incidental repeated navigation text not used.
- **NR07:** https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/ — incident and subsequent lessons account.
- **NR08:** https://spinoff.nasa.gov/node/9582 — original publication 1976.
- **NR09:** https://spinoff.nasa.gov/node/9407 — original publication 1978.
- **NR10:** https://spinoff.nasa.gov/node/9918 — original publication 1982.
- **NRA1:** https://science.data.nasa.gov/features-events/physical-sciences-informatics-updates — account of the 2024 redesign, data availability and persistent identifiers.
- **NRA2:** https://psi.nasa.gov/physci/submission-sso-login.html — submission portal's purpose and account flow.
- **NRA3:** https://assets.science.nasa.gov/content/dam/science/bps/bps-general/bps-data_osdr_psi/Complete_PSI_Database_Guide.pdf — Navigating an Investigation Page; Experiment Table; Data Files and Documents; Version History. Text inspected; screenshot retrieval failed.
- **NRA4:** https://www.nasa.gov/physical-sciences-informatics-psi/psi-investigations-by-research-area/ — Combustion Science inventory; not proof of per-file retrieval.
- **NRA5:** https://registry.opendata.aws/nasa-psi/ — published bucket description names DSI/OASIS; no combustion bucket coverage verified.

**Checks in this session:** exact-link inspection and role mapping; selected official PDF text and page-image inspection; resource-count and document checks. These do not establish acquisition of the experimental files or independent scientific validation.
