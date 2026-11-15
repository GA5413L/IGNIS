"""Recompute IGNIS rank-association statistics and optionally draw a research figure.

python plot-detector-association.py --data ignis-detector-association.json
python plot-detector-association.py --data ignis-detector-association.json --out association.svg

Checking needs Python 3.10+ standard library only. Drawing additionally needs
matplotlib==3.10.8. This checks the exported cells, not the original NASA workbook
or the JavaScript canonical checksum. Use `npm run analyze:association -- --replay
FILE` in the IGNIS repository for current-source and complete-result replay.
No p-values, confidence intervals, physical predictions or independence claims.
"""
import argparse
import json
import math
from collections import defaultdict
from pathlib import Path


def ranks(values):
    """Average ranks, using equality of finite supplied binary64 numbers."""
    ordered = sorted(enumerate(values), key=lambda pair: pair[1])
    answer = [0.0] * len(values)
    start = 0
    while start < len(ordered):
        stop = start + 1
        while stop < len(ordered) and ordered[stop][1] == ordered[start][1]:
            stop += 1
        rank = (start + 1 + stop) / 2
        for index, _ in ordered[start:stop]:
            answer[index] = rank
        start = stop
    return answer


def paired(rows):
    return [r for r in rows if r['measurementA']['status'] == 'finite' and r['measurementB']['status'] == 'finite']


def spearman(rows):
    finite = paired(rows)
    if len(finite) < 3:
        return None
    a = ranks([r['measurementA']['value'] for r in finite])
    b = ranks([r['measurementB']['value'] for r in finite])
    center = (len(a) + 1) / 2
    da, db = [v - center for v in a], [v - center for v in b]
    va, vb = math.fsum(v*v for v in da), math.fsum(v*v for v in db)
    if not va or not vb:
        return None
    return math.fsum(x*y for x, y in zip(da, db)) / math.sqrt(va * vb)


def equivalent(actual, expected):
    if actual is None or expected is None:
        return actual is expected
    return isinstance(expected, (int, float)) and math.isfinite(expected) and math.isclose(actual, expected, rel_tol=0, abs_tol=1e-12)


def verify_summary(rows, summary):
    if summary['selectedRows'] != len(rows) or summary['pairedFiniteRows'] != len(paired(rows)):
        raise ValueError('Row population differs from saved summary')
    rho = spearman(rows)
    if not equivalent(rho, summary['association']['rho']):
        raise ValueError('Rank coefficient differs from supplied source cells')
    for side in ('A', 'B'):
        available = paired(rows)
        saved = summary['association']['range' + side]
        values = [r['measurement' + side]['value'] for r in available]
        low, high = (min(values), max(values)) if values else (None, None)
        span = high - low if values else None
        if span is not None and not math.isfinite(span):
            span = None
        if saved['minimum'] != low or saved['maximum'] != high or saved['span'] != span:
            raise ValueError('Paired voltage range differs')
        for name, endpoint in [('minimumRecordIds', low), ('maximumRecordIds', high)]:
            if set(saved[name]) != {r['record']['id'] for r in available if r['measurement' + side]['value'] == endpoint}:
                raise ValueError('Range endpoint witnesses differ')
    checks = 1
    groups = defaultdict(list)
    for row in rows:
        sample = row['record']['sampleId']
        if sample is None or not str(sample).strip():
            if summary['deletion']['status'] != 'unidentified_rows':
                raise ValueError('Unidentified sample incorrectly admitted to deletion audit')
            return checks
        groups[(row['record']['flight'], sample)].append(row)
    deletion = summary['deletion']
    if not rows or len(groups) < 2:
        if deletion['deletions']:
            raise ValueError('Deletion result exists without enough groups')
        return checks
    if deletion['status'] != 'computed' or len(deletion['deletions']) != len(groups):
        raise ValueError('Deletion group population differs')
    observed = []
    seen = set()
    for saved in deletion['deletions']:
        key = (saved['flight'], saved['sampleId'])
        if key not in groups or key in seen:
            raise ValueError('Unknown or duplicated deletion group')
        seen.add(key)
        remaining = [r for r in rows if (r['record']['flight'], r['record']['sampleId']) != key]
        value = spearman(remaining)
        if not equivalent(value, saved['association']['rho']):
            raise ValueError('Deletion coefficient differs')
        if set(saved['recordIds']) != {r['record']['id'] for r in groups[key]}:
            raise ValueError('Deleted source witnesses differ')
        checks += 1
        if value is not None:
            observed.append(value)
    if not equivalent(min(observed) if observed else None, deletion['minimumRho']) or not equivalent(max(observed) if observed else None, deletion['maximumRho']):
        raise ValueError('Deletion range differs')
    return checks


def verify(result):
    if result['schemaVersion'] != 'ignis-detector-association-1' or result['methodRevision'] != 'detector-association-2026-11-15.1':
        raise ValueError('Unsupported source/method package')
    rows = result['rows']
    if len(rows) > 154:
        raise ValueError('More rows than the bounded corpus')
    seen = set()
    for row in rows:
        record = row['record']
        key = (record['workbookSha256'], record['sheet'], record['excelRow'])
        if key in seen or record['workbookSha256'] != result['source']['workbook']['sha256']:
            raise ValueError('Repeated or inconsistent source row')
        seen.add(key)
        for side in ('A', 'B'):
            cell = row['measurement' + side]
            if cell['cell'] != result['channel' + side]['column'] + str(record['excelRow']):
                raise ValueError('Cell does not match the selected column and row')
            if cell['status'] == 'finite':
                value = cell['value']
                if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or float(cell['originalValue']) != value:
                    raise ValueError('Finite cell differs from its original numeric token')
            elif cell['value'] is not None:
                raise ValueError('Unavailable cell has a substituted number')
    checks = verify_summary(rows, result['summary'])
    for material in result['byMaterial']:
        subset = [r for r in rows if r['record']['material'] == material['material']]
        checks += verify_summary(subset, material['summary'])
    for flight in result['byFlight']:
        subset = [r for r in rows if r['record']['flight'] == flight['flight']]
        checks += verify_summary(subset, flight['summary'])
        for material in flight['byMaterial']:
            checks += verify_summary([r for r in subset if r['record']['material'] == material['material']], material['summary'])
    return checks


def draw(result, output, palette):
    if output.exists():
        raise FileExistsError('Output exists; choose a new path')
    if output.suffix.lower() not in ('.svg', '.pdf', '.png'):
        raise ValueError('Figure must be SVG, PDF or PNG')
    import matplotlib
    matplotlib.use('Agg')
    from matplotlib import pyplot as plt
    materials = ['Kapton', 'Teflon', 'Lampwick', 'Silicone', 'Pyrell', 'DBP']
    colors = ['#0072B2', '#E69F00', '#009E73', '#CC79A7', '#6B6000', '#D55E00']
    markers = ['o', 's', '^', 'D', 'x', '+']
    fig, (scatter, coef) = plt.subplots(1, 2, figsize=(10.5, 4.5), layout='constrained')
    rows = paired(result['rows'])
    for i, material in enumerate(materials):
        selected = [r for r in rows if r['record']['material'] == material]
        if selected:
            scatter.scatter([r['measurementA']['value'] for r in selected], [r['measurementB']['value'] for r in selected],
                            label=material, marker=markers[i], color='black' if palette == 'monochrome' else colors[i], s=23, linewidths=.9)
    scatter.set(xlabel=result['channelA']['label'] + ' (stored V)', ylabel=result['channelB']['label'] + ' (stored V)')
    if rows:
        scatter.legend(fontsize=8)
    strata = [('All selected', result['summary'])] + [(r['material'], r['summary']) for r in result['byMaterial'] if r['summary']['selectedRows']]
    for i, (name, summary) in enumerate(strata):
        rho = spearman([r for r in result['rows'] if name == 'All selected' or r['record']['material'] == name])
        deletion = summary['deletion']
        if rho is not None:
            coef.plot(rho, i, 'o', color='black', markersize=4)
        if deletion['status'] == 'computed' and deletion['minimumRho'] is not None:
            coef.hlines(i, deletion['minimumRho'], deletion['maximumRho'], color='black' if palette == 'monochrome' else '#0072B2', linewidth=2)
    coef.set(yticks=range(len(strata)), yticklabels=[f'{name} (n={s["pairedFiniteRows"]})' for name, s in strata],
             xlim=(-1.05, 1.05), xlabel='Spearman rho; bar = recorded-group deletion range')
    coef.invert_yaxis()
    coef.axvline(0, color='.65', linewidth=.7)
    for ax in (scatter, coef):
        ax.spines[['top', 'right']].set_visible(False)
    flight = {'1': 'SAME', '2': 'SAME-R', 'all': 'SAME + SAME-R'}[result['selection']['flight']]
    fig.suptitle(f'{flight} detector rank association | descriptive, not a confidence interval', fontsize=11)
    fig.savefig(output, dpi=300)
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data', required=True, type=Path)
    parser.add_argument('--out', type=Path)
    parser.add_argument('--palette', choices=('okabe-ito', 'monochrome'), default='okabe-ito')
    args = parser.parse_args()
    if args.data.stat().st_size > 2 * 1024 * 1024:
        raise ValueError('Package exceeds 2 MiB')
    packet = json.loads(args.data.read_text(encoding='utf-8'))
    if set(packet) != {'schemaVersion', 'result', 'resultSha256'} or packet['schemaVersion'] != 'ignis-association-export-1':
        raise ValueError('Unsupported export wrapper')
    checks = verify(packet['result'])
    if args.out:
        draw(packet['result'], args.out, args.palette)
    print(json.dumps({'status': 'PASS', 'coefficientChecks': checks, 'pairedRows': len(paired(packet['result']['rows'])),
                      'rho': spearman(packet['result']['rows']), 'scope': 'Exported-cell arithmetic only; current-source/hash replay requires the IGNIS CLI.'}))


if __name__ == '__main__':
    main()
