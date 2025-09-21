import { describe, expect, it } from 'vitest';
import {
  createRouteSEO,
  generateOGDescription,
  generateOGTitle,
  generatePageTitle,
  generateSEOProps,
  getDefaultKeywords,
  getDefaultOGImage,
  mergeSEOOptions,
  validateSEOProps,
} from './seo';

describe('SEO Utility Functions', () => {
  describe('generatePageTitle', () => {
    it('should return site name for Home page', () => {
      const title = generatePageTitle('Home');
      expect(title).toBe('React Static Site Template');
    });

    it('should return formatted title for other pages', () => {
      const title = generatePageTitle('About');
      expect(title).toBe('About - React Static Site Template');
    });

    it('should use custom site name', () => {
      const title = generatePageTitle('Contact', 'Custom Site');
      expect(title).toBe('Contact - Custom Site');
    });

    it('should handle Home page with custom site name', () => {
      const title = generatePageTitle('Home', 'Custom Site');
      expect(title).toBe('Custom Site');
    });
  });

  describe('getDefaultKeywords', () => {
    it('should return consistent default keywords', () => {
      const keywords = getDefaultKeywords();
      expect(keywords).toBe('react, typescript, vite, tailwind, aws, static site');
    });

    it('should be pure function - same output for multiple calls', () => {
      const keywords1 = getDefaultKeywords();
      const keywords2 = getDefaultKeywords();
      expect(keywords1).toBe(keywords2);
    });
  });

  describe('getDefaultOGImage', () => {
    it('should return default OG image path', () => {
      const image = getDefaultOGImage();
      expect(image).toBe('/og-image.jpg');
    });

    it('should be pure function', () => {
      const image1 = getDefaultOGImage();
      const image2 = getDefaultOGImage();
      expect(image1).toBe(image2);
    });
  });

  describe('generateOGTitle', () => {
    it('should use custom OG title when provided', () => {
      const ogTitle = generateOGTitle('About', 'Custom OG Title');
      expect(ogTitle).toBe('Custom OG Title');
    });

    it('should fallback to generated page title when no custom title', () => {
      const ogTitle = generateOGTitle('About');
      expect(ogTitle).toBe('About - React Static Site Template');
    });

    it('should handle null custom title', () => {
      const ogTitle = generateOGTitle('About', null);
      expect(ogTitle).toBe('About - React Static Site Template');
    });
  });

  describe('generateOGDescription', () => {
    it('should use custom OG description when provided', () => {
      const ogDesc = generateOGDescription('Base description', 'Custom OG Description');
      expect(ogDesc).toBe('Custom OG Description');
    });

    it('should fallback to base description when no custom description', () => {
      const ogDesc = generateOGDescription('Base description');
      expect(ogDesc).toBe('Base description');
    });

    it('should handle null custom description', () => {
      const ogDesc = generateOGDescription('Base description', null);
      expect(ogDesc).toBe('Base description');
    });
  });

  describe('generateSEOProps', () => {
    it('should generate basic SEO props with defaults', () => {
      const seoProps = generateSEOProps('Test Page', 'Test description');

      expect(seoProps).toEqual({
        title: 'Test Page - React Static Site Template',
        description: 'Test description',
        keywords: 'react, typescript, vite, tailwind, aws, static site',
        ogTitle: 'Test Page - React Static Site Template',
        ogDescription: 'Test description',
        ogImage: '/og-image.jpg',
      });
    });

    it('should use custom options when provided', () => {
      const seoProps = generateSEOProps('Test Page', 'Test description', {
        keywords: 'custom, keywords',
        ogTitle: 'Custom OG Title',
        ogImage: '/custom-image.jpg',
      });

      expect(seoProps.keywords).toBe('custom, keywords');
      expect(seoProps.ogTitle).toBe('Custom OG Title');
      expect(seoProps.ogImage).toBe('/custom-image.jpg');
    });

    it('should include canonical URL when provided', () => {
      const seoProps = generateSEOProps('Test Page', 'Test description', {
        canonicalUrl: 'https://example.com/test',
      });

      expect(seoProps.canonicalUrl).toBe('https://example.com/test');
    });

    it('should not include canonical URL when not provided', () => {
      const seoProps = generateSEOProps('Test Page', 'Test description');

      expect(seoProps).not.toHaveProperty('canonicalUrl');
    });
  });

  describe('mergeSEOOptions', () => {
    it('should merge multiple option objects', () => {
      const merged = mergeSEOOptions(
        { keywords: 'first' },
        { ogTitle: 'second' },
        { keywords: 'override', ogImage: 'third' }
      );

      expect(merged).toEqual({
        keywords: 'override',
        ogTitle: 'second',
        ogImage: 'third',
      });
    });

    it('should handle empty options', () => {
      const merged = mergeSEOOptions({}, { keywords: 'test' }, {});
      expect(merged).toEqual({ keywords: 'test' });
    });

    it('should handle no arguments', () => {
      const merged = mergeSEOOptions();
      expect(merged).toEqual({});
    });
  });

  describe('validateSEOProps', () => {
    it('should return true for valid SEO props', () => {
      const seoProps = {
        title: 'Test Title',
        description: 'Test description',
        keywords: 'test',
        ogTitle: 'OG Title',
        ogDescription: 'OG Description',
        ogImage: '/image.jpg',
      };

      expect(validateSEOProps(seoProps)).toBe(true);
    });

    it('should return false for missing title', () => {
      const seoProps = {
        title: '',
        description: 'Test description',
        keywords: 'test',
        ogTitle: 'OG Title',
        ogDescription: 'OG Description',
        ogImage: '/image.jpg',
      };

      expect(validateSEOProps(seoProps)).toBe(false);
    });

    it('should return false for missing description', () => {
      const seoProps = {
        title: 'Test Title',
        description: '',
        keywords: 'test',
        ogTitle: 'OG Title',
        ogDescription: 'OG Description',
        ogImage: '/image.jpg',
      };

      expect(validateSEOProps(seoProps)).toBe(false);
    });
  });

  describe('createRouteSEO', () => {
    it('should create SEO props for a route', () => {
      const seoProps = createRouteSEO('About', 'About page description');

      expect(seoProps.title).toBe('About - React Static Site Template');
      expect(seoProps.description).toBe('About page description');
      expect(seoProps.keywords).toBe('react, typescript, vite, tailwind, aws, static site');
    });

    it('should include custom options', () => {
      const seoProps = createRouteSEO('Contact', 'Contact description', {
        keywords: 'contact, form',
        canonicalUrl: 'https://example.com/contact',
      });

      expect(seoProps.keywords).toBe('contact, form');
      expect(seoProps.canonicalUrl).toBe('https://example.com/contact');
    });

    it('should be pure function', () => {
      const seo1 = createRouteSEO('Test', 'Description');
      const seo2 = createRouteSEO('Test', 'Description');

      expect(seo1).toEqual(seo2);
    });
  });
});
