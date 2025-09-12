import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/**
 * Web scraper for extracting parts data from CAT Corp website
 * Usage: node src/scripts/scraper.js
 */

const BASE_URL = 'https://en.catcorp.com/category/engines';
const OUTPUT_FILE = 'scraped-parts.json';

async function scrapePartsData() {
  console.log('🚀 Starting web scraper...');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for production
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('📄 Navigating to:', BASE_URL);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Extract parts data
    const partsData = await page.evaluate(() => {
      const parts = [];
      
      // Look for common selectors that might contain part data
      const partSelectors = [
        '.product-item',
        '.part-item',
        '.item',
        '.product',
        '[data-part-number]',
        '.part-card',
        '.product-card'
      ];
      
      let partElements = [];
      
      // Try different selectors
      for (const selector of partSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          partElements = elements;
          console.log(`Found ${elements.length} parts using selector: ${selector}`);
          break;
        }
      }
      
      // If no specific selectors found, look for any elements that might contain part numbers
      if (partElements.length === 0) {
        const allElements = document.querySelectorAll('*');
        partElements = Array.from(allElements).filter(el => {
          const text = el.textContent || '';
          // Look for elements that might contain part numbers (alphanumeric patterns)
          return /[A-Z0-9]{6,}/.test(text) && text.length < 200;
        });
      }
      
      partElements.forEach((element, index) => {
        try {
          const text = element.textContent?.trim() || '';
          const href = element.querySelector('a')?.href || '';
          
          // Extract potential part numbers (alphanumeric patterns)
          const partNumberMatch = text.match(/([A-Z0-9]{6,})/);
          const partNumber = partNumberMatch ? partNumberMatch[1] : null;
          
          // Extract potential titles (look for text that might be part names)
          const titleMatch = text.match(/([A-Za-z\s]{10,})/);
          const title = titleMatch ? titleMatch[1].trim() : null;
          
          if (partNumber && title) {
            parts.push({
              partNumber,
              title: title.substring(0, 100), // Limit title length
              description: text.substring(0, 500), // Limit description length
              externalLink: href,
              rawText: text.substring(0, 1000), // Keep raw text for analysis
              elementTag: element.tagName,
              elementClass: element.className
            });
          }
        } catch (error) {
          console.log('Error processing element:', error);
        }
      });
      
      return parts;
    });
    
    console.log(`📊 Found ${partsData.length} potential parts`);
    
    // Save to file
    const outputPath = path.join(process.cwd(), 'src', 'scripts', OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(partsData, null, 2));
    
    console.log(`💾 Data saved to: ${outputPath}`);
    
    // Display sample data
    if (partsData.length > 0) {
      console.log('\n📋 Sample extracted data:');
      partsData.slice(0, 3).forEach((part, index) => {
        console.log(`\n${index + 1}. Part Number: ${part.partNumber}`);
        console.log(`   Title: ${part.title}`);
        console.log(`   Link: ${part.externalLink}`);
        console.log(`   Raw Text: ${part.rawText.substring(0, 100)}...`);
      });
    }
    
    return partsData;
    
  } catch (error) {
    console.error('❌ Error during scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapePartsData()
  .then((data) => {
    console.log(`\n✅ Scraping completed! Found ${data.length} parts.`);
    console.log('📝 Review the scraped data and manually clean it before adding to seed file.');
  })
  .catch((error) => {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  });
