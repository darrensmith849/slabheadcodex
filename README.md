# Slabhead Collectables (Next.js)

Premium neon-styled ecommerce rebuild for Slabhead, built with Next.js App Router and TypeScript.

## Development

```bash
npm install
npm run dev
```

## Quality Gates

```bash
npm run check
```

This runs hotlink checks, link checks, lint, typecheck, and production build.

## PayFast Checkout Setup

The site uses hosted PayFast redirect checkout (no card data handled by this app).

### Required environment variables

```bash
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true
NEXT_PUBLIC_SITE_URL=https://your-domain.co.za
```

### PayFast process endpoints

- Live: `https://www.payfast.co.za/eng/process`
- Sandbox: `https://sandbox.payfast.co.za/eng/process`

### ITN callback

Set PayFast Notify URL (ITN) to:

`https://your-domain.co.za/api/payfast/itn`

Notes:
- ITN must be publicly reachable.
- Local development needs a tunnel (for example: ngrok) if you want live ITN callbacks to hit your machine.

## Order Storage

- If `DATABASE_URL` is set, orders use `PostgresOrderStore`.
- Without `DATABASE_URL`, app falls back to `InMemoryOrderStore` with a runtime warning.
- In-memory mode is for development only and does not persist across restarts.
