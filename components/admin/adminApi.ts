export const adminBackendUrl = String(
  import.meta.env.VITE_ODYSSEY_BACKEND_BASE_URL ?? import.meta.env.VITE_ODYSSEY_BACKEND_URL ?? '',
).replace(/\/$/, '');

export class AdminApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const adminRequest = async <T>(
  getToken: () => Promise<string | null>,
  path: string,
  init: RequestInit = {},
): Promise<T> => {
  const token = await getToken();
  if (!token) throw new AdminApiError(401, 'Your session has expired.');
  const response = await fetch(`${adminBackendUrl}/api/v1/admin${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new AdminApiError(response.status, body.detail || 'The operation could not be completed.');
  }
  return body as T;
};

export const pageFromUrl = (search: string) => {
  const params = new URLSearchParams(search);
  const parsed = Number(params.get('page') ?? '1');
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

export const filterFromUrl = (search: string) => new URLSearchParams(search).get('q') ?? '';
