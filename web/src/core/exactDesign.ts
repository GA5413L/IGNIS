/** Exact rational linear algebra for small, bounded experimental-design matrices. */
export interface Fraction { readonly n: bigint; readonly d: bigint }
const abs = (n: bigint) => n < 0n ? -n : n;
function gcd(a: bigint, b: bigint): bigint {
  a = abs(a); b = abs(b);
  while (b !== 0n) { const r = a % b; a = b; b = r; }
  return a;
}
export function fraction(n: bigint, d = 1n): Fraction {
  if (d === 0n) throw new Error('Zero denominator');
  const sign = d < 0n ? -1n : 1n;
  const divisor = gcd(n, d);
  return { n: sign * n / divisor, d: sign * d / divisor };
}
export const ZERO = fraction(0n);
export const ONE = fraction(1n);
export function decimal(value: string): Fraction {
  if (!/^(?:0|[1-9]\d{0,4})(?:\.\d{1,6})?$/.test(value)) throw new Error('Expected a bounded exact decimal string');
  const [whole, part = ''] = value.split('.');
  return fraction(BigInt(whole + part), 10n ** BigInt(part.length));
}
export const add = (a: Fraction, b: Fraction) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
export const neg = (a: Fraction) => fraction(-a.n, a.d);
export const sub = (a: Fraction, b: Fraction) => add(a, neg(b));
export const mul = (a: Fraction, b: Fraction) => fraction(a.n * b.n, a.d * b.d);
export const div = (a: Fraction, b: Fraction) => fraction(a.n * b.d, a.d * b.n);
export const equal = (a: Fraction, b: Fraction) => a.n === b.n && a.d === b.d;
export const compare = (a: Fraction, b: Fraction) => a.n * b.d < b.n * a.d ? -1 : a.n * b.d > b.n * a.d ? 1 : 0;
export const rationalString = (a: Fraction) => a.d === 1n ? String(a.n) : `${a.n}/${a.d}`;

/** Nullspace vectors satisfy Mv=0. Pivot columns are zero based. No floating tolerance is used. */
export function rankCertificate(matrix: readonly (readonly Fraction[])[], columns: number) {
  if (!Number.isInteger(columns) || columns < 1 || columns > 8 || matrix.length > 32 || matrix.some((row) => row.length !== columns)) {
    throw new Error('Unsupported design matrix dimensions');
  }
  const rref = matrix.map((row) => [...row]);
  const pivots: number[] = [];
  for (let col = 0; col < columns && pivots.length < rref.length; col += 1) {
    const rowIndex = pivots.length;
    const found = rref.findIndex((row, index) => index >= rowIndex && row[col].n !== 0n);
    if (found < 0) continue;
    [rref[rowIndex], rref[found]] = [rref[found], rref[rowIndex]];
    const pivot = rref[rowIndex][col];
    rref[rowIndex] = rref[rowIndex].map((value) => div(value, pivot));
    for (let row = 0; row < rref.length; row += 1) {
      if (row === rowIndex || rref[row][col].n === 0n) continue;
      const factor = rref[row][col];
      rref[row] = rref[row].map((value, j) => sub(value, mul(factor, rref[rowIndex][j])));
    }
    pivots.push(col);
  }
  const freeColumns = Array.from({ length: columns }, (_, i) => i).filter((i) => !pivots.includes(i));
  const nullspace = freeColumns.map((free) => {
    const vector = Array.from({ length: columns }, () => ZERO);
    vector[free] = ONE;
    pivots.forEach((col, row) => { vector[col] = neg(rref[row][free]); });
    return vector.map(rationalString);
  });
  return {
    columns, rows: matrix.map((row) => row.map(rationalString)),
    rank: pivots.length, nullity: columns - pivots.length, pivotColumns: pivots, freeColumns,
    rref: rref.map((row) => row.map(rationalString)), nullspace,
  };
}
