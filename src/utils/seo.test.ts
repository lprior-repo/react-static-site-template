import { describe, it, expect } from 'vitest';
import { generatePageTitle, generateSEOProps } from './seo';

describe('SEO utilities', () => {
  describe('generatePageTitle', () => {
    it('returns site name for Home page', () => {
      const result = generatePageTitle('Home');
      expect(result).toBe('React Static Site Template');
    });

    it('returns page title with site name for other pages', () => {
      const result = generatePageTitle('About');
      expect(result).toBe('About - React Static Site Template');
    });

    it('uses custom site name when provided', () => {
      const result = generatePageTitle('Contact', 'My Site');
      expect(result).toBe('Contact - My Site');
    });

    it('handles home page with custom site name', () => {
      const result = generatePageTitle('Home', 'My Custom Site');
      expect(result).toBe('My Custom Site');
    });
  });

  describe('generateSEOProps', () => {
    it('generates basic SEO props', () => {
      const result = generateSEOProps('About', 'Learn more about our site');

      expect(result).toEqual({
        title: 'About - React Static Site Template',
        description: 'Learn more about our site',
        keywords: 'react, typescript, vite, tailwind, aws, static site',
        ogTitle: 'About - React Static Site Template',
        ogDescription: 'Learn more about our site',
        ogImage: '/og-image.jpg',
        canonicalUrl: undefined,
      });
    });

    it('includes custom options', () => {
      const result = generateSEOProps('Contact', 'Get in touch', {
        keywords: 'contact, support, help',
        ogImage: '/custom-image.jpg',
        canonicalUrl: 'https://example.com/contact',
      });

      expect(result).toEqual({
        title: 'Contact - React Static Site Template',
        description: 'Get in touch',
        keywords: 'contact, support, help',
        ogTitle: 'Contact - React Static Site Template',
        ogDescription: 'Get in touch',
        ogImage: '/custom-image.jpg',
        canonicalUrl: 'https://example.com/contact',
      });
    });

    it('uses custom og title and description when provided', () => {
      const result = generateSEOProps('Home', 'Welcome to our site', {
        ogTitle: 'Custom OG Title',
        ogDescription: 'Custom OG Description',
      });

      expect(result.ogTitle).toBe('Custom OG Title');
      expect(result.ogDescription).toBe('Custom OG Description');
    });
  });
});