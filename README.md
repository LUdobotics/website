# Ludobotics website

The public Ludobotics site and Odyssey account portal. Built with React, Vite, and Clerk. The portal calls the Odyssey API for licence access, cloud sessions, and teacher dashboards.

## Local development

Requires Node.js and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_ODYSSEY_BACKEND_URL` in `.env.local`. Use a Clerk development instance and a nonproduction API. Open the local URL printed by Vite.

`npm run build` creates the static site in `dist/`; `npm test` runs the component tests. Values prefixed with `VITE_` are embedded in browser code, so never put private keys in them.

## Main routes

| Path | Purpose |
| --- | --- |
| `/` | Public site |
| `/account/teacher/sign-up` | Teacher registration |
| `/account/student/invitation` | Student invitation acceptance |
| `/account/manage` | Account, organisation, and cloud play |
| `/account/teacher/dashboard` | Teacher dashboard |
| `/launcher_download_client` | Launcher download |

Students join through a teacher's Clerk organisation invitation. See [account lifecycle](docs/account-lifecycle.md) for the invitation and authorization flow.

## Environments and releases

`main` is the source of truth. Production is currently built locally and published from the generated `gh-pages` branch to [ludobotics.com](https://ludobotics.com):

```bash
npm ci
npm run deploy
```

The build creates `index.html`, `404.html`, and static entry points for account routes so direct links work on GitHub Pages. Check [GitHub Pages settings](https://github.com/Ludobotics-web/website/settings/pages) if those routes return 404.

Preproduction needs its own URL, Clerk application, and Odyssey API. The proposed branch, build, hosting, and promotion process is in [environment setup](docs/environments.md). It is not live yet; publishing `gh-pages` always updates production.

## Related configuration

- Production Clerk invitation redirect: `https://ludobotics.com/account/student/invitation`.
- Clerk organisation roles: `org:admin_teacher` for teachers and `org:student` for invited students.
- The API must allow the website origin in CORS and validate Clerk tokens server-side.
- `VITE_ODYSSEY_BACKEND_URL` points to the matching environment's Odyssey API.
