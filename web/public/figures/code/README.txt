IGNIS figure reproduction

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
