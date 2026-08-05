import React, { FormEvent, useEffect, useState } from 'react';
import { RedirectToSignIn, useAuth, useUser } from '@clerk/react';
import {
  Activity, Building2, Cloud, FileClock, Gauge, KeyRound, LogOut, RefreshCw,
  Search, ShieldAlert, Users,
} from 'lucide-react';
import { AdminApiError, adminBackendUrl, adminRequest, filterFromUrl, pageFromUrl } from './adminApi';

type AdminMe = { user_id: string; roles: string[]; permissions: string[] };
type PageResult = { items: Record<string, unknown>[]; total: number; offset: number; limit: number };
type Section = 'dashboard' | 'users' | 'organisations' | 'licences' | 'subscriptions' | 'usage' | 'cloud' | 'audit';

const sections: Array<{ id: Section; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'dashboard', label: 'Overview', icon: Gauge },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'organisations', label: 'Organisations', icon: Building2 },
  { id: 'licences', label: 'Licences', icon: KeyRound },
  { id: 'subscriptions', label: 'Subscriptions', icon: Activity },
  { id: 'usage', label: 'Product usage', icon: Activity },
  { id: 'cloud', label: 'Cloud operations', icon: Cloud },
  { id: 'audit', label: 'Audit log', icon: FileClock },
];

const getSection = (path: string): Section => {
  const segment = path.split('/')[2] as Section | undefined;
  return sections.some(item => item.id === segment) ? segment! : 'dashboard';
};

const formatValue = (value: unknown) => {
  if (value == null) return '—';
  if (typeof value === 'string' && /^\d{4}-\d\d-\d\dT/.test(value)) return new Date(value).toLocaleString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export const AdminPage: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken, signOut } = useAuth();
  const [me, setMe] = useState<AdminMe | null>(null);
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<AdminApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const section = getSection(window.location.pathname);
  const page = pageFromUrl(window.location.search);
  const initialFilter = filterFromUrl(window.location.search);
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !adminBackendUrl) return;
    let cancelled = false;
    setLoading(true); setError(null);
    const query = ['users', 'organisations'].includes(section)
      ? `?offset=${(page - 1) * 50}&limit=50${initialFilter ? `&search=${encodeURIComponent(initialFilter)}` : ''}`
      : section === 'dashboard' ? '' : section === 'usage' ? '?days=30' : '';
    Promise.all([
      adminRequest<AdminMe>(getToken, '/me'),
      adminRequest(getToken, `/${section}${query}`),
    ]).then(([identity, result]) => {
      if (!cancelled) { setMe(identity); setData(result); }
    }).catch(value => {
      if (!cancelled) setError(value instanceof AdminApiError ? value : new AdminApiError(500, 'Admin service unavailable.'));
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [getToken, initialFilter, isLoaded, isSignedIn, page, refresh, section]);

  if (!isLoaded) return <AdminState title="Loading session" />;
  if (!isSignedIn) return <RedirectToSignIn />;
  if (!adminBackendUrl) return <AdminState title="Admin service is not configured" detail="The backend URL is missing." />;
  if (error?.status === 401) return <AdminState title="Session expired" detail="Sign in again to continue." action={() => signOut()} actionLabel="Sign in" />;
  if (error?.status === 403) return <AdminState title="Access denied" detail="Your account has no active internal administrator assignment." denied />;

  const submitFilter = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (filter) params.set('q', filter);
    window.location.assign(`${window.location.pathname}${params.size ? `?${params}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#17202a] lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-[#d8dde3] bg-[#111820] text-white lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
          <ShieldAlert size={20} className="text-ludo-cyan" />
          <strong className="font-grotesk text-sm">Odyssey Operations</strong>
        </div>
        <nav aria-label="Administration" className="flex gap-1 overflow-x-auto p-3 lg:block">
          {sections.map(item => {
            const Icon = item.icon;
            return <a key={item.id} href={item.id === 'dashboard' ? '/admin' : `/admin/${item.id}`}
              aria-current={section === item.id ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 font-grotesk text-sm ${section === item.id ? 'bg-white/12 text-white' : 'text-white/65 hover:bg-white/7 hover:text-white'}`}>
              <Icon size={17} />{item.label}
            </a>;
          })}
        </nav>
      </aside>
      <main className="min-w-0">
        <header className="flex min-h-16 items-center justify-between border-b border-[#d8dde3] bg-white px-5 md:px-8">
          <div>
            <h1 className="font-grotesk text-lg font-semibold">{sections.find(item => item.id === section)?.label}</h1>
            <p className="font-mono text-[10px] text-[#66727f]">{me?.roles.join(', ') || 'Verifying access'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden font-grotesk text-xs text-[#66727f] sm:inline">{user?.fullName ?? 'Operator'}</span>
            <button title="Refresh" aria-label="Refresh data" onClick={() => setRefresh(value => value + 1)}
              className="grid h-9 w-9 place-items-center rounded-md border border-[#ccd3da] bg-white hover:bg-[#f4f6f8]">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button title="Sign out" aria-label="Sign out" onClick={() => signOut()}
              className="grid h-9 w-9 place-items-center rounded-md border border-[#ccd3da] bg-white hover:bg-[#f4f6f8]"><LogOut size={16} /></button>
          </div>
        </header>
        <div className="p-5 md:p-8">
          {['users', 'organisations'].includes(section) && (
            <form onSubmit={submitFilter} className="mb-5 flex max-w-lg gap-2">
              <label className="sr-only" htmlFor="admin-search">Search</label>
              <div className="relative flex-1"><Search size={16} className="absolute left-3 top-3 text-[#66727f]" />
                <input id="admin-search" value={filter} onChange={event => setFilter(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#b9c2cc] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#006f8b] focus:ring-2 focus:ring-[#006f8b]/20"
                  placeholder={`Search ${section}`} maxLength={100} />
              </div>
              <button className="rounded-md bg-[#006f8b] px-4 text-sm font-medium text-white disabled:opacity-50" disabled={loading}>Search</button>
            </form>
          )}
          {loading ? <AdminState title="Loading data" /> : error ? (
            <AdminState title="Request failed" detail={error.message} action={() => setRefresh(value => value + 1)} actionLabel="Retry" />
          ) : <AdminData section={section} data={data} />}
        </div>
      </main>
    </div>
  );
};

const AdminData: React.FC<{ section: Section; data: unknown }> = ({ section, data }) => {
  if (!data || typeof data !== 'object') return <AdminState title="No data available" />;
  const record = data as Record<string, unknown>;
  if (section === 'dashboard') {
    return <div className="space-y-7">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(record).filter(([key, value]) => key !== 'generated_at' && key !== 'definitions' && typeof value === 'object').map(([key, value]) =>
          <section key={key} className="rounded-md border border-[#d8dde3] bg-white p-5">
            <h2 className="mb-3 font-grotesk text-xs font-semibold uppercase text-[#66727f]">{key.replaceAll('_', ' ')}</h2>
            <dl className="space-y-2">{Object.entries(value as object).slice(0, 5).map(([label, metric]) =>
              <div key={label} className="flex justify-between gap-3 text-sm"><dt>{label.replaceAll('_', ' ')}</dt><dd className="font-mono font-semibold">{formatValue(metric)}</dd></div>)}</dl>
          </section>)}
      </div>
      <p className="text-xs text-[#66727f]">{Object.entries((record.definitions ?? {}) as object).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join(' · ')}</p>
    </div>;
  }
  const items = Array.isArray(record.items) ? record.items : [
    ...(Array.isArray(record.sessions) ? record.sessions : []),
    ...(Array.isArray(record.hosts) ? record.hosts : []),
    ...(Array.isArray(record.game_sessions) ? record.game_sessions : []),
    ...(Array.isArray(record.progression_snapshots) ? record.progression_snapshots : []),
  ];
  if (!items.length) return <AdminState title="No records found" detail="Try a different filter or time window." />;
  const columns = Object.keys(items[0] as object).slice(0, 8);
  return <div className="overflow-x-auto rounded-md border border-[#d8dde3] bg-white">
    <table className="w-full border-collapse text-left text-sm">
      <thead className="bg-[#edf1f4] text-xs uppercase text-[#53606d]"><tr>{columns.map(column => <th key={column} className="px-4 py-3 font-semibold">{column.replaceAll('_', ' ')}</th>)}</tr></thead>
      <tbody>{items.map((item, index) => <tr key={String((item as any).id ?? index)} className="border-t border-[#e4e8ec]">{columns.map(column =>
        <td key={column} className="max-w-xs truncate px-4 py-3">{formatValue((item as Record<string, unknown>)[column])}</td>)}</tr>)}</tbody>
    </table>
  </div>;
};

const AdminState: React.FC<{ title: string; detail?: string; denied?: boolean; action?: () => void; actionLabel?: string }> =
({ title, detail, denied, action, actionLabel }) => <div className="grid min-h-[50vh] place-items-center p-8">
  <div role={denied ? 'alert' : 'status'} className="max-w-md text-center">
    <ShieldAlert size={32} className="mx-auto mb-4 text-[#7a2e2e]" />
    <h1 className="font-grotesk text-xl font-semibold">{title}</h1>
    {detail && <p className="mt-2 text-sm text-[#66727f]">{detail}</p>}
    {action && <button onClick={action} className="mt-5 rounded-md bg-[#006f8b] px-4 py-2 text-sm text-white">{actionLabel}</button>}
  </div>
</div>;
