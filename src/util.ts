export function randomInt(bound: number): number {
  return Math.trunc(Math.random() * bound);
}

export function randomElement<T>(arr: readonly T[]): T {
  return arr[randomInt(arr.length)];
}

export function arrayEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  return a.length === b.length && a.every((val, index) => Object.is(val, b[index]));
}

export function joinArray<T>(arr: readonly T[], sep: T): T[] {
  const result: T[] = [];
  const length = arr.length;
  if (length) {
    result.push(arr[0]);
    for (let i = 1; i < length; i++)
      result.push(sep, arr[i]);
  }
  return result;
}
