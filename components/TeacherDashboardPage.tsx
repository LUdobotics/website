import React, { useCallback, useEffect, useState } from 'react';
import { RedirectToSignIn, useAuth, useOrganization } from '@clerk/react';
import { AlertTriangle, Building2, RefreshCw, ServerOff } from 'lucide-react';
import { TeacherDashboardView } from './teacher-dashboard/TeacherDashboardView';
import { FullScenarioMap } from './teacher-dashboard/FullScenarioMap';
import {
  DashboardStudent,
  normalizeTelemetry,
  OdysseyTeacherDashboardResponse,
} from './teacher-dashboard/dashboardData';
import { odysseyBackendUrl } from './odysseyProfile';

const backendUrl = odysseyBackendUrl;

const isTeacherRole = (role?: string | null) => (
  role === 'org:admin_teacher' || role === 'admin_teacher' || role === 'org:admin' || role === 'org:teacher'
);

export const TeacherDashboardPage: React.FC = () => {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn, orgId } = useAuth();
  const { isLoaded: isOrganizationLoaded, organization, membership } = useOrganization();
  const [students, setStudents] = useState<DashboardStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const teacher = isTeacherRole(membership?.role);

  const loadDashboard = useCallback(async (quiet = false) => {
    if (!backendUrl || !isSignedIn || !orgId || !teacher) return;
    if (!quiet) setIsLoading(true);
    setError('');

    try {
      const token = await getToken();
      if (!token) throw new Error('Your session token is unavailable. Please sign in again.');

      const response = await fetch(`${backendUrl}/organisations/current/teacher-dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Dashboard request failed (${response.status})`);
      }

      const data = await response.json() as OdysseyTeacherDashboardResponse;
      setStudents(data.students.map(normalizeTelemetry));
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Student telemetry is unavailable.');
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isSignedIn, orgId, teacher]);

  useEffect(() => {
    if (!isAuthLoaded || !isOrganizationLoaded || !isSignedIn || !orgId || !teacher || !backendUrl) {
      setIsLoading(false);
      return;
    }

    void loadDashboard();
    const interval = window.setInterval(() => void loadDashboard(true), 15_000);
    return () => window.clearInterval(interval);
  }, [isAuthLoaded, isOrganizationLoaded, isSignedIn, orgId, teacher, loadDashboard]);

  if (!isAuthLoaded || !isOrganizationLoaded) {
    return <DashboardMessage title="Opening your classroom" description="Checking your account and active organization…" loading />;
  }

  if (!isSignedIn) return <RedirectToSignIn />;

  if (!organization || !orgId) {
    return (
      <DashboardMessage
        icon={Building2}
        title="Select a classroom organization"
        description="The dashboard groups telemetry by your active Clerk organization. Select or create one from account management first."
        actionHref="/account/manage"
        actionLabel="Open account management"
      />
    );
  }

  if (!teacher) {
    return (
      <DashboardMessage
        icon={AlertTriangle}
        title="Teacher access required"
        description="This page contains classroom telemetry and is available only to organization teachers."
        actionHref="/account/manage"
        actionLabel="Return to account"
      />
    );
  }

  if (!backendUrl) {
    return (
      <DashboardMessage
        icon={ServerOff}
        title="Odyssey backend is not configured"
        description="Set VITE_ODYSSEY_BACKEND_URL in the website deployment environment to connect this page to the existing teacher-dashboard endpoint."
        actionHref="/account/manage"
        actionLabel="Return to account"
      />
    );
  }

  if (isLoading) {
    return <DashboardMessage title="Loading live telemetry" description={`Connecting to ${organization.name}…`} loading />;
  }

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => void loadDashboard()}
          className="ml-auto inline-flex items-center justify-center gap-2 rounded-lg border border-ludo-cyan/30 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ludo-cyan transition-colors hover:bg-ludo-cyan/10"
        >
          <RefreshCw size={14} /> Refresh telemetry
        </button>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-ludo-orange/30 bg-ludo-orange/10 p-4 font-grotesk text-sm text-white/75">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-ludo-orange" />
          <div><strong className="text-white">Live data could not be refreshed.</strong><p className="mt-1 text-xs text-white/55">{error}</p></div>
        </div>
      )}

      <FullScenarioMap students={students} />

      <TeacherDashboardView
        students={students}
        organizationName={organization.name}
        lastUpdatedLabel={lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Waiting for first snapshot'}
        hideMissionProgress
      />

      {!error && students.length === 0 && (
        <p className="text-center font-grotesk text-sm text-white/45">
          No licensed student telemetry is available yet. Students appear after The Odyssey uploads their first snapshot.
        </p>
      )}
    </div>
  );
};

const DashboardMessage: React.FC<{
  title: string;
  description: string;
  loading?: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  actionHref?: string;
  actionLabel?: string;
}> = ({ title, description, loading = false, icon: Icon, actionHref, actionLabel }) => (
  <div className="mx-auto w-full max-w-xl rounded-2xl border border-ludo-cyan/25 bg-ludo-panel p-8 text-center">
    {loading ? (
      <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-2 border-ludo-cyan border-t-transparent" />
    ) : Icon ? (
      <Icon size={32} className="mx-auto mb-5 text-ludo-cyan" />
    ) : null}
    <h2 className="font-orbitron text-xl font-bold text-white">{title}</h2>
    <p className="mx-auto mt-3 max-w-md font-grotesk leading-relaxed text-white/55">{description}</p>
    {actionHref && actionLabel && (
      <a href={actionHref} className="mt-6 inline-flex border border-ludo-cyan px-5 py-3 font-orbitron text-xs uppercase tracking-widest text-ludo-cyan transition-colors hover:bg-ludo-cyan hover:text-ludo-deep">
        {actionLabel}
      </a>
    )}
  </div>
);
