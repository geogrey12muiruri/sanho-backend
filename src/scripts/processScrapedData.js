import fs from 'fs';
import path from 'path';

/**
 * Process scraped data and convert it to seed format
 * Usage: node src/scripts/processScrapedData.js
 */

const SCRAPED_FILE = 'scraped-parts.json';
const OUTPUT_FILE = 'processed-parts.js';

function processScrapedData() {
  console.log('🔄 Processing scraped data...');
  
  try {
    // Read scraped data
    const scrapedPath = path.join(process.cwd(), 'src', 'scripts', SCRAPED_FILE);
    const rawData = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'));
    
    console.log(`📊 Found ${rawData.length} scraped items`);
    
    // Process and clean data
    const processedParts = rawData
      .filter(item => item.partNumber && item.title) // Only keep items with part number and title
      .map((item, index) => {
        // Clean and structure the data
        const partNumber = item.partNumber.trim();
        const title = item.title.trim();
        const description = item.description?.trim() || '';
        const externalLink = item.externalLink || null;
        
        // Determine category based on title/description keywords
        let categorySlug = 'filters'; // default
        const titleLower = title.toLowerCase();
        const descLower = description.toLowerCase();
        
        if (titleLower.includes('filter') || descLower.includes('filter')) {
          categorySlug = 'filters';
        } else if (titleLower.includes('pump') || descLower.includes('pump')) {
          categorySlug = 'pumps';
        } else if (titleLower.includes('sensor') || descLower.includes('sensor')) {
          categorySlug = 'sensors';
        } else if (titleLower.includes('hydraulic') || descLower.includes('hydraulic')) {
          categorySlug = 'hydraulic-filters';
        } else if (titleLower.includes('transmission') || descLower.includes('transmission')) {
          categorySlug = 'transmission-filters';
        } else if (titleLower.includes('teeth') || descLower.includes('teeth')) {
          categorySlug = 'bucket-teeth';
        } else if (titleLower.includes('adapter') || descLower.includes('adapter')) {
          categorySlug = 'adapters';
        } else if (titleLower.includes('pin') || descLower.includes('pin')) {
          categorySlug = 'pins-retainers';
        }
        
        // Extract tags from title and description
        const tags = [];
        const text = `${title} ${description}`.toLowerCase();
        
        if (text.includes('fuel')) tags.push('fuel');
        if (text.includes('oil')) tags.push('oil');
        if (text.includes('air')) tags.push('air');
        if (text.includes('water')) tags.push('water');
        if (text.includes('hydraulic')) tags.push('hydraulic');
        if (text.includes('transmission')) tags.push('transmission');
        if (text.includes('engine')) tags.push('engine');
        if (text.includes('filter')) tags.push('filter');
        if (text.includes('pump')) tags.push('pump');
        if (text.includes('sensor')) tags.push('sensor');
        if (text.includes('teeth')) tags.push('teeth');
        if (text.includes('adapter')) tags.push('adapter');
        if (text.includes('pin')) tags.push('pin');
        if (text.includes('retainer')) tags.push('retainer');
        
        // Determine manufacturer (you may need to adjust this based on the website)
        let manufacturerName = 'Caterpillar'; // Default for CAT Corp
        if (text.includes('shangchai')) manufacturerName = 'Shangchai';
        if (text.includes('weichai')) manufacturerName = 'Weichai';
        if (text.includes('faw')) manufacturerName = 'FAW';
        if (text.includes('komatsu')) manufacturerName = 'Komatsu';
        
        // Determine machine models (you may need to adjust this)
        const machineModels = [];
        if (text.includes('pc200')) machineModels.push('PC200');
        if (text.includes('pc300')) machineModels.push('PC300');
        if (text.includes('pc400')) machineModels.push('PC400');
        if (text.includes('sd22')) machineModels.push('SD22');
        if (text.includes('sd32')) machineModels.push('SD32');
        if (text.includes('k20')) machineModels.push('K20');
        if (text.includes('k25')) machineModels.push('K25');
        if (text.includes('k30')) machineModels.push('K30');
        
        // If no specific machine models found, add a generic one
        if (machineModels.length === 0) {
          machineModels.push('PC200'); // Default
        }
        
        return {
          partNumber,
          title,
          description: description.substring(0, 500), // Limit description length
          shortDescription: title, // Use title as short description
          price: null, // No price info from scraping
          externalLink,
          categorySlug,
          manufacturerName,
          machineModels,
          tags: [...new Set(tags)], // Remove duplicates
          source: 'scraped'
        };
      })
      .filter(part => part.partNumber.length >= 3); // Filter out very short part numbers
    
    console.log(`✅ Processed ${processedParts.length} parts`);
    
    // Generate JavaScript export
    const jsContent = `// Processed scraped parts data
export const scrapedPartsData = ${JSON.stringify(processedParts, null, 2)};

// Summary
export const summary = {
  totalParts: ${processedParts.length},
  categories: [...new Set(processedParts.map(p => p.categorySlug))],
  manufacturers: [...new Set(processedParts.map(p => p.manufacturerName))],
  machineModels: [...new Set(processedParts.flatMap(p => p.machineModels))]
};
`;
    
    // Save processed data
    const outputPath = path.join(process.cwd(), 'src', 'scripts', OUTPUT_FILE);
    fs.writeFileSync(outputPath, jsContent);
    
    console.log(`💾 Processed data saved to: ${outputPath}`);
    
    // Display summary
    console.log('\n📋 Summary:');
    console.log(`   Total parts: ${processedParts.length}`);
    console.log(`   Categories: ${[...new Set(processedParts.map(p => p.categorySlug))].join(', ')}`);
    console.log(`   Manufacturers: ${[...new Set(processedParts.map(p => p.manufacturerName))].join(', ')}`);
    console.log(`   Machine Models: ${[...new Set(processedParts.flatMap(p => p.machineModels))].join(', ')}`);
    
    // Show sample processed data
    console.log('\n📋 Sample processed data:');
    processedParts.slice(0, 3).forEach((part, index) => {
      console.log(`\n${index + 1}. ${part.partNumber} - ${part.title}`);
      console.log(`   Category: ${part.categorySlug}`);
      console.log(`   Manufacturer: ${part.manufacturerName}`);
      console.log(`   Machine Models: ${part.machineModels.join(', ')}`);
      console.log(`   Tags: ${part.tags.join(', ')}`);
      console.log(`   Link: ${part.externalLink || 'N/A'}`);
    });
    
    return processedParts;
    
  } catch (error) {
    console.error('❌ Error processing scraped data:', error);
    throw error;
  }
}

// Run the processor
processScrapedData()
  .then((data) => {
    console.log(`\n✅ Data processing completed!`);
    console.log('📝 Review the processed data and merge it with your existing seed file.');
  })
  .catch((error) => {
    console.error('❌ Processing failed:', error);
    process.exit(1);
  });


