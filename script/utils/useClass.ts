export type Constructor = new (...args: any[]) => any;

/**
 * This function is used to create an instance of a given class constructor.
 *
 * @param targetClass - The class constructor.
 * @param args - The arguments to be passed to the constructor.
 * @returns The instance that was created from the given constructor
 * @example
 * class User {
 *   constructor(name, isAdmin) {
 *     this.name = name;
 *     this.isAdmin = isAdmin;
 *   }
 * }
 *
 * const userInstance = useClass(User, 'Alice', true);
 */
export function useClass<T extends Constructor>(
  targetClass: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new targetClass(...args);
}

export type UseClassType = typeof useClass;
