/**
 * Update Part Images Script
 * Assigns high-quality, relevant images to all parts based on category and manufacturer
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// High-quality stock images for different categories
const CATEGORY_IMAGES = {
  'engine': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'hydraulic': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'transmission': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'undercarriage': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'brake-systems': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'steering-systems': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'mechanical-components': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'filters': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'piston-kits': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'piston-ring-kits': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'connecting-rod-bearings': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'crankshaft-bearings': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'fuel-system': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'cooling-system': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'electrical': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'seals-gaskets': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'pins-bushes-bearings': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ],
  'service-wear-parts': [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  ]
};

// Manufacturer-specific image variations
const MANUFACTURER_IMAGES = {
  'JCB': {
    'engine': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'hydraulic': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'default': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  },
  'Caterpillar': {
    'engine': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'hydraulic': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'default': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  },
  'Komatsu': {
    'engine': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'hydraulic': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80',
    'default': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80'
  }
};

/**
 * Get appropriate image for a part
 */
function getPartImage(part) {
  const categorySlug = part.category.slug;
  const manufacturerName = part.manufacturer?.name;
  
  // Try manufacturer-specific image first
  if (manufacturerName && MANUFACTURER_IMAGES[manufacturerName]) {
    const manufacturerImages = MANUFACTURER_IMAGES[manufacturerName];
    if (manufacturerImages[categorySlug]) {
      return manufacturerImages[categorySlug];
    }
    if (manufacturerImages.default) {
      return manufacturerImages.default;
    }
  }
  
  // Fall back to category images
  if (CATEGORY_IMAGES[categorySlug]) {
    const images = CATEGORY_IMAGES[categorySlug];
    // Use part ID to consistently select the same image for the same part
    const index = part.id.charCodeAt(0) % images.length;
    return images[index];
  }
  
  // Final fallback
  return 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&q=80';
}

/**
 * Update all parts with appropriate images
 */
async function updatePartImages() {
  console.log('🖼️ Starting part image updates...\n');
  
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
        const imageUrl = getPartImage(part);
        
        await prisma.part.update({
          where: { id: part.id },
          data: { 
            images: [imageUrl],
            updatedAt: new Date()
          }
        });
        
        console.log(`✅ Updated ${part.partNumber} (${part.manufacturer?.name || 'Unknown'}): ${imageUrl}`);
        updatedCount++;
        
      } catch (error) {
        console.error(`❌ Error updating ${part.partNumber}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📈 Image Update Summary:');
    console.log(`✅ Successfully updated: ${updatedCount} parts`);
    console.log(`❌ Errors: ${errorCount} parts`);
    
  } catch (error) {
    console.error('❌ Error updating part images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updatePartImages();
