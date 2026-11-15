"""Recount an endpoint audit and optionally verify both supplied accepted-manuscript copies.

python -I research/analysis/verify_endpoint_audit.py audit.json [--pdf copy1.pdf --alternate copy2.pdf]
Arithmetic uses the standard library. PDF checks need PyMuPDF. No network or figure digitization.
"""
from pathlib import Path
from fractions import Fraction as F
from copy import deepcopy
from hashlib import sha256
import argparse, json, re

ROOT = Path(__file__).resolve().parents[2]
CRITERIA = ['sustainedFlameSpread', 'visibleFlame', 'fuelRegression']


def require(condition, message):
    if not condition:
        raise ValueError(message)


def verify(audit, source):
    require(audit['schemaVersion'] == 'ignis-endpoint-audit-1', 'Unknown audit schema')
    require(audit['methodRevision'] == 'endpoint-audit-2026-11-15.1', 'Unknown method')
    require(audit['methodologicalSource'] == source, 'Source snapshot differs')
    request = audit['request']
    require(request['dataRole'] in ('hypothetical', 'user_supplied_unverified'), 'Invalid data role')
    model = request['idealizedModel']
    if model:
        for key in ['monotoneBinaryResponse', 'fixedContextWithinRun', 'settledResponseAtEachStep', 'errorFreeDetection']:
            require(model[key] is True, 'A required idealized assumption is missing')
    require(len(audit['runs']) == len(request['runs']), 'Run count differs')
    checked = []
    for run, result in zip(request['runs'], audit['runs']):
        require(run['id'] == result['id'], 'Run order or identity differs')
        for criterion in CRITERIA:
            report = result['criteria'][criterion]
            levels = {state: [(F(s['oxygenVolPercent']), s['id']) for s in run['steps'] if s['observations'][criterion] == state] for state in ['detected', 'not_detected', 'unknown']}
            require(report['counts'] == {'detected': len(levels['detected']), 'notDetected': len(levels['not_detected']), 'unknown': len(levels['unknown'])}, 'Observation counts differ')
            low = max((x for x, _ in levels['not_detected']), default=None)
            high = min((x for x, _ in levels['detected']), default=None)
            conflict = low is not None and high is not None and low >= high
            for key, value, state in [('maximumNotDetected', low, 'not_detected'), ('minimumDetected', high, 'detected')]:
                actual = report[key]
                require((actual is None) == (value is None), 'Missing-bound state differs')
                if value is not None:
                    require(F(actual['oxygenVolPercent']) == value, 'Observed coordinate differs')
                    require(actual['witnessStepIds'] == [step_id for x, step_id in levels[state] if x == value], 'Witness IDs differ')
            gap = None if low is None or high is None or conflict else high - low
            require((report['orderedSeparationGapPercentagePoints'] is None) == (gap is None), 'Gap state differs')
            if gap is not None:
                require(F(report['orderedSeparationGapPercentagePoints']) == gap, 'Exact gap differs')
            expected_pattern = 'inconsistent_with_idealized_monotone_model' if conflict else 'ordered_separation' if low is not None and high is not None else 'not_detected_only' if low is not None else 'detected_only' if high is not None else 'no_information'
            require(report['observationPattern'] == expected_pattern, 'Observation-pattern claim differs')
            require(report['sequence']['monotonicityValidated'] is False, 'Monotonicity validation was invented')
            require(report['testEndWithoutCriterionEvidenceIds'] == [s['id'] for s in run['steps'] if s['testEnded'] and s['observations'][criterion] == 'unknown'], 'Termination was promoted to criterion evidence')
            conditional = report['conditionalSet']
            missing = run['contextDescription'] is None or any(v is None for v in run['operators'][criterion].values())
            expected_status = 'not_requested' if model is None else 'no_information' if low is None and high is None else 'withheld_missing_observation_contract' if missing else 'withheld_inconsistent_with_model' if conflict else 'conditional_compatibility_set'
            require(conditional['status'] == expected_status, 'Conditional-set gate differs')
            require(not conditional['physicalThresholdEstablished'] and not conditional['confidenceInterval'], 'Unjustified physical or confidence claim')
            if expected_status != 'conditional_compatibility_set':
                require(conditional['lower'] is None and conditional['upper'] is None, 'Withheld set contains bounds')
            else:
                convention = model['boundaryConvention']
                for side, value in [('lower', low), ('upper', high)]:
                    bound = conditional[side]
                    require((bound is None) == (value is None), 'Censoring was replaced with a numeric bound')
                    if bound:
                        expected_boundary = 'undetermined' if convention == 'unspecified' else ('closed' if (side == 'lower') == (convention == 'detected_above') else 'open')
                        require(F(bound['oxygenVolPercent']) == value and bound['boundary'] == expected_boundary, 'Conditional bound/convention differs')
                # Direct predicate oracle at every observed boundary, between boundaries and beyond extremes.
                distinct = sorted({x for values in levels.values() for x, _ in values})
                probes = distinct + [(a+b)/2 for a, b in zip(distinct, distinct[1:])]
                if distinct:
                    probes += [distinct[0]-1, distinct[-1]+1]
                for theta in probes:
                    conventions = ['detected_at_or_above', 'detected_above'] if convention == 'unspecified' else [convention]
                    direct = any(all((x >= theta if mode == 'detected_at_or_above' else x > theta) == (state == 'detected') for state in ['detected', 'not_detected'] for x, _ in levels[state]) for mode in conventions)
                    lo, hi = conditional['lower'], conditional['upper']
                    enclosure = (lo is None or theta > F(lo['oxygenVolPercent']) or (theta == F(lo['oxygenVolPercent']) and lo['boundary'] != 'open')) and (hi is None or theta < F(hi['oxygenVolPercent']) or (theta == F(hi['oxygenVolPercent']) and hi['boundary'] != 'open'))
                    require(direct == enclosure, 'Direct predicate oracle disagrees with interval')
            checked.append({'run': run['id'], 'criterion': criterion, 'pattern': expected_pattern, 'conditionalSet': expected_status})
    for key in ['physicalPredictionProvided', 'extinctionDeclared', 'poolingAcrossRuns', 'independentRunsEstablished', 'sourceDataReconstructed']:
        require(audit['boundaries'][key] is False, 'Unjustified boundary claim: ' + key)
    return checked


def verify_pdf(path, alternate, source):
    import pymupdf
    binary = path.read_bytes()
    require(sha256(binary).hexdigest() == source['source']['canonicalPdfSha256'], 'Canonical PDF hash differs')
    require(len(binary) == source['source']['canonicalPdfBytes'], 'Canonical PDF size differs')
    doc = pymupdf.open(stream=binary, filetype='pdf')
    require(len(doc) == 9, 'Unexpected manuscript page count')
    def normalized(page):
        return ' '.join(line for line in doc[page-1].get_text().splitlines() if not re.fullmatch(r'\d{1,3}', line.strip())).replace('- ', '')
    anchors = [(1, 'Elsevier user license'), (3, 'forced flow velocity is fixed to 10 cm/s'), (4, '12.7 mm in diameter and 55 mm'), (4, '1.5 minutes'), (4, '0.5% to 1%'), (4, 'blue semicircle'), (5, 'stops spreading or extinguishes'), (5, 'standard deviation'), (5, '0.183'), (5, '100kW/m2'), (8, 'beyond the scope of this work')]
    for page, phrase in anchors:
        require(phrase in normalized(page), f'Printed anchor not found on page {page}: {phrase}')
    duplicate = {'status': 'NOT RUN'}
    if alternate:
        other_binary = alternate.read_bytes()
        require(sha256(other_binary).hexdigest() == source['source']['alternatePdfSha256'], 'Alternate PDF hash differs')
        require(len(other_binary) == source['source']['alternatePdfBytes'], 'Alternate PDF size differs')
        other = pymupdf.open(stream=other_binary, filetype='pdf')
        require(len(other) == len(doc), 'Duplicate page count differs')
        require(all(doc[i].get_text() == other[i].get_text() for i in range(len(doc))), 'Extracted manuscript text differs')
        require(all(doc[i].get_pixmap(matrix=pymupdf.Matrix(1,1)).samples == other[i].get_pixmap(matrix=pymupdf.Matrix(1,1)).samples for i in range(len(doc))), 'Rendered pages differ')
        duplicate = {'status': 'PASS', 'textIdentical': True, 'identicalPageRendersAt72Dpi': 9, 'byteIdentical': binary == other_binary}
        other.close()
    doc.close()
    return {'status': 'PASS', 'printedAnchorsChecked': len(anchors), 'duplicateCheck': duplicate, 'figureMeasurementsDigitized': 0}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('audit', type=Path)
    parser.add_argument('--pdf', type=Path)
    parser.add_argument('--alternate', type=Path)
    args = parser.parse_args()
    require(args.audit.stat().st_size < 2*1024*1024, 'Audit file too large')
    source = json.loads((ROOT/'web/data/endpoint-studies/liveretou2024.json').read_text(encoding='utf-8-sig'))
    audit = json.loads(args.audit.read_text(encoding='utf-8-sig'))
    checked = verify(audit, source)
    mutations = []
    for name in ['physical_claim', 'source_data', 'counts']:
        changed = deepcopy(audit)
        if name == 'physical_claim': changed['boundaries']['extinctionDeclared'] = True
        elif name == 'source_data': changed['methodologicalSource']['endpoint']['perRunTransitionsAvailable'] = True
        elif changed['runs']: changed['runs'][0]['criteria']['sustainedFlameSpread']['counts']['detected'] += 1
        else: continue
        try: verify(changed, source)
        except ValueError: mutations.append(name)
        else: raise ValueError('Corrupted audit was accepted: '+name)
    print(json.dumps({'schemaVersion': 'ignis-endpoint-verification-1', 'auditSha256': sha256(args.audit.read_bytes()).hexdigest(), 'arithmetic': 'PASS', 'method': 'Python Fraction and direct binary-predicate checks at boundaries, between them and beyond extremes', 'criteria': checked, 'mutationsRejected': mutations, 'sourcePdf': verify_pdf(args.pdf, args.alternate, source) if args.pdf else {'status': 'NOT RUN'}, 'physicalValidation': 'NOT RUN', 'independentHumanValidation': False}, indent=2))


if __name__ == '__main__':
    main()
