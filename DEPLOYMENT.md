# Deployment Guide

## Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account (vercel.com)
- GitHub repository connected to Vercel

### Steps

1. **Install Vercel CLI** (optional)
```bash
npm install -g vercel
```

2. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add all variables from `.env.example`:
     - CLERK_SECRET_KEY
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY
     - ANTHROPIC_API_KEY
     - N8N_BASE_URL
     - etc.

3. **Deploy**
```bash
vercel
```

### Automatic Deployments
- Every push to main automatically deploys
- Preview deployments for pull requests
- Custom domain configuration in Vercel

## Database Setup (Supabase)

1. Create Supabase project
2. Run migrations:
```bash
npx supabase migration up
```

## Environment Configuration

### Production
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Staging
```
NODE_ENV=development
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
```

## Performance Optimization

- Next.js automatic code splitting enabled
- Image optimization enabled
- CSS optimization via Tailwind
- Database query optimization recommended

## Monitoring

Setup monitoring in Vercel:
- Web Analytics
- Performance metrics
- Error tracking via Sentry (optional)

## Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection protection
- [ ] XSS protection enabled

