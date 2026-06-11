# Victor IA SaaS

🚀 **Complete AI-powered SaaS platform** with 10 modules, built with Next.js 14, React 19, TypeScript, and Tailwind CSS.

## ✨ Features

### 10 Powerful Modules

1. **Generators** - Create content in 6+ formats (images, videos, presentations, emails, landing pages, social posts, audio, PDF)
2. **Agents** - Deploy 8+ AI agents for automation (Lead Qualifier, Content Strategist, SEO Expert, Blog Writer, etc.)
3. **CRM** - Complete sales pipeline with 7 stages and prospect management
4. **Automation** - n8n workflow integration for process automation
5. **Analytics** - Real-time metrics, event tracking, and reporting
6. **Training** - Course management with progress tracking and certificates
7. **HR** - Team management, roles, payroll, and organizational charts
8. **Finance** - Budget management, invoices, expenses, and P&L statements
9. **Integrations** - MCP connections and external service sync
10. **Settings** - User profile, preferences, and billing management

### Technical Highlights

✅ **White/Black Color Scheme** - Only white (#FFF) and black (#000) with grayscale  
✅ **Dark Mode** - Full dark mode support via Tailwind  
✅ **Responsive Design** - Mobile-first, works on all devices  
✅ **Type Safety** - 100% TypeScript strict mode  
✅ **Component Library** - 25 reusable, accessible components  
✅ **State Management** - 10 Zustand stores for efficient state  
✅ **Custom Hooks** - 32 production-ready hooks  
✅ **Backend Services** - 18 fully-typed services with Supabase  
✅ **API Routes** - 15+ fully-documented REST endpoints  
✅ **Authentication** - Clerk auth integration  
✅ **Database** - Supabase PostgreSQL with RLS  
✅ **AI Integrations** - Claude, ElevenLabs, Higgsfield APIs  

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/victor-ia-saas.git
cd victor-ia-saas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
victor-ia-app/
├── app/                              # Next.js app directory
│   ├── api/                         # API routes (15+ endpoints)
│   ├── dashboard/                   # Dashboard pages
│   │   ├── generators/              # Content generators
│   │   ├── agents/                  # AI agents
│   │   ├── crm/                     # CRM module
│   │   ├── automation/              # n8n workflows
│   │   ├── analytics/               # Analytics
│   │   ├── training/                # Training courses
│   │   ├── hr/                      # HR management
│   │   ├── finance/                 # Finance management
│   │   ├── integrations/            # External integrations
│   │   └── settings/                # User settings
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
├── components/
│   ├── shared/                      # 25 Base components
│   └── modules/                     # Module-specific components
├── lib/
│   ├── services/                    # 18 Backend services
│   ├── stores/                      # 10 Zustand stores
│   ├── hooks/                       # 32 Custom hooks
│   ├── types/                       # TypeScript definitions
│   ├── utils/                       # Utility functions
│   ├── constants.ts                 # App constants
│   └── db/                          # Database config
├── __tests__/                       # Test files
├── middleware.ts                    # Auth middleware
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript config
└── next.config.js                   # Next.js config
```

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript 5
- **Styling**: Tailwind CSS 3 (white/black only)
- **State**: Zustand 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk
- **API Clients**: 
  - Anthropic (Claude API)
  - ElevenLabs (Voice AI)
  - Higgsfield (Image/Video Generation)
  - n8n (Workflow Automation)
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel
- **Package Manager**: npm

## 📝 API Documentation

### Core Endpoints

```
POST   /api/generate              Generate content (images, videos, etc)
GET/POST /api/agents              Manage AI agents
GET/POST /api/crm                 CRM operations
GET/POST /api/automation          n8n workflow management
GET/POST /api/analytics           Event tracking and metrics
GET/POST /api/auth                Authentication
GET/POST /api/credits             Credit management
GET/POST /api/training            Training courses
GET/POST /api/hr                  Team management
GET/POST /api/finance             Financial operations
GET/POST /api/integrations        External integrations
GET/POST /api/queue               Job queue
GET/POST /api/export              Data export
GET/POST /api/trends              Trending items
GET/POST /api/prompts             Prompt enhancement
```

Full API documentation in `SETUP.md` and `DEPLOYMENT.md`.

## 🎨 Component Library

25 production-ready components with dark mode and accessibility:

- **UI**: Button, Card, Input, Badge, Alert
- **Forms**: Checkbox, Radio, Select, Input
- **Layout**: Modal, Drawer, Popover, Tooltip
- **Navigation**: Tabs, Breadcrumb, Pagination, Dropdown
- **Feedback**: Toast, Skeleton, Loader, Empty
- **Display**: Avatar, Timeline, Table, Accordion
- **Structure**: Form, Card variants

All components support white/black styling with dark mode.

## 🪝 Custom Hooks (32 Available)

Core hooks for common patterns:

- **Data**: useAsync, useFetch, useSearch, usePagination, useInfiniteScroll
- **Forms**: useForm, useDebounce
- **DOM**: useClickOutside, useKeypress, useScroll, useIntersection
- **State**: useToggle, useArray, usePrevious, useModal
- **Theme**: useTheme, useDarkMode
- **Auth**: useAuth, useUser, useCredits
- **Analytics**: useAnalytics

See `lib/hooks/` for complete list.

## 📊 Services Layer (18 Services)

Fully-typed backend services with Supabase integration:

- GeneratorsService
- AgentsService
- CRMService
- AutomationService
- CreditsService
- TrainingService
- HRService
- FinanceService
- IntegrationsService
- AnalyticsAdvancedService
- QueueService
- CollaborationService
- ExportService
- VersioningService
- TrendingService
- PromptEnhancerService

Each service includes methods for CRUD operations and Supabase integration.

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📦 Building for Production

```bash
npm run build
npm run start
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
vercel
```

See `DEPLOYMENT.md` for detailed instructions.

## 🔐 Security

- Clerk authentication
- Supabase RLS (Row Level Security)
- Environment variables for secrets
- Input validation and sanitization
- SQL injection protection
- XSS protection via React

## 📄 License

MIT

## 👤 Author

Created with ❤️ for AI automation and productivity.

---

## 📞 Support

- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Documentation: See `SETUP.md` and `DEPLOYMENT.md`

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Advanced reporting
- [ ] Custom integrations
- [ ] Webhook support
- [ ] API rate limiting
- [ ] Advanced security

---

**Victor IA SaaS** - The Complete AI Platform for Businesses
