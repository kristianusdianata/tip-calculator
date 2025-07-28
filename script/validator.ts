import { useError, usePipeline, useLogic } from "./utils/index.js";

export const useValidator = useError((input: any) => {
  const validation = usePipeline(
    /**
     * step 1
     * validate type data
     */
    useLogic((input: any): number => {
      if (typeof input !== "number" || Number.isNaN(input)) {
        throw new Error("Must be number");
      }

      return input;
    }),

    /**
     * Step 2
     * validate input
     */
    useLogic((input: number): number => {
      if (input <= 0) throw new Error("Can't be less than 1");
      return input;
    })
  );

  return validation(input);
});

export type UseValidatorType = typeof useValidator;
