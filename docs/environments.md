# Website environments

## Current setup

| | Production | Preproduction |
| --- | --- | --- |
| Website | `https://ludobotics.com` via this repository's `gh-pages` branch | Not deployed yet |
| API | `https://api.ludobotics.com` | Staging backend service exists, but has no verified public HTTPS endpoint |
| Clerk | Production application | Separate application still needed |

GitHub Pages publishes only the configured source for this repository. The existing `npm run deploy` command updates the live `gh-pages` branch. Do not use it for preproduction.

## Target setup

Use one source branch (`main`) and two independently built static sites:

| | Preproduction | Production |
| --- | --- | --- |
| Website | `https://preprod.ludobotics.com` | `https://ludobotics.com` |
| Hosting | Separate GitHub Pages repository, e.g. `Ludobotics-web/website-preprod` | Existing GitHub Pages repository and `gh-pages` branch |
| API | `https://api-preprod.ludobotics.com` | `https://api.ludobotics.com` |
| Clerk | Separate Clerk application and users | Existing production application and users |
| Data | Separate staging database and test accounts | Production database and real accounts |

Build the same Git commit twice, using environment-specific public Clerk keys and API URLs. Keep a record of the commit SHA tested in preproduction and publish that SHA to production after approval. Do not copy production user data into preproduction. The frontend's `VITE_*` values are public browser configuration; backend and Clerk secret keys belong only in their respective services.

## Setup steps

1. Give the running staging API an HTTPS hostname, such as `api-preprod.ludobotics.com`. Verify its certificate and `/health` endpoint. Confirm its database, Clerk issuer, cloud worker, and storage are isolated from production.
2. Create a separate Clerk application for preproduction. Configure `preprod.ludobotics.com`, teacher/student organisation roles, and the invitation redirect `https://preprod.ludobotics.com/account/student/invitation`. Use its publishable key in the preproduction build and configure the staging API to verify tokens from that Clerk application.
3. Create a second public GitHub repository for the generated preproduction site. Enable GitHub Pages there and assign `preprod.ludobotics.com` as its custom domain. Add the DNS record and verify HTTPS. Keep this repository's `public/CNAME` pointed at production; the preproduction build's `CNAME` must point at the preproduction hostname instead.
4. Add `https://preprod.ludobotics.com` to the staging API's exact CORS and gateway origin allowlists. Keep production allowlists scoped to `https://ludobotics.com`.
5. Copy `.env.preprod.example` to `.env.preprod.local`, set the separate Clerk publishable key, then run `npm run build:preprod` and publish `dist/` to the second repository. The build checks the website/API hosts and rejects the production Clerk key; it also writes the preproduction `CNAME` into `dist/`. For production, run `npm run deploy` from the tested commit. Automate these two commands after both destinations are working, with a manual approval gate before production.

Do not point preproduction at the production API or Clerk application: a visual preview should never mutate real licences, invitations, cloud sessions, or accounts.

## Release flow

1. Develop in a short-lived branch and merge reviewed changes into `main`.
2. Build and publish `main` to preproduction; test sign-in, invitations, licences, cloud play, and teacher telemetry there.
3. Record the tested commit SHA. Rebuild that commit with production configuration and publish it to `gh-pages` only after the staging checks pass.
4. Verify the public site and account routes. Keep `gh-pages` as a generated deployment branch; do not merge its built files into `main`.

See [GitHub Pages publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), and [Clerk environments](https://clerk.com/docs/guides/development/managing-environments).
