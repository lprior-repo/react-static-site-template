import type { ContactFormData, FormFieldChangeHandler, ValidationResult } from '../types';
import {
  combineValidationResults,
  validateEmail,
  validateMinLength,
  validateRequired,
} from './error';

// Pure functions for form data manipulation

/**
 * Creates an empty contact form data object
 * @returns Empty ContactFormData
 */
export const createEmptyContactForm = (): ContactFormData => ({
  name: '',
  email: '',
  message: '',
});

/**
 * Updates a specific field in form data immutably
 * @param formData - Current form data
 * @param field - Field to update
 * @param value - New value
 * @returns Updated form data
 */
export const updateFormField = (
  formData: ContactFormData,
  field: keyof ContactFormData,
  value: string
): ContactFormData => ({
  ...formData,
  [field]: value,
});

/**
 * Updates multiple fields in form data immutably
 * @param formData - Current form data
 * @param updates - Object with field updates
 * @returns Updated form data
 */
export const updateFormFields = (
  formData: ContactFormData,
  updates: Partial<ContactFormData>
): ContactFormData => ({
  ...formData,
  ...updates,
});

/**
 * Resets form data to empty state
 * @returns Empty ContactFormData
 */
export const resetFormData = (): ContactFormData => createEmptyContactForm();

/**
 * Validates the name field
 * @param name - Name value to validate
 * @returns ValidationResult for name field
 */
export const validateName = (name: string): ValidationResult => validateRequired(name, 'Name');

/**
 * Validates the email field
 * @param email - Email value to validate
 * @returns ValidationResult for email field
 */
export const validateEmailField = (email: string): ValidationResult => {
  const requiredResult = validateRequired(email, 'Email');
  if (!requiredResult.isValid) {
    return requiredResult;
  }

  return validateEmail(email, 'Email');
};

/**
 * Validates the message field
 * @param message - Message value to validate
 * @returns ValidationResult for message field
 */
export const validateMessage = (message: string): ValidationResult => {
  const requiredResult = validateRequired(message, 'Message');
  if (!requiredResult.isValid) {
    return requiredResult;
  }

  return validateMinLength(message, 'Message', 10);
};

/**
 * Validates entire contact form data
 * @param formData - Form data to validate
 * @returns ValidationResult for entire form
 */
export const validateContactForm = (formData: ContactFormData): ValidationResult => {
  const validationResults = [
    validateName(formData.name),
    validateEmailField(formData.email),
    validateMessage(formData.message),
  ];

  return combineValidationResults(validationResults);
};

/**
 * Checks if form has any data entered
 * @param formData - Form data to check
 * @returns True if form has any non-empty fields
 */
export const hasFormData = (formData: ContactFormData): boolean =>
  Boolean(formData.name.trim() || formData.email.trim() || formData.message.trim());

/**
 * Checks if form is completely filled
 * @param formData - Form data to check
 * @returns True if all required fields have values
 */
export const isFormComplete = (formData: ContactFormData): boolean =>
  Boolean(formData.name.trim() && formData.email.trim() && formData.message.trim());

/**
 * Creates a field change handler that updates form state immutably
 * @param setFormData - State setter function
 * @returns Field change handler function
 */
export const createFieldChangeHandler =
  (
    setFormData: (updater: (prev: ContactFormData) => ContactFormData) => void
  ): FormFieldChangeHandler =>
  (field: string, value: string) => {
    setFormData((prev) => updateFormField(prev, field as keyof ContactFormData, value));
  };

/**
 * Creates a form reset handler
 * @param setFormData - State setter function
 * @returns Reset handler function
 */
export const createFormResetHandler =
  (setFormData: (data: ContactFormData) => void) => (): void => {
    setFormData(resetFormData());
  };

/**
 * Sanitizes form data by trimming whitespace
 * @param formData - Form data to sanitize
 * @returns Sanitized form data
 */
export const sanitizeFormData = (formData: ContactFormData): ContactFormData => ({
  name: formData.name.trim(),
  email: formData.email.trim(),
  message: formData.message.trim(),
});

/**
 * Creates form submission data with sanitization
 * @param formData - Raw form data
 * @returns Sanitized form data ready for submission
 */
export const prepareFormSubmission = (formData: ContactFormData): ContactFormData =>
  sanitizeFormData(formData);
