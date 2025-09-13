# Sanho Parts Backend - Deployment Guide

## Render Deployment

### Prerequisites
1. PostgreSQL database (Render provides this)
2. Environment variables configured
3. GitHub repository connected

### Environment Variables Required
```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Render Configuration

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Node Version**: 18.x or higher

### Common Issues & Solutions

#### 1. npm install stuck/hanging
**Problem**: Render gets stuck during npm install
**Solutions**:
- Remove heavy dependencies (Puppeteer, Redis) from production
- Use `npm ci` instead of `npm install`
- Add `.npmrc` file with timeout settings

#### 2. Prisma Client Issues
**Problem**: Prisma client not generated
**Solutions**:
- Added `postinstall` script to run `prisma generate`
- Moved `prisma` to dependencies (not devDependencies)

#### 3. Memory Issues
**Problem**: Out of memory during build
**Solutions**:
- Removed heavy dependencies (Puppeteer, Redis)
- Optimized package.json for production

### Deployment Steps

1. **Connect GitHub Repository**
   - Link your GitHub repo to Render
   - Select the `backend` folder as root directory

2. **Configure Environment Variables**
   - Add `DATABASE_URL` from your PostgreSQL service
   - Add `NODE_ENV=production`
   - Add `FRONTEND_URL` (your frontend domain)

3. **Deploy**
   - Render will automatically build and deploy
   - Check logs for any errors

### Database Setup

1. **Create PostgreSQL Database**
   - Use Render's PostgreSQL service
   - Copy the connection string

2. **Run Migrations**
   ```bash
   npm run db:push
   ```

3. **Seed Data** (Optional)
   ```bash
   npm run db:seed
   ```

### Monitoring

- Check Render logs for errors
- Monitor database connections
- Verify API endpoints are working

### Troubleshooting

#### Build Fails
- Check Node.js version (18+)
- Verify all dependencies are compatible
- Check for missing environment variables

#### Runtime Errors
- Verify database connection
- Check CORS settings
- Verify environment variables

#### Performance Issues
- Monitor memory usage
- Check database query performance
- Optimize API responses

### Production Checklist

- [ ] Environment variables configured
- [ ] Database connected and migrated
- [ ] CORS settings updated for production frontend
- [ ] Error handling working
- [ ] Logging configured
- [ ] Health check endpoint working
- [ ] API endpoints tested
