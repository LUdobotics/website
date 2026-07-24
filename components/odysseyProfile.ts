export const odysseyBackendUrl = String(import.meta.env.VITE_ODYSSEY_BACKEND_URL ?? '').replace(/\/$/, '');

export interface OdysseyProfileUser {
  id: string;
  username: string | null;
  fullName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
  imageUrl: string;
  hasImage?: boolean;
  reload: () => Promise<OdysseyProfileUser>;
}

interface SyncOdysseyProfileOptions {
  getToken: () => Promise<string | null>;
  user: OdysseyProfileUser;
}

export const getOdysseyProfile = (user: OdysseyProfileUser) => ({
  display_name:
    user.username
    ?? user.fullName
    ?? user.primaryEmailAddress?.emailAddress
    ?? null,
  // Clerk keeps a generated fallback imageUrl after a custom picture is
  // removed. hasImage distinguishes that fallback from an uploaded picture.
  profile_image_url: user.hasImage === false ? null : user.imageUrl || null,
});

export const getOdysseyProfileSignature = (user: OdysseyProfileUser) => (
  `${user.id}:${JSON.stringify(getOdysseyProfile(user))}`
);

const imageReadyDelayMs = 1_000;
const imageReadyAttempts = 5;

const wait = (delayMs: number) => new Promise<void>(resolve => {
  window.setTimeout(resolve, delayMs);
});

const getValidatedImageUrl = (imageUrl: string) => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    throw new Error('Clerk returned an invalid profile image URL.');
  }

  // Object URLs, data URLs, local previews, and upload-only schemes must never
  // be persisted. A reloaded Clerk resource should expose a public HTTPS URL.
  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Clerk profile image is not a final HTTPS URL.');
  }

  return parsedUrl;
};

export async function waitForProfileImage(
  imageUrl: string,
  attempts = imageReadyAttempts,
  delayMs = imageReadyDelayMs,
) {
  const validatedUrl = getValidatedImageUrl(imageUrl);

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Image is not ready.'));

        // Each attempt bypasses a cached 404/415 while retaining Clerk's URL.
        const preloadUrl = new URL(validatedUrl);
        preloadUrl.searchParams.set('profile_sync', `${Date.now()}_${attempt}`);
        image.src = preloadUrl.toString();
      });

      return;
    } catch {
      if (attempt === attempts - 1) {
        throw new Error('Clerk profile image did not become available.');
      }

      await wait(delayMs);
    }
  }
}

export async function syncOdysseyProfile({ getToken, user }: SyncOdysseyProfileOptions) {
  if (!odysseyBackendUrl) {
    throw new Error('The Odyssey backend is not configured.');
  }

  const profile = getOdysseyProfile(user);

  if (profile.profile_image_url) {
    await waitForProfileImage(profile.profile_image_url);
  }

  // Obtain the token only after the reloaded profile and image are ready. The
  // backend identifies the owner by Clerk user ID, never by email.
  const token = await getToken();

  if (!token) {
    throw new Error('Missing Clerk session token. Please sign in again.');
  }

  const response = await fetch(`${odysseyBackendUrl}/me/profile`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error(`Profile synchronization failed (${response.status}).`);
  }
}
