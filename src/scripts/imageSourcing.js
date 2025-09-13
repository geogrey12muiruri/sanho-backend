/**
 * Image Sourcing Script for Parts Catalog
 * Implements multiple strategies to find appropriate images for parts
 */

import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

// Image sourcing strategies
const IMAGE_STRATEGIES = {
  // 1. Manufacturer-specific image URLs
  MANUFACTURER_IMAGES: {
    'JCB': {
      baseUrl: 'https://www.interpart.com',
      searchEndpoint: '/jcb-parts',
      imageSelector: '.product-image img',
      fallback: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop'
    },
    'Caterpillar': {
      baseUrl: 'https://parts.cat.com',
      searchEndpoint: '/en/catcorp',
      imageSelector: '.part-image img',
      fallback: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop'
    },
    'Komatsu': {
      baseUrl: 'https://parts.komatsu.com',
      searchEndpoint: '/search',
      imageSelector: '.product-img img',
      fallback: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop'
    }
  },

  // 2. Category-based stock images
  CATEGORY_IMAGES: {
    'engine': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
    'hydraulic': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
    'transmission': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
    'undercarriage': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
    'brake-systems': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
    'steering-systems': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
    'mechanical-components': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
    'filters': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop'
  },

  // 3. AI-generated image prompts
  AI_PROMPTS: {
    'engine': 'heavy machinery engine part, industrial equipment, metal component, professional photography',
    'hydraulic': 'hydraulic cylinder, industrial machinery part, metal component, clean background',
    'transmission': 'transmission gear, heavy machinery part, industrial component, metal',
    'undercarriage': 'track roller, undercarriage component, heavy machinery part, industrial',
    'brake-systems': 'brake pad, heavy machinery brake component, industrial part, metal',
    'steering-systems': 'steering cylinder, hydraulic steering component, industrial machinery part',
    'mechanical-components': 'mechanical part, heavy machinery component, industrial equipment, metal',
    'filters': 'industrial filter, heavy machinery filter, clean component, professional'
  }
};

/**
 * Generate AI image URL using DALL-E or similar service
 */
async function generateAIImage(part, prompt) {
  try {
    // This would integrate with DALL-E API or similar
    // For now, return a placeholder that looks more professional
    const searchTerm = encodeURIComponent(`${part.manufacturer?.name || 'Heavy Machinery'} ${part.category.name} part`);
    return `https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
  } catch (error) {
    console.error('Error generating AI image:', error);
    return null;
  }
}

/**
 * Scrape manufacturer website for part images
 */
async function scrapeManufacturerImage(part, strategy) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const searchUrl = `${strategy.baseUrl}${strategy.searchEndpoint}?${strategy.searchParam || 'q'}=${encodeURIComponent(part.partNumber)}`;
    
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    const imageUrl = await page.evaluate((selector) => {
      const img = document.querySelector(selector);
      return img ? img.src : null;
    }, strategy.imageSelector);
    
    await browser.close();
    
    if (imageUrl && !imageUrl.includes('placeholder')) {
      return imageUrl.startsWith('http') ? imageUrl : `${strategy.baseUrl}${imageUrl}`;
    }
    
    return null;
  } catch (error) {
    console.error(`Error scraping image for ${part.partNumber}:`, error);
    return null;
  }
}

/**
 * Get category-based stock image
 */
function getCategoryImage(part) {
  return IMAGE_STRATEGIES.CATEGORY_IMAGES[part.category.slug] || 
         IMAGE_STRATEGIES.CATEGORY_IMAGES['mechanical-components'];
}

/**
 * Generate professional placeholder image
 */
function generatePlaceholderImage(part) {
  const searchTerm = encodeURIComponent(`${part.manufacturer?.name || 'Heavy Machinery'} ${part.category.name} part`);
  return `https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80&auto=format&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
}

/**
 * Source image for a single part using multiple strategies
 */
async function sourcePartImage(part) {
  console.log(`🔍 Sourcing image for ${part.partNumber} (${part.manufacturer?.name || 'Unknown'})`);
  
  // Strategy 1: Try manufacturer-specific scraping
  if (part.manufacturer?.name && IMAGE_STRATEGIES.MANUFACTURER_IMAGES[part.manufacturer.name]) {
    const strategy = IMAGE_STRATEGIES.MANUFACTURER_IMAGES[part.manufacturer.name];
    const scrapedImage = await scrapeManufacturerImage(part, strategy);
    if (scrapedImage) {
      console.log(`✅ Found manufacturer image: ${scrapedImage}`);
      return scrapedImage;
    }
  }
  
  // Strategy 2: Use category-based stock image
  const categoryImage = getCategoryImage(part);
  console.log(`📷 Using category image: ${categoryImage}`);
  return categoryImage;
}

/**
 * Update all parts with appropriate images
 */
async function updateAllPartImages() {
  console.log('🖼️ Starting image sourcing for all parts...\n');
  
  try {
    const parts = await prisma.part.findMany({
      include: {
        manufacturer: true,
        category: true
      },
      where: {
        isActive: true
      }
    });
    
    console.log(`📊 Found ${parts.length} parts to process\n`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const part of parts) {
      try {
        const imageUrl = await sourcePartImage(part);
        
        if (imageUrl) {
          await prisma.part.update({
            where: { id: part.id },
            data: { 
              images: [imageUrl],
              updatedAt: new Date()
            }
          });
          
          console.log(`✅ Updated ${part.partNumber}: ${imageUrl}`);
          updatedCount++;
        } else {
          console.log(`❌ No image found for ${part.partNumber}`);
          errorCount++;
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing ${part.partNumber}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📈 Image Sourcing Summary:');
    console.log(`✅ Successfully updated: ${updatedCount} parts`);
    console.log(`❌ Errors: ${errorCount} parts`);
    
  } catch (error) {
    console.error('❌ Error updating part images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the image sourcing
updateAllPartImages();
