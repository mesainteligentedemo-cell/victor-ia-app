#!/usr/bin/env node

/**
 * Validador de Variables de Entorno — Victor IA App
 *
 * Uso: npx ts-node scripts/validate-env.ts
 *
 * Verifica que todas las variables de entorno requeridas están configuradas
 * y tienen valores válidos (no placeholders XXX).
 */

interface EnvVar {
  name: string
  required: boolean
  type: 'public' | 'private' | 'generated'
  validation?: (value: string) => boolean | string
  description: string
}

const ENV_VARS: EnvVar[] = [
  // === IA APIs ===
  {
    name: 'OPENROUTER_API_KEY',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('sk-or-v1-') || 'Debe comenzar con sk-or-v1-',
    description: 'OpenRouter API Key para modelos IA múltiples'
  },
  {
    name: 'ANTHROPIC_API_KEY',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('sk-ant-') || 'Debe comenzar con sk-ant-',
    description: 'Anthropic Claude API Key'
  },

  // === Clerk Authentication ===
  {
    name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    required: true,
    type: 'public',
    validation: (v) => v.startsWith('pk_') || 'Debe comenzar con pk_',
    description: 'Clerk Publishable Key (pública, segura)'
  },
  {
    name: 'CLERK_SECRET_KEY',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('sk_') || 'Debe comenzar con sk_',
    description: 'Clerk Secret Key (privada, servidor)'
  },
  {
    name: 'CLERK_WEBHOOK_SECRET',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('whsec_') || 'Debe comenzar con whsec_',
    description: 'Clerk Webhook Secret (verifica webhooks)'
  },

  // === Stripe Payments ===
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    required: true,
    type: 'public',
    validation: (v) => v.startsWith('pk_') || 'Debe comenzar con pk_',
    description: 'Stripe Publishable Key (pública, navegador)'
  },
  {
    name: 'STRIPE_SECRET_KEY',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('sk_') || 'Debe comenzar con sk_',
    description: 'Stripe Secret Key (privada, servidor)'
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('whsec_') || 'Debe comenzar con whsec_',
    description: 'Stripe Webhook Secret (verifica webhooks)'
  },

  // === ElevenLabs Voice ===
  {
    name: 'NEXT_PUBLIC_ELEVENLABS_AGENT_ID',
    required: true,
    type: 'public',
    validation: (v) => v.startsWith('agent_') || 'Debe comenzar con agent_',
    description: 'ElevenLabs Agent ID (pública, cliente)'
  },
  {
    name: 'ELEVENLABS_API_KEY',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('sk_') || 'Debe comenzar con sk_',
    description: 'ElevenLabs API Key (privada, servidor)'
  },
  {
    name: 'ELEVENLABS_AGENT_ID',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('agent_') || 'Debe comenzar con agent_',
    description: 'ElevenLabs Agent ID (privada, backend)'
  },

  // === Supabase Database ===
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    type: 'public',
    validation: (v) => v.includes('supabase.co') || 'Debe incluir supabase.co',
    description: 'Supabase Project URL'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    type: 'public',
    validation: (v) => v.startsWith('eyJ') || 'Debe comenzar con eyJ (JWT base64)',
    description: 'Supabase Anon Key (semi-pública, con RLS)'
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('eyJ') || 'Debe comenzar con eyJ (JWT base64)',
    description: 'Supabase Service Role Key (privada, admin)'
  },
  {
    name: 'DATABASE_URL',
    required: true,
    type: 'private',
    validation: (v) => v.startsWith('postgresql://') || 'Debe comenzar con postgresql://',
    description: 'PostgreSQL Connection String'
  },

  // === Security: Generated Keys ===
  {
    name: 'JWT_SECRET',
    required: true,
    type: 'generated',
    validation: (v) => v.length >= 32 || 'Debe tener al menos 32 caracteres',
    description: 'JWT Secret (firma de tokens, generar con openssl)'
  },
  {
    name: 'ENCRYPTION_KEY',
    required: true,
    type: 'generated',
    validation: (v) => v.length >= 24 || 'Debe tener al menos 24 caracteres base64',
    description: 'Encryption Key (AES-256, generar con openssl)'
  },

  // === Optional: Analytics ===
  {
    name: 'GOOGLE_SPREADSHEET_ID',
    required: false,
    type: 'public',
    validation: (v) => /^[a-zA-Z0-9-_]{44}$/.test(v) || 'Formato de Sheet ID inválido',
    description: 'Google Sheets ID para analytics (opcional)'
  },

  // === Environment ===
  {
    name: 'NODE_ENV',
    required: true,
    type: 'public',
    validation: (v) => ['development', 'production', 'test'].includes(v) || 'Debe ser development, production, o test',
    description: 'Node environment'
  },
]

interface ValidationResult {
  ok: boolean
  variable: string
  message: string
  type: 'public' | 'private' | 'generated'
}

function validateEnv(): ValidationResult[] {
  const results: ValidationResult[] = []

  for (const envVar of ENV_VARS) {
    const value = process.env[envVar.name]

    // Check if required but missing
    if (envVar.required && !value) {
      results.push({
        ok: false,
        variable: envVar.name,
        type: envVar.type,
        message: `❌ FALTA (requerida): ${envVar.description}`
      })
      continue
    }

    // Check if placeholder value
    if (value && (value.includes('XXX') || value.includes('xxxxx'))) {
      results.push({
        ok: false,
        variable: envVar.name,
        type: envVar.type,
        message: `⚠️  PLACEHOLDER: contiene XXX/xxxxx — reemplaza con valor real`
      })
      continue
    }

    // Check if has validation function
    if (value && envVar.validation) {
      const validationResult = envVar.validation(value)
      if (validationResult !== true) {
        const errorMsg = typeof validationResult === 'string' ? validationResult : 'Valor inválido'
        results.push({
          ok: false,
          variable: envVar.name,
          type: envVar.type,
          message: `❌ INVÁLIDA: ${errorMsg}`
        })
        continue
      }
    }

    // All good
    if (value) {
      results.push({
        ok: true,
        variable: envVar.name,
        type: envVar.type,
        message: `✅ OK (${value.substring(0, 20)}${value.length > 20 ? '...' : ''})`
      })
    }
  }

  return results
}

function main() {
  console.log('\n' + '='.repeat(80))
  console.log('VALIDADOR DE VARIABLES DE ENTORNO — Victor IA App')
  console.log('='.repeat(80) + '\n')

  const results = validateEnv()

  // Separate by type
  const publicVars = results.filter(r => r.type === 'public')
  const privateVars = results.filter(r => r.type === 'private')
  const generatedVars = results.filter(r => r.type === 'generated')

  // Print by section
  const sections = [
    { label: 'PÚBLICAS (seguro exponerlas)', vars: publicVars },
    { label: 'PRIVADAS (🔒 CRÍTICAS)', vars: privateVars },
    { label: 'GENERADAS (openssl)', vars: generatedVars }
  ]

  for (const section of sections) {
    if (section.vars.length > 0) {
      console.log(`\n${section.label}:`)
      console.log('-'.repeat(80))
      for (const result of section.vars) {
        console.log(`${result.message}`)
        console.log(`  └─ ${result.variable}`)
      }
    }
  }

  // Summary
  const totalOk = results.filter(r => r.ok).length
  const totalFailed = results.filter(r => !r.ok).length
  const totalRequired = ENV_VARS.filter(v => v.required).length

  console.log('\n' + '='.repeat(80))
  console.log(`RESUMEN: ${totalOk}/${totalRequired} OK · ${totalFailed} error(es)`)
  console.log('='.repeat(80) + '\n')

  if (totalFailed === 0) {
    console.log('✅ TODAS LAS VARIABLES ESTÁN CONFIGURADAS CORRECTAMENTE\n')
    process.exit(0)
  } else {
    console.log(`❌ HAY ${totalFailed} VARIABLE(S) CON PROBLEMAS\n`)
    console.log('Acciones:')
    console.log('1. Abre .env.local')
    console.log('2. Reemplaza todos los valores placeholder (XXX, xxxxx)')
    console.log('3. Obtén keys de los dashboards:')
    console.log('   - Clerk: https://dashboard.clerk.com')
    console.log('   - Stripe: https://dashboard.stripe.com')
    console.log('   - Supabase: https://app.supabase.com')
    console.log('   - Anthropic: https://console.anthropic.com')
    console.log('   - ElevenLabs: https://elevenlabs.io')
    console.log('4. Corre este script de nuevo: npm run validate-env\n')
    process.exit(1)
  }
}

main()
