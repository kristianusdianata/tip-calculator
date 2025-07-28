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
export function useClass(targetClass, ...args) {
    return new targetClass(...args);
}
