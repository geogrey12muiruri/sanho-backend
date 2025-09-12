# Sanho Parts Connect - Backend API

A Node.js/Express backend API for the Sanho Parts Connect heavy machinery parts catalog.

## Features

- **RESTful API** for parts and categories management
- **PostgreSQL Database** with Prisma ORM
- **Comprehensive Parts Catalog** with 240+ parts across 8 categories
- **Search & Filtering** capabilities
- **WhatsApp Integration** for parts ordering
- **Enterprise-level Architecture** with proper error handling, validation, and logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS
- **Rate Limiting**: express-rate-limit

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
```

3. Configure your `.env` file with:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/sanho_parts"
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:8081
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Parts
- `GET /api/parts` - Get all parts with filtering and pagination
- `GET /api/parts/:id` - Get a specific part by ID
- `GET /api/parts/search` - Search parts by query

### Categories
- `GET /api/categories` - Get all categories with hierarchy

### Health
- `GET /api/health` - Health check endpoint

## Database Schema

The database includes the following main entities:
- **Categories** - Hierarchical category structure
- **Parts** - Parts with detailed information
- **Manufacturers** - Parts manufacturers
- **Machine Models** - Compatible machine models
- **Part Compatibilities** - Many-to-many relationship between parts and machine models

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset and reseed database
- `npm run build` - Build for production

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://username:password@host:5432/sanho_parts"
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment

```bash
# Build Docker image
docker build -t sanho-parts-backend .

# Run container
docker run -p 3001:3001 --env-file .env sanho-parts-backend
```

## Data

The database is seeded with:
- **8 Parent Categories** (Engine, Hydraulic, Transmission, etc.)
- **49 Subcategories** 
- **240+ Parts** with detailed specifications
- **7 Manufacturers** (Caterpillar, Komatsu, JCB, etc.)
- **14 Machine Models** with compatibility mapping

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

Private - Sanho Parts Connect