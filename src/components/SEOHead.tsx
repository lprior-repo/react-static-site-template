import { Helmet } from 'react-helmet-async';
import type { SEOProps } from '../types';

// Pure SEO component that takes structured props and renders Helmet
interface SEOHeadProps {
  readonly seo: SEOProps;
  readonly additionalMeta?: readonly { name?: string; property?: string; content: string }[];
  readonly additionalLinks?: readonly { rel: string; href: string; type?: string }[];
}

/**
 * Composable SEO Head component using react-helmet-async
 * Follows functional programming principles with immutable props
 */
const SEOHead = ({ seo, additionalMeta = [], additionalLinks = [] }: SEOHeadProps) => (
  <Helmet>
    {/* Basic meta tags */}
    <title>{seo.title}</title>
    <meta name="description" content={seo.description} />

    {/* Keywords (if provided) */}
    {seo.keywords && <meta name="keywords" content={seo.keywords} />}

    {/* OpenGraph meta tags */}
    <meta property="og:title" content={seo.ogTitle || seo.title} />
    <meta property="og:description" content={seo.ogDescription || seo.description} />
    <meta property="og:type" content="website" />

    {/* OpenGraph image (if provided) */}
    {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}

    {/* Canonical URL (if provided) */}
    {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}

    {/* Additional meta tags */}
    {additionalMeta.map((meta, index) => (
      <meta
        key={index}
        {...(meta.name ? { name: meta.name } : { property: meta.property })}
        content={meta.content}
      />
    ))}

    {/* Additional links */}
    {additionalLinks.map((link, index) => (
      <link key={index} rel={link.rel} href={link.href} {...(link.type && { type: link.type })} />
    ))}
  </Helmet>
);

export default SEOHead;
