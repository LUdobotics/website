import React, { useEffect, useRef, useState } from 'react';
import {
  CreateOrganization,
  OrganizationList,
  OrganizationProfile,
  OrganizationSwitcher,
  RedirectToSignIn,
  SignIn,
  SignOutButton,
  SignUp,
  useAuth,
  UserProfile,
  useOrganization,
  useUser,
} from '@clerk/react';
import { AlertTriangle, ArrowLeft, Building2, Check, ChevronRight, Cloud, Download, ExternalLink, GraduationCap, LayoutDashboard, LoaderCircle, MailPlus, Play, RefreshCw, Server, Square } from 'lucide-react';
import { Section } from './ui/Section';
import { TeacherDashboardPage } from './TeacherDashboardPage';
import {
  getOdysseyProfileSignature,
  OdysseyProfileUser,
  syncOdysseyProfile,
} from './odysseyProfile';
import {
  formatMembershipRole,
  isStudentMembershipRole,
  isTeacherMembershipRole,
} from './accountLifecycle';
import { StudentInvitationFlow, StudentOnboarding } from './StudentAccountOnboarding';

interface AccountPageProps {
  path: string;
  isClerkConfigured: boolean;
}

const launcherDownloadPath = '/launcher_download_client';
const studentOnboardingPath = '/account/student/onboarding';

export const isAccountPath = (path: string) => path === '/account' || path.startsWith('/account/');
export const isOrganizationPath = (path: string) => path === '/organization' || path.startsWith('/organization/');

const clerkAppearance = {
  variables: {
    colorPrimary: '#00ffff',
    colorBackground: '#020810',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255, 255, 255, 0.82)',
    colorInputBackground: '#ffffff',
    colorInputText: '#020810',
    borderRadius: '0.75rem',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'mx-auto',
    card: 'bg-ludo-panel border border-ludo-border/40 shadow-[0_0_50px_rgba(0,255,255,0.12)]',
    headerTitle: 'font-orbitron text-white',
    headerSubtitle: 'text-white/80',
    formFieldLabel: 'text-white/90',
    formFieldInput: 'bg-white text-ludo-deep placeholder:text-slate-500',
    navbarButton: 'text-white hover:text-ludo-cyan',
    menuButton: 'text-white hover:text-ludo-cyan',
    formButtonPrimary: 'font-orbitron uppercase tracking-widest text-ludo-deep',
    footerActionText: 'text-white/70',
    footerActionLink: 'text-ludo-cyan',
    formFieldErrorText: 'text-ludo-orange',
  },
};

const organizationSwitcherAppearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    rootBox: 'w-auto',
    organizationSwitcherTrigger: 'w-auto',
  },
};

const routeLabels: Record<string, string> = {
  '/account': 'Account workflows',
  '/account/sign-up': 'Teacher onboarding',
  '/account/teacher/sign-up': 'Teacher onboarding',
  '/account/teacher/dashboard': 'Classroom intelligence',
  '/account/teacher/onboarding': 'Teacher onboarding',
  '/account/student/invitation': 'Student invitation',
  '/account/student/onboarding': 'Student account readiness',
  '/account/student/sign-in': 'Student sign in',
  '/account/sign-in': 'Sign in',
  '/account/manage': 'Manage account',
  '/organization': 'Organizations',
  '/organization/create': 'Create organization',
  '/organization/manage': 'Manage organization',
};

export const AccountPage: React.FC<AccountPageProps> = ({ path, isClerkConfigured }) => {
  const routeLabel = getRouteLabel(path);
  const routeDescription = getRouteDescription(path);
  const isDashboardRoute = path.startsWith('/account/teacher/dashboard');
  const isTeacherOnboardingRoute = path.startsWith('/account/teacher/onboarding');
  const isAccountManagementRoute = path.startsWith('/account/manage');
  const isManagementRoute = path.startsWith('/account/manage') || path.startsWith('/organization/manage') || isDashboardRoute || isTeacherOnboardingRoute;
  const backHref = isAccountManagementRoute ? '/' : '/account/manage';
  const backLabel = isAccountManagementRoute ? 'Back to Ludobotics' : 'Account management';

  return (
    <div className="min-h-screen bg-ludo-deep text-white selection:bg-ludo-cyan selection:text-ludo-deep">
      <Section className="min-h-screen flex items-center relative" noPadding>
        <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0 bg-[length:50px_50px]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ludo-cyan/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ludo-magenta/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 relative z-10 py-16 md:py-24">
          <div className={`${isDashboardRoute ? 'max-w-7xl' : 'max-w-5xl'} mx-auto`}>
            <a
              href={backHref}
              className="inline-flex items-center gap-2 text-ludo-muted hover:text-ludo-cyan transition-colors font-mono text-xs uppercase tracking-widest mb-10"
            >
              <ArrowLeft size={16} />
              {backLabel}
            </a>

            <div className={isManagementRoute ? 'space-y-10' : 'grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start'}>
              <div className={isManagementRoute ? 'max-w-2xl' : undefined}>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-ludo-cyan/30 rounded-full bg-ludo-cyan/5 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-ludo-green animate-pulse" />
                  <span className="font-mono text-xs text-ludo-cyan tracking-widest uppercase">
                    {isDashboardRoute || isTeacherOnboardingRoute ? 'Teacher workspace' : 'Hidden account route'}
                  </span>
                </div>

                <h1 className="font-orbitron text-4xl md:text-5xl font-black leading-tight mb-5">
                  {routeLabel}
                </h1>
                {routeDescription && (
                  <p className="font-grotesk text-lg text-ludo-muted leading-relaxed max-w-xl">
                    {routeDescription}
                  </p>
                )}

              </div>

              <div className="clerk-account-surface min-h-[520px] flex items-start justify-center">
                {isClerkConfigured ? <ClerkAccountSurface path={path} /> : <MissingClerkConfig />}
              </div>
            </div>
          </div>
        </div>
      </Section>
      <ClerkTextOverrides />
    </div>
  );
};

const ClerkAccountSurface: React.FC<{ path: string }> = ({ path }) => {
  if (path === '/account') {
    return <AccountWorkflowLinks />;
  }

  if (path.startsWith('/account/teacher/dashboard')) {
    return <TeacherDashboardPage />;
  }

  if (path.startsWith('/account/teacher/onboarding')) {
    return <TeacherOnboardingPage />;
  }

  if (path.startsWith('/account/sign-in') || path.startsWith('/account/student/sign-in')) {
    const isStudentSignIn = path.startsWith('/account/student/sign-in');

    return (
      <SignIn
        routing="path"
        path={isStudentSignIn ? '/account/student/sign-in' : '/account/sign-in'}
        signUpUrl={isStudentSignIn ? '/account/student/invitation' : '/account/teacher/sign-up'}
        forceRedirectUrl={isStudentSignIn ? studentOnboardingPath : undefined}
        fallbackRedirectUrl={isStudentSignIn ? studentOnboardingPath : '/account/manage'}
        signUpForceRedirectUrl={isStudentSignIn ? studentOnboardingPath : undefined}
        signUpFallbackRedirectUrl={isStudentSignIn ? studentOnboardingPath : undefined}
        appearance={clerkAppearance}
      />
    );
  }

  if (path.startsWith(studentOnboardingPath)) {
    return <StudentOnboarding />;
  }

  if (path.startsWith('/account/manage')) {
    return <AccountManagement />;
  }

  if (path.startsWith('/organization/create')) {
    return <ProtectedOrganizationCreate />;
  }

  if (path.startsWith('/organization/manage')) {
    return <ProtectedOrganizationManage />;
  }

  if (path === '/organization') {
    return <ProtectedOrganizationList />;
  }

  if (path.startsWith('/account/student/invitation')) {
    return <StudentInvitationFlow />;
  }

  return (
    <SignUp
      routing="path"
      path={path.startsWith('/account/teacher/sign-up') ? '/account/teacher/sign-up' : '/account/sign-up'}
      signInUrl="/account/sign-in"
      fallbackRedirectUrl="/organization/create"
      appearance={clerkAppearance}
    />
  );
};

const AccountWorkflowLinks: React.FC = () => (
  <div className="w-full max-w-md bg-ludo-panel border border-ludo-border/40 rounded-xl p-8">
    <h2 className="font-orbitron text-xl font-bold text-white mb-4">Choose a workflow</h2>
    <div className="space-y-4">
      <a
        href="/account/teacher/sign-up"
        className="block border border-ludo-cyan/40 rounded-lg p-4 hover:border-ludo-cyan hover:bg-ludo-cyan/5 transition-colors"
      >
        <span className="block font-orbitron text-sm text-ludo-cyan uppercase tracking-widest mb-2">Teacher</span>
        <span className="block font-grotesk text-white/85">Create your account, then create your classroom organization.</span>
      </a>
      <a
        href="/account/student/invitation"
        className="block border border-ludo-border/50 rounded-lg p-4 hover:border-ludo-cyan hover:bg-ludo-cyan/5 transition-colors"
      >
        <span className="block font-orbitron text-sm text-ludo-cyan uppercase tracking-widest mb-2">Student</span>
        <span className="block font-grotesk text-white/85">Use this only from an invitation link sent by your teacher.</span>
      </a>
    </div>
  </div>
);

type AccountManagementTab = 'overview' | 'profile' | 'organization';

const profileRetryDelays = [5_000, 15_000, 30_000];

const useOdysseyProfileSync = ({
  enabled,
  getToken,
  user,
}: {
  enabled: boolean;
  getToken: () => Promise<string | null>;
  user: OdysseyProfileUser | null | undefined;
}) => {
  const [warning, setWarning] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const lastSyncedSignature = useRef('');
  const attemptedSignature = useRef('');
  const retryAttempt = useRef(0);
  const retryTimer = useRef<number | null>(null);
  const profileSignature = user ? getOdysseyProfileSignature(user) : '';

  useEffect(() => {
    if (!enabled || !user || !profileSignature) return;
    if (lastSyncedSignature.current === profileSignature) return;

    if (attemptedSignature.current !== profileSignature) {
      attemptedSignature.current = profileSignature;
      retryAttempt.current = 0;
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    }

    let cancelled = false;

    // Clerk's embedded profile editor has no save callback. Waiting briefly
    // here means this effect runs only after useUser exposes the new resource.
    const syncTimer = window.setTimeout(async () => {
      setIsSyncing(true);

      try {
        // Clerk's editor owns and awaits setProfileImage. Once useUser reports
        // the change, reload to discard any preview/stale resource and prefer
        // the final UserResource returned by Clerk.
        const refreshedUser = await user.reload();
        if (cancelled) return;

        await syncOdysseyProfile({ getToken, user: refreshedUser });
        if (cancelled) return;

        const refreshedSignature = getOdysseyProfileSignature(refreshedUser);
        lastSyncedSignature.current = refreshedSignature;
        attemptedSignature.current = refreshedSignature;
        retryAttempt.current = 0;
        setWarning('');
      } catch (syncError) {
        if (cancelled) return;

        setWarning(syncError instanceof Error ? syncError.message : 'Profile synchronization failed.');
        const delay = profileRetryDelays[Math.min(retryAttempt.current, profileRetryDelays.length - 1)];
        retryAttempt.current += 1;
        retryTimer.current = window.setTimeout(() => setRetryKey(value => value + 1), delay);
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    }, retryAttempt.current === 0 ? 500 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(syncTimer);
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    };
  }, [enabled, getToken, profileSignature, retryKey]);

  const retry = () => {
    if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    setRetryKey(value => value + 1);
  };

  return { isSyncing, retry, warning };
};

const AccountManagement: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { isLoaded: isOrganizationLoaded, organization, membership } = useOrganization();
  const [activeTab, setActiveTab] = useState<AccountManagementTab>('overview');
  const isTeacher = isTeacherMembershipRole(membership?.role);

  useEffect(() => {
    const syncTabFromHash = () => {
      if (window.location.hash === '#classroom') {
        setActiveTab('organization');
      }
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);
  const profileSync = useOdysseyProfileSync({
    enabled: isLoaded && Boolean(isSignedIn && user),
    getToken,
    user,
  });

  if (!isLoaded || !isOrganizationLoaded) {
    return <AccountLoading label="Loading account" />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const displayName = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? 'Ludobotics account';
  const tabs: Array<{ id: AccountManagementTab; label: string; description: string }> = [
    { id: 'overview', label: 'Overview', description: 'Your essential actions' },
    { id: 'profile', label: 'Personal profile', description: 'Identity and security' },
    { id: 'organization', label: 'Classroom', description: 'Members and invitations' },
  ];

  return (
    <div className="w-full space-y-6">
      {profileSync.warning && (
        <div role="alert" className="flex flex-col gap-4 rounded-xl border border-ludo-orange/35 bg-ludo-orange/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-ludo-orange" />
            <div>
              <strong className="font-grotesk text-sm text-white">Your Clerk profile is safe.</strong>
              <p className="mt-1 font-grotesk text-xs leading-relaxed text-white/60">
                Odyssey has not received the latest profile yet. We will retry automatically; you can also retry now.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={profileSync.retry}
            disabled={profileSync.isSyncing}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-ludo-orange/40 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-ludo-orange transition-colors hover:bg-ludo-orange/10 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw size={14} className={profileSync.isSyncing ? 'animate-spin' : ''} />
            {profileSync.isSyncing ? 'Retrying' : 'Retry now'}
          </button>
        </div>
      )}
      <section className="overflow-hidden rounded-2xl border border-ludo-cyan/25 bg-[#06101d]/95 shadow-[0_0_50px_rgba(0,255,255,0.08)]">
        <div className="border-b border-white/10 bg-gradient-to-r from-ludo-cyan/[0.08] to-ludo-blue/[0.04] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ludo-cyan">Account workspace</span>
              <h2 className="mt-3 font-orbitron text-2xl font-bold text-white">Welcome, {displayName}</h2>
              <p className="mt-2 font-grotesk text-sm text-white/55">
                {organization ? `${organization.name} · ${formatMembershipRole(membership?.role ?? 'member')}` : 'Choose or create an organization to begin.'}
              </p>
            </div>
            {organization && (
              <OrganizationSwitcher
                hidePersonal
                createOrganizationUrl="/organization/create"
                createOrganizationMode="navigation"
                organizationProfileUrl="/account/manage"
                organizationProfileMode="navigation"
                afterSelectOrganizationUrl="/account/manage"
                appearance={organizationSwitcherAppearance}
              />
            )}
          </div>
        </div>

        <nav aria-label="Account sections" className="grid grid-cols-1 gap-2 border-b border-white/10 p-3 sm:grid-cols-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${activeTab === tab.id ? 'border-ludo-cyan/40 bg-ludo-cyan/10' : 'border-transparent hover:border-white/10 hover:bg-white/[0.035]'}`}
            >
              <span className={`block font-orbitron text-xs font-bold ${activeTab === tab.id ? 'text-ludo-cyan' : 'text-white/70'}`}>{tab.label}</span>
              <span className="mt-1 block font-grotesk text-[11px] text-white/40">{tab.description}</span>
            </button>
          ))}
        </nav>
      </section>

      {activeTab === 'overview' && (
        <>
        <CloudPlayPanel />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            {isTeacher && organization && (
              <AccountActionCard
                eyebrow="Classroom intelligence"
                title="Teacher dashboard"
                description="Review live progress, command accuracy, mistakes, and requests for help."
                href="/account/teacher/dashboard"
                action="Open dashboard"
                featured
                className="flex-1"
              />
            )}
            <AccountActionCard
              eyebrow="The Odyssey"
              title="Launcher client"
              description="Download the launcher used to install, update, and enter The Odyssey."
              href={launcherDownloadPath}
              action="Download client"
              className="flex-1"
            />
          </div>
          {isTeacher && <TeacherOnboardingPage compact />}
        </div>
        <div className="mt-5"><SignOutPanel /></div>
        </>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-5">
          <ManagementPanel eyebrow="Personal settings" title="Profile and security">
            <UserProfile routing="hash" appearance={clerkAppearance} />
          </ManagementPanel>
          <SignOutPanel />
        </div>
      )}

      {activeTab === 'organization' && (
        organization ? (
          isTeacher ? (
            <TeacherOrganizationSection organizationName={organization.name} role={membership?.role} />
          ) : (
            <OrganizationMemberSummary organizationName={organization.name} role={membership?.role} />
          )
        ) : (
          <ManagementPanel eyebrow="Classroom" title="Select an organization">
            <OrganizationList
              hidePersonal
              afterCreateOrganizationUrl="/account/manage"
              afterSelectOrganizationUrl="/account/manage"
              appearance={clerkAppearance}
            />
          </ManagementPanel>
        )
      )}
    </div>
  );
};

type TeacherOnboardingCompletion = Record<string, boolean>;

const TeacherOnboardingItem: React.FC<{
  title: string;
  description: string;
  action: string;
  complete: boolean;
  disabled?: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
}> = ({ title, description, action, complete, disabled = false, icon: Icon, onClick }) => (
  <div className={`flex flex-col gap-4 rounded-xl border p-5 transition-colors sm:flex-row sm:items-center sm:justify-between ${complete ? 'border-ludo-green/50 bg-ludo-green/5' : 'border-white/10 bg-ludo-panel'}`}>
    <div className="flex min-w-0 items-start gap-4">
      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${complete ? 'border-ludo-green bg-ludo-green text-ludo-deep' : 'border-ludo-cyan/50 text-ludo-cyan'}`}>
        {complete ? <Check size={18} /> : <Icon size={18} />}
      </div>
      <div>
        <h3 className="font-orbitron text-sm font-bold text-white">{title}</h3>
        <p className="mt-1 font-grotesk text-sm leading-relaxed text-white/55">{description}</p>
      </div>
    </div>
    <button
      type="button"
      disabled={disabled || complete}
      onClick={onClick}
      className="inline-flex shrink-0 items-center justify-center gap-2 border border-ludo-cyan px-4 py-2.5 font-orbitron text-[10px] uppercase tracking-widest text-ludo-cyan transition-colors hover:bg-ludo-cyan hover:text-ludo-deep disabled:cursor-not-allowed disabled:border-white/15 disabled:text-white/35 disabled:hover:bg-transparent disabled:hover:text-white/35"
    >
      {complete ? 'Completed' : action}
      {!complete && <ChevronRight size={14} />}
    </button>
  </div>
);

const TeacherOnboardingPage: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn, orgId, orgRole } = useAuth();
  const { isLoaded: isOrganizationLoaded, organization, invitations, memberships } = useOrganization({
    invitations: { pageSize: 20 },
    memberships: { pageSize: 100 },
  });
  const [access, setAccess] = useState<{
    effective_pool_id?: string | null;
    can_access_cloud?: boolean;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'local' | 'cloud'>('local');
  const [completion, setCompletion] = useState<TeacherOnboardingCompletion>({});
  const [licenceMessage, setLicenceMessage] = useState(false);
  const isTeacher = isTeacherMembershipRole(orgRole);
  const storageKey = `odyssey.teacher-onboarding.${orgId ?? 'none'}`;
  const hasOrganisation = Boolean(orgId && organization);
  const hasPool = Boolean(access?.effective_pool_id);
  const hasCloudAccess = access?.can_access_cloud === true;
  const hasStudentMember = (memberships?.data ?? []).some(item => isStudentMembershipRole(item.role));
  const hasInvitation = hasStudentMember || (invitations?.data ?? []).some(item => item.status !== 'revoked' && item.status !== 'expired');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      setCompletion(JSON.parse(saved) as TeacherOnboardingCompletion);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, JSON.stringify(completion));
  }, [completion, storageKey]);

  useEffect(() => {
    if (hasInvitation) setCompletion(previous => ({ ...previous, invite: true }));
  }, [hasInvitation]);

  useEffect(() => {
    if (!isAuthLoaded || !isOrganizationLoaded || !isSignedIn || !orgId || !backendBaseUrl) return;
    let cancelled = false;
    void getToken().then(async token => {
      if (!token) return;
      const response = await fetch(`${backendBaseUrl}/me/access`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
      if (!response.ok || cancelled) return;
      setAccess(await response.json());
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [getToken, isAuthLoaded, isOrganizationLoaded, isSignedIn, orgId]);

  if (!isAuthLoaded || !isOrganizationLoaded) return <AccountLoading label="Loading teacher onboarding" />;
  if (!isSignedIn) return <RedirectToSignIn />;
  if (!isTeacher) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-ludo-orange/35 bg-ludo-panel p-7">
        <AlertTriangle size={32} className="text-ludo-orange" />
        <h2 className="mt-5 font-orbitron text-2xl font-bold text-white">Teacher access required</h2>
        <p className="mt-3 font-grotesk text-sm leading-relaxed text-white/65">This checklist is available to organisation teachers.</p>
        <a href="/account/manage" className="mt-6 inline-flex border border-ludo-cyan px-5 py-3 font-orbitron text-xs uppercase tracking-widest text-ludo-cyan hover:bg-ludo-cyan hover:text-ludo-deep">Return to account</a>
      </div>
    );
  }

  const markAndOpen = (key: string, href: string) => {
    setCompletion(previous => ({ ...previous, [key]: true }));
    window.location.href = href;
  };
  const openClassroom = () => {
    window.location.hash = 'classroom';
  };
  const completedCount = [hasOrganisation, hasPool, hasInvitation, completion.local, completion.localMonitor, hasCloudAccess && completion.cloud, hasCloudAccess && completion.cloudMonitor].filter(Boolean).length;
  const totalCount = hasCloudAccess ? 7 : 5;
  const compactMonitoringComplete = completion.localMonitor === true || completion.cloudMonitor === true;
  const compactCompletedCount = [hasOrganisation, hasPool, hasInvitation, completion.local, hasCloudAccess && completion.cloud, compactMonitoringComplete].filter(Boolean).length;
  const compactTotalCount = hasCloudAccess ? 6 : 5;

  if (compact) {
    return (
      <section className="flex h-full flex-col rounded-2xl border border-ludo-cyan/30 bg-ludo-panel p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ludo-cyan">Teacher setup</span>
            <h2 className="mt-3 font-orbitron text-xl font-bold text-white">Getting started</h2>
          </div>
          <span className="rounded-lg border border-white/10 px-3 py-2 font-mono text-xs text-white/65">{compactCompletedCount}/{compactTotalCount}</span>
        </div>
        <div className="mt-5 flex flex-1 flex-col justify-between gap-2 space-y-0">
          {[
            { key: 'organisation', label: 'Create organisation', complete: hasOrganisation, disabled: false, action: () => { window.location.href = '/organization/create'; } },
            { key: 'pool', label: 'Get licence pool', complete: hasPool, disabled: !hasOrganisation, action: () => { if (!hasPool) setLicenceMessage(true); } },
            { key: 'invite', label: 'Invite first students', complete: hasInvitation, disabled: !hasOrganisation || !hasPool, action: openClassroom },
            { key: 'monitor', label: 'Monitor your students', complete: compactMonitoringComplete, disabled: !hasOrganisation || !hasPool || !hasInvitation, action: () => {
              setCompletion(previous => ({ ...previous, localMonitor: true, ...(hasCloudAccess ? { cloudMonitor: true } : {}) }));
              window.location.href = '/account/teacher/dashboard';
            } },
          ].map(item => (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled || item.complete}
              onClick={item.action}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-left transition-colors hover:border-ludo-cyan/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${item.complete ? 'border-ludo-green bg-ludo-green text-ludo-deep' : 'border-ludo-cyan/50 text-ludo-cyan'}`}>
                  {item.complete ? <Check size={13} /> : <ChevronRight size={13} />}
                </span>
                <span className="truncate font-grotesk text-sm text-white/80">{item.label}</span>
              </span>
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-white/35">{item.complete ? 'Done' : 'Open'}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 border-t border-white/10 pt-4">
          <span className="font-grotesk text-xs text-white/45">Play setup</span>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button type="button" disabled={!hasOrganisation || !hasPool} onClick={() => markAndOpen('local', launcherDownloadPath)} className="rounded-lg border border-white/10 bg-white/[0.025] p-3 text-left transition-colors hover:border-ludo-cyan/45 disabled:cursor-not-allowed disabled:opacity-45">
              <span className="flex items-center justify-between gap-2 font-orbitron text-[10px] uppercase tracking-widest text-ludo-cyan"><span>Local play</span>{completion.local ? <Check size={13} className="text-ludo-green" /> : <Download size={13} />}</span>
              <span className="mt-2 block font-grotesk text-xs text-white/55">Install the launcher and test the game.</span>
            </button>
            <button type="button" disabled={!hasCloudAccess || !hasOrganisation || !hasPool} onClick={() => markAndOpen('cloud', '/account/manage#cloud-play')} className="rounded-lg border border-white/10 bg-white/[0.025] p-3 text-left transition-colors hover:border-ludo-cyan/45 disabled:cursor-not-allowed disabled:opacity-35">
              <span className={`flex items-center justify-between gap-2 font-orbitron text-[10px] uppercase tracking-widest ${hasCloudAccess ? 'text-ludo-cyan' : 'text-white/30'}`}><span>Cloud play</span>{completion.cloud ? <Check size={13} className="text-ludo-green" /> : <Cloud size={13} />}</span>
              <span className="mt-2 block font-grotesk text-xs text-white/55">{hasCloudAccess ? 'Launch an online session.' : 'Not included in this licence.'}</span>
            </button>
          </div>
        </div>
        {licenceMessage && <div role="alertdialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"><div className="max-w-md rounded-2xl border border-ludo-cyan/40 bg-[#06101d] p-7 shadow-2xl"><h2 className="font-orbitron text-xl font-bold text-white">Licence pool pending</h2><p className="mt-3 font-grotesk text-sm leading-relaxed text-white/70">Please wait for our admins to assign you a licence or contact us at licenses@ludobotics.com.</p><button type="button" onClick={() => setLicenceMessage(false)} className="mt-6 border border-ludo-cyan px-5 py-2.5 font-orbitron text-xs uppercase tracking-widest text-ludo-cyan">Close</button></div></div>}
      </section>
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="rounded-2xl border border-ludo-cyan/25 bg-[#06101d]/95 p-6 shadow-[0_0_50px_rgba(0,255,255,0.08)] md:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ludo-cyan"><GraduationCap size={15} /> Teacher onboarding</span>
            <h2 className="mt-3 font-orbitron text-2xl font-bold text-white md:text-3xl">Set up your Odyssey classroom</h2>
            <p className="mt-2 max-w-2xl font-grotesk text-sm leading-relaxed text-white/55">Complete these steps to prepare your organisation, students, local launcher, cloud play, and classroom monitoring.</p>
          </div>
          <div className="rounded-xl border border-white/10 px-4 py-3 text-right"><span className="font-mono text-[10px] uppercase tracking-widest text-white/45">Progress</span><strong className="mt-1 block font-orbitron text-xl text-white">{completedCount} / {totalCount}</strong></div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-ludo-cyan/25 bg-[#06101d]/95 p-5 md:p-7">
        <h3 className="font-orbitron text-lg font-bold text-white">Next steps to work with the Odyssey</h3>
        <TeacherOnboardingItem title="Create your organisation" description="Create or select the organisation that contains your students and licence pool." action={hasOrganisation ? 'Organisation ready' : 'Open organisations'} complete={hasOrganisation} icon={Building2} onClick={() => { window.location.href = '/organization/create'; }} />
        <TeacherOnboardingItem title="Get your licence pool" description={hasOrganisation ? 'Licence pools are assigned manually for this round.' : 'Create your organisation first.'} action={hasPool ? 'Licence pool ready' : 'Check licence'} complete={hasPool} disabled={!hasOrganisation} icon={Server} onClick={() => { if (hasPool) return; setLicenceMessage(true); }} />
        <TeacherOnboardingItem title="Invite your first students" description="Send your first invitation from the Classroom tab. This step unlocks once the organisation has a pool." action="Open classroom" complete={hasInvitation} disabled={!hasOrganisation || !hasPool} icon={MailPlus} onClick={openClassroom} />
      </section>

      <section className="rounded-2xl border border-ludo-cyan/25 bg-[#06101d]/95 p-5 md:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="font-orbitron text-lg font-bold text-white">Choose your play environment</h3><p className="mt-1 font-grotesk text-sm text-white/55">Complete the setup for the environments included in your licence.</p></div>
          <div className="flex gap-2 rounded-lg border border-white/10 p-1">
            <button type="button" onClick={() => setActiveTab('local')} className={`inline-flex items-center gap-2 px-4 py-2 font-orbitron text-[10px] uppercase tracking-widest ${activeTab === 'local' ? 'bg-ludo-cyan text-ludo-deep' : 'text-white/60'}`}><Download size={14} /> Local</button>
            <button type="button" disabled={!hasCloudAccess} onClick={() => setActiveTab('cloud')} className={`inline-flex items-center gap-2 px-4 py-2 font-orbitron text-[10px] uppercase tracking-widest ${!hasCloudAccess ? 'cursor-not-allowed text-white/20' : activeTab === 'cloud' ? 'bg-ludo-cyan text-ludo-deep' : 'text-white/60'}`}><Cloud size={14} /> Cloud</button>
          </div>
        </div>
        <div className="mt-5 space-y-4">
          {activeTab === 'local' ? <>
            <TeacherOnboardingItem title="Install the launcher and game" description="Open the launcher download page, install The Odyssey, and test the local game." action="Download launcher" complete={completion.local === true} disabled={!hasOrganisation || !hasPool} icon={Download} onClick={() => markAndOpen('local', launcherDownloadPath)} />
            <TeacherOnboardingItem title="Monitor your students" description="Open the teacher dashboard to monitor student progress and activity." action="Open dashboard" complete={completion.localMonitor === true} disabled={!hasOrganisation || !hasPool || !hasInvitation} icon={LayoutDashboard} onClick={() => markAndOpen('localMonitor', '/account/teacher/dashboard')} />
          </> : <>
            <TeacherOnboardingItem title="Test the Odyssey cloud" description="Open the Odyssey online page and launch a cloud session." action="Open cloud play" complete={completion.cloud === true} disabled={!hasOrganisation || !hasPool || !hasInvitation || !hasCloudAccess} icon={ExternalLink} onClick={() => markAndOpen('cloud', '/account/manage#cloud-play')} />
            <TeacherOnboardingItem title="Monitor your students" description="Open the teacher dashboard to monitor students using cloud play." action="Open dashboard" complete={completion.cloudMonitor === true} disabled={!hasOrganisation || !hasPool || !hasInvitation || !hasCloudAccess} icon={LayoutDashboard} onClick={() => markAndOpen('cloudMonitor', '/account/teacher/dashboard')} />
          </>}
          {!hasCloudAccess && <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 font-grotesk text-sm text-white/45">Cloud play is greyed out because this licence does not include cloud access.</p>}
        </div>
      </section>

      {licenceMessage && <div role="alertdialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"><div className="max-w-md rounded-2xl border border-ludo-cyan/40 bg-[#06101d] p-7 shadow-2xl"><h2 className="font-orbitron text-xl font-bold text-white">Licence pool pending</h2><p className="mt-3 font-grotesk text-sm leading-relaxed text-white/70">Please wait for our admins to assign you a licence or contact us at licenses@ludobotics.com.</p><button type="button" onClick={() => setLicenceMessage(false)} className="mt-6 border border-ludo-cyan px-5 py-2.5 font-orbitron text-xs uppercase tracking-widest text-ludo-cyan">Close</button></div></div>}
    </div>
  );
};

const AccountActionCard: React.FC<{
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  href?: string;
  onClick?: () => void;
  featured?: boolean;
  className?: string;
}> = ({ eyebrow, title, description, action, href, onClick, featured = false, className: cardClassName = '' }) => {
  const className = `group flex min-h-56 flex-col rounded-2xl border p-6 text-left transition-all ${featured ? 'border-ludo-cyan/40 bg-gradient-to-br from-ludo-cyan/10 to-ludo-blue/5 hover:border-ludo-cyan' : 'border-white/10 bg-ludo-panel hover:border-ludo-cyan/45'} ${cardClassName}`;
  const content = (
    <>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ludo-cyan">{eyebrow}</span>
      <h3 className="mt-4 font-orbitron text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 flex-1 font-grotesk text-sm leading-relaxed text-white/55">{description}</p>
      <span className="mt-6 font-orbitron text-xs uppercase tracking-widest text-ludo-cyan transition-transform group-hover:translate-x-1">{action} →</span>
    </>
  );
  return href ? <a href={href} className={className}>{content}</a> : <button type="button" onClick={onClick} className={className}>{content}</button>;
};

const ProtectedOrganizationCreate: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <AccountLoading label="Loading teacher onboarding" />;
  }

  if (!isSignedIn || !user) {
    return <RedirectToSignIn />;
  }

  const memberships = user.organizationMemberships;
  const mayCreateOrganization = memberships.length === 0
    || memberships.some(item => isTeacherMembershipRole(item.role));

  if (!mayCreateOrganization) {
    return (
      <div className="w-full max-w-xl rounded-2xl border border-ludo-orange/35 bg-ludo-panel p-7">
        <AlertTriangle size={32} className="text-ludo-orange" />
        <h2 className="mt-5 font-orbitron text-2xl font-bold text-white">Teacher access required</h2>
        <p className="mt-3 font-grotesk text-sm leading-relaxed text-white/65">
          Student-only accounts cannot create classroom organizations. Ask a teacher administrator if your role is incorrect.
        </p>
        <a href="/account/manage" className="mt-6 inline-flex border border-ludo-cyan px-5 py-3 font-orbitron text-xs uppercase tracking-widest text-ludo-cyan hover:bg-ludo-cyan hover:text-ludo-deep">
          Return to account
        </a>
      </div>
    );
  }

  return (
    <CreateOrganization
      routing="path"
      path="/organization/create"
      afterCreateOrganizationUrl="/account/manage"
      skipInvitationScreen
      appearance={clerkAppearance}
    />
  );
};

const ProtectedOrganizationManage: React.FC = () => {
  useEffect(() => {
    window.location.replace('/account/manage');
  }, []);

  return <AccountLoading label="Opening account management" />;
};

const TeacherOrganizationSection: React.FC<{
  organizationName: string;
  role?: string | null;
}> = ({ organizationName, role }) => (
  <div className="w-full space-y-5">
      <div className="bg-ludo-panel border border-ludo-cyan/30 rounded-xl p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-mono text-xs text-ludo-cyan uppercase tracking-widest">Active organization</span>
            <h2 className="font-orbitron text-2xl text-white font-bold mt-2">{organizationName}</h2>
            <p className="font-grotesk text-white/75 text-sm mt-1">Teacher access: organization settings, members, roles, and student invitations.</p>
            {role && (
              <p className="font-mono text-xs text-white/75 mt-3 uppercase tracking-widest">Role: {formatMembershipRole(role)}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
            <a
              href="/account/teacher/dashboard"
              className="inline-flex items-center justify-center border border-ludo-cyan bg-ludo-cyan px-4 py-2.5 font-orbitron text-xs uppercase tracking-widest text-ludo-deep transition-colors hover:bg-transparent hover:text-ludo-cyan"
            >
              Open dashboard
            </a>
            <OrganizationSwitcher
              hidePersonal
              createOrganizationUrl="/organization/create"
              createOrganizationMode="navigation"
              organizationProfileUrl="/account/manage"
              organizationProfileMode="navigation"
              afterSelectOrganizationUrl="/account/manage"
              appearance={organizationSwitcherAppearance}
            />
          </div>
        </div>
      </div>
      <OrganizationProfile
        routing="hash"
        afterLeaveOrganizationUrl="/account/manage"
        appearance={clerkAppearance}
      />
    </div>
);

const ManagementPanel: React.FC<{ eyebrow: string; title: string; children: React.ReactNode }> = ({ eyebrow, title, children }) => (
  <section className="bg-ludo-panel border border-ludo-cyan/30 rounded-xl p-5">
    <div className="mb-5">
      <span className="font-mono text-xs text-ludo-cyan uppercase tracking-widest">{eyebrow}</span>
      <h2 className="font-orbitron text-2xl text-white font-bold mt-2">{title}</h2>
    </div>
    {children}
  </section>
);

const SignOutPanel: React.FC = () => (
  <section className="bg-ludo-panel border border-ludo-border/40 rounded-xl p-5">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <span className="font-mono text-xs text-ludo-cyan uppercase tracking-widest">Session</span>
        <h2 className="font-orbitron text-2xl text-white font-bold mt-2">Log out of account</h2>
        <p className="font-grotesk text-white/75 text-sm mt-1">
          Sign out of this browser and return to the account sign-in page.
        </p>
      </div>
      <SignOutButton redirectUrl="/account/sign-in">
        <button
          type="button"
          className="inline-flex items-center justify-center border border-ludo-orange/70 text-ludo-orange px-5 py-3 font-orbitron text-sm uppercase tracking-widest hover:bg-ludo-orange hover:text-ludo-deep transition-colors"
        >
          Log out
        </button>
      </SignOutButton>
    </div>
  </section>
);

const LauncherDownloadPanel: React.FC = () => (
  <section className="bg-ludo-panel border border-ludo-cyan/30 rounded-xl p-5">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <span className="font-mono text-xs text-ludo-cyan uppercase tracking-widest">Launcher</span>
        <h2 className="font-orbitron text-2xl text-white font-bold mt-2">Download the client</h2>
        <p className="font-grotesk text-white/75 text-sm mt-1">
          Open the launcher download page after your account or invitation is ready.
        </p>
      </div>
      <a
        href={launcherDownloadPath}
        className="inline-flex items-center justify-center border border-ludo-cyan bg-ludo-cyan text-ludo-deep px-5 py-3 font-orbitron text-sm uppercase tracking-widest hover:bg-transparent hover:text-ludo-cyan transition-colors"
      >
        Download client
      </a>
    </div>
  </section>
);

type CloudSessionState =
  | 'requested'
  | 'waiting_for_capacity'
  | 'reserved'
  | 'provisioning'
  | 'ready'
  | 'connecting'
  | 'active'
  | 'termination_requested'
  | 'terminating'
  | 'terminated'
  | 'failed'
  | 'expired';

interface CloudSession {
  public_session_id: string;
  state: CloudSessionState;
  runtime_profile: string;
  queue_position?: number | null;
  requested_at: string;
  updated_at: string;
  expires_at: string;
  failure_code?: string | null;
  safe_failure_message?: string | null;
}

interface CloudAccess {
  can_access_cloud: boolean;
  cloud_access_reason?: string | null;
  cloud_credit?: CloudCreditSnapshot | null;
  license_status?: string | null;
  license_expires_at?: string | null;
  entitlement_expires_at?: string | null;
}

interface CloudCreditSnapshot {
  period_start: string;
  allocated_seconds: number;
  adjustment_seconds: number;
  used_seconds: number;
  remaining_seconds: number;
  total_seconds: number;
  percent_used: number;
  exhausted: boolean;
}

const backendBaseUrl = String(
  import.meta.env.VITE_ODYSSEY_BACKEND_BASE_URL
    ?? import.meta.env.VITE_ODYSSEY_BACKEND_URL
    ?? '',
).replace(/\/$/, '');

const CloudPlayPanel: React.FC = () => {
  const { getToken } = useAuth();
  const [session, setSession] = React.useState<CloudSession | null>(null);
  const [cloudAccess, setCloudAccess] = React.useState<CloudAccess | null>(null);
  const [cloudCredit, setCloudCredit] = React.useState<CloudCreditSnapshot | null>(null);
  const [statusText, setStatusText] = React.useState('Checking cloud access');
  const [isBusy, setIsBusy] = React.useState(false);
  const [isRequestingAccess, setIsRequestingAccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [launchUrl, setLaunchUrl] = React.useState<string | null>(null);
  const [stoppingSessionId, setStoppingSessionId] = React.useState<string | null>(null);
  const launchKeyRef = React.useRef(`website-${randomId()}`);
  const refreshRequestRef = React.useRef(0);
  const sessionRef = React.useRef<CloudSession | null>(null);

  const requestBackend = React.useCallback(
    async (path: string, init: RequestInit = {}) => {
      const token = await getToken();
      if (!token) {
        throw new Error('Sign in to launch Odyssey online.');
      }
      const response = await fetch(`${backendBaseUrl}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
          ...init.headers,
        },
      });
      if (response.status === 404) {
        return null;
      }
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(cloudErrorMessage(response.status, payload));
      }
      return payload;
    },
    [getToken],
  );

  const refreshSession = React.useCallback(async () => {
    const requestId = ++refreshRequestRef.current;
    setError(null);
    try {
      const access = await requestBackend('/me/access');
      if (requestId !== refreshRequestRef.current) return;
      setCloudAccess(access);
      setCloudCredit(access?.cloud_credit ?? null);
      const payload = await requestBackend('/cloud/sessions/current');
      if (requestId !== refreshRequestRef.current) return;
      const nextSession = payload?.session ?? null;
      sessionRef.current = nextSession;
      setSession(nextSession);
      if (!nextSession || ['terminated', 'failed', 'expired'].includes(nextSession.state)) {
        launchKeyRef.current = `website-${randomId()}`;
        setLaunchUrl(null);
      }
      if (!nextSession || ['terminated', 'failed', 'expired'].includes(nextSession.state) || nextSession.public_session_id !== stoppingSessionId) {
        setStoppingSessionId(null);
      }
      setStatusText(nextSession
        ? publicCloudStatus(nextSession)
        : access?.can_access_cloud === true
          ? 'No active cloud session'
          : cloudAccessStatus(access?.cloud_access_reason));
    } catch (err) {
      if (requestId !== refreshRequestRef.current) return;
      const currentSession = sessionRef.current;
      if (currentSession && ['ready', 'active'].includes(currentSession.state)) {
        setError(null);
        setStatusText(publicCloudStatus(currentSession));
        return;
      }
      setError(err instanceof Error ? err.message : 'Cloud session status is unavailable.');
      setStatusText('Cloud session status unavailable');
    }
  }, [requestBackend, stoppingSessionId]);

  React.useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  React.useEffect(() => {
    if (!session || ['failed', 'terminated', 'expired'].includes(session.state)) {
      return undefined;
    }
    if (['ready', 'active'].includes(session.state) && stoppingSessionId !== session.public_session_id) {
      return undefined;
    }
    const timer = window.setInterval(() => {
      void refreshSession();
    }, 2500);
    return () => window.clearInterval(timer);
  }, [refreshSession, session, stoppingSessionId]);

  const launch = async () => {
    refreshRequestRef.current += 1;
    setIsBusy(true);
    setError(null);
    try {
      const payload = await requestBackend('/cloud/sessions', {
        method: 'POST',
        headers: { 'Idempotency-Key': launchKeyRef.current },
        body: JSON.stringify({ runtime_profile: 'cloud' }),
      });
      const nextSession = payload.session as CloudSession;
      sessionRef.current = nextSession;
      setSession(nextSession);
      setLaunchUrl(null);
      setStatusText(publicCloudStatus(nextSession));
    } catch (err) {
      launchWindowRef.current?.close();
      launchWindowRef.current = null;
      setError(err instanceof Error ? err.message : 'Odyssey cloud launch failed.');
    } finally {
      setIsBusy(false);
    }
  };

  const openLaunchUrl = async (targetSession: CloudSession = session as CloudSession) => {
    if (!targetSession) {
      return;
    }
    setIsBusy(true);
    setError(null);
    try {
      const payload = await requestBackend(`/cloud/sessions/${targetSession.public_session_id}/launch-ticket`, {
        method: 'POST',
      });
      const launchUrl = payload.launch_url as string;
      if (!launchUrl || (!launchUrl.startsWith('/cloud/session/') && !launchUrl.startsWith('http'))) {
        throw new Error('Cloud launch URL was not issued.');
      }
      setLaunchUrl(launchUrl.startsWith('http') ? launchUrl : `${backendBaseUrl}${launchUrl}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cloud session is not ready yet.');
      await refreshSession();
    } finally {
      setIsBusy(false);
    }
  };

  const terminate = async () => {
    if (!session) {
      return;
    }
    setIsBusy(true);
    setError(null);
    setStoppingSessionId(session.public_session_id);
    setSession({ ...session, state: 'termination_requested' });
    setStatusText('Stopping your Odyssey cloud session.');
    try {
      const payload = await requestBackend(`/cloud/sessions/${session.public_session_id}/terminate`, {
        method: 'POST',
      });
      const nextSession = payload.session as CloudSession;
      sessionRef.current = nextSession;
      setSession(nextSession);
      setStatusText(publicCloudStatus(nextSession));
      if (['terminated', 'failed', 'expired'].includes(nextSession.state)) {
        setStoppingSessionId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cloud session termination failed.');
      setStoppingSessionId(null);
      await refreshSession();
    } finally {
      setIsBusy(false);
    }
  };

  const requestCloudAccess = async () => {
    setIsRequestingAccess(true);
    setError(null);
    try {
      const access = await requestBackend('/cloud/sessions/access/request', { method: 'POST' });
      setCloudAccess(access);
      setCloudCredit(access?.cloud_credit ?? null);
      setStatusText(access?.can_access_cloud ? 'Cloud access granted. You can start an online session.' : cloudAccessStatus(access?.cloud_access_reason));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cloud access could not be granted.');
    } finally {
      setIsRequestingAccess(false);
    }
  };

  const canRequestCloudAccess = cloudAccess?.can_access_cloud !== true
    && (
      cloudAccess?.cloud_access_request_available === true
      || (
        cloudAccess?.organisation_has_cloud_pool === true
        && (cloudAccess?.cloud_available_seats ?? 0) > 0
      )
    );

  const isStopping = Boolean(
    session
    && (
      ['termination_requested', 'terminating'].includes(session.state)
      || stoppingSessionId === session.public_session_id
    ),
  );

  const canOpen = Boolean(session && (session.state === 'ready' || session.state === 'active') && !isStopping);
  const canTerminate = Boolean(session && !isStopping && !['terminated', 'failed', 'expired'].includes(session.state));
  const isPending = Boolean(session && ['requested', 'waiting_for_capacity', 'reserved', 'provisioning'].includes(session.state));
  const isLaunchBlocked = isBusy || isPending || isStopping || cloudAccess?.can_access_cloud !== true;
  const licenseExpiry = cloudAccess?.license_expires_at ?? cloudAccess?.entitlement_expires_at ?? null;
  const licenseStatus = cloudAccess?.license_status ?? null;
  const formattedExpiry = licenseExpiry ? formatLicenseDate(licenseExpiry) : null;

  return (
    <section id="cloud-play" className="bg-ludo-panel border border-ludo-cyan/30 rounded-xl p-5" aria-live="polite">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="font-mono text-xs text-ludo-cyan uppercase tracking-widest">Cloud play</span>
          <h2 className="font-orbitron text-2xl text-white font-bold mt-2">Launch Odyssey online</h2>
          <p className="font-grotesk text-white/75 text-sm mt-1">{statusText}</p>
          {cloudAccess && (licenseStatus || formattedExpiry) && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-grotesk text-xs text-white/60" aria-label="Licence status">
              {licenseStatus && <span>Licence: <strong className={licenseStatus === 'expired' ? 'text-ludo-orange' : 'text-white/85'}>{formatLicenseStatus(licenseStatus)}</strong></span>}
              {formattedExpiry && <span>{licenseStatus === 'expired' ? 'Expired on' : 'Expires on'} <strong className="text-white/85">{formattedExpiry}</strong></span>}
              {!formattedExpiry && licenseStatus !== 'expired' && <span>No expiry date</span>}
            </div>
          )}
          {cloudCredit && (
            <div className="mt-4 max-w-xl" aria-label="Monthly cloud credit usage">
              <div className="flex justify-between font-mono text-xs text-white/65 mb-2">
                <span>Monthly cloud credit</span>
                <span>{formatCreditDuration(cloudCredit.remaining_seconds)} remaining</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all ${cloudCredit.percent_used >= 90 ? 'bg-ludo-orange' : 'bg-ludo-cyan'}`}
                  style={{ width: `${Math.min(100, Math.max(0, cloudCredit.percent_used))}%` }}
                />
              </div>
              {cloudCredit.exhausted ? (
                <p className="font-grotesk text-ludo-orange text-xs mt-2">Your monthly cloud credit is used. Cloud play returns next month or after an administrator reset.</p>
              ) : cloudCredit.remaining_seconds <= 15 * 60 ? (
                <p className="font-grotesk text-ludo-orange text-xs mt-2">Your cloud session will stop when the remaining credit is used.</p>
              ) : null}
            </div>
          )}
          {error && <p className="font-grotesk text-ludo-orange text-sm mt-3">{error}</p>}
          {session?.public_session_id && (
            <p className="font-mono text-xs text-white/60 mt-3">Session {session.public_session_id}</p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {cloudAccess?.can_access_cloud !== true && !session && canRequestCloudAccess ? (
            <button
              type="button"
              onClick={() => void requestCloudAccess()}
              disabled={isBusy || isRequestingAccess}
              className="inline-flex items-center justify-center gap-2 border border-ludo-cyan bg-ludo-cyan text-ludo-deep px-5 py-3 font-orbitron text-sm uppercase tracking-widest hover:bg-transparent hover:text-ludo-cyan transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Ask for cloud access"
            >
              {isRequestingAccess ? 'Requesting access…' : 'Ask to access online'}
            </button>
          ) : cloudAccess?.can_access_cloud !== true && !session ? (
            <div className="border border-white/20 text-white/70 px-5 py-3 font-orbitron text-sm uppercase tracking-widest" role="status">
              Cloud play unavailable
            </div>
          ) : canOpen && launchUrl ? (
            <a
              href={launchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-ludo-cyan bg-ludo-cyan text-ludo-deep px-5 py-3 font-orbitron text-sm uppercase tracking-widest hover:bg-transparent hover:text-ludo-cyan transition-colors"
              aria-label="Open Odyssey cloud session"
            >
              <Play size={16} /> Open session
            </a>
          ) : canOpen ? (
            <button
              type="button"
              onClick={() => void openLaunchUrl()}
              disabled={isBusy}
              className="inline-flex items-center justify-center gap-2 border border-ludo-cyan bg-ludo-cyan text-ludo-deep px-5 py-3 font-orbitron text-sm uppercase tracking-widest hover:bg-transparent hover:text-ludo-cyan transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Open Odyssey cloud session"
            >
              <Play size={16} /> Open session
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void launch()}
              disabled={isLaunchBlocked}
              className="inline-flex items-center justify-center gap-2 border border-ludo-cyan bg-ludo-cyan text-ludo-deep px-5 py-3 font-orbitron text-sm uppercase tracking-widest hover:bg-transparent hover:text-ludo-cyan transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Start Odyssey cloud session"
            >
              {isStopping || isPending ? (
                <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Play size={16} aria-hidden="true" />
              )}
              <span>{isStopping ? 'Stopping' : isPending ? 'Starting' : 'Play online'}</span>
            </button>
          )}
          {canTerminate && (
            <button
              type="button"
              onClick={() => void terminate()}
              disabled={isBusy}
              className="inline-flex items-center justify-center gap-2 border border-ludo-orange/70 text-ludo-orange px-5 py-3 font-orbitron text-sm uppercase tracking-widest hover:bg-ludo-orange hover:text-ludo-deep transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Terminate Odyssey cloud session"
            >
              <Square size={16} /> Stop
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

const randomId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const publicCloudStatus = (session: CloudSession) => {
  if (session.state === 'requested' || session.state === 'waiting_for_capacity') {
    if (session.queue_position && session.queue_position > 0) {
      return `Waiting for a cloud runtime slot. You are ${session.queue_position}${ordinalSuffix(session.queue_position)} in the queue.`;
    }
    return 'Waiting for a cloud runtime slot.';
  }
  if (session.state === 'reserved' || session.state === 'provisioning') {
    return 'Preparing the Odyssey cloud runtime.';
  }
  if (session.state === 'ready') {
    return 'Your Odyssey cloud session is ready.';
  }
  if (session.state === 'connecting' || session.state === 'active') {
    return 'Your Odyssey cloud session is active.';
  }
  if (session.state === 'termination_requested' || session.state === 'terminating') {
    return 'Stopping your Odyssey cloud session.';
  }
  if (session.state === 'failed') {
    return session.safe_failure_message ?? 'The cloud session failed.';
  }
  return 'No active cloud session';
};

const ordinalSuffix = (position: number) => {
  const mod100 = position % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';
  switch (position % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const formatCreditDuration = (seconds: number) => {
  const minutes = Math.max(0, Math.ceil(seconds / 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) return `${hours}h ${remainingMinutes}m`;
  return `${remainingMinutes}m`;
};

const cloudErrorMessage = (statusCode: number, payload: unknown) => {
  if (statusCode === 401) {
    return 'Sign in to launch Odyssey online.';
  }
  if (statusCode === 403) {
    return 'Cloud play is not available for this account yet.';
  }
  if (statusCode === 409) {
    const reason = typeof payload === 'object' && payload && 'detail' in payload && typeof (payload as { detail?: unknown }).detail === 'object' && (payload as { detail?: { reason?: unknown } }).detail?.reason;
    if (reason === 'cloud_seat_unavailable') return 'No cloud licence seat is available. Please contact your teacher.';
    return 'Cloud session is still preparing. Try opening it again in a moment.';
  }
  if (statusCode === 429) {
    return 'Too many launch attempts. Wait a moment and try again.';
  }
  const detail = typeof payload === 'object' && payload && 'detail' in payload ? (payload as { detail?: unknown }).detail : null;
  return typeof detail === 'string' ? detail : 'Odyssey cloud is temporarily unavailable.';
};

const formatLicenseDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  }).format(date);
};

const formatLicenseStatus = (status: string) => {
  if (status === 'active') return 'Active';
  if (status === 'expired') return 'Expired';
  if (status === 'scheduled') return 'Scheduled';
  if (status === 'archived') return 'Archived';
  return status.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
};

export const cloudAccessStatus = (reason?: string | null) => {
  if (reason === 'no_active_organisation') return 'Select an organisation to use cloud play.';
  if (reason === 'cloud_credit_exhausted') return 'Your monthly cloud credit has been used.';
  if (reason === 'cloud_entitlement_expired') return 'Cloud play is unavailable because your entitlement has expired.';
  if (reason === 'cloud_entitlement_revoked') return 'Cloud play is unavailable because your entitlement was revoked.';
  if (reason === 'cloud_entitlement_missing' || reason === 'no_subscription') return 'Please contact your teacher to get a cloud licence.';
  return 'Cloud play is not included with this account.';
};

const OrganizationMemberSummary: React.FC<{ organizationName: string; role?: string | null }> = ({ organizationName, role }) => {
  const isStudent = isStudentMembershipRole(role);

  return (
  <div className="w-full bg-ludo-panel border border-ludo-cyan/30 rounded-xl p-8">
    <span className="font-mono text-xs text-ludo-cyan uppercase tracking-widest">Your organization</span>
    <h2 className="font-orbitron text-3xl text-white font-bold mt-3">{organizationName}</h2>
    <p className="font-grotesk text-white/75 leading-relaxed mt-4">
      {isStudent
        ? 'You are signed in as a student member of this organization. Organization settings and invitations are managed by your teacher.'
        : 'You are signed in to this organization, but this membership is not using the teacher role. Organization management requires org:admin_teacher.'}
    </p>
    {role && (
      <div className="mt-6 inline-flex border border-ludo-border/50 rounded-lg px-3 py-2 font-mono text-xs text-white/80">
        Role: {formatMembershipRole(role)} ({role})
      </div>
    )}
  </div>
  );
};

const ProtectedOrganizationList: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <AccountLoading label="Loading organizations" />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <OrganizationList
      hidePersonal
      afterCreateOrganizationUrl="/account/manage"
      afterSelectOrganizationUrl="/account/manage"
      appearance={clerkAppearance}
    />
  );
};

const AccountLoading: React.FC<{ label: string }> = ({ label }) => (
  <div className="w-full max-w-md bg-ludo-panel border border-ludo-border/40 rounded-xl p-8 text-center">
    <div className="mx-auto w-8 h-8 border-2 border-ludo-cyan border-t-transparent rounded-full animate-spin mb-4" />
    <p className="font-mono text-xs text-ludo-cyan uppercase tracking-widest">{label}</p>
  </div>
);

const MissingClerkConfig: React.FC = () => (
  <div className="w-full max-w-md bg-ludo-panel border border-ludo-orange/40 rounded-xl p-8">
    <h2 className="font-orbitron text-xl font-bold text-white mb-4">Clerk is not configured</h2>
    <p className="font-grotesk text-ludo-muted leading-relaxed mb-5">
      Add your Clerk publishable key to the Vite environment before using this page locally or in production.
    </p>
    <div className="bg-ludo-deep/70 border border-ludo-border/30 rounded-lg px-4 py-3 font-mono text-sm text-ludo-cyan overflow-x-auto">
      VITE_CLERK_PUBLISHABLE_KEY=pk_...
    </div>
  </div>
);

const ClerkTextOverrides: React.FC = () => (
  <style>{`
    .clerk-account-surface [class^="cl-"],
    .clerk-account-surface [class*=" cl-"] {
      --clerk-color-text: #ffffff;
      --clerk-color-text-secondary: rgba(255, 255, 255, 0.84);
      --clerk-color-neutral: rgba(255, 255, 255, 0.84);
    }

    .clerk-account-surface p,
    .clerk-account-surface span,
    .clerk-account-surface h1,
    .clerk-account-surface h2,
    .clerk-account-surface h3,
    .clerk-account-surface label,
    .clerk-account-surface small,
    .clerk-account-surface dd,
    .clerk-account-surface dt {
      color: rgba(255, 255, 255, 0.88) !important;
    }

    .clerk-account-surface input:not([autocomplete="one-time-code"]):not([inputmode="numeric"]),
    .clerk-account-surface input:not([autocomplete="one-time-code"]):not([inputmode="numeric"])::placeholder {
      color: #020810 !important;
    }

    .cl-formFieldInput:not([autocomplete="one-time-code"]):not([inputmode="numeric"]),
    .cl-formFieldInput:not([autocomplete="one-time-code"]):not([inputmode="numeric"]):focus {
      background: #ffffff !important;
      color: #020810 !important;
      -webkit-text-fill-color: #020810 !important;
    }

    .cl-formFieldInput:not([autocomplete="one-time-code"]):not([inputmode="numeric"])::placeholder {
      color: #64748b !important;
      -webkit-text-fill-color: #64748b !important;
      opacity: 1 !important;
    }

    .clerk-account-surface [class*="formFieldInput"]:not([autocomplete="one-time-code"]),
    .clerk-account-surface [class*="formFieldInput"]:not([autocomplete="one-time-code"]) *,
    .clerk-account-surface [class*="tagInput"],
    .clerk-account-surface [class*="tagInput"] *,
    .clerk-account-surface [class*="TagInput"],
    .clerk-account-surface [class*="TagInput"] * {
      color: #020810 !important;
      -webkit-text-fill-color: #020810 !important;
    }

    .clerk-account-surface input[autocomplete="one-time-code"],
    .clerk-account-surface input[inputmode="numeric"] {
      color: transparent !important;
      caret-color: transparent !important;
      text-align: center !important;
      font-weight: 700 !important;
      letter-spacing: 0 !important;
      text-shadow: none !important;
      -webkit-text-fill-color: transparent !important;
    }

    .clerk-account-surface .cl-otpCodeFieldInput,
    .clerk-account-surface .cl-verificationCodeFieldInput {
      color: #ffffff !important;
      caret-color: transparent !important;
      -webkit-text-fill-color: #ffffff !important;
      text-align: center !important;
      text-shadow: none !important;
    }

    .clerk-account-surface .cl-headerTitle,
    .clerk-account-surface .cl-headerSubtitle,
    .clerk-account-surface .cl-formFieldLabel,
    .clerk-account-surface .cl-footerActionText,
    .clerk-account-surface .cl-dividerText,
    .clerk-account-surface .cl-formFieldHintText,
    .clerk-account-surface .cl-identityPreviewText,
    .clerk-account-surface .cl-verificationLinkStatusText,
    .clerk-account-surface .cl-alertText,
    .clerk-account-surface .cl-userPreviewTextContainer,
    .clerk-account-surface .cl-profileSectionTitleText,
    .clerk-account-surface .cl-profileSectionContent,
    .clerk-account-surface .cl-profileSectionItem,
    .clerk-account-surface .cl-profileSectionPrimaryButton,
    .clerk-account-surface .cl-profileSectionItemList,
    .clerk-account-surface .cl-profileSectionItemListLabel,
    .clerk-account-surface .cl-profileSectionItemListValue,
    .clerk-account-surface .cl-profilePage,
    .clerk-account-surface .cl-page,
    .clerk-account-surface .cl-pageTitle,
    .clerk-account-surface .cl-pageSubtitle,
    .clerk-account-surface .cl-description,
    .clerk-account-surface .cl-userPreviewText,
    .clerk-account-surface .cl-userPreviewSecondaryIdentifier,
    .clerk-account-surface .cl-badge,
    .clerk-account-surface .cl-navbarButton,
    .clerk-account-surface .cl-menuButton {
      color: rgba(255, 255, 255, 0.9) !important;
    }

    .clerk-account-surface .cl-headerTitle,
    .clerk-account-surface .cl-pageTitle,
    .clerk-account-surface .cl-profilePage .cl-headerTitle,
    .clerk-account-surface .cl-profileSectionTitleText {
      color: #ffffff !important;
    }

    .clerk-account-surface .cl-navbarButton,
    .clerk-account-surface .cl-navbarButton *,
    .clerk-account-surface .cl-menuButton,
    .clerk-account-surface .cl-menuButton * {
      color: rgba(255, 255, 255, 0.92) !important;
      -webkit-text-fill-color: rgba(255, 255, 255, 0.92) !important;
    }

    .clerk-account-surface .cl-navbarButton:hover,
    .clerk-account-surface .cl-navbarButton:hover *,
    .clerk-account-surface .cl-menuButton:hover,
    .clerk-account-surface .cl-menuButton:hover * {
      color: #00ffff !important;
      -webkit-text-fill-color: #00ffff !important;
    }

    .cl-organizationSwitcherPopoverCard,
    .cl-organizationSwitcherPopoverCard p,
    .cl-organizationSwitcherPopoverCard span,
    .cl-organizationSwitcherPopoverCard button,
    .cl-organizationSwitcherPopoverCard [class*="Identifier"],
    .cl-organizationSwitcherPopoverCard [class*="ButtonText"] {
      color: rgba(255, 255, 255, 0.92) !important;
      -webkit-text-fill-color: rgba(255, 255, 255, 0.92) !important;
    }

    .cl-organizationSwitcherPopoverCard button:hover,
    .cl-organizationSwitcherPopoverCard button:hover * {
      color: #00ffff !important;
      -webkit-text-fill-color: #00ffff !important;
    }

    .clerk-account-surface .cl-footerActionLink,
    .clerk-account-surface .cl-formResendCodeLink,
    .clerk-account-surface .cl-breadcrumbsItem,
    .clerk-account-surface .cl-navbarButton:hover,
    .clerk-account-surface .cl-profileSectionPrimaryButton,
    .clerk-account-surface .cl-profileSectionItem__emailAddresses .cl-profileSectionPrimaryButton,
    .clerk-account-surface button[class*="cl-profileSection"] {
      color: #00ffff !important;
    }

    .clerk-account-surface svg {
      color: currentColor !important;
      opacity: 1 !important;
    }
  `}</style>
);

const getRouteLabel = (path: string) => {
  const matchingRoute = Object.keys(routeLabels)
    .sort((a, b) => b.length - a.length)
    .find((route) => path === route || path.startsWith(`${route}/`));

  return routeLabels[matchingRoute ?? '/account'];
};

const getRouteDescription = (path: string) => {
  if (path.startsWith('/account/teacher/dashboard')) {
    return 'Live progress, command accuracy, mistakes, and help signals from students in your active organization.';
  }

  if (path.startsWith('/account/manage')) {
    return '';
  }

  if (path.startsWith('/account/teacher/sign-up') || path === '/account/sign-up') {
    return 'This page is for teachers creating an account for a new organization. If your organization already has an account, please request an invitation from its administrator.';
  }

  if (path.startsWith('/account/student')) {
    return 'Students should only arrive here through an invitation sent by a teacher from the organization interface.';
  }

  if (path.startsWith('/organization/create')) {
    return 'Create the organization that will hold your students, roles, and invitations.';
  }

  if (path.startsWith('/organization/manage')) {
    return 'Manage your Ludobotics account and organization access from one page.';
  }

  if (path === '/organization') {
    return 'Select an existing organization or create one if you are onboarding as a teacher.';
  }

  return 'Account creation, organization management, and student invitation flows are powered by Clerk.';
};
