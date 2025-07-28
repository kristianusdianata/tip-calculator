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
export function usePipeline(...funcs) {
    return function wrapper(...args) {
        const [first, ...rest] = funcs;
        const result = rest.reduce((acc, fn) => fn(acc), first(...args));
        return result;
    };
}
