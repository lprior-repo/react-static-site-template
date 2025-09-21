import type { Result, ValidationError, ValidationResult } from '../types';

// Pure functional error handling utilities

/**
 * Creates a successful result
 * @param data - The success data
 * @returns Success result
 */
export const success = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

/**
 * Creates a failure result
 * @param error - The error
 * @returns Failure result
 */
export const failure = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});

/**
 * Maps a successful result to a new value
 * @param result - The result to map
 * @param fn - Transformation function
 * @returns Mapped result
 */
export const mapResult = <T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> => {
  return result.success ? success(fn(result.data)) : result;
};

/**
 * Chains results together, short-circuiting on failure
 * @param result - The result to chain from
 * @param fn - Function that returns a new result
 * @returns Chained result
 */
export const chainResult = <T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> => {
  return result.success ? fn(result.data) : result;
};

/**
 * Extracts data from a result with a fallback value
 * @param result - The result to extract from
 * @param fallback - Fallback value if result is failure
 * @returns The data or fallback
 */
export const getResultData = <T>(result: Result<T, unknown>, fallback: T): T =>
  result.success ? result.data : fallback;

/**
 * Extracts error from a result with a fallback error
 * @param result - The result to extract from
 * @param fallback - Fallback error if result is success
 * @returns The error or fallback
 */
export const getResultError = <E>(result: Result<unknown, E>, fallback: E): E =>
  result.success ? fallback : result.error;

/**
 * Creates a validation error
 * @param field - Field name that failed validation
 * @param message - Error message
 * @returns ValidationError object
 */
export const createValidationError = (field: string, message: string): ValidationError => ({
  field,
  message,
});

/**
 * Creates a successful validation result
 * @returns Valid ValidationResult
 */
export const validationSuccess = (): ValidationResult => ({
  isValid: true,
  errors: [],
});

/**
 * Creates a failed validation result
 * @param errors - Array of validation errors
 * @returns Invalid ValidationResult
 */
export const validationFailure = (errors: readonly ValidationError[]): ValidationResult => ({
  isValid: false,
  errors,
});

/**
 * Combines multiple validation results
 * @param results - Array of validation results to combine
 * @returns Combined validation result
 */
export const combineValidationResults = (
  results: readonly ValidationResult[]
): ValidationResult => {
  const allErrors = results.flatMap((result) => result.errors);
  return allErrors.length === 0 ? validationSuccess() : validationFailure(allErrors);
};

/**
 * Validates a single field with a predicate function
 * @param value - Value to validate
 * @param fieldName - Name of the field being validated
 * @param predicate - Validation predicate function
 * @param errorMessage - Error message if validation fails
 * @returns ValidationResult for the field
 */
export const validateField = <T>(
  value: T,
  fieldName: string,
  predicate: (value: T) => boolean,
  errorMessage: string
): ValidationResult => {
  return predicate(value)
    ? validationSuccess()
    : validationFailure([createValidationError(fieldName, errorMessage)]);
};

/**
 * Validates that a string is not empty
 * @param value - String to validate
 * @param fieldName - Name of the field
 * @returns ValidationResult
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult =>
  validateField(value.trim(), fieldName, (v) => v.length > 0, `${fieldName} is required`);

/**
 * Validates email format
 * @param email - Email string to validate
 * @param fieldName - Name of the field
 * @returns ValidationResult
 */
export const validateEmail = (email: string, fieldName: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return validateField(
    email,
    fieldName,
    (v) => emailRegex.test(v),
    `${fieldName} must be a valid email address`
  );
};

/**
 * Validates minimum length
 * @param value - String to validate
 * @param fieldName - Name of the field
 * @param minLength - Minimum required length
 * @returns ValidationResult
 */
export const validateMinLength = (
  value: string,
  fieldName: string,
  minLength: number
): ValidationResult =>
  validateField(
    value,
    fieldName,
    (v) => v.length >= minLength,
    `${fieldName} must be at least ${minLength} characters long`
  );

/**
 * Safe error message extraction from unknown errors
 * @param error - Unknown error object
 * @returns Safe error message string
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
};

/**
 * Creates a safe error object from unknown input
 * @param error - Unknown error input
 * @returns Error object
 */
export const toError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error(getErrorMessage(error));
};
