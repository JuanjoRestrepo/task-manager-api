#!/bin/bash

# API Verification Script for task-manager-api
# Checks: Health Check Bypass, Global Rate Limit, and Auth Rate Limit

BASE_URL=${1:-"http://localhost:3000"}
echo "🚀 Starting verification against $BASE_URL..."

# 1. Health Check Bypass Test
echo -n "🔍 Testing Health Check Bypass (110 requests)... "
SUCCESS_COUNT=0
for i in {1..110}; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
  if [ "$CODE" == "200" ]; then
    ((SUCCESS_COUNT++))
  fi
done

if [ "$SUCCESS_COUNT" == "110" ]; then
  echo "✅ PASSED ($SUCCESS_COUNT/110)"
else
  echo "❌ FAILED (Only $SUCCESS_COUNT/110 returned 200)"
fi

# 2. Global Rate Limit Test
echo -n "🔍 Testing Global Rate Limit (100+ requests)... "
LIMIT_TRIGGERED=false
for i in {1..110}; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/auth/register")
  if [ "$CODE" == "429" ]; then
    LIMIT_TRIGGERED=true
    break
  fi
done

if [ "$LIMIT_TRIGGERED" == "true" ]; then
  echo "✅ PASSED (Rate limit triggered as expected)"
else
  echo "❌ FAILED (Rate limit not triggered after 100 requests)"
fi

# 3. Auth Specific Rate Limit Test
echo -n "🔍 Testing Auth-Specific Rate Limit (5+ requests)... "
AUTH_LIMIT_TRIGGERED=false
for i in {1..10}; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/auth/login")
  if [ "$CODE" == "429" ]; then
    AUTH_LIMIT_TRIGGERED=true
    break
  fi
done

if [ "$AUTH_LIMIT_TRIGGERED" == "true" ]; then
  echo "✅ PASSED (Auth limit triggered after 5 requests)"
else
  echo "❌ FAILED (Auth limit not triggered after 5 requests)"
fi

echo "🏁 Verification complete."
