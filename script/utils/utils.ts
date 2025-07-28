export function arrayLoopHandler<T>(
  datas: T[],
  handler: (data: T, index: number) => void
): void {
  for (const [index, data] of datas.entries()) {
    handler(data, index);
  }
}

export function objectLoopHandler<T extends Record<string, unknown>>(
  data: T,
  handler: (value: T[keyof T], key: keyof T) => void
): void {
  Object.entries(data).forEach(([key, value]) => {
    handler(value as T[keyof T], key as keyof T);
  });
}
