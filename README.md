<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and fill the required values.
3. Run the app:
   `npm run dev`

## Clerk Account Pages

Clerk is installed for account creation and account management, but the pages are intentionally hidden from the main navigation for now.

Direct URLs:

- `/account` - choose the teacher or student workflow
- `/account/teacher/sign-up` - teacher account creation
- `/organization/create` - organization creation after teacher sign-up
- `/account/student/invitation` - student invitation acceptance route
- `/account/student/sign-in` - student sign-in route
- `/account/sign-in` - sign in to an existing account
- `/account/manage` - manage the signed-in user's account and organization access
- `/organization/manage` - legacy compatibility URL that redirects to `/account/manage`

Teacher workflow:

1. Teacher visits `/account/teacher/sign-up`.
2. After account creation, the teacher is redirected to `/organization/create`.
3. After creating an organization, the teacher lands on `/account/manage`.
4. The teacher invites students from the organization members/invitations interface shown below the account manager.

Student workflow:

1. Student does not use open/public account creation.
2. Teacher sends an organization invitation from `/account/manage`.
3. Student accepts the invitation and signs up/signs in.
4. Clerk adds the student to the inviting organization as part of the invitation acceptance flow.

Required local environment variable:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

For production, set the same variable in the environment used to build the static site before running `npm run build` or `npm run deploy`.

### Clerk Dashboard Setup

1. Create or open your Clerk application in the [Clerk Dashboard](https://dashboard.clerk.com/).
2. Go to **API keys** and copy the **Publishable key** into `.env.local` as `VITE_CLERK_PUBLISHABLE_KEY`.
3. Go to **User & Authentication > Email, Phone, Username** and enable the identifiers you want users to sign up with. Email address is the simplest default.
4. Go to **User & Authentication > Email, Phone, Username > Email address** and enable the authentication method you want, such as email verification code, email link, or password.
5. If you use social login, enable the provider under **User & Authentication > Social Connections** and configure its OAuth credentials.
6. Enable **Organizations** in the Clerk Dashboard.
7. Configure organization roles. This site expects teachers to use `org:admin_teacher` and students to use `org:student`.
8. In **Configure > Domains**, make sure your production domain is configured for the production Clerk instance:
   `ludobotics.com`
9. In **Configure > Paths** or redirect URL settings, use these app paths:
   - Sign-in URL: `/account/sign-in`
   - Sign-up URL: `/account/teacher/sign-up`
   - After sign-in URL: `/account/manage`
   - After sign-up URL: `/organization/create`
   - After sign-out URL: `/account/sign-in`
   - Create organization URL: `/organization/create`
   - Organization profile URL: `/account/manage`

For student invitations, use Clerk's organization invitation flow from `/account/manage`. Clerk's organization invitations add accepted students to the organization automatically. If you later need a custom invitation email redirect URL, point it to:

`https://ludobotics.com/account/student/invitation`

Use a `pk_test_...` key for local development and a `pk_live_...` key for production.

## Deploy to GitHub Pages

This project deploys the built `dist/` folder to the `gh-pages` branch.

1. Install dependencies:
   `npm install`
2. Build and deploy:
   `npm run deploy`

The deploy command runs `npm run build`, then publishes `dist/` to the `gh-pages` branch with `gh-pages -d dist`.

In the GitHub repository settings, go to **Settings > Pages** and use:

- **Source:** Deploy from a branch
- **Branch:** `gh-pages`
- **Folder:** `/ (root)`

After deployment, wait a minute or two, then test:

`https://ludobotics.com/launcher_download_student`

## Hidden SPA Routes

The `/launcher_download_student`, `/account/*`, and `/organization/*` pages are React routes, not physical folders in the repository. GitHub Pages needs a `404.html` fallback so direct links can load the app and let React render the correct page.

The build script creates both:

- `dist/index.html`
- `dist/404.html`

If `/launcher_download_student` or `/account/sign-up` shows a GitHub-branded 404 after deployment, check that the `gh-pages` branch contains both `index.html` and `404.html` at the branch root.

If testing on a raw GitHub Pages URL such as `https://your-user.github.io/website/launcher_download_student`, remember that the path may include the repository name. The custom domain URL should be:

`https://ludobotics.com/launcher_download_student`
