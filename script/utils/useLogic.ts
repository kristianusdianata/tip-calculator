type Func = (...args: any[]) => any;

/**
 * A higher-order function used to wrap logic into another function.
 *
 * @function
 * @param func - The logic function
 * @returns A new function based on the logic that is given.
 * @example
 * const sum = useLogic<{ a: number; b: number }>(({ a, b }) => a + b);
 * console.log(sum({ a: 10, b: 20 })); // 30
 */
export function useLogic<Fn extends Func>(
  func: Fn
): (...args: Parameters<Fn>) => ReturnType<Fn> {
  return function wrapper(...args) {
    return func(...args);
  };
}
