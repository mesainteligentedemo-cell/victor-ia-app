#!/bin/bash

# ============================================================================
# VICTOR IA — PRODUCTION SETUP SCRIPT
# Instala todas las dependencias necesarias
# ============================================================================

echo "🚀 Victor IA — Production Setup"
echo "================================"
echo ""

# 1. CLERK
echo "📦 Installing Clerk..."
npm install @clerk/nextjs

# 2. SUPABASE
echo "📦 Installing Supabase..."
npm install @supabase/supabase-js

# 3. REPLICATE
echo "📦 Installing Replicate..."
npm install replicate

# 4. HUGGING FACE
echo "📦 Installing Hugging Face..."
npm install @huggingface/inference

# 5. VERCEL BLOB
echo "📦 Installing Vercel Blob..."
npm install @vercel/blob

echo ""
echo "✅ ALL DEPENDENCIES INSTALLED"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Copy .env.example to .env.local"
echo "2. Fill in your API keys (see PRODUCTION-SETUP.md)"
echo "3. Run: npm run dev"
echo ""
echo "🔗 Get API Keys:"
echo "   - Clerk:        https://clerk.com"
echo "   - Supabase:     https://supabase.com"
echo "   - Replicate:    https://replicate.com"
echo "   - Hugging Face: https://huggingface.co"
echo "   - Vercel Blob:  https://vercel.com/dashboard"
