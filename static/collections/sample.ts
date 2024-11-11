export function sample<T>(arr: ArrayLike<T>): T | undefined {
  const length = arr.length;
  return length === 0 ? undefined : arr[Math.floor(Math.random() * length)];
}
