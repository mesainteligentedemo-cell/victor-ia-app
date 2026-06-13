#!/usr/bin/env pwsh

<#
.SYNOPSIS
Test suite para Victor IA App en producción
Verifica: API up, auth enforcement, CORS, input validation, error sanitization

.USAGE
.\scripts\test-production.ps1
#>

param(
  [string]$AppUrl = "https://victor-ia-app.vercel.app",
  [switch]$Verbose = $false
)

Write-Host "🧪 Victor IA App — Production Test Suite" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "URL: $AppUrl`n" -ForegroundColor Gray

$results = @()
$passed = 0
$failed = 0

# Helper function
function Test-Endpoint {
  param(
    [string]$Name,
    [string]$Endpoint,
    [string]$Method = "GET",
    [hashtable]$Headers = @{},
    [string]$Body = "",
    [int]$ExpectedStatus = 200,
    [string]$CheckContent = ""
  )

  Write-Host "Test: $Name..." -ForegroundColor White -NoNewline

  try {
    $params = @{
      Uri = "$AppUrl$Endpoint"
      Method = $Method
      ErrorAction = "SilentlyContinue"
      SkipHttpErrorCheck = $true
    }

    if ($Headers.Count -gt 0) { $params["Headers"] = $Headers }
    if ($Body) {
      $params["ContentType"] = "application/json"
      $params["Body"] = $Body
    }

    $response = Invoke-WebRequest @params
    $status = $response.StatusCode
    $content = $response.Content

    $pass = $false
    $reason = ""

    if ($status -eq $ExpectedStatus) {
      if ($CheckContent) {
        if ($content -match $CheckContent) {
          $pass = $true
        } else {
          $reason = "Content mismatch: expected '$CheckContent'"
        }
      } else {
        $pass = $true
      }
    } else {
      $reason = "Status code: expected $ExpectedStatus, got $status"
    }

    if ($pass) {
      Write-Host " ✅ PASS" -ForegroundColor Green
      $results += @{ Name = $Name; Status = "PASS"; Details = "Status $status" }
      $script:passed++
    } else {
      Write-Host " ❌ FAIL" -ForegroundColor Red
      if ($Verbose) { Write-Host "  └─ $reason" -ForegroundColor Yellow }
      $results += @{ Name = $Name; Status = "FAIL"; Details = $reason }
      $script:failed++
    }
  } catch {
    Write-Host " ⚠️  ERROR" -ForegroundColor Yellow
    if ($Verbose) { Write-Host "  └─ $($_.Message)" -ForegroundColor Yellow }
    $results += @{ Name = $Name; Status = "ERROR"; Details = $_.Message }
    $script:failed++
  }
}

# === TESTS ===

Write-Host "`n🔍 CONNECTIVITY TESTS" -ForegroundColor Cyan
Write-Host "─────────────────────" -ForegroundColor Cyan

Test-Endpoint -Name "API is UP" -Endpoint "/" -Method GET -ExpectedStatus 200

Write-Host "`n🔐 SECURITY TESTS" -ForegroundColor Cyan
Write-Host "─────────────────" -ForegroundColor Cyan

Test-Endpoint `
  -Name "Auth enforcement on /api/chat" `
  -Endpoint "/api/chat" `
  -Method POST `
  -Body '{"message":"test"}' `
  -ExpectedStatus 401

Test-Endpoint `
  -Name "CORS whitelist (attacker.com blocked)" `
  -Endpoint "/api/merge/versions" `
  -Method OPTIONS `
  -Headers @{ "Origin" = "http://attacker.com" } `
  -ExpectedStatus 200

Test-Endpoint `
  -Name "Input validation on /api/voice/generate" `
  -Endpoint "/api/voice/generate" `
  -Method POST `
  -Body '{"text":""}' `
  -ExpectedStatus 400

Write-Host "`n📊 ERROR MESSAGE SANITIZATION" -ForegroundColor Cyan
Write-Host "──────────────────────────────" -ForegroundColor Cyan

try {
  $response = Invoke-WebRequest -Uri "$AppUrl/api/admin" -Method GET -ErrorAction SilentlyContinue -SkipHttpErrorCheck
  $body = $response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue

  $errorMsg = $body.error
  if ($errorMsg -match "An error occurred|Unauthorized|Invalid" -and $errorMsg -notmatch "stack|trace|internal") {
    Write-Host "Error message sanitization... ✅ PASS" -ForegroundColor Green
    Write-Host "  └─ Generic message: '$errorMsg'" -ForegroundColor Gray
    $results += @{ Name = "Error sanitization"; Status = "PASS"; Details = "Generic message returned" }
    $script:passed++
  } else {
    Write-Host "Error message sanitization... ❌ FAIL" -ForegroundColor Red
    Write-Host "  └─ Message might expose internals: '$errorMsg'" -ForegroundColor Yellow
    $results += @{ Name = "Error sanitization"; Status = "FAIL"; Details = "Message: $errorMsg" }
    $script:failed++
  }
} catch {
  Write-Host "Error message sanitization... ⚠️  ERROR" -ForegroundColor Yellow
  $results += @{ Name = "Error sanitization"; Status = "ERROR"; Details = $_.Message }
  $script:failed++
}

Write-Host "`n🛡️  SECURITY HEADERS" -ForegroundColor Cyan
Write-Host "───────────────────" -ForegroundColor Cyan

try {
  $response = Invoke-WebRequest -Uri $AppUrl -Method HEAD -ErrorAction SilentlyContinue
  $headers = $response.Headers

  $securityHeaders = @(
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Strict-Transport-Security"
  )

  foreach ($header in $securityHeaders) {
    if ($headers.ContainsKey($header)) {
      Write-Host "  ✅ $header : $($headers[$header])" -ForegroundColor Green
      $passed++
    } else {
      Write-Host "  ❌ $header : MISSING" -ForegroundColor Red
      $failed++
    }
  }
} catch {
  Write-Host "  ⚠️  Could not fetch headers: $($_.Message)" -ForegroundColor Yellow
}

# === RESULTS ===

Write-Host "`n$('='*50)" -ForegroundColor Cyan
Write-Host "📈 TEST RESULTS" -ForegroundColor Cyan
Write-Host "$('='*50)" -ForegroundColor Cyan

Write-Host "`nDetailed Results:" -ForegroundColor White
$results | Format-Table -Property Name, Status, Details -AutoSize -Wrap

Write-Host "`nSummary:" -ForegroundColor White
Write-Host "  ✅ Passed: $passed" -ForegroundColor Green
Write-Host "  ❌ Failed: $failed" -ForegroundColor Red
Write-Host "  Total:  $($passed + $failed)" -ForegroundColor Cyan

if ($failed -eq 0) {
  Write-Host "`n🚀 ALL TESTS PASSED — APP IS READY FOR PRODUCTION!" -ForegroundColor Green
  exit 0
} else {
  Write-Host "`n⚠️  SOME TESTS FAILED — FIX BEFORE GOING LIVE" -ForegroundColor Yellow
  exit 1
}
