# Account lifecycle and invitation contract

The website owns the browser-side account experience. Clerk owns authentication
and organization membership. The Odyssey API owns application authorization and
the user profile consumed by the launcher.

## Student invitation flow

1. A teacher sends a Clerk organization invitation with the fixed student role.
2. Clerk redirects to `/account/student/invitation` with `__clerk_ticket` and
   `__clerk_status`.
3. The website renders the matching Clerk task:
   - `sign_up`: create a new Clerk user and accept the membership.
   - `sign_in`: authenticate the existing Clerk user and accept the membership.
   - `complete`: continue with the signed-in user.
4. `/account/student/onboarding` checks for a student membership and activates
   the relevant organization.
5. If the user has no password (for example, an existing passwordless or social
   account), the user creates one. Passwords are never generated, emailed, logged,
   or stored by the website.
6. The site synchronizes `/me/profile` using the current Clerk token.
7. Only after these checks pass does the site expose the launcher download.

Direct access to the invitation path without a Clerk ticket does not create a
student account.

## Required Clerk configuration

- Keep organization invitations enabled.
- Configure the organization invitation redirect URL as:
  `https://ludobotics.com/account/student/invitation`
- Keep the student invitation role fixed to `org:student`.
- Enable password authentication if the launcher requires email/password login.
- Use restricted sign-up mode if teachers and invited students are the only
  permitted account sources.
- Ensure these role keys match the Clerk instance:
  - teacher: `org:admin_teacher`, `org:admin`, or `org:teacher`
  - student: `org:student`

## Required backend work

This static repository cannot safely create invitations or enforce application
authorization by itself. The Odyssey backend should provide:

### Teacher-controlled invitation endpoint

`POST /organisations/current/student-invitations`

- Authenticate the Clerk session.
- Require an active organization and a teacher/admin role.
- Accept an email address, but never accept a role from the browser.
- Create the Clerk organization invitation with `org:student`.
- Set the invitation redirect URL server-side.
- Return a stable invitation identifier and safe status.
- Rate-limit requests and make retries idempotent.

### Clerk webhook synchronization

Handle and verify Clerk webhook signatures for:

- `user.created`, `user.updated`, and `user.deleted`
- organization membership created, updated, and deleted

Webhook processing must be idempotent and keyed by Clerk object/event IDs. It
should create or update the Odyssey user and membership before the launcher needs
them. The browser-side `/me/profile` call remains a recovery path, not the sole
provisioning mechanism.

### Readiness endpoint

Add `GET /me/readiness` (or equivalent) returning:

```json
{
  "user_ready": true,
  "organization_ready": true,
  "role": "student",
  "active_organization_id": "org_...",
  "launcher_access": true
}
```

The backend must derive these values from the verified Clerk token and synced
records. The frontend should eventually use this endpoint instead of treating a
successful profile update as complete readiness.

## Security invariants

- Never send, persist, or log a plaintext password outside Clerk.
- Never trust a role or organization ID submitted by the browser.
- Authorize every Odyssey API request from verified Clerk claims and server-side
  membership data.
- A signed-in user is not automatically a student; student membership is required.
- Organization creation is restricted to first-time teacher onboarding or an
  existing teacher membership.
- The launcher download route requires a recognized organization membership.

## Manual release checks

Run the test protocol in the release handoff after configuring a Clerk development
instance and an Odyssey staging backend. Use unique email aliases for each case so
invitation states do not leak between scenarios.
