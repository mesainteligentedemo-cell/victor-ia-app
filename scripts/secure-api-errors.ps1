<#
.SYNOPSIS
    Reemplaza patrones inseguros de manejo de errores en app/api/**/*.ts por un
    patron seguro que registra el error real con logger.error() y devuelve un
    mensaje generico al cliente (evita filtrar stack traces / detalles internos).

.DESCRIPTION
    Patrones que detecta y corrige (solo dentro de respuestas HTTP / catch):
      - { error: String(error) }                         -> mensaje generico
      - { error: String(error), code: 500 }              -> mensaje generico
      - { error: `...${error.message}` }                 -> mensaje generico
      - { error: error instanceof Error ? error.message  -> mensaje generico
      - message: error instanceof Error ? error.message  -> mensaje generico
      - console.error(error) / console.error('x', error) -> logger.error(...)

    Ademas:
      - Inserta logger.error('...', error as Error) dentro del catch antes de
        devolver la respuesta, si no existe ya un logger.error.
      - Asegura el import { logger } from '@/lib/logger' en cada archivo tocado.
      - NO toca comentarios ni strings que no sean de error.
      - Crea un backup .bak-AAAAMMDD-HHmmss de cada archivo modificado.
      - Reporta en consola exactamente que cambio en cada archivo.

.PARAMETER WhatIf
    Modo simulacion: muestra que cambiaria sin escribir nada ni crear backups.

.PARAMETER Root
    Carpeta raiz del proyecto. Por defecto el directorio actual.

.EXAMPLE
    # Simulacion (recomendado primero)
    .\scripts\secure-api-errors.ps1 -WhatIf

.EXAMPLE
    # Aplicar cambios
    .\scripts\secure-api-errors.ps1
#>

[CmdletBinding()]
param(
    [string]$Root = (Get-Location).Path,
    [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# Configuracion
# ---------------------------------------------------------------------------
$ApiDir         = Join-Path $Root 'app\api'
$LoggerImport   = "import { logger } from '@/lib/logger';"
$GenericMessage = "'An error occurred processing your request'"
$Stamp          = Get-Date -Format 'yyyyMMdd-HHmmss'

# Archivos que NO deben tocarse (plantillas / ejemplos / helpers de seguridad)
$Excluded = @(
    '_examples',
    'secure-example',
    'secure-endpoint-template'
)

if (-not (Test-Path $ApiDir)) {
    Write-Host "ERROR: No existe la carpeta $ApiDir" -ForegroundColor Red
    exit 1
}

$files = Get-ChildItem -Path $ApiDir -Recurse -Filter '*.ts' -File |
    Where-Object {
        $p = $_.FullName
        -not ($Excluded | Where-Object { $p -like "*$_*" })
    }

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " Secure API Errors  $(if ($WhatIf) { '(MODO SIMULACION -WhatIf)' } else { '(APLICANDO CAMBIOS)' })" -ForegroundColor Cyan
Write-Host " Raiz   : $Root"
Write-Host " API    : $ApiDir"
Write-Host " Archivos candidatos: $($files.Count)"
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# ---------------------------------------------------------------------------
# Reglas de reemplazo (regex). Cada regla opera linea-a-linea sobre el contenido
# del bloque de respuesta. Se evitan comentarios al excluir lineas que empiezan
# por // o * (ver filtro mas abajo en Convert-Line).
# ---------------------------------------------------------------------------

# Reemplazos de la propiedad "error:" dentro de objetos de respuesta JSON.
# Conservan el resto del objeto (p.ej. ", code: 500").
$ErrorPropRules = @(
    # { error: String(error) ...}
    @{
        Name    = 'String(error) en respuesta'
        Pattern = 'error:\s*String\(\s*error\s*\)'
        Replace = "error: $GenericMessage"
    },
    # { error: `...${error.message}...` }  (template string con error.message)
    @{
        Name    = 'template string con error.message'
        Pattern = 'error:\s*`[^`]*\$\{\s*error(?:\s+as\s+Error)?\.message\s*\}[^`]*`'
        Replace = "error: $GenericMessage"
    },
    # { error: error instanceof Error ? error.message : "..." }
    @{
        Name    = 'ternario error.message en propiedad error'
        Pattern = 'error:\s*error\s+instanceof\s+Error\s*\?\s*error\.message\s*:\s*["''][^"'']*["'']'
        Replace = "error: $GenericMessage"
    },
    # { error: error.message }
    @{
        Name    = 'error.message directo en propiedad error'
        Pattern = 'error:\s*error(?:\s+as\s+Error)?\.message'
        Replace = "error: $GenericMessage"
    }
)

# Reemplazos de la propiedad "message:" que filtra error.message al cliente.
$MessagePropRules = @(
    @{
        Name    = 'ternario error.message en propiedad message'
        Pattern = 'message:\s*error\s+instanceof\s+Error\s*\?\s*error\.message\s*:\s*["''][^"'']*["'']'
        Replace = "message: $GenericMessage"
    },
    @{
        Name    = 'error.message directo en propiedad message'
        Pattern = 'message:\s*error(?:\s+as\s+Error)?\.message'
        Replace = "message: $GenericMessage"
    }
)

# console.error(...) -> logger.error(...)
$ConsoleRules = @(
    # console.error('texto:', error)  -> logger.error('texto', error as Error)
    @{
        Name    = "console.error('msg', error)"
        Pattern = "console\.error\(\s*(['""])(.*?)\1\s*,\s*error\s*\)"
        Replace = "logger.error('`$2', error as Error)"
    },
    # console.error(error)  -> logger.error('API error', error as Error)
    @{
        Name    = 'console.error(error)'
        Pattern = "console\.error\(\s*error\s*\)"
        Replace = "logger.error('API error', error as Error)"
    }
)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Test-IsCommentLine {
    param([string]$Line)
    $t = $Line.TrimStart()
    return ($t.StartsWith('//') -or $t.StartsWith('*') -or $t.StartsWith('/*'))
}

# ---------------------------------------------------------------------------
# Procesamiento por archivo
# ---------------------------------------------------------------------------

$totalChanged = 0
$totalEdits   = 0
$report       = @()

foreach ($file in $files) {
    $original = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
    if ($null -eq $original) { continue }

    $lines    = $original -split "`r?`n", -1
    $changes  = New-Object System.Collections.Generic.List[string]
    $modified = $false

    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]

        # No tocar comentarios.
        if (Test-IsCommentLine $line) { continue }

        $newLine = $line

        foreach ($rule in ($ErrorPropRules + $MessagePropRules + $ConsoleRules)) {
            if ([regex]::IsMatch($newLine, $rule.Pattern)) {
                $candidate = [regex]::Replace($newLine, $rule.Pattern, $rule.Replace)
                if ($candidate -ne $newLine) {
                    $changes.Add(("  L{0,-4} [{1}]" -f ($i + 1), $rule.Name))
                    $newLine = $candidate
                }
            }
        }

        if ($newLine -ne $line) {
            $lines[$i] = $newLine
            $modified = $true
        }
    }

    # -------------------------------------------------------------------
    # Inyectar logger.error dentro de cada catch (error) { ... } que aun
    # no registre el error. Se inserta justo despues de la llave del catch.
    # -------------------------------------------------------------------
    $rebuilt = $lines -join "`n"

    $catchPattern = '(?ms)(\}?\s*catch\s*\(\s*error[^)]*\)\s*\{)(\r?\n)(?![^\}]*logger\.error)'
    $loggerInjections = 0
    $rebuilt = [regex]::Replace($rebuilt, $catchPattern, {
        param($m)
        $script:loggerInjections++
        # Detecta indentacion de la siguiente linea para alinear.
        $indentMatch = [regex]::Match($m.Value, '(?m)^[ \t]*(?=\}?\s*catch)')
        $indent = if ($indentMatch.Success) { $indentMatch.Value } else { '  ' }
        $inner  = $indent + '  '
        return $m.Groups[1].Value + $m.Groups[2].Value +
               $inner + "logger.error('API error', error as Error);" + $m.Groups[2].Value
    })

    if ($loggerInjections -gt 0) {
        $modified = $true
        $changes.Add(("  + logger.error inyectado en {0} bloque(s) catch" -f $loggerInjections))
    }

    # -------------------------------------------------------------------
    # Asegurar import del logger si el archivo ahora usa logger.* y no lo importa.
    # -------------------------------------------------------------------
    if ($modified -and ($rebuilt -match 'logger\.') -and ($rebuilt -notmatch "from\s+['""]@/lib/logger['""]")) {
        $importLines = [regex]::Matches($rebuilt, "(?m)^import\s.*$")
        if ($importLines.Count -gt 0) {
            $last = $importLines[$importLines.Count - 1]
            $insertAt = $last.Index + $last.Length
            $rebuilt = $rebuilt.Substring(0, $insertAt) + "`n" + $LoggerImport + $rebuilt.Substring($insertAt)
        } else {
            $rebuilt = $LoggerImport + "`n" + $rebuilt
        }
        $changes.Add("  + import logger agregado")
    }

    # -------------------------------------------------------------------
    # Persistir
    # -------------------------------------------------------------------
    if ($modified -and ($rebuilt -ne $original)) {
        $totalChanged++
        $totalEdits += $changes.Count
        $rel = $file.FullName.Substring($Root.Length).TrimStart('\','/')

        Write-Host "MODIFICADO: $rel" -ForegroundColor Yellow
        foreach ($c in $changes) { Write-Host $c -ForegroundColor DarkGray }

        if (-not $WhatIf) {
            $backup = "$($file.FullName).bak-$Stamp"
            Copy-Item -LiteralPath $file.FullName -Destination $backup -Force
            # Escribir UTF8 sin BOM para no romper Next.js.
            $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
            [System.IO.File]::WriteAllText($file.FullName, $rebuilt, $utf8NoBom)
            Write-Host "  backup: $(Split-Path $backup -Leaf)" -ForegroundColor DarkGreen
        }
        Write-Host ""

        $report += [pscustomobject]@{
            Archivo = $rel
            Cambios = $changes.Count
        }
    }
}

# ---------------------------------------------------------------------------
# Resumen
# ---------------------------------------------------------------------------
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " RESUMEN" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
if ($totalChanged -eq 0) {
    Write-Host " No se encontraron patrones inseguros. Nada que cambiar." -ForegroundColor Green
} else {
    $report | Sort-Object Cambios -Descending | Format-Table -AutoSize
    Write-Host (" Archivos modificados : {0}" -f $totalChanged) -ForegroundColor Green
    Write-Host (" Reemplazos totales   : {0}" -f $totalEdits)   -ForegroundColor Green
    if ($WhatIf) {
        Write-Host ""
        Write-Host " (Simulacion: no se escribio nada. Ejecuta sin -WhatIf para aplicar.)" -ForegroundColor Magenta
    } else {
        Write-Host ""
        Write-Host " Backups creados con sufijo .bak-$Stamp" -ForegroundColor Green
        Write-Host " Para revertir todo:" -ForegroundColor DarkGray
        Write-Host "   Get-ChildItem '$ApiDir' -Recurse -Filter '*.bak-$Stamp' | ForEach-Object {" -ForegroundColor DarkGray
        Write-Host "     `$o = `$_.FullName -replace '\.bak-$Stamp$',''; Move-Item `$_.FullName `$o -Force }" -ForegroundColor DarkGray
    }
}
Write-Host ""
