import React, { useEffect, useState } from 'react';
import {
  CreateOrganization,
  OrganizationList,
  OrganizationProfile,
  OrganizationSwitcher,
  RedirectToSignIn,
  SignIn,
  SignOutButton,
  SignUp,
  UserProfile,
  useOrganization,
  useUser,
} from '@clerk/react';
import { ArrowLeft } from 'lucide-react';
import { Section } from './ui/Section';
import { TeacherDashboardPage } from './TeacherDashboardPage';

interface AccountPageProps {
  path: string;
  isClerkConfigured: boolean;
}

const launcherDownloadPath = '/launcher_download_client';

export const isAccountPath = (path: string) => path === '/account' || path.startsWith('/account/');
export const isOrganizationPath = (path: string) => path === '/organization' || path.startsWith('/organization/');

const clerkAppearance = {
  variables: {
    colorPrimary: '#00ffff',
    colorBackground: '#020810',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255, 255, 255, 0.82)',
    colorInputBackground: 'rgba(10, 20, 40, 0.85)',
    colorInputText: '#ffffff',
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
    formButtonPrimary: 'font-orbitron uppercase tracking-widest text-ludo-deep',
    footerActionText: 'text-white/70',
    footerActionLink: 'text-ludo-cyan',
    formFieldErrorText: 'text-ludo-orange',
  },
};

const routeLabels: Record<string, string> = {
  '/account': 'Account workflows',
  '/account/sign-up': 'Teacher onboarding',
  '/account/teacher/sign-up': 'Teacher onboarding',
  '/account/teacher/dashboard': 'Classroom intelligence',
  '/account/student/invitation': 'Student invitation',
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
  const isManagementRoute = path.startsWith('/account/manage') || path.startsWith('/organization/manage') || isDashboardRoute;

  return (
    <div className="min-h-screen bg-ludo-deep text-white selection:bg-ludo-cyan selection:text-ludo-deep">
      <Section className="min-h-screen flex items-center relative" noPadding>
        <div className="absolute inset-0 bg-grid-pattern opacity-30 z-0 bg-[length:50px_50px]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ludo-cyan/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ludo-magenta/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 relative z-10 py-16 md:py-24">
          <div className={`${isDashboardRoute ? 'max-w-7xl' : 'max-w-5xl'} mx-auto`}>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-ludo-muted hover:text-ludo-cyan transition-colors font-mono text-xs uppercase tracking-widest mb-10"
            >
              <ArrowLeft size={16} />
              Back to Ludobotics
            </a>

            <div className={isManagementRoute ? 'space-y-10' : 'grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start'}>
              <div className={isManagementRoute ? 'max-w-2xl' : undefined}>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-ludo-cyan/30 rounded-full bg-ludo-cyan/5 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-ludo-green animate-pulse" />
                  <span className="font-mono text-xs text-ludo-cyan tracking-widest uppercase">
                    {isDashboardRoute ? 'Teacher workspace' : 'Hidden account route'}
                  </span>
                </div>

                <h1 className="font-orbitron text-4xl md:text-5xl font-black leading-tight mb-5">
                  {routeLabel}
                </h1>
                <p className="font-grotesk text-lg text-ludo-muted leading-relaxed max-w-xl">
                  {routeDescription}
                </p>

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

  if (path.startsWith('/account/sign-in') || path.startsWith('/account/student/sign-in')) {
    const isStudentSignIn = path.startsWith('/account/student/sign-in');

    return (
      <SignIn
        routing="path"
        path={isStudentSignIn ? '/account/student/sign-in' : '/account/sign-in'}
        signUpUrl={isStudentSignIn ? '/account/student/invitation' : '/account/teacher/sign-up'}
        forceRedirectUrl={isStudentSignIn ? launcherDownloadPath : undefined}
        fallbackRedirectUrl={isStudentSignIn ? launcherDownloadPath : '/account/manage'}
        signUpForceRedirectUrl={isStudentSignIn ? launcherDownloadPath : undefined}
        signUpFallbackRedirectUrl={isStudentSignIn ? launcherDownloadPath : undefined}
        appearance={clerkAppearance}
      />
    );
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
    return (
      <SignUp
        routing="path"
        path="/account/student/invitation"
        signInUrl="/account/student/sign-in"
        forceRedirectUrl={launcherDownloadPath}
        fallbackRedirectUrl={launcherDownloadPath}
        signInForceRedirectUrl={launcherDownloadPath}
        signInFallbackRedirectUrl={launcherDownloadPath}
        appearance={clerkAppearance}
      />
    );
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

const AccountManagement: React.FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { isLoaded: isOrganizationLoaded, organization, membership } = useOrganization();
  const [activeTab, setActiveTab] = useState<AccountManagementTab>('overview');
  const isTeacher = isTeacherMembershipRole(membership?.role);

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
                appearance={clerkAppearance}
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
        <div className="grid gap-5 lg:grid-cols-2">
          {isTeacher && organization && (
            <AccountActionCard
              eyebrow="Classroom intelligence"
              title="Teacher dashboard"
              description="Review live progress, command accuracy, mistakes, and requests for help."
              href="/account/teacher/dashboard"
              action="Open dashboard"
              featured
            />
          )}
          <AccountActionCard
            eyebrow="The Odyssey"
            title="Launcher client"
            description="Download the launcher used to install, update, and enter The Odyssey."
            href={launcherDownloadPath}
            action="Download client"
          />
          <AccountActionCard
            eyebrow="Classroom access"
            title={organization?.name ?? 'Select an organization'}
            description={organization ? 'Manage members, student invitations, roles, and organization settings.' : 'Select or create the organization that will contain your classroom.'}
            onClick={() => setActiveTab('organization')}
            action="Manage classroom"
          />
          <AccountActionCard
            eyebrow="Personal settings"
            title="Profile and security"
            description="Update your identity, email addresses, password, and connected accounts."
            onClick={() => setActiveTab('profile')}
            action="Open profile"
          />
        </div>
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

const AccountActionCard: React.FC<{
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  href?: string;
  onClick?: () => void;
  featured?: boolean;
}> = ({ eyebrow, title, description, action, href, onClick, featured = false }) => {
  const className = `group flex min-h-56 flex-col rounded-2xl border p-6 text-left transition-all ${featured ? 'border-ludo-cyan/40 bg-gradient-to-br from-ludo-cyan/10 to-ludo-blue/5 hover:border-ludo-cyan' : 'border-white/10 bg-ludo-panel hover:border-ludo-cyan/45'}`;
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
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <AccountLoading label="Loading teacher onboarding" />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
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
              appearance={clerkAppearance}
            />
          </div>
        </div>
      </div>
      <OrganizationProfile
        routing="path"
        path="/account/manage"
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
        <h2 className="font-orbitron text-2xl text-white font-bold mt-2">Disconnect account</h2>
        <p className="font-grotesk text-white/75 text-sm mt-1">
          Sign out of this browser and return to the account sign-in page.
        </p>
      </div>
      <SignOutButton redirectUrl="/account/sign-in">
        <button
          type="button"
          className="inline-flex items-center justify-center border border-ludo-orange/70 text-ludo-orange px-5 py-3 font-orbitron text-sm uppercase tracking-widest hover:bg-ludo-orange hover:text-ludo-deep transition-colors"
        >
          Disconnect
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

const OrganizationMemberSummary: React.FC<{ organizationName: string; role?: string | null }> = ({ organizationName, role }) => {
  const isStudent = role === 'org:student' || role === 'student';

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
    return 'Manage your Ludobotics account first, then review your organization access on the same page.';
  }

  if (path.startsWith('/account/teacher') || path === '/account/sign-up') {
    return 'Teachers create a Ludobotics account first, then create an organization for their classroom or training group.';
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

const isTeacherMembershipRole = (role?: string | null) => {
  if (!role) {
    return false;
  }

  return role === 'org:admin_teacher' || role === 'admin_teacher';
};

const formatMembershipRole = (role: string) => {
  if (role === 'org:admin_teacher' || role === 'admin_teacher') {
    return 'Teacher';
  }

  if (role === 'org:student' || role === 'student') {
    return 'Student';
  }

  return role.replace(/^org:/, '');
};
