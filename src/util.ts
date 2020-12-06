export function randomElement<T>(arr: readonly T[]): T {
  return arr[Math.trunc(Math.random() * arr.length)];
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
