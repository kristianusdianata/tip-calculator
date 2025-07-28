export type Func = [(...args: any[]) => any, ...((args: any) => any)[]];

export type PipeInput<T extends Func> = T extends [
  (...args: infer FirstArgs) => any,
  ...any[]
]
  ? FirstArgs
  : never;

export type PipeOutput<T extends Func> = T extends [...any[], infer LastTuple]
  ? LastTuple extends (...args: any[]) => infer LastTupleReturnType
    ? LastTupleReturnType
    : never
  : never;

/**
 * A higher-order function used to combine multiple logic functions into one pipeline.
 *
 * @function
 * @param funcs - A list of logic functions
 * @returns Returns a new function based on the logic functions that are given.
 * @example
 * const trim = (str: string) => str.trim();
 * const toUpper = (str: string) => str.toUpperCase();
 *
 * const cleanAndUpper = usePipeline(trim, toUpper);
 * const result = cleanAndUpper("  hello  "); // "HELLO"
 */
export function usePipeline<Fn extends Func>(
  ...funcs: Fn
): (...arg: PipeInput<Fn>) => PipeOutput<Fn> {
  return function wrapper(...args) {
    const [first, ...rest] = funcs;
    const result = rest.reduce((acc, fn) => fn(acc), first(...args));
    return result as PipeOutput<Fn>;
  };
}
