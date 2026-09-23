import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
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

if (process.argv.includes('--preprod')) {
  const { VITE_SITE_URL } = loadEnv('preprod', process.cwd(), 'VITE_');
  const html = await readFile('dist/index.html', 'utf8');
  const preprodHtml = html
    .replace(/  <!-- Microsoft Clarity -->[\s\S]*?<\/script>\s*/, '')
    .replace('<meta name="robots" content="index, follow, max-image-preview:large" />', '<meta name="robots" content="noindex, nofollow" />')
    .replace('<div id="root"></div>', '<div style="position:relative;z-index:10000;padding:8px;text-align:center;background:#ffb347;color:#111;font:700 12px sans-serif;letter-spacing:.12em">PREPRODUCTION · TEST DATA</div>\n  <div id="root"></div>');
  await writeFile('dist/index.html', preprodHtml);
  await writeFile('dist/CNAME', `${new URL(VITE_SITE_URL).hostname}\n`);
  await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
  await rm('dist/sitemap.xml', { force: true });
  await rm('dist/llms.txt', { force: true });
}

await copyFile('dist/index.html', 'dist/404.html');

await Promise.all(routes.map(async route => {
  const directory = join('dist', route);
  await mkdir(directory, { recursive: true });
  await copyFile('dist/index.html', join(directory, 'index.html'));
}));

console.log(`Created static entry points for ${routes.length} application routes.`);
