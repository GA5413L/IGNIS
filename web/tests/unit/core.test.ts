import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { canonicalJson, sha256Hex } from '../../src/core/canonicalize';
import { parseDec, mul, div, sub, toText, round } from '../../src/core/decimal';
import { getCatalog } from '../../src/core/registry';
import { catalog } from '../helpers';

describe('canonicalization and checksum', () => {
  it('pure SHA-256 matches node:crypto', () => {
    for (const t of ['', 'abc', 'IGNIS ⚡ 54.418 g', 'x'.repeat(1000), JSON.stringify({ a: [1, 2, null] })]) {
      expect(sha256Hex(t)).toBe(createHash('sha256').update(t, 'utf8').digest('hex'));
    }
  });
  it('sorts keys, keeps array order, rejects non-finite numbers', () => {
    expect(canonicalJson({ b: 1, a: [3, 1] })).toBe('{"a":[3,1],"b":1}');
    expect(() => canonicalJson({ x: Number.NaN })).toThrow(/non-finite/);
    expect(() => canonicalJson({ x: Infinity })).toThrow(/non-finite/);
  });
});

describe('exact decimal arithmetic (master §17.4)', () => {
  it('54.4 / 29.9 ≈ 1.8193979933 and 29.9 × 1.82 = 54.418 exactly', () => {
    expect(toText(div(parseDec('54.4'), parseDec('29.9'), 12))).toBe('1.819397993311');
    expect(toText(mul(parseDec('29.9'), parseDec('1.82')))).toBe('54.418');
    expect(toText(sub(parseDec('54.418'), parseDec('54.4')))).toBe('0.018');
  });
  it('NIST/rod reference arithmetic from the spec (illustrative only)', () => {
    expect(toText(sub(parseDec('26.69'), parseDec('-1.45')))).toBe('28.14');
    expect(toText(sub(parseDec('26.9'), parseDec('32.5')))).toBe('-5.6');
    expect(toText(mul(parseDec('101.3'), parseDec('0.21')))).toBe('21.273');
  });
  it('rounds half-even and refuses division by zero', () => {
    expect(toText(round(parseDec('0.125'), 2))).toBe('0.12');
    expect(toText(round(parseDec('0.135'), 2))).toBe('0.14');
    expect(() => div(parseDec('1'), parseDec('0'), 4)).toThrow(/zero/);
  });
});

describe('reviewed registry (master §7.5, M02, M03)', () => {
  it('parses and validates with zero errors', () => {
    const { snapshot, errors } = getCatalog();
    expect(errors).toEqual([]);
    expect(snapshot).not.toBeNull();
  });
  it('has the ten investigation entries covering every named challenge family', () => {
    const ids = catalog().investigations.map((i) => i.id).sort();
    expect(ids).toEqual(['INV-BASS', 'INV-BASS-II', 'INV-FLEX', 'INV-SAFFIRE-I', 'INV-SAFFIRE-II', 'INV-SAFFIRE-III', 'INV-SAFFIRE-V', 'INV-SAFFIRE-VI', 'INV-SAME', 'INV-SAME-R'].sort());
  });
  it('never counts an objective as a finding, and profile-only entries list no findings', () => {
    const s = catalog();
    for (const f of s.findings) {
      const a = s.assertions.find((x) => x.id === f.assertionRef.id)!;
      if (f.briefRole === 'finding') expect(a.kind).not.toBe('objective');
    }
    for (const i of s.investigations.filter((x) => x.coverage === 'profile_only')) expect(i.findingIds).toEqual([]);
  });
  it('keeps unknown values unknown (no placeholder numbers)', () => {
    const series = catalog().observations.find((o) => o.id === 'OBS-SVI-RS-CO2-SERIES')!;
    expect(series.value?.state).toBe('unknown');
    expect(series.value?.value).toBeNull();
  });
  it('records observed source hashes equal to the inherited expected hashes for the Saffire PDFs', () => {
    for (const id of ['SRC-S-V', 'SRC-S-VI', 'SRC-S-CAL']) {
      const s = catalog().sources.find((x) => x.id === id)!;
      expect(s.observedSha256).toBe(s.expectedSha256);
    }
  });
});
