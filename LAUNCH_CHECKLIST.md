# 🚀 Victor IA SaaS - Launch Checklist

## STEP 1: SETUP & VERIFICATION (20 minutes)

### 1.1 Local Testing
```bash
npm install
npm run dev
# Visit http://localhost:3000
# Verify all pages load
```

### 1.2 Create Required Accounts (Free)
- [ ] Vercel account: https://vercel.com
- [ ] Clerk account: https://dashboard.clerk.com
- [ ] Supabase account: https://app.supabase.com
- [ ] Stripe account: https://dashboard.stripe.com

### 1.3 Setup Database (Supabase)
- [ ] Create new project in Supabase
- [ ] Go to SQL Editor
- [ ] Copy-paste content from `supabase/migrations/001_init.sql`
- [ ] Run the SQL
- [ ] Get API keys from Settings → API

### 1.4 Setup Auth (Clerk)
- [ ] Create new app in Clerk
- [ ] Get API keys
- [ ] Set Redirect URLs:
  - `http://localhost:3000` (development)
  - `https://victor-ia-app.vercel.app` (production)

### 1.5 Setup Payments (Stripe)
- [ ] Create new account
- [ ] Create 3 products (Starter, Pro, Enterprise)
- [ ] Create 3 prices (recurring)
- [ ] Get API keys
- [ ] **Save these PRICE IDs** - you'll need them

---

## STEP 2: DEPLOY (5 minutes)

### 2.1 Connect to Vercel
```bash
# Terminal in your project directory
vercel
# Follow prompts
# Select: "Create new project"
```

### 2.2 Add Environment Variables in Vercel
Go to: https://vercel.com/dashboard
1. Select your project
2. Settings → Environment Variables
3. Add EACH variable (follow DEPLOYMENT_CHECKLIST.md)
4. Vercel redeploy automatically

**Variables needed:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_STARTER_PRICE_ID
STRIPE_PRO_PRICE_ID
STRIPE_ENTERPRISE_PRICE_ID
NEXT_PUBLIC_APP_URL = https://victor-ia-app.vercel.app
```

### 2.3 Setup Stripe Webhook
- [ ] In Stripe Dashboard → Developers → Webhooks
- [ ] Add endpoint: `https://victor-ia-app.vercel.app/api/stripe/webhook`
- [ ] Select events:
  - checkout.session.completed
  - customer.subscription.updated
  - customer.subscription.deleted
- [ ] Copy webhook secret → Add to Vercel env vars

### 2.4 Verify Deployment
- [ ] Visit https://victor-ia-app.vercel.app
- [ ] Landing page loads ✓
- [ ] Click "Get Started" → Clerk login appears ✓
- [ ] After login → Dashboard loads ✓
- [ ] Can navigate to /pricing ✓
- [ ] Dark mode works ✓

---

## STEP 3: GET CUSTOM DOMAIN (5 minutes)

### 3.1 Buy Domain
- [ ] Go to: Namecheap, GoDaddy, or your registrar
- [ ] Search: `your-domain.com` (or your choice)
- [ ] Buy for 1 year (~$12)

### 3.2 Connect to Vercel
In Vercel → Your Project → Settings → Domains
- [ ] Add your domain
- [ ] Copy DNS records
- [ ] Paste in your registrar's DNS settings
- [ ] Wait 5-10 minutes for propagation

### 3.3 Update Production URL
- [ ] In Vercel env vars, update:
  - `NEXT_PUBLIC_APP_URL = https://your-domain.com`
- [ ] In Clerk, add authorized origin: `https://your-domain.com`
- [ ] In Stripe, update webhook URL (if using custom domain)

---

## STEP 4: CUSTOMER ACQUISITION (Start Today!)

### 4.1 Email Outreach

**Template 1: Personalized to CTOs**
```
Subject: I built a platform for your team's content & automation

Hi [Name],

I just launched Victor IA - a complete SaaS with 10 modules for content generation, CRM, automation, and analytics.

If you've been frustrated with juggling multiple tools, this might interest you: everything in one platform.

→ Try for free (100 credits): https://your-domain.com

No credit card needed, takes 5 minutes.

Curious to hear if it's useful for your team.

[Your name]
```

**Template 2: General**
```
Subject: Built something you might find useful

Hey,

Just launched Victor IA - all-in-one platform for AI content generation, sales automation, and analytics.

Free trial: https://your-domain.com

Would love your feedback.

[Your name]
```

### 4.2 Send to Contacts
- [ ] Create list of 50 relevant people
- [ ] Send personalized emails (takes ~1 hour)
- [ ] Track opens and clicks

### 4.3 Communities
- [ ] Post on HackerNews ("Show HN: Victor IA")
- [ ] Share on Indiehackers
- [ ] Post on relevant subreddits (r/SaaS, r/Entrepreneur)
- [ ] LinkedIn: Share your launch story

### 4.4 Monitor Results
- [ ] Check Vercel analytics for traffic
- [ ] Check Clerk dashboard for signups
- [ ] Check Stripe dashboard for first payments 💰
- [ ] Respond FAST to inquiries (within 1 hour)

---

## SUCCESS METRICS (Track Daily)

```
Day 1:  ??? signups, $? revenue
Day 3:  ??? signups, $? revenue
Day 7:  ??? signups, $? revenue

Goal: 5-10 signups + $100+ revenue by Day 7
```

---

## 🎯 NEXT ACTIONS (In Order)

1. **NOW** - Run `vercel` command
2. **5 min** - Set up env vars in Vercel
3. **10 min** - Verify everything works
4. **30 min** - Send first 10 emails
5. **Daily** - Send more emails + monitor dashboard

---

## 💡 TIPS FOR SUCCESS

✅ **DO:**
- Respond to inquiries in < 1 hour
- Offer "free for first month" to early adopters
- Track which messaging resonates
- Iterate based on feedback
- Build in public (share progress)

❌ **DON'T:**
- Wait for perfection before launching
- Spend time on features no one asked for
- Ignore early feedback
- Forget to follow up with interested people
- Overthink the domain name

---

## 🚀 ESTIMATED TIMELINE

- **Now**: Deploy
- **Today**: First 10 customers
- **Week 1**: $100-500 revenue
- **Month 1**: $500-2k MRR
- **Month 2**: $2k-5k MRR (if product-market fit)

You've got everything you need. 🚀

Let's go!