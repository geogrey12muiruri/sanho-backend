/**
 * Update External Links Script
 * Updates all parts in the database with manufacturer-specific external links
 */

import { PrismaClient } from '@prisma/client';
import { generateExternalLink, isManufacturerSupported } from '../utils/externalLinks.js';

const prisma = new PrismaClient();

async function updateExternalLinks() {
  console.log('🔗 Starting external links update...\n');

  try {
    // Get all parts with their manufacturer information
    const parts = await prisma.part.findMany({
      include: {
        manufacturer: true
      },
      where: {
        isActive: true
      }
    });

    console.log(`📊 Found ${parts.length} parts to process\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const part of parts) {
      try {
        // Skip if part already has an external link with search parameters
        if (part.externalLink && part.externalLink.includes('?')) {
          console.log(`⏭️  Skipping ${part.partNumber} - already has search URL`);
          skippedCount++;
          continue;
        }

        // Skip if no manufacturer
        if (!part.manufacturer) {
          console.log(`⏭️  Skipping ${part.partNumber} - no manufacturer`);
          skippedCount++;
          continue;
        }

        // Check if manufacturer is supported
        if (!isManufacturerSupported(part.manufacturer.name)) {
          console.log(`⏭️  Skipping ${part.partNumber} - manufacturer ${part.manufacturer.name} not supported`);
          skippedCount++;
          continue;
        }

        // Generate external link
        const externalLink = generateExternalLink(part.manufacturer.name, part.partNumber);
        
        if (!externalLink) {
          console.log(`❌ Failed to generate link for ${part.partNumber}`);
          errorCount++;
          continue;
        }

        // Update the part
        await prisma.part.update({
          where: { id: part.id },
          data: { externalLink }
        });

        console.log(`✅ Updated ${part.partNumber} (${part.manufacturer.name}) - ${externalLink}`);
        updatedCount++;

      } catch (error) {
        console.error(`❌ Error updating ${part.partNumber}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 Update Summary:');
    console.log(`✅ Successfully updated: ${updatedCount} parts`);
    console.log(`⏭️  Skipped: ${skippedCount} parts`);
    console.log(`❌ Errors: ${errorCount} parts`);

    // Show statistics by manufacturer
    console.log('\n📊 Statistics by Manufacturer:');
    const manufacturerStats = await prisma.part.groupBy({
      by: ['manufacturerId'],
      where: {
        isActive: true,
        externalLink: { not: null }
      },
      _count: {
        id: true
      }
    });

    for (const stat of manufacturerStats) {
      const manufacturer = await prisma.manufacturer.findUnique({
        where: { id: stat.manufacturerId }
      });
      console.log(`   ${manufacturer?.name || 'Unknown'}: ${stat._count.id} parts with external links`);
    }

  } catch (error) {
    console.error('❌ Error updating external links:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateExternalLinks();
