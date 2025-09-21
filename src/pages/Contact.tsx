import { useCallback, useState } from 'react';
import SEOHead from '../components/SEOHead';
import {
  createEmptyContactForm,
  isFormComplete,
  prepareFormSubmission,
  validateContactForm,
} from '../utils/form';
import { createRouteSEO } from '../utils/seo';
import type { ContactFormData, ValidationResult } from '../types';

// Pure component for form field with validation
interface FormFieldProps {
  readonly label: string;
  readonly name: keyof ContactFormData;
  readonly type?: string;
  readonly value: string;
  readonly errors: readonly string[];
  readonly required?: boolean;
  readonly rows?: number;
  readonly onChange: (name: string, value: string) => void;
}

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  errors,
  required = true,
  rows,
  onChange,
}: FormFieldProps) => {
  const hasErrors = errors.length > 0;
  const inputClasses = `block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
    hasErrors ? 'ring-red-300 focus:ring-red-600' : 'ring-gray-300 focus:ring-blue-600'
  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="sm:col-span-2">
      <label htmlFor={name} className="block text-sm font-semibold leading-6 text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-2.5">
        {rows ? (
          <textarea
            name={name}
            id={name}
            rows={rows}
            value={value}
            onChange={handleChange}
            required={required}
            className={inputClasses}
            aria-describedby={hasErrors ? `${name}-error` : undefined}
            aria-invalid={hasErrors}
          />
        ) : (
          <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={handleChange}
            required={required}
            className={inputClasses}
            aria-describedby={hasErrors ? `${name}-error` : undefined}
            aria-invalid={hasErrors}
          />
        )}
      </div>
      {hasErrors && (
        <div id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// Pure component for form submission status
interface SubmissionStatusProps {
  readonly isSubmitting: boolean;
  readonly isComplete: boolean;
}

const SubmissionStatus = ({ isSubmitting, isComplete }: SubmissionStatusProps) => {
  if (!isComplete && !isSubmitting) {
    return null;
  }

  return (
    <div className="mt-4 text-sm text-gray-600">
      {isSubmitting && 'Submitting...'}
      {isComplete && !isSubmitting && 'All required fields are filled.'}
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>(createEmptyContactForm);
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pure function handlers
  const handleFieldChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFormData(createEmptyContactForm());
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form
      const validation = validateContactForm(formData);
      setValidationResult(validation);

      if (!validation.isValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        // Prepare sanitized data for submission
        const submissionData = prepareFormSubmission(formData);

        // Use Effect.ts for side effect management
        const { handleFormSubmissionEffect, runEffect } = await import('../utils/effects');

        const result = await runEffect(handleFormSubmissionEffect(submissionData));

        if (result.success) {
          handleReset();
          setValidationResult({ isValid: true, errors: [] });
        }
      } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting your message. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, handleReset]
  );

  // Helper function to get field errors
  const getFieldErrors = (fieldName: string): readonly string[] =>
    validationResult.errors
      .filter((error) => error.field === fieldName)
      .map((error) => error.message);

  const seoProps = createRouteSEO(
    'Contact',
    'Get in touch with us about the React Static Site Template.'
  );

  const isComplete = isFormComplete(formData);

  return (
    <>
      <SEOHead seo={seoProps} />

      <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Have questions about the template? We&apos;d love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20" noValidate>
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <FormField
              label="Name"
              name="name"
              value={formData.name}
              errors={getFieldErrors('Name')}
              onChange={handleFieldChange}
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              errors={getFieldErrors('Email')}
              onChange={handleFieldChange}
            />

            <FormField
              label="Message"
              name="message"
              value={formData.message}
              errors={getFieldErrors('Message')}
              rows={4}
              onChange={handleFieldChange}
            />
          </div>

          <SubmissionStatus isSubmitting={isSubmitting} isComplete={isComplete} />

          <div className="mt-10 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="rounded-md bg-gray-200 px-3.5 py-2.5 text-center text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mx-auto mt-20 max-w-xl">
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900">Other Ways to Reach Us</h3>
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-sm font-semibold text-gray-900">GitHub</dt>
                <dd className="mt-1 text-sm text-gray-600">
                  <a
                    href="https://github.com"
                    className="text-blue-600 hover:text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View the source code and submit issues
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-gray-900">Documentation</dt>
                <dd className="mt-1 text-sm text-gray-600">
                  Check out the README and documentation for detailed setup instructions.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
