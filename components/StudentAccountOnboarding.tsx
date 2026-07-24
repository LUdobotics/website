import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RedirectToSignIn,
  SignIn,
  SignUp,
  useAuth,
  useOrganization,
  useOrganizationList,
  useUser,
} from '@clerk/react';
import { AlertTriangle, CheckCircle2, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
import {
  getStudentInvitationState,
  isStudentMembershipRole,
} from './accountLifecycle';
import { odysseyBackendUrl, syncOdysseyProfile } from './odysseyProfile';

const onboardingPath = '/account/student/onboarding';
const invitationPath = '/account/student/invitation';

const appearance = {
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
    formButtonPrimary: 'font-orbitron uppercase tracking-widest text-ludo-deep',
    footerActionText: 'text-white/70',
    footerActionLink: 'text-ludo-cyan',
    formFieldErrorText: 'text-ludo-orange',
  },
};

export const StudentInvitationFlow: React.FC = () => {
  const invitation = getStudentInvitationState(window.location.search);

  if (invitation.kind === 'missing_ticket') {
    return (
      <OnboardingMessage
        tone="warning"
        title="Invitation link required"
        description="Student accounts cannot be created from this page without a valid Clerk organization invitation. Ask your teacher to resend the invitation."
        actionHref="/account/student/sign-in"
        actionLabel="Sign in to an existing account"
      />
    );
  }

  if (invitation.kind === 'invalid_status') {
    return (
      <OnboardingMessage
        tone="warning"
        title="This invitation link is incomplete"
        description="The invitation is missing the Clerk flow status. Ask your teacher to resend it rather than creating a separate account."
      />
    );
  }

  if (invitation.kind === 'complete') {
    return <StudentOnboarding />;
  }

  if (invitation.kind === 'sign_in') {
    return (
      <SignIn
        routing="path"
        path={invitationPath}
        signUpUrl={invitationPath}
        forceRedirectUrl={onboardingPath}
        fallbackRedirectUrl={onboardingPath}
        signUpForceRedirectUrl={onboardingPath}
        signUpFallbackRedirectUrl={onboardingPath}
        appearance={appearance}
      />
    );
  }

  return (
    <SignUp
      routing="path"
      path={invitationPath}
      signInUrl={invitationPath}
      forceRedirectUrl={onboardingPath}
      fallbackRedirectUrl={onboardingPath}
      signInForceRedirectUrl={onboardingPath}
      signInFallbackRedirectUrl={onboardingPath}
      appearance={appearance}
    />
  );
};

type ReadinessState = 'waiting' | 'syncing' | 'ready' | 'error';

export const StudentOnboarding: React.FC = () => {
  const { getToken } = useAuth();
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();
  const {
    isLoaded: isOrganizationLoaded,
    organization,
    membership,
  } = useOrganization();
  const {
    isLoaded: isMembershipsLoaded,
    setActive,
    userMemberships,
  } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const [activationError, setActivationError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [readiness, setReadiness] = useState<ReadinessState>('waiting');
  const [readinessError, setReadinessError] = useState('');

  const studentMemberships = useMemo(
    () => (userMemberships.data ?? []).filter(item => isStudentMembershipRole(item.role)),
    [userMemberships.data],
  );
  const activeStudentMembership = isStudentMembershipRole(membership?.role);

  const activateOrganization = useCallback(async (organizationId: string) => {
    setActivationError('');

    try {
      await setActive({ organization: organizationId });
    } catch (error) {
      setActivationError(error instanceof Error ? error.message : 'The classroom could not be activated.');
    }
  }, [setActive]);

  useEffect(() => {
    if (
      !isMembershipsLoaded
      || !isOrganizationLoaded
      || studentMemberships.length !== 1
      || organization?.id === studentMemberships[0].organization.id
    ) {
      return;
    }

    void activateOrganization(studentMemberships[0].organization.id);
  }, [
    activateOrganization,
    isMembershipsLoaded,
    isOrganizationLoaded,
    organization?.id,
    studentMemberships,
  ]);

  const verifyOdysseyAccess = useCallback(async () => {
    if (!user) return;

    if (!odysseyBackendUrl) {
      setReadiness('error');
      setReadinessError('The Odyssey backend is not configured for this deployment.');
      return;
    }

    setReadiness('syncing');
    setReadinessError('');

    try {
      const refreshedUser = await user.reload();
      await syncOdysseyProfile({ getToken, user: refreshedUser });
      setReadiness('ready');
    } catch (error) {
      setReadiness('error');
      setReadinessError(error instanceof Error ? error.message : 'Odyssey access could not be verified.');
    }
  }, [getToken, user]);

  useEffect(() => {
    if (
      isUserLoaded
      && isOrganizationLoaded
      && isMembershipsLoaded
      && isSignedIn
      && user?.passwordEnabled
      && activeStudentMembership
      && readiness === 'waiting'
    ) {
      void verifyOdysseyAccess();
    }
  }, [
    activeStudentMembership,
    isMembershipsLoaded,
    isOrganizationLoaded,
    isSignedIn,
    isUserLoaded,
    readiness,
    user?.passwordEnabled,
    verifyOdysseyAccess,
  ]);

  if (!isUserLoaded || !isOrganizationLoaded || !isMembershipsLoaded) {
    return <OnboardingLoading label="Checking invitation and classroom access" />;
  }

  if (!isSignedIn || !user) {
    return <RedirectToSignIn redirectUrl={onboardingPath} />;
  }

  if (studentMemberships.length === 0) {
    return (
      <OnboardingMessage
        tone="warning"
        title="Student membership not found"
        description="Your account exists, but the student organization membership is not available yet. Reopen the newest invitation link or ask your teacher to resend it."
        actionHref={window.location.href}
        actionLabel="Check again"
      />
    );
  }

  if (!activeStudentMembership) {
    return (
      <div className="w-full max-w-xl space-y-5 rounded-2xl border border-ludo-cyan/30 bg-ludo-panel p-7">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ludo-cyan">Classroom selection</span>
          <h2 className="mt-3 font-orbitron text-2xl font-bold text-white">Activate your student classroom</h2>
          <p className="mt-3 font-grotesk text-sm leading-relaxed text-white/60">
            The launcher and Odyssey API use your active organization. Choose the classroom attached to this invitation.
          </p>
        </div>
        <div className="space-y-3">
          {studentMemberships.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => void activateOrganization(item.organization.id)}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-4 text-left transition-colors hover:border-ludo-cyan/45 hover:bg-ludo-cyan/5"
            >
              <span className="font-grotesk font-semibold text-white">{item.organization.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ludo-cyan">Activate</span>
            </button>
          ))}
        </div>
        {activationError && <InlineError message={activationError} />}
      </div>
    );
  }

  if (!user.passwordEnabled) {
    const setPassword = async (password: string) => {
      setIsSettingPassword(true);
      setPasswordError('');

      try {
        await user.updatePassword({
          newPassword: password,
          signOutOfOtherSessions: false,
        });
        await user.reload();
      } catch (error) {
        setPasswordError(error instanceof Error ? error.message : 'The password could not be saved.');
      } finally {
        setIsSettingPassword(false);
      }
    };

    return (
      <PasswordSetup
        organizationName={organization?.name ?? 'your classroom'}
        error={passwordError}
        isSaving={isSettingPassword}
        onSubmit={setPassword}
      />
    );
  }

  if (readiness === 'syncing' || readiness === 'waiting') {
    return <OnboardingLoading label="Verifying Odyssey access" />;
  }

  if (readiness === 'error') {
    return (
      <OnboardingMessage
        tone="warning"
        title="Account created, Odyssey setup pending"
        description={readinessError}
        actionLabel="Retry verification"
        onAction={() => void verifyOdysseyAccess()}
      />
    );
  }

  return (
    <div className="w-full max-w-xl rounded-2xl border border-ludo-green/35 bg-ludo-panel p-7">
      <CheckCircle2 size={34} className="text-ludo-green" />
      <span className="mt-5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ludo-green">Account ready</span>
      <h2 className="mt-3 font-orbitron text-2xl font-bold text-white">You can now open The Odyssey</h2>
      <p className="mt-3 font-grotesk text-sm leading-relaxed text-white/60">
        Your student role, active classroom, password, and Odyssey profile have all been verified.
      </p>
      <ul className="mt-6 space-y-3 font-grotesk text-sm text-white/75">
        <ReadinessItem label={`Classroom: ${organization?.name ?? 'active'}`} />
        <ReadinessItem label="Student role confirmed" />
        <ReadinessItem label="Password enabled" />
        <ReadinessItem label="Odyssey profile synchronized" />
      </ul>
      <a
        href="/launcher_download_client"
        className="mt-7 inline-flex items-center justify-center rounded-lg bg-ludo-cyan px-5 py-3 font-orbitron text-xs font-bold uppercase tracking-widest text-ludo-deep transition-colors hover:bg-white"
      >
        Download launcher
      </a>
    </div>
  );
};

const PasswordSetup: React.FC<{
  organizationName: string;
  error: string;
  isSaving: boolean;
  onSubmit: (password: string) => Promise<void>;
}> = ({ organizationName, error, isSaving, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const localError = password.length > 0 && password.length < 8
    ? 'Use at least 8 characters.'
    : confirmation.length > 0 && password !== confirmation
      ? 'The passwords do not match.'
      : '';
  const isValid = password.length >= 8 && password === confirmation;

  return (
    <form
      className="w-full max-w-xl rounded-2xl border border-ludo-cyan/30 bg-ludo-panel p-7"
      onSubmit={(event) => {
        event.preventDefault();
        if (isValid) void onSubmit(password);
      }}
    >
      <KeyRound size={34} className="text-ludo-cyan" />
      <span className="mt-5 block font-mono text-[10px] uppercase tracking-[0.2em] text-ludo-cyan">Launcher credentials</span>
      <h2 className="mt-3 font-orbitron text-2xl font-bold text-white">Create your password</h2>
      <p className="mt-3 font-grotesk text-sm leading-relaxed text-white/60">
        Your invitation to {organizationName} is accepted. This account did not have a password, so create one before using the launcher.
      </p>
      <label className="mt-6 block font-grotesk text-sm text-white/80">
        Password
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white px-4 py-3 text-ludo-deep outline-none focus:border-ludo-cyan"
        />
      </label>
      <label className="mt-4 block font-grotesk text-sm text-white/80">
        Confirm password
        <input
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={event => setConfirmation(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white px-4 py-3 text-ludo-deep outline-none focus:border-ludo-cyan"
        />
      </label>
      {(localError || error) && <div className="mt-4"><InlineError message={localError || error} /></div>}
      <button
        type="submit"
        disabled={!isValid || isSaving}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-ludo-cyan px-5 py-3 font-orbitron text-xs font-bold uppercase tracking-widest text-ludo-deep transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
      >
        {isSaving ? <RefreshCw size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
        {isSaving ? 'Saving password' : 'Save and verify account'}
      </button>
    </form>
  );
};

const ReadinessItem: React.FC<{ label: string }> = ({ label }) => (
  <li className="flex items-center gap-3">
    <CheckCircle2 size={16} className="shrink-0 text-ludo-green" />
    {label}
  </li>
);

const InlineError: React.FC<{ message: string }> = ({ message }) => (
  <div role="alert" className="flex items-start gap-3 rounded-lg border border-ludo-orange/35 bg-ludo-orange/10 p-3 font-grotesk text-sm text-white/75">
    <AlertTriangle size={17} className="mt-0.5 shrink-0 text-ludo-orange" />
    <span>{message}</span>
  </div>
);

const OnboardingLoading: React.FC<{ label: string }> = ({ label }) => (
  <div className="w-full max-w-md rounded-xl border border-ludo-border/40 bg-ludo-panel p-8 text-center">
    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-ludo-cyan border-t-transparent" />
    <p className="font-mono text-xs uppercase tracking-widest text-ludo-cyan">{label}</p>
  </div>
);

const OnboardingMessage: React.FC<{
  title: string;
  description: string;
  tone: 'warning' | 'success';
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, tone, actionHref, actionLabel, onAction }) => {
  const Icon = tone === 'success' ? CheckCircle2 : AlertTriangle;

  return (
    <div className={`w-full max-w-xl rounded-2xl border bg-ludo-panel p-7 ${tone === 'success' ? 'border-ludo-green/35' : 'border-ludo-orange/35'}`}>
      <Icon size={34} className={tone === 'success' ? 'text-ludo-green' : 'text-ludo-orange'} />
      <h2 className="mt-5 font-orbitron text-2xl font-bold text-white">{title}</h2>
      <p className="mt-3 font-grotesk text-sm leading-relaxed text-white/65">{description}</p>
      {actionLabel && (
        actionHref ? (
          <a href={actionHref} className="mt-6 inline-flex border border-ludo-cyan px-5 py-3 font-orbitron text-xs uppercase tracking-widest text-ludo-cyan hover:bg-ludo-cyan hover:text-ludo-deep">
            {actionLabel}
          </a>
        ) : (
          <button type="button" onClick={onAction} className="mt-6 inline-flex items-center gap-2 border border-ludo-cyan px-5 py-3 font-orbitron text-xs uppercase tracking-widest text-ludo-cyan hover:bg-ludo-cyan hover:text-ludo-deep">
            <RefreshCw size={15} /> {actionLabel}
          </button>
        )
      )}
    </div>
  );
};
