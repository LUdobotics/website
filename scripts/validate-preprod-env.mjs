import { loadEnv } from 'vite';

const preprod = loadEnv('preprod', process.cwd(), 'VITE_');
const production = loadEnv('production', process.cwd(), 'VITE_');

const expected = {
  VITE_SITE_URL: 'https://preprod.ludobotics.com',
  VITE_ODYSSEY_BACKEND_URL: 'https://api-preprod.ludobotics.com',
};

for (const [name, value] of Object.entries(expected)) {
  if (preprod[name]?.replace(/\/$/, '') !== value) {
    throw new Error(`${name} must be ${value} for a preproduction build.`);
  }
}

if (!preprod.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_')) {
  throw new Error('Set a publishable key from the separate preproduction Clerk application.');
}

if (preprod.VITE_CLERK_PUBLISHABLE_KEY === production.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Preproduction must not use the production Clerk application.');
}

console.log('Preproduction website configuration is distinct from production.');
