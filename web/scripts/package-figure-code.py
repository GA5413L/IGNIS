"""Package our plotting source and its exact data for a researcher to download and run.

Run after export-figure-data.ts and after generating both palettes. No source binaries or
third-party implementation code are redistributed. Dependencies are pinned separately.
"""
from pathlib import Path
import hashlib
import importlib.metadata
import json
import shutil
import zipfile

root = Path(__file__).resolve().parents[1]
out = root / 'public/figures/code'
out.mkdir(parents=True, exist_ok=True)
source = root / 'scripts/make-figures.py'
data = root / 'artifacts/figures/figure-data.json'
shutil.copyfile(source, out / 'make-figures.py')
shutil.copyfile(data, out / 'figure-data.json')
versions = {package: importlib.metadata.version(package) for package in ('paperplot-quantum', 'matplotlib', 'numpy')}
(out / 'requirements.txt').write_text(''.join(f'{k}=={v}\n' for k, v in versions.items()), encoding='utf-8', newline='\n')
(out / 'README.txt').write_text('''IGNIS figure reproduction

Contents: our plotting source, the exact numeric input packet, dependency pins and checksums.
These are derived plotting inputs; original NASA binaries and the full analysis engine are
not included. Source lineage and analysis contracts live in https://github.com/GA5413L/IGNIS.

Use a Python virtual environment and install the pinned requirements:
    python -m pip install -r requirements.txt
    python make-figures.py --data figure-data.json --out output --palette okabe-ito

One figure or monochrome output:
    python make-figures.py --data figure-data.json --out output --figure 3 --palette monochrome

Figure identifiers: 1 atmosphere coordinates, 2 detector readings, 3 paired channels,
4 evidence coverage. PNG, SVG and PDF are written. Plot jitter is deterministic (seed 7)
and conveys no data. Numeric inputs and plotting instructions are reproducible; binary
PDF/image bytes can differ with fonts, metadata or platform rendering. The manifest hashes
identify the supplied files, not the scientific validity of their contents.

No fitting, confidence intervals or physical simulation is performed. Read each figure's
caption and the source-specific limitations in the application before interpreting it.
''', encoding='utf-8', newline='\n')
files = ['make-figures.py','figure-data.json','requirements.txt','README.txt']
manifest = {'schemaVersion':'ignis-figure-reproduction-1','dataRevision':'2026-11-15.r2','dependencies':versions,
            'palettes':['okabe-ito','monochrome'],'figureIds':[1,2,3,4],
            'files':{name:{'bytes':(out/name).stat().st_size,'sha256':hashlib.sha256((out/name).read_bytes()).hexdigest()} for name in files}}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8',newline='\n')
with zipfile.ZipFile(out/'ignis-figure-reproduction.zip', 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for name in files + ['manifest.json']:
        info=zipfile.ZipInfo(name, date_time=(2026,11,15,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
        archive.writestr(info,(out/name).read_bytes())
print(json.dumps({'files':len(files)+1,'zipBytes':(out/'ignis-figure-reproduction.zip').stat().st_size,'dataSha256':manifest['files']['figure-data.json']['sha256']}))
