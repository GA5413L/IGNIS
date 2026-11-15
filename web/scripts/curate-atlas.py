#!/usr/bin/env python3
"""Build the audited PSI atlas and single-version Saffire condition catalog.

Offline, standard-library-only, deterministic. Run from any directory:
  python -I web/scripts/curate-atlas.py
  python -I web/scripts/curate-atlas.py --check

The condition constants below are a manual transcription of the visually
inspected 2026 Table 1, PDF page 6. Hash verification does not validate a
transcription scientifically; the page inspection and scope are documented in
web/docs/ATLAS_DATA_PROVENANCE.md. No physical prediction is calculated.
"""

from __future__ import annotations

import argparse
from collections import Counter
import csv
from decimal import Decimal
import hashlib
import io
import json
from pathlib import Path
import posixpath
import sys
import xml.etree.ElementTree as ET
import zipfile


ROOT = Path(__file__).resolve().parents[2]
PSI_DIR = "_raw/psi_2026-11-15"
DETECTION_DIR = "_raw/lab_completion_2026-11-15/detection"
PAPER_DIR = "_raw/lab_2026-11-15/detection"
WORKBOOK = f"{DETECTION_DIR}/PSI-101_Analyzed Data_SAME, SAME-R_Results.xlsx"
PAPER = f"{PAPER_DIR}/SAFF2026_20260001992.pdf"
PAPER_RECORD = f"{PAPER_DIR}/SAFF2026_record.json"
EARLIER_PAPER = "_raw/event_2026-11-14/S-CAL_ICES-2024-365.pdf"
SOURCE_ID = "SRC-SAFFIRE-2026-T1"
SNAPSHOT = "2026-11-15"

# Trust roots are fixed acquisition/audit bytes. The PSI acquisition log pins
# each of the 24 metadata records and 22 CSVs; they are all checked separately.
PINNED_INPUTS = {
    f"{PSI_DIR}/acquisition_log.json": "58320d5155a3fc80233255e2db7b7c7d7afa3719632cc9da174971530797bb5e",
    f"{PSI_DIR}/tables_manifest.json": "c4686f17d01e76201555f56fadc49408b9a6d5999a86f3ee903f7e357b1a9409",
    f"{DETECTION_DIR}/workbook_acquisition.json": "25a06dc22ae83a0455df8171293ea231e7f7ef0498485d280c28264b8b47cf55",
    f"{DETECTION_DIR}/workbook_audit.json": "24ceb97b3b51a36cf06ae5192ccb13cbd04f4c0a70ba6b6e0c99079528f888e4",
    WORKBOOK: "6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218",
    PAPER: "59315478dbf26b833238df7166cf2a4649f4731f51fc01f8fc0eef602966d80d",
    PAPER_RECORD: "0be9f2f15a334d8c51e61c728a59f846f0e4712856d7005e5ad2f6438cfeb03c",
    f"{PAPER_DIR}/acquisition_log.json": "01bef0efa52c8ee7ce007ca8db5d4ebd3cbe96b58b9e7db1467dc08280aefd4a",
    EARLIER_PAPER: "7f875da1d6abeeeeac64aeba67d3f160074cf98430e714fe7606b34b37e0aa59",
}
ACCESSIONS = tuple(f"PSI-{n}" for n in (
    10, 20, 21, 22, 23, 25, 26, 39, 47, 60, 62, 68, 69,
    98, 99, 100, 101, 102, 106, 107, 115, 117, 142, 159,
))
APP_LINKS = {
    "PSI-25": "INV-BASS-II", "PSI-26": "INV-BASS",
    "PSI-69": "INV-FLEX", "PSI-98": "INV-SAFFIRE-I",
    "PSI-99": "INV-SAFFIRE-II", "PSI-100": "INV-SAFFIRE-III",
    "PSI-101": "INV-SAME-R", "PSI-102": "INV-SAME",
}

# Original strings, in the column order printed in 2026 Table 1. The 2024
# values are deliberately NOT used here, including where they differ.
# sample, material, sides, pressure mbar, O2 mole fraction, free volume m3,
# ignition duration seconds, duration of initial flow seconds
CONDITION_ROWS = (
    ("IV-2", "PMMA", "2", "1000", "0.22", "17.9", "60", "535"),
    ("V-3", "PMMA", "1", "745", "0.26", "19", "120", "480"),
    ("VI-3", "PMMA", "2", "544", "0.30", "16.7", "60", "480"),
    ("VI-4", "PMMA", "1", "550", "0.29", "16.7", "120", "900"),
    ("IV-1", "SIBAL", "2", "980", "0.23", "17.9", "8", "200"),
    ("V-2", "Cotton", "2", "741", "0.28", "19", "8", "200"),
    ("VI-2", "SIBAL", "2", "541", "0.31", "16.7", "8", "300"),
)

RECORD_COUNT_MEANING = (
    "Nonblank CSV records after the first header record, including source "
    "summaries and notes. Not a count of burns, specimens, observations or "
    "independent trials."
)
ATLAS_BOUNDARIES = [
    "Profiles contain source-stated PSI catalog metadata, not newly reviewed experimental findings.",
    RECORD_COUNT_MEANING,
    "Inventory covers the acquired experimental-table CSVs and one separately acquired analyzed workbook; full investigation archives were not acquired.",
    "An app investigation link is navigation only; it does not join observations or certify cross-source comparability.",
    "Missing metadata remains null. PSI-10 has no stated license in the acquired record; no license is inferred from other PSI records.",
    "The 24-profile snapshot is not an exhaustive NASA or combustion-literature inventory.",
]
CONDITION_BOUNDARIES = [
    "Seven source-reported cases from ICES-2026-577 Table 1 only; other publication versions are not merged into the canonical conditions.",
    "Pressure and oxygen coordinate differences describe condition proximity only, not physical equivalence, safety, flammability or predicted response.",
    "Coordinate gaps may be compared only within a matching material and number-of-burning-sides cohort. That gate is necessary for this display, not sufficient for physical transfer.",
    "The 2026 opposed-flow caption and 2024 concurrent-flow row conflict. Flow equivalence is unresolved; nominal 20 cm/s is not a complete velocity history.",
    "These are low-Earth-orbit microgravity spacecraft experiments, not lunar-gravity burns or a lunar external atmosphere.",
    "Oxygen partial pressure is derived arithmetic, not a separately measured quantity or an equivalence rule.",
    "Shared flights, apparatus and measurement ancestry mean the cases must not be treated as independent replicates.",
    "No response prediction, safety threshold, burn probability, uncertainty percentage or Moon-similarity scalar is supplied.",
]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def load_json(relative: str):
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def verify_file(relative: str, expected_hash: str, verified: dict,
                expected_bytes: int | None = None) -> bytes:
    path = (ROOT / relative).resolve()
    require(path.is_relative_to(ROOT), f"Input path leaves workspace: {relative}")
    raw = path.read_bytes()
    actual = hashlib.sha256(raw).hexdigest()
    require(actual == expected_hash, f"Input SHA-256 mismatch: {relative}")
    if expected_bytes is not None:
        require(len(raw) == expected_bytes, f"Input byte count mismatch: {relative}")
    verified[relative] = actual
    return raw


def nullable(value):
    return value if value not in ("", None) else None


def count_csv(raw: bytes, accession: str) -> dict:
    # FLEX contains non-UTF-8 characters. The selected decoding is explicit,
    # with no replacement characters or changes to the original header cells.
    encoding = "cp1252" if accession == "PSI-69" else "utf-8-sig"
    rows = list(csv.reader(io.StringIO(raw.decode(encoding), newline=""), strict=True))
    require(bool(rows) and any(rows[0]), "CSV has no header")
    require(all(len(row) == len(rows[0]) for row in rows), "CSV field count mismatch")
    nonblank = sum(any(cell.strip() for cell in row) for row in rows[1:])
    return {
        "encoding": encoding,
        "header": rows[0],
        "columnCount": len(rows[0]),
        "dataRecordCount": nonblank,
        "blankDataRecordCount": len(rows) - 1 - nonblank,
        "parsedDataRecordCount": len(rows) - 1,
        "recordCountMeaning": RECORD_COUNT_MEANING,
    }


def workbook_inventory(psi_record: dict, verified: dict) -> dict:
    """Recount cached XML records without evaluating formulas or external links."""
    audit = load_json(f"{DETECTION_DIR}/workbook_audit.json")
    acquisition = load_json(f"{DETECTION_DIR}/workbook_acquisition.json")
    item = next(x for x in psi_record["added"]
                if x.get("file_name") == Path(WORKBOOK).name)
    download = next(x for x in acquisition["requests"]
                    if x.get("saved_file") == Path(WORKBOOK).name)
    require(download["status"] == 200, "Workbook acquisition did not succeed")
    require(download["sha256"] == verified[WORKBOOK] == audit["sha256"],
            "Workbook acquisition/audit hash mismatch")
    require(int(item["file_size"]) == download["bytes"] == (ROOT / WORKBOOK).stat().st_size,
            "Workbook byte count mismatch")
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    rid = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
    sheets = []
    flights = Counter()
    materials = Counter()
    with zipfile.ZipFile(ROOT / WORKBOOK) as archive:
        book = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        targets = {r.attrib["Id"]: r.attrib["Target"] for r in relationships}
        strings = ET.fromstring(archive.read("xl/sharedStrings.xml"))
        shared = ["".join(t.text or "" for t in s.findall(".//m:t", ns)) for s in strings]
        for sheet in book.findall("m:sheets/m:sheet", ns):
            target = targets[sheet.attrib[rid]]
            member = (target.lstrip("/") if target.startswith("/")
                      else posixpath.normpath("xl/" + target))
            require(member.startswith("xl/"), "Unexpected workbook relationship")
            tree = ET.fromstring(archive.read(member))
            dimension = tree.find("m:dimension", ns)
            sheets.append({"name": sheet.attrib["name"],
                           "dimension": dimension.attrib.get("ref") if dimension is not None else None})
            if sheet.attrib["name"] != "Material Sort":
                continue
            for row in tree.findall("m:sheetData/m:row", ns):
                cells = {}
                for cell in row.findall("m:c", ns):
                    col = "".join(c for c in cell.attrib["r"] if c.isalpha())
                    value = cell.find("m:v", ns)
                    text = value.text if value is not None else None
                    if cell.attrib.get("t") == "s" and text is not None:
                        text = shared[int(text)]
                    elif cell.attrib.get("t") == "inlineStr":
                        text = "".join(t.text or "" for t in cell.findall(".//m:t", ns))
                    cells[col] = text
                if cells.get("A") in ("1", "2"):
                    flights[cells["A"]] += 1
                    materials[cells.get("C")] += 1
    require(sheets == audit["sheets"], "Workbook sheet inventory differs from audited source")
    require(dict(flights) == audit["flight_counts"] and sum(flights.values()) == 154,
            "Workbook flight-marked row recount differs")
    require(dict(materials) == audit["material_counts"], "Workbook material row recount differs")
    return {
        "id": "PSI-101-analyzed-results-workbook",
        "fileName": item["file_name"], "path": WORKBOOK,
        "sha256": verified[WORKBOOK], "bytes": download["bytes"],
        "fileVersion": item["version"], "investigationRecordVersion": psi_record["version"],
        "psiResourceId": item["resource_id"]["$oid"],
        "category": "Analyzed Data", "subcategory": item["subcategory"],
        "acquiredAtUtc": download["retrieved_at_utc"],
        "relatedAccessions": ["PSI-101", "PSI-102"],
        "relationMeaning": "Workbook contains SAME and SAME-R records; recorded once under the PSI-101 accession from which it was acquired.",
        "inspectionMethod": "Read stored XLSX ZIP/XML values; no recalculation, macro execution or external-link access.",
        "worksheetCount": len(sheets), "worksheets": sheets,
        "materialSortRecount": {
            "flightMarkedRecords": sum(flights.values()),
            "sourceFlightCodeCounts": dict(flights),
            "sourceFlightCodeLabels": {"1": "SAME", "2": "SAME-R"},
            "materialRecordCounts": dict(materials),
            "meaning": "Flight-marked Material Sort rows, including baseline/aged/reburn and reference records; not independent burns or validated detector-performance observations.",
        },
        "auditSource": {"path": f"{DETECTION_DIR}/workbook_audit.json",
                        "sha256": verified[f"{DETECTION_DIR}/workbook_audit.json"]},
        "cautions": [
            "SAME-R CSV and workbook each have 109 campaign rows but do not have identical material/test-label sets. No observation join is made.",
            "Workbook cached errors and missing cells remain unresolved; stored values were not recalculated.",
            "The 20 DBP reference records are not solid-fuel specimens.",
        ],
    }


def build_atlas(verified: dict) -> dict:
    log = load_json(f"{PSI_DIR}/acquisition_log.json")
    by_saved = {x["saved_as"]: x for x in log if x.get("saved_as")}
    manifest = load_json(f"{PSI_DIR}/tables_manifest.json")
    require(len(manifest) == 22, "Expected the 22-file acquired table manifest")
    actual = {p.stem.removesuffix(".record") for p in (ROOT / PSI_DIR).glob("*.record.json")}
    require(actual == set(ACCESSIONS), "PSI profile input set changed")
    require(len({x["saved_as"] for x in manifest}) == len(manifest), "Duplicate CSV manifest path")
    registry = load_json("web/data/investigations.json")
    registry_ids = {x["id"] for x in registry["records"]}
    require(set(APP_LINKS.values()) <= registry_ids, "App navigation mapping points to missing ID")
    profiles = []
    for accession in ACCESSIONS:
        saved = f"{accession}.record.json"
        acquisition = by_saved[saved]
        require(acquisition["status"] == 200, f"Metadata acquisition failed: {accession}")
        path = f"{PSI_DIR}/{saved}"
        raw = verify_file(path, acquisition["sha256"], verified, acquisition["bytes"])
        record = json.loads(raw)
        require(record["accession"] == accession, f"Metadata accession mismatch: {accession}")
        for required in ("title", "objective", "version", "doi", "investigationAcronym",
                         "description", "licenseIdentifier", "licenseName", "licenseLink", "experimentalTable"):
            require(required in record, f"Missing {required}: {accession}")
        require(bool(record["title"]) and bool(record["objective"]), f"Missing profile text: {accession}")
        listed = {x["file_name"]: x for x in (record["experimentalTable"] or [])}
        acquired = [x for x in manifest if x["acc"] == accession]
        require(set(listed) == {x["file"] for x in acquired},
                f"Listed/acquired experimental-table inventory differs: {accession}")
        tables = []
        for index, entry in enumerate(acquired, 1):
            file_meta = listed[entry["file"]]
            table_acquisition = by_saved[entry["saved_as"]]
            require(entry["status"] == table_acquisition["status"] == 200, "CSV acquisition failed")
            require(entry["file_version"] == file_meta["version"], "CSV version mismatch")
            require(entry["bytes"] == entry["declared_size"] == file_meta["file_size"]
                    == table_acquisition["bytes"], "CSV declared size mismatch")
            table_path = f"{PSI_DIR}/{entry['saved_as']}"
            table_raw = verify_file(table_path, table_acquisition["sha256"], verified, entry["bytes"])
            tables.append({
                "id": f"{accession}-experimental-table-{index}",
                "fileName": entry["file"], "path": table_path,
                "sha256": verified[table_path], "bytes": entry["bytes"],
                "fileVersion": entry["file_version"],
                "acquiredAtUtc": table_acquisition["utc"],
                "catalogField": "experimentalTable", "acquisitionStatus": "acquired_and_recounted",
                **count_csv(table_raw, accession),
            })
        license_fields = [nullable(record[k]) for k in ("licenseIdentifier", "licenseName", "licenseLink")]
        profiles.append({
            "id": accession, "accession": accession, "title": record["title"],
            "acronym": nullable(record["investigationAcronym"]),
            "publicUrl": f"https://psi.nasa.gov/physci/repo/data/investigations/{accession}",
            "publicApiUrl": f"https://psi.nasa.gov/geode-py/ws/repo/investigations/{accession}",
            "doi": nullable(record["doi"]),
            "doiUrl": f"https://doi.org/{record['doi']}" if record["doi"] else None,
            "license": {"status": "stated" if any(license_fields) else "not_reported",
                        "identifier": license_fields[0], "name": license_fields[1], "url": license_fields[2]},
            "appInvestigationId": APP_LINKS.get(accession),
            "source": {"path": path, "sha256": verified[path],
                       "recordVersion": record["version"], "acquiredAtUtc": acquisition["utc"]},
            "metadata": {"role": "source_stated_catalog_metadata",
                         "objective": nullable(record["objective"]),
                         "description": nullable(record["description"]),
                         "statementMeaning": "Verbatim PSI catalog fields; objectives describe intended work, not proof that results or predictions were achieved."},
            "experimentalTableStatus": "acquired" if tables else "none_listed_in_acquired_record",
            "experimentalTables": tables,
            "analyzedWorkbooks": [workbook_inventory(record, verified)] if accession == "PSI-101" else [],
        })
    tables = [t for p in profiles for t in p["experimentalTables"]]
    counts = {
        "profiles": len(profiles), "profilesWithExperimentalCsv": sum(bool(p["experimentalTables"]) for p in profiles),
        "profilesWithoutExperimentalCsv": sum(not p["experimentalTables"] for p in profiles),
        "experimentalCsvFiles": len(tables),
        "experimentalCsvDataRecords": sum(t["dataRecordCount"] for t in tables),
        "experimentalCsvBlankDataRecords": sum(t["blankDataRecordCount"] for t in tables),
        "experimentalCsvParsedDataRecords": sum(t["parsedDataRecordCount"] for t in tables),
        "acquiredAnalyzedWorkbooks": sum(len(p["analyzedWorkbooks"]) for p in profiles),
    }
    require((counts["profiles"], counts["experimentalCsvFiles"], counts["experimentalCsvDataRecords"],
             counts["experimentalCsvBlankDataRecords"], counts["acquiredAnalyzedWorkbooks"])
            == (24, 22, 2009, 861, 1), "Local atlas recount changed")
    require(profiles[0]["license"] == {"status": "not_reported", "identifier": None, "name": None, "url": None},
            "PSI-10 license must remain explicitly unknown")
    return {
        "schemaVersion": "ignis-investigation-atlas-1", "snapshotDate": SNAPSHOT,
        "title": "Acquired NASA PSI investigation atlas", "counts": counts,
        "countMeaning": RECORD_COUNT_MEANING, "boundaries": ATLAS_BOUNDARIES,
        "inventoryScope": "All experimental-table entries in these 24 acquired PSI metadata records, plus one separately audited PSI-101 analyzed workbook. Other archive files are outside this acquired inventory.",
        "reviewStatement": "AI-assisted source inspection and deterministic checks; no independent human review is claimed.",
        "records": profiles,
    }


def build_conditions(verified: dict) -> dict:
    metadata = load_json(PAPER_RECORD)
    require(metadata["id"] == 20260001992 and metadata["title"] ==
            "Heat and Smoke Emission from Tests on the Saffire VI Experiment", "Paper metadata identity mismatch")
    acquisitions = load_json(f"{PAPER_DIR}/acquisition_log.json")
    acquisition = next(x for x in acquisitions if x.get("file") == Path(PAPER).name)
    require(acquisition["status"] == 200 and acquisition["sha256"] == verified[PAPER], "Paper acquisition mismatch")
    cases = []
    for sample, material, sides, pressure, oxygen, volume, ignition, initial_flow in CONDITION_ROWS:
        p_kpa = Decimal(pressure) * Decimal("0.1")
        x_o2 = Decimal(oxygen)
        sides_int = int(sides)
        pmma = material == "PMMA"
        thickness = ("10" if sides_int == 2 else "5") if pmma else None
        cases.append({
            "id": f"SAFFIRE-{sample}", "flight": sample.rsplit("-", 1)[0], "sample": sample,
            "material": material, "sidesBurning": sides_int, "cohortId": f"{material}-{sides}",
            "oxygenMoleFraction": float(x_o2), "oxygenPercent": float(x_o2 * 100),
            "pressureKPa": float(p_kpa), "oxygenPartialPressureKPa": float(x_o2 * p_kpa),
            "nominalFlowCmS": 20, "nominalFlowDirection": "opposed (2026 caption)",
            "flowEquivalenceStatus": "unresolved_publication_conflict",
            "initialFlowDurationS": int(initial_flow), "ignitionDurationS": int(ignition),
            "freeVolumeM3": float(volume), "sourceId": SOURCE_ID, "pdfPage": 6,
            "platform": "Cygnus spacecraft, low Earth orbit", "gravityRegime": "microgravity",
            "geometry": {"widthCm": 40, "lengthCm": 18 if pmma else 50,
                         "thicknessMm": int(thickness) if thickness else None,
                         "thicknessStatus": "reported_in_table_caption" if pmma else "not_reported_in_table_caption"},
            "thermalHistory": {"preheatMinutes": 10 if pmma else None,
                               "preheatDescription": "low ignitor power" if pmma else None,
                               "status": "reported_in_table_caption" if pmma else "not_reported_in_table_caption",
                               "specimenPriorHistory": "not_established_by_this_table"},
            "flowHistory": {
                "status": "partial_source_context",
                "note": "The table gives duration of initial flow; nominal 20 cm/s is not asserted for the entire experiment.",
                "reportedChange": {"atSeconds": 480, "toCmS": 5, "pdfPage": 6,
                                   "sourceDescription": "Narrative reports flow reduction and end of flame tracking."} if sample == "VI-3" else None,
            },
            "original": {"flightSample": sample, "material": material, "sidesBurning": sides,
                         "pressureMbar": pressure, "oxygenMoleFraction": oxygen,
                         "freeVolumeM3": volume, "ignitionDurationS": ignition,
                         "initialFlowDurationS": initial_flow, "nominalFlow": "20 cm/s opposed flow",
                         "widthCm": "40", "lengthCm": "18" if pmma else "50",
                         "thicknessMm": thickness, "preheatMinutes": "10" if pmma else None},
            "conversions": {
                "pressureKPa": {"operation": "pressureMbar * 0.1", "factor": 0.1, "value": float(p_kpa)},
                "oxygenPercent": {"operation": "oxygenMoleFraction * 100", "factor": 100,
                                  "value": float(x_o2 * 100), "basis": "mole percent"},
                "oxygenPartialPressureKPa": {"operation": "oxygenMoleFraction * pressureKPa",
                                             "value": float(x_o2 * p_kpa),
                                             "status": "derived_arithmetic_not_separately_measured"},
            },
            "transferStatus": "not_assessed",
        })
    cohorts = []
    for case in cases:
        if any(c["id"] == case["cohortId"] for c in cohorts):
            continue
        ids = [x["id"] for x in cases if x["cohortId"] == case["cohortId"]]
        cohorts.append({"id": case["cohortId"], "material": case["material"],
                        "sidesBurning": case["sidesBurning"], "caseIds": ids,
                        "caseCount": len(ids), "use": "atmosphere_coordinates_only"})
    require(len(cases) == 7 and len(cohorts) == 4, "Condition case/cohort recount changed")
    require(len({x["id"] for x in cases}) == 7, "Duplicate condition case ID")
    return {
        "schemaVersion": "ignis-condition-cases-1", "snapshotDate": SNAPSHOT,
        "title": "Saffire published atmosphere conditions", "caseCount": 7,
        "source": {
            "id": SOURCE_ID, "title": metadata["title"], "version": "ICES-2026-577",
            "publicUrl": "https://ntrs.nasa.gov/citations/20260001992",
            "pdfUrl": "https://ntrs.nasa.gov/api/citations/20260001992/downloads/ICES%20Saffire%202026%2005%2004%20b.pdf",
            "path": PAPER, "sha256": verified[PAPER], "pdfPage": 6, "printedPage": 6,
            "table": "Table 1", "tableTitle": "Sample materials and test data",
            "acquiredAtUtc": acquisition["utc"], "distributionDate": metadata["distributionDate"],
            "metadataPath": PAPER_RECORD, "metadataSha256": verified[PAPER_RECORD],
            "inspectionStatus": "Full PDF acquired; PDF page 6 table image personally inspected and text extraction cross-checked by AI research agent.",
            "transcriptionMethod": "Manual table transcription of printed strings; no plotted-figure digitization.",
        },
        "flowConflict": {
            "id": "SAFFIRE-2024-2026-FLOW-DIRECTION", "status": "unresolved_publication_conflict",
            "canonicalSourceStatement": "2026 Table 1 caption: opposed flow, 20 cm/s, all seven cases.",
            "earlierSourceStatement": "2024 Table 1: Concurrent, 20 cm/s, its five listed cases.",
            "effect": "Preserve source-specific descriptions; do not infer or display flow equivalence. Canonical pressure/oxygen values come only from the 2026 table.",
            "reportPath": "web/docs/lab/05_detection_completion_2026-11-15.md",
        },
        "earlierSourceContext": [{
            "id": "SRC-SAFFIRE-2024-T1-CONTEXT", "role": "conflict_context_only_not_canonical_condition_values",
            "title": "Preliminary Results from the Saffire VI Experiment", "version": "ICES-2024-365",
            "publicUrl": "https://ntrs.nasa.gov/citations/20240002981",
            "path": EARLIER_PAPER, "sha256": verified[EARLIER_PAPER], "pdfPage": 3, "table": "Table 1",
            "flowDirectionOriginal": "Concurrent", "nominalFlowCmS": 20,
            "caseIds": ["SAFFIRE-IV-1", "SAFFIRE-V-2", "SAFFIRE-VI-2", "SAFFIRE-VI-3", "SAFFIRE-VI-4"],
            "conditionVersionNote": "Several pressure and oxygen values differ from the 2026 table; these earlier numerical values are not imported into this condition dataset.",
        }],
        "boundaries": CONDITION_BOUNDARIES,
        "comparisonPolicy": {
            "allowedUse": "atmosphere_coordinates_only", "requiredCohortFields": ["material", "sidesBurning"],
            "coordinateUnits": {"oxygenPercent": "mole percentage points", "pressureKPa": "kPa"},
            "differenceConvention": "case coordinate minus user-specified target coordinate, shown separately for oxygen and pressure",
            "scalarScoreProvided": False, "physicalTransferEstablished": False,
            "unreportedOrUnresolvedRequirements": [
                "Flow-direction conflict and complete velocity history",
                "Target gravity and platform, confinement, orientation, geometry and mounting",
                "Material formulation, thickness, thermal properties and specimen history",
                "Ignition, preheating and observation time window",
                "Outcome definition, measurement operator and uncertainty",
                "Gas mixture constituents, source rounding and measurement uncertainty",
                "Shared campaign, apparatus and calibration ancestry",
            ],
        },
        "cohorts": cohorts, "cases": cases,
        "reviewStatement": "AI-assisted primary-page transcription and arithmetic checks; no independent human review or physical model validation is claimed.",
    }


def validate_outputs(atlas: dict, conditions: dict) -> None:
    require(len({p["id"] for p in atlas["records"]}) == 24, "Duplicate atlas accession")
    for profile in atlas["records"]:
        for key in ("id", "accession", "title", "acronym", "publicUrl", "doi", "license", "source",
                    "metadata", "experimentalTables", "analyzedWorkbooks", "appInvestigationId"):
            require(key in profile, f"Missing atlas output field: {key}")
        require(profile["metadata"]["role"] == "source_stated_catalog_metadata", "Wrong metadata evidence role")
    for case in conditions["cases"]:
        for key in ("id", "sourceId", "pdfPage", "material", "sidesBurning", "oxygenMoleFraction",
                    "pressureKPa", "nominalFlowCmS", "original", "conversions", "cohortId"):
            require(key in case, f"Missing condition output field: {key}")
        require(case["sourceId"] == SOURCE_ID and case["pdfPage"] == 6, "Condition source mixing")
        require(0 < case["oxygenMoleFraction"] < 1 and case["pressureKPa"] > 0, "Invalid condition coordinate")
        require(case["sidesBurning"] in (1, 2), "Invalid burning-side count")
        require(case["transferStatus"] == "not_assessed", "Unsupported transfer status")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify inputs and compare generated bytes without writing")
    args = parser.parse_args()
    verified = {}
    for relative, expected in PINNED_INPUTS.items():
        verify_file(relative, expected, verified)
    atlas = build_atlas(verified)
    conditions = build_conditions(verified)
    validate_outputs(atlas, conditions)
    verification = {
        "algorithm": "SHA-256", "checkedRawFileCount": len(verified),
        "pinnedRootInputs": [{"path": p, "sha256": h} for p, h in PINNED_INPUTS.items()],
        "psiRecordsAndCsvHashes": "Every acquired record and CSV is checked against the pinned PSI acquisition log.",
        "requiredFieldsValidated": True, "networkUsed": False,
        "appLinkValidation": "Eight fixed navigation IDs checked against the current local investigation registry; registry scientific content is not imported.",
        "generatorPath": "web/scripts/curate-atlas.py",
    }
    atlas["verification"] = verification
    conditions["verification"] = verification
    outputs = {"web/data/investigation-atlas.json": atlas, "web/data/condition-cases.json": conditions}
    hashes = {}
    for relative, data in outputs.items():
        raw = (json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + "\n").encode("utf-8")
        path = ROOT / relative
        if args.check:
            require(path.exists() and path.read_bytes() == raw, f"Generated output is missing or stale: {relative}")
        else:
            path.write_bytes(raw)
        hashes[relative] = hashlib.sha256(raw).hexdigest()
    print(json.dumps({"status": "PASS", "mode": "check" if args.check else "generate",
                      "checkedRawFiles": len(verified), "counts": atlas["counts"],
                      "conditionCases": len(conditions["cases"]), "conditionCohorts": len(conditions["cohorts"]),
                      "outputSha256": hashes}, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, KeyError, OSError, csv.Error, UnicodeError, zipfile.BadZipFile, ET.ParseError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        raise SystemExit(1)
