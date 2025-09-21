import { describe, expect, it } from 'vitest';
import {
  chainResult,
  combineValidationResults,
  createValidationError,
  failure,
  getErrorMessage,
  getResultData,
  getResultError,
  mapResult,
  success,
  toError,
  validateEmail,
  validateField,
  validateMinLength,
  validateRequired,
  validationFailure,
  validationSuccess,
} from './error';

describe('Result Type Functions', () => {
  describe('success', () => {
    it('should create a successful result', () => {
      const result = success('test data');

      expect(result).toEqual({
        success: true,
        data: 'test data',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('failure', () => {
    it('should create a failure result', () => {
      const error = new Error('test error');
      const result = failure(error);

      expect(result).toEqual({
        success: false,
        error,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('mapResult', () => {
    it('should transform successful result data', () => {
      const result = success(5);
      const mapped = mapResult(result, (x) => x * 2);

      expect(mapped).toEqual({
        success: true,
        data: 10,
      });
    });

    it('should pass through failure without transformation', () => {
      const error = new Error('test error');
      const result = failure(error);
      const mapped = mapResult(result, (x) => x * 2);

      expect(mapped).toEqual({
        success: false,
        error,
      });
    });
  });

  describe('chainResult', () => {
    it('should chain successful results', () => {
      const result = success(5);
      const chained = chainResult(result, (x) => success(x * 2));

      expect(chained).toEqual({
        success: true,
        data: 10,
      });
    });

    it('should short-circuit on failure', () => {
      const error = new Error('test error');
      const result = failure(error);
      const chained = chainResult(result, (x) => success(x * 2));

      expect(chained).toEqual({
        success: false,
        error,
      });
    });

    it('should propagate failure from chained function', () => {
      const result = success(5);
      const error = new Error('chain error');
      const chained = chainResult(result, () => failure(error));

      expect(chained).toEqual({
        success: false,
        error,
      });
    });
  });

  describe('getResultData', () => {
    it('should extract data from successful result', () => {
      const result = success('test data');
      const data = getResultData(result, 'fallback');

      expect(data).toBe('test data');
    });

    it('should return fallback for failed result', () => {
      const result = failure(new Error('test error'));
      const data = getResultData(result, 'fallback');

      expect(data).toBe('fallback');
    });
  });

  describe('getResultError', () => {
    it('should extract error from failed result', () => {
      const error = new Error('test error');
      const result = failure(error);
      const extractedError = getResultError(result, new Error('fallback'));

      expect(extractedError).toBe(error);
    });

    it('should return fallback for successful result', () => {
      const result = success('test data');
      const fallbackError = new Error('fallback');
      const extractedError = getResultError(result, fallbackError);

      expect(extractedError).toBe(fallbackError);
    });
  });
});

describe('Validation Functions', () => {
  describe('createValidationError', () => {
    it('should create validation error object', () => {
      const error = createValidationError('email', 'Invalid email format');

      expect(error).toEqual({
        field: 'email',
        message: 'Invalid email format',
      });
    });
  });

  describe('validationSuccess', () => {
    it('should create successful validation result', () => {
      const result = validationSuccess();

      expect(result).toEqual({
        isValid: true,
        errors: [],
      });
    });
  });

  describe('validationFailure', () => {
    it('should create failed validation result', () => {
      const errors = [createValidationError('email', 'Required')];
      const result = validationFailure(errors);

      expect(result).toEqual({
        isValid: false,
        errors,
      });
    });
  });

  describe('combineValidationResults', () => {
    it('should return success when all validations pass', () => {
      const results = [validationSuccess(), validationSuccess()];
      const combined = combineValidationResults(results);

      expect(combined.isValid).toBe(true);
      expect(combined.errors).toHaveLength(0);
    });

    it('should combine all errors when validations fail', () => {
      const error1 = createValidationError('email', 'Required');
      const error2 = createValidationError('name', 'Too short');
      const results = [validationFailure([error1]), validationFailure([error2])];
      const combined = combineValidationResults(results);

      expect(combined.isValid).toBe(false);
      expect(combined.errors).toHaveLength(2);
      expect(combined.errors).toContain(error1);
      expect(combined.errors).toContain(error2);
    });
  });

  describe('validateField', () => {
    it('should pass validation with valid predicate', () => {
      const result = validateField(
        'test@example.com',
        'email',
        (value) => value.includes('@'),
        'Must contain @'
      );

      expect(result.isValid).toBe(true);
    });

    it('should fail validation with invalid predicate', () => {
      const result = validateField(
        'invalid-email',
        'email',
        (value) => value.includes('@'),
        'Must contain @'
      );

      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toEqual(createValidationError('email', 'Must contain @'));
    });
  });

  describe('validateRequired', () => {
    it('should pass for non-empty string', () => {
      const result = validateRequired('test', 'name');
      expect(result.isValid).toBe(true);
    });

    it('should fail for empty string', () => {
      const result = validateRequired('', 'name');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]?.message).toBe('name is required');
    });

    it('should fail for whitespace-only string', () => {
      const result = validateRequired('   ', 'name');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('should pass for valid email', () => {
      const result = validateEmail('test@example.com', 'email');
      expect(result.isValid).toBe(true);
    });

    it('should fail for invalid email format', () => {
      const result = validateEmail('invalid-email', 'email');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]?.message).toBe('email must be a valid email address');
    });

    it('should fail for empty email', () => {
      const result = validateEmail('', 'email');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateMinLength', () => {
    it('should pass for string meeting minimum length', () => {
      const result = validateMinLength('hello world', 'message', 5);
      expect(result.isValid).toBe(true);
    });

    it('should fail for string below minimum length', () => {
      const result = validateMinLength('hi', 'message', 5);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]?.message).toBe('message must be at least 5 characters long');
    });
  });
});

describe('Error Handling Utilities', () => {
  describe('getErrorMessage', () => {
    it('should extract message from Error object', () => {
      const error = new Error('Test error message');
      const message = getErrorMessage(error);
      expect(message).toBe('Test error message');
    });

    it('should return string error as-is', () => {
      const message = getErrorMessage('String error');
      expect(message).toBe('String error');
    });

    it('should return default message for unknown error types', () => {
      const message = getErrorMessage({ unknown: 'object' });
      expect(message).toBe('An unknown error occurred');
    });

    it('should handle null and undefined', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred');
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
    });
  });

  describe('toError', () => {
    it('should return Error object as-is', () => {
      const error = new Error('Test error');
      const result = toError(error);
      expect(result).toBe(error);
    });

    it('should convert string to Error object', () => {
      const result = toError('String error');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('String error');
    });

    it('should convert unknown types to Error object', () => {
      const result = toError({ unknown: 'object' });
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('An unknown error occurred');
    });
  });
});
