const PERIOD_CHARACTER = ".";

export function formatInteger(n: number): string {
  const negative = n < 0;
  if (negative) n = -n;
  const parts = [n % 1000];
  while (n >= 1000) {
    n = Math.trunc(n / 1000);
    parts.unshift(n % 1000);
  }
  const [head, ...tail] = parts;
  return `${negative ? "-" : ""}${[head, ...tail.map((val) => String(val).padStart(3, "0"))].join(PERIOD_CHARACTER)}`;
}
