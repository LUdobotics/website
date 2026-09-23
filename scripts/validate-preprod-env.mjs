import { loadEnv } from 'vite';
import { readFile } from 'node:fs/promises';

const preprod = loadEnv('preprod', process.cwd(), 'VITE_');
const productionEnvFile = await readFile('.env.production', 'utf8');
const productionClerkKey = productionEnvFile.match(/^VITE_CLERK_PUBLISHABLE_KEY=(.+)$/m)?.[1]?.trim();

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

if (preprod.VITE_CLERK_PUBLISHABLE_KEY === productionClerkKey) {
  throw new Error('Preproduction must not use the production Clerk application.');
}

console.log('Preproduction website configuration is distinct from production.');
