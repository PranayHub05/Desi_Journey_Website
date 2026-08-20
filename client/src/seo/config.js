/**
 * Desi Journey - Centralized SEO Configuration
 * 
 * When deploying with a custom domain (e.g. https://desijourney.com),
 * simply set VITE_SITE_URL in your .env or Vercel dashboard:
 * VITE_SITE_URL=https://desijourney.com
 */

const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.includes('localhost')) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'https://desijourney-website.vercel.app';
};

export const SEO_CONFIG = {
  siteName: 'Desi Journey',
  siteTagline: 'Bespoke Journeys & Luxury Travel Experiences Across India & Beyond',
  baseUrl: getBaseUrl(),
  defaultTitle: 'Desi Journey | Bespoke Journeys & Luxury Travel Packages',
  titleTemplate: '%s | Desi Journey',
  defaultDescription: 'Experience handcrafted, luxury travel with Desi Journey. Accredited by TAAB, ETAA & Tourism Boards. Personalized itineraries for Andaman, Kashmir, Arunachal, Bali & bespoke destinations.',
  defaultKeywords: [
    'luxury travel india',
    'desi journey',
    'bespoke tour packages',
    'andaman holiday package',
    'kashmir luxury tour',
    'tawang arunachal pradesh tour',
    'bali luxury vacation',
    'honeymoon packages india',
    'accredited travel agency kolkata',
    'best travel company kolkata',
    'custom itineraries india',
    'heritage luxury travel'
  ],
  defaultImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
  logoUrl: 'https://desijourney-website.vercel.app/assets/desi-journey-logo.jpg',
  twitterHandle: '@desijourney',
  locale: 'en_IN',
  
  // Organization details for rich snippets
  organization: {
    name: 'Desi Journey',
    legalName: 'Desi Journey Private Limited',
    telephone: '+919748424597',
    whatsapp: '+919748424597',
    email: 'info@desijourney.com',
    foundingYear: '2019',
    priceRange: '₹₹₹',
    ratingValue: '4.9',
    reviewCount: '128',
    address: {
      streetAddress: 'Merlin Homeland, Ashutosh Mukherjee Road',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      postalCode: '700020',
      addressCountry: 'IN'
    },
    geo: {
      latitude: '22.5355',
      longitude: '88.3474'
    },
    sameAs: [
      'https://www.facebook.com/desijourney',
      'https://www.instagram.com/desijourney',
      'https://wa.me/919748424597'
    ]
  }
};

/**
 * Builds a canonical URL for any relative route
 * @param {string} path - Relative path (e.g. '/destinations', '/tours/tour-1')
 * @returns {string} Fully qualified absolute URL
 */
export const getCanonicalUrl = (path = '') => {
  const base = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

/**
 * Ensures an image URL is fully qualified with domain if relative
 * @param {string} imageUrl - Absolute or relative image URL
 * @returns {string} Fully qualified image URL
 */
export const getAbsoluteImageUrl = (imageUrl) => {
  if (!imageUrl) return SEO_CONFIG.defaultImage;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('//')) {
    return imageUrl;
  }
  const base = getBaseUrl();
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${base}${cleanPath}`;
};
