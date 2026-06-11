# Victor IA SaaS - Setup Guide

## Installation

```bash
npm install
```

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

ANTHROPIC_API_KEY=
N8N_BASE_URL=http://localhost:5679
```

## Running Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
victor-ia-app/
├── app/
│   ├── api/                    # API Routes (15+)
│   ├── dashboard/              # Dashboard pages
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   └── shared/                 # 25 Reusable components
├── lib/
│   ├── services/               # 18 Backend services
│   ├── stores/                 # 10 Zustand stores
│   ├── hooks/                  # 32 Custom hooks
│   ├── types/                  # TypeScript types
│   └── db/                     # Database config
└── public/                     # Static assets
```

## 10 Modules

1. **Generators** - Create 6+ content types (image, video, presentation, email, landing-page, social-post)
2. **Agents** - Deploy 8+ AI agents (lead_qualifier, pitch_generator, content_strategist, etc)
3. **CRM** - Manage sales pipeline with 7 stages
4. **Automation** - Connect n8n workflows and webhooks
5. **Analytics** - Track events, metrics, and generate reports
6. **Training** - Create courses, quizzes, certificates
7. **HR** - Team management, payroll, org chart
8. **Finance** - Budgets, invoices, P&L statements
9. **Integrations** - Connect MCPs and external services
10. **Settings** - User profile, preferences, billing

## Technology Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS (white/black only + dark mode)
- **State**: Zustand
- **Database**: Supabase PostgreSQL
- **Auth**: Clerk
- **AI**: Claude API, ElevenLabs, Higgsfield
- **Backend**: n8n for automation

## API Endpoints

### Core
- POST `/api/generate` - Generate content
- GET/POST `/api/agents` - Manage agents
- GET/POST `/api/crm` - CRM operations
- GET/POST `/api/automation` - n8n workflows
- GET/POST `/api/analytics` - Analytics tracking

### Resources
- GET/PUT `/api/user` - User profile
- GET/POST `/api/credits` - Credit management
- GET/POST `/api/training` - Training courses
- GET/POST `/api/hr` - HR management
- GET/POST `/api/finance` - Finance management
- GET/POST `/api/integrations` - Integrations
- GET/POST `/api/queue` - Job queue
- GET/POST `/api/export` - Data export
- GET/POST `/api/trends` - Trending items
- GET/POST `/api/prompts` - Prompt enhancement
- GET/POST `/api/collaboration` - Collaboration

## Features

✅ White/black color scheme only
✅ Dark mode support
✅ Shadow and hover effects throughout
✅ 25 shared components
✅ 18 fully-typed services
✅ 32 custom hooks
✅ 10 module stores
✅ 15+ API routes
✅ Supabase integration
✅ Clerk authentication
✅ n8n automation
✅ Claude AI integration
✅ Responsive design

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set environment variables in Vercel dashboard, then redeploy.

## Support

For issues or questions, check the documentation or contact support.
