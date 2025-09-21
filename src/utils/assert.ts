// Assertive programming utilities following Pragmatic Programmer principles
// These help catch impossible states and provide better error messages

/**
 * Assert that a condition is true, throwing an error if it's false.
 * Used to catch programming errors and impossible states.
 */
export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Assert that a value is not null or undefined.
 */
export function assertExists<T>(value: T | null | undefined, message: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`Assertion failed: Expected value to exist, but got ${value}. ${message}`);
  }
}

/**
 * Assert that an array is not empty.
 */
export function assertNotEmpty<T>(
  array: readonly T[],
  message: string
): asserts array is readonly [T, ...T[]] {
  if (array.length === 0) {
    throw new Error(`Assertion failed: Expected non-empty array. ${message}`);
  }
}

/**
 * Assert that a string is not empty.
 */
export function assertNotEmptyString(value: string, message: string): asserts value is string {
  if (value.trim().length === 0) {
    throw new Error(`Assertion failed: Expected non-empty string. ${message}`);
  }
}

/**
 * Assert that a value is of a specific type.
 */
export function assertType<T>(
  value: unknown,
  predicate: (value: unknown) => value is T,
  message: string
): asserts value is T {
  if (!predicate(value)) {
    throw new Error(`Assertion failed: Type check failed. ${message}`);
  }
}

/**
 * Assert that a value is within a numeric range.
 */
export function assertInRange(value: number, min: number, max: number, message: string): void {
  if (value < min || value > max) {
    throw new Error(
      `Assertion failed: Expected value ${value} to be between ${min} and ${max}. ${message}`
    );
  }
}

/**
 * Assert that an object has a specific property.
 */
export function assertHasProperty<T, K extends string>(
  obj: T,
  property: K,
  message: string
): asserts obj is T & Record<K, unknown> {
  if (typeof obj !== 'object' || obj === null || !(property in obj)) {
    throw new Error(`Assertion failed: Expected object to have property '${property}'. ${message}`);
  }
}

/**
 * Assert that a value is never reached (for exhaustive checks).
 * Useful in switch statements to ensure all cases are handled.
 */
export function assertNever(value: never, message: string): never {
  throw new Error(`Assertion failed: Unexpected value ${JSON.stringify(value)}. ${message}`);
}

/**
 * Assert that an email address is valid format.
 */
export function assertValidEmail(email: string, message: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`Assertion failed: Invalid email format '${email}'. ${message}`);
  }
}

/**
 * Assert that a value is positive.
 */
export function assertPositive(value: number, message: string): void {
  if (value <= 0) {
    throw new Error(`Assertion failed: Expected positive number, got ${value}. ${message}`);
  }
}

/**
 * Assert that a state transition is valid.
 * Useful for state machines and validation flows.
 */
export function assertValidTransition<T>(
  from: T,
  to: T,
  validTransitions: ReadonlyMap<T, readonly T[]>,
  message: string
): void {
  const allowedTransitions = validTransitions.get(from);
  if (!allowedTransitions || !allowedTransitions.includes(to)) {
    throw new Error(
      `Assertion failed: Invalid state transition from '${String(from)}' to '${String(to)}'. ${message}`
    );
  }
}

/**
 * Create a runtime assertion that can be toggled in production.
 * In production, you might want to log instead of throwing.
 */
export function createConditionalAssert(shouldAssert: boolean) {
  return (condition: boolean, message: string): void => {
    if (!condition) {
      if (shouldAssert) {
        throw new Error(`Assertion failed: ${message}`);
      } else {
        console.warn(`Assertion would have failed: ${message}`);
      }
    }
  };
}

// Development-only assertions that are stripped in production
export const devAssert =
  process.env['NODE_ENV'] === 'development'
    ? assert
    : () => {
        /* no-op in production */
      };

export const devAssertExists =
  process.env['NODE_ENV'] === 'development'
    ? assertExists
    : () => {
        /* no-op in production */
      };
