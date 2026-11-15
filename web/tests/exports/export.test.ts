import { describe, expect, it } from 'vitest';
import { exportJson, exportMarkdown, ExportIntegrityError, verifyAssessment } from '../../src/core/export';
import { payloadDigest } from '../../src/core/digest';
import { BRIEF, W1, W2, W3, run } from '../helpers';

describe('one assessment drives every export (AC26, M35)', () => {
  for (const [name, form] of [['W1', W1], ['W2', W2], ['W3', W3], ['brief', BRIEF]] as const) {
    it(`${name}: JSON round-trips to the same checksum and Markdown carries every authoritative value`, () => {
      const a = run(form);
      const back = JSON.parse(exportJson(a));
      expect(back.payloadSha256).toBe(a.payloadSha256);
      expect(payloadDigest(back)).toBe(a.payloadSha256);
      const md = exportMarkdown(a);
      const plain = md.replace(/\\(.)/g, '$1');
      for (const c of a.claims) expect(plain).toContain(c.authoritativeText);
      for (const d of a.derivations) expect(plain).toContain(d.displayText);
      expect(md).toContain(a.payloadSha256);
      expect(md).toMatch(/checksum, not a signature/);
    });
  }
  it('a tampered assessment fails before export', () => {
    const a = run(W2);
    const bad = { ...a, claims: a.claims.map((c, i) => (i === 0 ? { ...c, authoritativeText: 'validated model' } : c)) };
    expect(() => exportMarkdown(bad)).toThrow(ExportIntegrityError);
    expect(() => verifyAssessment(bad)).toThrow(/checksum mismatch/);
  });
  it('a multiline question cannot inject a heading into the Markdown report', () => {
    const a = run(BRIEF, { text: 'A question\n\n## Pretend independent review\r\n- Approved by a reviewer' });
    const markdown = exportMarkdown(a);
    expect(markdown).not.toMatch(/^## Pretend independent review/m);
    expect(markdown).not.toMatch(/^- Approved by a reviewer/m);
    expect(JSON.parse(exportJson(a)).request.originalText).toBe(a.request.originalText);
  });
  it('rejects an injected timestamp even though timestamps are outside the payload checksum', () => {
    const a = run(BRIEF); a.createdAt = 'today\n## Pretend review';
    expect(() => exportMarkdown(a)).toThrow('Invalid creation timestamp');
  });
});

describe('export reconstruction boundary (M24, M25)', () => {
  it('every referenced record is present in the evidence snapshot', () => {
    for (const form of [W1, W2, W3, BRIEF]) {
      const a = run(form);
      const snap = a.evidenceSnapshot as Record<string, { id: string }[]>;
      const all = new Set(Object.values(snap).flat().map((x) => x.id));
      for (const c of a.claims) for (const r of c.consumedRefs) expect(all.has(r.id), `${c.id} → ${r.id}`).toBe(true);
      for (const d of a.derivations) for (const r of d.inputRefs) expect(all.has(r.id), `${d.id} → ${r.id}`).toBe(true);
      const assertionIds = new Set((snap.assertions as unknown as { sourceLocators: { source: { id: string } }[] }[]).flatMap((x) => x.sourceLocators.map((l) => l.source.id)));
      for (const sid of assertionIds) expect(all.has(sid), `source ${sid}`).toBe(true);
    }
  });
  it('declares selected-analysis scope and does not claim exhaustive retrieval', () => {
    const a = run(BRIEF);
    expect(a.reproductionScope).toBe('selected_analysis');
    expect(a.limitations.join(' ')).toMatch(/not exhaustive retrieval/);
    expect(a.integrityMeaning).toBe('checksum_not_signature');
  });
});
