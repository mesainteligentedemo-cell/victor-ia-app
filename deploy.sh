#!/bin/bash

# Victor IA App - Deployment Script
# Automatiza el proceso de deployment a Vercel

set -e

echo "🚀 Victor IA App - Deployment Script"
echo "======================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Step 1: Build verification
echo "📦 Building app locally..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Step 2: Environment variables check
echo ""
echo "🔐 Checking environment variables..."
REQUIRED_VARS=(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "ANTHROPIC_API_KEY"
    "STRIPE_SECRET_KEY"
    "ELEVENLABS_API_KEY"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "✅ All required environment variables found"
else
    echo "❌ Missing environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "ℹ️  Update .env.local and try again"
    exit 1
fi

# Step 3: Git status check
echo ""
echo "📝 Checking git status..."
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ Working directory clean"
else
    echo "⚠️  Uncommitted changes detected. Commit before deploying:"
    git status
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 4: Deploy to Vercel
echo ""
echo "🚀 Deploying to Vercel..."
vercel deploy --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Configure Stripe webhook:"
echo "   URL: https://your-vercel-app.vercel.app/api/webhooks/stripe"
echo ""
echo "2. Configure Clerk webhook:"
echo "   URL: https://your-vercel-app.vercel.app/api/webhooks/clerk"
echo ""
echo "3. Update Stripe webhook signing secret in Vercel env vars"
echo "4. Update Clerk webhook signing secret in Vercel env vars"
