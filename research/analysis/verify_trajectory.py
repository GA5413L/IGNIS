"""Recount tracked-coordinate arithmetic and optionally verify the supplied dissertation.

python -I research/analysis/verify_trajectory.py result.json [--pdf dissertation.pdf]
Standard-library Fraction arithmetic; optional PDF text checks need PyMuPDF. No digitization.
This is a second implementation with shared AI-assisted authorship, not independent validation.
"""
from pathlib import Path
from fractions import Fraction as F
from itertools import product
from copy import deepcopy
from hashlib import sha256
import argparse, json, re

ROOT = Path(__file__).resolve().parents[2]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def verify(result):
    require(result['schemaVersion'] == 'ignis-trajectory-result-1', 'Result schema differs')
    require(result['methodRevision'] == 'trajectory-ops-2026-11-15.1', 'Method differs')
    require(result['boundaries'] == dict(physicalPrediction=False, measurementValidated=False, sourceDataReconstructed=False, statisticalIndependenceEstablished=False, safetyAssessment=False), 'Physical/validation claim changed')
    q = result['request']
    require(q['dataRole'] in ('hypothetical', 'user_supplied_unverified'), 'Invalid data role')
    require(q['positionUnit'] == 'mm' and q['timeUnit'] == 's', 'Units differ')
    records = q['samples']['points']
    if q['samples']['kind'] == 'video_frames':
        fps = q['samples']['framesPerSecond']
        period = F(int(fps['denominator']), int(fps['numerator']))
        times = [int(p['frameIndex']) * period for p in records]
    else:
        times = [F(p['timeSeconds']) for p in records]
    require(all(b > a for a, b in zip(times, times[1:])), 'Unordered/duplicate times')
    points = {p['id']: (times[i], F(p['positionMM']), None if p['absolutePositionErrorBoundMM'] is None else F(p['absolutePositionErrorBoundMM'])) for i, p in enumerate(records)}
    require(len(points) == len(records), 'Duplicate sample identity')
    require(result['normalizedTimesSeconds'] == [dict(sampleId=p['id'], timeSeconds=str(times[i])) for i, p in enumerate(records)], 'Exact time normalization differs')
    require(len(result['windows']) == len(q['windows']), 'Window count differs')
    missing = [key for key, value in q['contract'].items() if value is None]
    require(result['missingContract'] == missing, 'Missing contract differs')
    if q['measurementAssumptions'] is not None:
        require(q['measurementAssumptions'] == dict(timestampsExact=True, positionBoundsAreAbsolute=True, sameTrackedFeatureAndCoordinateSystem=True), 'Assumptions differ')
    for w, actual in zip(q['windows'], result['windows']):
        ta, ya, ea = points[w['from']]
        tb, yb, eb = points[w['to']]
        require(tb > ta, 'Window reverses time')
        require(all(actual[k] == w[k] for k in ['id', 'from', 'to']), 'Window identity differs')
        elapsed, displacement = tb - ta, yb - ya
        require(F(actual['elapsedSeconds']) == elapsed and F(actual['displacementMM']) == displacement, 'Coordinate differences differ')
        require(F(actual['netDisplacementPerElapsedSecond']) == displacement / elapsed, 'Secant differs')
        require(actual['instantaneousRateEstablished'] is False and actual['withinWindowMonotonicityEstablished'] is False, 'Unjustified derivative/monotonicity')
        bound = actual['conditionalPositionBound']
        status = 'not_requested' if q['measurementAssumptions'] is None else 'withheld_missing_contract' if missing else 'withheld_missing_endpoint_bound' if ea is None or eb is None else 'conditional_worst_case_interval'
        require(bound['status'] == status and bound['confidenceInterval'] is False, 'Bound gate or meaning differs')
        if status == 'conditional_worst_case_interval':
            # Direct endpoint-box enumeration rather than copying the sum-of-errors formula.
            corners = [(yb + b * eb - (ya + a * ea)) / elapsed for a, b in product([-1, 1], repeat=2)]
            require(F(bound['lowerMMPerS']) == min(corners) and F(bound['upperMMPerS']) == max(corners), 'Endpoint-box bounds differ')
            require(F(bound['halfWidthMMPerS']) == (max(corners) - min(corners)) / 2, 'Half width differs')
        else:
            require(all(bound[k] is None for k in ['lowerMMPerS', 'upperMMPerS', 'halfWidthMMPerS']), 'Withheld bound contains numbers')
    pairs = []
    for i, a in enumerate(q['windows']):
        for b in q['windows'][i+1:]:
            shared = [s for s in [a['from'], a['to']] if s in [b['from'], b['to']]]
            if shared:
                pairs.append(dict(windowIds=[a['id'], b['id']], sampleIds=shared))
    require(result['sharedEndpointPairs'] == pairs, 'Shared endpoints differ')


def check_source(source, pdf):
    rows = source['printedMeanHeatRelease']['rows']
    expected = [dict(pressureKPa=p, microgravityKW=m, earthGravityKW=e) for p, m, e in zip(['40', '60', '80', '100'], ['0.53', '0.90', '1.24', '1.89'], ['0.18', '0.39', '0.61', '0.85'])]
    require(rows == expected, 'Table 1 transcription differs')
    require(source['lineage']['independentReplication'] is False and source['lineage']['rawTrajectoriesAcquired'] is False, 'Source lineage/availability claim differs')
    require(source['printedMeanHeatRelease']['uncertainty'] is None and source['printedMeanHeatRelease']['durationsSeconds'] is None, 'Unknown source quantities invented')
    require(source['rodContext']['initialOxygenVolPercent'] is None, 'Universal initial oxygen invented')
    require([row['exponent'] for row in source['separateSheetStudy']['reportedPowerLawExponents']] == ['-0.5', '-1', '-2', '-0.5', '-0.75', '-0.75'], 'Tables 2-3 exponents differ')
    require(all(v is False for v in source['boundaries'].values()), 'Source execution/validation claim changed')
    if pdf is None:
        return {'status': 'NOT RUN', 'reason': 'No original PDF supplied; dossier facts recounted only.'}
    import pymupdf
    raw = pdf.read_bytes()
    require(sha256(raw).hexdigest() == source['source']['pdfSha256'], 'PDF hash differs')
    require(len(raw) == source['source']['bytes'], 'PDF byte count differs')
    doc = pymupdf.open(pdf)
    require(len(doc) == 96, 'PDF page count differs')
    def page(n):
        return re.sub(r'\s+', ' ', doc[n-1].get_text())
    anchors = {
        30: ['using the same data as in Chapter 3', 'No external radiant flux was used here'],
        46: ['flame visually extinguishes'],
        49: ['only tested either once or twice', 'lowered into position'],
        50: ['time=0 s corresponds', 'lower than 21%'],
        51: ['Microgravity 0.53 0.90 1.24 1.89 Earth Gravity 0.18 0.39 0.61 0.85', '13.1 kJ/g'],
        62: ['30 frames per second', 'frequency of 1 Hz'],
        63: ['second order polynomial curve', 'derivative of the polynomial'],
        65: ['lower than 21%', '40 kPa and 60 kPa'],
        66: ['elevated oxygen concentrations'],
        79: ['V ≈P −0.5 V ≈P −1 V ≈P −2', 'V ≈P −0.5 V ≈P −0.75 V ≈P −0.75'],
        95: ['R2 = 0.992'],
    }
    for n, texts in anchors.items():
        for text in texts:
            require(text in page(n), f'Missing printed anchor on PDF page {n}')
    return {'status': 'PASS', 'pdfPages': len(doc), 'printedTextAnchors': sum(map(len, anchors.values())), 'figureDigitization': False, 'fullScientificValidation': False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('result', type=Path)
    parser.add_argument('--pdf', type=Path)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    result = json.loads(args.result.read_text(encoding='utf-8-sig'))
    source_path = ROOT/'web/data/trajectory-studies/liveretou2025.json'
    source = json.loads(source_path.read_text(encoding='utf-8'))
    verify(result)
    mutations = []
    mutation_cases = [
        ('invented physical claim', lambda r: r['boundaries'].update(physicalPrediction=True)),
        ('fabricated shared endpoint', lambda r: r['sharedEndpointPairs'].append(dict(windowIds=['fabricated', 'other'], sampleIds=['fabricated']))),
    ]
    if result['windows']:
        mutation_cases.extend([
            ('altered secant', lambda r: r['windows'][0].update(netDisplacementPerElapsedSecond=str(F(r['windows'][0]['netDisplacementPerElapsedSecond']) + 1))),
            ('invented instantaneous claim', lambda r: r['windows'][0].update(instantaneousRateEstablished=True)),
        ])
    for name, mutate in mutation_cases:
        changed = deepcopy(result); mutate(changed)
        try:
            verify(changed)
        except ValueError:
            mutations.append(name)
        else:
            raise ValueError(f'Corruption was accepted: {name}')
    report = dict(status='PASS', methodRevision=result['methodRevision'], windowsRecounted=len(result['windows']), artifactSha256=sha256(args.result.read_bytes()).hexdigest(), sourceDossierSha256=sha256(source_path.read_bytes()).hexdigest(), sourceVerification=check_source(source, args.pdf), corruptionsRejected=mutations, independentValidation=False, physicalExperiments='NOT RUN', sourceTrajectoryReconstruction='NOT RUN')
    if args.output:
        args.output.write_text(json.dumps(report, indent=2)+'\n', encoding='utf-8', newline='\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
