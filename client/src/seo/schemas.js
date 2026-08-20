import { SEO_CONFIG, getCanonicalUrl, getAbsoluteImageUrl } from './config';

/**
 * Builds TravelAgency & Organization Schema (JSON-LD)
 */
export const getTravelAgencySchema = () => {
  const org = SEO_CONFIG.organization;
  const baseUrl = SEO_CONFIG.baseUrl;

  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${baseUrl}/#organization`,
    name: org.name,
    legalName: org.legalName,
    url: baseUrl,
    logo: getAbsoluteImageUrl(SEO_CONFIG.logoUrl),
    image: getAbsoluteImageUrl(SEO_CONFIG.defaultImage),
    description: SEO_CONFIG.defaultDescription,
    telephone: org.telephone,
    email: org.email,
    priceRange: org.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: org.address.streetAddress,
      addressLocality: org.address.addressLocality,
      addressRegion: org.address.addressRegion,
      postalCode: org.address.postalCode,
      addressCountry: org.address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: org.geo.latitude,
      longitude: org.geo.longitude
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: org.ratingValue,
      reviewCount: org.reviewCount,
      bestRating: '5',
      worstRating: '1'
    },
    sameAs: org.sameAs,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '20:00'
      }
    ]
  };
};

/**
 * Builds TouristTrip & Tour Package Schema (JSON-LD)
 * @param {object} tour - Tour data object
 */
export const getTouristTripSchema = (tour) => {
  if (!tour) return null;
  const tourUrl = getCanonicalUrl(`/tours/${tour.id}`);
  const numericPrice = (tour.price || '').replace(/[^0-9]/g, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': tourUrl,
    name: tour.title,
    description: tour.description || `${tour.title} luxury tour package by Desi Journey.`,
    image: getAbsoluteImageUrl(tour.image),
    touristType: ['Couple', 'Family', 'Group', 'Solo Luxury'],
    subjectOf: {
      '@type': 'Place',
      name: tour.location || 'India'
    },
    offers: {
      '@type': 'Offer',
      price: numericPrice || '29900',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: tourUrl,
      validFrom: new Date().toISOString().split('T')[0],
      seller: {
        '@type': 'TravelAgency',
        name: SEO_CONFIG.siteName
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tour.rating || '4.9',
      reviewCount: '48',
      bestRating: '5',
      worstRating: '1'
    },
    provider: {
      '@type': 'TravelAgency',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.baseUrl
    }
  };
};

/**
 * Builds Article / BlogPosting Schema (JSON-LD)
 * @param {object} post - Blog post object
 */
export const getArticleSchema = (post) => {
  if (!post) return null;
  const postUrl = getCanonicalUrl(`/blog/${post.id}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': postUrl,
    headline: post.title,
    description: post.excerpt || post.title,
    image: getAbsoluteImageUrl(post.image),
    articleSection: post.category || 'Travel Guide',
    inLanguage: 'en-IN',
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    author: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      logo: {
        '@type': 'ImageObject',
        url: getAbsoluteImageUrl(SEO_CONFIG.logoUrl)
      }
    },
    datePublished: '2024-01-15T08:00:00+05:30',
    dateModified: new Date().toISOString()
  };
};

/**
 * Builds BreadcrumbList Schema (JSON-LD)
 * @param {Array<{ name: string, path: string }>} crumbs
 */
export const getBreadcrumbSchema = (crumbs = []) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: getCanonicalUrl(crumb.path)
    }))
  };
};

/**
 * Builds FAQPage Schema (JSON-LD)
 * @param {Array<{ question: string, answer: string }>} faqs
 */
export const getFAQSchema = (faqs = []) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};
