# Environment Variables Setup

## Local Development

Copy `.env.example` to `.env.local` and fill in the values:

```bash
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_AGENT_ID=agent_5701kr0h5gg6eetb69tv6c5hwfj1
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_5701kr0h5gg6eetb69tv6c5hwfj1
```

Both `ELEVENLABS_AGENT_ID` and `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` should have the same value.

## Vercel Deployment

To deploy with environment variables to Vercel:

### Option 1: Via Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `victor-ia-app`
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Scope |
|---|---|---|
| `ELEVENLABS_AGENT_ID` | `agent_5701kr0h5gg6eetb69tv6c5hwfj1` | Production, Preview, Development |
| `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` | `agent_5701kr0h5gg6eetb69tv6c5hwfj1` | Production, Preview, Development |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Production, Preview, Development |

5. Click **Save**
6. Redeploy by pushing a new commit or manually trigger a rebuild

### Option 2: Via Vercel CLI

```bash
vercel env add ELEVENLABS_AGENT_ID
# Enter: agent_5701kr0h5gg6eetb69tv6c5hwfj1
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_ELEVENLABS_AGENT_ID
# Enter: agent_5701kr0h5gg6eetb69tv6c5hwfj1
# Select: Production, Preview, Development
```

## Why Both Variables?

- `ELEVENLABS_AGENT_ID`: Server-side access (optional, for API routes)
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`: Client-side access (required for browser)

## Security Notes

- ✅ `.env.local` is in `.gitignore` — secrets won't be committed
- ✅ Use Vercel dashboard for production secrets
- ✅ Never commit `.env.local` to git
- ✅ Client-side variables (NEXT_PUBLIC_*) are visible in browser — this is expected for API keys that aren't secrets
