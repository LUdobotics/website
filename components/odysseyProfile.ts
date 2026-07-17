export const odysseyBackendUrl = String(import.meta.env.VITE_ODYSSEY_BACKEND_URL ?? '').replace(/\/$/, '');

export interface OdysseyProfileUser {
  username: string | null;
  fullName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
  imageUrl: string;
  hasImage?: boolean;
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
  JSON.stringify(getOdysseyProfile(user))
);

export async function syncOdysseyProfile({ getToken, user }: SyncOdysseyProfileOptions) {
  if (!odysseyBackendUrl) {
    throw new Error('The Odyssey backend is not configured.');
  }

  // The authenticated token identifies the profile owner by Clerk user ID.
  // Email is profile data only and is never used to select a backend user.
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
    body: JSON.stringify(getOdysseyProfile(user)),
  });

  if (!response.ok) {
    throw new Error(`Profile synchronization failed (${response.status}).`);
  }
}
