import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG, getCanonicalUrl, getAbsoluteImageUrl } from './config';

/**
 * Universal SEO component for Desi Journey
 * 
 * @param {object} props
 * @param {string} [props.title] - Page title (appended with site name)
 * @param {string} [props.description] - Page description
 * @param {Array<string>} [props.keywords] - Additional keywords
 * @param {string} [props.image] - OpenGraph / Twitter preview image
 * @param {string} [props.canonical] - Relative canonical path (e.g. '/destinations')
 * @param {string} [props.type='website'] - OpenGraph type (website, article, etc.)
 * @param {object|Array<object>} [props.schema] - JSON-LD Schema.org object(s)
 * @param {boolean} [props.noindex=false] - If true, sets robots to noindex, nofollow
 */
export default function SEO({
  title,
  description = SEO_CONFIG.defaultDescription,
  keywords = [],
  image = SEO_CONFIG.defaultImage,
  canonical = '',
  type = 'website',
  schema,
  noindex = false,
}) {
  // Format page title
  const fullTitle = title 
    ? `${title} | ${SEO_CONFIG.siteName}` 
    : SEO_CONFIG.defaultTitle;

  const canonicalUrl = getCanonicalUrl(canonical);
  const imageUrl = getAbsoluteImageUrl(image);
  const allKeywords = Array.from(new Set([...keywords, ...SEO_CONFIG.defaultKeywords])).join(', ');

  // Normalize schemas to array
  const schemaList = schema 
    ? (Array.isArray(schema) ? schema : [schema]).filter(Boolean)
    : [];

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="author" content={SEO_CONFIG.siteName} />

      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:alt" content={title || SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title || SEO_CONFIG.siteName} />

      {/* Schema.org Structured Data (JSON-LD) */}
      {schemaList.map((item, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}
