export function randomInt(bound: number): number {
  return Math.trunc(Math.random() * bound);
}

export function randomElement<T>(arr: readonly T[]): T {
  return arr[randomInt(arr.length)];
}

export function arrayEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((val, index) => Object.is(val, b[index]));
}
