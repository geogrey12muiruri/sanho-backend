/**
 * External Link Generator for Manufacturer-Specific Parts Finders
 * Generates appropriate external links based on manufacturer and part number
 */

const MANUFACTURER_LINKS = {
  'JCB': {
    baseUrl: 'https://www.interpart.com/jcb-parts',
    searchParam: 'combine', // Verified: Interpart uses 'combine' parameter
    description: 'Search on Interpart JCB Parts Finder'
  },
  'Caterpillar': {
    baseUrl: 'https://parts.cat.com/en/catcorp',
    searchParam: 'q',
    description: 'Search on Caterpillar Parts Catalog'
  },
  'Volvo': {
    baseUrl: 'https://www.volvopartshop.com',
    searchParam: 'search',
    description: 'Search on Volvo Parts Shop'
  },
  'Komatsu': {
    baseUrl: 'https://parts.komatsu.com',
    searchParam: 'search',
    description: 'Search on Komatsu Parts Catalog'
  },
  'Hyundai': {
    baseUrl: 'https://www.hd-hyundaice.com/en',
    searchParam: 'search',
    description: 'Search on Hyundai Construction Equipment Parts'
  },
  'Case': {
    baseUrl: 'https://parts.casece.com',
    searchParam: 'search',
    description: 'Search on Case Construction Parts'
  },
  'New Holland': {
    baseUrl: 'https://parts.newholland.com',
    searchParam: 'search',
    description: 'Search on New Holland Parts'
  },
  'John Deere': {
    baseUrl: 'https://parts.deere.com',
    searchParam: 'search',
    description: 'Search on John Deere Parts Catalog'
  },
  'Kubota': {
    baseUrl: 'https://parts.kubota.com',
    searchParam: 'search',
    description: 'Search on Kubota Parts'
  },
  'Bobcat': {
    baseUrl: 'https://parts.bobcat.com',
    searchParam: 'search',
    description: 'Search on Bobcat Parts'
  }
};

/**
 * Generate external link for a part based on manufacturer
 * @param {string} manufacturerName - Name of the manufacturer
 * @param {string} partNumber - Part number to search for
 * @returns {string|null} - Generated external link or null if manufacturer not supported
 */
function generateExternalLink(manufacturerName, partNumber) {
  if (!manufacturerName || !partNumber) {
    return null;
  }

  const manufacturer = MANUFACTURER_LINKS[manufacturerName];
  if (!manufacturer) {
    return null;
  }

  // Generate search URL with part number
  const searchParams = new URLSearchParams();
  searchParams.set(manufacturer.searchParam, partNumber);
  
  return `${manufacturer.baseUrl}?${searchParams.toString()}`;
}

/**
 * Get manufacturer-specific link information
 * @param {string} manufacturerName - Name of the manufacturer
 * @returns {object|null} - Link information or null if not supported
 */
function getManufacturerLinkInfo(manufacturerName) {
  return MANUFACTURER_LINKS[manufacturerName] || null;
}

/**
 * Check if a manufacturer has external link support
 * @param {string} manufacturerName - Name of the manufacturer
 * @returns {boolean} - True if manufacturer is supported
 */
function isManufacturerSupported(manufacturerName) {
  return manufacturerName && MANUFACTURER_LINKS.hasOwnProperty(manufacturerName);
}

/**
 * Get all supported manufacturers
 * @returns {string[]} - Array of supported manufacturer names
 */
function getSupportedManufacturers() {
  return Object.keys(MANUFACTURER_LINKS);
}

export {
  generateExternalLink,
  getManufacturerLinkInfo,
  isManufacturerSupported,
  getSupportedManufacturers,
  MANUFACTURER_LINKS
};
