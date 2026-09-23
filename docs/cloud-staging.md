# Odyssey Cloud Staging Website Configuration

The website keeps the existing Clerk login and account-management flow. Phase 1D staging only changes the build-time backend URL.

Set the staging build environment outside Git:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_or_staging_publishable_key
VITE_ODYSSEY_BACKEND_URL=https://cloud-staging.ludobotics.com
```

The backend must allow the deployed website origin in CORS and gateway origin checks. The browser must not construct raw Selkies URLs or store launch tickets in localStorage; it must use only backend-issued launch URLs.

## Manual Staging Build

```bash
npm install
VITE_ODYSSEY_BACKEND_URL=https://cloud-staging.ludobotics.com npm run build
```

Deploy the generated static site using the existing website hosting process. Do not hard-code staging or production hostnames into application source.

## Smoke Test

1. Open the staging website.
2. Sign in with the existing Clerk flow.
3. Use an account explicitly entitled for staging cloud access.
4. Open `/account/manage`.
5. Click the cloud Play control.
6. Confirm the UI moves through pending/provisioning/ready.
7. Confirm the browser opens `/cloud/session/{session_id}/` on the backend gateway hostname, not a Docker or Selkies port.
8. Terminate from the website or backend workflow and confirm gateway access is invalidated.
