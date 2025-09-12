import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { partsData } from './partsData.js';
import { newEngineParts } from './newEngineParts.js';
import { undercarriageParts } from './undercarriageParts.js';
import { jcbHydraulicParts } from './jcbHydraulicParts.js';
import { jcbAdditionalParts } from './jcbAdditionalParts.js';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Seed data
const categories = [
  {
    name: 'Engine Parts',
    slug: 'engine',
    description: 'High-performance engine components for maximum reliability and efficiency',
    sortOrder: 1,
    children: [
      {
        name: 'Filters',
        slug: 'filters',
        description: 'Air, fuel, oil, and hydraulic filters',
        sortOrder: 1
      },
      {
        name: 'Piston Kits',
        slug: 'piston-kits',
        description: 'Piston kits and oversize piston assemblies',
        sortOrder: 2
      },
      {
        name: 'Piston Ring Kits',
        slug: 'piston-ring-kits',
        description: 'Piston ring kits for engine rebuilds',
        sortOrder: 3
      },
      {
        name: 'Connecting Rod Bearings',
        slug: 'connecting-rod-bearings',
        description: 'Connecting rod bearing kits and assemblies',
        sortOrder: 4
      },
      {
        name: 'Crankshaft Bearings',
        slug: 'crankshaft-bearings',
        description: 'Crankshaft bearing kits and assemblies',
        sortOrder: 5
      },
      {
        name: 'Fuel Injection Components',
        slug: 'fuel-injection',
        description: 'Fuel injection lines, pumps, and components',
        sortOrder: 6
      },
      {
        name: 'Governor Components',
        slug: 'governor-components',
        description: 'Governor plugs, linkages, and control components',
        sortOrder: 7
      },
      {
        name: 'Air System',
        slug: 'air-system',
        description: 'Air compressor and intake system components',
        sortOrder: 8
      },
      {
        name: 'Exhaust System',
        slug: 'exhaust-system',
        description: 'Exhaust manifold and exhaust system components',
        sortOrder: 9
      },
      {
        name: 'Turbocharger System',
        slug: 'turbocharger-system',
        description: 'Turbocharger oil lines and system components',
        sortOrder: 10
      },
      {
        name: 'Seals & Gaskets',
        slug: 'seals-gaskets',
        description: 'O-rings, seals, and gaskets for engine components',
        sortOrder: 11
      },
      {
        name: 'HVAC / Operator Cabin',
        slug: 'hvac-cabin',
        description: 'Heater control and operator cabin components',
        sortOrder: 12
      },
      {
        name: 'Electrical / Fasteners',
        slug: 'electrical-fasteners',
        description: 'Electrical components and specialized fasteners',
        sortOrder: 13
      }
    ]
  },
  {
    name: 'Hydraulic Systems',
    slug: 'hydraulic',
    description: 'Complete hydraulic solutions for heavy-duty applications',
    sortOrder: 2,
    children: [
      {
        name: 'Hydraulic Filters',
        slug: 'hydraulic-filters',
        description: 'Hydraulic oil filters and return filters',
        sortOrder: 1
      },
      {
        name: 'Hydraulic Pumps',
        slug: 'hydraulic-pumps',
        description: 'Hydraulic pumps and motors',
        sortOrder: 2
      },
      {
        name: 'Hydraulic Pump Components',
        slug: 'hydraulic-pump-components',
        description: 'Hydraulic pump components and assemblies',
        sortOrder: 3
      },
      {
        name: 'Hydraulic Seals',
        slug: 'hydraulic-seals',
        description: 'Hydraulic seals and seal kits',
        sortOrder: 4
      },
      {
        name: 'Hydraulic Valves',
        slug: 'hydraulic-valves',
        description: 'Hydraulic valves and control valves',
        sortOrder: 5
      },
      {
        name: 'Hydraulic Components',
        slug: 'hydraulic-components',
        description: 'General hydraulic components and housings',
        sortOrder: 6
      }
    ]
  },
  {
    name: 'Transmission & Drivetrain',
    slug: 'transmission',
    description: 'Precision transmission components for smooth power delivery',
    sortOrder: 3,
    children: [
      {
        name: 'Transmission Filters',
        slug: 'transmission-filters',
        description: 'Transmission oil filters and magnet elements',
        sortOrder: 1
      },
      {
        name: 'Transmission Parts',
        slug: 'transmission-parts',
        description: 'Drive shafts and transmission components',
        sortOrder: 2
      }
    ]
  },
  {
    name: 'Attachments & Wear Parts',
    slug: 'attachments',
    description: 'Bucket teeth, adapters, pins and retainers for excavators and heavy machinery',
    sortOrder: 4,
    children: [
      {
        name: 'Bucket Teeth',
        slug: 'bucket-teeth',
        description: 'Excavator bucket teeth for various applications',
        sortOrder: 1
      },
      {
        name: 'Adapters',
        slug: 'adapters',
        description: 'Teeth adapters and mounting systems',
        sortOrder: 2
      },
      {
        name: 'Pins & Retainers',
        slug: 'pins-retainers',
        description: 'Retaining pins and retainer systems',
        sortOrder: 3
      },
      {
        name: 'Side Cutters',
        slug: 'side-cutters',
        description: 'Side cutter attachments for excavator buckets',
        sortOrder: 4
      }
    ]
  },
  {
    name: 'Undercarriage Systems',
    slug: 'undercarriage',
    description: 'Complete undercarriage solutions for track-type machines',
    sortOrder: 5,
    children: [
      {
        name: 'Track Guides',
        slug: 'track-guides',
        description: 'Track guides and roller guards for undercarriage systems',
        sortOrder: 1
      },
      {
        name: 'Track Seals',
        slug: 'track-seals',
        description: 'Track seals and sealing components',
        sortOrder: 2
      },
      {
        name: 'Track Links',
        slug: 'track-links',
        description: 'Track links and link assemblies',
        sortOrder: 3
      },
      {
        name: 'Track Guards',
        slug: 'track-guards',
        description: 'Track guards and protection systems',
        sortOrder: 4
      },
      {
        name: 'Track Rollers',
        slug: 'track-rollers',
        description: 'Track rollers and carrier rollers',
        sortOrder: 5
      },
      {
        name: 'Track Idlers',
        slug: 'track-idlers',
        description: 'Track idlers and idler assemblies',
        sortOrder: 6
      },
      {
        name: 'Track Pads',
        slug: 'track-pads',
        description: 'Track pads and track shoes',
        sortOrder: 7
      },
      {
        name: 'Track Groups',
        slug: 'track-groups',
        description: 'Complete track groups and assemblies',
        sortOrder: 8
      },
      {
        name: 'Track Shoes',
        slug: 'track-shoes',
        description: 'Individual track shoes and grouser shoes',
        sortOrder: 9
      },
      {
        name: 'Wear Sleeves',
        slug: 'wear-sleeves',
        description: 'Wear sleeves and frame sleeves',
        sortOrder: 10
      },
      {
        name: 'Wear Plates',
        slug: 'wear-plates',
        description: 'Wear plates and protection plates',
        sortOrder: 11
      },
      {
        name: 'Carrier Rollers',
        slug: 'carrier-rollers',
        description: 'Carrier rollers and mounting brackets',
        sortOrder: 12
      },
      {
        name: 'Track Pins',
        slug: 'track-pins',
        description: 'Track pins and master pins',
        sortOrder: 13
      },
      {
        name: 'Frame Covers',
        slug: 'frame-covers',
        description: 'Frame covers and protection covers',
        sortOrder: 14
      },
      {
        name: 'Guard Covers',
        slug: 'guard-covers',
        description: 'Guard covers and adjuster covers',
        sortOrder: 15
      },
      {
        name: 'Frame Guards',
        slug: 'frame-guards',
        description: 'Frame guards and idler guards',
        sortOrder: 16
      },
      {
        name: 'Rubber Tracks',
        slug: 'rubber-tracks',
        description: 'Rubber tracks and smooth tread tracks',
        sortOrder: 17
      },
      {
        name: 'Track Steps',
        slug: 'track-steps',
        description: 'Track steps and step components',
        sortOrder: 18
      },
      {
        name: 'Tools',
        slug: 'tools',
        description: 'Maintenance tools and specialized equipment',
        sortOrder: 19
      }
    ]
  },
  {
    name: 'Brake Systems',
    slug: 'brake-systems',
    description: 'Complete brake system components for heavy machinery',
    sortOrder: 6,
    children: [
      {
        name: 'Brake Parts',
        slug: 'brake-parts',
        description: 'Brake discs, friction plates, and brake components',
        sortOrder: 1
      }
    ]
  },
  {
    name: 'Steering Systems',
    slug: 'steering-systems',
    description: 'Steering system components and assemblies',
    sortOrder: 7,
    children: [
      {
        name: 'Steering Parts',
        slug: 'steering-parts',
        description: 'Steering couplings, rack ends, and tie rod assemblies',
        sortOrder: 1
      }
    ]
  },
  {
    name: 'Mechanical Components',
    slug: 'mechanical-components',
    description: 'General mechanical components and hardware',
    sortOrder: 8,
    children: [
      {
        name: 'Bushes',
        slug: 'bushes',
        description: 'Bushes and bushings for various applications',
        sortOrder: 1
      },
      {
        name: 'Pins',
        slug: 'pins',
        description: 'Pins and fasteners for mechanical connections',
        sortOrder: 2
      },
      {
        name: 'Seal Kits',
        slug: 'seal-kits',
        description: 'Complete seal kits and sealing components',
        sortOrder: 3
      }
    ]
  }
];

const manufacturers = [
  { name: 'Shangchai', description: 'Shangchai Power Co., Ltd.' },
  { name: 'Weichai', description: 'Weichai Power Co., Ltd.' },
  { name: 'FAW', description: 'First Automobile Works' },
  { name: 'Komatsu', description: 'Komatsu Ltd.' },
  { name: 'Caterpillar', description: 'Caterpillar Inc.' },
  { name: 'Hitachi', description: 'Hitachi Construction Machinery' },
  { name: 'JCB', description: 'J.C. Bamford Excavators Ltd.' }
];

const machineModels = [
  { name: 'SD22', manufacturer: 'Shangchai' },
  { name: 'SD32', manufacturer: 'Shangchai' },
  { name: 'SG18-3', manufacturer: 'Shangchai' },
  { name: 'SL30', manufacturer: 'FAW' },
  { name: 'SE210/SE220/SE240', manufacturer: 'Shangchai' },
  { name: 'SE330', manufacturer: 'Shangchai' },
  { name: 'PC200', manufacturer: 'Komatsu' },
  { name: 'PC300', manufacturer: 'Komatsu' },
  { name: 'PC400', manufacturer: 'Komatsu' },
  { name: 'K20', manufacturer: 'Komatsu' },
  { name: 'K25', manufacturer: 'Komatsu' },
  { name: 'K30', manufacturer: 'Komatsu' },
  { name: '3DX', manufacturer: 'JCB' },
  { name: '3D', manufacturer: 'JCB' }
];

// Use comprehensive parts data + new engine parts + undercarriage parts + JCB hydraulic parts + JCB additional parts
const parts = [...partsData, ...newEngineParts, ...undercarriageParts, ...jcbHydraulicParts, ...jcbAdditionalParts];

async function main() {
  console.log('🌱 Starting optimized database seed...');
  const startTime = Date.now();

  try {
    // Clear existing data first
    console.log('🧹 Clearing existing data...');
    await prisma.partCompatibility.deleteMany();
    await prisma.part.deleteMany();
    await prisma.category.deleteMany();
    await prisma.machineModel.deleteMany();
    await prisma.manufacturer.deleteMany();

    // Create manufacturers in batch
    console.log('📦 Creating manufacturers...');
    const createdManufacturers = await prisma.manufacturer.createMany({
      data: manufacturers,
      skipDuplicates: true
    });
    const manufacturerMap = {};
    for (const manufacturer of manufacturers) {
      const created = await prisma.manufacturer.findUnique({
        where: { name: manufacturer.name }
      });
      manufacturerMap[manufacturer.name] = created;
    }

    // Create machine models in batch
    console.log('🚜 Creating machine models...');
    const machineModelData = machineModels.map(model => ({
      name: model.name,
      manufacturerId: manufacturerMap[model.manufacturer].id
    }));
    await prisma.machineModel.createMany({
      data: machineModelData,
      skipDuplicates: true
    });
    const machineModelMap = {};
    for (const model of machineModels) {
      const created = await prisma.machineModel.findFirst({
        where: { 
          name: model.name,
          manufacturerId: manufacturerMap[model.manufacturer].id
        }
      });
      machineModelMap[model.name] = created;
    }

    // Create categories
    console.log('📂 Creating categories...');
    const createdCategories = {};
    
    // Create parent categories first
    for (const category of categories) {
      const { children, ...categoryData } = category;
      const created = await prisma.category.create({
        data: categoryData
      });
      createdCategories[categoryData.slug] = created;

      // Create child categories
      for (const child of children) {
        const createdChild = await prisma.category.create({
          data: {
            ...child,
            parentId: created.id
          }
        });
        createdCategories[child.slug] = createdChild;
      }
    }

    // Prepare parts data for batch creation
    console.log('🔧 Preparing parts data...');
    const partsData = parts.map(part => ({
      partNumber: part.partNumber,
      title: part.title,
      description: part.description,
      shortDescription: part.shortDescription,
      price: part.price || null,
      externalLink: part.externalLink || null,
      images: [`/images/parts/${part.partNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`],
      tags: part.tags,
      categoryId: createdCategories[part.categorySlug]?.id,
      manufacturerId: manufacturerMap[part.manufacturerName]?.id
    }));

    // Create parts in batch
    console.log('🔧 Creating parts in batch...');
    await prisma.part.createMany({
      data: partsData,
      skipDuplicates: true
    });

    // Create part compatibilities in batch
    console.log('🔗 Creating part compatibilities...');
    const compatibilityData = [];
    
    for (const part of parts) {
      const createdPart = await prisma.part.findUnique({
        where: { partNumber: part.partNumber }
      });
      
      for (const machineModelName of part.machineModels) {
        const machineModel = machineModelMap[machineModelName];
        if (machineModel && createdPart) {
          compatibilityData.push({
            partId: createdPart.id,
            machineModelId: machineModel.id
          });
        }
      }
    }

    await prisma.partCompatibility.createMany({
      data: compatibilityData,
      skipDuplicates: true
    });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log('✅ Optimized database seed completed successfully!');
    console.log(`⏱️  Completed in ${duration.toFixed(2)} seconds`);
    console.log(`📊 Created:`);
    console.log(`   - ${manufacturers.length} manufacturers`);
    console.log(`   - ${machineModels.length} machine models`);
    console.log(`   - ${categories.length} parent categories`);
    console.log(`   - ${categories.reduce((acc, cat) => acc + cat.children.length, 0)} child categories`);
    console.log(`   - ${parts.length} parts`);
    console.log(`   - ${compatibilityData.length} part compatibilities`);

  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
