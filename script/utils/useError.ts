type FuncSync = (...args: any[]) => any;
type FuncAsync = (...args: any[]) => Promise<any>;

/**
 * Wraps a synchronous function with a try-catch block to safely handle errors.
 *
 * @param func - A synchronous function.
 * @returns A new function that returns either the original function's return value or an `Error` instance.
 * @example
 * const isEven = useError((val: number) => {
 *  if(val % 2 === 1) throw new Error("must be an even number")
 *  else return val
 * })
 *
 * const result = isEven(3)
 * if(result instanceof Error) {
 *  console.log(result.message) // must be an even number
 * }
 */
export function useError<Fn extends FuncSync>(
  func: Fn
): (...args: Parameters<Fn>) => ReturnType<Fn> | Error {
  return function wrapped(...args) {
    try {
      return func(...args);
    } catch (e) {
      /**
       * Handle error
       */
      if (e instanceof Error) {
        return new Error(e.message);
      } else {
        return new Error(`Unknown error: ${e}`);
      }
    }
  };
}

/**
 * Wraps a asynchronous function with a try-catch block to safely handle errors.
 *
 * @param func - A asynchronous function.
 * @returns A new function that returns either the original resolved function's return value or an `Error` instance.
 * @example
 * const validateEvenAsync = useErrorAsync(async (val: number) => {
 *   await new Promise((res) => setTimeout(res, 100)); // Simulate delay
 *   if (val % 2 !== 0) throw new Error("must be an even number");
 *   return val;
 * });
 *
 * // The function is called with an odd number
 * const result = await validateEvenAsync(3);
 * if (result instanceof Error) {
 *   console.log(result.message); // "must be an even number"
 * }
 */
export function useErrorAsync<Fn extends FuncAsync>(
  func: Fn
): (...args: Parameters<Fn>) => Promise<ReturnType<Fn> | Error> {
  return async function wrapped(...args) {
    try {
      return await func(...args);
    } catch (e) {
      /**
       * Handle error
       */
      if (e instanceof Error) {
        return new Error(e.message);
      } else {
        return new Error(`Unknown error: ${e}`);
      }
    }
  };
}
