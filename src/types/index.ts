// Global type definitions for the React Static Site Template
// Following functional programming principles with immutable data structures

// Core data types (immutable by design)
export interface RouteConfig {
  readonly path: string;
  readonly title: string;
  readonly description: string;
}

export interface SEOProps {
  readonly title: string;
  readonly description: string;
  readonly keywords?: string;
  readonly ogTitle?: string;
  readonly ogDescription?: string;
  readonly ogImage?: string;
  readonly canonicalUrl?: string;
}

export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

export interface NavigationItem {
  readonly name: string;
  readonly path: string;
  readonly current: boolean;
}

export interface SiteConfig {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly author: string;
  readonly social: {
    readonly github?: string;
    readonly twitter?: string;
    readonly linkedin?: string;
  };
}

// Form validation types
export interface ValidationError {
  readonly field: string;
  readonly message: string;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly ValidationError[];
}

// Application state types
export interface AppState {
  readonly navigation: readonly NavigationItem[];
  readonly siteConfig: SiteConfig;
}

// Result types for error handling
export type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

// Option type for nullable values
export type Option<T> = T | null;

// Event handler types
export type FormFieldChangeHandler = (field: string, value: string) => void;
export type FormSubmitHandler = (formData: ContactFormData) => void;
