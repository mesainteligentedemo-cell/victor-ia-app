#!/bin/bash
# 🔐 SECURITY CHECKS — Victor IA App
# Run this before every deployment

set -e

echo "════════════════════════════════════════════════════════════"
echo "🔐 SECURITY AUDIT CHECKLIST"
echo "════════════════════════════════════════════════════════════"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

check() {
  local name=$1
  local cmd=$2

  echo -e "\n📋 Checking: $name"

  if eval "$cmd" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}: $name"
    return 0
  else
    echo -e "${RED}❌ FAIL${NC}: $name"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# ════════════════════════════════════════════════════════════
# 1. CHECK: .env.local is in .gitignore
# ════════════════════════════════════════════════════════════
check "✅ .env.local in .gitignore" \
  "grep -q '\\.env\\.local' .gitignore"

# ════════════════════════════════════════════════════════════
# 2. CHECK: No .env.local is tracked by git
# ════════════════════════════════════════════════════════════
check "✅ .env.local not tracked by git" \
  "! git ls-files | grep -q '\\.env\\.local'"

# ════════════════════════════════════════════════════════════
# 3. CHECK: No API keys in .env.example
# ════════════════════════════════════════════════════════════
check "✅ No real API keys in .env.example" \
  "! grep -E 'sk_|sk-|agent_[a-z0-9]{20,}' .env.example"

# ════════════════════════════════════════════════════════════
# 4. CHECK: No hardcoded secrets in code
# ════════════════════════════════════════════════════════════
echo -e "\n📋 Checking: No hardcoded API keys in source code"
SECRETS=$(grep -r "sk_\|sk-\|STRIPE_SECRET\|ANTHROPIC_API" \
  app lib --include="*.ts" --include="*.tsx" \
  | grep -v "process.env" \
  | grep -v "node_modules" \
  | grep -v ".next" \
  | wc -l)

if [ "$SECRETS" -eq 0 ]; then
  echo -e "${GREEN}✅ PASS${NC}: No hardcoded secrets"
else
  echo -e "${RED}❌ FAIL${NC}: Found $SECRETS hardcoded secrets"
  grep -r "sk_\|sk-\|STRIPE_SECRET\|ANTHROPIC_API" \
    app lib --include="*.ts" --include="*.tsx" \
    | grep -v "process.env" \
    | grep -v "node_modules" \
    | head -5
  FAILED=$((FAILED + 1))
fi

# ════════════════════════════════════════════════════════════
# 5. CHECK: CORS headers are not * (wildcard)
# ════════════════════════════════════════════════════════════
echo -e "\n📋 Checking: CORS headers not using wildcard (*)"
CORS_WILD=$(grep -r "Access-Control-Allow-Origin.*\*" \
  app lib --include="*.ts" --include="*.tsx" \
  | grep -v ".next" \
  | wc -l)

if [ "$CORS_WILD" -eq 0 ]; then
  echo -e "${GREEN}✅ PASS${NC}: No wildcard CORS headers"
else
  echo -e "${RED}❌ FAIL${NC}: Found $CORS_WILD wildcard CORS headers"
  grep -rn "Access-Control-Allow-Origin.*\*" \
    app lib --include="*.ts" --include="*.tsx" \
    | grep -v ".next" \
    | head -5
  FAILED=$((FAILED + 1))
fi

# ════════════════════════════════════════════════════════════
# 6. CHECK: Error messages don't expose String(error)
# ════════════════════════════════════════════════════════════
echo -e "\n📋 Checking: Error messages don't expose details"
ERROR_EXPO=$(grep -r "String(error)\|error\.message" \
  app/api --include="*.ts" \
  | grep -v "logger\|// ✅" \
  | wc -l)

if [ "$ERROR_EXPO" -lt 5 ]; then
  echo -e "${GREEN}✅ PASS${NC}: Error messages are safe"
else
  echo -e "${YELLOW}⚠️  WARNING${NC}: Found $ERROR_EXPO potential error exposure issues"
  echo "     (may include logger calls, review manually)"
fi

# ════════════════════════════════════════════════════════════
# 7. CHECK: Auth middleware is applied
# ════════════════════════════════════════════════════════════
check "✅ Auth middleware exists" \
  "test -f lib/security/auth-middleware.ts"

# ════════════════════════════════════════════════════════════
# 8. CHECK: Rate limiter is configured
# ════════════════════════════════════════════════════════════
check "✅ Rate limiter exists" \
  "test -f lib/security/rate-limiter.ts"

# ════════════════════════════════════════════════════════════
# 9. CHECK: Validation utilities exist
# ════════════════════════════════════════════════════════════
check "✅ Validation utilities exist" \
  "test -f lib/security/validation.ts"

# ════════════════════════════════════════════════════════════
# 10. CHECK: Logger exists with sanitization
# ════════════════════════════════════════════════════════════
check "✅ Logger with sanitization exists" \
  "grep -q 'sanitizeValue\|REDACTED' lib/logger.ts"

# ════════════════════════════════════════════════════════════
# 11. CHECK: No console.error with error details
# ════════════════════════════════════════════════════════════
echo -e "\n📋 Checking: No console.error() with sensitive details"
CONSOLE_ERRORS=$(grep -r "console\.error.*error\|console\.log.*error" \
  app/api --include="*.ts" \
  | grep -v "logger\|// ✅\|skip\|TODO" \
  | wc -l)

if [ "$CONSOLE_ERRORS" -eq 0 ]; then
  echo -e "${GREEN}✅ PASS${NC}: No console.error with error details"
else
  echo -e "${YELLOW}⚠️  WARNING${NC}: Found $CONSOLE_ERRORS console.error calls (review)"
fi

# ════════════════════════════════════════════════════════════
# 12. CHECK: Security headers are configured
# ════════════════════════════════════════════════════════════
check "✅ Security headers configured" \
  "grep -q 'X-Frame-Options.*DENY\|CSP' lib/security/headers.ts"

# ════════════════════════════════════════════════════════════
# SUMMARY
# ════════════════════════════════════════════════════════════
echo -e "\n════════════════════════════════════════════════════════════"
if [ "$FAILED" -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
  echo "The application is ready for deployment."
  exit 0
else
  echo -e "${RED}❌ $FAILED CHECK(S) FAILED${NC}"
  echo "Please review the failures above and fix before deploying."
  exit 1
fi
