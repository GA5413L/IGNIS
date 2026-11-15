"""Curate the pinned public PSI SAME workbook using cached XLSX cell values only.

No workbook execution, formula recalculation, external links, network access or
cross-source row filling. Run with --check to verify the committed JSON artifact.
"""
from __future__ import annotations

import argparse
from collections import Counter
import csv
import hashlib
import json
import math
from pathlib import Path
import posixpath
import re
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "_raw/lab_completion_2026-11-15/detection"
WORKBOOK_NAME = "PSI-101_Analyzed Data_SAME, SAME-R_Results.xlsx"
WORKBOOK_SHA256 = "6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218"
CONDITION_TABLE_SHA256 = "87164b7dc9168a4273c159f7a9f23699afbd06ad97b77974377e79b9bf8a3bef"
SHEET = "Material Sort"
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
MATERIALS = ("Kapton", "Teflon", "Lampwick", "Silicone", "Pyrell", "DBP")
CHANNELS = {
    "issScatterV": {"label": "ISS detector scatter", "column": "AW", "unit": "V"},
    "issObscurationV": {"label": "ISS obscuration channel", "column": "AV", "unit": "V"},
    "stsV": {"label": "STS detector", "column": "AX", "unit": "V"},
    "ionDeltaV": {"label": "Ion B signal minus offset", "column": "BK", "unit": "V"},
}
CONDITIONS = {
    "inletVelocityCmPerSec": "N", "heatingResistanceRatio": "O", "heatingDurationSec": "P",
    "primaryAgingDurationSec": "Q", "primaryMixingDurationSec": "R", "netAgingDurationSec": "U",
}


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_sheet(path: Path) -> tuple[dict[str, str], list[dict]]:
    with zipfile.ZipFile(path) as archive:
        strings = ["".join(element.itertext())
                   for element in ET.fromstring(archive.read("xl/sharedStrings.xml"))]
        relationships = {element.attrib["Id"]: element.attrib["Target"] for element
                         in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))}
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        sheets = workbook.find("m:sheets", NS)
        if sheets is None:
            raise ValueError("Workbook has no sheet list")
        sheet = next(item for item in sheets if item.attrib["name"] == SHEET)
        target = posixpath.normpath(posixpath.join("xl", relationships[sheet.attrib["{" + NS["r"] + "}id"]]))
        sheet_xml = ET.fromstring(archive.read(target))
        sheet_data = sheet_xml.find("m:sheetData", NS)
        if sheet_data is None:
            raise ValueError("Material Sort has no sheet data")
        rows = []
        for row in sheet_data:
            cells = {}
            for cell in row:
                address = cell.attrib["r"]
                value_element, formula_element = cell.find("m:v", NS), cell.find("m:f", NS)
                original = value_element.text if value_element is not None else None
                if cell.attrib.get("t") == "s" and original is not None:
                    original = strings[int(original)]
                elif cell.attrib.get("t") == "inlineStr":
                    inline = cell.find("m:is", NS)
                    original = "".join(inline.itertext()) if inline is not None else None
                cells[re.sub(r"\d", "", address)] = {
                    "cell": address, "originalValue": original,
                    "storageType": cell.attrib.get("t"),
                    "formula": formula_element.text if formula_element is not None else None,
                }
            rows.append({"excelRow": int(row.attrib["r"]), "cells": cells})
    headers = {column: cell["originalValue"] for column, cell in
               next(row["cells"] for row in rows if row["excelRow"] == 2).items()
               if cell["originalValue"] is not None}
    return headers, rows


def source_cell(row: dict, column: str) -> dict:
    return row["cells"].get(column, {"cell": f"{column}{row['excelRow']}", "originalValue": None,
                                    "storageType": None, "formula": None})


def text_value(row: dict, column: str) -> str | None:
    return source_cell(row, column)["originalValue"]


def numeric_cell(row: dict, column: str) -> dict:
    source = source_cell(row, column)
    original = source["originalValue"]
    result = {**source, "value": None, "error": None, "status": "missing"}
    if source["storageType"] == "e" or (original is not None and original.startswith("#")):
        result.update(status="error", error=original)
    elif original is not None and original != "":
        try:
            number = float(original)
        except ValueError:
            number = None
        if number is not None and math.isfinite(number):
            result.update(status="finite", value=number)
        else:
            result["status"] = "non_numeric"
    return result


def curate(workbook_path: Path, record_path: Path, table_path: Path) -> dict:
    if sha256(workbook_path) != WORKBOOK_SHA256:
        raise ValueError("Workbook SHA-256 differs from the reviewed source; review it before curation")
    if sha256(table_path) != CONDITION_TABLE_SHA256:
        raise ValueError("Condition-table SHA-256 differs from the reviewed identity audit")
    metadata = json.loads(record_path.read_text(encoding="utf-8-sig"))
    if metadata["accession"] != "PSI-101" or metadata["version"] != 4:
        raise ValueError("Expected PSI-101 record version 4")
    headers, sheet_rows = read_sheet(workbook_path)
    expected_headers = {"A": "Flight 1=same 2=sameR, g=ground", "C": "Sample Type",
                        "AW": "ISS Detector Scatter (volts)", "AV": "ISS Obscuration (volts)",
                        "AX": "STS Detector (volts)", "BK": "Ion B Delta (volts)",
                        "BR": "M1/M0 (micro-m)--CMD", "BS": "Diameter of Average mass (micro-m)"}
    for column, header in expected_headers.items():
        if headers.get(column) != header:
            raise ValueError(f"Unexpected source header at {column}2")
    flight_rows = [row for row in sheet_rows if text_value(row, "A") in ("1", "2")]
    if len(flight_rows) != 154:
        raise ValueError("Expected 154 flight-marked source rows")

    records = []
    for row in flight_rows:
        flight, material, number = text_value(row, "A"), text_value(row, "C"), row["excelRow"]
        if material not in MATERIALS:
            raise ValueError(f"Unreviewed material at C{number}")
        records.append({
            "id": f"PSI-101:{WORKBOOK_SHA256}:Material-Sort:R{number}",
            "workbookSha256": WORKBOOK_SHA256, "sheet": SHEET, "excelRow": number,
            "flight": flight, "flightLabel": "SAME" if flight == "1" else "SAME-R",
            "material": material, "materialRole": "reference" if material == "DBP" else "spacecraft_material",
            "sampleId": text_value(row, "D"), "testId": text_value(row, "E"),
            "sameTestNumber": text_value(row, "G"), "description": text_value(row, "H"),
            "identityCells": {key: source_cell(row, column) for key, column in
                              {"flight": "A", "carousel": "B", "material": "C", "sampleId": "D",
                               "testId": "E", "sameTestNumber": "G", "description": "H"}.items()},
            "conditions": {key: numeric_cell(row, column) for key, column in CONDITIONS.items()},
            "instrumentStatusAsRecorded": {key: source_cell(row, column) for key, column in
                                           {"primaryStsUse": "X", "secondaryStsUse": "AL",
                                            "fanProblem": "L", "flatProfiles": "M"}.items()},
            "channels": {key: numeric_cell(row, value["column"]) for key, value in CHANNELS.items()},
            "sizes": {"countMeanUm": numeric_cell(row, "BR"), "diameterOfAverageMassUm": numeric_cell(row, "BS")},
        })

    with table_path.open(encoding="utf-8-sig", newline="") as stream:
        condition_rows = list(csv.DictReader(stream))
    csv_keys = Counter((row["Sample Type"], row["SAME Test #"]) for row in condition_rows)
    workbook_keys = Counter((row["material"], row["sameTestNumber"]) for row in records if row["flight"] == "2")
    csv_only = [{"csvLineIncludingHeader": index + 2, "originalFields": row} for index, row in enumerate(condition_rows)
                if (row["Sample Type"], row["SAME Test #"]) in csv_keys - workbook_keys]
    workbook_only = [{"recordId": row["id"], "sheet": SHEET, "excelRow": row["excelRow"],
                      "identityCells": row["identityCells"]} for row in records if row["flight"] == "2"
                     and (row["material"], row["sameTestNumber"]) in workbook_keys - csv_keys]

    return {
        "schemaVersion": "ignis-detector-data-1", "curationDate": "2026-11-15",
        "source": {
            "accession": "PSI-101", "recordVersion": metadata["version"], "title": metadata["title"],
            "recordUrl": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-101",
            "doi": metadata["doi"], "doiUrl": f"https://doi.org/{metadata['doi']}",
            "license": {"id": metadata["licenseIdentifier"], "name": metadata["licenseName"],
                        "url": metadata["licenseLink"], "basis": "License declared by the captured PSI-101 record."},
            "recordModifiedDate": metadata["modifiedDate"], "recordSha256": sha256(record_path),
            "workbook": {"fileName": WORKBOOK_NAME, "legacyFileName": "Combined SAMER Results 06 02 14.xlsx",
                         "sha256": WORKBOOK_SHA256, "sizeBytes": workbook_path.stat().st_size,
                         "sheet": SHEET, "headersRow": 2, "parseMode": "stored_XLSX_cache_no_recalculation",
                         "retrievedAtUtc": "2026-11-14T23:06:48.178364+00:00"},
            "review": {"level": "assistant_checked", "humanReviewed": False,
                       "method": "Pinned bytes, ZIP/XML cached cells, source header checks, row-count and identity audit.",
                       "independentValidation": False},
        },
        "sheetHeaders": headers,
        "channels": {key: {**definition, "sourceHeader": headers[definition["column"]],
                           "interpretation": "Stored voltage channel; an analyst cutoff is not a flight alarm criterion."}
                     for key, definition in CHANNELS.items()},
        "policy": {
            "analysisKind": "descriptive_voltage_cutoff", "cutoffMeaning": "Analyst-selected voltage cutoff, not an alarm threshold.",
            "denominator": "Percentages use only finite selected-channel readings among the selected rows.",
            "rowMeaning": "Source records include repeated aging readings and shared specimens, apparatus and calibration; they are not independent trials.",
            "zeroMeaning": "A finite cached zero stays zero; it does not establish an enabled sensor, zero smoke, or nondetection.",
            "missingMeaning": "Blank, error and non-numeric source values are retained and excluded from the finite denominator; no gap filling.",
            "channelMeaning": "All selectable channels are volts. Obscuration volts are not percent obscuration; ion delta is not a detector alarm.",
            "filterMeaning": "Flight and material selection does not validate instrument operation. Recorded use/quality fields remain attached to rows.",
            "sourceScope": "Material Sort flight markers 1/2 only; ground records and other worksheets are not silently pooled.",
            "referenceMeaning": "DBP is a reference material and is excluded by the default selection; 20 rows are available explicitly.",
            "alarmClassification": False, "physicalPrediction": False, "independentTrials": False,
        },
        "identityConflicts": [{
            "id": "PSI-101-condition-table-workbook-identity-1", "status": "unresolved",
            "statement": "The 109-row SAME-R condition table and 109 flight-2 workbook records have different material/test identities. No automatic crosswalk, correction, deletion or row filling is applied.",
            "keyExamined": ["material", "exact SAME test label"],
            "conditionTable": {"fileName": table_path.name, "sha256": CONDITION_TABLE_SHA256, "rowCount": len(condition_rows)},
            "workbookFlight2RowCount": sum(row["flight"] == "2" for row in records),
            "csvOnlyRecords": csv_only, "workbookOnlyRecords": workbook_only,
        }],
        "records": records,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workbook", type=Path, default=EVIDENCE / WORKBOOK_NAME)
    parser.add_argument("--psi-record", type=Path, default=ROOT / "_raw/psi_2026-11-15/PSI-101.record.json")
    parser.add_argument("--condition-table", type=Path, default=ROOT / "_raw/psi_2026-11-15/tables/PSI-101_Experimental table_SAME-R.csv")
    parser.add_argument("--output", type=Path, default=ROOT / "web/data/detector-data.json")
    parser.add_argument("--check", action="store_true", help="Compare the deterministic output without writing")
    args = parser.parse_args()
    data = curate(args.workbook, args.psi_record, args.condition_table)
    serialized = (json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + "\n").encode("utf-8")
    if args.check:
        if not args.output.exists() or args.output.read_bytes() != serialized:
            raise SystemExit("FAIL: detector-data.json differs from pinned-source curation")
        print("PASS: detector-data.json reproduces all 154 flight-marked rows from the pinned source")
    else:
        args.output.write_bytes(serialized)
        print(f"Wrote {len(data['records'])} source rows ({len(serialized)} bytes) to {args.output}")


if __name__ == "__main__":
    main()
