# Verificar que todas las dependencias necesarias existen

$dependencies = @(
    "next",
    "react",
    "react-dom",
    "typescript",
    "@clerk/nextjs",
    "@supabase/supabase-js",
    "stripe",
    "@stripe/react-stripe-js",
    "@stripe/stripe-js",
    "tailwindcss",
    "lucide-react",
    "zustand"
)

Write-Host "📦 Verificando dependencias..." -ForegroundColor Cyan

$missing = @()
$installed = @()

foreach ($dep in $dependencies) {
    if (Test-Path "C:\Users\inbou\victor-ia-app\node_modules\$dep") {
        $installed += $dep
        Write-Host "✅ $dep" -ForegroundColor Green
    } else {
        $missing += $dep
        Write-Host "❌ $dep" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📊 Resumen:"
Write-Host "   Instaladas: $($installed.Count)/$($dependencies.Count)"
Write-Host "   Faltantes: $($missing.Count)"

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Faltantes:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "   - $_" }
    Write-Host ""
    Write-Host "Para instalar:" -ForegroundColor Yellow
    Write-Host "npm install" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✅ Todas las dependencias están instaladas" -ForegroundColor Green
}
