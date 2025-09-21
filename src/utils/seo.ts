import type { Option, SEOProps } from '../types';
import { assertNotEmptyString } from './assert';
import { pipe } from './pipe';

// Pure function calculations for SEO data processing

/**
 * Generates a page title following the pattern: "Page - Site" or just "Site" for home
 * @param pageTitle - The specific page title
 * @param siteName - The site name (default provided)
 * @returns Formatted page title
 */
export const generatePageTitle = (
  pageTitle: string,
  siteName = 'React Static Site Template'
): string => {
  assertNotEmptyString(pageTitle, 'Page title cannot be empty');
  assertNotEmptyString(siteName, 'Site name cannot be empty');

  return pageTitle === 'Home' ? siteName : `${pageTitle} - ${siteName}`;
};

/**
 * Creates default keywords string for SEO
 * @returns Default keywords as comma-separated string
 */
export const getDefaultKeywords = (): string =>
  'react, typescript, vite, tailwind, aws, static site';

/**
 * Creates default OG image path
 * @returns Default OpenGraph image path
 */
export const getDefaultOGImage = (): string => '/og-image.jpg';

/**
 * Generates OpenGraph title with fallback logic
 * @param title - Page title
 * @param customOGTitle - Custom OG title override
 * @returns OpenGraph title
 */
export const generateOGTitle = (title: string, customOGTitle?: Option<string>): string =>
  customOGTitle || generatePageTitle(title);

/**
 * Generates OpenGraph description with fallback logic
 * @param description - Page description
 * @param customOGDescription - Custom OG description override
 * @returns OpenGraph description
 */
export const generateOGDescription = (
  description: string,
  customOGDescription?: Option<string>
): string => customOGDescription || description;

/**
 * Creates a complete SEO props object from basic inputs
 * @param title - Page title
 * @param description - Page description
 * @param options - Optional overrides for SEO properties
 * @returns Complete SEO props object
 */
export const generateSEOProps = (
  title: string,
  description: string,
  options: Partial<SEOProps> = {}
): SEOProps => {
  const baseProps: SEOProps = {
    title: generatePageTitle(title),
    description,
    keywords: options.keywords || getDefaultKeywords(),
    ogTitle: generateOGTitle(title, options.ogTitle),
    ogDescription: generateOGDescription(description, options.ogDescription),
    ogImage: options.ogImage || getDefaultOGImage(),
  };

  // Only add canonical URL if provided (maintain immutability)
  return options.canonicalUrl ? { ...baseProps, canonicalUrl: options.canonicalUrl } : baseProps;
};

/**
 * Composes multiple SEO option objects, with later options taking precedence
 * @param options - Array of partial SEO options to merge
 * @returns Merged SEO options
 */
export const mergeSEOOptions = (...options: Array<Partial<SEOProps>>): Partial<SEOProps> =>
  options.reduce((acc, current) => ({ ...acc, ...current }), {});

/**
 * Validates that required SEO fields are present
 * @param seoProps - SEO props to validate
 * @returns True if valid, false otherwise
 */
export const validateSEOProps = (seoProps: SEOProps): boolean =>
  Boolean(seoProps.title && seoProps.description);

/**
 * Creates SEO props for a route configuration
 * @param title - Route title
 * @param description - Route description
 * @param customOptions - Additional SEO options
 * @returns Complete SEO props
 */
export const createRouteSEO = (
  title: string,
  description: string,
  customOptions: Partial<SEOProps> = {}
): SEOProps =>
  pipe({ title, description, customOptions }, ({ title, description, customOptions }) =>
    generateSEOProps(title, description, customOptions)
  );
