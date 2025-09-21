import { Effect, pipe } from 'effect';
import type { ContactFormData } from '../types';

// Pure data types for effects
export interface SubmissionSuccess {
  readonly success: true;
  readonly data: ContactFormData;
  readonly timestamp: number;
}

export interface SubmissionError {
  readonly success: false;
  readonly error: string;
  readonly timestamp: number;
}

export type SubmissionResult = SubmissionSuccess | SubmissionError;

// Effect for form submission simulation
export const submitContactForm = (formData: ContactFormData) =>
  pipe(
    Effect.sync(() => {
      // Assert form data integrity
      if (!formData.name?.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.email?.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.message?.trim()) {
        throw new Error('Message is required');
      }
      return formData;
    }),
    Effect.flatMap((data) =>
      Effect.tryPromise({
        try: () => simulateApiCall(data),
        catch: (error) => `Form submission failed: ${String(error)}`,
      })
    ),
    Effect.map(
      (data): SubmissionSuccess => ({
        success: true,
        data,
        timestamp: Date.now(),
      })
    ),
    Effect.catchAll(
      (error): Effect.Effect<SubmissionError> =>
        Effect.succeed({
          success: false,
          error: String(error),
          timestamp: Date.now(),
        })
    )
  );

// Effect for logging with structured data
export const logFormSubmission = (data: ContactFormData) =>
  Effect.sync(() => {
    console.log('Form submitted:', {
      name: data.name,
      email: data.email,
      message: data.message,
    });
  });

// Effect for showing success alert
export const showSuccessAlert = () =>
  Effect.sync(() => {
    alert('Thank you for your message! This is a demo form.');
  });

// Effect for showing error alert
export const showErrorAlert = (message: string) =>
  Effect.sync(() => {
    alert(`Error: ${message}`);
  });

// Effect for console error logging
export const logError = (error: string) =>
  Effect.sync(() => {
    console.error('Form submission error:', error);
  });

// Simulate API call with delay
const simulateApiCall = async (data: ContactFormData): Promise<ContactFormData> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return data;
};

// Comprehensive form submission effect that combines all steps
export const handleFormSubmissionEffect = (formData: ContactFormData) =>
  pipe(
    submitContactForm(formData),
    Effect.tap((result) =>
      result.success
        ? pipe(logFormSubmission(result.data), Effect.andThen(showSuccessAlert()))
        : pipe(logError(result.error), Effect.andThen(showErrorAlert(result.error)))
    )
  );

// Helper to run effects with React
export const runEffect = <T>(effect: Effect.Effect<T>) => {
  return Effect.runPromise(effect);
};
