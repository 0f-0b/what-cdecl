export function makeArray<T>(length: number, fn: (index: number) => T): T[] {
  const result: T[] = [];
  for (let i = 0; i < length; i++) {
    result.push(fn(i));
  }
  return result;
}
