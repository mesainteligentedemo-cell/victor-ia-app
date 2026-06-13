#!/bin/bash

################################################################################
# API Gateway — Curl Test Examples
# Copy and paste these commands to test the gateway
################################################################################

# Configuration (update with your values)
BASE_URL="http://localhost:3000"
CLERK_JWT="your_clerk_jwt_token_here"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  API GATEWAY TEST SUITE                                        ║"
echo "║  Victor IA App — Seguridad                                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📌 Configuration:"
echo "   Base URL: $BASE_URL"
echo "   JWT: ${CLERK_JWT:0:20}..."
echo ""
echo "⚠️  Note: Replace CLERK_JWT with your actual token from Clerk"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Test counter
TEST_NUM=0
PASS=0
FAIL=0

test_endpoint() {
    TEST_NUM=$((TEST_NUM + 1))
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"

    echo ""
    echo -e "${YELLOW}TEST $TEST_NUM: $name${NC}"
    echo "Request: $method $BASE_URL$endpoint"

    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $CLERK_JWT" \
            -H "Content-Type: application/json")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $CLERK_JWT" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    # Extract status code (last line) and body (rest)
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    echo "Response Status: $http_code"
    echo "Response Body:"
    echo "$body" | head -c 200
    if [ ${#body} -gt 200 ]; then echo "..."; fi
    echo ""

    if [ "$http_code" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Expected $expected_status)"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $http_code)"
        FAIL=$((FAIL + 1))
    fi
}

test_no_auth() {
    TEST_NUM=$((TEST_NUM + 1))

    echo ""
    echo -e "${YELLOW}TEST $TEST_NUM: Missing Authorization Header${NC}"
    echo "Request: GET $BASE_URL/api/proxy/stripe/customers"

    response=$(curl -s -w "\n%{http_code}" -X GET \
        "$BASE_URL/api/proxy/stripe/customers" \
        -H "Content-Type: application/json")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    echo "Response Status: $http_code"
    echo "Response Body:"
    echo "$body" | head -c 200
    echo ""

    if [ "$http_code" == "401" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Expected 401 Unauthorized)"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected 401, got $http_code)"
        FAIL=$((FAIL + 1))
    fi
}

################################################################################
# STRIPE TESTS
################################################################################

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "STRIPE API TESTS"
echo "═══════════════════════════════════════════════════════════════════"

test_endpoint \
    "Create Stripe Customer" \
    "POST" \
    "/api/proxy/stripe/customers" \
    '{"email":"test@example.com","name":"Test User"}' \
    "200"

test_endpoint \
    "List Stripe Customers" \
    "GET" \
    "/api/proxy/stripe/customers" \
    "" \
    "200"

test_endpoint \
    "Invalid Stripe Endpoint" \
    "GET" \
    "/api/proxy/stripe/invalid-endpoint" \
    "" \
    "400"

################################################################################
# SUPABASE TESTS
################################################################################

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "SUPABASE DATA API TESTS"
echo "═══════════════════════════════════════════════════════════════════"

test_endpoint \
    "List Users (Supabase)" \
    "GET" \
    "/api/proxy/data/users?select=id,email&limit=5" \
    "" \
    "200"

test_endpoint \
    "Query Users with Filter" \
    "GET" \
    "/api/proxy/data/users?select=id,email,name" \
    "" \
    "200"

################################################################################
# OPENAI TESTS
################################################################################

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "OPENAI API TESTS"
echo "═══════════════════════════════════════════════════════════════════"

test_endpoint \
    "List OpenAI Models" \
    "GET" \
    "/api/proxy/ai/models" \
    "" \
    "200"

test_endpoint \
    "Chat Completion Request" \
    "POST" \
    "/api/proxy/ai/chat/completions" \
    '{"model":"gpt-4","messages":[{"role":"user","content":"Hello"}],"max_tokens":10}' \
    "200"

################################################################################
# MAILGUN TESTS
################################################################################

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "MAILGUN EMAIL TESTS"
echo "═══════════════════════════════════════════════════════════════════"

test_endpoint \
    "Send Email (Mailgun)" \
    "POST" \
    "/api/proxy/mail/messages" \
    '{"from":"noreply@victor-ia.com","to":"test@example.com","subject":"Test","text":"Test email"}' \
    "200"

################################################################################
# AUTHENTICATION TESTS
################################################################################

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "AUTHENTICATION TESTS"
echo "═══════════════════════════════════════════════════════════════════"

test_no_auth

test_endpoint \
    "Invalid Token" \
    "GET" \
    "/api/proxy/stripe/customers" \
    "" \
    "401"

################################################################################
# ERROR HANDLING TESTS
################################################################################

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "ERROR HANDLING TESTS"
echo "═══════════════════════════════════════════════════════════════════"

test_endpoint \
    "Unknown Service (404)" \
    "GET" \
    "/api/proxy/unknown/endpoint" \
    "" \
    "404"

test_endpoint \
    "Invalid Request Path (400)" \
    "GET" \
    "/api/proxy/" \
    "" \
    "400"

################################################################################
# RATE LIMITING TEST (commented out - runs 101 times)
################################################################################

# Uncomment to test rate limiting
# echo ""
# echo "═══════════════════════════════════════════════════════════════════"
# echo "RATE LIMITING TEST (Warning: Makes 101 requests)"
# echo "═══════════════════════════════════════════════════════════════════"
#
# for i in {1..101}; do
#     echo -ne "\rRequest $i/101"
#     response=$(curl -s -w "\n%{http_code}" -X POST \
#         "$BASE_URL/api/proxy/stripe/customers" \
#         -H "Authorization: Bearer $CLERK_JWT" \
#         -H "Content-Type: application/json" \
#         -d '{"email":"test@example.com"}')
#
#     http_code=$(echo "$response" | tail -n1)
#
#     if [ "$http_code" == "429" ]; then
#         echo ""
#         echo "Rate limited after $i requests"
#         break
#     fi
# done

################################################################################
# RESULTS SUMMARY
################################################################################

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "TEST RESULTS SUMMARY"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}PASSED: $PASS${NC}"
echo -e "${RED}FAILED: $FAIL${NC}"
echo "TOTAL:  $TEST_NUM"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo "Check your Clerk JWT token and ensure the backend services are reachable"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo ""
