/**
 * Exact decimal arithmetic on printed source values (BigInt mantissa + scale), so that
 * 29.9 × 1.82 is exactly 54.418 and not a binary-floating approximation (master §8.7).
 * Division is rounded half-even to a declared number of decimals; that rounding is software
 * arithmetic, not measurement uncertainty.
 */
export interface Dec { m: bigint; s: number } // value = m / 10^s

export function parseDec(text: string): Dec {
  const t = text.trim().replace(/,/g, '');
  if (!/^[+-]?\d+(\.\d+)?$/.test(t)) throw new Error(`not a plain decimal: ${text}`);
  const neg = t.startsWith('-');
  const body = t.replace(/^[+-]/, '');
  const [int, frac = ''] = body.split('.');
  const m = BigInt(int + frac) * (neg ? -1n : 1n);
  return { m, s: frac.length };
}

export const fromNumberText = (n: number): Dec => parseDec(String(n));
const pow10 = (n: number): bigint => 10n ** BigInt(n);
const align = (a: Dec, b: Dec): [bigint, bigint, number] => {
  const s = Math.max(a.s, b.s);
  return [a.m * pow10(s - a.s), b.m * pow10(s - b.s), s];
};

export const add = (a: Dec, b: Dec): Dec => { const [x, y, s] = align(a, b); return { m: x + y, s }; };
export const sub = (a: Dec, b: Dec): Dec => { const [x, y, s] = align(a, b); return { m: x - y, s }; };
export const mul = (a: Dec, b: Dec): Dec => ({ m: a.m * b.m, s: a.s + b.s });

/** a / b rounded half-even to `decimals` places. Throws on zero divisor (callers check preconditions first). */
export function div(a: Dec, b: Dec, decimals: number): Dec {
  if (b.m === 0n) throw new Error('division by zero');
  // a/b = (a.m / 10^a.s) / (b.m / 10^b.s) = a.m * 10^(b.s) / (b.m * 10^(a.s))
  let num = a.m * pow10(b.s + decimals);
  let den = b.m * pow10(a.s);
  if (den < 0n) { den = -den; num = -num; }
  const q = num / den;
  const r = num % den;
  const twice = (r < 0n ? -r : r) * 2n;
  let res = q;
  if (twice > den || (twice === den && (q % 2n !== 0n))) res = q + (num < 0n ? -1n : 1n);
  return { m: res, s: decimals };
}

export const scaleBy100 = (a: Dec): Dec => ({ m: a.m * 100n, s: a.s });

export function toText(a: Dec): string {
  const neg = a.m < 0n;
  let digits = (neg ? -a.m : a.m).toString();
  if (a.s === 0) return (neg ? '-' : '') + digits;
  digits = digits.padStart(a.s + 1, '0');
  let int = digits.slice(0, digits.length - a.s);
  const frac = digits.slice(digits.length - a.s).replace(/0+$/, '');
  if (!int) int = '0';
  const out = frac ? `${int}.${frac}` : int;
  return neg && out !== '0' ? `-${out}` : out;
}

export const toNumber = (a: Dec): number => Number(toText(a));

/** Round half-even to `decimals` places for display. */
export function round(a: Dec, decimals: number): Dec {
  if (a.s <= decimals) return a;
  return div(a, { m: 1n, s: 0 }, decimals);
}
