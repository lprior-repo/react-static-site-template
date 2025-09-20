import type { SEOProps } from '../types';

export const generatePageTitle = (
  pageTitle: string,
  siteName = 'React Static Site Template'
): string => {
  return pageTitle === 'Home' ? siteName : `${pageTitle} - ${siteName}`;
};

export const generateSEOProps = (
  title: string,
  description: string,
  options: Partial<SEOProps> = {}
): SEOProps => {
  return {
    title: generatePageTitle(title),
    description,
    keywords: options.keywords || 'react, typescript, vite, tailwind, aws, static site',
    ogTitle: options.ogTitle || generatePageTitle(title),
    ogDescription: options.ogDescription || description,
    ogImage: options.ogImage || '/og-image.jpg',
    ...(options.canonicalUrl && { canonicalUrl: options.canonicalUrl }),
  };
};
