import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadEnv } from 'vite';

const routes = [
  'account',
  'account/sign-in',
  'account/sign-up',
  'account/manage',
  'account/teacher/sign-up',
  'account/teacher/dashboard',
  'account/student/sign-in',
  'account/student/invitation',
  'account/student/onboarding',
  'organization',
  'organization/create',
  'organization/manage',
  'launcher_download_client',
  'launcher_download_student',
  'admin',
  'admin/users',
  'admin/organisations',
  'admin/licences',
  'admin/subscriptions',
  'admin/usage',
  'admin/cloud',
  'admin/audit',
];

await copyFile('dist/index.html', 'dist/404.html');

if (process.argv.includes('--preprod')) {
  const { VITE_SITE_URL } = loadEnv('preprod', process.cwd(), 'VITE_');
  await writeFile('dist/CNAME', `${new URL(VITE_SITE_URL).hostname}\n`);
}

await Promise.all(routes.map(async route => {
  const directory = join('dist', route);
  await mkdir(directory, { recursive: true });
  await copyFile('dist/index.html', join(directory, 'index.html'));
}));

console.log(`Created static entry points for ${routes.length} application routes.`);
