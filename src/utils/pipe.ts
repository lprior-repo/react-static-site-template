// Functional pipe utility for composing transformations
// This enables clean function composition as preferred in functional programming

/* eslint-disable @typescript-eslint/no-explicit-any */

export function pipe<T>(value: T): T;
export function pipe<T, A>(value: T, fn1: (value: T) => A): A;
export function pipe<T, A, B>(value: T, fn1: (value: T) => A, fn2: (value: A) => B): B;
export function pipe<T, A, B, C>(
  value: T,
  fn1: (value: T) => A,
  fn2: (value: A) => B,
  fn3: (value: B) => C
): C;
export function pipe<T, A, B, C, D>(
  value: T,
  fn1: (value: T) => A,
  fn2: (value: A) => B,
  fn3: (value: B) => C,
  fn4: (value: C) => D
): D;
export function pipe<T, A, B, C, D, E>(
  value: T,
  fn1: (value: T) => A,
  fn2: (value: A) => B,
  fn3: (value: B) => C,
  fn4: (value: C) => D,
  fn5: (value: D) => E
): E;
export function pipe<T, A, B, C, D, E, F>(
  value: T,
  fn1: (value: T) => A,
  fn2: (value: A) => B,
  fn3: (value: B) => C,
  fn4: (value: C) => D,
  fn5: (value: D) => E,
  fn6: (value: E) => F
): F;
export function pipe<T, A, B, C, D, E, F, G>(
  value: T,
  fn1: (value: T) => A,
  fn2: (value: A) => B,
  fn3: (value: B) => C,
  fn4: (value: C) => D,
  fn5: (value: D) => E,
  fn6: (value: E) => F,
  fn7: (value: F) => G
): G;
export function pipe<T, A, B, C, D, E, F, G, H>(
  value: T,
  fn1: (value: T) => A,
  fn2: (value: A) => B,
  fn3: (value: B) => C,
  fn4: (value: C) => D,
  fn5: (value: D) => E,
  fn6: (value: E) => F,
  fn7: (value: F) => G,
  fn8: (value: G) => H
): H;

/**
 * Pipes a value through a series of functions, applying each function
 * to the result of the previous function. This enables clean functional
 * composition and avoids nested function calls.
 *
 * @example
 * const result = pipe(
 *   user,
 *   validateUser,
 *   sanitizeUserData,
 *   saveToDatabase,
 *   sendWelcomeEmail
 * );
 *
 * // Instead of:
 * // const result = sendWelcomeEmail(saveToDatabase(sanitizeUserData(validateUser(user))));
 */
export function pipe(value: any, ...fns: ((value: any) => any)[]): any {
  return fns.reduce((acc, fn) => fn(acc), value);
}

// Compose functions from right to left (opposite of pipe)
export function compose<T, A>(fn1: (value: T) => A): (value: T) => A;
export function compose<T, A, B>(fn2: (value: A) => B, fn1: (value: T) => A): (value: T) => B;
export function compose<T, A, B, C>(
  fn3: (value: B) => C,
  fn2: (value: A) => B,
  fn1: (value: T) => A
): (value: T) => C;
export function compose<T, A, B, C, D>(
  fn4: (value: C) => D,
  fn3: (value: B) => C,
  fn2: (value: A) => B,
  fn1: (value: T) => A
): (value: T) => D;

/**
 * Composes functions from right to left.
 *
 * @example
 * const transform = compose(
 *   addTimestamp,
 *   validateData,
 *   parseInput
 * );
 * const result = transform(rawInput);
 */
export function compose(...fns: ((value: any) => any)[]): (value: any) => any {
  return (value: any) => fns.reduceRight((acc, fn) => fn(acc), value);
}

// Curry function to enable partial application
export function curry<T, A>(fn: (arg: T) => A): (arg: T) => A;
export function curry<T, A, B>(fn: (arg1: T, arg2: A) => B): (arg1: T) => (arg2: A) => B;
export function curry<T, A, B, C>(
  fn: (arg1: T, arg2: A, arg3: B) => C
): (arg1: T) => (arg2: A) => (arg3: B) => C;

/**
 * Transforms a function to allow partial application.
 *
 * @example
 * const add = curry((a: number, b: number) => a + b);
 * const addFive = add(5);
 * const result = addFive(3); // 8
 */
export function curry(fn: (...args: any[]) => any): any {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return (...nextArgs: any[]) => curried(...args, ...nextArgs);
    }
  };
}
