"""Recount a design certificate using Fraction and Gram principal minors, not TS row reduction.

python -I research/analysis/verify_design_audit.py certificate.json [--pdf publisher.pdf]
Only --pdf needs PyMuPDF. No network, model inference, fitting or source-figure digitization.
"""
import argparse
from copy import deepcopy
from fractions import Fraction as F
from hashlib import sha256
from itertools import combinations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STUDY_PATH = ROOT / "web/data/design-studies/ries2024.json"
TERMS = [(1, 0, 1), (0, 1, 1), (1, 0, 2), (0, 1, 2), (1, 1, 1)]
TERM_NAMES = ["a*c", "b*c", "a*c^2", "b*c^2", "a*b*c"]
AXES = ["oxygenVolPercent", "pressureKPa", "flowMmS"]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def determinant(matrix):
    if not matrix:
        return F(1)
    if len(matrix) == 1:
        return matrix[0][0]
    return sum(((-1) ** j * matrix[0][j] * determinant([
        row[:j] + row[j + 1:] for row in matrix[1:]
    ]) for j in range(len(matrix))), F(0))


def independent_rank(rows, columns):
    # Over the rationals, the Gram matrix is positive semidefinite and has the same rank.
    # Its largest nonsingular principal submatrix gives that rank. At most 31 minors for 5 columns.
    gram = [[sum((row[i] * row[j] for row in rows), F(0)) for j in range(columns)] for i in range(columns)]
    for size in range(columns, 0, -1):
        for subset in combinations(range(columns), size):
            if determinant([[gram[i][j] for j in subset] for i in subset]):
                return size
    return 0


def check_certificate(certificate, study):
    require(certificate["schemaVersion"] == "ignis-design-audit-1" and certificate["claimType"] == "nominal_design_rank", "Unknown claim/schema")
    require(certificate["sourceStudy"] == study, "Source snapshot differs from the repository study")
    require(certificate["methodRevision"] == "design-audit-2026-11-15.1", "Unknown method revision")
    require(certificate["request"]["gravity"] == "microgravity", "Gravity scope mismatch")
    require(study["design"]["center"] == dict(zip(AXES, ["35.4", "60", "100"])), "Unreviewed centering")
    points = certificate["request"]["candidates"]
    rows = []
    for point in points:
        a, b, c = [F(point[axis]) / F(center) - 1 for axis, center in zip(AXES, ["35.4", "60", "100"])]
        rows.append([a ** i * b ** j * c ** k for i, j, k in TERMS])
    require([list(map(F, point["interactionRow"])) for point in certificate["candidates"]] == rows, "Candidate basis values differ")
    require(all(k > 0 and (i > 0 or j > 0) for i, j, k in TERMS), "Basis does not vanish on the plane-line union")
    unique = len({tuple(F(point[axis]) for axis in AXES) for point in points})
    require(certificate["uniqueCoordinateCount"] == unique, "Unique-coordinate count differs")
    for name, columns in [("twoTerm", 2), ("expandedFiveTerm", 5)]:
        report = certificate["classes"][name]
        require(report["terms"] == TERM_NAMES[:columns] and report["columns"] == columns, "Declared class differs")
        matrix = [row[:columns] for row in rows]
        require([list(map(F, row)) for row in report["rows"]] == matrix, "Class matrix differs")
        rank = independent_rank(matrix, columns)
        require(report["rank"] == rank and report["nullity"] == columns - rank, "Rank/nullity differs from Gram-minor recount")
        require(report["reportedDesignRank"] == 0 and report["rankGainOverReportedNominalDesign"] == rank, "Rank-gain claim differs")
        require(report["coefficientsIdentifiableConditionalOnFixedBaseline"] == (rank == columns), "Identification claim differs")
        vectors = [list(map(F, row)) for row in report["nullspace"]]
        require(len(vectors) == columns - rank, "Wrong nullspace dimension")
        require(independent_rank(vectors, columns) == len(vectors), "Nullspace vectors are dependent")
        for vector in vectors:
            require(len(vector) == columns, "Nullspace width mismatch")
            for row in matrix:
                require(sum((x * y for x, y in zip(row, vector)), F(0)) == 0, "Nullspace vector does not annihilate a row")
        # Check the exposed reduced matrix by its defining properties and row space,
        # without reproducing the TypeScript row-reduction algorithm.
        reduced = [list(map(F, row)) for row in report["rref"]]
        require(len(reduced) == len(matrix) and all(len(row) == columns for row in reduced), "Reduced matrix dimensions differ")
        pivots = []
        zero_seen = False
        for row in reduced:
            nonzero = [i for i, v in enumerate(row) if v]
            if not nonzero:
                zero_seen = True
                continue
            require(not zero_seen, "Nonzero reduced row follows a zero row")
            pivot = nonzero[0]
            require(row[pivot] == 1 and (not pivots or pivot > pivots[-1]), "Reduced pivots are not canonical")
            pivots.append(pivot)
            for vector in vectors:
                require(sum((x * y for x, y in zip(row, vector)), F(0)) == 0, "Reduced row is outside the original row space")
        require(len(pivots) == rank and report["pivotColumns"] == pivots, "Reduced rank/pivots differ")
        for i, pivot in enumerate(pivots):
            require(all(row[pivot] == (1 if j == i else 0) for j, row in enumerate(reduced)), "Reduced pivot column has a nonzero off-pivot entry")
        require(report["distinctCoordinateResponseConstraints"] == unique - rank, "Response-constraint count differs")
        require(report["statisticalResidualDegreesOfFreedom"] is None, "Statistical degrees of freedom were invented")
        require(report["validation"].startswith("NOT RUN"), "Validation status changed")
    require(not certificate["boundaries"]["physicalPredictionProvided"], "Unexpected physical prediction claim")
    return {name: {key: certificate["classes"][name][key] for key in ["rank", "nullity", "distinctCoordinateResponseConstraints"]} for name in ["twoTerm", "expandedFiveTerm"]}


def check_pdf(pdf_path, study):
    data = pdf_path.read_bytes()
    require(len(data) == study["source"]["pdfBytes"], "Publisher PDF size mismatch")
    require(sha256(data).hexdigest() == study["source"]["pdfSha256"], "Publisher PDF hash mismatch")
    import pymupdf
    with pymupdf.open(stream=data, filetype="pdf") as doc:
        require(len(doc) == 7, "Unexpected PDF page count")
        # Table 1 printed text only, in page-4 PDF coordinates. No plotted points are read.
        words = doc[3].get_text("words")
        columns = [w for w in words if 680 < w[1] < 685 and 120 < w[0] < 285]
        levels = [w for w in words if 690 < w[1] < 735 and 80 < w[0] < 115]
        symbols = [w for w in words if 690 < w[1] < 735 and 120 < w[0] < 285 and w[4] in ("X", "O")]
        require(len(columns) == 5 and len(levels) == 5 and len(symbols) == 13, "Unexpected Table 1 text geometry")
        cells = []
        for word in symbols:
            pressure = min(columns, key=lambda w: abs((w[0] + w[2]) / 2 - (word[0] + word[2]) / 2))[4]
            oxygen = min(levels, key=lambda w: abs(w[1] - word[1]))[4]
            cells.append((oxygen, pressure, word[4]))
        expected = [(p["oxygenVolPercent"], p["pressureKPa"], "X") for p in study["design"]["tableXConditions"]]
        expected.append(("35.4", "60.0", "O"))
        require(sorted(cells) == sorted(expected), "Printed Table 1 symbols differ from study transcription")
        text = " ".join(doc[3].get_text().split())
        require("all other experiments had an inflow of 100 mm/s" in text, "Load-bearing fixed-flow sentence missing")
    return {"status": "PASS", "sha256": sha256(data).hexdigest(), "tableXCells": 12, "tableOCells": 1, "plottedValuesDigitized": 0}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("certificate", type=Path)
    parser.add_argument("--pdf", type=Path)
    args = parser.parse_args()
    require(args.certificate.stat().st_size <= 2 * 1024 * 1024, "Certificate too large")
    certificate = json.loads(args.certificate.read_text(encoding="utf-8-sig"))
    study = json.loads(STUDY_PATH.read_text(encoding="utf-8-sig"))
    classes = check_certificate(certificate, study)
    rejected = []
    for field in ("rank", "matrix", "class", "identification_claim", "reduced_matrix"):
        changed = deepcopy(certificate)
        if field == "rank":
            changed["classes"]["twoTerm"]["rank"] += 1
        elif field == "class":
            changed["classes"]["twoTerm"]["terms"][0] = "a*b"
        elif field == "identification_claim":
            changed["classes"]["twoTerm"]["coefficientsIdentifiableConditionalOnFixedBaseline"] = not changed["classes"]["twoTerm"]["coefficientsIdentifiableConditionalOnFixedBaseline"]
        elif field == "reduced_matrix":
            changed["classes"]["twoTerm"]["rref"] = [["1234567", "0"]]
        elif changed["classes"]["twoTerm"]["rows"]:
            changed["classes"]["twoTerm"]["rows"][0][0] = "1234567"
        else:
            changed["classes"]["twoTerm"]["rows"] = [["1234567", "0"]]
        try:
            check_certificate(changed, study)
        except (ValueError, KeyError):
            rejected.append(field)
        else:
            raise ValueError("Mutation was not rejected: " + field)
    print(json.dumps({
        "schemaVersion": "ignis-design-audit-verification-1",
        "certificateSha256": sha256(args.certificate.read_bytes()).hexdigest(),
        "arithmetic": "PASS", "method": "Python Fraction, Gram principal minors, exact nullspace residuals and monomial vanishing factors",
        "classes": classes, "mutationsRejected": rejected,
        "publisherPdf": check_pdf(args.pdf, study) if args.pdf else {"status": "NOT RUN", "reason": "No --pdf path supplied"},
        "physicalValidation": "NOT RUN", "independentHumanValidation": False,
    }, indent=2))


if __name__ == "__main__":
    main()
